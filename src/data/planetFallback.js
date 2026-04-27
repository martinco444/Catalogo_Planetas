// Minimal fallback dataset to allow UI development when the API is unreachable.
export default [
  {
    id: 'mercury',
    englishName: 'Mercury',
    gravity: 3.7,
    density: 5.43,
    meanRadius: 2439.7,
    equaRadius: 2440,
    polarRadius: 2439,
    moons: [],
    bodyType: 'Planet'
  },
  {
    id: 'venus',
    englishName: 'Venus',
    gravity: 8.87,
    density: 5.24,
    meanRadius: 6051.8,
    equaRadius: 6052,
    polarRadius: 6051,
    moons: [],
    bodyType: 'Planet'
  },
  {
    id: 'earth',
    englishName: 'Earth',
    gravity: 9.8,
    density: 5.514,
    meanRadius: 6371.0,
    equaRadius: 6378.1,
    polarRadius: 6356.8,
    moons: [{moon: 'Moon'}],
    bodyType: 'Planet'
  },
  {
    id: 'mars',
    englishName: 'Mars',
    gravity: 3.71,
    density: 3.93,
    meanRadius: 3389.5,
    equaRadius: 3396.2,
    polarRadius: 3376.2,
    moons: [{moon: 'Phobos'},{moon:'Deimos'}],
    bodyType: 'Planet'
  },
  {
    id: 'jupiter',
    englishName: 'Jupiter',
    gravity: 24.79,
    density: 1.33,
    meanRadius: 69911,
    equaRadius: 71492,
    polarRadius: 66854,
    moons: [{moon:'Io'},{moon:'Europa'},{moon:'Ganymede'},{moon:'Callisto'}],
    bodyType: 'Planet'
  },
  {
    id: 'saturn',
    englishName: 'Saturn',
    gravity: 10.44,
    density: 0.69,
    meanRadius: 58232,
    equaRadius: 60268,
    polarRadius: 54364,
    moons: [{moon:'Titan'},{moon:'Rhea'}],
    bodyType: 'Planet'
  },
  {
    id: 'uranus',
    englishName: 'Uranus',
    gravity: 8.69,
    density: 1.27,
    meanRadius: 25362,
    equaRadius: 25559,
    polarRadius: 24973,
    moons: [{moon:'Titania'},{moon:'Oberon'}],
    bodyType: 'Planet'
  },
  {
    id: 'neptune',
    englishName: 'Neptune',
    gravity: 11.15,
    density: 1.64,
    meanRadius: 24622,
    equaRadius: 24764,
    polarRadius: 24341,
    moons: [{moon:'Triton'}],
    bodyType: 'Planet'
  }
]
