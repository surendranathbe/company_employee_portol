import React, { useState, useEffect } from 'react'
import logo from '../assets/company_portol_logo.png'
import { supabase } from '../supabaseClient'
import AdminDashboard from './admin_dashboard.jsx'
import './admin_login.css'


function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [dateTime, setDateTime] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('admin_isLoggedIn') === 'true'
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Ticking clock effect
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Format Time: e.g., 11:38:51 AM
  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  // Format Date: e.g., Sat, Jul 25, 2026
  const formatDate = (date) => {
    return date.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    // 1. Hardcoded check for immediate success matching requirements (respects local updates)
    const savedEmail = localStorage.getItem('admin_emailId') || 'Admin@ssvs.com'
    if ((email === savedEmail || email === 'Admin@ssvs.com') && password === 'Admin@ssvs') {
      setLoading(false)
      setShowSuccessModal(true)
      return
    }

    try {
      // 2. Fallback to Supabase Database Authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Supabase Auth Error:', error)
        setErrorMessage(error.message || JSON.stringify(error) || 'Invalid credentials')
        return
      }

      // Query public.admins to confirm this authenticated user is an admin
      const { data: adminUser, error: adminError } = await supabase
        .from('admins')
        .select('id')
        .eq('id', data.user.id)
        .maybeSingle()

      if (adminError || !adminUser) {
        if (adminError) console.error('Supabase Query Error:', adminError)
        await supabase.auth.signOut()
        setErrorMessage('Access denied. You are not authorized as an administrator.')
        return
      }

      setShowSuccessModal(true)
    } catch (err) {
      console.error('Catch Login Error:', err)
      setErrorMessage(err.message || 'An unexpected database error occurred.')
    } finally {
      setLoading(false)
    }
  }

  // Render Sidebar Dashboard if logged in
  if (isLoggedIn) {
    return <AdminDashboard adminEmail={localStorage.getItem('admin_login_email') || email} />
  }

  return (
    <div className="admin-login-container">
      {/* Left Panel */}
      <div className="login-left">
        {/* Top-center logo */}
        <div className="left-top">
          <img src={logo} alt="Company Portol Logo" className="left-logo" />
        </div>

        {/* Middle text banner */}
        <div className="left-middle">
          <h2>Portal Control</h2>
          <p>Access corporate records, update portal configurations, manage permissions, and supervise administrative workflows.</p>
        </div>

        {/* Bottom live clock */}
        <div className="left-bottom">
          <div className="live-clock">
            <span className="clock-time">{formatTime(dateTime)}</span>
            <span className="clock-date">{formatDate(dateTime)}</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <div className="login-card">
          <div className="form-logo-wrapper">
            <img src={logo} alt="Company Portol Logo" className="form-logo" />
          </div>
          <h3>Admin Login</h3>
          <p>Please enter your credentials to access the portal dashboard.</p>

          {errorMessage && <div className="error-banner">{errorMessage}</div>}
          {successMessage && <div className="success-banner">{successMessage}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  placeholder="enter login mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  id="password"
                  placeholder="enter the password."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <label className="remember-me">
                <input type="checkbox" disabled={loading} />
                Remember me
              </label>
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      {/* Custom Overlay Pop-up Modal for Correct Details */}
      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <h4>Success</h4>
            <p>you have enter the correct deatils</p>
            <button 
              className="success-modal-btn"
              onClick={() => {
                setShowSuccessModal(false)
                setIsLoggedIn(true)
                localStorage.setItem('admin_isLoggedIn', 'true')
                localStorage.setItem('admin_login_email', email)
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminLogin
