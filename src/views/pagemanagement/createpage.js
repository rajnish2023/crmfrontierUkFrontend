import React, { useState } from 'react'
import { Puck, Render } from '@measured/puck'
import '@measured/puck/puck.css'
import { useNavigate } from 'react-router-dom'
import { createPage } from '../../api/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { config } from './puckConfig'

const CreatePage = () => {
  const [data, setData] = useState({})
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  
  // SEO States
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [metaKeywords, setMetaKeywords] = useState('')
  const [metaImage, setMetaImage] = useState('')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [canonicalUrl, setCanonicalUrl] = useState('')
  const [robotsMeta, setRobotsMeta] = useState('index, follow')
  const [ogTitle, setOgTitle] = useState('')
  const [ogDescription, setOgDescription] = useState('')
  const [ogImage, setOgImage] = useState('')
  const [ogType, setOgType] = useState('website')
  const [twitterCard, setTwitterCard] = useState('summary_large_image')
  const [twitterTitle, setTwitterTitle] = useState('')
  const [twitterDescription, setTwitterDescription] = useState('')
  const [twitterImage, setTwitterImage] = useState('')
  const [jsonLd, setJsonLd] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const [showSettings, setShowSettings] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleTitleChange = (e) => {
    const val = e.target.value
    setTitle(val)
    const generatedSlug = val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    setSlug(generatedSlug)
    if (!metaTitle) setMetaTitle(val)
    if (!seoTitle) setSeoTitle(val)
    if (!ogTitle) setOgTitle(val)
    if (!twitterTitle) setTwitterTitle(val)
  }

  const handleSave = async (updatedData, status = 'Published') => {
    const finalData = updatedData || data
    if (!title.trim()) {
      toast.error('Page title required!')
      return
    }
    if (!slug.trim()) {
      toast.error('Page slug required!')
      return
    }
    
    if (status === 'Published') {
      setIsPublishing(true)
    } else {
      setIsSaving(true)
    }
    
    try {
      await createPage(token, { 
        title, 
        slug, 
        content: finalData, 
        status: status,
        // SEO Data
        metaTitle,
        metaDescription,
        metaKeywords,
        metaImage,
        seoTitle,
        seoDescription,
        canonicalUrl,
        robotsMeta,
        ogTitle,
        ogDescription,
        ogImage,
        ogType,
        twitterCard,
        twitterTitle,
        twitterDescription,
        twitterImage,
        jsonLd
      })
      toast.success(`🎉 Page ${status === 'Draft' ? 'saved as draft' : 'published'} successfully!`)
      navigate('/all-pages')
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${status.toLowerCase()} page`)
    } finally {
      setIsSaving(false)
      setIsPublishing(false)
    }
  }

  const [previewDevice, setPreviewDevice] = useState('desktop')
  const deviceWidths = { 
    desktop: '100%', 
    tablet: '768px', 
    mobile: '375px' 
  }

  // Helper to generate preview
  const generatePreview = () => {
    return {
      title: seoTitle || metaTitle || title || 'Your Page Title',
      description: seoDescription || metaDescription || 'Your page description will appear here.',
      url: `https://yoursite.com/${slug || 'new-page'}`,
      image: ogImage || metaImage || 'https://via.placeholder.com/1200x630/3b82f6/ffffff?text=Your+Page+Image'
    }
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      zIndex: 2000, 
      display: 'flex', 
      flexDirection: 'column', 
      background: '#f8fafc',
      overflow: 'hidden'
    }}>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 99999 }}
      />
      
      {/* ─── TOP BAR ── */}
      <header style={{ 
        height: '72px', 
        background: '#ffffff',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 32px',
        flexShrink: 0,
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        {/* Left Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button 
            onClick={() => navigate('/all-pages')} 
            style={{ 
              background: 'transparent',
              border: 'none', 
              color: '#64748b', 
              borderRadius: '8px', 
              padding: '8px 16px', 
              cursor: 'pointer', 
              fontWeight: 500,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 17L8 10L15 3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to CMS
          </button>
          
          <div style={{ height: '32px', width: '1px', background: '#e2e8f0' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <input 
                placeholder="Enter page title..." 
                value={title} 
                onChange={handleTitleChange} 
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: '#0f172a', 
                  fontSize: '1.25rem', 
                  fontWeight: 700, 
                  outline: 'none', 
                  width: '300px',
                  padding: '4px 0'
                }}
              />
              {title && (
                <div style={{ 
                  position: 'absolute', 
                  bottom: '-4px', 
                  left: 0, 
                  right: 0, 
                  height: '2px', 
                  background: '#3b82f6',
                  borderRadius: '2px'
                }} />
              )}
            </div>
            {slug && (
              <span style={{ 
                color: '#94a3b8', 
                fontSize: '0.8rem', 
                fontFamily: 'monospace',
                background: '#f1f5f9',
                padding: '4px 12px',
                borderRadius: '6px'
              }}>
                /{slug}
              </span>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isPreview && (
            <div style={{ 
              display: 'flex', 
              background: '#f1f5f9', 
              padding: '4px', 
              borderRadius: '10px', 
              marginRight: '12px'
            }}>
              {[
                { id: 'desktop', icon: '🖥️', label: 'Desktop' },
                { id: 'tablet', icon: '📱', label: 'Tablet' },
                { id: 'mobile', icon: '📱', label: 'Mobile' }
              ].map(d => (
                <button 
                  key={d.id} 
                  onClick={() => setPreviewDevice(d.id)}
                  style={{ 
                    background: previewDevice === d.id ? '#ffffff' : 'transparent',
                    border: 'none',
                    color: previewDevice === d.id ? '#0f172a' : '#64748b',
                    padding: '6px 14px', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    boxShadow: previewDevice === d.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {d.icon} {d.label}
                </button>
              ))}
            </div>
          )}

          <button 
            onClick={() => setShowSettings(true)} 
            style={{ 
              background: 'transparent', 
              border: '1px solid #e2e8f0',
              color: '#475569', 
              padding: '8px 16px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontSize: '0.85rem', 
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f8fafc'
              e.currentTarget.style.borderColor = '#cbd5e1'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = '#e2e8f0'
            }}
          >
            🔍 SEO
          </button>

          <button 
            onClick={() => setIsPreview(!isPreview)} 
            style={{ 
              background: isPreview ? '#3b82f6' : 'transparent',
              color: isPreview ? '#fff' : '#475569',
              padding: '8px 18px', 
              borderRadius: '8px', 
              border: isPreview ? 'none' : '1px solid #e2e8f0',
              cursor: 'pointer', 
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!isPreview) {
                e.currentTarget.style.background = '#f8fafc'
                e.currentTarget.style.borderColor = '#cbd5e1'
              }
            }}
            onMouseLeave={(e) => {
              if (!isPreview) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = '#e2e8f0'
              }
            }}
          >
            {isPreview ? '✏️ Editor' : '👁️ Preview'}
          </button>

          <div style={{ height: '32px', width: '1px', background: '#e2e8f0' }} />

          <button 
            onClick={() => handleSave(data, 'Draft')} 
            disabled={isSaving || isPublishing}
            style={{ 
              background: 'transparent', 
              color: '#475569', 
              padding: '8px 20px', 
              borderRadius: '8px', 
              border: '1px solid #e2e8f0', 
              cursor: isSaving || isPublishing ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              opacity: isSaving || isPublishing ? 0.5 : 1,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!isSaving && !isPublishing) {
                e.currentTarget.style.background = '#f8fafc'
                e.currentTarget.style.borderColor = '#cbd5e1'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = '#e2e8f0'
            }}
          >
            {isSaving ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="spinner" style={{ 
                  width: '14px', 
                  height: '14px', 
                  border: '2px solid #e2e8f0',
                  borderTop: '2px solid #475569',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.8s linear infinite'
                }} />
                Saving...
              </span>
            ) : (
              '💾 Save Draft'
            )}
          </button>

          <button 
            onClick={() => handleSave(data, 'Published')} 
            disabled={isSaving || isPublishing}
            style={{ 
              background: '#10b981', 
              color: '#fff', 
              padding: '8px 28px', 
              borderRadius: '8px', 
              border: 'none', 
              cursor: isSaving || isPublishing ? 'not-allowed' : 'pointer',
              fontWeight: 700, 
              fontSize: '0.85rem',
              boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
              transition: 'all 0.2s ease',
              opacity: isSaving || isPublishing ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isSaving && !isPublishing) {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(16,185,129,0.4)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,185,129,0.3)'
            }}
          >
            {isPublishing ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="spinner" style={{ 
                  width: '14px', 
                  height: '14px', 
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid #fff',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.8s linear infinite'
                }} />
                Publishing...
              </span>
            ) : (
              '🚀 Publish'
            )}
          </button>
        </div>
      </header>

      {/* ─── MAIN CONTENT ── */}
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#f8fafc' }}>
        {isPreview ? (
          <div style={{ 
            height: '100%', 
            overflowY: 'auto', 
            padding: '40px 20px',
            background: 'linear-gradient(180deg, #f1f5f9 0%, #f8fafc 100%)'
          }}>
            <div style={{ 
              width: deviceWidths[previewDevice], 
              margin: '0 auto', 
              background: '#ffffff', 
              borderRadius: '16px',
              boxShadow: '0 50px 100px -20px rgba(0,0,0,0.25), 0 20px 40px -10px rgba(0,0,0,0.1)', 
              minHeight: '100%',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
              border: '1px solid rgba(226, 232, 240, 0.5)'
            }}>
              <div style={{ 
                background: '#f8fafc', 
                padding: '16px 24px', 
                borderBottom: '1px solid #e2e8f0', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#febc2e' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28c840' }} />
                </div>
                <div style={{ 
                  flex: 1, 
                  background: '#ffffff', 
                  borderRadius: '8px', 
                  padding: '6px 16px', 
                  fontSize: '0.8rem', 
                  color: '#64748b', 
                  border: '1px solid #e2e8f0',
                  fontFamily: 'monospace',
                  textAlign: 'center',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)'
                }}>
                  https://yoursite.com/{slug || 'new-page'}
                </div>
                <div style={{ width: '80px' }} />
              </div>
              
              <div className="pb-preview-root" style={{ padding: '0' }}>
                <Render config={config} data={data} />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ height: '100%' }}>
            <style>{`
              .puck-app { height: 100% !important; }
              [class*="Puck-canvas"] { 
                overflow-y: auto !important; 
                height: 100% !important;
                scroll-behavior: smooth;
                background: #f8fafc !important;
              }
              .puck-render-root { 
                min-height: 100%; 
                padding-bottom: 200px;
                background: #ffffff;
                margin: 24px;
                border-radius: 16px;
                box-shadow: 0 4px 24px rgba(0,0,0,0.04);
                border: 1px solid #e2e8f0;
                overflow: hidden;
              }
            `}</style>
            <Puck
              config={config}
              data={data}
              onChange={setData}
              overrides={{
                header: () => null,
                headerActions: () => null
              }}
            />
          </div>
        )}
      </main>

      {/* ─── SEO SETTINGS OVERLAY ── */}
      {showSettings && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 3000, 
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.2s ease',
          padding: '20px'
        }}>
          <div style={{ 
            background: '#ffffff', 
            width: '800px', 
            maxHeight: '90vh',
            borderRadius: '20px', 
            overflow: 'hidden', 
            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.3), 0 20px 40px -10px rgba(0,0,0,0.2)',
            animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{ 
              padding: '24px 32px', 
              borderBottom: '1px solid #f1f5f9', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: '#fafafa',
              flexShrink: 0
            }}>
              <div>
                <h3 style={{ 
                  margin: 0, 
                  fontWeight: 700, 
                  fontSize: '1.25rem', 
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>🔍</span>
                  SEO & Social Settings
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                  Optimize your page for search engines and social sharing
                </p>
              </div>
              <button 
                onClick={() => setShowSettings(false)} 
                style={{ 
                  border: 'none', 
                  background: 'transparent', 
                  color: '#94a3b8', 
                  fontSize: '1.8rem', 
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  lineHeight: 1
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f1f5f9'
                  e.currentTarget.style.color = '#0f172a'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#94a3b8'
                }}
              >
                ×
              </button>
            </div>
            
            {/* Modal Body - Scrollable */}
            <div style={{ 
              padding: '32px', 
              overflowY: 'auto',
              flex: 1
            }}>
              {/* ─── SEO PREVIEW ── */}
              <div style={{ 
                background: '#f8fafc', 
                borderRadius: '12px', 
                padding: '20px',
                marginBottom: '32px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>
                  📋 Search Preview
                </div>
                <div style={{ 
                  background: '#ffffff', 
                  padding: '16px', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '1.1rem', color: '#1a0dab', fontWeight: 400, marginBottom: '4px' }}>
                    {seoTitle || metaTitle || title || 'Your Page Title'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#006621', marginBottom: '4px' }}>
                    https://yoursite.com/{slug || 'new-page'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#545454' }}>
                    {seoDescription || metaDescription || 'Your page description will appear here.'}
                  </div>
                </div>
              </div>

              {/* ─── BASIC SEO ── */}
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: 700, 
                  color: '#0f172a', 
                  margin: '0 0 16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>📝</span> Basic SEO
                </h4>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    color: '#0f172a', 
                    marginBottom: '6px' 
                  }}>
                    SEO Title
                    <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.75rem', marginLeft: '8px' }}>
                      (recommended: 50-60 characters)
                    </span>
                  </label>
                  <input 
                    value={seoTitle || metaTitle || ''} 
                    placeholder="Enter SEO title" 
                    onChange={e => setSeoTitle(e.target.value)} 
                    style={{ 
                      width: '100%', 
                      padding: '10px 14px', 
                      borderRadius: '10px', 
                      border: '1px solid #e2e8f0', 
                      outline: 'none', 
                      fontSize: '0.9rem',
                      transition: 'border-color 0.2s ease',
                      background: '#fafafa'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: (seoTitle || metaTitle || '').length > 60 ? '#ef4444' : '#94a3b8',
                    marginTop: '4px'
                  }}>
                    {(seoTitle || metaTitle || '').length}/60 characters
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    color: '#0f172a', 
                    marginBottom: '6px' 
                  }}>
                    SEO Description
                    <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.75rem', marginLeft: '8px' }}>
                      (recommended: 150-160 characters)
                    </span>
                  </label>
                  <textarea 
                    rows="2" 
                    value={seoDescription || metaDescription || ''} 
                    placeholder="Enter description for search results..." 
                    onChange={e => setSeoDescription(e.target.value)} 
                    style={{ 
                      width: '100%', 
                      padding: '10px 14px', 
                      borderRadius: '10px', 
                      border: '1px solid #e2e8f0', 
                      outline: 'none', 
                      fontSize: '0.9rem', 
                      resize: 'vertical',
                      transition: 'border-color 0.2s ease',
                      background: '#fafafa'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: (seoDescription || metaDescription || '').length > 160 ? '#ef4444' : '#94a3b8',
                    marginTop: '4px'
                  }}>
                    {(seoDescription || metaDescription || '').length}/160 characters
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    color: '#0f172a', 
                    marginBottom: '6px' 
                  }}>
                    Keywords
                    <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.75rem', marginLeft: '8px' }}>
                      (comma separated)
                    </span>
                  </label>
                  <input 
                    value={metaKeywords || ''} 
                    placeholder="e.g. real estate, property, home" 
                    onChange={e => setMetaKeywords(e.target.value)} 
                    style={{ 
                      width: '100%', 
                      padding: '10px 14px', 
                      borderRadius: '10px', 
                      border: '1px solid #e2e8f0', 
                      outline: 'none', 
                      fontSize: '0.9rem',
                      transition: 'border-color 0.2s ease',
                      background: '#fafafa'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>

              {/* ─── ADVANCED SEO ── */}
              <div style={{ marginBottom: '32px' }}>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#0f172a',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 0',
                    width: '100%',
                    borderBottom: showAdvanced ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    paddingBottom: '12px',
                    marginBottom: showAdvanced ? '20px' : '0'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>⚡</span>
                  Advanced SEO
                  <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#94a3b8' }}>
                    {showAdvanced ? '▼' : '▶'}
                  </span>
                </button>

                {showAdvanced && (
                  <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '0.85rem', 
                        fontWeight: 600, 
                        color: '#0f172a', 
                        marginBottom: '6px' 
                      }}>
                        Canonical URL
                        <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.75rem', marginLeft: '8px' }}>
                          (prevents duplicate content)
                        </span>
                      </label>
                      <input 
                        value={canonicalUrl || ''} 
                        placeholder="https://example.com/page-url" 
                        onChange={e => setCanonicalUrl(e.target.value)} 
                        style={{ 
                          width: '100%', 
                          padding: '10px 14px', 
                          borderRadius: '10px', 
                          border: '1px solid #e2e8f0', 
                          outline: 'none', 
                          fontSize: '0.9rem',
                          transition: 'border-color 0.2s ease',
                          background: '#fafafa'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                      />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '0.85rem', 
                        fontWeight: 600, 
                        color: '#0f172a', 
                        marginBottom: '6px' 
                      }}>
                        Robots Meta
                        <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.75rem', marginLeft: '8px' }}>
                          (search engine instructions)
                        </span>
                      </label>
                      <select
                        value={robotsMeta || 'index, follow'}
                        onChange={e => setRobotsMeta(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #e2e8f0',
                          outline: 'none',
                          fontSize: '0.9rem',
                          background: '#fafafa',
                          transition: 'border-color 0.2s ease'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                      >
                        <option value="index, follow">Index, Follow</option>
                        <option value="index, nofollow">Index, No Follow</option>
                        <option value="noindex, follow">No Index, Follow</option>
                        <option value="noindex, nofollow">No Index, No Follow</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* ─── OPEN GRAPH (Facebook, LinkedIn) ── */}
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: 700, 
                  color: '#0f172a', 
                  margin: '0 0 16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>📘</span> Open Graph (Facebook, LinkedIn)
                </h4>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    color: '#0f172a', 
                    marginBottom: '6px' 
                  }}>
                    OG Title
                    <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.75rem', marginLeft: '8px' }}>
                      (defaults to SEO Title)
                    </span>
                  </label>
                  <input 
                    value={ogTitle || ''} 
                    placeholder="Title for social sharing" 
                    onChange={e => setOgTitle(e.target.value)} 
                    style={{ 
                      width: '100%', 
                      padding: '10px 14px', 
                      borderRadius: '10px', 
                      border: '1px solid #e2e8f0', 
                      outline: 'none', 
                      fontSize: '0.9rem',
                      transition: 'border-color 0.2s ease',
                      background: '#fafafa'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    color: '#0f172a', 
                    marginBottom: '6px' 
                  }}>
                    OG Description
                    <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.75rem', marginLeft: '8px' }}>
                      (defaults to SEO Description)
                    </span>
                  </label>
                  <textarea 
                    rows="2" 
                    value={ogDescription || ''} 
                    placeholder="Description for social sharing" 
                    onChange={e => setOgDescription(e.target.value)} 
                    style={{ 
                      width: '100%', 
                      padding: '10px 14px', 
                      borderRadius: '10px', 
                      border: '1px solid #e2e8f0', 
                      outline: 'none', 
                      fontSize: '0.9rem', 
                      resize: 'vertical',
                      transition: 'border-color 0.2s ease',
                      background: '#fafafa'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    color: '#0f172a', 
                    marginBottom: '6px' 
                  }}>
                    OG Image URL
                    <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.75rem', marginLeft: '8px' }}>
                      (recommended: 1200x630)
                    </span>
                  </label>
                  <input 
                    value={ogImage || metaImage || ''} 
                    placeholder="https://example.com/og-image.jpg" 
                    onChange={e => setOgImage(e.target.value)} 
                    style={{ 
                      width: '100%', 
                      padding: '10px 14px', 
                      borderRadius: '10px', 
                      border: '1px solid #e2e8f0', 
                      outline: 'none', 
                      fontSize: '0.9rem',
                      transition: 'border-color 0.2s ease',
                      background: '#fafafa'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                  {(ogImage || metaImage) && (
                    <div style={{ marginTop: '12px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      <img src={ogImage || metaImage} alt="OG preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    color: '#0f172a', 
                    marginBottom: '6px' 
                  }}>
                    OG Type
                  </label>
                  <select
                    value={ogType || 'website'}
                    onChange={e => setOgType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      outline: 'none',
                      fontSize: '0.9rem',
                      background: '#fafafa',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    <option value="website">Website</option>
                    <option value="article">Article</option>
                    <option value="product">Product</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              {/* ─── TWITTER CARDS ── */}
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: 700, 
                  color: '#0f172a', 
                  margin: '0 0 16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>🐦</span> Twitter Cards
                </h4>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    color: '#0f172a', 
                    marginBottom: '6px' 
                  }}>
                    Twitter Card Type
                  </label>
                  <select
                    value={twitterCard || 'summary_large_image'}
                    onChange={e => setTwitterCard(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      outline: 'none',
                      fontSize: '0.9rem',
                      background: '#fafafa',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary with Large Image</option>
                    <option value="app">App</option>
                    <option value="player">Player</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    color: '#0f172a', 
                    marginBottom: '6px' 
                  }}>
                    Twitter Title
                    <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.75rem', marginLeft: '8px' }}>
                      (defaults to OG Title)
                    </span>
                  </label>
                  <input 
                    value={twitterTitle || ''} 
                    placeholder="Title for Twitter" 
                    onChange={e => setTwitterTitle(e.target.value)} 
                    style={{ 
                      width: '100%', 
                      padding: '10px 14px', 
                      borderRadius: '10px', 
                      border: '1px solid #e2e8f0', 
                      outline: 'none', 
                      fontSize: '0.9rem',
                      transition: 'border-color 0.2s ease',
                      background: '#fafafa'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    color: '#0f172a', 
                    marginBottom: '6px' 
                  }}>
                    Twitter Description
                    <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.75rem', marginLeft: '8px' }}>
                      (defaults to OG Description)
                    </span>
                  </label>
                  <textarea 
                    rows="2" 
                    value={twitterDescription || ''} 
                    placeholder="Description for Twitter" 
                    onChange={e => setTwitterDescription(e.target.value)} 
                    style={{ 
                      width: '100%', 
                      padding: '10px 14px', 
                      borderRadius: '10px', 
                      border: '1px solid #e2e8f0', 
                      outline: 'none', 
                      fontSize: '0.9rem', 
                      resize: 'vertical',
                      transition: 'border-color 0.2s ease',
                      background: '#fafafa'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    color: '#0f172a', 
                    marginBottom: '6px' 
                  }}>
                    Twitter Image URL
                    <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.75rem', marginLeft: '8px' }}>
                      (defaults to OG Image)
                    </span>
                  </label>
                  <input 
                    value={twitterImage || ogImage || metaImage || ''} 
                    placeholder="https://example.com/twitter-image.jpg" 
                    onChange={e => setTwitterImage(e.target.value)} 
                    style={{ 
                      width: '100%', 
                      padding: '10px 14px', 
                      borderRadius: '10px', 
                      border: '1px solid #e2e8f0', 
                      outline: 'none', 
                      fontSize: '0.9rem',
                      transition: 'border-color 0.2s ease',
                      background: '#fafafa'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                  {(twitterImage || ogImage || metaImage) && (
                    <div style={{ marginTop: '12px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      <img src={twitterImage || ogImage || metaImage} alt="Twitter preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              </div>

              {/* ─── JSON-LD STRUCTURED DATA ── */}
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: 700, 
                  color: '#0f172a', 
                  margin: '0 0 16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>📊</span> JSON-LD Structured Data
                  <span style={{ 
                    fontSize: '0.7rem', 
                    background: '#f1f5f9', 
                    color: '#64748b', 
                    padding: '2px 10px', 
                    borderRadius: '12px',
                    fontWeight: 500
                  }}>
                    Advanced
                  </span>
                </h4>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    color: '#0f172a', 
                    marginBottom: '6px' 
                  }}>
                    JSON-LD Schema
                    <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: '0.75rem', marginLeft: '8px' }}>
                      (structured data for rich results)
                    </span>
                  </label>
                  <textarea 
                    rows="6" 
                    value={jsonLd || ''} 
                    placeholder={`{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "${seoTitle || metaTitle || title || 'Page Title'}",
  "description": "${seoDescription || metaDescription || 'Page description'}",
  "url": "https://yoursite.com/${slug || 'new-page'}"
}`}
                    onChange={e => setJsonLd(e.target.value)} 
                    style={{ 
                      width: '100%', 
                      padding: '10px 14px', 
                      borderRadius: '10px', 
                      border: '1px solid #e2e8f0', 
                      outline: 'none', 
                      fontSize: '0.85rem', 
                      fontFamily: 'monospace',
                      resize: 'vertical',
                      transition: 'border-color 0.2s ease',
                      background: '#fafafa',
                      minHeight: '150px'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#94a3b8',
                    marginTop: '4px'
                  }}>
                    💡 Tip: Use <a href="https://schema.org" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>schema.org</a> for valid JSON-LD
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div style={{ 
              padding: '20px 32px', 
              borderTop: '1px solid #f1f5f9', 
              background: '#fafafa',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setShowSettings(false)} 
                  style={{ 
                    flex: 1,
                    padding: '12px', 
                    background: '#f1f5f9', 
                    color: '#475569', 
                    border: 'none', 
                    borderRadius: '10px', 
                    fontWeight: 600, 
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowSettings(false)} 
                  style={{ 
                    flex: 2,
                    padding: '12px', 
                    background: '#3b82f6', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '10px', 
                    fontWeight: 600, 
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(59,130,246,0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.3)'
                  }}
                >
                  Save SEO Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── SPINNER KEYFRAMES ── */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}

export default CreatePage