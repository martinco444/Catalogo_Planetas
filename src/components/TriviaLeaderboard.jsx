import React from 'react'

export default function TriviaLeaderboard({ leaderboard = [] }){
  return (
    <div className="card leaderboard">
      <ol style={{margin:0,paddingLeft:18}}>
        {leaderboard.map((p,idx) => (
          <li key={idx} style={{padding:'6px 0'}}>
            <strong>{p.name}</strong> — {p.score} pts
          </li>
        ))}
      </ol>
    </div>
  )
}
