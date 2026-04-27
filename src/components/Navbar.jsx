import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar(){
  return (
    <header style={{background:'linear-gradient(90deg, rgba(0,0,0,0.2), transparent)',padding:'12px 24px'}}>
      <nav style={{maxWidth:1200,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link to="/" style={{fontWeight:700,fontSize:18}}>🌌 Catálogo Planetas</Link>
        <div style={{display:'flex',gap:12}}>
          <Link to="/" className="muted">Inicio</Link>
        </div>
      </nav>
    </header>
  )
}
