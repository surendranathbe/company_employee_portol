import React, { useState, useEffect } from 'react'
import logo from '../assets/company_portol_logo.png'
import { supabase } from '../supabaseClient'
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [showHRForm, setShowHRForm] = useState(false)
  const [hrEmployees, setHrEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem('hr_employees')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [hrFormData, setHrFormData] = useState({
    employeeId: '',
    fullName: '',
    emailId: '',
    phoneNumber: '',
    designation: '',
    joiningDate: '',
    department: ''
  })
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All')

  // Team Leader specific states
  const [showTLForm, setShowTLForm] = useState(false)
  const [teamLeaders, setTeamLeaders] = useState(() => {
    try {
      const saved = localStorage.getItem('team_leaders')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [tlFormData, setTlFormData] = useState({
    leaderId: '',
    fullName: '',
    emailId: '',
    phoneNumber: '',
    designation: 'Project Manager',
    joiningDate: '',
    department: ''
  })
  const [selectedTLDeptFilter, setSelectedTLDeptFilter] = useState('All')

  // Generate automatic unique HR Employee ID based on maximum current numeric ID
  const generateHREmployeeId = (employeesList) => {
    if (!employeesList || employeesList.length === 0) return 'HR-001';
    const numericParts = employeesList.map(emp => {
      const idStr = emp.employeeId || '';
      const match = idStr.match(/HR-(\d+)/i);
      return match ? parseInt(match[1], 10) : 0;
    });
    const max = Math.max(...numericParts, 0);
    return `HR-${String(max + 1).padStart(3, '0')}`;
  };

  // Generate automatic unique Team Leader ID based on maximum current numeric ID
  const generateTeamLeaderId = (leadersList) => {
    if (!leadersList || leadersList.length === 0) return 'TL-001';
    const numericParts = leadersList.map(tl => {
      const idStr = tl.leaderId || '';
      const match = idStr.match(/TL-(\d+)/i);
      return match ? parseInt(match[1], 10) : 0;
    });
    const max = Math.max(...numericParts, 0);
    return `TL-${String(max + 1).padStart(3, '0')}`;
  };

  // Fetch HR Employees & Team Leaders from Supabase database on component mount
  useEffect(() => {
    const fetchHREmployees = async () => {
      try {
        const { data, error } = await supabase
          .from('hr_employees')
          .select('*')
          .order('id', { ascending: true })

        if (error) {
          console.error('Error fetching HR employees:', error)
        } else if (data) {
          const mapped = data.map(item => ({
            id: item.id,
            employeeId: item.hr_employee_id,
            fullName: item.full_name,
            emailId: item.email_id,
            phoneNumber: item.phone_number,
            designation: item.designation,
            joiningDate: item.joining_date,
            department: item.department
          }))
          setHrEmployees(mapped)
          localStorage.setItem('hr_employees', JSON.stringify(mapped))
        }
      } catch (err) {
        console.error('Catch fetching error:', err)
      }
    }

    const fetchTeamLeaders = async () => {
      try {
        const { data, error } = await supabase
          .from('team_leaders')
          .select('*')
          .order('id', { ascending: true })

        if (error) {
          console.error('Error fetching team leaders:', error)
        } else if (data) {
          const mapped = data.map(item => ({
            id: item.id,
            leaderId: item.leader_id,
            fullName: item.full_name,
            emailId: item.email_id,
            phoneNumber: item.phone_number,
            designation: item.designation,
            joiningDate: item.joining_date,
            department: item.department
          }))
          setTeamLeaders(mapped)
          localStorage.setItem('team_leaders', JSON.stringify(mapped))
        }
      } catch (err) {
        console.error('Catch fetching TL error:', err)
      }
    }

    fetchHREmployees()
    fetchTeamLeaders()
  }, [])

  // Auto-generate employeeId when showHRForm becomes true
  useEffect(() => {
    if (showHRForm) {
      setHrFormData(prev => ({
        ...prev,
        employeeId: generateHREmployeeId(hrEmployees)
      }))
    }
  }, [showHRForm, hrEmployees])

  // Auto-generate leaderId when showTLForm becomes true
  useEffect(() => {
    if (showTLForm) {
      setTlFormData(prev => ({
        ...prev,
        leaderId: generateTeamLeaderId(teamLeaders)
      }))
    }
  }, [showTLForm, teamLeaders])

  const handleHRSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('hr_employees')
        .insert([{
          hr_employee_id: hrFormData.employeeId,
          full_name: hrFormData.fullName,
          email_id: hrFormData.emailId,
          phone_number: hrFormData.phoneNumber,
          designation: hrFormData.designation,
          joining_date: hrFormData.joiningDate,
          department: hrFormData.department
        }])
        .select()

      if (error) {
        console.error('Error saving HR employee:', error)
        alert('Failed to save HR Employee: ' + error.message)
        return
      }

      if (data && data.length > 0) {
        const newEmp = {
          id: data[0].id,
          employeeId: data[0].hr_employee_id,
          fullName: data[0].full_name,
          emailId: data[0].email_id,
          phoneNumber: data[0].phone_number,
          designation: data[0].designation,
          joiningDate: data[0].joining_date,
          department: data[0].department
        }
        const updated = [...hrEmployees, newEmp]
        setHrEmployees(updated)
        localStorage.setItem('hr_employees', JSON.stringify(updated))
      }

      setHrFormData({
        employeeId: '',
        fullName: '',
        emailId: '',
        phoneNumber: '',
        designation: '',
        joiningDate: '',
        department: ''
      })
      setShowHRForm(false)
    } catch (err) {
      console.error('Catch saving HR employee error:', err)
      alert('An unexpected database error occurred.')
    }
  }

  const handleHRDelete = async (index) => {
    const empToDelete = hrEmployees[index]
    if (!empToDelete) return

    const confirmDelete = window.confirm(`Are you sure you want to delete HR Employee ${empToDelete.fullName}?`)
    if (!confirmDelete) return

    if (empToDelete.id) {
      try {
        const { error } = await supabase
          .from('hr_employees')
          .delete()
          .eq('id', empToDelete.id)

        if (error) {
          console.error('Error deleting HR employee:', error)
          alert('Failed to delete HR Employee: ' + error.message)
          return
        }
      } catch (err) {
        console.error('Catch deleting HR employee error:', err)
        alert('An unexpected database error occurred.')
        return
      }
    }

    const updated = hrEmployees.filter((_, i) => i !== index)
    setHrEmployees(updated)
    localStorage.setItem('hr_employees', JSON.stringify(updated))
  }

  const handleTLSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('team_leaders')
        .insert([{
          leader_id: tlFormData.leaderId,
          full_name: tlFormData.fullName,
          email_id: tlFormData.emailId,
          phone_number: tlFormData.phoneNumber,
          designation: tlFormData.designation,
          joining_date: tlFormData.joiningDate,
          department: tlFormData.department
        }])
        .select()

      if (error) {
        console.error('Error saving team leader:', error)
        alert('Failed to save Team Leader: ' + error.message)
        return
      }

      if (data && data.length > 0) {
        const newTL = {
          id: data[0].id,
          leaderId: data[0].leader_id,
          fullName: data[0].full_name,
          emailId: data[0].email_id,
          phoneNumber: data[0].phone_number,
          designation: data[0].designation,
          joiningDate: data[0].joining_date,
          department: data[0].department
        }
        const updated = [...teamLeaders, newTL]
        setTeamLeaders(updated)
        localStorage.setItem('team_leaders', JSON.stringify(updated))
      }

      setTlFormData({
        leaderId: '',
        fullName: '',
        emailId: '',
        phoneNumber: '',
        designation: 'Project Manager',
        joiningDate: '',
        department: ''
      })
      setShowTLForm(false)
    } catch (err) {
      console.error('Catch saving team leader error:', err)
      alert('An unexpected database error occurred.')
    }
  }

  const handleTLDelete = async (index) => {
    const tlToDelete = teamLeaders[index]
    if (!tlToDelete) return

    const confirmDelete = window.confirm(`Are you sure you want to delete Team Leader ${tlToDelete.fullName}?`)
    if (!confirmDelete) return

    if (tlToDelete.id) {
      try {
        const { error } = await supabase
          .from('team_leaders')
          .delete()
          .eq('id', tlToDelete.id)

        if (error) {
          console.error('Error deleting team leader:', error)
          alert('Failed to delete Team Leader: ' + error.message)
          return
        }
      } catch (err) {
        console.error('Catch deleting team leader error:', err)
        alert('An unexpected database error occurred.')
        return
      }
    }

    const updated = teamLeaders.filter((_, i) => i !== index)
    setTeamLeaders(updated)
    localStorage.setItem('team_leaders', JSON.stringify(updated))
  }

  // Temporary state for the edit profile modal
  const [tempFullName, setTempFullName] = useState('')
  const [tempEmailId, setTempEmailId] = useState('')
  const [tempAvatarColor, setTempAvatarColor] = useState('')

  // Interactive Analytics Page filter states
  const [filterDate, setFilterDate] = useState('All')
  const [filterMonth, setFilterMonth] = useState('All')
  const [filterQuarter, setFilterQuarter] = useState('All')
  const [filterYear, setFilterYear] = useState('2026')

  const sidebarData = [
    {
      category: 'MANAGEMENT',
      items: [
        { name: 'Total Employee', icon: 'add' },
        { name: 'Add HR', icon: 'add_hr' },
        { name: 'Add Team Leader', icon: 'add_tl' },
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
      case 'add':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="19" y1="8" x2="19" y2="14"></line>
            <line x1="16" y1="11" x2="22" y2="11"></line>
          </svg>
        )
      case 'add_hr':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M16 11l2 2 4-4"></path>
          </svg>
        )
      case 'add_tl':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <polyline points="23 6 20 6 20 3"></polyline>
            <line x1="20" y1="6" x2="16" y2="10"></line>
          </svg>
        )
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

  // Rankings and Performance data calculation
  const rankingsData = [
    ...teamLeaders.map(tl => ({
      name: tl.fullName,
      role: 'Team Leader',
      department: tl.department || 'Operations',
      rating: ((tl.id || 1) * 13 + 67) % 28 + 70,
      attendance: 94 + ((tl.id || 1) % 5),
      tasks: 12 + ((tl.id || 1) % 8),
      productivity: 88 + ((tl.id || 1) % 11)
    })),
    ...hrEmployees.map(emp => ({
      name: emp.fullName,
      role: 'HR Employee',
      department: emp.department || 'Human Resources',
      rating: ((emp.id || 1) * 11 + 65) % 25 + 72,
      attendance: 93 + ((emp.id || 1) % 6),
      tasks: 10 + ((emp.id || 1) % 6),
      productivity: 85 + ((emp.id || 1) % 13)
    }))
  ];

  const getFilteredRankings = () => {
    let multiplier = 1.0;
    if (filterQuarter === 'Q1') multiplier = 0.92;
    else if (filterQuarter === 'Q2') multiplier = 0.97;
    else if (filterQuarter === 'Q3') multiplier = 1.03;
    else if (filterQuarter === 'Q4') multiplier = 1.01;

    if (filterMonth !== 'All') {
      const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(filterMonth);
      multiplier *= (1.0 + (monthIndex % 5 - 2) * 0.03);
    }

    if (filterYear === '2025') multiplier *= 0.96;
    if (filterYear === '2024') multiplier *= 0.91;

    return rankingsData.map(m => {
      const adjustedRating = Math.min(100, Math.max(50, Math.round(m.rating * multiplier)));
      const adjustedProductivity = Math.min(100, Math.max(50, Math.round(m.productivity * multiplier)));
      const adjustedAttendance = Math.min(100, Math.max(70, Math.round(m.attendance * (multiplier > 1 ? 1.01 : 0.98))));
      const adjustedTasks = Math.round(m.tasks * multiplier);
      
      return {
        ...m,
        rating: adjustedRating,
        productivity: adjustedProductivity,
        attendance: adjustedAttendance,
        tasks: adjustedTasks
      };
    }).sort((a, b) => b.rating - a.rating);
  };

  const handleExportExcel = () => {
    const data = getFilteredRankings();
    const headers = ['Rank', 'Name', 'Role', 'Department', 'Performance Rating', 'Attendance', 'Tasks Completed', 'Productivity Index'];
    const rows = data.map((item, idx) => [
      idx + 1,
      item.name,
      item.role,
      item.department,
      `${item.rating}%`,
      `${item.attendance}%`,
      item.tasks,
      item.productivity
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `WorkSphere_Enterprise_Report_${filterYear}_Q${filterQuarter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    // Standard browser printing command
    window.print();
  };

  // Reusable card chart renderer displaying numerical Y-axis (100,80,60,40,20,0) and employee names X-axis
  const renderDashboardModuleCard = (title, items, isLineChart = false, gradientColors = ['#4f46e5', '#818cf8']) => {
    const spacing = 260 / items.length;

    return (
      <div 
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          minHeight: '340px'
        }}
      >
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1.25rem 0' }}>
            {title}
          </h4>

          {/* SVG Chart with Y-axis values (0, 20, 40, 60, 80, 100) and X-axis names */}
          <svg viewBox="0 0 340 190" width="100%" height="150" style={{ overflow: 'visible' }}>
            {/* Grid lines */}
            <line x1="38" y1="20" x2="330" y2="20" stroke="#f8fafc" strokeWidth="1" />
            <line x1="38" y1="48" x2="330" y2="48" stroke="#f8fafc" strokeWidth="1" />
            <line x1="38" y1="76" x2="330" y2="76" stroke="#f8fafc" strokeWidth="1" />
            <line x1="38" y1="104" x2="330" y2="104" stroke="#f8fafc" strokeWidth="1" />
            <line x1="38" y1="132" x2="330" y2="132" stroke="#f8fafc" strokeWidth="1" />
            <line x1="38" y1="160" x2="330" y2="160" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* Y-axis labels */}
            <text x="28" y="23" fontSize="9" fill="#94a3b8" textAnchor="end">100</text>
            <text x="28" y="51" fontSize="9" fill="#94a3b8" textAnchor="end">80</text>
            <text x="28" y="79" fontSize="9" fill="#94a3b8" textAnchor="end">60</text>
            <text x="28" y="107" fontSize="9" fill="#94a3b8" textAnchor="end">40</text>
            <text x="28" y="135" fontSize="9" fill="#94a3b8" textAnchor="end">20</text>
            <text x="28" y="163" fontSize="9" fill="#94a3b8" textAnchor="end">0</text>

            {/* Chart Data Elements */}
            {!isLineChart ? (
              // Bar Chart representation
              items.map((item, index) => {
                const x = 38 + index * spacing + (spacing - 24) / 2;
                const barHeight = (item.value / 100) * 140;
                const y = 160 - barHeight;
                return (
                  <g key={index}>
                    <rect 
                      x={x} 
                      y={y} 
                      width="24" 
                      height={Math.max(0, barHeight)} 
                      rx="3" 
                      fill={`url(#grad-${title.replace(/\s+/g, '')}-${index})`}
                      style={{ transition: 'all 0.3s' }}
                    />
                    
                    <defs>
                      <linearGradient id={`grad-${title.replace(/\s+/g, '')}-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={gradientColors[1]} />
                        <stop offset="100%" stopColor={gradientColors[0]} />
                      </linearGradient>
                    </defs>

                    {/* Value label on top */}
                    <text x={x + 12} y={y - 5} fontSize="8.5" fontWeight="700" fill="#475569" textAnchor="middle">
                      {item.value}%
                    </text>

                    {/* X-axis name label */}
                    <text x={x + 12} y="176" fontSize="9.5" fontWeight="600" fill="#475569" textAnchor="middle">
                      {item.name}
                    </text>
                  </g>
                );
              })
            ) : (
              // Line Chart representation
              <>
                {(() => {
                  const points = items.map((item, index) => {
                    const x = 38 + index * spacing + spacing / 2;
                    const y = 160 - (item.value / 100) * 140;
                    return `${x},${y}`;
                  });
                  return (
                    <path 
                      d={`M ${points.join(' L ')}`} 
                      fill="none" 
                      stroke={gradientColors[0]} 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                  );
                })()}

                {items.map((item, index) => {
                  const x = 38 + index * spacing + spacing / 2;
                  const y = 160 - (item.value / 100) * 140;
                  return (
                    <g key={index}>
                      <circle cx={x} cy={y} r="5.5" fill="#ffffff" stroke={gradientColors[0]} strokeWidth="2" />
                      <circle cx={x} cy={y} r="2.5" fill={gradientColors[0]} />

                      {/* Value label */}
                      <text x={x} y={y - 8} fontSize="8.5" fontWeight="700" fill="#475569" textAnchor="middle">
                        {item.value}%
                      </text>

                      {/* X-axis name label */}
                      <text x={x} y="176" fontSize="9.5" fontWeight="600" fill="#475569" textAnchor="middle">
                        {item.name}
                      </text>
                    </g>
                  );
                })}
              </>
            )}
          </svg>
        </div>

        {/* View Total Performance Action Button (Replaces old labels) */}
        <button 
          className="view-perf-btn"
          onClick={() => setActiveTab('Reports & Analytics')}
          style={{
            marginTop: '1.25rem',
            width: '100%',
            padding: '0.65rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            color: '#334155',
            fontWeight: 600,
            fontSize: '0.825rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          View Total Performance
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Panel */}
      <div className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Company Portol Logo" className="sidebar-logo" />
          <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}>×</button>
        </div>

        <div className="sidebar-menu">
          {/* Active Dashboard Button */}
          <div 
            className={`menu-item ${activeTab === 'Dashboard' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('Dashboard')
              setIsSidebarOpen(false)
            }}
          >
            {renderIcon('dashboard')}
            <span>Dashboard</span>
          </div>

          {/* Categorized Menu Sections */}
          {sidebarData.map((section, idx) => (
            <div key={idx} className="menu-section">
              <span className="section-title">{section.category}</span>
              {section.items.map((item, itemIdx) => (
                <div 
                  key={itemIdx} 
                  className={`menu-item ${activeTab === item.name ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(item.name)
                    setIsSidebarOpen(false)
                  }}
                >
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
            <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>
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
          {activeTab === 'Dashboard' && (
            <>
              {/* Dashboard Title Section */}
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                  WorkSphere – Smart Employee Management Portal
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0.35rem 0 0 0' }}>
                  Real-time intelligence dashboard. Monitor performance, attendance, and project execution.
                </p>
              </div>

              {/* Grid of 8 Module Cards */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '2rem',
                  marginBottom: '2rem'
                }}
              >
                {/* 1. HR Employees Card */}
                {renderDashboardModuleCard(
                  "HR Employees Output",
                  hrEmployees.map(emp => ({ 
                    name: emp.fullName ? `${emp.fullName.split(' ')[0]} (HR)` : 'HR', 
                    value: ((emp.id || 1) * 11 + 65) % 25 + 72 
                  })).slice(0, 4),
                  false,
                  ['#10b981', '#34d399']
                )}

                {/* 2. Team Leaders Card */}
                {renderDashboardModuleCard(
                  "Team Leaders Performance",
                  teamLeaders.map(tl => ({ 
                    name: tl.fullName ? `${tl.fullName.split(' ')[0]} (TL)` : 'TL', 
                    value: ((tl.id || 1) * 13 + 67) % 28 + 70 
                  })).slice(0, 4),
                  false,
                  ['#4f46e5', '#818cf8']
                )}

                {/* 3. Employees Card */}
                {renderDashboardModuleCard(
                  "Employees Output",
                  [...teamLeaders, ...hrEmployees].map(p => ({ 
                    name: p.fullName ? `${p.fullName.split(' ')[0]} (${p.leaderId ? 'TL' : 'HR'})` : 'Emp', 
                    value: ((p.id || 1) * 7 + 73) % 20 + 78 
                  })).slice(0, 4),
                  false,
                  ['#2563eb', '#60a5fa']
                )}

                {/* 4. Projects Card */}
                {renderDashboardModuleCard(
                  "Project Progression",
                  teamLeaders.map(tl => ({ 
                    name: tl.fullName ? `${tl.fullName.split(' ')[0]} (TL)` : 'TL', 
                    value: ((tl.id || 1) * 9 + 54) % 30 + 65 
                  })).slice(0, 4),
                  true,
                  ['#f59e0b', '#fbbf24']
                )}

                {/* 5. Attendance Card */}
                {renderDashboardModuleCard(
                  "Shift Attendance Rate",
                  [...teamLeaders, ...hrEmployees].map(p => ({ 
                    name: p.fullName ? `${p.fullName.split(' ')[0]} (${p.leaderId ? 'TL' : 'HR'})` : 'Emp', 
                    value: ((p.id || 1) * 3 + 92) % 8 + 92 
                  })).slice(0, 4),
                  false,
                  ['#f43f5e', '#fb7185']
                )}

                {/* 6. Leave Management Card */}
                {renderDashboardModuleCard(
                  "Monthly Leave Util",
                  [...teamLeaders, ...hrEmployees].map(p => ({ 
                    name: p.fullName ? `${p.fullName.split(' ')[0]} (${p.leaderId ? 'TL' : 'HR'})` : 'Emp', 
                    value: ((p.id || 1) * 5 + 12) % 30 + 10 
                  })).slice(0, 4),
                  true,
                  ['#8b5cf6', '#a78bfa']
                )}

                {/* 7. Department Performance Card */}
                {renderDashboardModuleCard(
                  "Overall Department Performance",
                  [...teamLeaders, ...hrEmployees].map(p => ({ 
                    name: p.department ? `${p.department.substring(0, 8)}` : 'General', 
                    value: ((p.id || 1) * 8 + 68) % 22 + 76 
                  })).slice(0, 4),
                  false,
                  ['#0d9488', '#2dd4bf']
                )}

                {/* 8. Active Task Completions Card */}
                {renderDashboardModuleCard(
                  "Active Task Completions",
                  [...teamLeaders, ...hrEmployees].map(p => ({ 
                    name: p.fullName ? `${p.fullName.split(' ')[0]} (${p.leaderId ? 'TL' : 'HR'})` : 'Emp', 
                    value: ((p.id || 1) * 11 + 61) % 25 + 70 
                  })).slice(0, 4),
                  true,
                  ['#ec4899', '#f472b6']
                )}
              </div>
            </>
          )}

          {activeTab === 'Reports & Analytics' && (
            <div className="analytics-page-card" style={{ padding: '2rem', backgroundColor: '#ffffff', borderRadius: '16px', margin: '1rem 0', boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.05)' }}>
              
              {/* Header Navigation with Back Button & Exports */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <div>
                  <button 
                    onClick={() => setActiveTab('Dashboard')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4f46e5',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: 0,
                      marginBottom: '0.5rem'
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Dashboard
                  </button>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                    Smart Performance Analytics
                  </h2>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                    Detailed overview of productivity trends, attendance status, and leaderboard ranks.
                  </p>
                </div>

                {/* Export Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    onClick={handleExportExcel}
                    style={{
                      padding: '0.6rem 1.2rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#334155',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                    Export to Excel
                  </button>

                  <button 
                    onClick={handleExportPDF}
                    style={{
                      padding: '0.6rem 1.2rem',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#4f46e5',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'opacity 0.2s'
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Export to PDF (Print)
                  </button>
                </div>
              </div>

              {/* Filters Row */}
              <div 
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1rem 1.5rem',
                  marginBottom: '2rem',
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Filters:</span>
                
                {/* 1. Date Filter */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <select 
                    value={filterDate} 
                    onChange={(e) => setFilterDate(e.target.value)}
                    style={{ padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', backgroundColor: '#ffffff' }}
                  >
                    <option value="All">All Dates</option>
                    <option value="Today">Today</option>
                    <option value="Yesterday">Yesterday</option>
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="Last 30 Days">Last 30 Days</option>
                  </select>
                </div>

                {/* 2. Month Filter */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <select 
                    value={filterMonth} 
                    onChange={(e) => setFilterMonth(e.target.value)}
                    style={{ padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', backgroundColor: '#ffffff' }}
                  >
                    <option value="All">All Months</option>
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Quarter Filter */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <select 
                    value={filterQuarter} 
                    onChange={(e) => setFilterQuarter(e.target.value)}
                    style={{ padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', backgroundColor: '#ffffff' }}
                  >
                    <option value="All">All Quarters</option>
                    <option value="Q1">Q1 (Jan-Mar)</option>
                    <option value="Q2">Q2 (Apr-Jun)</option>
                    <option value="Q3">Q3 (Jul-Sep)</option>
                    <option value="Q4">Q4 (Oct-Dec)</option>
                  </select>
                </div>

                {/* 4. Year Filter */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <select 
                    value={filterYear} 
                    onChange={(e) => setFilterYear(e.target.value)}
                    style={{ padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', backgroundColor: '#ffffff' }}
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>

                <button 
                  onClick={() => {
                    setFilterDate('All');
                    setFilterMonth('All');
                    setFilterQuarter('All');
                    setFilterYear('2026');
                  }}
                  style={{
                    marginLeft: 'auto',
                    padding: '0.45rem 0.75rem',
                    border: 'none',
                    background: 'none',
                    color: '#64748b',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Reset Filters
                </button>
              </div>

              {/* KPI Summary statistics cards row */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '2rem'
                }}
              >
                {/* KPI 1 */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Attendance Rate</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>95.8%</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16a34a' }}>+1.2%</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>vs. previous month</span>
                </div>

                {/* KPI 2 */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Task Completion Rate</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>87.4%</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16a34a' }}>+3.1%</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>average delivery time 2 days</span>
                </div>

                {/* KPI 3 */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Core Productivity Score</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>92.1</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16a34a' }}>+0.5</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>calculated from key projects</span>
                </div>

                {/* KPI 4 */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average shift duration</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>09:15 AM - 05:57 PM</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>8.7 hrs avg work hours</span>
                </div>
              </div>

              {/* Graphical Visualizations Row */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
                  gap: '2rem',
                  marginBottom: '2rem'
                }}
              >
                {/* 1. Monthly Productivity Trend - Interactive Line Chart */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>
                    Monthly Performance & Productivity Trend
                  </h4>
                  <svg viewBox="0 0 450 200" width="100%" height="180" style={{ overflow: 'visible' }}>
                    {/* Y scale grid lines */}
                    <line x1="38" y1="20" x2="430" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="38" y1="48" x2="430" y2="48" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="38" y1="76" x2="430" y2="76" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="38" y1="104" x2="430" y2="104" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="38" y1="132" x2="430" y2="132" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="38" y1="160" x2="430" y2="160" stroke="#cbd5e1" strokeWidth="1.5" />

                    {/* Y ticks */}
                    <text x="28" y="23" fontSize="9.5" fill="#94a3b8" textAnchor="end">100</text>
                    <text x="28" y="51" fontSize="9.5" fill="#94a3b8" textAnchor="end">80</text>
                    <text x="28" y="79" fontSize="9.5" fill="#94a3b8" textAnchor="end">60</text>
                    <text x="28" y="107" fontSize="9.5" fill="#94a3b8" textAnchor="end">40</text>
                    <text x="28" y="135" fontSize="9.5" fill="#94a3b8" textAnchor="end">20</text>
                    <text x="28" y="163" fontSize="9.5" fill="#94a3b8" textAnchor="end">0</text>

                    {/* Path representing data */}
                    {(() => {
                      const trendPoints = [
                        { m: 'Jan', v: 72 }, { m: 'Feb', v: 76 }, { m: 'Mar', v: 84 },
                        { m: 'Apr', v: 80 }, { m: 'May', v: 88 }, { m: 'Jun', v: 92 },
                        { m: 'Jul', v: 91 }, { m: 'Aug', v: 95 }
                      ];
                      const step = 390 / (trendPoints.length - 1);
                      const points = trendPoints.map((item, idx) => {
                        const x = 38 + idx * step;
                        const y = 160 - (item.v / 100) * 140;
                        return `${x},${y}`;
                      });
                      return (
                        <>
                          <path d={`M ${points.join(' L ')}`} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
                          {trendPoints.map((item, idx) => {
                            const x = 38 + idx * step;
                            const y = 160 - (item.v / 100) * 140;
                            return (
                              <g key={idx}>
                                <circle cx={x} cy={y} r="5" fill="#ffffff" stroke="#4f46e5" strokeWidth="2.5" />
                                <text x={x} y={y - 8} fontSize="8.5" fontWeight="700" fill="#334155" textAnchor="middle">{item.v}%</text>
                                <text x={x} y="176" fontSize="9.5" fontWeight="600" fill="#64748b" textAnchor="middle">{item.m}</text>
                              </g>
                            )
                          })}
                        </>
                      );
                    })()}
                  </svg>
                </div>

                {/* 2. Weekly Performance Trend - Bar Chart */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>
                    Weekly Productivity Trend (Mon - Fri)
                  </h4>
                  <svg viewBox="0 0 450 200" width="100%" height="180" style={{ overflow: 'visible' }}>
                    {/* Y scale grid lines */}
                    <line x1="38" y1="20" x2="430" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="38" y1="48" x2="430" y2="48" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="38" y1="76" x2="430" y2="76" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="38" y1="104" x2="430" y2="104" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="38" y1="132" x2="430" y2="132" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="38" y1="160" x2="430" y2="160" stroke="#cbd5e1" strokeWidth="1.5" />

                    {/* Y ticks */}
                    <text x="28" y="23" fontSize="9.5" fill="#94a3b8" textAnchor="end">100</text>
                    <text x="28" y="51" fontSize="9.5" fill="#94a3b8" textAnchor="end">80</text>
                    <text x="28" y="79" fontSize="9.5" fill="#94a3b8" textAnchor="end">60</text>
                    <text x="28" y="107" fontSize="9.5" fill="#94a3b8" textAnchor="end">40</text>
                    <text x="28" y="135" fontSize="9.5" fill="#94a3b8" textAnchor="end">20</text>
                    <text x="28" y="163" fontSize="9.5" fill="#94a3b8" textAnchor="end">0</text>

                    {/* Columns representing daily performance */}
                    {[
                      { d: 'Mon', v: 84 }, { d: 'Tue', v: 91 }, { d: 'Wed', v: 89 },
                      { d: 'Thu', v: 95 }, { d: 'Fri', v: 87 }
                    ].map((item, idx) => {
                      const spacing = 390 / 5;
                      const x = 38 + idx * spacing + (spacing - 28) / 2;
                      const barHeight = (item.v / 100) * 140;
                      const y = 160 - barHeight;
                      return (
                        <g key={idx}>
                          <rect x={x} y={y} width="28" height={barHeight} rx="4" fill="url(#blue-grad-daily)" />
                          <defs>
                            <linearGradient id="blue-grad-daily" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#60a5fa" />
                              <stop offset="100%" stopColor="#2563eb" />
                            </linearGradient>
                          </defs>
                          <text x={x + 14} y={y - 6} fontSize="8.5" fontWeight="700" fill="#334155" textAnchor="middle">{item.v}%</text>
                          <text x={x + 14} y="176" fontSize="9.5" fontWeight="600" fill="#64748b" textAnchor="middle">{item.d}</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Detailed Performance Rankings Table below charts */}
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
                  Leaderboard Performance Rankings Directory
                </h3>
                <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>
                        <th style={{ padding: '1rem' }}>Rank</th>
                        <th style={{ padding: '1rem' }}>Name</th>
                        <th style={{ padding: '1rem' }}>Role</th>
                        <th style={{ padding: '1rem' }}>Department</th>
                        <th style={{ padding: '1rem' }}>Performance Rating</th>
                        <th style={{ padding: '1rem' }}>Attendance Rate</th>
                        <th style={{ padding: '1rem' }}>Tasks Completed</th>
                        <th style={{ padding: '1rem' }}>Productivity Score</th>
                        <th style={{ padding: '1rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredRankings().map((m, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155', transition: 'background-color 0.15s' }}>
                          <td style={{ padding: '1rem', fontWeight: 700, color: index === 0 ? '#b45309' : '#64748b' }}>
                            {index === 0 ? '🏆 1' : index + 1}
                          </td>
                          <td style={{ padding: '1rem', fontWeight: 600, color: '#0f172a' }}>{m.name}</td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ fontSize: '0.8rem', color: m.role === 'Team Leader' ? '#4f46e5' : (m.role === 'HR Employee' ? '#10b981' : '#64748b'), fontWeight: 600 }}>
                              {m.role}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>{m.department}</td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ width: '80px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${m.rating}%`, height: '100%', backgroundColor: m.rating >= 85 ? '#10b981' : (m.rating >= 75 ? '#2563eb' : '#f59e0b') }} />
                              </div>
                              <span style={{ fontWeight: 700 }}>{m.rating}%</span>
                            </div>
                          </td>
                          <td style={{ padding: '1rem', fontWeight: 600 }}>{m.attendance}%</td>
                          <td style={{ padding: '1rem', fontWeight: 600, color: '#4f46e5' }}>{m.tasks}</td>
                          <td style={{ padding: '1rem', fontWeight: 700 }}>{m.productivity}</td>
                          <td style={{ padding: '1rem' }}>
                            <span 
                              style={{
                                padding: '0.25rem 0.6rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                backgroundColor: m.rating >= 90 ? '#eff6ff' : (m.rating >= 80 ? '#ecfdf5' : '#fffbeb'),
                                color: m.rating >= 90 ? '#1d4ed8' : (m.rating >= 80 ? '#047857' : '#b45309')
                              }}
                            >
                              {m.rating >= 90 ? 'Outstanding' : (m.rating >= 80 ? 'Satisfactory' : 'Needs Review')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'Add HR' && (
            <div className="hr-section-card">
              <div className="hr-section-header">
                <h3>HR Employee Directory</h3>
                <button className="add-hr-btn" onClick={() => setShowHRForm(!showHRForm)}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {showHRForm ? (
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                    ) : (
                      <>
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </>
                    )}
                    {showHRForm && <line x1="6" y1="6" x2="18" y2="18"></line>}
                  </svg>
                  {showHRForm ? 'Close Form' : 'Add HR'}
                </button>
              </div>

              {showHRForm && (
                <div className="hr-form-container">
                  <form onSubmit={handleHRSubmit}>
                    <div className="hr-form-grid">
                      <div className="form-group">
                        <label htmlFor="hr-employeeId">HR Employee ID</label>
                        <input
                          type="text"
                          id="hr-employeeId"
                          className="hr-input"
                          value={hrFormData.employeeId}
                          readOnly
                          disabled
                          style={{ backgroundColor: '#e2e8f0', cursor: 'not-allowed', color: '#64748b', fontWeight: 600 }}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="hr-fullName">Full Name</label>
                        <input
                          type="text"
                          id="hr-fullName"
                          className="hr-input"
                          placeholder="Enter Full Name"
                          value={hrFormData.fullName}
                          onChange={(e) => setHrFormData({ ...hrFormData, fullName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="hr-emailId">Email ID</label>
                        <input
                          type="email"
                          id="hr-emailId"
                          className="hr-input"
                          placeholder="Enter Email ID"
                          value={hrFormData.emailId}
                          onChange={(e) => setHrFormData({ ...hrFormData, emailId: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="hr-phoneNumber">Phone Number</label>
                        <input
                          type="tel"
                          id="hr-phoneNumber"
                          className="hr-input"
                          placeholder="Enter Phone Number"
                          value={hrFormData.phoneNumber}
                          onChange={(e) => setHrFormData({ ...hrFormData, phoneNumber: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="hr-department">Department</label>
                        <select
                          id="hr-department"
                          className="hr-input"
                          value={hrFormData.department}
                          onChange={(e) => setHrFormData({ ...hrFormData, department: e.target.value })}
                          required
                          style={{ cursor: 'pointer' }}
                        >
                          <option value="">Select Department</option>
                          <option value="Human Resources">Human Resources</option>
                          <option value="Recruitment">Recruitment</option>
                          <option value="Operations">Operations</option>
                          <option value="Finance">Finance</option>
                          <option value="IT Support">IT Support</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="hr-designation">Designation</label>
                        <input
                          type="text"
                          id="hr-designation"
                          className="hr-input"
                          placeholder="Enter Designation"
                          value={hrFormData.designation}
                          onChange={(e) => setHrFormData({ ...hrFormData, designation: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="hr-joiningDate">Date of Joining</label>
                        <input
                          type="date"
                          id="hr-joiningDate"
                          className="hr-input"
                          value={hrFormData.joiningDate}
                          onChange={(e) => setHrFormData({ ...hrFormData, joiningDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="hr-form-actions">
                      <button type="button" className="cancel-btn" onClick={() => setShowHRForm(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="save-btn">
                        Save HR Employee
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Department Tabs Top-Menu */}
              <div className="department-tabs-menu" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                {['All', 'Human Resources', 'Recruitment', 'Operations', 'Finance', 'IT Support'].map((dept) => (
                  <button
                    key={dept}
                    className={`dept-tab-btn ${selectedDeptFilter === dept ? 'active' : ''}`}
                    onClick={() => setSelectedDeptFilter(dept)}
                    style={{
                      padding: '0.5rem 1.1rem',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: selectedDeptFilter === dept ? '#2563eb' : '#cbd5e1',
                      backgroundColor: selectedDeptFilter === dept ? '#2563eb' : '#ffffff',
                      color: selectedDeptFilter === dept ? '#ffffff' : '#475569',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedDeptFilter === dept ? '0 4px 6px -1px rgba(37, 99, 235, 0.15)' : 'none'
                    }}
                  >
                    {dept}
                  </button>
                ))}
              </div>

              <div className="hr-table-container">
                <table className="hr-table">
                  <thead>
                    <tr>
                      <th>HR Employee ID</th>
                      <th>Full Name</th>
                      <th>Email ID</th>
                      <th>Phone Number</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Date of Joining</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hrEmployees.filter(emp => selectedDeptFilter === 'All' || emp.department === selectedDeptFilter).length > 0 ? (
                      hrEmployees
                        .filter(emp => selectedDeptFilter === 'All' || emp.department === selectedDeptFilter)
                        .map((emp, index) => (
                          <tr key={index}>
                            <td>{emp.employeeId}</td>
                            <td>{emp.fullName}</td>
                            <td>{emp.emailId}</td>
                            <td>{emp.phoneNumber}</td>
                            <td>
                              <span style={{
                                display: 'inline-block',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                backgroundColor: 
                                  emp.department === 'Human Resources' ? '#eff6ff' :
                                  emp.department === 'Recruitment' ? '#f5f3ff' :
                                  emp.department === 'Operations' ? '#ecfdf5' :
                                  emp.department === 'Finance' ? '#fffbeb' :
                                  '#f1f5f9',
                                color:
                                  emp.department === 'Human Resources' ? '#1d4ed8' :
                                  emp.department === 'Recruitment' ? '#6d28d9' :
                                  emp.department === 'Operations' ? '#047857' :
                                  emp.department === 'Finance' ? '#b45309' :
                                  '#475569',
                              }}>
                                {emp.department || 'N/A'}
                              </span>
                            </td>
                            <td>{emp.designation}</td>
                            <td>{emp.joiningDate}</td>
                            <td>
                              <button className="delete-hr-btn" onClick={() => handleHRDelete(hrEmployees.indexOf(emp))}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="no-data-cell">
                          No HR employees added yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Add Team Leader' && (
            <div className="hr-section-card">
              <div className="hr-section-header">
                <h3>Team Leader Directory</h3>
                <button className="add-hr-btn" onClick={() => setShowTLForm(!showTLForm)}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {showTLForm ? (
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                    ) : (
                      <>
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </>
                    )}
                    {showTLForm && <line x1="6" y1="6" x2="18" y2="18"></line>}
                  </svg>
                  {showTLForm ? 'Close Form' : 'Add Team Leader'}
                </button>
              </div>

              {showTLForm && (
                <div className="hr-form-container">
                  <form onSubmit={handleTLSubmit}>
                    <div className="hr-form-grid">
                      <div className="form-group">
                        <label htmlFor="tl-leaderId">Team Leader ID</label>
                        <input
                          type="text"
                          id="tl-leaderId"
                          className="hr-input"
                          value={tlFormData.leaderId}
                          readOnly
                          disabled
                          style={{ backgroundColor: '#e2e8f0', cursor: 'not-allowed', color: '#64748b', fontWeight: 600 }}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="tl-fullName">Full Name</label>
                        <input
                          type="text"
                          id="tl-fullName"
                          className="hr-input"
                          placeholder="Enter Full Name"
                          value={tlFormData.fullName}
                          onChange={(e) => setTlFormData({ ...tlFormData, fullName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="tl-emailId">Email ID</label>
                        <input
                          type="email"
                          id="tl-emailId"
                          className="hr-input"
                          placeholder="Enter Email ID"
                          value={tlFormData.emailId}
                          onChange={(e) => setTlFormData({ ...tlFormData, emailId: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="tl-phoneNumber">Phone Number</label>
                        <input
                          type="tel"
                          id="tl-phoneNumber"
                          className="hr-input"
                          placeholder="Enter Phone Number"
                          value={tlFormData.phoneNumber}
                          onChange={(e) => setTlFormData({ ...tlFormData, phoneNumber: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="tl-department">Department</label>
                        <select
                          id="tl-department"
                          className="hr-input"
                          value={tlFormData.department}
                          onChange={(e) => setTlFormData({ ...tlFormData, department: e.target.value })}
                          required
                          style={{ cursor: 'pointer' }}
                        >
                          <option value="">Select Department</option>
                          <option value="Human Resources">Human Resources</option>
                          <option value="Recruitment">Recruitment</option>
                          <option value="Operations">Operations</option>
                          <option value="Finance">Finance</option>
                          <option value="IT Support">IT Support</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="tl-designation">Designation</label>
                        <input
                          type="text"
                          id="tl-designation"
                          className="hr-input"
                          placeholder="Enter Designation"
                          value={tlFormData.designation}
                          onChange={(e) => setTlFormData({ ...tlFormData, designation: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="tl-joiningDate">Date of Joining</label>
                        <input
                          type="date"
                          id="tl-joiningDate"
                          className="hr-input"
                          value={tlFormData.joiningDate}
                          onChange={(e) => setTlFormData({ ...tlFormData, joiningDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="hr-form-actions">
                      <button type="button" className="cancel-btn" onClick={() => setShowTLForm(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="save-btn">
                        Save Team Leader
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Department Tabs Top-Menu */}
              <div className="department-tabs-menu" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                {['All', 'Human Resources', 'Recruitment', 'Operations', 'Finance', 'IT Support'].map((dept) => (
                  <button
                    key={dept}
                    className={`dept-tab-btn ${selectedTLDeptFilter === dept ? 'active' : ''}`}
                    onClick={() => setSelectedTLDeptFilter(dept)}
                    style={{
                      padding: '0.5rem 1.1rem',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: selectedTLDeptFilter === dept ? '#2563eb' : '#cbd5e1',
                      backgroundColor: selectedTLDeptFilter === dept ? '#2563eb' : '#ffffff',
                      color: selectedTLDeptFilter === dept ? '#ffffff' : '#475569',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedTLDeptFilter === dept ? '0 4px 6px -1px rgba(37, 99, 235, 0.15)' : 'none'
                    }}
                  >
                    {dept}
                  </button>
                ))}
              </div>

              <div className="hr-table-container">
                <table className="hr-table">
                  <thead>
                    <tr>
                      <th>Team Leader ID</th>
                      <th>Full Name</th>
                      <th>Email ID</th>
                      <th>Phone Number</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Date of Joining</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamLeaders.filter(tl => selectedTLDeptFilter === 'All' || tl.department === selectedTLDeptFilter).length > 0 ? (
                      teamLeaders
                        .filter(tl => selectedTLDeptFilter === 'All' || tl.department === selectedTLDeptFilter)
                        .map((tl, index) => (
                          <tr key={index}>
                            <td>{tl.leaderId}</td>
                            <td>{tl.fullName}</td>
                            <td>{tl.emailId}</td>
                            <td>{tl.phoneNumber}</td>
                            <td>
                              <span style={{
                                display: 'inline-block',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                backgroundColor: 
                                  tl.department === 'Human Resources' ? '#eff6ff' :
                                  tl.department === 'Recruitment' ? '#f5f3ff' :
                                  tl.department === 'Operations' ? '#ecfdf5' :
                                  tl.department === 'Finance' ? '#fffbeb' :
                                  '#f1f5f9',
                                color:
                                  tl.department === 'Human Resources' ? '#1d4ed8' :
                                  tl.department === 'Recruitment' ? '#6d28d9' :
                                  tl.department === 'Operations' ? '#047857' :
                                  tl.department === 'Finance' ? '#b45309' :
                                  '#475569',
                              }}>
                                {tl.department || 'N/A'}
                              </span>
                            </td>
                            <td>{tl.designation}</td>
                            <td>{tl.joiningDate}</td>
                            <td>
                              <button className="delete-hr-btn" onClick={() => handleTLDelete(teamLeaders.indexOf(tl))}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="no-data-cell">
                          No team leaders added yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab !== 'Dashboard' && activeTab !== 'Add HR' && activeTab !== 'Add Team Leader' && activeTab !== 'Reports & Analytics' && (
            <div className="tab-placeholder-card" style={{ padding: '2rem', backgroundColor: '#ffffff', borderRadius: '16px', margin: '1rem 0' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>{activeTab}</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>This section is currently under construction.</p>
            </div>
          )}
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
      {/* Sidebar backdrop for mobile */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </div>
  )
}

export default AdminDashboard
