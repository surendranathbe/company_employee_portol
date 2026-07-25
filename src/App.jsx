import React, { useState } from 'react'
import Welcome from './pages/Welcome.jsx'
import AdminLogin from './admin/admin_login.jsx'

function App() {
  const [screen, setScreen] = useState('welcome')

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
