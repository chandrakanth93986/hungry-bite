import React, { useContext, useEffect } from 'react'
import AuthContext from '../../context/AuthContext/AuthContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      toast.error('Please login!', { theme: 'dark' })
      navigate('/login')
    }
  }, [token])

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard