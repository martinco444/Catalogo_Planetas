import React from 'react'
import Home from './pages/Home'
import PlanetDetail from './pages/PlanetDetail'
import History from './pages/History'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export default function App({ children }) {
  return (
    <>
      <div className="app-root">
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}
