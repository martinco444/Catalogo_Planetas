import React from 'react'
import HeroSection from '../components/HeroSection'
import PlanetGrid from '../components/PlanetGrid'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import EarthViewer from '../components/EarthViewer'
import LoadingState from '../components/LoadingState'
import ErrorState from '../components/ErrorState'
import usePlanets from '../hooks/usePlanets'

export default function Home(){
  const {planets, loading, error, query, setQuery, filterOnlyWithMoons, setFilterOnlyWithMoons} = usePlanets()

  return (
    <div className="container">
      <HeroSection />

      <section style={{marginTop:20,display:'grid',gridTemplateColumns:'1fr 320px',gap:16,alignItems:'start'}}>
        <div>
          <div style={{display:'flex',gap:12,marginBottom:12}}>
            <div style={{flex:1}}><SearchBar value={query} onChange={setQuery} /></div>
            <FilterBar onlyWithMoons={filterOnlyWithMoons} onToggle={setFilterOnlyWithMoons} />
          </div>

          {loading && <LoadingState />}
          {error && <ErrorState message={error} />}
          {!loading && !error && <PlanetGrid planets={planets} />}
        </div>

        <aside>
          <EarthViewer />
        </aside>
      </section>
    </div>
  )
}
