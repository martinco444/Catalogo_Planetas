import { useEffect, useState, useCallback } from 'react'
import getSocket from '../services/socket'

const TOKEN_KEY = 'TRIVIA_TOKEN'
const BASE = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000'

export default function useAuth(){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    if(typeof window === 'undefined'){ setLoading(false); return }
    const token = localStorage.getItem(TOKEN_KEY)
    if(!token){ setLoading(false); return }
    fetch(`${BASE}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r=>r.json())
      .then(data=>{ if(data && data.ok && data.user) setUser(data.user) })
      .catch(()=>{})
      .finally(()=> setLoading(false))
  }, [])

  const login = useCallback(async (name, password) => {
    const res = await fetch(`${BASE}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, password }) })
    const data = await res.json()
    if(res.ok && data.token){
      localStorage.setItem(TOKEN_KEY, data.token)
      setUser(data.user)
      try{ getSocket() }catch(e){}
      return { ok:true, user: data.user }
    }
    return { ok:false, error: data.error || 'error' }
  }, [])

  const register = useCallback(async (name, password) => {
    const res = await fetch(`${BASE}/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, password }) })
    const data = await res.json()
    if(res.ok) return { ok:true }
    return { ok:false, error: data.error || 'error' }
  }, [])

  const logout = useCallback(()=>{
    if(typeof window === 'undefined') return
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
    try{ if(window.__APP_SOCKET__){ window.__APP_SOCKET__.disconnect(); window.__APP_SOCKET__ = null } }catch(e){}
  }, [])

  return { user, loading, login, register, logout }
}
