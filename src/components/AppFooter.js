import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <CFooter className="px-4 py-3 bg-white border-top-0 shadow-sm d-flex align-items-center justify-content-between" style={{ fontSize: '0.8rem' }}>
      <div className="text-muted">
        <span className="fw-bold text-primary">CRM Force Plus</span>
        <span className="mx-2 text-secondary opacity-50">|</span>
        <span>&copy; {currentYear} Dynamics Square. All rights reserved.</span>
      </div>
      <div className="d-none d-md-flex align-items-center gap-3">
        <span className="text-muted">Built with excellence by</span>
        <a 
          href="https://www.dynamicssquare.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-decoration-none fw-bold text-primary hover-opacity"
        >
          Dynamics Square
        </a>
      </div>
      
      <style>{`
        .hover-opacity:hover { opacity: 0.8; }
      `}</style>
    </CFooter>
  )
}

export default React.memo(AppFooter)
