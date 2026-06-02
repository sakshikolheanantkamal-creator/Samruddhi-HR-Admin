import React, { useState } from 'react';
import { api } from '../services/api';
import { FaLock, FaKey, FaShieldAlt } from 'react-icons/fa';

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      setSuccess('Administrator password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Account Settings</h1>
          <p style={styles.subtitle}>Configure security credentials and CMS dashboard parameters.</p>
        </div>
      </div>

      <div style={styles.settingsGrid}>
        <div className="glass-card" style={styles.card}>
          <div style={styles.cardHeader}>
            <FaShieldAlt style={styles.cardIcon} />
            <h3 style={styles.cardTitle}>Change Access Password</h3>
          </div>

          {error && <div style={styles.errorAlert}>{error}</div>}
          {success && <div style={styles.successAlert}>{success}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <div style={styles.inputWrapper}>
                <FaLock style={styles.inputIcon} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={styles.inputWrapper}>
                <FaKey style={styles.inputIcon} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">Confirm New Password</label>
              <div style={styles.inputWrapper}>
                <FaKey style={styles.inputIcon} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Saving...' : 'Update Password'}
            </button>
          </form>
        </div>

        <div className="glass-card" style={styles.infoCard}>
          <h3 style={styles.infoTitle}>CMS Information</h3>
          <p style={styles.infoText}>
            You are logged in as the primary administrator. For security reasons, please make sure to:
          </p>
          <ul style={styles.infoList}>
            <li>Use a strong, unique password not shared with other accounts.</li>
            <li>Change the default password (`adminpassword`) immediately.</li>
            <li>Logout of your session when accessing the dashboard on shared machines.</li>
          </ul>
          <div style={styles.metaBox}>
            <span style={styles.metaLabel}>Backend status:</span>
            <span style={styles.metaValue}>Online (v1.0.0)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: '700',
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '1rem',
  },
  settingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
    gap: '2rem',
    alignItems: 'flex-start',
  },
  card: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    borderBottom: '1px solid var(--glass-border)',
    paddingBottom: '1rem',
  },
  cardIcon: {
    color: 'var(--accent)',
    fontSize: '1.25rem',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
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
  submitBtn: {
    padding: '0.8rem',
    fontSize: '0.95rem',
  },
  errorAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    color: 'var(--danger)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
  },
  successAlert: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    color: 'var(--success)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
  },
  infoCard: {
    padding: '2rem',
    backgroundColor: 'var(--bg-secondary)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  infoTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'white',
    borderBottom: '1px solid var(--glass-border)',
    paddingBottom: '1rem',
  },
  infoText: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
  },
  infoList: {
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    paddingLeft: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    lineHeight: '1.5',
  },
  metaBox: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    fontSize: '0.85rem',
    marginTop: '1rem',
  },
  metaLabel: {
    color: 'var(--text-secondary)',
  },
  metaValue: {
    color: 'var(--success)',
    fontWeight: '600',
  },
};
