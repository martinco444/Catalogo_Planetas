import React, { useEffect } from 'react'
import Home from '../src/pages/Home'
import useAuth from '../src/hooks/useAuth'
import { useRouter } from 'next/router'

export default function IndexPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(()=>{
    if(!loading && !user){
      // redirect to login and include return path
      const next = router.asPath || '/'
      router.replace(`/login?next=${encodeURIComponent(next)}`)
    }
  }, [loading, user, router])

  if(loading) return null
  if(!user) return null

  return <Home />
}
