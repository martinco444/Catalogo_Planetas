import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function SatelliteScene({ width = 320, height = 140 }){
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if(!mount) return

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio || 1)
    renderer.setSize(width, height)
    renderer.domElement.style.display = 'block'
    mount.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 4)

    // lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)
    const dir = new THREE.DirectionalLight(0xffffff, 0.6)
    dir.position.set(5,5,5)
    scene.add(dir)

    // simple satellite: box body + small dish + solar panels
    const satellite = new THREE.Group()

    const bodyGeo = new THREE.BoxGeometry(0.6, 0.4, 0.4)
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3 })
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    satellite.add(body)

    const dishGeo = new THREE.ConeGeometry(0.12, 0.2, 16)
    const dishMat = new THREE.MeshStandardMaterial({ color: 0x222222 })
    const dish = new THREE.Mesh(dishGeo, dishMat)
    dish.rotation.x = Math.PI / 2
    dish.position.set(0.45, 0, 0)
    satellite.add(dish)

    const panelGeo = new THREE.BoxGeometry(0.02, 0.7, 0.35)
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x113366, metalness: 0.2, roughness: 0.6 })
    const leftPanel = new THREE.Mesh(panelGeo, panelMat)
    leftPanel.position.set(-0.4, 0.0, 0.4)
    const rightPanel = leftPanel.clone()
    rightPanel.position.set(-0.4, 0.0, -0.4)
    satellite.add(leftPanel)
    satellite.add(rightPanel)

    scene.add(satellite)

    // stars/background subtle
    const starsGeo = new THREE.BufferGeometry()
    const starsCount = 100
    const positions = new Float32Array(starsCount * 3)
    for(let i=0;i<starsCount;i++){
      positions[i*3] = (Math.random()-0.5)*10
      positions[i*3+1] = (Math.random()-0.5)*4
      positions[i*3+2] = (Math.random()-0.5)*6 - 2
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, opacity: 0.8 })
    const stars = new THREE.Points(starsGeo, starsMat)
    scene.add(stars)

    let mouseX = 0, mouseY = 0

    function onMouseMove(e){
      const rect = mount.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      mouseX = x
      mouseY = y
    }
    mount.addEventListener('mousemove', onMouseMove)

    // animate
    let rafId
    const clock = new THREE.Clock()
    function animate(){
      const dt = clock.getDelta()
      // slowly rotate satellite and respond to mouse
      satellite.rotation.y += dt * 0.3
      satellite.rotation.x += (mouseY * 0.6 - satellite.rotation.x) * 0.06
      satellite.rotation.z += (mouseX * -0.6 - satellite.rotation.z) * 0.06

      renderer.render(scene, camera)
      rafId = requestAnimationFrame(animate)
    }
    animate()

    // handle resize
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
      mount.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [width, height])

  return (
    <div ref={mountRef} style={{width, height, borderRadius:8, overflow:'hidden'}} aria-hidden />
  )
}
