import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaChartPie,
  FaEnvelopeOpenText,
  FaUserGraduate,
  FaCogs,
  FaSignOutAlt,
  FaBriefcase,
  FaUserTie,
  FaHome,
  FaCompass,
  FaInfoCircle,
  FaIndustry,
  FaPhoneAlt,
  FaUsers,
  FaTimes,
  FaCopyright,
} from 'react-icons/fa';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('samruddhi_admin_token');
    localStorage.removeItem('samruddhi_admin_user');
    onClose();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: FaChartPie },
    { to: '/cms/navbar', label: 'Navbar', icon: FaCompass },
    { to: '/cms/home', label: 'Home', icon: FaHome },
    { to: '/cms/about', label: 'About', icon: FaInfoCircle },
    { to: '/cms/manpower', label: 'Manpower Services', icon: FaUsers },
    { to: '/cms/industries', label: 'Industries', icon: FaIndustry },
    { to: '/services', label: 'Services', icon: FaBriefcase },
    { to: '/careers', label: 'Careers', icon: FaUserTie },
    { to: '/enquiries', label: 'Employees Enquiries', icon: FaEnvelopeOpenText },
    { to: '/contact-submissions', label: 'Contact Enquiry', icon: FaEnvelopeOpenText },
    { to: '/applications', label: 'Job Applications', icon: FaUserGraduate },
    { to: '/cms/contact', label: 'Contact Us', icon: FaPhoneAlt },
    { to: '/cms/footer', label: 'Footer', icon: FaCopyright },
    // { to: '/settings', label: 'Settings', icon: FaCogs },
  ];

  return (
    <aside className={`sidebar-aside ${isOpen ? 'open' : ''}`}>
      <div style={styles.logoContainer}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexGrow: 1 }}>
          <img src="/logo.png" alt="Samruddhi Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1, fontFamily: 'var(--font-display)' }}>Samruddhi</span>
            <span style={{ fontSize: '0.625rem', fontWeight: '800', color: '#83a62e', letterSpacing: '0.12em', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
              HR Services <span style={{ color: '#10b981', fontSize: '0.6rem', fontWeight: '600' }}>CMS</span>
            </span>
          </div>
        </div>
        <button className="mobile-close-btn" onClick={onClose} aria-label="Close Navigation Menu">
          <FaTimes />
        </button>
      </div>
      
      <nav style={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              })}
            >
              <Icon style={styles.icon} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div style={styles.divider} />

      <button onClick={handleLogout} style={styles.logoutBtn}>
        <FaSignOutAlt style={styles.icon} />
        <span>Logout</span>
      </button>

      <div style={styles.footer}>
        <span style={styles.footerText}>&copy; 2026 Samruddhi HR Services</span>
        <span style={styles.footerVersion}>CMS Dashboard v1.0.0</span>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 'var(--sidebar-width)',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--glass-border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '2rem 1.5rem',
    zIndex: 100,
    overflowY: 'auto',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '3rem',
  },
  logoBadge: {
    backgroundColor: 'var(--accent)',
    color: 'white',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    fontSize: '1rem',
  },
  logoText: {
    fontSize: '1.25rem',
    color: 'var(--text-primary)',
    fontWeight: '700',
  },
  logoSub: {
    color: 'var(--success)',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flexGrow: 1,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.85rem 1rem',
    borderRadius: '12px',
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'var(--transition-smooth)',
  },
  navLinkActive: {
    backgroundColor: 'var(--bg-tertiary)',
    color: 'white',
    borderLeft: '4px solid var(--accent)',
  },
  icon: {
    fontSize: '1.1rem',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.85rem 1rem',
    borderRadius: '12px',
    backgroundColor: 'transparent',
    color: 'var(--danger)',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    fontSize: '0.95rem',
    fontWeight: '500',
    fontFamily: 'var(--font-sans)',
    transition: 'var(--transition-smooth)',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--glass-border)',
    margin: '1.5rem 0 1rem 0',
    width: '100%',
  },
  footer: {
    padding: '0 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  footerText: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    margin: 0,
    fontFamily: 'var(--font-sans)',
  },
  footerVersion: {
    fontSize: '0.65rem',
    color: 'rgba(148, 163, 184, 0.4)',
    margin: 0,
    fontFamily: 'var(--font-sans)',
    letterSpacing: '0.05em',
  },
};
