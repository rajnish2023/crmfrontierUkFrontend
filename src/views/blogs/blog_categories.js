import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CInputGroup,
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput as CFormInputModal,
  CFormSelect,
  CFormText,
  CSpinner
} from '@coreui/react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../api/api';  
import './blogstyle.css';

const BlogCategory = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState({
    title: '',
    slug: '',
    status: 'Active',
    image: null
  });
  const [errors, setErrors] = useState({
    title: '',
    slug: '',
  });
  const [serverError, setServerError] = useState(''); // To store backend errors

  // State for delete confirmation
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // State for editing category
  const [editCategory, setEditCategory] = useState(null);

  const APP_URL = 'https://crmfrontierukbackend.onrender.com';

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
      setCategories([]);
    }
  };

  useEffect(() => {
    loadCategories(); // Load categories when component mounts
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    if (modalVisible) {
      setNewCategory({ title: '', slug: '', status: 'Active', image: null });  // Reset form when closing
      setServerError(''); // Clear error when modal closes
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setNewCategory((prevCategory) => ({ ...prevCategory, image: files[0] }));
    } else {
      setNewCategory((prevCategory) => ({ ...prevCategory, [name]: value }));
    }
  };

  const validateForm = () => {
    const validationErrors = {};
    let formIsValid = true;

    if (!newCategory.title) {
      validationErrors.title = 'Title is required.';
      formIsValid = false;
    }

    if (!newCategory.slug) {
      validationErrors.slug = 'Slug is required.';
      formIsValid = false;
    }

    setErrors(validationErrors);
    return formIsValid;
  };

  const handleCategoryCreate = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', newCategory.title);
      formData.append('slug', newCategory.slug);
      formData.append('status', newCategory.status);
      if (newCategory.image) {
        formData.append('image', newCategory.image);
      }

      const response = await createCategory(formData);
      loadCategories();  

      setNewCategory({
        title: '',
        slug: '',
        status: 'Active',
        image: null
      });
      setLoading(false);
      setModalVisible(false);
      setServerError(''); 
    } catch (error) {
      console.error('Error creating category:', error);
      if (error.response && error.response.data) {
        setServerError(error.response.data.message || 'An error occurred while creating the category.');
      } else {
        setServerError('An internal server error occurred.');
      }
    }
  };

  const toggleDeleteModal = (category) => {
    setCategoryToDelete(category);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirmation = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete._id);
        setCategories(categories.filter(category => category._id !== categoryToDelete._id));
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
    setDeleteModalVisible(false);
    setCategoryToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setCategoryToDelete(null);
  };

  const handleTitleChange = (e) => {
    const { value } = e.target;
    setNewCategory((prevCategory) => {
      // If slug is not modified, auto-generate it from the title
      const slug = prevCategory.slug || generateSlug(value);
      return { ...prevCategory, title: value, slug };
    });
  };

  const handleSlugChange = (e) => {
    const { value } = e.target;
    setNewCategory((prevCategory) => ({ ...prevCategory, slug: value }));
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')        // Replace spaces with hyphens
      .replace(/[^\w\-]+/g, '')    // Remove non-word characters
      .replace(/\-\-+/g, '-')      // Replace multiple hyphens with one
      .replace(/^-+/, '')          // Remove hyphens from start
      .replace(/-+$/, '');         // Remove hyphens from end
  };

  const handleCategoryEdit = (category) => {
    setEditCategory(category);
    setNewCategory({
      title: category.title,
      slug: category.slug,
      status: category.status,
      image: null,
      categoryimg : category.categoryimg
    });
    setModalVisible(true);
  };

  const handleCategoryUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', newCategory.title);
      formData.append('slug', newCategory.slug);
      formData.append('status', newCategory.status);
      if (newCategory.image) {
        formData.append('image', newCategory.image);
      }

      await updateCategory(editCategory._id, formData);
      loadCategories(); // Reload categories after update

      setEditCategory(null);
      setNewCategory({ title: '', slug: '', status: 'Active', image: null });
      setModalVisible(false);
      setServerError('');  // Clear any previous server errors
    } catch (error) {
      console.error('Error updating category:', error);
      if (error.response && error.response.data) {
        // Display the error message from the backend
        setServerError(error.response.data.message || 'An error occurred while updating the category.');
      } else {
        setServerError('An internal server error occurred.');
      }
    }
  };

  const filteredCategories = categories.filter((category) =>
    (category.title ? category.title.toLowerCase() : '').includes(searchTerm.toLowerCase()) ||
    (category.slug ? category.slug.toLowerCase() : '').includes(searchTerm.toLowerCase())
  );

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
      <CRow>
        <CCol xs={6} className="d-flex justify-content-start">
          <CButton color="primary" onClick={() => setModalVisible(true)}>Create Category</CButton>
        </CCol>
        <CCol xs={6} className="d-flex justify-content-end">
          <CInputGroup>
            <CFormInput
              placeholder="Search category..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </CInputGroup>
        </CCol>

        <CCol xs={12} className="mt-4">
          <CTable striped hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col" className="py-3 px-4">#</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="py-3 px-4">Title</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="py-3 px-4">Slug</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="py-3 px-4">Image</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="py-3 px-4">Status</CTableHeaderCell>
                <CTableHeaderCell scope="col" className="py-3 px-4">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredCategories.map((category, index) => (
                <CTableRow key={category._id}>
                  <CTableHeaderCell scope="row" className="py-3 px-4">{index + 1}</CTableHeaderCell>
                  <CTableDataCell className="py-3 px-4">{category.title}</CTableDataCell>
                  <CTableDataCell className="py-3 px-4">{category.slug}</CTableDataCell>
                  <CTableDataCell className="py-3 px-4">
                 <img
                 src={`${APP_URL}/uploads/${category.categoryimg}`}
                  alt="Category Banner Preview"
                  style={{ width: '100px', height: 'auto', borderRadius: '8px' }}
                />
                </CTableDataCell>
                  <CTableDataCell className="py-3 px-4">{category.status}</CTableDataCell>
                  <CTableDataCell className="py-3 px-4">
                    <CButton className="mx-3" color="info" onClick={() => handleCategoryEdit(category)}>Edit</CButton>
                    <CButton color="danger" onClick={() => toggleDeleteModal(category)}>Delete</CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCol>

        {/* Delete Confirmation Modal */}
        <CModal visible={deleteModalVisible} onClose={handleDeleteCancel}>
          <CModalHeader>
            <CModalTitle>Confirm Deletion</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>Are you sure you want to delete this category?</p>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={handleDeleteCancel}>Cancel</CButton>
            <CButton color="danger" onClick={handleDeleteConfirmation}>Delete</CButton>
          </CModalFooter>
        </CModal>

        {/* Category Create / Update Modal */}
        <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
          <CModalHeader>
            <CModalTitle>{editCategory ? 'Edit Category' : 'Create New Category'}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              {serverError && <div className="text-danger mb-3">{serverError}</div>}  {/* Display the server error */}

              <CRow>
                <CCol xs={6} className="mb-3">
                  <CFormLabel htmlFor="categoryTitle">Category Title</CFormLabel>
                  <CFormInputModal
                    id="categoryTitle"
                    name="title"
                    placeholder="Enter category title"
                    value={newCategory.title}
                    onChange={handleTitleChange}
                  />
                  {errors.title && <CFormText className="text-danger">{errors.title}</CFormText>}
                </CCol>
                <CCol xs={6} className="mb-3">
                  <CFormLabel htmlFor="categorySlug">Slug</CFormLabel>
                  <CFormInputModal
                    id="categorySlug"
                    name="slug"
                    placeholder="Enter category slug"
                    value={newCategory.slug}
                    onChange={handleSlugChange}
                  />
                  {errors.slug && <CFormText className="text-danger">{errors.slug}</CFormText>}
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={6} className="mb-3">
                  <CFormLabel htmlFor="categoryImage">Upload Category Image</CFormLabel>
                  <CFormInputModal
                    id="categoryImage"
                    name="image"
                    type="file"
                    onChange={handleInputChange}
                  />
                </CCol>
                
                <CCol xs={6} className="mb-3">
                  <CFormLabel htmlFor="categoryStatus">Status</CFormLabel>
                  <CFormSelect
                    id="categoryStatus"
                    name="status"
                    value={newCategory.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </CFormSelect>
                </CCol>
              </CRow>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>Cancel</CButton>
            <CButton color="primary" onClick={editCategory ? handleCategoryUpdate : handleCategoryCreate}>
              {editCategory ? 'Update' : 'Create'}
            </CButton>
          </CModalFooter>
        </CModal>
      </CRow>
    </>
  );
};

export default BlogCategory;
