import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function SolarSystemScene({ width = 720, height = 300 }){
  const mountRef = useRef(null)

  useEffect(()=>{
    const mount = mountRef.current
    if(!mount) return

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    mount.appendChild(renderer.domElement)

    
    const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000)
    camera.position.set(0, 30, 60)
    camera.lookAt(0,0,0)

    // luz
    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)
    const sunLight = new THREE.PointLight(0xffffff, 1.2, 400)
    sunLight.position.set(0,0,0)
    scene.add(sunLight)

    // sol
    const sunGeo = new THREE.SphereGeometry(4, 24, 24)
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffcc33 })
    const sun = new THREE.Mesh(sunGeo, sunMat)
    scene.add(sun)

    // helper: crear planetas con tamaños/colors/distancias aproximadas
    const planetDefs = [
      { name: 'Mercury', size: 0.6, color: 0xaaaaaa, dist: 8, speed: 0.04 },
      { name: 'Venus', size: 1.1, color: 0xffddaa, dist: 11, speed: 0.03 },
      { name: 'Earth', size: 1.2, color: 0x3366ff, dist: 14, speed: 0.025 },
      { name: 'Mars', size: 0.9, color: 0xff5533, dist: 17, speed: 0.02 },
      { name: 'Jupiter', size: 2.5, color: 0xffaa66, dist: 22, speed: 0.012 },
      { name: 'Saturn', size: 2.1, color: 0xffcc99, dist: 28, speed: 0.009 },
      { name: 'Uranus', size: 1.6, color: 0x66ccff, dist: 34, speed: 0.006 },
      { name: 'Neptune', size: 1.6, color: 0x3366ff, dist: 40, speed: 0.005 }
    ]

    const orbits = []
    planetDefs.forEach(def => {
      const orbitGroup = new THREE.Group()
      const geo = new THREE.SphereGeometry(def.size, 16, 16)
      const mat = new THREE.MeshStandardMaterial({ color: def.color, metalness: 0.2, roughness: 0.6 })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(def.dist, 0, 0)
      orbitGroup.add(mesh)
      orbitGroup.userData = { speed: def.speed }
      scene.add(orbitGroup)

      // subtle orbit ring
      const ringGeo = new THREE.RingGeometry(def.dist - 0.02, def.dist + 0.02, 64)
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.06, transparent: true, side: THREE.DoubleSide })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.rotation.x = Math.PI / 2
      scene.add(ring)

      orbits.push(orbitGroup)
    })

    // background stars
    const starsGeo = new THREE.BufferGeometry()
    const starsCount = 200
    const starsPos = new Float32Array(starsCount * 3)
    for(let i=0;i<starsCount;i++){
      starsPos[i*3] = (Math.random()-0.5)*200
      starsPos[i*3+1] = (Math.random()-0.5)*100
      starsPos[i*3+2] = (Math.random()-0.5)*200
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3))
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, opacity: 0.6, transparent: true })
    const stars = new THREE.Points(starsGeo, starsMat)
    scene.add(stars)

    // rotacion del mouse
    let targetRotX = 0, targetRotY = 0
    function onMove(e){
      const rect = mount.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      targetRotY = x * 0.15
      targetRotX = y * 0.08
    }
    mount.addEventListener('mousemove', onMove)

    // loop de animacion
    let rafId
    const clock = new THREE.Clock()
    function animate(){
      const dt = clock.getDelta()
      // smooth rotate scene
      scene.rotation.x += (targetRotX - scene.rotation.x) * 0.05
      scene.rotation.y += (targetRotY - scene.rotation.y) * 0.05

      // update orbits
      orbits.forEach((g, i) => {
        g.rotation.y += g.userData.speed * dt * 10
        // also rotate planet on axis
        if(g.children[0]) g.children[0].rotation.y += 0.3 * dt
      })

      renderer.render(scene, camera)
      rafId = requestAnimationFrame(animate)
    }
    animate()

    function handleResize(){
      const w = width
      const h = height
      renderer.setSize(w,h)
      camera.aspect = w/h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', handleResize)

    // cleanup
    return ()=>{
      cancelAnimationFrame(rafId)
      mount.removeChild(renderer.domElement)
      mount.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [width, height])

  return (
    <div ref={mountRef} style={{width, height, borderRadius:8, overflow:'hidden'}} aria-hidden />
  )
}
