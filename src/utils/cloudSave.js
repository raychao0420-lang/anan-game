const TOKEN = import.meta.env.VITE_GIST_TOKEN
const GIST_ID_KEY = 'anan-gist-id'
const SAVE_KEY = 'anan-game-v2'

function getLocalState() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY) || '{}') } catch { return {} }
}

function applyState(data) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(data))
}

export function getSaveCode() {
  return localStorage.getItem(GIST_ID_KEY)
}

export async function uploadSave() {
  if (!TOKEN) throw new Error('NO_TOKEN')
  const state = getLocalState()
  const payload = {
    description: 'anan-game-save',
    public: false,
    files: { 'save.json': { content: JSON.stringify(state) } },
  }
  const existingId = localStorage.getItem(GIST_ID_KEY)
  const url = existingId
    ? `https://api.github.com/gists/${existingId}`
    : 'https://api.github.com/gists'
  const res = await fetch(url, {
    method: existingId ? 'PATCH' : 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  if (!existingId) localStorage.setItem(GIST_ID_KEY, json.id)
  return json.id
}

export async function downloadSave(gistId) {
  if (!TOKEN) throw new Error('NO_TOKEN')
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  const content = json.files['save.json']?.content
  if (!content) throw new Error('NO_DATA')
  const data = JSON.parse(content)
  applyState(data)
  localStorage.setItem(GIST_ID_KEY, gistId)
}
