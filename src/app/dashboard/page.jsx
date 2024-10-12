'use client'

import React from 'react'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const Dashboard = () => {
  const session = useSession()
  const status = session?.status
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      return router.push('/login')
    }
  }, [status, session])

  if (status === 'loading') {
    return <div className='h-screen bg-green-700 text-white text-3xl flex justify-center items-center'>Loading...</div>
  }

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard