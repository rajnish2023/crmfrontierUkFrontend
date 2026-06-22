import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchPages, deletePage } from '../../api/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ListPage = () => {
  const [pages, setPages] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    const getPages = async () => {
      try {
        const response = await fetchPages(token)
        setPages(response.data)
      } catch (error) {
        toast.error('Failed to fetch pages')
      } finally {
        setLoading(false)
      }
    }
    getPages()
  }, [token])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        await deletePage(token, id)
        setPages(pages.filter((page) => page._id !== id))
        toast.success('Page deleted successfully')
      } catch (error) {
        toast.error('Failed to delete page')
      }
    }
  }

  const filteredPages = pages.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusStyle = (status) => {
    if (status === 'Draft') return { bg: '#fef3c7', text: '#d97706' }
    return { bg: '#dcfce7', text: '#16a34a' }
  }

  return (
    <div style={{ padding: '20px 0', minHeight: '100vh' }}>
      <ToastContainer />

      {/* ── CLEAN HEADER ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Pages Management</h1>
          <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '4px' }}>Create and manage your website's dynamic content.</p>
        </div>
        <button
          onClick={() => navigate('/create-page')}
          className="create-btn"
        >
          + Create New Page
        </button>
      </div>

      {/* ── SEARCH BAR ── */}
      <div style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Search by title or slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* ── CONTENT AREA ── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px' }}>Loading pages...</div>
      ) : (
        <div className="pages-grid">
          {filteredPages.map((page) => {
            const status = getStatusStyle(page.status)
            return (
              <div key={page._id} className="page-card">
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{
                      background: status.bg,
                      color: status.text,
                      padding: '4px 12px',
                      borderRadius: '100px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>
                      {page.status || 'Published'}
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', margin: '0 0 8px' }}>{page.title}</h3>
                  <div style={{ color: '#64748b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ opacity: 0.5 }}>URL:</span>
                    <span style={{ fontWeight: 500 }}>/{page.slug}</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button onClick={() => navigate(`/edit-page/${page._id}`)} className="action-btn edit">Edit</button>
                  <button onClick={() => handleDelete(page._id)} className="action-btn delete">Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {!loading && filteredPages.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px', background: '#fff', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📄</div>
          <h3 style={{ color: '#1e293b', margin: 0 }}>No pages found</h3>
          <p style={{ color: '#64748b', marginTop: '8px' }}>Try a different search or create a new page.</p>
        </div>
      )}

      <style>{`
        .pages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }
        .page-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #eef2f6;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .page-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border-color: #d1d5db;
        }
        .search-input {
          width: 100%;
          max-width: 400px;
          padding: 12px 20px;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          outline: none;
          transition: all 0.2s;
          font-size: 0.95rem;
        }
        .search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        .create-btn {
          background: #1e293b;
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .create-btn:hover {
          background: #0f172a;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }
        .card-actions {
          padding: 16px 24px;
          background: #f8fafc;
          border-top: 1px solid #eef2f6;
          display: flex;
          gap: 10px;
        }
        .action-btn {
          flex: 1;
          padding: 8px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        .action-btn.view { background: #fff; border-color: #e2e8f0; color: #1e293b; }
        .action-btn.edit { background: #fff; border-color: #e2e8f0; color: #1e293b; }
        .action-btn.delete { background: #fff; border-color: #fee2e2; color: #ef4444; }
        .action-btn:hover { transform: translateY(-1px); background: #f1f5f9; }
        .action-btn.delete:hover { background: #fef2f2; }
      `}</style>
    </div>
  )
}

export default ListPage
