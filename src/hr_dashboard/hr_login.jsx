import React, { useState, useEffect } from 'react';
import logo from '../assets/company_portol_logo.png';
import './hr_login.css'; // Premium CSS specifically for this login page
import { supabase } from '../supabaseClient';

function HRLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Email status for label coloring: 'normal', 'valid', 'invalid'
  const [emailStatus, setEmailStatus] = useState('normal');

  // Forgot password flow states
  const [flowMode, setFlowMode] = useState('login'); // 'login' or 'forgot'
  const [resetStep, setResetStep] = useState(1); // 1: Email verify, 2: Reset form
  const [resetEmail, setResetEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [verifiedEmp, setVerifiedEmp] = useState(null);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Dynamic ticking clock
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const formatDate = (date) => date.toLocaleDateString([], { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' });

  // Real-time dynamic email check against Supabase
  useEffect(() => {
    const checkEmail = async () => {
      if (email.trim()) {
        try {
          const { data, error } = await supabase
            .from('hr_employees')
            .select('email_id')
            .ilike('email_id', email.trim())
            .maybeSingle();

          if (error) {
            console.error('Email check error:', error);
            setEmailStatus('invalid');
          } else if (data) {
            setEmailStatus('valid');
          } else {
            // Also accept default test account as valid
            if (email.trim().toLowerCase() === 'hr@ssvs.com') {
              setEmailStatus('valid');
            } else {
              setEmailStatus('invalid');
            }
          }
        } catch (err) {
          setEmailStatus('invalid');
        }
      } else {
        setEmailStatus('normal');
      }
    };

    const timer = setTimeout(() => {
      checkEmail();
    }, 450); // 450ms debounce

    return () => clearTimeout(timer);
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // 1. First, check the Supabase public.hr_employees table
      const { data, error } = await supabase
        .from('hr_employees')
        .select('*')
        .ilike('email_id', email.trim())
        .maybeSingle();

      if (error) {
        console.error('HR Login DB error:', error);
      }

      if (data) {
        // If a password has been set in the database, compare it.
        if (data.password && data.password === password) {
          setLoading(false);
          setShowSuccessModal(true);
          return;
        } else if (!data.password && email.toLowerCase() === 'hr@ssvs.com' && password === 'hr@ssvs') {
          // Allow default fallback only for default email if no custom password is set yet
          setLoading(false);
          setShowSuccessModal(true);
          return;
        } else {
          setLoading(false);
          setErrorMessage('Invalid credentials or password has not been created yet.');
          return;
        }
      }

      // 2. Default hardcoded fallback for default testing account (if not in DB yet)
      if (email.trim().toLowerCase() === 'hr@ssvs.com' && password === 'hr@ssvs') {
        setLoading(false);
        setShowSuccessModal(true);
        return;
      }

      setLoading(false);
      setErrorMessage('Invalid HR credentials.');
    } catch (err) {
      console.error('Login submit error:', err);
      setLoading(false);
      setErrorMessage('An unexpected error occurred during authentication.');
    }
  };

  // Verify Email in Forgot Password Flow
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetError('');
    setResetSuccess('');

    try {
      const { data, error } = await supabase
        .from('hr_employees')
        .select('id, email_id')
        .ilike('email_id', resetEmail.trim())
        .maybeSingle();

      if (error) {
        console.error('Verify email DB error:', error);
        setResetError('A database query error occurred.');
        setLoading(false);
        return;
      }

      if (data) {
        setVerifiedEmp(data);
        setResetStep(2);
        setResetSuccess('Email address verified successfully. Please enter your new password below.');
      } else {
        // Also allow the default test email as a mock-verifiable account
        if (resetEmail.trim().toLowerCase() === 'hr@ssvs.com') {
          setVerifiedEmp({ id: null, email_id: 'hr@ssvs.com' });
          setResetStep(2);
          setResetSuccess('Test account verified. Enter new password below.');
        } else {
          setResetError('This email is not registered in our HR database.');
        }
      }
    } catch (err) {
      console.error('Verify email catch error:', err);
      setResetError('An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  // Reset/Create Password Submit
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetError('');
    setResetSuccess('');

    if (resetPassword !== confirmPassword) {
      setResetError('New password and confirm password do not match.');
      setLoading(false);
      return;
    }

    const rules = [
      { met: resetPassword.length > 0 }, // required
      { met: resetPassword.length >= 8 }, // min 8
      { met: resetPassword.length <= 12 }, // max 12
      { met: /[A-Z]/.test(resetPassword) }, // uppercase
      { met: /[a-z]/.test(resetPassword) }, // lowercase
      { met: /\d/.test(resetPassword) }, // number
      { met: /[@#$%&*!?_\-]/.test(resetPassword) }, // special character
      { met: !/\s/.test(resetPassword) } // no spaces
    ];

    const allRulesMet = rules.every(rule => rule.met);
    if (!allRulesMet) {
      setResetError('Please satisfy all password validation conditions.');
      setLoading(false);
      return;
    }

    try {
      // 1. Update the public.hr_employees table password column
      let query;
      if (verifiedEmp && verifiedEmp.id) {
        query = supabase
          .from('hr_employees')
          .update({ password: resetPassword })
          .eq('id', verifiedEmp.id)
          .select();
      } else {
        query = supabase
          .from('hr_employees')
          .update({ password: resetPassword })
          .eq('email_id', verifiedEmp ? verifiedEmp.email_id : resetEmail.trim())
          .select();
      }

      const { data, error } = await query;

      if (error) {
        console.error('Reset password DB error:', error);
        setResetError('Failed to save the new password in the database: ' + error.message);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setResetError('Failed to update password: No matching record was updated in the database.');
        setLoading(false);
        return;
      }

      // Success
      setResetSuccess('Password has been successfully updated in the database!');
      setTimeout(() => {
        setEmail(resetEmail); // auto-fill the login email
        setFlowMode('login');
        setResetStep(1);
        setResetEmail('');
        setResetPassword('');
        setConfirmPassword('');
        setResetSuccess('');
        setResetError('');
        setVerifiedEmp(null);
      }, 1800);
    } catch (err) {
      console.error('Reset password catch error:', err);
      setResetError('An error occurred while resetting the password.');
    } finally {
      setLoading(false);
    }
  };

  // If already logged in, redirect
  useEffect(() => {
    if (localStorage.getItem('hr_isLoggedIn') === 'true') {
      window.location.href = '/hr_dashboard';
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
          <h2 className="portal-banner-title">HR Management</h2>
          <p className="portal-banner-text">Supervise recruitment onboarding, approve leaves, run payroll matrices, and maintain corporate staff directory profiles.</p>
        </div>
        <div className="portal-clock-wrapper">
          <span className="portal-clock-time">{formatTime(dateTime)}</span>
          <span className="portal-clock-date">{formatDate(dateTime)}</span>
        </div>
      </div>

      {/* Right Login Form & Forgot Password */}
      <div className="portal-right-form">
        <div className="portal-login-card">
          {flowMode === 'login' ? (
            <>
              <div className="portal-form-header">
                <img src={logo} alt="Company Logo" className="portal-brand-logo" style={{ height: '36px', marginBottom: '1.5rem' }} />
                <h3>HR Portal Login</h3>
                <p>Enter your human resources credentials to access the console.</p>
              </div>

              {errorMessage && <div className="portal-error-banner">{errorMessage}</div>}

              <form onSubmit={handleSubmit}>
                <div className="portal-form-group">
                  <label 
                    htmlFor="email" 
                    style={{
                      color: emailStatus === 'valid' ? '#22c55e' : (emailStatus === 'invalid' ? '#ef4444' : '#334155'),
                      fontWeight: 600,
                      transition: 'color 0.25s ease'
                    }}
                  >
                    Email Address {emailStatus === 'valid' && '✓'} {emailStatus === 'invalid' && '✗'}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="portal-input"
                    placeholder="hr@ssvs.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="portal-form-group" style={{ marginBottom: '0.75rem' }}>
                  <label htmlFor="password">Password</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className="portal-input"
                      placeholder="enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        color: '#64748b'
                      }}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setFlowMode('forgot');
                      setResetStep(1);
                      setResetEmail(email); // Prefill if they typed it
                      setResetError('');
                      setResetSuccess('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563eb',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <button type="submit" className="portal-submit-btn" disabled={loading}>
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="portal-form-header">
                <img src={logo} alt="Company Logo" className="portal-brand-logo" style={{ height: '36px', marginBottom: '1.5rem' }} />
                <h3>Reset Password</h3>
                <p>Create a secure password with string characters for your HR account.</p>
              </div>

              {resetError && <div className="portal-error-banner">{resetError}</div>}
              {resetSuccess && (
                <div style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#166534',
                  padding: '0.875rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '1.5rem'
                }}>
                  {resetSuccess}
                </div>
              )}

              {resetStep === 1 ? (
                <form onSubmit={handleVerifyEmail}>
                  <div className="portal-form-group">
                    <label htmlFor="reset-email">Email Address</label>
                    <input
                      type="email"
                      id="reset-email"
                      className="portal-input"
                      placeholder="Enter your registered email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>

                  <button type="submit" className="portal-submit-btn" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify Email'}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setFlowMode('login')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPassword}>
                  <div className="portal-form-group">
                    <label htmlFor="new-password">New Password</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type={showResetPassword ? 'text' : 'password'}
                        id="new-password"
                        className="portal-input"
                        placeholder="Enter new password"
                        value={resetPassword}
                        onChange={(e) => setResetPassword(e.target.value)}
                        disabled={loading}
                        required
                        style={{ paddingRight: '2.5rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowResetPassword(!showResetPassword)}
                        style={{
                          position: 'absolute',
                          right: '0.75rem',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          color: '#64748b'
                        }}
                      >
                        {showResetPassword ? (
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="portal-form-group" style={{ marginBottom: '0.5rem' }}>
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirm-password"
                        className="portal-input"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        required
                        style={{ paddingRight: '2.5rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: 'absolute',
                          right: '0.75rem',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          color: '#64748b'
                        }}
                      >
                        {showConfirmPassword ? (
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password validation grid: 4 columns x 2 rows = 8 conditions */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.4rem 0.8rem',
                    margin: '1rem 0 1.25rem 0',
                    padding: '0.8rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.72rem',
                    textAlign: 'left'
                  }}>
                    {[
                      { label: 'Password is required.', met: resetPassword.length > 0 },
                      { label: 'Minimum 8 characters.', met: resetPassword.length >= 8 },
                      { label: 'Maximum 12 characters.', met: resetPassword.length <= 12 && resetPassword.length > 0 },
                      { label: 'At least 1 uppercase.', met: /[A-Z]/.test(resetPassword) },
                      { label: 'At least 1 lowercase.', met: /[a-z]/.test(resetPassword) },
                      { label: 'At least 1 number.', met: /\d/.test(resetPassword) },
                      { label: 'At least 1 special char.', met: /[@#$%&*!?_\-]/.test(resetPassword) },
                      { label: 'No spaces allowed.', met: resetPassword.length > 0 && !/\s/.test(resetPassword) }
                    ].map((rule, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        color: rule.met ? '#16a34a' : '#64748b',
                        fontWeight: rule.met ? '600' : '400',
                        transition: 'all 0.15s ease'
                      }}>
                        <span style={{ fontSize: '0.8rem', lineHeight: 1 }}>
                          {rule.met ? '✅' : '⚪'}
                        </span>
                        <span>{rule.label}</span>
                      </div>
                    ))}
                  </div>

                  <button type="submit" className="portal-submit-btn" disabled={loading}>
                    {loading ? 'Saving...' : 'Reset Password'}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setResetStep(1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Back to Email Verification
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
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
                localStorage.setItem('hr_isLoggedIn', 'true');
                localStorage.setItem('hr_login_email', email);
                window.location.href = '/hr_dashboard';
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

export default HRLogin;
