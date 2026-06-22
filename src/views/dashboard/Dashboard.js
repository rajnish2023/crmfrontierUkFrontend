import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CButton,
  CSpinner
} from '@coreui/react'
import { Link } from 'react-router-dom'
import {
  getUserProfile,
  fetchUsers,
  fetchPages,
  BlogPosts,
  fetchGalleries
} from '../../api/api'

const Dashboard = () => {
  const [role, setRole] = useState(null)
  const [userName, setUserName] = useState('')
  const [stats, setStats] = useState({ blogs: 0, pages: 0, users: 0, gallery: 0 })
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, users, pages, blogs, gallery] = await Promise.all([
          getUserProfile(token),
          fetchUsers(),
          fetchPages(token),
          BlogPosts(token),
          fetchGalleries()
        ])
        setRole(profile.data.role)
        setUserName(profile.data.name || 'Admin')
        setStats({
          users: users.data.users?.length || 0,
          pages: pages.data.length || 0,
          blogs: blogs.data.length || 0,
          gallery: gallery.data.length || 0
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

  if (loading) {
    return (
      <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  const cardStyle = {
    borderRadius: '16px',
    border: '1px solid #eef2f6',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    height: '100%',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  }

  const iconBoxStyle = (color) => ({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    background: color,
    marginBottom: '20px'
  })

  return (
    <div className="dashboard-content py-3">

      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Welcome back, {userName}
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '8px' }}>
          Here's a quick look at what's happening in your system today.
        </p>
      </div>

      <CRow className="g-4">

        <CCol sm={6} lg={3}>
          <CCard className="border-0 card-hover" style={cardStyle}>
            <CCardBody className="p-4">
              <div style={iconBoxStyle('#eff6ff')}>📝</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Total Blogs</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: '4px 0 16px' }}>{stats.blogs}</div>
              <Link to="/all-blogs" style={{ textDecoration: 'none' }}>
                <CButton color="primary" variant="outline" className="w-100" style={{ borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem' }}>Manage Posts</CButton>
              </Link>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} lg={3}>
          <CCard className="border-0 card-hover" style={cardStyle}>
            <CCardBody className="p-4">
              <div style={iconBoxStyle('#fff1f2')}>📄</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Landing Pages</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: '4px 0 16px' }}>{stats.pages}</div>
              <Link to="/all-pages" style={{ textDecoration: 'none' }}>
                <CButton color="danger" variant="outline" className="w-100" style={{ borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem' }}>Open Builder</CButton>
              </Link>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol sm={6} lg={3}>
          <CCard className="border-0 card-hover" style={cardStyle}>
            <CCardBody className="p-4">
              <div style={iconBoxStyle('#f0fdf4')}>👥</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Team Members</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: '4px 0 16px' }}>{stats.users}</div>
              <Link to="/all-users" style={{ textDecoration: 'none' }}>
                <CButton color="success" variant="outline" className="w-100" style={{ borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem' }}>View Directory</CButton>
              </Link>
            </CCardBody>
          </CCard>
        </CCol>


        <CCol sm={6} lg={3}>
          <CCard className="border-0 card-hover" style={cardStyle}>
            <CCardBody className="p-4">
              <div style={iconBoxStyle('#fffbeb')}>🖼️</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.025em' }}>Media Assets</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: '4px 0 16px' }}>{stats.gallery}</div>
              <Link to="/all-gallery" style={{ textDecoration: 'none' }}>
                <CButton color="warning" variant="outline" className="w-100" style={{ borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem' }}>Media Library</CButton>
              </Link>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <div style={{ marginTop: '50px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/blog-post/create" style={{ textDecoration: 'none' }}>
            <CButton color="primary" style={{ borderRadius: '12px', padding: '10px 20px', fontWeight: 600 }}>+ Create Blog</CButton>
          </Link>
          <Link to="/create-page" style={{ textDecoration: 'none' }}>
            <CButton color="dark" style={{ borderRadius: '12px', padding: '10px 20px', fontWeight: 600 }}>+ Build Page</CButton>
          </Link>
        </div>
      </div>

      <style>{`
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </div>
  )
}

export default Dashboard
