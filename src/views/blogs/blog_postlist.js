import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CCol, CRow, CButton, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,CInputGroup,CFormInput,CSpinner   } from '@coreui/react';
import { BlogPosts, deleteBlogPost } from '../../api/api'; 
import './blogstyle.css';

const BlogPostList = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');  

  const loadBlogPosts = async () => {
     setLoading(true);
    try {
      const response = await BlogPosts(token);
     
      if (Array.isArray(response.data)) {
        setBlogPosts(response.data);
        setLoading(false);
      } else {
        setBlogPosts([]);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeletePost = async (postId) => {
    try {
      await deleteBlogPost(postId);
      loadBlogPosts(); // Reload the blog posts list
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const filteredBlogPosts = blogPosts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchTerm.toLowerCase())
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
        <CButton color="primary"><Link to="/blog-post/create" style={{textDecoration:"none",color:"#fff"}}>Create Blog Post</Link></CButton>
      </CCol>
      <CCol xs={6} className="d-flex justify-content-end">
        <CInputGroup>
          <CFormInput placeholder="Search blog posts..." value={searchTerm} onChange={handleSearchChange} />
        </CInputGroup>
      </CCol>

      <CCol xs={12} className="mt-4">
        <CTable striped hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Title</CTableHeaderCell>
              <CTableHeaderCell scope="col">Category</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredBlogPosts.map((post, index) => (
              <CTableRow key={post._id}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{post.title}</CTableDataCell>
                <CTableDataCell>{post.category.title}</CTableDataCell>
                <CTableDataCell>{post.status}</CTableDataCell>
                <CTableDataCell>
                <CButton className="mx-3" color="info">
                <Link to={`/blog-post/update/${post._id}`} style={{ color: 'white' }}>Edit</Link>
                </CButton>
                <CButton className="mx-3" color="warning">
                <Link to ={`https://www.crmfrontier.co.uk/blog/preview/${post.slug}`} target='_blank'>Preview</Link>
                </CButton>
                  {/* <CButton color="danger" onClick={() => handleDeletePost(post._id)}>Delete</CButton> */}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCol>
    </CRow>
    </>

  );
};

export default BlogPostList;
