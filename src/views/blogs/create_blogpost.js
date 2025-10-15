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
import { useNavigate } from 'react-router-dom';
import { fetchCategories, createBlogPost } from '../../api/api';

const CreateBlogPost = () => {
  const [newPost, setNewPost] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
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
   
  const token = localStorage.getItem("token");

  const navigate = useNavigate();  

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
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prevPost) => ({ ...prevPost, [name]: value }));

    // Optionally clear frontend validation errors for that field
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleKeyUp = () => {
    
    const slug = newPost.title
      .toLowerCase()
      .replace(/\s+/g, '-')  
      .replace(/[^\w-]+/g, '')  
      .replace(/--+/g, '-')  
      .trim();  
    setNewPost((prevPost) => ({ ...prevPost, slug }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    setNewPost((prevPost) => ({ ...prevPost, [name]: file }));

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
    setNewPost((prevPost) => ({ ...prevPost, content }));
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
    const validationErrors = {};
    let isValid = true;

    if (!newPost.title) {
      validationErrors.title = 'Title is required';
      isValid = false;
    }

    if (!newPost.slug) {
      validationErrors.slug = 'Slug is required';
      isValid = false;
    }

    if (!newPost.excerpt) {
      validationErrors.excerpt = 'Excerpt is required';
      isValid = false;
    }

    if (!newPost.content) {
      validationErrors.content = 'Content is required';
      isValid = false;
    }


    setErrors(validationErrors); // Set the frontend validation errors
    return isValid;
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    // Clear previous backend errors
    setBackendErrors({});

    // Validate the form (frontend validation)
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const formData = new FormData();

    // Append text fields
    formData.append('title', newPost.title);
    formData.append('slug', newPost.slug);
    formData.append('excerpt', newPost.excerpt);
    formData.append('content', newPost.content);
    formData.append('category', newPost.category);
    formData.append('metaTitle', newPost.metaTitle);
    formData.append('metaDescription', newPost.metaDescription);
    formData.append('metakeywords', newPost.metakeywords);
    formData.append('status', newPost.status);
    formData.append('schema', JSON.stringify(newPost.schema)); 

    // Append files (banner and metaimage)
    if (newPost.banner) {
      formData.append('banner', newPost.banner);
    }
    if (newPost.metaimage) {
      formData.append('metaimage', newPost.metaimage);
    }

    try {
      const response = await createBlogPost(token,formData);
      console.log(response.status==201);
      if(response){
        setLoading(false);
        navigate('/all-blogs');

      }
       
      
       
    } catch (error) {
      // If backend validation fails or other errors occur, set backend errors
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.error || 'An error occurred while creating the blog post';
        const errorDetails = error.response.data.details || {};

        // Check if we have a duplicate slug error
        if (errorDetails.code === 11000 && errorDetails.keyPattern.slug) {
          setBackendErrors((prev) => ({
            ...prev,
            slug: 'This slug is already taken.',
            general: errorMessage,
          }));
        } else {
          // For any other error, set a general error message
          setBackendErrors((prev) => ({
            ...prev,
            general: errorMessage,
          }));
        }
      } else {
        setBackendErrors({ general: 'An unexpected error occurred' });
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
        <CCol xs={12} md={8} className="mb-4">
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
                value={newPost.title}
                onChange={handleInputChange}
                onKeyUp={handleKeyUp}
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
                value={newPost.slug}
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
                value={newPost.excerpt}
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
                className="form-file mb-2"
              />
              {bannerPreview && (
                <div className="image-preview" style={{ marginTop: '10px' }}>
                  <img
                    src={bannerPreview}
                    alt="Banner Preview"
                    style={{ width: '10%', height: 'auto', borderRadius: '8px' }}
                  />
                </div>
              )}

              {/* Category Dropdown */}
              <CFormLabel htmlFor="category" className="form-label">Category</CFormLabel>
              <CFormSelect
                id="category"
                name="category"
                value={newPost.category}
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
              {/* Content Field with TinyMCE Editor */}
              <CFormLabel htmlFor="content" className="form-label">Content</CFormLabel>
              <Editor
                apiKey="swwi0ejh09qkjnay90r9f3n6dfuu54hxtzn3k3a27qrbb1d4"
                value={newPost.content}
                onEditorChange={handleEditorChange}
                init={{
                  height: 500,
                  menubar: true,
                  plugins: ['image', 'link', 'code', 'lists', 'table', 'fullscreen'],
                  toolbar:
                    'undo redo | bold italic | alignleft aligncenter alignright | image | link | h1 h2 h3 h4 h5 h6 | code | fullscreen |numlist bullist',
                  content_style: 'h1,h2,h3,h4,h5,h6 { color: #000; }',
                }}
              />
              {errors.content && <CFormText className="text-danger">{errors.content}</CFormText>}
              {backendErrors.content && <CFormText className="text-danger">{backendErrors.content}</CFormText>}

             
            </CCardBody>
          </CCard>
        </CCol>

        {/* Right Column (col-3) */}
        <CCol xs={12} md={4} className="mb-4">
          <CCard>
            <CCardHeader className="bg-secondary text-white">
              <strong>Meta Information</strong>
            </CCardHeader>
            <CCardBody>
              {/* Meta Title */}
              <CFormLabel htmlFor="metaTitle" className="form-label">Meta Title</CFormLabel>
              <CFormInput
                id="metaTitle"
                name="metaTitle"
                value={newPost.metaTitle}
                onChange={handleInputChange}
                placeholder="Enter meta title"
                className="form-input"
              />

              {/* Meta Keywords */}
              <CFormLabel htmlFor="metakeywords" className="form-label">Meta Keywords</CFormLabel>
              <CFormInput
                id="metakeywords"
                name="metakeywords"
                value={newPost.metakeywords}
                onChange={handleInputChange}
                placeholder="Enter meta keywords"
                className="form-input"
              />

              {/* Meta Description */}
              <CFormLabel htmlFor="metaDescription" className="form-label">Meta Description</CFormLabel>
              <CFormTextarea
                id="metaDescription"
                name="metaDescription"
                value={newPost.metaDescription}
                onChange={handleInputChange}
                placeholder="Enter meta description"
                className="form-textarea"
              />

              {/* Meta Image */}
              <CFormLabel htmlFor="metaimage" className="form-label">Meta Image</CFormLabel>
              <CFormInput
                id="metaimage"
                name="metaimage"
                onChange={handleFileChange}
                className="form-file mb-2"
                type="file"
              />
              {metaImagePreview && (
                <div className="image-preview" style={{ marginTop: '10px' }}>
                  <img src={metaImagePreview} alt="Meta Image Preview" style={{ width: '10%', height: 'auto' }} />
                </div>
              )}

              {/* Blog Status */}
              <CFormLabel htmlFor="status" className="form-label">Status</CFormLabel>
              <CFormSelect
                id="status"
                name="status"
                value={newPost.status}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </CFormSelect>
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

              {/* Submit Button */}
              <div className="text-center mt-4">
                <CButton color="primary" type="submit" className="submit-btn">
                  Create Blog Post
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CForm>
    </>
    
  );
};

export default CreateBlogPost;
