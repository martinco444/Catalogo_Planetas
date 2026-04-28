import React from 'react'

function ensureAutostart(url){
  try{
    const u = new URL(url)
    if(!u.searchParams.has('autostart')) u.searchParams.set('autostart','1')
    if(!u.searchParams.has('preload')) u.searchParams.set('preload','1')
    return u.toString()
  }catch(e){
    // fallback: append query param if URL constructor fails
    return url + (url.includes('?') ? '&' : '?') + 'autostart=1&preload=1'
  }
}

export default function SketchfabEmbed({ src, title = '3D model', height = 480 }){
  if(!src) return null
  const finalSrc = ensureAutostart(src)
  return (
    <div className="embedWrap" style={{height: height}}>
      <iframe
        title={title}
        src={finalSrc}
        allow="autoplay; fullscreen; vr"
        loading="eager"
      />
    </div>
  )
}
