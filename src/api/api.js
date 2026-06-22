import axios from 'axios';
const API = axios.create({ baseURL: 'https://crmfrontierukbackend.onrender.com/api' });

// const API = axios.create({ baseURL: 'http://localhost:7878/api' });

// Global Response Interceptor for security and better error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Session expired or unauthorized
      localStorage.removeItem('token');
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

//Get all galleries
export const fetchGalleries = () => API.get('/getgalleries');
//Create a gallery
export const createGallery = (newGallery) => API.post('/creategalleries', newGallery);
 
//create blog category
export const createCategory = (newCategory) => API.post('/createcategory',newCategory);
export const fetchCategories = () => API.get('/getcategories');
export const deleteCategory = (id) => API.delete(`/deletecategory/${id}`)
export const updateCategory = (id, updatedCategory) => API.patch(`/updatecategory/${id}`, updatedCategory);


//create blog with auth user token and formdata

export const createBlogPost = (token, newBlog) => {
    return API.post('/blog/blogpostcreate', newBlog, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };


//get all blog posts with auth user

export const BlogPosts = (token) => { 
    return API.get('/blog/getposts', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };


 
export const deleteBlogPost = (id) => API.delete(`/blog/deleteblog/${id}`)


//update blog post with auth token ,updated blog post and id

export const updateBlogPost = (token, id, updatedBlog) => {
  console.log(token);
    return API.patch(`/blog/updateblogpost/${id}`, updatedBlog, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

export const fetchBlogPostById = (id) => API.get(`/blog/getblogpostbyId/${id}`);



//user Authentication
export const fetchUsers = () => API.get('/auth/getusers');
export const createUser = (newUser) => API.post('/auth/createuser', newUser);
export const updateUser = (updatedUser) => API.post(`/auth/updateuser`, updatedUser);
export const deleteUser = (id) => API.delete(`/auth/deleteuser/${id}`);
export const userLogin = (user) => API.post('/auth/login', user);
export const forgotPassword = (userData) => API.post('/auth/forgot-password', userData);
export const ResetPassword = (userData) => API.post('/auth/reset-password', userData);

export const getUserProfile = async (token) => {
    try {
      const response = API.get('/auth/userdetails', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;   
  
    }
  };

  export const updateUserProfile = async (token, userData) => {
    console.log(userData);
    try {
      const response = API.put('/auth/updateuserdetails', userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;   
    }
  };

  //update password
export const changePassword = async (token,userData) => {
  try {
    const response = API.put('/auth/changePassword', userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;   
  }
};


//page management api
export const fetchPages = (token) => { 
    return API.get('/page/getpages', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

export const createPage = (token, newPage) => {
    return API.post('/page/createpage', newPage, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
export const updatePage = (token, id, updatedPage) => {
    return API.patch(`/page/updatepage/${id}`, updatedPage, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
export const deletePage = (token, id) => API.delete(`/page/deletepage/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const fetchPageById = (token, id) => API.get(`/page/getpagebyId/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const fetchPageBySlug = (slug) => API.get(`/page/getpagebyslug/${slug}`);


