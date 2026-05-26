let socket = null

export function getSocket(){
  if(typeof window === 'undefined') return null
  if(!window.__APP_SOCKET__){
    // require inside client runtime to avoid SSR issues
    const { io } = require('socket.io-client')
    const url = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000'
    window.__APP_SOCKET__ = io(url)
  }
  return window.__APP_SOCKET__
}

export default getSocket
