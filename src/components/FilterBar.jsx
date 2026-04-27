import React from 'react'

export default function FilterBar({onlyWithMoons,onToggle}){
  return (
    <div style={{display:'flex',gap:12,alignItems:'center'}}>
      <label style={{display:'flex',gap:8,alignItems:'center'}}>
        <input type="checkbox" checked={onlyWithMoons} onChange={e=>onToggle(e.target.checked)} />
        <span className="muted">Mostrar solo con lunas</span>
      </label>
    </div>
  )
}
