import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FaTrash, FaPlus, FaSave, FaArrowUp, FaArrowDown, FaLink } from 'react-icons/fa';

export default function NavbarCMS() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Logo State
  const [logoData, setLogoData] = useState({
    logo_image: '',
    logo_title: 'Samruddhi',
    logo_subtitle: 'HR Services',
  });
  const [logoLoading, setLogoLoading] = useState(false);
  const [logoSuccess, setLogoSuccess] = useState('');
  const [logoError, setLogoError] = useState('');

  // Add Item State
  const [newItemName, setNewItemName] = useState('');
  const [newItemPath, setNewItemPath] = useState('');
  const [isDropdown, setIsDropdown] = useState(false);

  useEffect(() => {
    fetchLinks();
    fetchLogoData();
  }, []);

  async function fetchLinks() {
    try {
      setLoading(true);
      const data = await api.get('/content/navbar_links');
      setLinks(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch navbar links.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchLogoData() {
    try {
      const data = await api.get('/content/navbar_logo');
      if (data) {
        setLogoData({
          logo_image: data.logo_image || '',
          logo_title: data.logo_title || 'Samruddhi',
          logo_subtitle: data.logo_subtitle || 'HR Services',
        });
      }
    } catch (err) {
      console.error('Failed to fetch logo data:', err);
    }
  }

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName) return;

    const newItem = {
      name: newItemName,
      path: isDropdown ? null : newItemPath,
      isDropdown: isDropdown || undefined,
    };

    setLinks([...links, newItem]);
    setNewItemName('');
    setNewItemPath('');
    setIsDropdown(false);
  };

  const handleDelete = (index) => {
    setLinks(links.filter((_, idx) => idx !== index));
  };

  const moveLink = (index, direction) => {
    const updatedLinks = [...links];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= links.length) return;

    // Swap
    const temp = updatedLinks[index];
    updatedLinks[index] = updatedLinks[targetIdx];
    updatedLinks[targetIdx] = temp;
    setLinks(updatedLinks);
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/content/navbar_links', links);
      setSuccess('Navbar configuration saved successfully.');
    } catch (err) {
      setError(err.message || 'Failed to save navbar configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLogo = async () => {
    setLogoLoading(true);
    setLogoError('');
    setLogoSuccess('');
    try {
      await api.post('/content/navbar_logo', logoData);
      setLogoSuccess('Logo configuration saved successfully.');
      setTimeout(() => setLogoSuccess(''), 3000);
    } catch (err) {
      setLogoError(err.message || 'Failed to save logo configuration.');
    } finally {
      setLogoLoading(false);
    }
  };

  const handleLogoInputChange = (e) => {
    const { name, value } = e.target;
    setLogoData(prev => ({ ...prev, [name]: value }));
  };

  const resolveImage = (path) => {
    if (!path) return '';
    if (path.startsWith('/uploads/')) {
      return `http://localhost:5000${path}`;
    }
    if (path.startsWith('/')) {
      return `http://localhost:5173${path}`;
    }
    return path;
  };

  return (
    <div className="animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Navbar Manager</h1>
          <p style={styles.subtitle}>Configure navigation menu items and routes displayed in the website header.</p>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Logo Configuration */}
        <div className="glass-card" style={styles.card}>
          <h3 style={styles.cardTitle}>Logo Configuration</h3>
          
          <div className="form-group">
            <label className="form-label">Logo Image</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input
                className="form-input"
                type="text"
                name="logo_image"
                value={logoData.logo_image}
                onChange={handleLogoInputChange}
                placeholder="e.g., /logo/logo.png"
                style={{ flexGrow: 1 }}
              />
              {logoData.logo_image && (
                <img
                  src={resolveImage(logoData.logo_image)}
                  alt="Logo Preview"
                  style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '6px', border: '1px solid var(--glass-border)', flexShrink: 0, backgroundColor: 'white', padding: '4px' }}
                />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const uploadBody = new FormData();
                uploadBody.append('image', file);
                try {
                  setLogoData(prev => ({ ...prev, logo_image: 'Uploading...' }));
                  const res = await api.post('/content/upload-image', uploadBody);
                  if (res && res.imageUrl) {
                    setLogoData(prev => ({ ...prev, logo_image: res.imageUrl }));
                  }
                } catch (err) {
                  alert('Failed to upload logo: ' + (err.message || err));
                  setLogoData(prev => ({ ...prev, logo_image: '' }));
                }
              }}
              style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Logo Title (Main Text)</label>
            <input
              className="form-input"
              type="text"
              name="logo_title"
              value={logoData.logo_title}
              onChange={handleLogoInputChange}
              placeholder="e.g., Samruddhi"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Logo Subtitle (Tagline)</label>
            <input
              className="form-input"
              type="text"
              name="logo_subtitle"
              value={logoData.logo_subtitle}
              onChange={handleLogoInputChange}
              placeholder="e.g., HR Services"
            />
          </div>

          <div style={styles.cardFooter}>
            {logoError && <span style={styles.cardError}>{logoError}</span>}
            {logoSuccess && <span style={styles.cardSuccess}>{logoSuccess}</span>}
            <button
              className="btn btn-primary"
              onClick={handleSaveLogo}
              disabled={logoLoading}
            >
              <FaSave />
              <span>{logoLoading ? 'Saving...' : 'Save Logo'}</span>
            </button>
          </div>
        </div>

        {/* Active items lists */}
        <div className="glass-card" style={styles.card}>
          <h3 style={styles.cardTitle}>Active Menu Items</h3>
          {loading && links.length === 0 ? (
            <p style={styles.infoText}>Loading links...</p>
          ) : links.length === 0 ? (
            <p style={styles.infoText}>No navigation items configured. Add one below.</p>
          ) : (
            <div style={styles.list}>
              {links.map((link, index) => (
                <div key={index} style={styles.listItem}>
                  <div style={{ ...styles.listItemText, flexGrow: 1, marginRight: '1rem' }}>
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => {
                        const updatedLinks = [...links];
                        updatedLinks[index].name = e.target.value;
                        setLinks(updatedLinks);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        outline: 'none',
                        width: '100%',
                        padding: '2px 4px',
                        borderBottom: '1px dashed rgba(255,255,255,0.1)',
                      }}
                      placeholder="Menu Item Name"
                    />
                    {!link.isDropdown ? (
                      <input
                        type="text"
                        value={link.path || ''}
                        onChange={(e) => {
                          const updatedLinks = [...links];
                          updatedLinks[index].path = e.target.value;
                          setLinks(updatedLinks);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          fontSize: '0.8rem',
                          fontFamily: 'monospace',
                          outline: 'none',
                          width: '100%',
                          padding: '2px 4px',
                        }}
                        placeholder="/route-path"
                      />
                    ) : (
                      <span style={{ ...styles.linkPath, padding: '2px 4px' }}>(Services Dropdown Menu)</span>
                    )}
                  </div>
                  <div style={styles.itemActions}>
                    <button
                      className="btn btn-secondary"
                      style={styles.actionBtn}
                      onClick={() => moveLink(index, 'up')}
                      disabled={index === 0}
                    >
                      <FaArrowUp />
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={styles.actionBtn}
                      onClick={() => moveLink(index, 'down')}
                      disabled={index === links.length - 1}
                    >
                      <FaArrowDown />
                    </button>
                    <button
                      className="btn btn-danger"
                      style={styles.actionBtn}
                      onClick={() => handleDelete(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={styles.cardFooter}>
            {error && <span style={styles.cardError}>{error}</span>}
            {success && <span style={styles.cardSuccess}>{success}</span>}
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              <FaSave />
              <span>{loading ? 'Saving...' : 'Save Navbar Links'}</span>
            </button>
          </div>
        </div>

        {/* Add item forms */}
        <div className="glass-card" style={styles.card}>
          <h3 style={styles.cardTitle}>Add Navigation Link</h3>
          <form onSubmit={handleAddItem} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Link Text</label>
              <input
                className="form-input"
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g., About Us"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={isDropdown}
                  onChange={(e) => setIsDropdown(e.target.checked)}
                  style={{ marginRight: '0.5rem' }}
                />
                Is Services Dropdown Menu
              </label>
            </div>

            {!isDropdown && (
              <div className="form-group">
                <label className="form-label">Destination Route Path</label>
                <div style={styles.inputWrapper}>
                  <FaLink style={styles.inputIcon} />
                  <input
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    type="text"
                    value={newItemPath}
                    onChange={(e) => setNewItemPath(e.target.value)}
                    placeholder="e.g., /about"
                    required={!isDropdown}
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <FaPlus />
              <span>Add to Navbar</span>
            </button>
          </form>
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
    flexWrap: 'wrap',
    gap: '1rem',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
    gap: '2rem',
    alignItems: 'flex-start',
  },
  card: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'white',
    borderBottom: '1px solid var(--glass-border)',
    paddingBottom: '1rem',
  },
  infoText: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    textAlign: 'center',
    padding: '2rem 0',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.85rem 1rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--glass-border)',
    borderRadius: '10px',
  },
  listItemText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  linkName: {
    fontWeight: '600',
    color: 'white',
    fontSize: '0.95rem',
  },
  linkPath: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    fontFamily: 'monospace',
  },
  itemActions: {
    display: 'flex',
    gap: '0.4rem',
  },
  actionBtn: {
    padding: '0.4rem',
    fontSize: '0.8rem',
    borderRadius: '6px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'var(--text-primary)',
    cursor: 'pointer',
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
  },
  errorAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    color: 'var(--danger)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    padding: '1rem',
    borderRadius: '12px',
  },
  successAlert: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    color: 'var(--success)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    padding: '1rem',
    borderRadius: '12px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '1rem',
    borderTop: '1px solid var(--glass-border)',
    paddingTop: '1rem',
    marginTop: '1rem',
  },
  cardSuccess: {
    color: 'var(--success)',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  cardError: {
    color: 'var(--danger)',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
};
