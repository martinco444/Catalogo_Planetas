import React from 'react'
import Link from 'next/link'

export default function Navbar(){
  return (
    <header style={{background:'linear-gradient(90deg, rgba(0,0,0,0.2), transparent)',padding:'12px 24px'}}>
      <nav style={{maxWidth:1200,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/" style={{fontWeight:700,fontSize:18}}>🌌 Catálogo Planetas</Link>
        <div style={{display:'flex',gap:12}}>
          <Link href="/" className="muted">Inicio</Link>
          <Link href="/trivia" className="muted">Trivia</Link>
          <Link href="/history" className="muted">Historial</Link>
        </div>
      </nav>
    </header>
  )
}
