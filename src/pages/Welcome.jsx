import React from 'react'
import logo from '../assets/company_portol_logo.png'
import './Welcome.css'

function Welcome({ onAnimationComplete }) {
  const line1 = 'welcome to Company'
  const line2 = 'Portol'

  React.useEffect(() => {
    // 6 seconds timer (gives time for splash overlay and text animation to finish)
    const timer = setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete()
      }
    }, 6000)
    return () => clearTimeout(timer)
  }, [onAnimationComplete])

  return (
    <div className="welcome-container">
      {/* Starting Splash Loader Animation */}
      <div className="splash-overlay">
        <div className="loader-ring"></div>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        {/* Company Logo */}
        <img src={logo} alt="Company Portol Logo" className="company-logo" />

        {/* Welcome Image (hides automatically if not found/created yet) */}
        <img 
          src="/src/assets/welcome_to_portol.png" 
          alt="Welcome to Portol Graphic" 
          className="welcome-image"
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />

        {/* Welcome Text Animated Letter-by-Letter */}
        <div className="letter-container">
          <div className="letter-row">
            {line1.split('').map((char, index) => (
              <span
                key={`l1-${index}`}
                className={char === ' ' ? 'space' : 'letter'}
                style={{ animationDelay: `${2.5 + index * 0.08}s` }}
              >
                {char}
              </span>
            ))}
          </div>
          <div className="letter-row">
            {line2.split('').map((char, index) => {
              const delayIndex = line1.length + index
              return (
                <span
                  key={`l2-${index}`}
                  className={char === ' ' ? 'space' : 'letter'}
                  style={{ animationDelay: `${2.5 + delayIndex * 0.08}s` }}
                >
                  {char}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      {/* Skip Button */}
      <button 
        onClick={onAnimationComplete} 
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          background: 'transparent',
          border: '1px solid rgba(15, 23, 42, 0.1)',
          color: '#64748b',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.85rem',
          zIndex: 20,
          fontFamily: 'inherit',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(15, 23, 42, 0.03)'
          e.target.style.borderColor = 'rgba(15, 23, 42, 0.2)'
          e.target.style.color = '#0f172a'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'transparent'
          e.target.style.borderColor = 'rgba(15, 23, 42, 0.1)'
          e.target.style.color = '#64748b'
        }}
      >
        Skip Intro
      </button>
    </div>
  )
}

export default Welcome
