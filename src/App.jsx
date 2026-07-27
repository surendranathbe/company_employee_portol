import React, { useState } from 'react'
import Welcome from './pages/Welcome.jsx'
import AdminLogin from './admin/admin_login.jsx'
import AdminDashboard from './admin/admin_dashboard.jsx'
import HRDashboard from './hr_dashboard/hr_dashboard.jsx'
import TeamLeaderDashboard from './team_leader_dashboard/team_leader_dashboard.jsx'
import EmployeeDashboard from './employee_dashboard/employee_dashboard.jsx'
import HRLogin from './hr_dashboard/hr_login.jsx'
import TeamLeaderLogin from './team_leader_dashboard/team_leader_login.jsx'
import EmployeeLogin from './employee_dashboard/employee_login.jsx'

function App() {
  const [screen, setScreen] = useState('welcome')

  // Path routing for HR Dashboard URL
  if (window.location.pathname === '/hr_dashboard' || window.location.pathname === '/hr_dashboard/') {
    return <HRDashboard />
  }

  // Path routing for HR Login URL
  if (window.location.pathname === '/hr_login' || window.location.pathname === '/hr_login/') {
    return <HRLogin />
  }

  // Path routing for Team Leader Dashboard URL
  if (window.location.pathname === '/team_leader_dashboard' || window.location.pathname === '/team_leader_dashboard/') {
    return <TeamLeaderDashboard />
  }

  // Path routing for Team Leader Login URL
  if (window.location.pathname === '/team_leader_login' || window.location.pathname === '/team_leader_login/') {
    return <TeamLeaderLogin />
  }

  // Path routing for Employee Dashboard URL
  if (window.location.pathname === '/employee_dashboard' || window.location.pathname === '/employee_dashboard/') {
    return <EmployeeDashboard />
  }

  // Path routing for Employee Login URL
  if (window.location.pathname === '/employee_login' || window.location.pathname === '/employee_login/') {
    return <EmployeeLogin />
  }

  // Path routing for Admin Dashboard URL
  if (window.location.pathname === '/admin_dashboard' || window.location.pathname === '/admin_dashboard/') {
    const isAdminLoggedIn = localStorage.getItem('admin_isLoggedIn') === 'true'
    if (isAdminLoggedIn) {
      return <AdminDashboard adminEmail={localStorage.getItem('admin_login_email') || 'Admin@ssvs.com'} />
    } else {
      // Redirect to root login page if not logged in
      window.location.href = '/'
      return null
    }
  }

  return (
    <>
      {screen === 'welcome' && (
        <Welcome onAnimationComplete={() => setScreen('login')} />
      )}
      {screen === 'login' && <AdminLogin />}
    </>
  )
}

export default App
