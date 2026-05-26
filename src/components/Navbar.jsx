import React from 'react'
import Link from 'next/link'
import useAuth from '../hooks/useAuth'
import { useRouter } from 'next/router'

export default function Navbar(){
  const { user, logout, loading } = useAuth()
  const router = useRouter()

  const navItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Trivia', href: '/trivia' },
    { label: 'Historial', href: '/history' }
  ]

  return (
    <header style={{background:'linear-gradient(90deg, rgba(0,0,0,0.2), transparent)',padding:'12px 24px'}}>
      <nav style={{maxWidth:1200,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/" style={{fontWeight:700,fontSize:18}}>🌌 Catálogo Planetas</Link>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          {navItems.map(item => (
            user ? (
              <Link key={item.href} href={item.href} className="muted">{item.label}</Link>
            ) : (
              <span key={item.href} className="muted nav-link disabled">{item.label}</span>
            )
          ))}
          {user ? (
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <span className="muted">{user.name}</span>
              <button className="btn small muted" onClick={()=>{ logout(); router.replace('/login') }}>Salir</button>
            </div>
          ) : (
            <Link href="/login" className="muted">Entrar</Link>
          )}
        </div>
      </nav>
    </header>
  )
}
