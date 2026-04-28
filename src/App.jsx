import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PlanetDetail from './pages/PlanetDetail'
import History from './pages/History'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planet/:id" element={<PlanetDetail />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
