import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FaSave, FaPlus, FaTimes, FaIndustry, FaTrash, FaEdit } from 'react-icons/fa';

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

export default function IndustriesCMS() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [industries, setIndustries] = useState([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState(null);
  const [indForm, setIndForm] = useState({
    id: '',
    title: '',
    description: '',
    image: '',
    color: '#285e9c',
  });

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    try {
      setLoading(true);
      const data = await api.get('/content/industries_we_serve');
      setIndustries(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch industries we serve settings.');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingIndustry(null);
    setIndForm({
      id: Date.now(),
      title: '',
      description: '',
      image: '/industriesweserves/default.jpg',
      color: '#285e9c',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (ind) => {
    setEditingIndustry(ind);
    setIndForm({
      id: ind.id,
      title: ind.title,
      description: ind.description || '',
      image: ind.image || '',
      color: ind.color || '#285e9c',
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setIndForm({
      ...indForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!indForm.title) return;

    let updated;
    if (editingIndustry) {
      updated = industries.map(i => i.id === indForm.id ? indForm : i);
    } else {
      updated = [...industries, indForm];
    }

    setIndustries(updated);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this industry sector?')) return;
    setIndustries(industries.filter(i => i.id !== id));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/content/industries_we_serve', industries);
      setSuccess('Industries configurations saved successfully.');
    } catch (err) {
      setError(err.message || 'Failed to save industries.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
        <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Industries We Serve</h1>
          <p style={styles.subtitle}>Configure industry sectors, descriptive text, and image targets displayed on the website.</p>
        </div>
        <div style={styles.headerActions}>
          <button className="btn btn-secondary" onClick={handleOpenAdd}>
            <FaPlus />
            <span>Add Sector</span>
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            <FaSave />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {error && <div style={styles.errorAlert}>{error}</div>}
      {success && <div style={styles.successAlert}>{success}</div>}

      {loading && industries.length === 0 ? (
        <div style={styles.loading}>Loading industries list...</div>
      ) : industries.length === 0 ? (
        <div className="glass-card" style={styles.noDataCard}>
          No sectors configured yet. Click "Add Sector" to start.
        </div>
      ) : (
        <div style={styles.industriesGrid}>
          {industries.map((ind) => (
            <div key={ind.id} className="glass-card" style={styles.card}>
              <div style={styles.imageWrapper}>
                <img src={resolveImage(ind.image)} alt={ind.title} style={styles.cardImage} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop'; }} />
                <div style={{ ...styles.cardBadge, backgroundColor: ind.color }}>Sector</div>
              </div>
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{ind.title}</h3>
                <p style={styles.cardDesc}>{ind.description}</p>
                <div style={styles.imagePathTag}>Path: {ind.image}</div>
              </div>
              <div style={styles.cardActions}>
                <button className="btn btn-secondary" style={styles.actionBtn} onClick={() => handleOpenEdit(ind)}>
                  <FaEdit />
                  <span>Edit</span>
                </button>
                <button className="btn btn-danger" style={styles.actionBtn} onClick={() => handleDelete(ind.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

      {/* Editor Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-card animate-fade-in" style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{editingIndustry ? 'Edit Industry Sector' : 'Add Industry Sector'}</h3>
              <button style={styles.closeBtn} onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSave} style={styles.modalForm}>
              <div style={styles.modalBody}>
                <div className="form-group">
                  <label className="form-label">Sector Title</label>
                  <input
                    className="form-input"
                    type="text"
                    name="title"
                    value={indForm.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Retail & FMCG"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Sector Description</label>
                  <textarea
                    className="form-input"
                    style={{ minHeight: '60px', resize: 'vertical' }}
                    name="description"
                    value={indForm.description}
                    onChange={handleInputChange}
                    placeholder="Short description..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Sector Image</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <input
                      className="form-input"
                      type="text"
                      name="image"
                      value={indForm.image}
                      onChange={handleInputChange}
                      placeholder="e.g., /industriesweserves/it.jpg"
                      style={{ flexGrow: 1 }}
                    />
                    {indForm.image && (
                      <img
                        src={resolveImage(indForm.image)}
                        alt="Preview"
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--glass-border)', flexShrink: 0 }}
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
                        setIndForm(prev => ({ ...prev, image: 'Uploading...' }));
                        const res = await api.post('/content/upload-image', uploadBody);
                        if (res && res.imageUrl) {
                          setIndForm(prev => ({ ...prev, image: res.imageUrl }));
                        }
                      } catch (err) {
                        alert('Failed to upload image: ' + (err.message || err));
                        setIndForm(prev => ({ ...prev, image: '' }));
                      }
                    }}
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Theme Color Accent</label>
                  <input
                    className="form-input"
                    type="text"
                    name="color"
                    value={indForm.color}
                    onChange={handleInputChange}
                    placeholder="#285e9c"
                  />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  headerActions: {
    display: 'flex',
    gap: '0.75rem',
  },
  industriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
    gap: '1.5rem',
  },
  card: {
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
    height: '160px',
    width: '100%',
    backgroundColor: '#1b2336',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardBadge: {
    position: 'absolute',
    top: '0.75rem',
    right: '0.75rem',
    padding: '0.2rem 0.6rem',
    borderRadius: '6px',
    color: 'white',
    fontSize: '0.7rem',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardBody: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flexGrow: 1,
  },
  cardTitle: {
    fontSize: '1.1rem',
    color: 'white',
    fontWeight: '600',
  },
  cardDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  imagePathTag: {
    fontSize: '0.7rem',
    fontFamily: 'monospace',
    color: 'var(--text-secondary)',
  },
  cardActions: {
    display: 'flex',
    gap: '0.5rem',
    padding: '0 1.25rem 1.25rem 1.25rem',
  },
  actionBtn: {
    flexGrow: 1,
    padding: '0.45rem',
    fontSize: '0.8rem',
  },
  loading: {
    textAlign: 'center',
    padding: '4rem 0',
    color: 'var(--text-secondary)',
    fontSize: '1.1rem',
  },
  noDataCard: {
    textAlign: 'center',
    padding: '3rem 0',
    color: 'var(--text-secondary)',
    width: '100%',
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
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1.5rem',
  },
  modalContent: {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius)',
    padding: '2rem',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--glass-border)',
    paddingBottom: '1rem',
    marginBottom: '1.5rem',
    flexShrink: 0,
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    fontFamily: 'var(--font-display)',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '1.25rem',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flexGrow: 1,
  },
  modalBody: {
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    paddingRight: '0.5rem',
    flexGrow: 1,
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    borderTop: '1px solid var(--glass-border)',
    paddingTop: '1.5rem',
    marginTop: '1.5rem',
    flexShrink: 0,
  },
};
