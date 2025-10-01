//create page builder like elementor
import React, { useState, useEffect } from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import { fetchPages, deletePage } from '../../api/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const ListPage = () => {
  const [pages, setPages] = useState([]);
  const navigate = useNavigate();
    const token = localStorage.getItem('token');
    useEffect(() => {  
    const getPages = async () => {
      try {
        const response = await fetchPages(token);
        setPages(response.data);
        } catch (error) {
        console.error('Error fetching pages:', error);
        toast.error('Failed to fetch pages');
      }
    };
    getPages();
  }, [token]);

  const handleEdit = (id) => {
    navigate(`/edit-page/${id}`);
  };
    const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        await deletePage(id);
        setPages(pages.filter((page) => page._id !== id));
        toast.success('Page deleted successfully');
      } catch (error) {
        console.error('Error deleting page:', error);
        toast.error('Failed to delete page');
      }
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
            <CCardHeader>
            <strong>Page Management</strong>
            <div className="card-header-actions">
              <CButton color="primary" onClick={() => navigate('/create-page')}>
                Create New Page
              </CButton>
            </div>
            </CCardHeader>
            <CCardBody>
            <CTable hover responsive>
                <CTableHead>
                <CTableRow>
                    <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Slug</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
                </CTableHead>
                <CTableBody>
                {pages.map((page) => (
                    <CTableRow key={page._id}>
                    <CTableDataCell>{page.title}</CTableDataCell>
                    <CTableDataCell>{page.slug}</CTableDataCell>
                    <CTableDataCell>
                        <CButton color="info" className="me-2" onClick={() => handleEdit(page._id)}>
                        <CIcon icon={cilPencil} /> Edit
                        </CButton>
                        <CButton color="danger" onClick={() => handleDelete(page._id)}>
                        <CIcon icon={cilTrash} /> Delete
                        </CButton>
                    </CTableDataCell>
                    </CTableRow>
                ))}
                </CTableBody>
            </CTable>
            </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}

export default ListPage;