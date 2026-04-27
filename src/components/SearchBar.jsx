import React from 'react'

export default function SearchBar({value,onChange,placeholder='Buscar planeta...'}){
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{padding:10,borderRadius:8,border:'1px solid rgba(255,255,255,0.06)',width:'100%',background:'transparent',color:'inherit'}}
    />
  )
}
