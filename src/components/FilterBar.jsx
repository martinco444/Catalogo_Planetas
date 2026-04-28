import React from 'react'

export default function FilterBar({onlyWithMoons,onToggle, sortMode, onSortChange}){
  return (
    <div style={{display:'flex',gap:12,alignItems:'center'}}>
      <label style={{display:'flex',gap:8,alignItems:'center'}}>
        <input type="checkbox" checked={onlyWithMoons} onChange={e=>onToggle(e.target.checked)} />
        <span className="muted">Mostrar solo con lunas</span>
      </label>

      <label style={{display:'flex',gap:8,alignItems:'center'}}>
        <span className="muted">Orden:</span>
        <select value={sortMode} onChange={e=>onSortChange(e.target.value)} style={{padding:6,borderRadius:6}}>
          <option value="default">Por defecto</option>
          <option value="alpha-asc">Alfabético A→Z</option>
          <option value="alpha-desc">Alfabético Z→A</option>
          <option value="size-asc">Tamaño ↑ (radio medio)</option>
          <option value="size-desc">Tamaño ↓ (radio medio)</option>
          <option value="moons-desc">Más lunas</option>
        </select>
      </label>
    </div>
  )
}
