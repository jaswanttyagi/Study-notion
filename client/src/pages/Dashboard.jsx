import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/core/Dashboard/Sidebar'

const Dashboard = () => {
  const {loading : authLoading} = useSelector( (state)=> state.auth)  
  const {loading : profileLoading} = useSelector( (state)=> state.profile)  

  if (profileLoading || authLoading) {
    return <div className="mt-10 spinner"></div>
  }


  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] bg-richblack-900">
      <Sidebar />
      <div className="flex-1 min-h-[calc(100vh-3.5rem)]">
        <div className="mx-auto h-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
