import { useEffect, useMemo, useState } from 'react'
import { getPlanets } from '../services/planetsApi'
import { formatPlanet } from '../utils/formatPlanetData'

export default function usePlanets(){
  const [planets, setPlanets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [filterOnlyWithMoons, setFilterOnlyWithMoons] = useState(false)

  useEffect(()=>{
    let mounted = true
    setLoading(true)
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
    return planets.filter(p => {
      if(filterOnlyWithMoons && p.moonsCount === 0) return false
      if(!q) return true
      return p.name.toLowerCase().includes(q)
    })
  },[planets, query, filterOnlyWithMoons])

  return {
    planets: filtered,
    rawPlanets: planets,
    loading,
    error,
    query,
    setQuery,
    filterOnlyWithMoons,
    setFilterOnlyWithMoons
  }
}
