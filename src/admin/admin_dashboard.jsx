import React, { useState } from 'react'
import logo from '../assets/company_portol_logo.png'
import './admin_login.css'

function AdminDashboard({ adminEmail }) {
  const [fullName, setFullName] = useState(() => {
    return localStorage.getItem('admin_fullName') || 'Admin User'
  })
  const [emailId, setEmailId] = useState(() => {
    return localStorage.getItem('admin_emailId') || adminEmail || 'Admin@ssvs.com'
  })
  const [avatarColor, setAvatarColor] = useState(() => {
    return localStorage.getItem('admin_avatarColor') || '#2563eb'
  })
  const [showDropdown, setShowDropdown] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  // Temporary state for the edit profile modal
  const [tempFullName, setTempFullName] = useState('')
  const [tempEmailId, setTempEmailId] = useState('')
  const [tempAvatarColor, setTempAvatarColor] = useState('')

  const sidebarData = [
    {
      category: 'MANAGEMENT',
      items: [
        { name: 'Employee Management', icon: 'employee' },
        { name: 'Attendance Management', icon: 'attendance' },
        { name: 'Task Management', icon: 'task' },
        { name: 'Project Management', icon: 'project' },
        { name: 'Leave Management', icon: 'leave' },
        { name: 'Team Communication', icon: 'communication' },
        { name: 'Meeting Management', icon: 'meeting' }
      ]
    },
    {
      category: 'WORKPLACE',
      items: [
        { name: 'Daily Work Report', icon: 'report' },
        { name: 'Timesheet Management', icon: 'timesheet' },
        { name: 'Document Management', icon: 'document' },
        { name: 'Company Announcements', icon: 'announcement' },
        { name: 'Knowledge Base', icon: 'knowledge' }
      ]
    },
    {
      category: 'PERFORMANCE & ANALYTICS',
      items: [
        { name: 'Performance Management', icon: 'performance' },
        { name: 'Reports & Analytics', icon: 'analytics' },
        { name: 'Employee Directory', icon: 'directory' }
      ]
    },
    {
      category: 'SYSTEM',
      items: [
        { name: 'Workflow Approvals', icon: 'workflow' },
        { name: 'Notification Center', icon: 'notification' },
        { name: 'Audit & Security', icon: 'security' },
        { name: 'System Settings', icon: 'settings' }
      ]
    }
  ]

  const getInitials = (name) => {
    if (!name) return 'A'
    const parts = name.trim().split(' ')
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name[0].toUpperCase()
  }

  const handleOpenEdit = () => {
    setTempFullName(fullName)
    setTempEmailId(emailId)
    setTempAvatarColor(avatarColor)
    setShowEditModal(true)
    setShowDropdown(false)
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    setFullName(tempFullName)
    setEmailId(tempEmailId)
    setAvatarColor(tempAvatarColor)

    // Persist details in localStorage
    localStorage.setItem('admin_fullName', tempFullName)
    localStorage.setItem('admin_emailId', tempEmailId)
    localStorage.setItem('admin_avatarColor', tempAvatarColor)

    setShowEditModal(false)
  }

  const renderIcon = (type) => {
    switch (type) {
      case 'dashboard':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9"></rect>
            <rect x="14" y="3" width="7" height="5"></rect>
            <rect x="14" y="12" width="7" height="9"></rect>
            <rect x="3" y="16" width="7" height="5"></rect>
          </svg>
        )
      case 'employee':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        )
      case 'attendance':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        )
      case 'task':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
        )
      case 'project':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
        )
      case 'leave':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <path d="M8 14h8v4H8z"></path>
          </svg>
        )
      case 'communication':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )
      case 'meeting':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        )
      case 'report':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        )
      case 'timesheet':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        )
      case 'document':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        )
      case 'announcement':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        )
      case 'knowledge':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z"></path>
          </svg>
        )
      case 'performance':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 6l-9.5 9.5-5-5L1 18"></path>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
        )
      case 'analytics':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
        )
      case 'directory':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="4"></line>
            <line x1="8" y1="2" x2="8" y2="4"></line>
            <circle cx="12" cy="10" r="3"></circle>
            <path d="M8 16c0-2.5 1.5-4 4-4s4 1.5 4 4"></path>
          </svg>
        )
      case 'workflow':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        )
      case 'notification':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        )
      case 'security':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        )
      case 'settings':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar Panel */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="Company Portol Logo" className="sidebar-logo" />
        </div>

        <div className="sidebar-menu">
          {/* Active Dashboard Button */}
          <div className="menu-item active">
            {renderIcon('dashboard')}
            <span>Dashboard</span>
          </div>

          {/* Categorized Menu Sections */}
          {sidebarData.map((section, idx) => (
            <div key={idx} className="menu-section">
              <span className="section-title">{section.category}</span>
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="menu-item">
                  {renderIcon(item.icon)}
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        {/* Top Header Bar */}
        <div className="top-header">
          {/* Hamburger Menu & Page Title */}
          <div className="header-left">
            <button className="hamburger-btn">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div className="header-title-area">
              <h2>Admin Dashboard</h2>
              <p>Welcome back! Here's what's happening in your organization.</p>
            </div>
          </div>

          {/* Search Input */}
          <div className="header-middle">
            <div className="search-wrapper">
              <div className="search-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input type="text" className="search-input" placeholder="Search employees, tasks, projects..." />
            </div>
          </div>

          {/* Icons & Profile Section */}
          <div className="header-right">
            {/* Calendar / Date */}
            <div className="header-meta-date">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{new Date().toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric', weekday: 'long' })}</span>
            </div>

            {/* Notification Bell */}
            <button className="icon-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="notification-badge">12</span>
            </button>

            {/* Settings Gear */}
            <button className="icon-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>

            {/* Profile Section Dropdown toggle */}
            <div className={`profile-section ${showDropdown ? 'open' : ''}`} onClick={() => setShowDropdown(!showDropdown)}>
              <div className="avatar-wrapper">
                <div 
                  className="avatar-img" 
                  style={{
                    backgroundColor: avatarColor,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase'
                  }}
                >
                  {getInitials(fullName)}
                </div>
                <span className="status-dot"></span>
              </div>
              <div className="profile-meta">
                <span className="profile-name">{fullName}</span>
                <span className="profile-role">Super Admin</span>
              </div>
              <span className="chevron-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>

              {/* Profile Dropdown Menu */}
              {showDropdown && (
                <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
                  <button className="dropdown-item" onClick={handleOpenEdit}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path>
                    </svg>
                    Edit Profile
                  </button>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item" 
                    onClick={() => {
                      localStorage.removeItem('admin_isLoggedIn')
                      localStorage.removeItem('admin_login_email')
                      window.location.reload()
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Dashboard Body */}
        <div className="dashboard-body">
          {/* Metrics Row */}
          <div className="metrics-row">
            {/* Card 1: Total Employee */}
            <div className="metric-card">
              <div className="metric-icon-wrapper" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="metric-info">
                <span className="metric-value">0</span>
                <span className="metric-label">Total Employee</span>
              </div>
            </div>

            {/* Card 2: Present Today */}
            <div className="metric-card">
              <div className="metric-icon-wrapper" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div className="metric-info">
                <span className="metric-value">0</span>
                <span className="metric-label">Present Today</span>
              </div>
            </div>

            {/* Card 3: Total Tasks */}
            <div className="metric-card">
              <div className="metric-icon-wrapper" style={{ backgroundColor: '#faf5ff', color: '#7c3aed' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </div>
              <div className="metric-info">
                <span className="metric-value">0</span>
                <span className="metric-label">Total Tasks</span>
              </div>
            </div>

            {/* Card 4: Leave of Employees */}
            <div className="metric-card">
              <div className="metric-icon-wrapper" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                  <line x1="8" y1="14" x2="16" y2="14"></line>
                </svg>
              </div>
              <div className="metric-info">
                <span className="metric-value">0</span>
                <span className="metric-label">Leave of Employees</span>
              </div>
            </div>

            {/* Card 5: New Employee */}
            <div className="metric-card">
              <div className="metric-icon-wrapper" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <line x1="19" y1="8" x2="19" y2="14"></line>
                  <line x1="16" y1="11" x2="22" y2="11"></line>
                </svg>
              </div>
              <div className="metric-info">
                <span className="metric-value">0</span>
                <span className="metric-label">New Employee</span>
              </div>
            </div>

            {/* Card 6: Announcements */}
            <div className="metric-card">
              <div className="metric-icon-wrapper" style={{ backgroundColor: '#fff1f2', color: '#e11d48' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <div className="metric-info">
                <span className="metric-value">0</span>
                <span className="metric-label">Announcements</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Admin Profile</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSaveProfile}>
              <div className="modal-body">
                {/* Avatar Preview & Color Select */}
                <div className="avatar-edit-section">
                  <div className="avatar-preview-wrapper">
                    <div 
                      className="avatar-preview-img"
                      style={{
                        backgroundColor: tempAvatarColor,
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1.75rem',
                        height: '100%',
                        borderRadius: '50%'
                      }}
                    >
                      {getInitials(tempFullName)}
                    </div>
                  </div>
                  
                  <span className="avatar-options-label">Select Avatar Color</span>
                  <div className="avatar-options">
                    {[
                      { color: '#2563eb', name: 'Blue' },
                      { color: '#10b981', name: 'Green' },
                      { color: '#f97316', name: 'Orange' },
                      { color: '#8b5cf6', name: 'Purple' },
                      { color: '#f43f5e', name: 'Rose' }
                    ].map((opt) => (
                      <button
                        key={opt.color}
                        type="button"
                        className={`avatar-option-btn ${tempAvatarColor === opt.color ? 'active' : ''}`}
                        style={{ backgroundColor: opt.color }}
                        onClick={() => setTempAvatarColor(opt.color)}
                        title={opt.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Full Name */}
                <div className="form-group">
                  <label htmlFor="modal-fullname">Full Name</label>
                  <input
                    type="text"
                    id="modal-fullname"
                    className="modal-input"
                    value={tempFullName}
                    onChange={(e) => setTempFullName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                {/* Email (Mail ID prefilled with login mail) */}
                <div className="form-group">
                  <label htmlFor="modal-email">Email ID (Login Mail)</label>
                  <input
                    type="email"
                    id="modal-email"
                    className="modal-input"
                    value={tempEmailId}
                    onChange={(e) => setTempEmailId(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
