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
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCategories, fetchBlogPostById, updateBlogPost } from '../../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditBlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const APP_URL = 'https://crmfoceplus-backend.onrender.com';

  const [post, setPost] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    metaTitle: '',
    metaDescription: '',
    metakeywords: '',
    status: 'Draft',
    schema: [' ']
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [bannerPreview, setBannerPreview] = useState(null);
  const [metaImagePreview, setMetaImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, postRes] = await Promise.all([
          fetchCategories(),
          fetchBlogPostById(id)
        ]);

        if (Array.isArray(catRes.data)) setCategories(catRes.data);

        const postData = postRes.data;
        if (!Array.isArray(postData.schema)) postData.schema = [''];

        setPost(postData);
        if (postData.banner) setBannerPreview(postData.banner.startsWith('http') ? postData.banner : `${APP_URL}/uploads/${postData.banner}`);
        if (postData.metaimage) setMetaImagePreview(postData.metaimage.startsWith('http') ? postData.metaimage : `${APP_URL}/uploads/${postData.metaimage}`);
      } catch (error) {
        toast.error('Failed to load blog data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: name === 'category' ? { _id: value } : value
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setPost((prev) => ({ ...prev, [name]: file }));

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (name === 'banner') setBannerPreview(previewUrl);
      else if (name === 'metaimage') setMetaImagePreview(previewUrl);
    }
  };

  const handleEditorChange = (content) => {
    setPost((prev) => ({ ...prev, content }));
    setErrors(prev => ({ ...prev, content: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!post.title) newErrors.title = 'Title is required';
    if (!post.slug) newErrors.slug = 'Slug is required';
    if (!post.category) newErrors.category = 'Category is required';
    if (!post.content) newErrors.content = 'Content is required';
    if (!post.excerpt) newErrors.excerpt = 'Excerpt is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors before saving.');
      return;
    }

    setSaving(true);
    const formData = new FormData();
    Object.keys(post).forEach(key => {
      if (key === 'schema') formData.append(key, JSON.stringify(post.schema));
      else if (key === 'category') formData.append(key, post.category._id || post.category);
      else if (post[key] !== null) formData.append(key, post[key]);
    });

    try {
      await updateBlogPost(token, id, formData);
      toast.success('🎉 Blog post updated successfully!');
      setTimeout(() => navigate('/all-blogs'), 1000);
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || 'Failed to update post';
      if (msg.toLowerCase().includes('slug')) {
        setErrors(prev => ({ ...prev, slug: 'This slug is already in use.' }));
      }
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <CSpinner color="primary" variant="grow" />
        <p className="mt-3 text-muted fw-bold">Loading Blog Editor...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {saving && (
        <div className="loading-overlay">
          <div className="loading-content">
            <CSpinner color="primary" size="lg" />
            <p>Saving your changes...</p>
          </div>
        </div>
      )}

      <CForm onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-primary m-0">Edit Post</h2>
            <p className="text-muted small">Update the content and metadata for your blog</p>
          </div>
          <div className="d-flex gap-2">
            <CButton color="secondary" variant="outline" onClick={() => navigate('/all-blogs')}>Back to List</CButton>
            <CButton color="primary" type="submit" className="px-4" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </CButton>
          </div>
        </div>

        <CRow>
          <CCol lg={8}>
            <CCard className="shadow-sm mb-4 border-0">
              <CCardHeader className="bg-white py-3 border-bottom-0">
                <h5 className="m-0 fw-bold">Post Content</h5>
              </CCardHeader>
              <CCardBody className="pt-0">
                <div className="mb-3">
                  <CFormLabel className="fw-semibold">Title</CFormLabel>
                  <CFormInput
                    name="title"
                    value={post.title}
                    onChange={handleInputChange}
                    className={`form-control-lg ${errors.title ? 'is-invalid' : ''}`}
                  />
                  {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>

                <div className="mb-3">
                  <CFormLabel className="fw-semibold text-muted small">Blog Slug</CFormLabel>
                  <div className="input-group">
                    <CFormInput
                      name="slug"
                      value={post.slug}
                      onChange={handleInputChange}
                      className={errors.slug ? 'is-invalid' : ''}
                    />
                    {errors.slug && <div className="invalid-feedback">{errors.slug}</div>}
                  </div>
                </div>

                <div className="mb-4">
                  <CFormLabel className="fw-semibold">Excerpt</CFormLabel>
                  <CFormTextarea
                    name="excerpt"
                    value={post.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    className={errors.excerpt ? 'is-invalid' : ''}
                  />
                  {errors.excerpt && <div className="invalid-feedback">{errors.excerpt}</div>}
                </div>

                <div className="mb-3">
                  <CFormLabel className="fw-semibold">Content</CFormLabel>
                  <div className={errors.content ? 'border border-danger rounded' : ''}>
                    <SummernoteEditor
                      value={post.content}
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
                  <CFormInput type="file" name="banner" onChange={handleFileChange} className="d-none" id="banner-edit-upload" />
                  <label htmlFor="banner-edit-upload" className="cursor-pointer d-block">
                    {bannerPreview ? (
                      <img src={bannerPreview} alt="Banner" className="img-fluid rounded shadow-sm mb-3" style={{ maxHeight: '300px' }} />
                    ) : (
                      <div className="py-4 text-muted">Click to change banner image</div>
                    )}
                  </label>
                  <CButton color="primary" variant="ghost" size="sm" onClick={() => document.getElementById('banner-edit-upload').click()}>
                    Change Banner
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol lg={4}>
            <CCard className="shadow-sm mb-4 border-0">
              <CCardHeader className="bg-white py-3 border-bottom-0">
                <h5 className="m-0 fw-bold">Settings</h5>
              </CCardHeader>
              <CCardBody className="pt-0">
                <div className="mb-3">
                  <CFormLabel className="fw-semibold">Category</CFormLabel>
                  <CFormSelect
                    name="category"
                    value={post.category?._id || post.category}
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
                  <CFormSelect name="status" value={post.status} onChange={handleInputChange}>
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </CFormSelect>
                </div>
              </CCardBody>
            </CCard>

            <CCard className="shadow-sm mb-4 border-0">
              <CCardHeader className="bg-white py-3 border-bottom-0">
                <h5 className="m-0 fw-bold">SEO & Metadata</h5>
              </CCardHeader>
              <CCardBody className="pt-0">
                <div className="mb-3">
                  <CFormLabel className="small fw-bold">Meta Title</CFormLabel>
                  <CFormInput name="metaTitle" value={post.metaTitle} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                  <CFormLabel className="small fw-bold">Meta Keywords</CFormLabel>
                  <CFormInput name="metakeywords" value={post.metakeywords} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                  <CFormLabel className="small fw-bold">Meta Description</CFormLabel>
                  <CFormTextarea name="metaDescription" value={post.metaDescription} onChange={handleInputChange} rows={3} />
                </div>
                <div className="mb-3">
                  <CFormLabel className="small fw-bold">Meta Image</CFormLabel>
                  <CFormInput type="file" name="metaimage" onChange={handleFileChange} size="sm" />
                  {metaImagePreview && (
                    <img src={metaImagePreview} alt="Meta Preview" className="img-fluid rounded mt-2 shadow-sm" style={{ maxHeight: '120px' }} />
                  )}
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CForm>

      <style>{`
        .upload-zone { transition: all 0.2s; border: 2px dashed #e0e0e0 !important; }
        .upload-zone:hover { border-color: #3b82f6 !important; background: #f8fbff !important; }
        .loading-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(255,255,255,0.85);
          display: flex; align-items: center; justify-content: center;
          z-index: 2000; backdrop-filter: blur(5px);
        }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
};

export default EditBlogPost;
