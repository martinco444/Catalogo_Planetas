import React from 'react'

export default function ErrorState({message}){
  return (
    <div style={{padding:24,textAlign:'center'}}>
      <div style={{color:'#ff9b9b'}}>Error: {message}</div>
    </div>
  )
}
