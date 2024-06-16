import React, { useContext, useEffect } from 'react'
import AuthContext from '../../context/AuthContext/AuthContext'

const Dashboard = () => {
  const {user} = useContext(AuthContext)

  return (
    <div>Dashboard</div>
  )
}

export default Dashboard