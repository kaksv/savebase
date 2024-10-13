import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import SharedLayout from './components/SharedLayout'
import Dashboard from './components/Pages/Dashboard'
import SharedDashboardLayout from './components/SharedDashboard'
import Safes from './components/Pages/Safes'
import Login from './components/Pages/Login'
import CommunityIndex from './components/Pages/Comm'
import CommunityDetails from './components/Pages/Comm/CommGoalDetails'
import PersonalIndex from './components/Pages/MySafes'
import ProfileIndex from './components/Pages/Profile'
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SharedLayout />}>
        <Route index element={<Login />} />
        <Route path="dashboard" element={<SharedDashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="safes" element={<Safes />} />
          <Route path="communities" element={<CommunityIndex />} />
          <Route
            path="communities/:community_id"
            element={<CommunityDetails />}
          />
          <Route path="personal" element={<PersonalIndex />} />
          <Route path="profile" element={<ProfileIndex />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
