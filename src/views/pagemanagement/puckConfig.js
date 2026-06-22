import React from 'react'
import axios from 'axios'
import './pagebuilder.css'

// ─── IMAGE UPLOAD FIELD ───────────────────────────────────────────────────────
const ImageUploadField = ({ value, onChange }) => {
  const [uploading, setUploading] = React.useState(false)
  const safeValue = value || ''

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('files', file)
    try {
      const res = await axios.post('http://localhost:7878/api/creategalleries', formData)
      const uploadedUrl = res.data.urls?.[0]
      if (uploadedUrl) onChange(uploadedUrl)
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Image upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="pb-image-upload">
      <input
        type="text"
        value={safeValue}
        onChange={e => onChange(e.target.value)}
        placeholder="Paste image URL..."
        className="pb-image-upload-input"
      />
      <label className="pb-image-upload-btn">
        {uploading ? '⏳ Uploading...' : '📁 Upload Image'}
        <input type="file" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} accept="image/*" />
      </label>
      {safeValue && (
        <img src={safeValue} alt="preview" className="pb-image-upload-preview" />
      )}
    </div>
  )
}

// ─── GALLERY IMAGE MANAGER ────────────────────────────────────────────────────
const GalleryImageManager = ({ value = [], onChange }) => {
  const [uploading, setUploading] = React.useState(false)
  const safeValue = Array.isArray(value) ? value : []

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    
    const uploadedUrls = []
    for (const file of files) {
      const formData = new FormData()
      formData.append('files', file)
      try {
        const res = await axios.post('http://localhost:7878/api/creategalleries', formData)
        const uploadedUrl = res.data.urls?.[0]
        if (uploadedUrl) uploadedUrls.push({ url: uploadedUrl, caption: '' })
      } catch (err) {
        console.error('Upload failed:', err)
        alert('Some images failed to upload.')
      }
    }
    
    if (uploadedUrls.length) {
      onChange([...safeValue, ...uploadedUrls])
    }
    setUploading(false)
  }

  const updateImage = (index, field, newValue) => {
    const newImages = [...safeValue]
    newImages[index] = { ...newImages[index], [field]: newValue }
    onChange(newImages)
  }

  const removeImage = (index) => {
    const newImages = safeValue.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const moveImage = (index, direction) => {
    const newImages = [...safeValue]
    const [moved] = newImages.splice(index, 1)
    newImages.splice(index + direction, 0, moved)
    onChange(newImages)
  }

  return (
    <div className="pb-gallery-manager">
      <div className="pb-gallery-manager-actions">
        <label className="pb-gallery-upload-btn">
          {uploading ? '⏳ Uploading...' : '➕ Add Images'}
          <input type="file" onChange={handleUpload} disabled={uploading} accept="image/*" multiple />
        </label>
        <span className="pb-gallery-count">{safeValue.length} images</span>
      </div>

      <div className="pb-gallery-manager-grid">
        {safeValue.map((img, index) => (
          <div key={index} className="pb-gallery-manager-item">
            <div className="pb-gallery-item-preview">
              <img src={img.url} alt={img.caption || `Image ${index + 1}`} />
              <div className="pb-gallery-item-actions">
                <button onClick={() => moveImage(index, -1)} disabled={index === 0} className="pb-gallery-move-btn">↑</button>
                <button onClick={() => moveImage(index, 1)} disabled={index === safeValue.length - 1} className="pb-gallery-move-btn">↓</button>
                <button onClick={() => removeImage(index)} className="pb-gallery-delete-btn">✕</button>
              </div>
            </div>
            <input
              type="text"
              value={img.caption || ''}
              onChange={(e) => updateImage(index, 'caption', e.target.value)}
              placeholder="Add caption..."
              className="pb-gallery-caption-input"
            />
          </div>
        ))}
      </div>

      {safeValue.length === 0 && (
        <div className="pb-gallery-empty">
          No images yet. Click "Add Images" to upload.
        </div>
      )}
    </div>
  )
}

