import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

//gallery
const Gallery = React.lazy(() => import('./views/gallery/all_gallery'))

//blog
const BlogPostList = React.lazy(() => import('./views/blogs/blog_postlist'))
const BlogPostCreate = React.lazy(() => import('./views/blogs/create_blogpost'))
const BlogPostEdit = React.lazy(() => import('./views/blogs/update_blogpost'))
const BlogCategoryList = React.lazy(() => import('./views/blogs/blog_categories'))

//user
const UserProfile = React.lazy(() => import('./views/users/profile'))
const ChangePassword = React.lazy(() => import('./views/users/changepassword'))


//user
const UserList = React.lazy(() => import('./views/users/all_user'))


//Page
const PageList = React.lazy(() => import('./views/pagemanagement/listpage'))
const CreatePage = React.lazy(() => import('./views/pagemanagement/createpage'))
const EditPage = React.lazy(() => import('./views/pagemanagement/editpage'))

//private route
import PrivateRoute from './PrivateRoute';

const routes = [
  { path: '/dashboard', name: 'Dashboard', element: <PrivateRoute element={Dashboard} allowedRoles={['superAdmin','seo-expert','content-writer']} /> },
  { path: '/all-gallery', name: 'Gallery', element: <PrivateRoute element={Gallery} allowedRoles={['superAdmin','seo-expert','content-writer']} /> },
  { path: '/all-blogs', name: 'Blog Posts', element: <PrivateRoute element={BlogPostList} allowedRoles={['superAdmin','seo-expert','content-writer']} /> },
  { path: '/blog-post/create', name: 'Create Blog Post', element: <PrivateRoute element={BlogPostCreate} allowedRoles={['superAdmin','seo-expert','content-writer']} /> },
  { path: '/blog-post/update/:id', name: 'Edit Blog Post', element: <PrivateRoute element={BlogPostEdit} allowedRoles={['superAdmin','seo-expert','content-writer']} /> },
  { path: '/all-categories', name: 'Blog Categories', element: <PrivateRoute element={BlogCategoryList} allowedRoles={['superAdmin','seo-expert','content-writer']} /> },
  { path: '/all-users', name: 'Users', element: <PrivateRoute element={UserList} allowedRoles={['superAdmin']} /> },
  { path: '/user-profile', name: 'User Profile', element: <PrivateRoute element={UserProfile} allowedRoles={['superAdmin','seo-expert','content-writer']} /> },
  { path: '/user-change-password', name: 'User Change Password', element: <PrivateRoute element={ChangePassword} allowedRoles={['superAdmin','seo-expert','content-writer']} /> },
  { path: '/all-pages', name: 'Pages', element: <PrivateRoute element={PageList} allowedRoles={['superAdmin']} /> },
  { path: '/create-page', name: 'Create Page', element: <PrivateRoute element={CreatePage} allowedRoles={['superAdmin']} /> },
  { path: '/edit-page/:id', name: 'Edit Page', element: <PrivateRoute element={EditPage} allowedRoles={['superAdmin']} /> },
]

export default routes
