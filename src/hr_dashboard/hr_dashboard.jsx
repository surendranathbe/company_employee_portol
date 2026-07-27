import React, { useState, useEffect } from 'react';
import './hr_dashboard.css';
import { supabase } from '../supabaseClient';

// SVG Icons matching the sidebar and top header in the user request
const Icons = {
  // Top Header Icon: Group of Users (filled)
  HrManagement: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 1.34 5 3s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  ),
  // 1. Dashboard: Globe
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  // 2. Employee Management: Multi-user outline
  EmployeeManagement: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  // 3. Department Management: Organization layout/grid
  DepartmentManagement: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="5" rx="1" />
      <rect x="2" y="14" width="6" height="5" rx="1" />
      <rect x="16" y="14" width="6" height="5" rx="1" />
      <path d="M12 7v5M5 12h14v2" />
    </svg>
  ),
  // 4. Leave Management: Calendar with a checkmark
  LeaveManagement: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <polyline points="9 16 11 18 15 14" />
    </svg>
  ),
  // 5. Attendance Overview: Calendar with cross/x
  AttendanceOverview: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="10" y1="14" x2="14" y2="18" />
      <line x1="14" y1="14" x2="10" y2="18" />
    </svg>
  ),
  // 6. Payroll Management: Credit Card / Percent Tax
  PayrollManagement: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <circle cx="9.5" cy="14.5" r="1.5" />
      <circle cx="14.5" cy="14.5" r="1.5" />
      <line x1="14" y1="13" x2="10" y2="16" />
    </svg>
  ),
  // 7. Recruitment: Shield with outline user or target
  Recruitment: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <circle cx="12" cy="10" r="3" />
      <path d="M8 15c0-1.5 1.5-2 4-2s4 .5 4 2" />
    </svg>
  ),
  // 8. Training & Development: Mortarboard hat
  TrainingDevelopment: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  ),
  // 9. Employee Documents: Page text with folded corner
  EmployeeDocuments: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <circle cx="7" cy="9" r="1" />
    </svg>
  ),
  // 10. Reports: Analytics bar chart
  Reports: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  // 11. Announcements: Megaphone
  Announcements: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  ),
  // 12. Settings: Gear
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  // Hamburger menu lines icon
  Hamburger: () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  ),
  // Search magnifying glass
  Search: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  // Chevron Down
  ChevronDown: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  ),
  // User Placeholder (Avatar profile fallback icon)
  UserProfile: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
};

// Sidebar Configuration
const SIDEBAR_ITEMS = [
  { name: 'Dashboard', icon: Icons.Dashboard },
  { name: 'Employee Management', icon: Icons.EmployeeManagement },
  { name: 'Department Management', icon: Icons.DepartmentManagement },
  { name: 'Leave Management', icon: Icons.LeaveManagement },
  { name: 'Attendance Overview', icon: Icons.AttendanceOverview },
  { name: 'Payroll Management', icon: Icons.PayrollManagement },
  { name: 'Recruitment', icon: Icons.Recruitment },
  { name: 'Training & Development', icon: Icons.TrainingDevelopment },
  { name: 'Employee Documents', icon: Icons.EmployeeDocuments },
  { name: 'Reports', icon: Icons.Reports },
  { name: 'Announcements', icon: Icons.Announcements },
  { name: 'Settings', icon: Icons.Settings }
];

function HRDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [hrDetails, setHrDetails] = useState({
    id: null,
    hrEmployeeId: 'HR-000',
    fullName: 'HR Manager',
    emailId: 'hr@company.com',
    phoneNumber: 'N/A',
    designation: 'HR Professional',
    department: 'Human Resources',
    joiningDate: ''
  });

  // Global click listener to close profile dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.user-profile-capsule')) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'HR';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  useEffect(() => {
    document.title = 'HR Dashboard';
    const loggedInEmail = localStorage.getItem('hr_login_email');
    if (localStorage.getItem('hr_isLoggedIn') !== 'true' || !loggedInEmail) {
      window.location.href = '/hr_login';
      return;
    }

    const fetchHRDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('hr_employees')
          .select('id, hr_employee_id, full_name, email_id, phone_number, designation, department, joining_date')
          .ilike('email_id', loggedInEmail.trim())
          .maybeSingle();

        if (error) {
          console.error('Error fetching HR details:', error);
        } else if (data) {
          setHrDetails({
            id: data.id,
            hrEmployeeId: data.hr_employee_id,
            fullName: data.full_name,
            emailId: data.email_id,
            phoneNumber: data.phone_number,
            designation: data.designation,
            department: data.department,
            joiningDate: data.joining_date
          });
        }
      } catch (err) {
        console.error('Catch fetching HR details:', err);
      }
    };

    fetchHRDetails();
  }, []);

  return (
    <div className="hr-dashboard-root">
      <div className="app-container">
        
        {/* --- SIDEBAR PANEL --- */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-header-icon">
              <Icons.HrManagement />
            </div>
            <div className="sidebar-header-info">
              <h1 className="sidebar-title">HR Management</h1>
              <span className="sidebar-subtitle">Dashboard</span>
            </div>
          </div>

          <nav className="sidebar-menu">
            {SIDEBAR_ITEMS.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.name}
                  className={`menu-item ${activeTab === item.name ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.name)}
                >
                  <IconComp />
                  <span>{item.name}</span>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* --- MAIN CONTENT AREA WITH HEADER NAVBAR ONLY --- */}
        <main className="main-content">
          
          {/* Top Header Navbar */}
          <header className="top-navbar">
            <div className="navbar-left">
              <button className="menu-toggle-btn" style={{ display: 'flex' }}>
                <Icons.Hamburger />
              </button>
            </div>

            <div className="navbar-right">
              {/* Search Bar */}
              <div className="nav-search-bar">
                <input type="text" placeholder="Search employees, documents, requests..." />
                <Icons.Search />
              </div>

              {/* Notification Bell Icon with Badge of 6 */}
              <button className="nav-icon-btn">
                <Icons.Settings /> {/* Bell placeholder if wanted, but let's use actual bell or Settings */}
              </button>

              <button className="nav-icon-btn">
                {/* Bell Icon */}
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="notification-badge">6</span>
              </button>

              {/* Settings Gear Icon */}
              <button className="nav-icon-btn">
                <Icons.Settings />
              </button>

              {/* User Profile Info section with SVG icon placeholder */}
              <div 
                className="user-profile-capsule"
                style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <div 
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: '#2563eb', // Blue avatar matching reference image
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textTransform: 'uppercase'
                    }}
                  >
                    {getInitials(hrDetails.fullName)}
                  </div>
                  <span 
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '10px',
                      height: '10px',
                      backgroundColor: '#10b981', // Green status dot
                      border: '2px solid #ffffff',
                      borderRadius: '50%'
                    }}
                  ></span>
                </div>
                
                <div className="user-info-text">
                  <span className="user-name-title" style={{ fontWeight: 600, color: '#0f172a' }}>
                    {hrDetails.fullName}
                  </span>
                  <span className="user-role-dept" style={{ color: '#64748b', fontSize: '0.725rem' }}>
                    {hrDetails.designation}
                  </span>
                </div>
                <Icons.ChevronDown />

                {showProfileDropdown && (
                  <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
                    
                    {/* View Profile Details */}
                    <button 
                      className="dropdown-item" 
                      onClick={() => {
                        setShowProfileModal(true);
                        setShowProfileDropdown(false);
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <circle cx="7" cy="9" r="1" />
                      </svg>
                      View Profile Details
                    </button>

                    <div className="dropdown-divider"></div>

                    {/* Logout */}
                    <button 
                      className="dropdown-item" 
                      onClick={() => {
                        if (window.confirm("Are you sure you want to log out of the HR portal?")) {
                          localStorage.removeItem('hr_isLoggedIn');
                          localStorage.removeItem('hr_login_email');
                          window.location.href = '/hr_login';
                        }
                      }}
                      style={{ color: '#ef4444' }}
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      <span>Logout</span>
                    </button>

                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Empty content-body */}
          <div className="content-body">
            {/* Displaying no data panels as requested */}
          </div>
        </main>

      </div>

      {showProfileModal && (
        <div 
          className="modal-overlay" 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowProfileModal(false)}
        >
          <div 
            className="profile-modal" 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              boxShadow: '0 25px 50px rgba(15, 23, 42, 0.15)',
              width: '90%',
              maxWidth: '480px',
              overflow: 'hidden'
            }}
          >
            <div 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #e2e8f0'
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                HR Employee Profile Details
              </h3>
              <button 
                onClick={() => setShowProfileModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  lineHeight: 1
                }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Profile Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem' }}>
                <div 
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#0ba856',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1.4rem'
                  }}
                >
                  {getInitials(hrDetails.fullName)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                    {hrDetails.fullName}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: '#0ba856', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {hrDetails.designation}
                  </span>
                </div>
              </div>

              {/* Profile Fields List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>HR Employee ID:</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{hrDetails.hrEmployeeId || 'N/A'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Department:</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{hrDetails.department || 'N/A'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Email Address:</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{hrDetails.emailId}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Mobile Number:</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{hrDetails.phoneNumber || 'N/A'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Joining Date:</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>
                    {hrDetails.joiningDate ? new Date(hrDetails.joiningDate).toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                  </span>
                </div>

              </div>

            </div>

            <div 
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '1rem 1.5rem',
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #e2e8f0'
              }}
            >
              <button 
                onClick={() => setShowProfileModal(false)}
                style={{
                  padding: '0.55rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#0ba856',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      </div>
  );
}

export default HRDashboard;
