import { useEffect, useMemo, useState } from 'react'
import { getPlanets } from '../services/planetsApi'
import { formatPlanet } from '../utils/formatPlanetData'

export default function usePlanets(){
  const [planets, setPlanets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [filterOnlyWithMoons, setFilterOnlyWithMoons] = useState(false)
  const [sortMode, setSortMode] = useState('default')

  useEffect(()=>{
    let mounted = true
    setLoading(true)
    setError(null)
    getPlanets()
      .then(list => {
        if(!mounted) return
        setPlanets(list.map(formatPlanet))
        setLoading(false)
      })
      .catch(err => {
        if(!mounted) return
        setError(err.message || 'Error')
        setLoading(false)
      })
    return ()=> mounted = false
  },[])

  const filtered = useMemo(()=>{
    const q = query.trim().toLowerCase()
    let out = planets.filter(p => {
      if(filterOnlyWithMoons && p.moonsCount === 0) return false
      if(!q) return true
      return p.name.toLowerCase().includes(q)
    })

    // apply sorting
    const cmp = (a,b) => {
      switch(sortMode){
        case 'alpha-asc': return a.name.localeCompare(b.name)
        case 'alpha-desc': return b.name.localeCompare(a.name)
        case 'size-asc': return (a.meanRadius || 0) - (b.meanRadius || 0)
        case 'size-desc': return (b.meanRadius || 0) - (a.meanRadius || 0)
        case 'moons-desc': return (b.moonsCount || 0) - (a.moonsCount || 0)
        default: return 0
      }
    }

    if(sortMode && sortMode !== 'default') out = out.slice().sort(cmp)
    return out
  },[planets, query, filterOnlyWithMoons, sortMode])

  return {
    planets: filtered,
    rawPlanets: planets,
    loading,
    error,
    query,
    setQuery,
    filterOnlyWithMoons,
    setFilterOnlyWithMoons
    ,sortMode, setSortMode
  }
}
