import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, skip login screen
    if (localStorage.getItem('samruddhi_admin_token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await api.post('/auth/login', { username, password });
      localStorage.setItem('samruddhi_admin_token', data.token);
      localStorage.setItem('samruddhi_admin_user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-card animate-fade-in" style={styles.card}>
        <div style={styles.header}>
          <img src="/logo.png" alt="Samruddhi Logo" style={{ width: '60px', height: '60px', objectFit: 'contain', marginBottom: '0.75rem' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1, fontFamily: 'var(--font-display)' }}>Samruddhi</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#83a62e', letterSpacing: '0.15em', fontFamily: 'var(--font-display)', textTransform: 'uppercase', marginTop: '0.25rem' }}>
              HR Services <span style={{ color: '#10b981', fontWeight: '600' }}>CMS</span>
            </span>
          </div>
          <p style={styles.subtitle}>Enter credentials to access administrative dashboard</p>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <div style={styles.inputWrapper}>
              <FaEnvelope style={styles.inputIcon} />
              <input
                className="form-input"
                style={styles.paddedInput}
                type="email"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@gmail.com"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <div style={styles.inputWrapper}>
              <FaLock style={styles.inputIcon} />
              <input
                className="form-input"
                style={{ ...styles.paddedInput, paddingRight: '2.75rem' }}
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button className="btn btn-primary" style={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '1.5rem',
    background: 'radial-gradient(circle at 10% 20%, rgba(9, 13, 22, 1) 0%, rgba(17, 23, 38, 1) 90.1%)',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    padding: '3rem 2.5rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoBadge: {
    backgroundColor: 'var(--accent)',
    color: 'white',
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    marginBottom: '1rem',
    boxShadow: '0 4px 14px 0 var(--accent-glow)',
  },
  title: {
    fontSize: '1.75rem',
    marginBottom: '0.5rem',
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  errorAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    color: 'var(--danger)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    pointerEvents: 'none',
  },
  paddedInput: {
    paddingLeft: '2.75rem',
  },
  submitBtn: {
    padding: '0.85rem',
    fontSize: '1rem',
  },
  eyeIcon: {
    position: 'absolute',
    right: '1rem',
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    cursor: 'pointer',
    padding: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s ease',
    outline: 'none',
  },
};
