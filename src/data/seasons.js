// 連載劇「多季」聚合層：把每季正規化成 SeriesScreen 可通吃的結構。
// 新增一季只要在此加一筆（帶入該季的碎片/徽章板與收集型別）。
import { SEASON1, SHARD_BOARD } from './series'
import { SEASON2, BADGE_BOARD } from './series2'
import { SEASON3, GEM_BOARD } from './series3'
import { SEASON4, LICENSE_BOARD } from './series4'
import { SEASON5, PASSPORT_BOARD } from './series5'
import { SERIES_TEACH } from './seriesTeach'

function normalize(season, extra) {
  return {
    ...season,
    // 合併集中教學檔（scene 自帶 teach 者優先，如 S2 EP2+ 寫在 series2.js 內；choice 節點跳過）
    episodes: season.episodes.map((ep) => ({
      ...ep,
      scenes: ep.scenes.map((sc, i) => sc.kind === 'choice' || sc.puzzle.teach || !SERIES_TEACH[ep.id]?.[i]
        ? sc
        : { ...sc, puzzle: { ...sc.puzzle, teach: SERIES_TEACH[ep.id][i] } }),
    })),
    order: season.episodes.map((e) => e.id), // 循序解鎖用
    ...extra,
  }
}

export const SEASONS = [
  normalize(SEASON1, {
    key: 'season1',
    board: SHARD_BOARD,
    collType: 'shard',                                   // 每集 ep.shard.color 收進 store.seriesShards
    collLabel: { zh: '星願石碎片', en: 'Shards' },
    clueLabel: { zh: '斗篷客線索', en: 'Clues' },
    clueIcon: '🧙',
    subtitle: { zh: '第一季 · 已完結', en: 'Season 1 · Complete' },
    done: true,
  }),
  normalize(SEASON2, {
    key: 'season2',
    board: BADGE_BOARD,
    collType: 'badge',                                   // 每集 ep.badge.id 收進 store.seriesBadges
    collLabel: { zh: '星座徽章', en: 'Zodiac Badges' },
    clueLabel: { zh: '星空線索', en: 'Sky Clues' },
    clueIcon: '☄️',
    subtitle: { zh: '第二季 · 已完結', en: 'Season 2 · Complete' },
    done: true,
  }),
  normalize(SEASON3, {
    key: 'season3',
    board: GEM_BOARD,
    collType: 'gem',                                     // 每集 ep.gem.id 收進 store.seriesGems
    collLabel: { zh: '軌道寶石', en: 'Orbit Gems' },
    clueLabel: { zh: '冰冰腳印', en: 'Icy Footprints' },
    clueIcon: '❄️',
    subtitle: { zh: '第三季 · 已完結', en: 'Season 3 · Complete' },
    done: true,
  }),
  normalize(SEASON4, {
    key: 'season4',
    board: LICENSE_BOARD,
    collType: 'seal',                                    // 每集 ep.seal.id 收進 store.seriesSeals
    collLabel: { zh: '級別金印', en: 'License Seals' },
    clueLabel: { zh: '灰白羽毛', en: 'Grey Feathers' },
    clueIcon: '🪶',
    subtitle: { zh: '第四季 · 已完結', en: 'Season 4 · Complete' },
    done: true,
  }),
  normalize(SEASON5, {
    key: 'season5',
    board: PASSPORT_BOARD,
    collType: 'stamp',                                   // 每集 ep.stamp.id 收進 store.seriesStamps
    collLabel: { zh: '環遊紀念章', en: 'Passport Stamps' },
    clueLabel: { zh: '感謝卡', en: 'Thank-You Cards' },
    clueIcon: '✉️',
    subtitle: { zh: '第五季 · 已完結', en: 'Season 5 · Complete' },
    done: true,
  }),
]
