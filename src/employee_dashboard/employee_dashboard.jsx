import React, { useState, useEffect } from 'react';
import './employee_dashboard.css';

// SVG Icons matching the sidebar and top header in the user request
const Icons = {
  // Top Header Icon: Employee stylized portrait (filled)
  EmployeeHeader: () => (
    <svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="6.5" r="4" />
      <path d="M12 12c-4 0-7 2-7 6v2h14v-2c0-4-3-7-7-7zm-4 5.5l4-2.5 4 2.5-4 1.5-4-1.5z" />
    </svg>
  ),
  // 1. Dashboard: Home
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  // 2. My Profile: User Outline
  MyProfile: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  // 3. My Tasks: Calendar checked
  MyTasks: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <polyline points="9 16 11 18 15 14" />
    </svg>
  ),
  // 4. My Projects: Checked Folder
  MyProjects: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      <polyline points="10 13 12 15 16 11" />
    </svg>
  ),
  // 5. Attendance: Clock
  Attendance: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  // 6. Leave Management: Briefcase / Office bag
  LeaveManagement: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  // 7. Timesheet: Sheet with details
  Timesheet: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <circle cx="7" cy="9" r="1" />
    </svg>
  ),
  // 8. Payslip: Dollar outline bill
  Payslip: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <circle cx="12" cy="15" r="2" />
    </svg>
  ),
  // 9. Team Chat: Bubble conversation
  TeamChat: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  // 10. My Documents: Folded sheet
  MyDocuments: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  // 11. Announcements: Megaphone
  Announcements: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  ),
  // 12. Calendar: Sheet outline
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  // 13. Reports: Analytics lines sheet
  Reports: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="13" x2="8" y2="13" />
      <line x1="12" y1="17" x2="8" y2="17" />
      <line x1="16" y1="15" x2="8" y2="15" />
    </svg>
  ),
  // 14. Support: Question mark circle
  Support: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  // 15. Settings: Gear
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
  )
};

// Sidebar Configuration (15 Options matching screenshot)
const SIDEBAR_ITEMS = [
  { name: 'Dashboard', icon: Icons.Dashboard },
  { name: 'My Profile', icon: Icons.MyProfile },
  { name: 'My Tasks', icon: Icons.MyTasks },
  { name: 'My Projects', icon: Icons.MyProjects },
  { name: 'Attendance', icon: Icons.Attendance },
  { name: 'Leave Management', icon: Icons.LeaveManagement },
  { name: 'Timesheet', icon: Icons.Timesheet },
  { name: 'Payslip', icon: Icons.Payslip },
  { name: 'Team Chat', icon: Icons.TeamChat },
  { name: 'My Documents', icon: Icons.MyDocuments },
  { name: 'Announcements', icon: Icons.Announcements },
  { name: 'Calendar', icon: Icons.Calendar },
  { name: 'Reports', icon: Icons.Reports },
  { name: 'Support', icon: Icons.Support },
  { name: 'Settings', icon: Icons.Settings }
];

function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  useEffect(() => {
    document.title = 'Employee Dashboard';
    if (localStorage.getItem('employee_isLoggedIn') !== 'true') {
      window.location.href = '/employee_login';
    }
  }, []);

  return (
    <div className="emp-dashboard-root">
      <div className="app-container">
        
        {/* --- SIDEBAR PANEL (Matching Screenshot layout) --- */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-header-icon">
              <Icons.EmployeeHeader />
            </div>
            <div className="sidebar-header-info">
              <h1 className="sidebar-title">Employee</h1>
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
          <header className="top-navbar">
            <div className="navbar-left">
              <button className="menu-toggle-btn" style={{ display: 'flex' }}>
                <Icons.Hamburger />
              </button>
              <div className="welcome-section">
                <h2 className="welcome-title">Welcome back, Rahul Sharma! 👋</h2>
                <p className="welcome-subtitle">Here's what's happening with your tasks today.</p>
              </div>
            </div>

            <div className="navbar-right">
              {/* Search Box */}
              <div className="nav-search-bar">
                <input type="text" placeholder="Search for tasks, documents, employees..." />
                <Icons.Search />
              </div>

              {/* Notification Bell with Badge of 5 */}
              <button className="nav-icon-btn">
                <Icons.Bell />
                <span className="notification-badge">5</span>
              </button>

              {/* Settings Icon */}
              <button className="nav-icon-btn">
                <Icons.Settings />
              </button>

              {/* Profile section with User SVG avatar icon */}
              <div 
                className="user-profile-capsule"
                onClick={() => {
                  if (window.confirm("Are you sure you want to log out of your workspace?")) {
                    localStorage.removeItem('employee_isLoggedIn');
                    localStorage.removeItem('employee_login_email');
                    window.location.href = '/employee_login';
                  }
                }}
              >
                <div className="avatar-circle">
                  <Icons.UserProfile />
                </div>
                <div className="user-info-text">
                  <span className="user-name-title">Rahul Sharma</span>
                  <span className="user-role-dept">Frontend Developer</span>
                </div>
                <Icons.ChevronDown />
              </div>
            </div>
          </header>

          {/* Empty Content Body */}
          <div className="content-body">
            {/* Displaying no data panels as requested */}
          </div>
        </main>

      </div>
    </div>
  );
}

export default EmployeeDashboard;
