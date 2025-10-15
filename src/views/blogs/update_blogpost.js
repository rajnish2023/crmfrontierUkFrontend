import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
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
    schema:[' ']
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [backendErrors, setBackendErrors] = useState({});

  const [bannerPreview, setBannerPreview] = useState(null);
  const [metaImagePreview, setMetaImagePreview] = useState(null);
   const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
 
  const loadBlogPost = async () => {
    try {
      const response = await fetchBlogPostById(id);
       if (!Array.isArray(response.data.schema)) {
      response.data.schema = [''];  
    }
      setPost(response.data);
      if (response.data.banner) {
        setBannerPreview(response.data.banner); 
      }
      if (response.data.metaimage) {
        setMetaImagePreview(response.data.metaimage);  
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      const response = await fetchCategories();
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    loadCategories();
    loadBlogPost();
  }, [id]);   

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setPost((prevPost) => ({ ...prevPost, [name]: { _id: value } }));
    } else {
      setPost((prevPost) => ({ ...prevPost, [name]: value }));
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    setPost((prevPost) => ({ ...prevPost, [name]: file }));

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (name === 'banner') {
        setBannerPreview(previewUrl);   
      } else if (name === 'metaimage') {
        setMetaImagePreview(previewUrl);  
      }
    }
  };

  const handleEditorChange = (content) => {
    setPost((prevPost) => ({ ...prevPost, content }));
  };

   const handleSchemaChange = (index, value) => {
    const updatedSchema = [...post.schema];
    updatedSchema[index] = value;
    setPost((prevPost) => ({ ...prevPost, schema: updatedSchema }));
  };
  const addSchema = () => {
    setPost((prevPost) => ({ ...prevPost, schema: [...prevPost.schema, ''] }));
  }
  const removeSchema = (index) => {
    const updatedSchema = post.schema.filter((_, idx) => idx !== index);
    setPost((prevPost) => ({ ...prevPost, schema: updatedSchema }));
  }


  const validateForm = () => {
    const validationErrors = {};
    let isValid = true;

    if (!post.title) {
      validationErrors.title = 'Title is required';
      isValid = false;
    }

    if (!post.slug) {
      validationErrors.slug = 'Slug is required';
      isValid = false;
    }

    if (!post.excerpt) {
      validationErrors.excerpt = 'Excerpt is required';
      isValid = false;
    }

    if (!post.content) {
      validationErrors.content = 'Content is required';
      isValid = false;
    }

    if (!post.category) {
      validationErrors.category = 'Category is required';
      isValid = false;
    }

    setErrors(validationErrors);  
    return isValid;
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    setBackendErrors({});

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const formData = new FormData();

    // Append text fields
    formData.append('title', post.title);
    formData.append('slug', post.slug);
    formData.append('excerpt', post.excerpt);
    formData.append('content', post.content);
    formData.append('category', post.category ? post.category._id : '');   
    formData.append('author', post.author);
    formData.append('metaTitle', post.metaTitle);
    formData.append('metaDescription', post.metaDescription);
    formData.append('metakeywords', post.metakeywords);
    formData.append('status', post.status);
    formData.append('schema', JSON.stringify(post.schema));

    // Append files (banner and metaimage)
    if (post.banner) {
      formData.append('banner', post.banner);
    }
    if (post.metaimage) {
      formData.append('metaimage', post.metaimage);
    }

    try {
      const response = await updateBlogPost(token, id, formData);
      if(response.status==200){
        setLoading(false);
        toast.success("Blog Updated Successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
      });
      }
      // navigate('/all-blogs');  
    } catch (error) {
        if (error.response.status == 500) {
          setLoading(false);
          setBackendErrors((prev) => ({
            ...prev,
            slug: 'This slug is already taken.',
           
          }));
        } else {
          setBackendErrors((prev) => ({
            ...prev,
           
          }));
        }
       
    }
  };

  return (
    <>
    {loading && (
                <div className="loading-overlay">
                <div className="loading-content">
                <CSpinner color="primary" size="lg" />
                <p>Please wait, Your request is processing...</p>
                </div>
                </div>
               )}
    <CForm onSubmit={handleSubmit}>
      <CRow className="form-container" style={{ padding: '20px' }}>
        {/* Left Column (col-9) */}
        <CCol xs={12} md={9} className="mb-4">
          <CCard>
            <CCardHeader className="bg-primary text-white">
              <strong>Blog Details</strong>
            </CCardHeader>
            <CCardBody>
              {/* Title Field */}
              <CFormLabel htmlFor="title" className="form-label">Title</CFormLabel>
              <CFormInput
                id="title"
                name="title"
                value={post.title}
                onChange={handleInputChange}
                placeholder="Enter blog post title"
                className="form-input"
              />
              {errors.title && <CFormText className="text-danger">{errors.title}</CFormText>}
              {backendErrors.title && <CFormText className="text-danger">{backendErrors.title}</CFormText>}

              {/* Slug Field */}
              <CFormLabel htmlFor="slug" className="form-label">Slug</CFormLabel>
              <CFormInput
                id="slug"
                name="slug"
                value={post.slug}
                onChange={handleInputChange}
                placeholder="Enter slug"
                className="form-input"
              />
              {errors.slug && <CFormText className="text-danger">{errors.slug}</CFormText>}
              {backendErrors.slug && <CFormText className="text-danger">{backendErrors.slug}</CFormText>}

              {/* Excerpt Field */}
              <CFormLabel htmlFor="excerpt" className="form-label">Excerpt</CFormLabel>
              <CFormTextarea
                id="excerpt"
                name="excerpt"
                value={post.excerpt}
                onChange={handleInputChange}
                placeholder="Enter blog post excerpt"
                className="form-textarea"
              />
              {errors.excerpt && <CFormText className="text-danger">{errors.excerpt}</CFormText>}
              {backendErrors.excerpt && <CFormText className="text-danger">{backendErrors.excerpt}</CFormText>}

              {/* Banner Field */}
              <CFormLabel htmlFor="banner" className="form-label">Banner</CFormLabel>
              <CFormInput
                id="banner"
                name="banner"
                type="file"
                onChange={handleFileChange}
                className="form-file"
              />
              {bannerPreview && (
                <div className="image-preview" style={{ marginTop: '10px' }}>
                  <img
                    src={`${APP_URL}/uploads/${bannerPreview}`}
                    alt="Banner Preview"
                    style={{ width: '10%', height: 'auto', borderRadius: '8px' }}
                  />
                </div>
              )}

              {/* Content Field with TinyMCE Editor */}
              <CFormLabel htmlFor="content" className="form-label">Content</CFormLabel>
              <Editor
                apiKey="swwi0ejh09qkjnay90r9f3n6dfuu54hxtzn3k3a27qrbb1d4"
                value={post.content}
                onEditorChange={handleEditorChange}
                init={{
                  height: 500,
                  menubar: true,
                  plugins: ['image', 'link', 'code', 'lists', 'table', 'fullscreen'],
                  toolbar:
                    'undo redo | bold italic | alignleft aligncenter alignright | image | link | h1 h2 h3 h4 h5 h6 | code | fullscreen| numlist bullist',
                  content_style: 'h1,h2,h3,h4,h5,h6 { color: #000; }',
                }}
              />
              {errors.content && <CFormText className="text-danger">{errors.content}</CFormText>}
              {backendErrors.content && <CFormText className="text-danger">{backendErrors.content}</CFormText>}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Right Column (col-3) */}
        <CCol xs={12} md={3} className="mb-4">
          <CCard>
            <CCardHeader className="bg-secondary text-white">
              <strong>Meta Information</strong>
            </CCardHeader>
            <CCardBody>
              {/* Category Dropdown */}
              <CFormLabel htmlFor="category" className="form-label">Category</CFormLabel>
              <CFormSelect
                id="category"
                name="category"
                value={post.category ? post.category._id : ''}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </CFormSelect>
              {errors.category && <CFormText className="text-danger">{errors.category}</CFormText>}

              {/* Meta Image Field */}
              <CFormLabel htmlFor="metaimage" className="form-label">Meta Image</CFormLabel>
              <CFormInput
                id="metaimage"
                name="metaimage"
                type="file"
                onChange={handleFileChange}
                className="form-file"
              />
              {metaImagePreview && (
                <div className="image-preview" style={{ marginTop: '10px' }}>
                  <img
                    src={`${APP_URL}/uploads/${metaImagePreview}`}
                    alt="Meta Image Preview"
                    style={{ width: '50%', height: 'auto', borderRadius: '8px' }}
                  />
                </div>
              )}

              {/* Meta Title */}
              <CFormLabel htmlFor="metaTitle" className="form-label">Meta Title</CFormLabel>
              <CFormInput
                id="metaTitle"
                name="metaTitle"
                value={post.metaTitle}
                onChange={handleInputChange}
                placeholder="Enter meta title"
                className="form-input"
              />

              {/* Meta Description */}
              <CFormLabel htmlFor="metaDescription" className="form-label">Meta Description</CFormLabel>
              <CFormTextarea
                id="metaDescription"
                name="metaDescription"
                value={post.metaDescription}
                onChange={handleInputChange}
                placeholder="Enter meta description"
                className="form-textarea"
              />

              {/* Meta Keywords */}
              <CFormLabel htmlFor="metakeywords" className="form-label">Meta Keywords</CFormLabel>
              <CFormInput
                id="metakeywords"
                name="metakeywords"
                value={post.metakeywords}
                onChange={handleInputChange}
                placeholder="Enter meta keywords"
                className="form-input"
              />

              {/* Status Field */}
              <CFormLabel htmlFor="status" className="form-label">Status</CFormLabel>
              <CFormSelect
                id="status"
                name="status"
                value={post.status}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </CFormSelect>

              {/* Structured Data (Schema) */}
              <CFormLabel className="form-label mt-3 mb-3">Structured Data (Schema)</CFormLabel>
                {post.schema.map((schemaText, idx) => (
                 <div key={idx} className="mb-3">
                  <CFormTextarea
                      rows={3}
                      value={schemaText}
                      onChange={(e) => handleSchemaChange(idx, e.target.value)}
                      placeholder="Enter JSON-LD or structured data"
                    />
                  {post.schema.length > 1 && (
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
                    className="mb-3"
                    >
                    Add Schema
                </CButton>

              {/* Save Button */}
              <CButton type="submit" className="btn btn-primary w-100">Save Changes</CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <ToastContainer /> 
    </CForm>
    </>
    
  );
};

export default EditBlogPost;