// ─── LINK FIELD ──────────────────────────────────────────────────────────────
const LinkField = ({ value = {}, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const safeValue = value || {}

  const handleChange = (field, newValue) => {
    onChange({ ...safeValue, [field]: newValue })
  }

  return (
    <div className="pb-link-field">
      <div className="pb-link-field-trigger">
        <button onClick={() => setIsOpen(!isOpen)} className="pb-link-toggle-btn">
          <span>🔗</span>
          {safeValue.url ? 'Edit Link' : 'Add Link'}
        </button>
        {safeValue.url && (
          <>
            <span className="pb-link-preview">{safeValue.url}</span>
            <button onClick={() => onChange({})} className="pb-link-remove-btn">✕</button>
          </>
        )}
      </div>

      {isOpen && (
        <div className="pb-link-editor">
          <div className="pb-link-field-group">
            <label className="pb-link-label">URL</label>
            <input
              type="text"
              value={safeValue.url || ''}
              onChange={(e) => handleChange('url', e.target.value)}
              placeholder="https://example.com"
              className="pb-link-input"
            />
          </div>

          <div className="pb-link-field-group">
            <label className="pb-link-label">Open In</label>
            <select
              value={safeValue.target || '_self'}
              onChange={(e) => handleChange('target', e.target.value)}
              className="pb-link-select"
            >
              <option value="_self">Same Window</option>
              <option value="_blank">New Window</option>
            </select>
          </div>

          <div className="pb-link-field-group">
            <label className="pb-link-label">Rel</label>
            <select
              value={safeValue.rel || ''}
              onChange={(e) => handleChange('rel', e.target.value)}
              className="pb-link-select"
            >
              <option value="">None</option>
              <option value="nofollow">Nofollow</option>
              <option value="noopener">Noopener</option>
              <option value="noreferrer">Noreferrer</option>
            </select>
          </div>

          <button onClick={() => setIsOpen(false)} className="pb-link-apply-btn">
            Apply Link
          </button>
        </div>
      )}
    </div>
  )
}

// ─── ACCORDION ITEM ──────────────────────────────────────────────────────────
const AccordionItem = ({ question, answer, isOpen = false, onToggle }) => {
  return (
    <div className="pb-accordion">
      <div onClick={onToggle} className="pb-accordion-header">
        <span>{question || 'Question?'}</span>
        <span className="pb-accordion-icon">{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && (
        <div className="pb-accordion-body">
          {answer || 'Answer goes here.'}
        </div>
      )}
    </div>
  )
}

// ─── STAR RATING ──────────────────────────────────────────────────────────────
const Stars = ({ count = 5 }) => (
  <div className="pb-stars">
    {'★'.repeat(Math.min(5, count))}{'☆'.repeat(Math.max(0, 5 - count))}
  </div>
)

// ─── BADGE ────────────────────────────────────────────────────────────────────
const Badge = ({ text, color }) => (
  <span className="pb-badge" style={{ background: color || '#e0f2fe', color: '#0369a1' }}>
    {text}
  </span>
)

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const btn = (label, variant = 'primary', link = null, size = 'md') => {
  const variantClass = `pb-btn-${variant}`
  const sizeClass = `pb-btn-${size}`
  const buttonEl = <button className={`pb-btn ${variantClass} ${sizeClass}`}>{label}</button>
  
  if (link && link.url) {
    return (
      <a href={link.url} target={link.target || '_self'} rel={link.rel || ''} className="pb-btn-link">
        {buttonEl}
      </a>
    )
  }
  return buttonEl
}

// ═════════════════════════════════════════════════════════════════════════════
// PUCK CONFIG - COMPLETE OPTIMIZED CODE
// ═════════════════════════════════════════════════════════════════════════════
export const config = {
  components: {

    // ── TYPOGRAPHY ────────────────────────────────────────────────────────────

    Heading: {
      group: 'Typography',
      fields: {
        text: { type: 'text', label: 'Text' },
        tag: { 
          type: 'select', 
          label: 'HTML Tag', 
          options: [
            { label: 'H1', value: 'h1' }, 
            { label: 'H2', value: 'h2' }, 
            { label: 'H3', value: 'h3' }, 
            { label: 'H4', value: 'h4' }
          ] 
        },
        size: { 
          type: 'select', 
          label: 'Size', 
          options: [
            { label: 'XL (4rem)', value: '4rem' }, 
            { label: 'LG (3rem)', value: '3rem' }, 
            { label: 'MD (2rem)', value: '2rem' }, 
            { label: 'SM (1.5rem)', value: '1.5rem' }
          ] 
        },
        align: { 
          type: 'select', 
          label: 'Align', 
          options: [
            { label: 'Left', value: 'left' }, 
            { label: 'Center', value: 'center' }, 
            { label: 'Right', value: 'right' }
          ] 
        },
        color: { type: 'text', label: 'Color (hex)' },
        weight: { 
          type: 'select', 
          label: 'Weight', 
          options: [
            { label: 'Regular', value: '400' }, 
            { label: 'Semibold', value: '600' }, 
            { label: 'Bold', value: '700' }, 
            { label: 'Black', value: '900' }
          ] 
        },
      },
      defaultProps: { 
        text: 'Your Headline Here', 
        tag: 'h2', 
        size: '3rem', 
        align: 'center', 
        color: '#1e293b', 
        weight: '800' 
      },
      render: ({ text, tag: Tag = 'h2', size, align, color, weight }) => (
        <div className="pb-heading-wrapper" style={{ textAlign: align }}>
          <Tag className="pb-heading" style={{ fontSize: size, fontWeight: weight, color: color || '#1e293b' }}>{text}</Tag>
        </div>
      ),
    },

    Paragraph: {
      group: 'Typography',
      fields: {
        text: { type: 'textarea', label: 'Content' },
        size: { 
          type: 'select', 
          label: 'Size', 
          options: [
            { label: 'Small (0.9rem)', value: '0.9rem' }, 
            { label: 'Normal (1rem)', value: '1rem' }, 
            { label: 'Large (1.2rem)', value: '1.2rem' }, 
            { label: 'XL (1.4rem)', value: '1.4rem' }
          ] 
        },
        align: { 
          type: 'select', 
          label: 'Align', 
          options: [
            { label: 'Left', value: 'left' }, 
            { label: 'Center', value: 'center' }, 
            { label: 'Right', value: 'right' }
          ] 
        },
        color: { type: 'text', label: 'Color (hex)' },
        maxWidth: { type: 'text', label: 'Max Width (e.g. 800px)' },
      },
      defaultProps: { 
        text: 'Write something meaningful here. Great pages start with great content.', 
        size: '1rem', 
        align: 'left', 
        color: '#475569', 
        maxWidth: '100%' 
      },
      render: ({ text, size, align, color, maxWidth }) => (
        <div className="pb-paragraph-wrapper" style={{ textAlign: align, maxWidth: maxWidth || '100%', margin: align === 'center' ? '0 auto' : '0' }}>
          <p className="pb-text" style={{ fontSize: size, color: color || '#475569' }}>{text}</p>
        </div>
      ),
    },

    RichText: {
      group: 'Typography',
      fields: {
        html: { type: 'textarea', label: 'HTML Content' },
      },
      defaultProps: { 
        html: '<p>Write <strong>rich content</strong> with <em>formatting</em>. <br/>Supports basic HTML tags.</p>' 
      },
      render: ({ html }) => (
        <div className="pb-rich-text" dangerouslySetInnerHTML={{ __html: html }} />
      ),
    },

    Divider: {
      group: 'Typography',
      fields: {
        style: { 
          type: 'select', 
          label: 'Style', 
          options: [
            { label: 'Solid', value: 'solid' }, 
            { label: 'Dashed', value: 'dashed' }, 
            { label: 'Dotted', value: 'dotted' }
          ] 
        },
        color: { type: 'text', label: 'Color' },
        thickness: { type: 'text', label: 'Thickness (e.g. 1px)' },
        margin: { type: 'text', label: 'Vertical Margin (e.g. 40px)' },
      },
      defaultProps: { style: 'solid', color: '#e2e8f0', thickness: '1px', margin: '32px' },
      render: ({ style, color, thickness, margin }) => (
        <hr className="pb-divider" style={{ borderTop: `${thickness || '1px'} ${style} ${color || '#e2e8f0'}`, margin: `${margin || '32px'} 0` }} />
      ),
    },

    // ── HERO SECTIONS ─────────────────────────────────────────────────────────

    HeroBanner: {
      group: 'Hero',
      fields: {
        badge: { type: 'text', label: 'Badge Text (optional)' },
        headline: { type: 'text', label: 'Headline' },
        subheadline: { type: 'textarea', label: 'Sub-headline' },
        primaryBtn: { type: 'text', label: 'Primary Button Text' },
        primaryLink: { type: 'custom', label: 'Primary Button Link', render: (props) => <LinkField {...props} /> },
        secondaryBtn: { type: 'text', label: 'Secondary Button Text' },
        secondaryLink: { type: 'custom', label: 'Secondary Button Link', render: (props) => <LinkField {...props} /> },
        bgType: { 
          type: 'select', 
          label: 'Background', 
          options: [
            { label: 'White', value: '#ffffff' }, 
            { label: 'Dark', value: '#0f172a' }, 
            { label: 'Blue', value: '#1d4ed8' }, 
            { label: 'Gradient', value: 'gradient' }, 
            { label: 'Light Gray', value: '#f8fafc' }
          ] 
        },
        image: { type: 'custom', label: 'Hero Image', render: ImageUploadField },
        layout: { 
          type: 'select', 
          label: 'Layout', 
          options: [
            { label: 'Centered (No Image)', value: 'centered' }, 
            { label: 'Text Left, Image Right', value: 'split' }
          ] 
        },
      },
      defaultProps: {
        badge: '🚀 New Launch',
        headline: 'Build Stunning Pages in Minutes',
        subheadline: 'The most powerful drag-and-drop page builder. Create landing pages, websites, and more — no code required.',
        primaryBtn: 'Get Started Free',
        primaryLink: { url: '#', target: '_self' },
        secondaryBtn: 'Watch Demo',
        secondaryLink: { url: '#', target: '_self' },
        bgType: '#ffffff',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200',
        layout: 'split',
      },
      render: ({ badge, headline, subheadline, primaryBtn, secondaryBtn, primaryLink, secondaryLink, bgType, image, layout }) => {
        const bg = bgType === 'gradient' ? 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)' : bgType
        const isDark = bgType === '#0f172a' || bgType === 'gradient' || bgType === '#1d4ed8'
        const textColor = isDark ? '#fff' : '#1e293b'
        const subColor = isDark ? 'rgba(255,255,255,0.75)' : '#64748b'

        if (layout === 'centered') return (
          <section className="pb-section pb-section-lg" style={{ background: bg, textAlign: 'center' }}>
            <div className="pb-container pb-container-sm">
              {badge && <Badge text={badge} color={isDark ? 'rgba(255,255,255,0.15)' : '#e0f2fe'} />}
              <h1 className="pb-heading-xl" style={{ color: textColor }}>{headline}</h1>
              <p className="pb-text" style={{ color: subColor, maxWidth: '600px', margin: '0 auto 40px' }}>{subheadline}</p>
              <div className="pb-hero-actions pb-hero-actions-center">
                {primaryBtn && btn(primaryBtn, isDark ? 'light' : 'primary', primaryLink)}
                {secondaryBtn && btn(secondaryBtn, isDark ? 'secondary' : 'secondary', secondaryLink)}
              </div>
            </div>
          </section>
        )

        return (
          <section className="pb-section" style={{ background: bg }}>
            <div className="pb-container">
              <div className="pb-hero-split">
                <div>
                  {badge && <Badge text={badge} color={isDark ? 'rgba(255,255,255,0.15)' : '#e0f2fe'} />}
                  <h1 className="pb-heading-lg" style={{ color: textColor }}>{headline}</h1>
                  <p className="pb-text" style={{ color: subColor }}>{subheadline}</p>
                  <div className="pb-hero-actions">
                    {primaryBtn && btn(primaryBtn, isDark ? 'light' : 'primary', primaryLink)}
                    {secondaryBtn && btn(secondaryBtn, 'secondary', secondaryLink)}
                  </div>
                </div>
                {image && <img src={image} alt="Hero" className="pb-hero-image" />}
              </div>
            </div>
          </section>
        )
      },
    },

    HeroVideo: {
      group: 'Hero',
      fields: {
        headline: { type: 'text', label: 'Headline' },
        subheadline: { type: 'textarea', label: 'Sub-headline' },
        videoUrl: { type: 'text', label: 'YouTube/Vimeo Embed URL' },
        primaryBtn: { type: 'text', label: 'Button Text' },
        primaryLink: { type: 'custom', label: 'Button Link', render: (props) => <LinkField {...props} /> },
        bg: { type: 'text', label: 'Background Color' },
      },
      defaultProps: {
        headline: 'See It in Action',
        subheadline: 'Watch how easy it is to build pages.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        primaryBtn: 'Start Building',
        primaryLink: { url: '#', target: '_self' },
        bg: '#0f172a',
      },
      render: ({ headline, subheadline, videoUrl, primaryBtn, primaryLink, bg }) => (
        <section className="pb-section" style={{ background: bg || '#0f172a', textAlign: 'center' }}>
          <div className="pb-container pb-container-sm">
            <h2 className="pb-heading-lg" style={{ color: '#fff' }}>{headline}</h2>
            <p className="pb-text" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '40px' }}>{subheadline}</p>
            {videoUrl && (
              <div className="pb-video-wrapper">
                <iframe src={videoUrl} title="Video" frameBorder="0" allow="autoplay; fullscreen" />
              </div>
            )}
            {primaryBtn && btn(primaryBtn, 'primary', primaryLink)}
          </div>
        </section>
      ),
    },

    // ── LAYOUT COMPONENTS ─────────────────────────────────────────────────────

    Section: {
      group: 'Layout',
      fields: {
        bg: { type: 'text', label: 'Background Color' },
        paddingY: { type: 'text', label: 'Vertical Padding (e.g. 80px)' },
        maxWidth: { 
          type: 'select', 
          label: 'Max Width', 
          options: [
            { label: '1200px', value: '1200px' }, 
            { label: '960px', value: '960px' }, 
            { label: '768px', value: '768px' }, 
            { label: 'Full Width', value: '100%' }
          ] 
        },
        borderRadius: { type: 'text', label: 'Border Radius' },
      },
      defaultProps: { bg: '#ffffff', paddingY: '80px', maxWidth: '1200px' },
      render: ({ bg, paddingY, maxWidth, puck: { renderDropZone } }) => (
        <section className="pb-section" style={{ background: bg || '#fff', padding: `${paddingY || '80px'} 24px` }}>
          <div className="pb-container" style={{ maxWidth: maxWidth || '1200px' }}>
            {renderDropZone({ zone: 'content' })}
          </div>
        </section>
      ),
    },

    Columns: {
      group: 'Layout',
      fields: {
        count: { 
          type: 'select', 
          label: 'Columns', 
          options: [
            { label: '2 Columns', value: '2' }, 
            { label: '3 Columns', value: '3' }, 
            { label: '4 Columns', value: '4' }, 
            { label: '60/40 Split', value: '60-40' }, 
            { label: '40/60 Split', value: '40-60' }
          ] 
        },
        gap: { type: 'text', label: 'Gap (e.g. 40px)' },
        align: { 
          type: 'select', 
          label: 'Vertical Align', 
          options: [
            { label: 'Top', value: 'start' }, 
            { label: 'Center', value: 'center' }, 
            { label: 'Bottom', value: 'end' }
          ] 
        },
      },
      defaultProps: { count: '2', gap: '40px', align: 'start' },
      render: ({ count, gap, align, puck: { renderDropZone } }) => {
        const templates = { '2': '1fr 1fr', '3': '1fr 1fr 1fr', '4': '1fr 1fr 1fr 1fr', '60-40': '3fr 2fr', '40-60': '2fr 3fr' }
        const colCount = parseInt(count) || 2
        return (
          <div className={`pb-grid pb-grid-${colCount}`} style={{ gap: gap || '40px', alignItems: align || 'start', margin: '20px 0' }}>
            {Array.from({ length: colCount }).map((_, i) => (
              <div key={i} className="pb-grid-col">{renderDropZone({ zone: `col-${i}` })}</div>
            ))}
          </div>
        )
      },
    },

    Spacer: {
      group: 'Layout',
      fields: {
        height: { type: 'text', label: 'Height (e.g. 80px)' },
        showLine: { 
          type: 'radio', 
          label: 'Show Line?', 
          options: [
            { label: 'No', value: 'no' }, 
            { label: 'Yes', value: 'yes' }
          ] 
        },
      },
      defaultProps: { height: '60px', showLine: 'no' },
      render: ({ height, showLine }) => (
        <div className="pb-spacer" style={{ height: height || '60px', display: 'flex', alignItems: 'center' }}>
          {showLine === 'yes' && <hr className="pb-divider" style={{ width: '100%' }} />}
        </div>
      ),
    },

    // ── CONTENT BLOCKS ────────────────────────────────────────────────────────

    ImageText: {
      group: 'Content',
      fields: {
        badge: { type: 'text', label: 'Badge (optional)' },
        headline: { type: 'text', label: 'Headline' },
        body: { type: 'textarea', label: 'Body Text' },
        btnLabel: { type: 'text', label: 'Button Label' },
        btnLink: { type: 'custom', label: 'Button Link', render: (props) => <LinkField {...props} /> },
        btnVariant: { 
          type: 'select', 
          label: 'Button Style', 
          options: [
            { label: 'Primary', value: 'primary' }, 
            { label: 'Secondary', value: 'secondary' }, 
            { label: 'Dark', value: 'dark' }
          ] 
        },
        btnSize: { 
          type: 'select', 
          label: 'Button Size', 
          options: [
            { label: 'Small', value: 'sm' }, 
            { label: 'Medium', value: 'md' }, 
            { label: 'Large', value: 'lg' }
          ] 
        },
        image: { type: 'custom', label: 'Image', render: ImageUploadField },
        imagePosition: { 
          type: 'select', 
          label: 'Image Position', 
          options: [
            { label: 'Right', value: 'right' }, 
            { label: 'Left', value: 'left' }
          ] 
        },
        bg: { type: 'text', label: 'Background Color' },
      },
      defaultProps: {
        badge: 'Feature',
        headline: 'Powerful Tools for Modern Teams',
        body: 'Collaborate in real time, ship faster, and build better products. Everything your team needs in one place.',
        btnLabel: 'Learn More',
        btnLink: { url: '#', target: '_self' },
        btnVariant: 'primary',
        btnSize: 'md',
        image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
        imagePosition: 'right',
        bg: '#ffffff',
      },
      render: ({ badge, headline, body, btnLabel, btnLink, btnVariant, btnSize, image, imagePosition, bg }) => {
        const textCol = (
          <div className="pb-text-content">
            {badge && <Badge text={badge} />}
            <h2 className="pb-heading-md">{headline}</h2>
            <p className="pb-text">{body}</p>
            {btnLabel && btn(btnLabel, btnVariant, btnLink, btnSize)}
          </div>
        )
        const imgCol = image && (
          <div className="pb-image-wrapper">
            <img src={image} alt={headline} className="pb-image-round" />
          </div>
        )
        return (
          <section className="pb-section" style={{ background: bg || '#fff' }}>
            <div className="pb-container">
              <div className={`pb-grid pb-grid-2 pb-grid-gap-lg`} style={{ alignItems: 'center' }}>
                {imagePosition === 'left' ? <>{imgCol}{textCol}</> : <>{textCol}{imgCol}</>}
              </div>
            </div>
          </section>
        )
      },
    },

    // ─── FEATURE GRID - FULLY EDITABLE ──────────────────────────────────────

    FeatureGrid: {
      group: 'Content',
      label: 'Feature Grid',
      fields: {
        headline: { type: 'text', label: 'Section Headline' },
        subheadline: { type: 'textarea', label: 'Sub-headline' },
        columns: { 
          type: 'select', 
          label: 'Columns', 
          options: [
            { label: '2 Columns', value: '2' }, 
            { label: '3 Columns', value: '3' }, 
            { label: '4 Columns', value: '4' }
          ] 
        },
        bg: { type: 'text', label: 'Background Color' },
        features: {
          type: 'array',
          label: 'Features',
          getItemSummary: (item) => item?.title || 'Feature',
          arrayFields: {
            icon: { type: 'text', label: 'Icon (emoji)', default: '✨' },
            title: { type: 'text', label: 'Title', default: 'Feature Title' },
            description: { type: 'textarea', label: 'Description', default: 'Feature description goes here.' },
          },
        },
      },
      defaultProps: {
        headline: 'Everything You Need',
        subheadline: 'Packed with features that help you ship faster and build smarter.',
        columns: '3',
        bg: '#f8fafc',
        features: [
          { icon: '⚡', title: 'Lightning Fast', description: 'Optimized for performance. Your pages load instantly.' },
          { icon: '🎨', title: 'Fully Customizable', description: 'Customize every pixel with our intuitive editor.' },
          { icon: '🔒', title: 'Secure by Default', description: 'Enterprise-grade security built in from the ground up.' },
          { icon: '📱', title: 'Mobile First', description: 'Every component is fully responsive out of the box.' },
          { icon: '🔗', title: 'Easy Integrations', description: 'Connect with your favorite tools in one click.' },
          { icon: '📊', title: 'Built-in Analytics', description: 'Track visits, conversions, and user behavior easily.' },
        ],
      },
      render: ({ headline, subheadline, columns, bg, features = [] }) => {
        const safeFeatures = Array.isArray(features) ? features : []
        return (
          <section className="pb-section" style={{ background: bg || '#f8fafc' }}>
            <div className="pb-container">
              <div className="pb-text-center pb-mb-60">
                <h2 className="pb-heading-md">{headline || 'Features'}</h2>
                <p className="pb-text" style={{ maxWidth: '600px', margin: '0 auto' }}>{subheadline}</p>
              </div>
              <div className={`pb-grid pb-grid-${columns || 3}`}>
                {safeFeatures.map((f, i) => (
                  <div key={i} className="pb-card pb-card-shadow">
                    <div className="pb-feature-icon">{f.icon || '✨'}</div>
                    <h3 className="pb-card-title">{f.title || 'Feature'}</h3>
                    <p className="pb-card-text">{f.description || 'Description'}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      },
    },

    StepsSection: {
      group: 'Content',
      fields: {
        headline: { type: 'text', label: 'Headline' },
        subheadline: { type: 'textarea', label: 'Sub-headline' },
        bg: { type: 'text', label: 'Background' },
        steps: {
          type: 'array',
          label: 'Steps',
          getItemSummary: (item) => item?.title || 'Step',
          arrayFields: {
            title: { type: 'text', label: 'Step Title', default: 'Step Title' },
            description: { type: 'textarea', label: 'Description', default: 'Step description.' },
          },
        },
      },
      defaultProps: {
        headline: 'How It Works',
        subheadline: 'Get started in three simple steps.',
        bg: '#ffffff',
        steps: [
          { title: 'Create Account', description: 'Sign up for free and set up your workspace in seconds.' },
          { title: 'Build Your Page', description: 'Drag and drop components to design your perfect page.' },
          { title: 'Publish & Share', description: 'Go live instantly and share your page with the world.' },
        ],
      },
      render: ({ headline, subheadline, bg, steps = [] }) => {
        const safeSteps = Array.isArray(steps) ? steps : []
        return (
          <section className="pb-section" style={{ background: bg || '#fff' }}>
            <div className="pb-container pb-container-sm pb-text-center">
              <h2 className="pb-heading-md">{headline}</h2>
              <p className="pb-text" style={{ marginBottom: '60px' }}>{subheadline}</p>
              <div className="pb-steps-list">
                {safeSteps.map((step, i) => (
                  <div key={i} className="pb-step-item">
                    <div className="pb-step-number">{i + 1}</div>
                    <div className="pb-step-content">
                      <h3 className="pb-step-title">{step.title}</h3>
                      <p className="pb-text-sm">{step.description}</p>
                    </div>
                    {i < safeSteps.length - 1 && <div className="pb-step-connector" />}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      },
    },

    // ── CARDS ─────────────────────────────────────────────────────────────────

    CardBasic: {
      group: 'Cards',
      fields: {
        image: { type: 'custom', label: 'Image', render: ImageUploadField },
        badge: { type: 'text', label: 'Badge' },
        title: { type: 'text', label: 'Title' },
        description: { type: 'textarea', label: 'Description' },
        btnLabel: { type: 'text', label: 'Button Text' },
        btnLink: { type: 'custom', label: 'Button Link', render: (props) => <LinkField {...props} /> },
        shadow: { 
          type: 'radio', 
          label: 'Shadow', 
          options: [
            { label: 'Yes', value: 'yes' }, 
            { label: 'No', value: 'no' }
          ] 
        },
      },
      defaultProps: { 
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 
        badge: 'New', 
        title: 'Product Title', 
        description: 'A short description of what makes this product amazing.', 
        btnLabel: 'View Details',
        btnLink: { url: '#', target: '_self' },
        shadow: 'yes' 
      },
      render: ({ image, badge, title, description, btnLabel, btnLink, shadow }) => (
        <div className={`pb-card ${shadow === 'yes' ? 'pb-card-shadow' : ''}`}>
          {image && <img src={image} alt={title} className="pb-card-image" />}
          <div className="pb-card-body">
            {badge && <Badge text={badge} />}
            <h3 className="pb-card-title">{title}</h3>
            <p className="pb-card-text">{description}</p>
            {btnLabel && btn(btnLabel, 'primary', btnLink)}
          </div>
        </div>
      ),
    },

    CardIconFeature: {
      group: 'Cards',
      fields: {
        icon: { type: 'text', label: 'Icon (emoji)' },
        title: { type: 'text', label: 'Title' },
        description: { type: 'textarea', label: 'Description' },
        iconBg: { type: 'text', label: 'Icon Background Color' },
      },
      defaultProps: { 
        icon: '🚀', 
        title: 'Deploy Anywhere', 
        description: 'Push to any cloud platform in a single command. Fully automated CI/CD.', 
        iconBg: '#eff6ff' 
      },
      render: ({ icon, title, description, iconBg }) => (
        <div className="pb-card">
          <div className="pb-icon-card" style={{ background: iconBg || '#eff6ff' }}>{icon}</div>
          <h3 className="pb-card-title">{title}</h3>
          <p className="pb-card-text">{description}</p>
        </div>
      ),
    },

    CardTeam: {
      group: 'Cards',
      fields: {
        image: { type: 'custom', label: 'Photo', render: ImageUploadField },
        name: { type: 'text', label: 'Name' },
        role: { type: 'text', label: 'Role' },
        bio: { type: 'textarea', label: 'Bio' },
      },
      defaultProps: { 
        image: 'https://i.pravatar.cc/300?u=team1', 
        name: 'Alex Johnson', 
        role: 'CEO & Co-Founder', 
        bio: 'Passionate about building products that make a difference.' 
      },
      render: ({ image, name, role, bio }) => (
        <div className="pb-card pb-text-center">
          <img src={image} alt={name} className="pb-team-avatar" />
          <h3 className="pb-card-title">{name}</h3>
          <p className="pb-team-role">{role}</p>
          <p className="pb-text-sm">{bio}</p>
        </div>
      ),
    },

    CardBlog: {
      group: 'Cards',
      fields: {
        image: { type: 'custom', label: 'Cover Image', render: ImageUploadField },
        category: { type: 'text', label: 'Category' },
        date: { type: 'text', label: 'Date' },
        title: { type: 'text', label: 'Title' },
        excerpt: { type: 'textarea', label: 'Excerpt' },
        authorName: { type: 'text', label: 'Author' },
        authorAvatar: { type: 'custom', label: 'Author Avatar', render: ImageUploadField },
      },
      defaultProps: {
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
        category: 'Design',
        date: 'Jan 15, 2025',
        title: '10 Design Trends Shaping the Web in 2025',
        excerpt: 'From glassmorphism to micro-interactions, here\'s what\'s defining modern web design this year.',
        authorName: 'Emily Clark',
        authorAvatar: 'https://i.pravatar.cc/40?u=emily',
      },
      render: ({ image, category, date, title, excerpt, authorName, authorAvatar }) => (
        <div className="pb-card pb-card-shadow">
          {image && <img src={image} alt={title} className="pb-card-image" />}
          <div className="pb-card-body">
            <div className="pb-blog-meta">
              {category && <Badge text={category} />}
              <span className="pb-blog-date">{date}</span>
            </div>
            <h3 className="pb-card-title">{title}</h3>
            <p className="pb-card-text">{excerpt}</p>
            <div className="pb-blog-author">
              {authorAvatar && <img src={authorAvatar} alt={authorName} className="pb-author-avatar" />}
              <span className="pb-author-name">{authorName}</span>
            </div>
          </div>
        </div>
      ),
    },

    CardStats: {
      group: 'Cards',
      fields: {
        stats: {
          type: 'array',
          label: 'Stats',
          getItemSummary: (item) => item?.label || 'Stat',
          arrayFields: {
            value: { type: 'text', label: 'Value', default: '100+' },
            label: { type: 'text', label: 'Label', default: 'Stat Label' },
            icon: { type: 'text', label: 'Icon (emoji)', default: '📊' },
            color: { type: 'text', label: 'Accent Color', default: '#2563eb' },
          },
        },
        columns: { 
          type: 'select', 
          label: 'Columns', 
          options: [
            { label: '2', value: '2' }, 
            { label: '3', value: '3' }, 
            { label: '4', value: '4' }
          ] 
        },
        bg: { type: 'text', label: 'Background' },
      },
      defaultProps: {
        columns: '4',
        bg: '#ffffff',
        stats: [
          { value: '50K+', label: 'Happy Customers', icon: '😊', color: '#2563eb' },
          { value: '99.9%', label: 'Uptime SLA', icon: '⚡', color: '#10b981' },
          { value: '150+', label: 'Countries', icon: '🌍', color: '#f59e0b' },
          { value: '24/7', label: 'Support', icon: '💬', color: '#8b5cf6' },
        ],
      },
      render: ({ stats = [], columns, bg }) => {
        const safeStats = Array.isArray(stats) ? stats : []
        return (
          <section className="pb-section pb-section-sm" style={{ background: bg || '#fff' }}>
            <div className="pb-container">
              <div className={`pb-stats pb-stats-${columns || 4}`}>
                {safeStats.map((s, i) => (
                  <div key={i} className="pb-stat-item" style={{ borderColor: `${s.color || '#e2e8f0'}20` }}>
                    {s.icon && <div className="pb-stat-icon">{s.icon}</div>}
                    <div className="pb-stat-value" style={{ color: s.color || '#1e293b' }}>{s.value}</div>
                    <div className="pb-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      },
    },

    // ── TESTIMONIALS ──────────────────────────────────────────────────────────

    TestimonialGrid: {
      group: 'Social Proof',
      fields: {
        headline: { type: 'text', label: 'Section Headline' },
        columns: { 
          type: 'select', 
          label: 'Columns', 
          options: [
            { label: '2', value: '2' }, 
            { label: '3', value: '3' }
          ] 
        },
        bg: { type: 'text', label: 'Background' },
        testimonials: {
          type: 'array',
          label: 'Testimonials',
          getItemSummary: (item) => item?.author || 'Testimonial',
          arrayFields: {
            quote: { type: 'textarea', label: 'Quote', default: 'Great product!' },
            author: { type: 'text', label: 'Author Name', default: 'John Doe' },
            role: { type: 'text', label: 'Role & Company', default: 'CEO @ Company' },
            avatar: { type: 'custom', label: 'Avatar', render: ImageUploadField },
            rating: { 
              type: 'select', 
              label: 'Stars', 
              options: [
                { label: '5', value: '5' }, 
                { label: '4', value: '4' }, 
                { label: '3', value: '3' }
              ],
              default: '5'
            },
          },
        },
      },
      defaultProps: {
        headline: 'Loved by Thousands',
        columns: '3',
        bg: '#f8fafc',
        testimonials: [
          { quote: "This is the best page builder I've ever used. I shipped my landing page in under an hour.", author: 'Sarah Kim', role: 'Founder @ LaunchFast', avatar: 'https://i.pravatar.cc/80?u=sarah', rating: '5' },
          { quote: "The components look stunning right out of the box. My clients love the results.", author: 'Mark Torres', role: 'Freelance Designer', avatar: 'https://i.pravatar.cc/80?u=mark', rating: '5' },
          { quote: "Finally a builder that doesn't get in my way. Clean, fast, professional.", author: 'Priya Mehta', role: 'Marketing Lead @ Acme', avatar: 'https://i.pravatar.cc/80?u=priya', rating: '5' },
        ],
      },
      render: ({ headline, columns, bg, testimonials = [] }) => {
        const safeTestimonials = Array.isArray(testimonials) ? testimonials : []
        return (
          <section className="pb-section" style={{ background: bg || '#f8fafc' }}>
            <div className="pb-container">
              {headline && <h2 className="pb-heading-md pb-text-center pb-mb-60">{headline}</h2>}
              <div className={`pb-grid pb-grid-${columns || 3}`}>
                {safeTestimonials.map((t, i) => (
                  <div key={i} className="pb-testimonial">
                    <Stars count={parseInt(t.rating) || 5} />
                    <p className="pb-testimonial-quote">"{t.quote}"</p>
                    <div className="pb-testimonial-author">
                      {t.avatar && <img src={t.avatar} alt={t.author} className="pb-testimonial-avatar" />}
                      <div>
                        <div className="pb-testimonial-name">{t.author}</div>
                        <div className="pb-testimonial-role">{t.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      },
    },

    LogoBanner: {
      group: 'Social Proof',
      fields: {
        headline: { type: 'text', label: 'Headline (e.g. "Trusted by...")' },
        bg: { type: 'text', label: 'Background' },
        logos: {
          type: 'array',
          label: 'Logos',
          getItemSummary: (item) => item?.name || 'Logo',
          arrayFields: {
            name: { type: 'text', label: 'Company Name', default: 'Company' },
            url: { type: 'custom', label: 'Logo Image', render: ImageUploadField },
          },
        },
      },
      defaultProps: {
        headline: 'Trusted by Industry Leaders',
        bg: '#ffffff',
        logos: [
          { name: 'Google', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png' },
          { name: 'Microsoft', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png' },
        ],
      },
      render: ({ headline, bg, logos = [] }) => {
        const safeLogos = Array.isArray(logos) ? logos : []
        return (
          <section className="pb-section pb-section-sm" style={{ background: bg || '#fff' }}>
            <div className="pb-container pb-text-center">
              {headline && <p className="pb-logo-headline">{headline}</p>}
              <div className="pb-logo-row">
                {safeLogos.map((logo, i) => (
                  logo.url
                    ? <img key={i} src={logo.url} alt={logo.name} className="pb-logo-img" />
                    : <span key={i} className="pb-logo-text">{logo.name}</span>
                ))}
              </div>
            </div>
          </section>
        )
      },
    },

    // ── PRICING ───────────────────────────────────────────────────────────────

    PricingSection: {
      group: 'Pricing',
      fields: {
        headline: { type: 'text', label: 'Headline' },
        subheadline: { type: 'textarea', label: 'Sub-headline' },
        bg: { type: 'text', label: 'Background' },
        plans: {
          type: 'array',
          label: 'Plans',
          getItemSummary: (item) => item?.name || 'Plan',
          arrayFields: {
            name: { type: 'text', label: 'Plan Name', default: 'Plan Name' },
            price: { type: 'text', label: 'Price (e.g. $49)', default: '$49' },
            period: { type: 'text', label: 'Period (e.g. /month)', default: '/month' },
            description: { type: 'textarea', label: 'Description', default: 'Plan description.' },
            features: { type: 'textarea', label: 'Features (one per line)', default: 'Feature 1\nFeature 2\nFeature 3' },
            btnText: { type: 'text', label: 'Button Text', default: 'Get Started' },
            btnLink: { type: 'custom', label: 'Button Link', render: (props) => <LinkField {...props} /> },
            highlighted: { 
              type: 'radio', 
              label: 'Featured?', 
              options: [
                { label: 'Yes', value: 'yes' }, 
                { label: 'No', value: 'no' }
              ],
              default: 'no'
            },
          },
        },
      },
      defaultProps: {
        headline: 'Simple, Transparent Pricing',
        subheadline: 'Choose the plan that works for your team. Upgrade or downgrade anytime.',
        bg: '#f8fafc',
        plans: [
          { name: 'Starter', price: 'Free', period: 'forever', description: 'Perfect for individuals.', features: '3 Pages\n1 Custom Domain\nBasic Templates\nEmail Support', btnText: 'Get Started', btnLink: { url: '#', target: '_self' }, highlighted: 'no' },
          { name: 'Pro', price: '$29', period: '/month', description: 'For growing teams.', features: 'Unlimited Pages\n5 Custom Domains\nAll Templates\nPriority Support\nSEO Tools\nAnalytics', btnText: 'Start Free Trial', btnLink: { url: '#', target: '_self' }, highlighted: 'yes' },
          { name: 'Enterprise', price: '$99', period: '/month', description: 'For large organizations.', features: 'Everything in Pro\nUnlimited Domains\nCustom Integrations\n24/7 Phone Support\nSLA Guarantee\nSSO & Security', btnText: 'Contact Sales', btnLink: { url: '#', target: '_self' }, highlighted: 'no' },
        ],
      },
      render: ({ headline, subheadline, bg, plans = [] }) => {
        const safePlans = Array.isArray(plans) ? plans : []
        return (
          <section className="pb-section" style={{ background: bg || '#f8fafc' }}>
            <div className="pb-container">
              <div className="pb-text-center pb-mb-60">
                <h2 className="pb-heading-md">{headline}</h2>
                <p className="pb-text" style={{ maxWidth: '600px', margin: '0 auto' }}>{subheadline}</p>
              </div>
              <div className={`pb-grid pb-grid-${safePlans.length}`}>
                {safePlans.map((plan, i) => {
                  const isHighlighted = plan.highlighted === 'yes'
                  return (
                    <div key={i} className={`pb-pricing ${isHighlighted ? 'pb-pricing-featured' : ''}`}>
                      {isHighlighted && <div className="pb-pricing-badge">Most Popular</div>}
                      <h3 className="pb-pricing-name">{plan.name}</h3>
                      <p className="pb-pricing-desc">{plan.description}</p>
                      <div className="pb-pricing-price-wrap">
                        <span className="pb-pricing-price">{plan.price}</span>
                        <span className="pb-pricing-period">{plan.period}</span>
                      </div>
                      <ul className="pb-pricing-features">
                        {(plan.features || '').split('\n').filter(Boolean).map((f, j) => (
                          <li key={j}>✓ {f}</li>
                        ))}
                      </ul>
                      {plan.btnText && btn(plan.btnText, isHighlighted ? 'light' : 'primary', plan.btnLink, 'md')}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )
      },
    },

    // ─── FAQ SECTION - FULLY EDITABLE ───────────────────────────────────────

    FAQSection: {
      group: 'FAQ & Accordion',
      label: 'FAQ Section',
      fields: {
        headline: { type: 'text', label: 'Headline' },
        subheadline: { type: 'textarea', label: 'Sub-headline' },
        bg: { type: 'text', label: 'Background Color' },
        layout: { 
          type: 'select', 
          label: 'Layout', 
          options: [
            { label: 'Single Column', value: 'single' }, 
            { label: 'Two Columns', value: 'double' }
          ] 
        },
        items: {
          type: 'array',
          label: 'FAQ Items',
          getItemSummary: (item) => item?.question || 'Question',
          arrayFields: {
            question: { type: 'text', label: 'Question', default: 'What is your question?' },
            answer: { type: 'textarea', label: 'Answer', default: 'Here is the answer to your question.' },
          },
        },
      },
      defaultProps: {
        headline: 'Frequently Asked Questions',
        subheadline: "Can't find what you're looking for? Reach out to our support team.",
        bg: '#ffffff',
        layout: 'single',
        items: [
          { question: 'How does the free trial work?', answer: 'Start with our free plan forever. Upgrade anytime when you need more features.' },
          { question: 'Can I export my pages?', answer: 'Yes! Export your pages as clean HTML/CSS or deploy directly to our hosting.' },
          { question: 'Do I need to know how to code?', answer: 'Not at all. Our drag-and-drop interface is designed for everyone.' },
          { question: 'What kind of support do you offer?', answer: 'We offer email, chat, and phone support depending on your plan.' },
        ],
      },
      render: ({ headline, subheadline, bg, layout, items = [] }) => {
        const [openIndex, setOpenIndex] = React.useState(null)
        const safeItems = Array.isArray(items) ? items : []
        const half = Math.ceil(safeItems.length / 2)
        const leftItems = layout === 'double' ? safeItems.slice(0, half) : safeItems
        const rightItems = layout === 'double' ? safeItems.slice(half) : []

        return (
          <section className="pb-section" style={{ background: bg || '#ffffff' }}>
            <div className="pb-container pb-container-sm">
              <div className="pb-text-center pb-mb-60">
                <h2 className="pb-heading-md">{headline || 'Frequently Asked Questions'}</h2>
                <p className="pb-text">{subheadline}</p>
              </div>
              <div className={`pb-faq-grid ${layout === 'double' ? 'pb-faq-double' : ''}`}>
                <div className="pb-faq-column">
                  {leftItems.map((item, i) => (
                    <AccordionItem 
                      key={i} 
                      question={item.question} 
                      answer={item.answer}
                      isOpen={openIndex === i}
                      onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                    />
                  ))}
                </div>
                {layout === 'double' && (
                  <div className="pb-faq-column">
                    {rightItems.map((item, i) => (
                      <AccordionItem 
                        key={i + half} 
                        question={item.question} 
                        answer={item.answer}
                        isOpen={openIndex === i + half}
                        onToggle={() => setOpenIndex(openIndex === i + half ? null : i + half)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )
      },
    },

    // ── MEDIA ─────────────────────────────────────────────────────────────────

    Image: {
      group: 'Media',
      fields: {
        src: { type: 'custom', label: 'Image', render: ImageUploadField },
        alt: { type: 'text', label: 'Alt Text' },
        width: { type: 'text', label: 'Width (e.g. 100% or 600px)' },
        align: { 
          type: 'select', 
          label: 'Align', 
          options: [
            { label: 'Left', value: 'left' }, 
            { label: 'Center', value: 'center' }, 
            { label: 'Right', value: 'right' }
          ] 
        },
        rounded: { 
          type: 'select', 
          label: 'Corners', 
          options: [
            { label: 'None', value: '0' }, 
            { label: 'Small', value: '8px' }, 
            { label: 'Medium', value: '16px' }, 
            { label: 'Large', value: '24px' }
          ] 
        },
        shadow: { 
          type: 'radio', 
          label: 'Shadow', 
          options: [
            { label: 'Yes', value: 'yes' }, 
            { label: 'No', value: 'no' }
          ] 
        },
        caption: { type: 'text', label: 'Caption (optional)' },
        link: { type: 'custom', label: 'Image Link', render: (props) => <LinkField {...props} /> },
      },
      defaultProps: { 
        src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200', 
        alt: 'Image', 
        width: '100%', 
        align: 'center', 
        rounded: '16px', 
        shadow: 'yes', 
        caption: '',
        link: null
      },
      render: ({ src, alt, width, align, rounded, shadow, caption, link }) => {
        const imgEl = (
          <img 
            src={src} 
            alt={alt} 
            className="pb-image"
            style={{ 
              width: width || '100%', 
              borderRadius: rounded || '0', 
              boxShadow: shadow === 'yes' ? '0 20px 40px rgba(0,0,0,0.12)' : 'none'
            }} 
          />
        )
        
        return (
          <div className="pb-image-wrapper" style={{ textAlign: align }}>
            {link && link.url ? (
              <a href={link.url} target={link.target || '_self'} rel={link.rel || ''}>
                {imgEl}
              </a>
            ) : imgEl}
            {caption && <p className="pb-image-caption">{caption}</p>}
          </div>
        )
      },
    },

    Gallery: {
      group: 'Media',
      fields: {
        headline: { type: 'text', label: 'Headline (optional)' },
        columns: { 
          type: 'select', 
          label: 'Columns', 
          options: [
            { label: '2', value: '2' }, 
            { label: '3', value: '3' }, 
            { label: '4', value: '4' }
          ] 
        },
        gap: { type: 'text', label: 'Gap (e.g. 16px)' },
        images: { 
          type: 'custom', 
          label: 'Gallery Images', 
          render: (props) => <GalleryImageManager {...props} /> 
        },
      },
      defaultProps: {
        headline: '',
        columns: '3',
        gap: '16px',
        images: [
          { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600', caption: '' },
          { url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600', caption: '' },
          { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', caption: '' },
        ],
      },
      render: ({ headline, columns, gap, images = [] }) => {
        const safeImages = Array.isArray(images) ? images : []
        return (
          <div className="pb-gallery-wrapper">
            {headline && <h2 className="pb-heading-md pb-text-center pb-mb-40">{headline}</h2>}
            <div className={`pb-gallery pb-gallery-${columns || 3}`} style={{ gap: gap || '16px' }}>
              {safeImages.map((img, i) => (
                <div key={i} className="pb-gallery-item">
                  <img src={img.url} alt={img.caption || `Gallery ${i}`} />
                  {img.caption && <p className="pb-gallery-caption">{img.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        )
      },
    },

    VideoEmbed: {
      group: 'Media',
      fields: {
        url: { type: 'text', label: 'Embed URL (YouTube/Vimeo)' },
        aspectRatio: { 
          type: 'select', 
          label: 'Aspect Ratio', 
          options: [
            { label: '16:9', value: '56.25%' }, 
            { label: '4:3', value: '75%' }, 
            { label: '1:1', value: '100%' }
          ] 
        },
        rounded: { type: 'text', label: 'Border Radius' },
      },
      defaultProps: { 
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', 
        aspectRatio: '56.25%', 
        rounded: '16px' 
      },
      render: ({ url, aspectRatio, rounded }) => (
        <div className="pb-video-wrapper" style={{ borderRadius: rounded || '16px' }}>
          <div className="pb-video-container" style={{ paddingBottom: aspectRatio || '56.25%' }}>
            <iframe src={url} title="Video" frameBorder="0" allowFullScreen />
          </div>
        </div>
      ),
    },

    // ─── FORMS ────────────────────────────────────────────────────────────────

    ContactForm: {
      group: 'Forms',
      fields: {
        headline: { type: 'text', label: 'Headline' },
        subheadline: { type: 'textarea', label: 'Sub-headline' },
        btnText: { type: 'text', label: 'Submit Button' },
        bg: { type: 'text', label: 'Background' },
        showPhone: { 
          type: 'radio', 
          label: 'Phone Field', 
          options: [
            { label: 'Show', value: 'yes' }, 
            { label: 'Hide', value: 'no' }
          ] 
        },
        showSubject: { 
          type: 'radio', 
          label: 'Subject Field', 
          options: [
            { label: 'Show', value: 'yes' }, 
            { label: 'Hide', value: 'no' }
          ] 
        },
      },
      defaultProps: { 
        headline: 'Get In Touch', 
        subheadline: "We'd love to hear from you. Fill out the form below and we'll get back to you shortly.", 
        btnText: 'Send Message', 
        bg: '#f8fafc', 
        showPhone: 'yes', 
        showSubject: 'yes' 
      },
      render: ({ headline, subheadline, btnText, bg, showPhone, showSubject }) => (
        <section className="pb-section" style={{ background: bg || '#f8fafc' }}>
          <div className="pb-container pb-container-xs">
            <div className="pb-text-center pb-mb-48">
              <h2 className="pb-heading-md">{headline}</h2>
              <p className="pb-text">{subheadline}</p>
            </div>
            <div className="pb-form">
              <div className="pb-form-row">
                <div className="pb-form-group">
                  <label className="pb-form-label">First Name</label>
                  <input className="pb-form-input" placeholder="John" />
                </div>
                <div className="pb-form-group">
                  <label className="pb-form-label">Last Name</label>
                  <input className="pb-form-input" placeholder="Doe" />
                </div>
              </div>
              <div className="pb-form-group">
                <label className="pb-form-label">Email Address</label>
                <input type="email" className="pb-form-input" placeholder="john@example.com" />
              </div>
              {showPhone === 'yes' && (
                <div className="pb-form-group">
                  <label className="pb-form-label">Phone Number</label>
                  <input type="tel" className="pb-form-input" placeholder="+1 (555) 000-0000" />
                </div>
              )}
              {showSubject === 'yes' && (
                <div className="pb-form-group">
                  <label className="pb-form-label">Subject</label>
                  <input className="pb-form-input" placeholder="How can we help?" />
                </div>
              )}
              <div className="pb-form-group">
                <label className="pb-form-label">Message</label>
                <textarea className="pb-form-input" rows={5} placeholder="Tell us more..." />
              </div>
              <button className="pb-btn pb-btn-primary pb-btn-block">{btnText || 'Send Message'}</button>
            </div>
          </div>
        </section>
      ),
    },

    NewsletterCTA: {
      group: 'Forms',
      fields: {
        headline: { type: 'text', label: 'Headline' },
        subheadline: { type: 'textarea', label: 'Sub-headline' },
        placeholder: { type: 'text', label: 'Input Placeholder' },
        btnText: { type: 'text', label: 'Button Text' },
        btnLink: { type: 'custom', label: 'Button Link', render: (props) => <LinkField {...props} /> },
        bg: { type: 'text', label: 'Background' },
        layout: { 
          type: 'select', 
          label: 'Layout', 
          options: [
            { label: 'Card', value: 'card' }, 
            { label: 'Full Banner', value: 'banner' }
          ] 
        },
      },
      defaultProps: { 
        headline: 'Stay in the Loop', 
        subheadline: 'Get the latest updates, tips, and insights delivered to your inbox.', 
        placeholder: 'Enter your email', 
        btnText: 'Subscribe Free', 
        btnLink: { url: '#', target: '_self' },
        bg: '#1e293b', 
        layout: 'banner' 
      },
      render: ({ headline, subheadline, placeholder, btnText, btnLink, bg, layout }) => (
        <section className={`pb-newsletter ${layout === 'card' ? 'pb-newsletter-card' : 'pb-newsletter-banner'}`} style={{ background: bg || '#1e293b' }}>
          <div className="pb-container pb-container-xs pb-text-center">
            <h2 className="pb-heading-md" style={{ color: layout === 'card' ? '#1e293b' : '#fff' }}>{headline}</h2>
            <p className="pb-text" style={{ color: layout === 'card' ? '#64748b' : 'rgba(255,255,255,0.75)' }}>{subheadline}</p>
            <div className="pb-newsletter-form">
              <input type="email" placeholder={placeholder || 'Enter your email'} className="pb-form-input" />
              {btnText && btn(btnText, 'primary', btnLink)}
            </div>
          </div>
        </section>
      ),
    },

    // ── CTA ───────────────────────────────────────────────────────────────────

    CTABanner: {
      group: 'CTA',
      fields: {
        headline: { type: 'text', label: 'Headline' },
        subheadline: { type: 'textarea', label: 'Sub-headline' },
        primaryBtn: { type: 'text', label: 'Primary Button' },
        primaryLink: { type: 'custom', label: 'Primary Button Link', render: (props) => <LinkField {...props} /> },
        secondaryBtn: { type: 'text', label: 'Secondary Button (optional)' },
        secondaryLink: { type: 'custom', label: 'Secondary Button Link', render: (props) => <LinkField {...props} /> },
        bg: { 
          type: 'select', 
          label: 'Background', 
          options: [
            { label: 'Dark', value: '#0f172a' }, 
            { label: 'Blue', value: '#1d4ed8' }, 
            { label: 'Gradient', value: 'gradient' }, 
            { label: 'White', value: '#ffffff' }
          ] 
        },
      },
      defaultProps: { 
        headline: 'Ready to Get Started?', 
        subheadline: 'Join thousands of teams building faster with our platform.', 
        primaryBtn: 'Start for Free',
        primaryLink: { url: '#', target: '_self' },
        secondaryBtn: 'Talk to Sales',
        secondaryLink: { url: '#', target: '_self' },
        bg: 'gradient' 
      },
      render: ({ headline, subheadline, primaryBtn, secondaryBtn, primaryLink, secondaryLink, bg }) => {
        const background = bg === 'gradient' ? 'linear-gradient(135deg, #1d4ed8, #7c3aed)' : bg
        const isDark = bg !== '#ffffff'
        return (
          <section className="pb-section pb-section-lg" style={{ background, textAlign: 'center' }}>
            <div className="pb-container pb-container-sm">
              <h2 className="pb-heading-lg" style={{ color: isDark ? '#fff' : '#1e293b' }}>{headline}</h2>
              <p className="pb-text" style={{ color: isDark ? 'rgba(255,255,255,0.8)' : '#64748b' }}>{subheadline}</p>
              <div className="pb-hero-actions pb-hero-actions-center">
                {primaryBtn && btn(primaryBtn, isDark ? 'light' : 'primary', primaryLink)}
                {secondaryBtn && btn(secondaryBtn, isDark ? 'secondary' : 'secondary', secondaryLink)}
              </div>
            </div>
          </section>
        )
      },
    },

    Button: {
      group: 'CTA',
      fields: {
        label: { type: 'text', label: 'Label' },
        variant: { 
          type: 'select', 
          label: 'Style', 
          options: [
            { label: 'Primary', value: 'primary' }, 
            { label: 'Secondary', value: 'secondary' }, 
            { label: 'Dark', value: 'dark' }, 
            { label: 'Danger', value: 'danger' }
          ] 
        },
        size: { 
          type: 'select', 
          label: 'Size', 
          options: [
            { label: 'Small', value: 'sm' }, 
            { label: 'Medium', value: 'md' }, 
            { label: 'Large', value: 'lg' }
          ] 
        },
        align: { 
          type: 'select', 
          label: 'Align', 
          options: [
            { label: 'Left', value: 'left' }, 
            { label: 'Center', value: 'center' }, 
            { label: 'Right', value: 'right' }
          ] 
        },
        link: { type: 'custom', label: 'Button Link', render: (props) => <LinkField {...props} /> },
        fullWidth: { 
          type: 'radio', 
          label: 'Full Width?', 
          options: [
            { label: 'No', value: 'no' }, 
            { label: 'Yes', value: 'yes' }
          ] 
        },
      },
      defaultProps: { 
        label: 'Click Here', 
        variant: 'primary', 
        size: 'md', 
        align: 'center', 
        link: { url: '#', target: '_self' },
        fullWidth: 'no' 
      },
      render: ({ label, variant, size, align, link, fullWidth }) => (
        <div className="pb-button-wrapper" style={{ textAlign: align || 'center' }}>
          {btn(label, variant, link, size)}
        </div>
      ),
    },

    // ── NAVIGATION ────────────────────────────────────────────────────────────

    Navbar: {
      group: 'Navigation',
      fields: {
        logo: { type: 'text', label: 'Logo Text' },
        logoImage: { type: 'custom', label: 'Logo Image (optional)', render: ImageUploadField },
        logoLink: { type: 'custom', label: 'Logo Link', render: (props) => <LinkField {...props} /> },
        links: { type: 'textarea', label: 'Nav Links (one per line, format: Label|URL)' },
        ctaText: { type: 'text', label: 'CTA Button Text' },
        ctaLink: { type: 'custom', label: 'CTA Button Link', render: (props) => <LinkField {...props} /> },
        bg: { type: 'text', label: 'Background Color' },
        sticky: { 
          type: 'radio', 
          label: 'Sticky?', 
          options: [
            { label: 'Yes', value: 'yes' }, 
            { label: 'No', value: 'no' }
          ] 
        },
      },
      defaultProps: { 
        logo: 'YourBrand', 
        logoImage: '', 
        logoLink: { url: '/', target: '_self' },
        links: 'Home|/\nAbout|/about\nServices|/services\nContact|/contact', 
        ctaText: 'Get Started',
        ctaLink: { url: '#', target: '_self' },
        bg: '#ffffff', 
        sticky: 'yes' 
      },
      render: ({ logo, logoImage, logoLink, links, ctaText, ctaLink, bg, sticky }) => {
        const parsedLinks = (links || '').split('\n').filter(Boolean).map(l => { 
          const [label, url] = l.split('|'); 
          return { label: label?.trim(), url: url?.trim() || '#' } 
        })
        
        const logoEl = logoImage ? 
          <img src={logoImage} alt={logo} className="pb-navbar-logo" /> : 
          <span className="pb-navbar-brand">{logo}</span>
        
        return (
          <nav className={`pb-navbar ${sticky === 'yes' ? 'pb-navbar-sticky' : ''}`} style={{ background: bg || '#fff' }}>
            <div className="pb-navbar-brand-wrap">
              {logoLink && logoLink.url ? (
                <a href={logoLink.url} target={logoLink.target || '_self'} rel={logoLink.rel || ''}>
                  {logoEl}
                </a>
              ) : logoEl}
            </div>
            <div className="pb-navbar-links">
              {parsedLinks.map((link, i) => (
                <a key={i} href={link.url} className="pb-navbar-link">{link.label}</a>
              ))}
            </div>
            {ctaText && btn(ctaText, 'primary', ctaLink)}
          </nav>
        )
      },
    },

    Footer: {
      group: 'Navigation',
      fields: {
        logo: { type: 'text', label: 'Brand Name' },
        tagline: { type: 'text', label: 'Tagline' },
        copyright: { type: 'text', label: 'Copyright Text' },
        links: { type: 'textarea', label: 'Footer Links (Label|URL, one per line)' },
        bg: { type: 'text', label: 'Background' },
      },
      defaultProps: { 
        logo: 'YourBrand', 
        tagline: 'Build remarkable pages.', 
        copyright: '© 2025 YourBrand. All rights reserved.', 
        links: 'Privacy Policy|/privacy\nTerms of Service|/terms\nContact|/contact', 
        bg: '#0f172a' 
      },
      render: ({ logo, tagline, copyright, links, bg }) => {
        const parsedLinks = (links || '').split('\n').filter(Boolean).map(l => { 
          const [label, url] = l.split('|'); 
          return { label: label?.trim(), url: url?.trim() || '#' } 
        })
        return (
          <footer className="pb-footer" style={{ background: bg || '#0f172a' }}>
            <div className="pb-container">
              <div className="pb-footer-top">
                <div>
                  <div className="pb-footer-brand">{logo}</div>
                  <div className="pb-footer-tagline">{tagline}</div>
                </div>
                <div className="pb-footer-links">
                  {parsedLinks.map((link, i) => (
                    <a key={i} href={link.url} className="pb-footer-link">{link.label}</a>
                  ))}
                </div>
              </div>
              <div className="pb-footer-bottom">{copyright}</div>
            </div>
          </footer>
        )
      },
    },

    // ── MISC ──────────────────────────────────────────────────────────────────

    AlertBanner: {
      group: 'Misc',
      fields: {
        text: { type: 'text', label: 'Message' },
        type: { 
          type: 'select', 
          label: 'Type', 
          options: [
            { label: 'Info', value: 'info' }, 
            { label: 'Success', value: 'success' }, 
            { label: 'Warning', value: 'warning' }, 
            { label: 'Error', value: 'error' }
          ] 
        },
        dismissable: { 
          type: 'radio', 
          label: 'Dismissable?', 
          options: [
            { label: 'Yes', value: 'yes' }, 
            { label: 'No', value: 'no' }
          ] 
        },
      },
      defaultProps: { 
        text: '🎉 New feature launched! Check out what\'s new →', 
        type: 'info', 
        dismissable: 'yes' 
      },
      render: ({ text, type }) => (
        <div className={`pb-alert pb-alert-${type || 'info'}`}>
          {text}
        </div>
      ),
    },

    CodeBlock: {
      group: 'Misc',
      fields: {
        code: { type: 'textarea', label: 'Code' },
        language: { type: 'text', label: 'Language Label (e.g. javascript)' },
      },
      defaultProps: { 
        code: 'const greeting = "Hello, World!";\nconsole.log(greeting);', 
        language: 'javascript' 
      },
      render: ({ code, language }) => (
        <div className="pb-code-block">
          <div className="pb-code-header">
            <div className="pb-code-dots">
              <span className="pb-code-dot pb-code-dot-red" />
              <span className="pb-code-dot pb-code-dot-yellow" />
              <span className="pb-code-dot pb-code-dot-green" />
            </div>
            <span className="pb-code-language">{language}</span>
          </div>
          <pre className="pb-code-body">{code}</pre>
        </div>
      ),
    },

    MapEmbed: {
      group: 'Misc',
      fields: {
        embedUrl: { type: 'text', label: 'Google Maps Embed URL' },
        height: { type: 'text', label: 'Height (e.g. 400px)' },
        rounded: { type: 'text', label: 'Border Radius' },
      },
      defaultProps: { 
        embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.4!2d-73.987!3d40.758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ1JzMzLjAiTiA3M8KwNTknMTMuMiJX!5e0!3m2!1sen!2sus!4v1234567890', 
        height: '400px', 
        rounded: '16px' 
      },
      render: ({ embedUrl, height, rounded }) => (
        <div className="pb-map-wrapper" style={{ borderRadius: rounded || '16px' }}>
          <iframe src={embedUrl} width="100%" height={height || '400px'} frameBorder="0" allowFullScreen title="Map" />
        </div>
      ),
    },

  },
}