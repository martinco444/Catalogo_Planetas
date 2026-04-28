// Normalize fields from the API to a compact structure used in UI
export function formatPlanet(raw){
  return {
    id: raw.id || raw.englishName?.toLowerCase() || raw.name,
    name: raw.englishName || raw.name || raw.id,
    // localized display name (Spanish) when available
    displayName: (() => {
      const en = raw.englishName || raw.name || raw.id
      const map = {
        Mercury: 'Mercurio',
        Venus: 'Venus',
        Earth: 'Tierra',
        Mars: 'Marte',
        Jupiter: 'Júpiter',
        Saturn: 'Saturno',
        Uranus: 'Urano',
        Neptune: 'Neptuno'
      }
      return map[en] || en
    })(),
    gravity: raw.gravity,
    density: raw.density,
    meanRadius: raw.meanRadius,
    equaRadius: raw.equaRadius,
    polarRadius: raw.polarRadius,
    moonsCount: Array.isArray(raw.moons) ? raw.moons.length : 0,
    mass: raw.mass?.massValue ? raw.mass.massValue * Math.pow(10, raw.mass.massExponent) : null,
    vol: raw.vol?.volValue ? raw.vol.volValue * Math.pow(10, raw.vol.volExponent) : null,
    discoveredBy: raw.discoveredBy || null,
    discoveryDate: raw.discoveryDate || null,
    bodyType: raw.bodyType || null,
    raw
  }
}
