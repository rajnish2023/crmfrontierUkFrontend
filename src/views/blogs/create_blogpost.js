import React, { useState, useEffect } from 'react';
import SummernoteEditor from '../../components/SummernoteEditor';
import './blogstyle.css';
import {
  CForm,
  CFormInput,
  CFormLabel,
  CFormText,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CFormTextarea,
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories, createBlogPost } from '../../api/api';
import { toast, ToastContainer } from 'react-toastify';

const CreateBlogPost = () => {
  const [newPost, setNewPost] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    metaTitle: '',
    metaDescription: '',
    metakeywords: '',
    status: 'Draft',
    schema: [' '],
    tags: []
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState({});
  const [bannerPreview, setBannerPreview] = useState(null);
  const [metaImagePreview, setMetaImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    loadCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prevPost) => {
      const nextPost = { ...prevPost, [name]: value };

      if (name === 'title' && !isSlugManual) {
        nextPost.slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      }

      return nextPost;
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

    if (name === 'slug') {
      setIsSlugManual(true);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setNewPost((prevPost) => ({ ...prevPost, [name]: file }));

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (name === 'banner') setBannerPreview(previewUrl);
      else if (name === 'metaimage') setMetaImagePreview(previewUrl);
    }
  };

  const handleEditorChange = (content) => {
    setNewPost((prevPost) => ({ ...prevPost, content }));
    setErrors(prev => ({ ...prev, content: '' }));
  };

  const handleSchemaChange = (index, value) => {
    const updated = [...newPost.schema];
    updated[index] = value;
    setNewPost((prev) => ({ ...prev, schema: updated }));
  };

  const addSchema = () => {
    setNewPost((prev) => ({ ...prev, schema: [...prev.schema, ''] }));
  };

  const removeSchema = (index) => {
    setNewPost((prev) => {
      const updatedSchema = prev.schema.filter((_, idx) => idx !== index);
      return { ...prev, schema: updatedSchema };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newPost.title) newErrors.title = 'Title is required';
    if (!newPost.slug) newErrors.slug = 'Slug is required';
    if (!newPost.category) newErrors.category = 'Category is required';
    if (!newPost.content) newErrors.content = 'Content is required';
    if (!newPost.excerpt) newErrors.excerpt = 'Excerpt is required';
    if (!newPost.tags || newPost.tags.length === 0) newErrors.tags = 'At least one tag required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    Object.keys(newPost).forEach(key => {
      if (key === 'schema') formData.append(key, JSON.stringify(newPost.schema));
      else if (key === 'tags') formData.append(key, JSON.stringify(newPost.tags));
      else formData.append(key, newPost[key]);
    });

    try {
      await createBlogPost(token, formData);
      toast.success('🎉 Blog post created successfully!');
      setTimeout(() => navigate('/all-blogs'), 1500);
    } catch (error) {
      const msg = error.response?.data?.error || error.response?.data?.message || 'Failed to create blog post';
      if (msg.toLowerCase().includes('slug')) {
        setErrors(prev => ({ ...prev, slug: 'This slug already exists. Please choose a unique one.' }));
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

const handleTagKeyDown = (e) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();

    const value = tagInput.trim();

    if (!value) return;

    // Prevent duplicate tags
    if (newPost.tags.includes(value.toLowerCase())) {
      setTagInput('');
      return;
    }

    setNewPost((prev) => ({
      ...prev,
      tags: [...prev.tags, value.toLowerCase()]
    }));

    setErrors((prev) => ({ ...prev, tags: '' }));
    setTagInput('');
  }
};

const removeTag = (indexToRemove) => {
  setNewPost((prev) => ({
    ...prev,
    tags: prev.tags.filter((_, index) => index !== indexToRemove)
  }));
};




  return (
    <div className="fade-in">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <CSpinner color="primary" size="lg" />
            <p>Publishing your blog post...</p>
          </div>
        </div>
      )}

      <CForm onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-primary m-0">Create New Post</h2>
            <p className="text-muted small">Fill in the details to publish a new blog post</p>
          </div>
          <div className="d-flex gap-2">
            <CButton color="secondary" variant="outline" onClick={() => navigate('/all-blogs')}>Cancel</CButton>
            <CButton color="primary" type="submit" className="px-4" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Post'}
            </CButton>
          </div>
        </div>

        <CRow>
          {/* Main Content */}
          <CCol lg={8}>
            <CCard className="shadow-sm mb-4 border-0">
              <CCardHeader className="bg-white py-3 border-bottom-0">
                <h5 className="m-0 fw-bold">General Information</h5>
              </CCardHeader>
              <CCardBody className="pt-0">
                <div className="mb-3">
                  <CFormLabel className="fw-semibold">Blog Title</CFormLabel>
                  <CFormInput
                    name="title"
                    value={newPost.title}
                    onChange={handleInputChange}
                    placeholder="Enter a catchy title..."
                    className={`form-control-lg ${errors.title ? 'is-invalid' : ''}`}
                  />
                  {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>

                <div className="mb-3">
                  <CFormLabel className="fw-semibold text-muted small">Blog Slug</CFormLabel>
                  <div className="input-group">
                    <CFormInput
                      name="slug"
                      value={newPost.slug}
                      onChange={handleInputChange}
                      placeholder="url-slug-example"
                      className={errors.slug ? 'is-invalid' : ''}
                    />
                    {errors.slug && <div className="invalid-feedback">{errors.slug}</div>}
                  </div>
                </div>

                <div className="mb-4">
                  <CFormLabel className="fw-semibold">Excerpt</CFormLabel>
                  <CFormTextarea
                    name="excerpt"
                    value={newPost.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="A brief summary for search results..."
                    className={errors.excerpt ? 'is-invalid' : ''}
                  />
                  {errors.excerpt && <div className="invalid-feedback">{errors.excerpt}</div>}
                </div>

                <div className="mb-3">
                  <CFormLabel className="fw-semibold">Content Body</CFormLabel>
                  <div className={errors.content ? 'border border-danger rounded' : ''}>
                    <SummernoteEditor
                      value={newPost.content}
                      onChange={handleEditorChange}
                    />
                  </div>
                  {errors.content && <p className="text-danger small mt-1">{errors.content}</p>}
                </div>
              </CCardBody>
            </CCard>

            <CCard className="shadow-sm mb-4 border-0">
              <CCardHeader className="bg-white py-3 border-bottom-0">
                <h5 className="m-0 fw-bold">Banner Image</h5>
              </CCardHeader>
              <CCardBody className="pt-0">
                <div className="upload-zone p-4 border rounded text-center bg-light">
                  <CFormInput
                    type="file"
                    name="banner"
                    onChange={handleFileChange}
                    className="d-none"
                    id="banner-upload"
                  />
                  <label htmlFor="banner-upload" className="cursor-pointer">
                    {bannerPreview ? (
                      <img src={bannerPreview} alt="Preview" className="img-fluid rounded shadow-sm mb-3" style={{ maxHeight: '250px' }} />
                    ) : (
                      <div className="py-4">
                        <div className="fs-1 text-muted mb-2">🖼️</div>
                        <p className="m-0 text-primary fw-bold">Click to upload banner</p>
                        <p className="text-muted small">Recommended size: 1200x630px</p>
                      </div>
                    )}
                  </label>
                  {bannerPreview && (
                    <CButton color="danger" variant="ghost" size="sm" onClick={() => setBannerPreview(null)}>Remove Image</CButton>
                  )}
                </div>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Sidebar */}
          <CCol lg={4}>
            <CCard className="shadow-sm mb-4 border-0">
              <CCardHeader className="bg-white py-3 border-bottom-0">
                <h5 className="m-0 fw-bold">Publishing</h5>
              </CCardHeader>
              <CCardBody className="pt-0">
                <div className="mb-3">
                  <CFormLabel className="fw-semibold">Category</CFormLabel>
                  <CFormSelect
                    name="category"
                    value={newPost.category}
                    onChange={handleInputChange}
                    className={errors.category ? 'is-invalid' : ''}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.title}</option>
                    ))}
                  </CFormSelect>
                  {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                </div>

                <div className="mb-3">
                  <CFormLabel className="fw-semibold">Status</CFormLabel>
                  <CFormSelect name="status" value={newPost.status} onChange={handleInputChange}>
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </CFormSelect>
                </div>
              </CCardBody>
            </CCard>

            <CCard className="shadow-sm mb-4 border-0">
              <CCardHeader className="bg-white py-3 border-bottom-0">
                <h5 className="m-0 fw-bold">SEO Information</h5>
              </CCardHeader>
              <CCardBody className="pt-0">
                <div className="mb-3">
                  <CFormLabel className="small fw-bold">Meta Title</CFormLabel>
                  <CFormInput name="metaTitle" value={newPost.metaTitle} onChange={handleInputChange} placeholder="SEO title..." />
                </div>
                <div className="mb-3">
                  <CFormLabel className="small fw-bold">Meta Keywords</CFormLabel>
                  <CFormInput name="metakeywords" value={newPost.metakeywords} onChange={handleInputChange} placeholder="keyword1, keyword2..." />
                </div>
                <div className="mb-3">
                  <CFormLabel className="small fw-bold">Meta Description</CFormLabel>
                  <CFormTextarea name="metaDescription" value={newPost.metaDescription} onChange={handleInputChange} rows={3} placeholder="SEO description..." />
                </div>
                <div className="mb-3">
                  <CFormLabel className="small fw-bold">Meta Image</CFormLabel>
                  <CFormInput type="file" name="metaimage" onChange={handleFileChange} size="sm" />
                  {metaImagePreview && (
                    <img src={metaImagePreview} alt="Meta Preview" className="img-fluid rounded mt-2 shadow-sm" style={{ maxHeight: '100px' }} />
                  )}
                </div>

                 {/* Tags Field */}
              <CFormLabel className="form-label mt-3">
              Tags
              </CFormLabel>

              <div className="custom-tags-input">

              {/* Tags List */}
              <div className="tags-wrapper">
              {newPost.tags.map((tag, index) => (
                <div key={index} className="tag-item">
                  <span>{tag}</span>

                  <button
                    type="button"
                    className="remove-tag-btn"
                    onClick={() => removeTag(index)}
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Input */}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type tag and press enter"
                className="tag-input-field"
              />
              </div>
              {errors.tags && <p className="text-danger small mt-1">{errors.tags}</p>}
              </div>

              <CFormText className="text-muted">
              Press Enter or comma to add tags
              </CFormText>
              {/* Schema Fields */}
               <CFormLabel className="form-label mt-3">Structured Data (Schema)</CFormLabel>
               {newPost.schema.map((schemaText, idx) => (
                  <div key={idx} className="mb-3">
                    <CFormTextarea
                      rows={3}
                      value={schemaText}
                      onChange={(e) => handleSchemaChange(idx, e.target.value)}
                      placeholder="Enter JSON-LD or structured data"
                    />
                    {newPost.schema.length > 1 && (
                      <CButton
                        color="danger"
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => removeSchema(idx)}
                      >
                        Remove
                      </CButton>
                    )}
                  </div>
                ))}
                <CButton
                  color="success"
                  size="sm"
                  variant="outline"
                  onClick={addSchema}
                >
                  Add Schema
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CForm>

      <style>{`
        .upload-zone { transition: all 0.2s; border: 2px dashed #e0e0e0 !important; cursor: pointer; }
        .upload-zone:hover { border-color: #3b82f6 !important; background: #f0f7ff !important; }
        .cursor-pointer { cursor: pointer; }
        .loading-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(255,255,255,0.8);
          display: flex; align-items: center; justify-content: center;
          z-index: 2000; backdrop-filter: blur(4px);
        }
        .loading-content { text-align: center; }
        .loading-content p { margin-top: 15px; font-weight: 600; color: #1e293b; }
      `}</style>
    </div>
  );
};

export default CreateBlogPost;
