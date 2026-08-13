-- 安安遊戲雲端存檔：資料表 + RPC
-- 位置：Supabase 宿霧專案 wfeajrchjrtyatvzspnx（與宿霧庫存系統共用）
--
-- 安全設計：
--   game_saves 開 RLS 且「不建任何 policy」，因此前端拿 publishable key 也讀不到表，
--   只能呼叫下面幾支 SECURITY DEFINER 函式，且每支都要帶對存檔碼（128-bit 隨機值）。
--   存檔碼本身不落地，資料庫只存 sha256(code)。
--
-- PIN（選用）：保護「讀取」而非「寫入」——要花掉別人的金幣，得先把存檔載到自己裝置，
--   鎖住讀取即可阻止。好處是自動存檔不必把 PIN 留在裝置上。
--   hash 為 sha256(pin || code)，用存檔碼當 salt，故同一組 PIN 在不同帳號 hash 不同。
--
-- ⚠️ 4 位數 PIN 只有一萬組，故必須有失敗鎖定：連錯 5 次鎖 15 分鐘。
--   實作雷區：**驗證失敗時絕對不能用 RAISE EXCEPTION 回報**，因為 PostgreSQL 會連帶
--   回滾同一交易內的 fail_count 遞增，計數器永遠是 0、鎖定形同虛設（2026-08-13 實測踩到）。
--   因此失敗一律「回傳值」表示，不丟例外。load_game 失敗回 null，
--   set_game_pin 回 {ok:false}，前端再呼叫 game_pin_status 取得原因與剩餘次數。
--   同理 set_game_pin 也要吃同一組鎖，否則可改用它來暴力猜 PIN、繞過 load_game 的計數。

-- ── 資料表 ────────────────────────────────────────────────────────────────
create table if not exists game_saves (
  key_hash   text primary key,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table game_saves enable row level security;  -- 不建 policy＝前端直連完全讀不到

alter table game_saves add column if not exists pin_hash     text;
alter table game_saves add column if not exists fail_count   int not null default 0;
alter table game_saves add column if not exists locked_until timestamptz;

-- ── 寫入：只要有存檔碼即可（自動存檔每 3 秒呼叫，故不要求 PIN）────────────
create or replace function public.save_game(p_code text, p_data jsonb)
returns void language sql security definer set search_path to 'public' as $$
  insert into game_saves(key_hash, data, updated_at)
  values (encode(sha256(convert_to(p_code,'UTF8')),'hex'), p_data, now())
  on conflict (key_hash) do update set data = excluded.data, updated_at = now();
$$;

-- ── 讀取：若該存檔設了 PIN 就必須帶對，含失敗鎖定 ──────────────────────────
-- 回傳 null 代表「讀不到」（找不到碼／PIN 錯／已鎖定），原因請問 game_pin_status。
-- 注意：舊簽章是 load_game(p_code text)，必須先 drop，否則新增預設參數會造成
--       PostgREST 呼叫時 function is not unique。
drop function if exists public.load_game(text);

create or replace function public.load_game(p_code text, p_pin text default null)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare
  h   text := encode(sha256(convert_to(p_code,'UTF8')),'hex');
  rec game_saves;
begin
  select * into rec from game_saves where key_hash = h;
  if not found then return null; end if;
  if rec.pin_hash is null then return rec.data; end if;   -- 未設 PIN：維持舊行為
  if rec.locked_until is not null and rec.locked_until > now() then return null; end if;

  if rec.pin_hash = encode(sha256(convert_to(coalesce(p_pin,'') || p_code,'UTF8')),'hex') then
    update game_saves set fail_count = 0, locked_until = null where key_hash = h;
    return rec.data;
  end if;

  update game_saves
     set fail_count   = fail_count + 1,
         locked_until = case when fail_count + 1 >= 5 then now() + interval '15 minutes' end
   where key_hash = h;
  return null;   -- 不 raise，否則上面的 fail_count 會被一併回滾
end $$;

-- ── 設定／變更／清除 PIN ──────────────────────────────────────────────────
-- 已有 PIN 時必須帶對舊 PIN，且與 load_game 共用同一組失敗鎖定。
-- p_new_pin 傳空字串＝清除 PIN。回傳 {"ok":true} 或 {"ok":false,"error":...}。
-- 尚未設 PIN 時任何持碼者都能設（bootstrap 必然如此），故建議首次登入就設起來。
-- （初版是 returns void，改回傳型別必須先 drop）
drop function if exists public.set_game_pin(text, text, text);

create or replace function public.set_game_pin(p_code text, p_new_pin text, p_old_pin text default null)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare
  h   text := encode(sha256(convert_to(p_code,'UTF8')),'hex');
  rec game_saves;
begin
  select * into rec from game_saves where key_hash = h;
  if not found then return jsonb_build_object('ok', false, 'error', 'NO_DATA'); end if;

  if rec.pin_hash is not null then
    if rec.locked_until is not null and rec.locked_until > now() then
      return jsonb_build_object('ok', false, 'error', 'LOCKED');
    end if;
    if rec.pin_hash <> encode(sha256(convert_to(coalesce(p_old_pin,'') || p_code,'UTF8')),'hex') then
      update game_saves
         set fail_count   = fail_count + 1,
             locked_until = case when fail_count + 1 >= 5 then now() + interval '15 minutes' end
       where key_hash = h;
      return jsonb_build_object('ok', false, 'error', 'BAD_PIN');
    end if;
  end if;

  update game_saves
     set pin_hash = case when coalesce(p_new_pin,'') = '' then null
                         else encode(sha256(convert_to(p_new_pin || p_code,'UTF8')),'hex') end,
         fail_count = 0, locked_until = null
   where key_hash = h;
  return jsonb_build_object('ok', true);
end $$;

-- ── 存檔狀態：登入前決定要不要問 PIN，失敗後說明原因與剩餘次數 ─────────────
drop function if exists public.game_has_pin(text);

create or replace function public.game_pin_status(p_code text)
returns jsonb language sql security definer set search_path to 'public' as $$
  select coalesce(
    (select jsonb_build_object(
        'exists',     true,
        'has_pin',    pin_hash is not null,
        'locked',     coalesce(locked_until > now(), false),
        'tries_left', greatest(0, 5 - fail_count))
       from game_saves
      where key_hash = encode(sha256(convert_to(p_code,'UTF8')),'hex')),
    jsonb_build_object('exists', false));
$$;
