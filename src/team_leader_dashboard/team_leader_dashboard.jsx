import React, { useState, useEffect } from 'react';
import './team_leader_dashboard.css';
import { supabase } from '../supabaseClient';

// SVG Icons matching the sidebar and top header in the user request
const Icons = {
  // Top Header Icon: Team Leader & Team shapes
  TeamLeaderHeader: () => (
    <svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="6.5" r="3.5" />
      <path d="M12 11c-2.33 0-7 1.17-7 3.5V16h14v-1.5c0-2.33-4.67-3.5-7-3.5z" />
      <circle cx="5" cy="14" r="2" />
      <path d="M5 16.5c-.8 0-2.5.4-2.5 1.2v.8h5v-.8c0-.8-1.7-1.2-2.5-1.2z" />
      <circle cx="19" cy="14" r="2" />
      <path d="M19 16.5c-.8 0-2.5.4-2.5 1.2v.8h5v-.8c0-.8-1.7-1.2-2.5-1.2z" />
    </svg>
  ),
  // 1. Dashboard: Grid Layout
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  // 2. My Team: Double user outline
  MyTeam: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  // 3. Task Management: Checklist/Document check
  TaskManagement: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  // 4. Project Management: Folder
  ProjectManagement: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  // 5. Team Attendance: Clock
  TeamAttendance: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  // 6. Leave Requests: Calendar sheet
  LeaveRequests: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <polyline points="9 16 11 18 15 14" />
    </svg>
  ),
  // 7. Team Chat: Bubble conversations
  TeamChat: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  // 8. Reports & Analytics: Bar Chart
  ReportsAnalytics: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  // 9. Calendar: Grid calendar
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  // 10. Announcements: Megaphone
  Announcements: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  ),
  // 11. My Documents: File text sheet
  MyDocuments: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  // 12. Settings: Gear
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  // Hamburger menu toggle
  Hamburger: () => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  ),
  // Search icon
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
  // Bell Icon
  Bell: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  // Circular user placeholder icon (avatar replacement)
  UserProfile: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  // Calendar mini
  CalendarMini: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
};

// Sidebar Configuration
const SIDEBAR_ITEMS = [
  { name: 'Dashboard', icon: Icons.Dashboard },
  { name: 'My Team', icon: Icons.MyTeam },
  { name: 'Task Management', icon: Icons.TaskManagement },
  { name: 'Project Management', icon: Icons.ProjectManagement },
  { name: 'Team Attendance', icon: Icons.TeamAttendance },
  { name: 'Leave Requests', icon: Icons.LeaveRequests },
  { name: 'Team Chat', icon: Icons.TeamChat },
  { name: 'Reports & Analytics', icon: Icons.ReportsAnalytics },
  { name: 'Calendar', icon: Icons.Calendar },
  { name: 'Announcements', icon: Icons.Announcements },
  { name: 'My Documents', icon: Icons.MyDocuments },
  { name: 'Settings', icon: Icons.Settings }
];

function TeamLeaderDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [tlDetails, setTlDetails] = useState({
    id: null,
    leaderId: 'TL-000',
    fullName: 'Team Leader',
    emailId: 'tl@company.com',
    phoneNumber: 'N/A',
    designation: 'Project Manager',
    department: 'Operations',
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
    if (!name) return 'TL';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  useEffect(() => {
    document.title = 'Team Leader Dashboard';
    const loggedInEmail = localStorage.getItem('tl_login_email');
    if (localStorage.getItem('tl_isLoggedIn') !== 'true' || !loggedInEmail) {
      window.location.href = '/team_leader_login';
      return;
    }

    const fetchTLDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('team_leaders')
          .select('id, leader_id, full_name, email_id, phone_number, designation, department, joining_date')
          .ilike('email_id', loggedInEmail.trim())
          .maybeSingle();

        if (error) {
          console.error('Error fetching Team Leader details:', error);
        } else if (data) {
          setTlDetails({
            id: data.id,
            leaderId: data.leader_id,
            fullName: data.full_name,
            emailId: data.email_id,
            phoneNumber: data.phone_number,
            designation: data.designation,
            department: data.department,
            joiningDate: data.joining_date
          });
        }
      } catch (err) {
        console.error('Catch fetching Team Leader details:', err);
      }
    };

    fetchTLDetails();
  }, []);

  return (
    <div className="tl-dashboard-root">
      <div className="app-container">
        
        {/* --- SIDEBAR PANEL --- */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-header-icon">
              <Icons.TeamLeaderHeader />
            </div>
            <div className="sidebar-header-info">
              <h1 className="sidebar-title">Team Leader</h1>
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

        {/* --- MAIN CONTENT AREA WITH HEADER ONLY --- */}
        <main className="main-content">
          
          {/* Top Header Navbar */}
          <div className="top-navbar-container">
            <header className="top-navbar">
              <div className="navbar-left">
                <button className="menu-toggle-btn" style={{ display: 'flex' }}>
                  <Icons.Hamburger />
                </button>
                <div className="welcome-section">
                  <h2 className="welcome-title">Welcome back, {tlDetails.fullName}! 👋</h2>
                  <p className="welcome-subtitle">Here's an overview of your team's progress and activities.</p>
                </div>
              </div>

              <div className="navbar-right">
                {/* Search Box */}
                <div className="nav-search-bar">
                  <input type="text" placeholder="Search tasks, projects, team members..." />
                  <Icons.Search />
                </div>

                {/* Notification Bell with Badge of 8 */}
                <button className="nav-icon-btn">
                  <Icons.Bell />
                  <span className="notification-badge">8</span>
                </button>

                {/* Settings Icon */}
                <button className="nav-icon-btn">
                  <Icons.Settings />
                </button>

                {/* Profile section with initials avatar & status dot */}
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
                      {getInitials(tlDetails.fullName)}
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
                      {tlDetails.fullName}
                    </span>
                    <span className="user-role-dept" style={{ color: '#64748b', fontSize: '0.725rem' }}>
                      {tlDetails.designation}
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
                          if (window.confirm("Are you sure you want to log out of the Team Leader portal?")) {
                            localStorage.removeItem('tl_isLoggedIn');
                            localStorage.removeItem('tl_login_email');
                            window.location.href = '/team_leader_login';
                          }
                        }}
                        style={{ color: '#ef4444' }}
                      >
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                      </button>

                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Bottom Metadata row displaying date */}
            <div className="metadata-row">
              <div className="meta-date-badge">
                <Icons.CalendarMini />
                <span>{new Date().toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })}</span>
              </div>
            </div>
          </div>

          {/* Empty Content Body */}
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
                Team Leader Profile Details
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
                    backgroundColor: '#4f46e5', // Royal indigo circle for TL
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1.4rem'
                  }}
                >
                  {getInitials(tlDetails.fullName)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                    {tlDetails.fullName}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: '#4f46e5', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {tlDetails.designation}
                  </span>
                </div>
              </div>

              {/* Profile Fields List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Leader ID:</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{tlDetails.leaderId || 'N/A'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Department:</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{tlDetails.department || 'N/A'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Email Address:</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{tlDetails.emailId}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Mobile Number:</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{tlDetails.phoneNumber || 'N/A'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b', fontWeight: 500 }}>Joining Date:</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>
                    {tlDetails.joiningDate ? new Date(tlDetails.joiningDate).toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
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
                  background: '#4f46e5',
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

export default TeamLeaderDashboard;
