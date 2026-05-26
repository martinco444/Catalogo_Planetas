export default async function handler(req, res) {
  // Only proxy GET requests for simplicity (used by planets API)
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end('Method Not Allowed')
  }

  const { path = [] } = req.query
  const pathStr = Array.isArray(path) ? path.join('/') : path

  // Build query string excluding the catch-all `path` param
  const qs = Object.entries(req.query)
    .filter(([k]) => k !== 'path')
    .map(([k, v]) => {
      if (Array.isArray(v)) return v.map(x => `${encodeURIComponent(k)}=${encodeURIComponent(x)}`).join('&')
      return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
    })
    .join('&')

  const target = `https://api.le-systeme-solaire.net/rest/${pathStr}${qs ? '?' + qs : ''}`

  const headers = { Accept: 'application/json' }
  if (process.env.SOLAR_API_KEY) headers['Authorization'] = `Bearer ${process.env.SOLAR_API_KEY}`

  try {
    const proxied = await fetch(target, { method: 'GET', headers })
    const text = await proxied.text()
    // forward status and content-type
    res.status(proxied.status)
    const ct = proxied.headers.get('content-type')
    if (ct) res.setHeader('Content-Type', ct)
    return res.send(text)
  } catch (err) {
    console.error('Proxy error', err)
    return res.status(502).json({ error: 'Bad Gateway' })
  }
}
