import React, { useState } from 'react'

function formatMass(raw){
  if(!raw || !raw.mass) return '—'
  const { massValue, massExponent } = raw.mass
  if(massValue == null || massExponent == null) return '—'
  return `${massValue} × 10^${massExponent} kg`
}

function formatVol(raw){
  if(!raw || !raw.vol) return '—'
  const { volValue, volExponent } = raw.vol
  if(volValue == null || volExponent == null) return '—'
  return `${volValue} × 10^${volExponent} km³`
}

export default function TechnicalDetails({ planet }){
  const [showRaw, setShowRaw] = useState(false)
  if(!planet) return null

  const raw = planet.raw || {}
  const moons = Array.isArray(raw.moons) ? raw.moons.map(m => m.moon || m).filter(Boolean) : []

  // prefer formatted/top-level values when available
  const discoveredBy = planet.discoveredBy || raw.discoveredBy || '—'
  const discoveryDate = planet.discoveryDate || raw.discoveryDate || '—'
  const massValue = planet.mass || (raw.mass?.massValue && raw.mass.massExponent ? raw.mass.massValue * Math.pow(10, raw.mass.massExponent) : null)
  const volValue = planet.vol || (raw.vol?.volValue && raw.vol.volExponent ? raw.vol.volValue * Math.pow(10, raw.vol.volExponent) : null)

  function niceMass(val){
    if(!val) return '—'
    // display in scientific notation with units
    return `${Number(val).toExponential(3)} kg`
  }

  function niceVol(val){
    if(!val) return '—'
    return `${Number(val).toExponential(3)} km³`
  }

  return (
    <div style={{marginTop:12}}>
      <h4>Datos técnicos</h4>
      <div style={{background:'rgba(255,255,255,0.02)',padding:12,borderRadius:8}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <tbody>
            <tr>
              <th style={{textAlign:'left',padding:'8px 6px',width:'35%',color:'#cfe6ff'}}>ID</th>
              <td style={{padding:'8px 6px'}}>{raw.id || planet.id}</td>
            </tr>
            <tr style={{background:'rgba(255,255,255,0.01)'}}>
              <th style={{textAlign:'left',padding:'8px 6px',color:'#cfe6ff'}}>Nombre</th>
              <td style={{padding:'8px 6px'}}>{raw.englishName || planet.name}</td>
            </tr>
            <tr>
              <th style={{textAlign:'left',padding:'8px 6px',color:'#cfe6ff'}}>Gravedad</th>
              <td style={{padding:'8px 6px'}}>{planet.gravity ?? '—'}</td>
            </tr>
            <tr style={{background:'rgba(255,255,255,0.01)'}}>
              <th style={{textAlign:'left',padding:'8px 6px',color:'#cfe6ff'}}>Densidad</th>
              <td style={{padding:'8px 6px'}}>{planet.density ?? '—'}</td>
            </tr>
            <tr>
              <th style={{textAlign:'left',padding:'8px 6px',color:'#cfe6ff'}}>Radio medio</th>
              <td style={{padding:'8px 6px'}}>{planet.meanRadius ? `${planet.meanRadius} km` : '—'}</td>
            </tr>
            <tr style={{background:'rgba(255,255,255,0.01)'}}>
              <th style={{textAlign:'left',padding:'8px 6px',color:'#cfe6ff'}}>Radio ecuador</th>
              <td style={{padding:'8px 6px'}}>{raw.equaRadius ?? '—'}</td>
            </tr>
            <tr>
              <th style={{textAlign:'left',padding:'8px 6px',color:'#cfe6ff'}}>Radio polar</th>
              <td style={{padding:'8px 6px'}}>{raw.polarRadius ?? '—'}</td>
            </tr>
            <tr style={{background:'rgba(255,255,255,0.01)'}}>
              <th style={{textAlign:'left',padding:'8px 6px',color:'#cfe6ff'}}>Lunas</th>
              <td style={{padding:'8px 6px'}}>{moons.length ? moons.join(', ') : '—'}</td>
            </tr>
            <tr>
              <th style={{textAlign:'left',padding:'8px 6px',color:'#cfe6ff'}}>Masa</th>
              <td style={{padding:'8px 6px'}}>{niceMass(massValue)}</td>
            </tr>
            <tr style={{background:'rgba(255,255,255,0.01)'}}>
              <th style={{textAlign:'left',padding:'8px 6px',color:'#cfe6ff'}}>Volumen</th>
              <td style={{padding:'8px 6px'}}>{niceVol(volValue)}</td>
            </tr>
            <tr>
              <th style={{textAlign:'left',padding:'8px 6px',color:'#cfe6ff'}}>Descubierto por</th>
              <td style={{padding:'8px 6px'}}>{discoveredBy}</td>
            </tr>
            <tr style={{background:'rgba(255,255,255,0.01)'}}>
              <th style={{textAlign:'left',padding:'8px 6px',color:'#cfe6ff'}}>Fecha descubrimiento</th>
              <td style={{padding:'8px 6px'}}>{discoveryDate}</td>
            </tr>
            <tr>
              <th style={{textAlign:'left',padding:'8px 6px',color:'#cfe6ff'}}>Tipo</th>
              <td style={{padding:'8px 6px'}}>{raw.bodyType || planet.bodyType || '—'}</td>
            </tr>
          </tbody>
        </table>

        <div style={{marginTop:10}}>
          <button onClick={()=>setShowRaw(s=>!s)} style={{background:'transparent',border:'1px solid rgba(255,255,255,0.06)',color:'#dbe9ff',padding:'6px 10px',borderRadius:6,cursor:'pointer'}}>
            {showRaw ? 'Ocultar JSON crudo' : 'Mostrar JSON crudo'}
          </button>
        </div>

        {showRaw && (
          <pre style={{whiteSpace:'pre-wrap',fontSize:12,color:'#dbe9ff',background:'rgba(0,0,0,0.2)',padding:12,borderRadius:8,marginTop:10,maxHeight:320,overflow:'auto'}}>
            {JSON.stringify(raw, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}
