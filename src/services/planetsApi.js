const BASE = 'https://api.le-systeme-solaire.net/rest/bodies'

// Read key injected by Vite at build/dev time
const API_KEY = import.meta.env.VITE_SOLAR_API_KEY

function makeHeaders() {
  return API_KEY ? { 'Authorization': `Bearer ${API_KEY}` } : {}
}

async function safeJson(res) {
  // try parse JSON, otherwise return text message
  const text = await res.text()
  try { return JSON.parse(text) } catch { return text }
}

export async function getPlanets(){
  try{
    const res = await fetch(BASE, { headers: makeHeaders() })
    if(res.ok){
      const data = await safeJson(res)
      const wanted = ['Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune']
      return data.bodies.filter(b => wanted.includes(b.englishName))
    }

    // if 401 or other, try proxy with same header (dev only)
    console.warn('Planets API returned non-ok status', res.status)
    const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(BASE)}`
    const pRes = await fetch(proxy, { headers: makeHeaders() })
    if(pRes.ok){
      const data = await safeJson(pRes)
      const wanted = ['Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune']
      return data.bodies.filter(b => wanted.includes(b.englishName))
    }

    // try to read message for debugging
    const debug = await safeJson(res)
    throw new Error(typeof debug === 'string' ? debug : `Planets API error ${res.status}`)
  }catch(err){
    console.error('getPlanets error:', err)
    // fallback to local dataset for dev/demo
    try{
      const { default: fallback } = await import('../data/planetFallback.js')
      return fallback
    }catch(e){
      throw new Error('Unable to load planets: ' + err.message)
    }
  }
}

export async function getPlanetById(id){
  try{
    const res = await fetch(`${BASE}/${id}`, { headers: makeHeaders() })
    if(res.ok) return safeJson(res)

    const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(BASE + '/' + id)}`
    const pRes = await fetch(proxy, { headers: makeHeaders() })
    if(pRes.ok) return safeJson(pRes)

    const debug = await safeJson(res)
    throw new Error(typeof debug === 'string' ? debug : 'Error fetching planet')
  }catch(err){
    console.error('getPlanetById error:', err)
    try{
      const { default: fallback } = await import('../data/planetFallback.js')
      const found = fallback.find(b => (b.id && b.id.toLowerCase() === id.toLowerCase()) || (b.englishName && b.englishName.toLowerCase() === id.toLowerCase()))
      if(found) return found
    }catch(e){/* ignore */}
    throw err
  }
}
