import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Careers from './pages/Careers';
import Enquiries from './pages/Enquiries';
import Applications from './pages/Applications';
// import Settings from './pages/Settings';

// Dynamic CMS page imports
import NavbarCMS from './pages/NavbarCMS';
import HomeCMS from './pages/HomeCMS';
import AboutCMS from './pages/AboutCMS';
import ManpowerCMS from './pages/ManpowerCMS';
import IndustriesCMS from './pages/IndustriesCMS';
import ContactCMS from './pages/ContactCMS';
import FooterCMS from './pages/FooterCMS';
import ContactSubmissions from './pages/ContactSubmissions';

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  return (
    <div className="admin-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <div className="admin-main-container">
        <header className="admin-mobile-header">
          <div className="mobile-logo-section" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/logo.png" alt="Samruddhi Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1, fontFamily: 'var(--font-display)' }}>Samruddhi</span>
              <span style={{ fontSize: '0.55rem', fontWeight: '800', color: '#83a62e', letterSpacing: '0.08em', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
                HR Services <span style={{ color: '#10b981', fontSize: '0.5rem', fontWeight: '600' }}>CMS</span>
              </span>
            </div>
          </div>
          <button
            className="mobile-sidebar-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open Navigation Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </header>
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Dashboard Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/cms/navbar"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <NavbarCMS />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/cms/home"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <HomeCMS />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/cms/about"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <AboutCMS />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/cms/manpower"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <ManpowerCMS />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/cms/industries"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <IndustriesCMS />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/cms/contact"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <ContactCMS />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/contact-submissions"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <ContactSubmissions />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/cms/footer"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <FooterCMS />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/services"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Services />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/careers"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Careers />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/enquiries"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Enquiries />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Applications />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        {/* <Route
          path="/settings"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </PrivateRoute>
          }
        /> */}
      </Routes>
    </Router>
  );
}
