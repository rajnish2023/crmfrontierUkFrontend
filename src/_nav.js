import React from 'react'
import CIcon from '@coreui/icons-react'
import {
   
  cilList,
  cilSpeedometer,
  cilDescription,
  cilGroup,
  cilCloudUpload
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Gallery',
  },
  {
    component: CNavItem,
    name: 'Uploaded Files',
    to: '/all-gallery',
    icon: <CIcon icon={cilCloudUpload} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Blog Management',
  },
  {
    component: CNavGroup,
    name: 'Blog Posts',
    to: '/all-blogs',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Blogs',
        to: '/all-blogs',
      },
      {
        component: CNavItem,
        name: 'Create Blog',
        to: '/blog-post/create',
      },
       
    ],
  },
  {
    component: CNavGroup,
    name: 'Blog Category',
    to: '/all-categories',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Categories',
        to: '/all-categories',
      },
      
    ],
  },
  
  {
    component: CNavTitle,
    name: 'Page Management',
  },
  {
    component: CNavGroup,
    name: 'Pages',
    to: '/all-pages',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Pages',
        to: '/all-pages',
      },
      {
        component: CNavItem,
        name: 'Create Page',
        to: '/create-page',
      },
       
    ],
  },
  
  
  {
    component: CNavTitle,
    name: 'User Management',
    showForRoles: ['superAdmin'],
  },
  {
    component: CNavGroup,
    name: 'Users',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    showForRoles: ['superAdmin'],
    items: [
      {
        component: CNavItem,
        name: 'View Users',
        to: '/all-users',
      },
    ],
  },
  
]

export default _nav
