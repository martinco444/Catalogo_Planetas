// Normalize fields from the API to a compact structure used in UI
export function formatPlanet(raw){
  return {
    id: raw.id || raw.englishName?.toLowerCase() || raw.name,
    name: raw.englishName || raw.name || raw.id,
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
