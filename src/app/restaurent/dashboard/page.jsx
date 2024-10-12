'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react"

const RestaurentDashboard = () => {
  let router = useRouter()

  let redirectToHome = () => {
    router.push('/restaurent/login');  // Redirect to home page
  }

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      console.log('No token found');
      return redirectToHome();
    }
  }, [localStorage.getItem('token')])

  return (
    <div>RestaurentDashboard</div>
  )
}

export default RestaurentDashboard