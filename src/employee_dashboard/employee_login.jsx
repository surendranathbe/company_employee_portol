import React, { useState, useEffect } from 'react';
import logo from '../assets/company_portol_logo.png';
import '../hr_dashboard/hr_login.css'; // Reusing premium layout styles

function EmployeeLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Dynamic ticking clock
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const formatDate = (date) => date.toLocaleDateString([], { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      // Mock validation (no DB connection)
      if (email.toLowerCase() === 'employee@ssvs.com' && password === 'employee@ssvs') {
        setLoading(false);
        setShowSuccessModal(true);
      } else {
        setLoading(false);
        setErrorMessage('Invalid Employee credentials. Try employee@ssvs.com / employee@ssvs');
      }
    }, 800);
  };

  // If already logged in, redirect
  useEffect(() => {
    if (localStorage.getItem('employee_isLoggedIn') === 'true') {
      window.location.href = '/employee_dashboard';
    }
  }, []);

  return (
    <div className="portal-login-container">
      {/* Left Banner */}
      <div className="portal-left-banner">
        <div className="portal-logo-container">
          <img src={logo} alt="Company Logo" className="portal-brand-logo" />
        </div>
        <div className="portal-banner-content">
          <h2 className="portal-banner-title">Employee Workspace</h2>
          <p className="portal-banner-text">Access your tasks calendar, submit timesheet hours, check leave balances, and download monthly payslips.</p>
        </div>
        <div className="portal-clock-wrapper">
          <span className="portal-clock-time">{formatTime(dateTime)}</span>
          <span className="portal-clock-date">{formatDate(dateTime)}</span>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="portal-right-form">
        <div className="portal-login-card">
          <div className="portal-form-header">
            <img src={logo} alt="Company Logo" className="portal-brand-logo" style={{ height: '36px', marginBottom: '1.5rem' }} />
            <h3>Employee Login</h3>
            <p>Enter your workspace credentials to access your dashboard.</p>
          </div>

          {errorMessage && <div className="portal-error-banner">{errorMessage}</div>}

          <form onSubmit={handleSubmit}>
            <div className="portal-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="portal-input"
                placeholder="employee@ssvs.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="portal-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="portal-input"
                placeholder="enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button type="submit" className="portal-submit-btn" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="portal-modal-overlay">
          <div className="portal-success-modal">
            <h4>Success</h4>
            <p>You have entered the correct details.</p>
            <button 
              className="portal-modal-btn"
              onClick={() => {
                setShowSuccessModal(false);
                localStorage.setItem('employee_isLoggedIn', 'true');
                localStorage.setItem('employee_login_email', email);
                window.location.href = '/employee_dashboard';
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeLogin;
