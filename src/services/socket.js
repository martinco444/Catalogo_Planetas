let socket = null
const TOKEN_KEY = 'TRIVIA_TOKEN'

export function getSocket(){
  if(typeof window === 'undefined') return null
  const { io } = require('socket.io-client')
  const url = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000'
  const token = localStorage.getItem(TOKEN_KEY)

  // create socket if not present
  if(!window.__APP_SOCKET__){
    window.__APP_SOCKET__ = io(url, { auth: token ? { token } : {} })
    window.__APP_SOCKET__._token = token
    return window.__APP_SOCKET__
  }

  // if token changed, reconnect socket with new token
  if(window.__APP_SOCKET__._token !== token){
    try{ window.__APP_SOCKET__.disconnect() }catch(e){}
    window.__APP_SOCKET__ = io(url, { auth: token ? { token } : {} })
    window.__APP_SOCKET__._token = token
  }
  return window.__APP_SOCKET__
}

export default getSocket
