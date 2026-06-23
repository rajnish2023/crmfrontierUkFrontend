import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
  CAvatar,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { AppSidebarNav } from './AppSidebarNav'
import logo from './../../public/crmfrontier.svg'
import navigation from '../_nav'
import { getUserProfile } from '../api/api';

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const token = localStorage.getItem('token');
  const [filteredNav, setFilteredNav] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;
      try {
        const res = await getUserProfile(token);  
        setUser(res.data);
        const filteredItems = filterNavByRole(navigation, res.data.role);
        setFilteredNav(filteredItems);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, [token]);

  const filterNavByRole = (navItems, role) => {
    return navItems.filter((item) => {
      if (item.showForRoles && !item.showForRoles.includes(role)) {  
        return false;
      }
      const newItem = { ...item };
      if (newItem.items) {
        newItem.items = filterNavByRole(newItem.items, role);  
        return newItem.items.length > 0;
      }
      return true;
    });
  };

  return (
    <CSidebar
      className="border-end shadow-lg"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
      style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <CSidebarHeader className="border-bottom-0 pb-0">
        <CSidebarBrand to="/" className="d-flex flex-column align-items-center py-3 w-100">
          <div className="logo-wrapper p-2 rounded-3 bg-white shadow-sm mb-2" style={{ width: '85%' }}>
            <img src={logo} alt="logo" style={{ width: '100%', height: 'auto' }} />
          </div>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      <div className="px-3 py-2 mb-3">
        <div className="small text-uppercase fw-bold text-muted opacity-50 px-3" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
          Menu Navigation
        </div>
      </div>

      <AppSidebarNav items={filteredNav} />

      <div className="mt-auto p-3">
        {!unfoldable && user && (
          <div className="user-profile-snippet d-flex align-items-center p-2 rounded-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <CAvatar color="primary" textColor="white" className="me-2" size="sm">
              {user.name?.charAt(0) || 'U'}
            </CAvatar>
            <div className="overflow-hidden">
              <div className="fw-bold text-white small text-truncate" style={{ fontSize: '0.75rem' }}>{user.name || 'User'}</div>
              <div className="text-muted text-truncate" style={{ fontSize: '0.65rem' }}>{user.role}</div>
            </div>
          </div>
        )}
      </div>

      <CSidebarFooter className="border-top-0 d-none d-lg-flex justify-content-center py-2">
        <CSidebarToggler
          className="rounded-circle"
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
      
      <style>{`
        .sidebar-nav .nav-link { font-size: 0.875rem; font-weight: 500; border-radius: 8px; margin: 2px 12px; transition: all 0.2s; }
        .sidebar-nav .nav-link:hover { background: rgba(255,255,255,0.05) !important; color: #3b82f6 !important; }
        .sidebar-nav .nav-link.active { background: #3b82f6 !important; color: #fff !important; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
        .logo-wrapper { transition: transform 0.3s ease; }
        .logo-wrapper:hover { transform: scale(1.02); }
      `}</style>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
