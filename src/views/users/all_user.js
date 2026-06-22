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
  CFormTextarea,
  CFormText,
  CInputGroupText
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { fetchUsers, createUser, deleteUser,updateUser } from '../../api/api';
import './userstyle.css'

const User = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePic: '',
    aboutus: 'Hey there',
    linkedin: '',
    status: 'Pending',
    role: 'content-writer'
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePic: '',
    linkedin: '',
  });

  // State for delete confirmation
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [profilePic, setProfilePic] = useState(null);

  const APP_URL = 'https://crmfrontierukbackend.onrender.com';

  const loadUsers = async () => {
    try {
      const response = await fetchUsers();
      if (Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers(); // Load users when component mounts
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setCurrentUser(null);
  };
  

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('_id',currentUser._id)
    formData.append('name', currentUser.name);
    formData.append('email', currentUser.email);
    formData.append('role', currentUser.role);
    formData.append('linkedin', currentUser.linkedin);
    formData.append('aboutus', currentUser.aboutus);
    if (profilePic) {
      formData.append('profilePic', profilePic);
    }
 
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
     
      const response = await updateUser(formData);
      setUsers(users.map(user => (user._id === currentUser._id ? { ...currentUser, profilePic } : user)));
      alert('User updated successfully');
      closeEditModal();
      console.log(response.data);
    } catch (error) {
      console.error('Update error:', error);
      alert('Update failed');
    }
  };








  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewUser((prevUser) => ({
        ...prevUser,
        profilePic: file,
      }));
    }
  };
  
  const handleEditProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);  
    }
  };

  const validateForm = () => {
    const validationErrors = {};
    let formIsValid = true;

    if (!newUser.name) {
      validationErrors.name = 'Name is required.';
      formIsValid = false;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!newUser.email || !emailRegex.test(newUser.email)) {
      validationErrors.email = 'Please enter a valid email address.';
      formIsValid = false;
    }

    if (!newUser.password) {
      validationErrors.password = 'Password is required.';
      formIsValid = false;
    }

    if (newUser.password !== newUser.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match.';
      formIsValid = false;
    }

    if (!newUser.profilePic) {
      validationErrors.profilePic = 'Profile picture is required.';
      formIsValid = false;
    }

    if (newUser.linkedin && !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(newUser.linkedin)) {
      validationErrors.linkedin = 'Please enter a valid LinkedIn URL.';
      formIsValid = false;
    }

    setErrors(validationErrors);
    return formIsValid;
  };

  const handleUserCreate = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newUser.name);
      formData.append('email', newUser.email);
      formData.append('password', newUser.password);
      formData.append('confirmPassword', newUser.confirmPassword);
      formData.append('aboutus', newUser.aboutus);
      formData.append('linkedin', newUser.linkedin);
      formData.append('status', newUser.status);
      formData.append('role', newUser.role);
      if (newUser.profilePic) {
        formData.append('profilePic', newUser.profilePic);
      }

      const response = await createUser(formData);
      loadUsers(); // Reload users after creating one

      setNewUser({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        profilePic: '',
        aboutus: 'Hey there',
        linkedin: '',
        status: 'Pending',
        role: 'user'
      });
      setModalVisible(false);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const toggleDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirmation = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete._id);
        setUsers(users.filter(user => user._id !== userToDelete._id));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
    setDeleteModalVisible(false);
    setUserToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setUserToDelete(null);
  };

  const filteredUsers = users.filter((user) =>
    (user.name ? user.name.toLowerCase() : '').includes(searchTerm.toLowerCase()) ||
    (user.email ? user.email.toLowerCase() : '').includes(searchTerm.toLowerCase()) ||
    (user.role ? user.role.toLowerCase() : '').includes(searchTerm.toLowerCase())
  );

  return (
    <CRow>
      <CCol xs={6} className="d-flex justify-content-start">
        <CButton color="primary" onClick={() => setModalVisible(true)}>Create User</CButton>
      </CCol>
      <CCol xs={6} className="d-flex justify-content-end">
        <CInputGroup>
          <CFormInput
            placeholder="Search user..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </CInputGroup>
      </CCol>

      <CCol xs={12} className="mt-4">
        <CTable striped hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Email</CTableHeaderCell>
              <CTableHeaderCell scope="col">Role</CTableHeaderCell>
              <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredUsers.map((user, index) => (
              <CTableRow key={user._id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{user.name}</CTableDataCell>
                <CTableDataCell>{user.email}</CTableDataCell>
                <CTableDataCell>{user.role}</CTableDataCell>
                <CTableDataCell>
                <CButton color="info" variant="outline" onClick={() => openEditModal(user)} className="mx-3">Edit</CButton>
                  <CButton color="danger" onClick={() => toggleDeleteModal(user)}>Delete</CButton>
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
          <p>Are you sure you want to delete this user?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleDeleteCancel}>Cancel</CButton>
          <CButton color="danger" onClick={handleDeleteConfirmation}>Delete</CButton>
        </CModalFooter>
      </CModal>

      {/* User Create Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Create New User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol xs={6} className="mb-3">
                <CFormLabel htmlFor="userName">User Name</CFormLabel>
                <CFormInputModal
                  id="userName"
                  name="name"
                  placeholder="Enter user name"
                  value={newUser.name}
                  onChange={handleInputChange}
                />
                {errors.name && <CFormText className="text-danger">{errors.name}</CFormText>}
              </CCol>
              <CCol xs={6} className="mb-3">
                <CFormLabel htmlFor="userEmail">Email</CFormLabel>
                <CFormInputModal
                  id="userEmail"
                  name="email"
                  placeholder="Enter email address"
                  value={newUser.email}
                  onChange={handleInputChange}
                />
                {errors.email && <CFormText className="text-danger">{errors.email}</CFormText>}
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={6} className="mb-3">
                <CFormLabel htmlFor="userPassword">Password</CFormLabel>
                <CFormInputModal
                  id="userPassword"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={newUser.password}
                  onChange={handleInputChange}
                />
                {errors.password && <CFormText className="text-danger">{errors.password}</CFormText>}
              </CCol>
              <CCol xs={6} className="mb-3">
                <CFormLabel htmlFor="userConfirmPassword">Confirm Password</CFormLabel>
                <CFormInputModal
                  id="userConfirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={newUser.confirmPassword}
                  onChange={handleInputChange}
                />
                {errors.confirmPassword && <CFormText className="text-danger">{errors.confirmPassword}</CFormText>}
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={6} className="mb-3">
                <CFormLabel htmlFor="profilePic">Profile Picture</CFormLabel>
                <CFormInputModal
                  id="profilePic"
                  name="profilePic"
                  type="file"
                  onChange={handleProfilePicChange}
                />
                {errors.profilePic && <CFormText className="text-danger">{errors.profilePic}</CFormText>}
              </CCol>
              <CCol xs={6} className="mb-3">
                <CFormLabel htmlFor="userRole">Role</CFormLabel>
                <CFormSelect
                  id="userRole"
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                >
                  <option value="content-writer">Content Writer</option>
                  <option value="seo-expert">Seo Expert</option>
                  <option value="superAdmin">Super Admin</option>
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12} className="mb-3">
                <CFormLabel htmlFor="linkedin">LinkedIn</CFormLabel>
                <CFormInputModal
                  id="linkedin"
                  name="linkedin"
                  placeholder="Enter LinkedIn URL"
                  value={newUser.linkedin}
                  onChange={handleInputChange}
                />
                {errors.linkedin && <CFormText className="text-danger">{errors.linkedin}</CFormText>}
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12} className="mb-3">
                <CFormLabel htmlFor="aboutus">About Us</CFormLabel>
                <CFormTextarea
                  id="aboutus"
                  name="aboutus"
                  rows="3"
                  value={newUser.aboutus}
                  onChange={handleInputChange}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleUserCreate}>Create</CButton>
        </CModalFooter>
      </CModal>

      {/* Edit User Modal */}
      {currentUser && (
        <CModal visible={editModalVisible} onClose={closeEditModal} size="lg">
          <CModalHeader>
            <strong>Edit User</strong>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={handleEditSubmit}>
              <CInputGroup className="mb-3">
                <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                <CFormInput
                  name="username"
                  placeholder="Username"
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                  style={{ borderRadius: '10px', padding: '10px' }}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText>@</CInputGroupText>
                <CFormInput
                  name="email"
                  placeholder="Email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  style={{ borderRadius: '10px', padding: '10px' }}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText><CIcon icon={cilUser} /></CInputGroupText>
                <CFormSelect
                  name="role"
                  options={[
                    'Select Role',
                    { label: 'Content Writer', value: 'content-writer' },
                    { label: 'Seo Expert', value: 'seo-expert' },
                    { label: 'Super Admin', value: 'superAdmin' },
                  ]}
                  value={currentUser.role}
                  onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                  style={{ borderRadius: '10px', padding: '10px' }}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText>@</CInputGroupText>
                <CFormInput
                  name="Linkedin"
                  placeholder="Linkedin Url"
                  value={currentUser.linkedin}
                  onChange={(e) => setCurrentUser({ ...currentUser, linkedin: e.target.value })}
                  style={{ borderRadius: '10px', padding: '10px' }}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                
                <CFormTextarea
                  id="aboutus"
                  rows="3"
                  value={currentUser.aboutus}
                  name="aboutus"
                  placeholder="About Us"
                  onChange={(e) => setCurrentUser({ ...currentUser, aboutus: e.target.value })}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
              <CFormInputModal
                  id="profilePic"
                  name="profilePic"
                  type="file"
                  onChange={handleEditProfilePicChange}
                  
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
              <img
                    src={`${APP_URL}/uploads/${currentUser.profilePic}`}
                    alt="Banner Preview"
                    style={{ width: '10%', height: 'auto', borderRadius: '8px' }}
                  />
              </CInputGroup>
              <div className="d-grid mb-3">
                <CButton color="primary" type="submit" style={{ borderRadius: '20px' }}>
                  Update User
                </CButton>
              </div>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={closeEditModal} style={{ borderRadius: '20px' }}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      )}
    </CRow>
  );
};

export default User;
