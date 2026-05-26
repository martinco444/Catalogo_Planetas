import React, { useState } from 'react'
import useAuth from '../src/hooks/useAuth'
import { useRouter } from 'next/router'

export default function LoginPage(){
  const { login, register } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [msg, setMsg] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    setMsg('')
    try{
      if(mode === 'register'){
        const r = await register(name, password)
        if(r.ok){ setMsg('Usuario creado. Ahora accede.'); setMode('login'); return }
        setMsg(r.error || 'Error al crear usuario')
        return
      }
      const r = await login(name, password)
      if(r.ok){
        setMsg('Login correcto')
        const next = router.query.next || '/'
        setTimeout(()=>{ window.location.href = next }, 400)
        return
      }
      setMsg(r.error || 'Error al iniciar sesión')
    }catch(e){ setMsg('Error de conexión') }
  }

  return (
    <div className="login-hero">
      <div className="login-card">
        <div className="login-visual">
          <div className="planet">🪐</div>
        </div>
        <div style={{flex:1}}>
          <h2>{mode === 'login' ? 'Inicia sesión' : 'Crea tu cuenta'}</h2>
          <div className="login-info">Accede para jugar la trivia en tiempo real y guardar tu historial.</div>

          <form onSubmit={handleSubmit} style={{display:'grid',gap:8,marginTop:12}}>
            <input placeholder="Nombre" value={name} onChange={e=>setName(e.target.value)} />
            <input placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
            <div style={{display:'flex',gap:8}}>
              <button className="btn large" type="submit">{mode === 'login' ? 'Entrar' : 'Registrar'}</button>
              <button type="button" className="btn muted" onClick={()=>setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Crear cuenta' : 'Volver a login'}</button>
            </div>
          </form>
          {msg ? <div style={{marginTop:12}} className="muted">{msg}</div> : null}
        </div>
      </div>
    </div>
  )
}
