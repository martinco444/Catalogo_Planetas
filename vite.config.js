import { defineConfig, loadEnv } from 'vite'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const API_KEY = env.VITE_SOLAR_API_KEY

  return defineConfig({
    // Dev server proxy: forward `/api` to the solar system API and attach
    // Authorization header from the Vite env var. This avoids exposing the
    // API key in browser requests and prevents CORS preflight failures.
    server: {
      proxy: {
        '/api': {
          target: 'https://api.le-systeme-solaire.net',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (API_KEY) proxyReq.setHeader('Authorization', `Bearer ${API_KEY}`)
            })
          }
        }
      }
    }
  })
}
