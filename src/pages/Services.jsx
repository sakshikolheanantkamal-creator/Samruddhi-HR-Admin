import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaBriefcase, FaListUl } from 'react-icons/fa';

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

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Editor State
  const [editingService, setEditingService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    tagline: '',
    hero_image: '',
    other_image: '',
    overview: '',
    cta: '',
    button_name: 'Contact Us',
    link: '/enquiry',
    what_we_do: [],
    who_is_for: [],
    key_benefits: [],
  });

  // Bullets Temp Inputs
  const [newWhatWeDo, setNewWhatWeDo] = useState('');
  const [newWhoIsFor, setNewWhoIsFor] = useState('');
  const [newKeyBenefits, setNewKeyBenefits] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      setLoading(true);
      const data = await api.get('/services');
      setServices(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch services.');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      title: '',
      slug: '',
      tagline: '',
      hero_image: '',
      other_image: '',
      overview: '',
      cta: '',
      button_name: 'Contact Us',
      link: '/enquiry',
      what_we_do: [],
      who_is_for: [],
      key_benefits: [],
    });
    setShowModal(true);
  };

  const handleOpenEdit = (svc) => {
    setEditingService(svc);
    setFormData({
      title: svc.title,
      slug: svc.slug,
      tagline: svc.tagline || '',
      hero_image: svc.hero_image || '',
      other_image: svc.other_image || '',
      overview: svc.overview || '',
      cta: svc.cta || '',
      button_name: svc.button_name || 'Contact Us',
      link: svc.link || '/enquiry',
      what_we_do: svc.what_we_do || [],
      who_is_for: svc.who_is_for || [],
      key_benefits: svc.key_benefits || [],
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Auto-generate slug from title for new items if slug is empty
      ...(name === 'title' && !editingService ? { slug: value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') } : {})
    }));
  };

  const handleAddBullet = (field, value, setter) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value.trim()]
    }));
    setter('');
  };

  const handleRemoveBullet = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      alert('Title and Slug are required.');
      return;
    }

    try {
      if (editingService) {
        const updated = await api.put(`/services/${editingService.id}`, formData);
        setServices(services.map(s => s.id === editingService.id ? updated : s));
      } else {
        const created = await api.post('/services', formData);
        setServices([...services, created]);
      }
      setShowModal(false);
    } catch (err) {
      alert(err.message || 'Failed to save service.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service? All frontend pages referencing this slug will fail to load.')) {
      return;
    }

    try {
      await api.delete(`/services/${id}`);
      setServices(services.filter(s => s.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete service.');
    }
  };

  return (
    <div style={styles.container}>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
        <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Services Manager</h1>
          <p style={styles.subtitle}>Create and update service offering pages dynamically.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <FaPlus />
          <span>Add Service</span>
        </button>
      </div>

      {error && <div style={styles.errorAlert}>{error}</div>}

      {loading ? (
        <div style={styles.loadingContainer}>Loading services...</div>
      ) : services.length === 0 ? (
        <div className="glass-card" style={styles.noDataCard}>
          No services created yet. Click "Add Service" to create one.
        </div>
      ) : (
        <div style={styles.servicesGrid}>
          {services.map((svc) => (
            <div key={svc.id} className="glass-card" style={styles.svcCard}>
              <div style={styles.svcIconContainer}>
                <FaBriefcase style={styles.svcIcon} />
              </div>
              <div style={styles.svcInfo}>
                <h3 style={styles.svcTitle}>{svc.title}</h3>
                <span style={styles.svcSlug}>/{svc.slug}</span>
                <p style={styles.svcTagline}>{svc.tagline || 'No tagline defined.'}</p>
              </div>
              <div style={styles.svcActions}>
                <button className="btn btn-secondary" style={styles.svcActionBtn} onClick={() => handleOpenEdit(svc)}>
                  <FaEdit />
                  <span>Edit</span>
                </button>
                <button className="btn btn-danger" style={styles.svcActionBtn} onClick={() => handleDelete(svc.id)}>
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
              <h3 style={styles.modalTitle}>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
              <button style={styles.closeBtn} onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.modalForm}>
              <div style={styles.modalBody}>
                {/* Meta details */}
                <div style={styles.formGrid}>
                  <div className="form-group">
                    <label className="form-label">Service Title *</label>
                    <input
                      className="form-input"
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., General Staffing"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Url Slug *</label>
                    <input
                      className="form-input"
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="e.g., general-staffing"
                      required
                      disabled={!!editingService}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Tagline</label>
                  <input
                    className="form-input"
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleInputChange}
                    placeholder="Short catching phrase"
                  />
                </div>

                <div style={styles.formGrid}>
                  <div className="form-group">
                    <label className="form-label">Hero Image</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <input
                        className="form-input"
                        type="text"
                        name="hero_image"
                        value={formData.hero_image}
                        onChange={handleInputChange}
                        placeholder="e.g., /staff.jpg"
                        style={{ flexGrow: 1 }}
                      />
                      {formData.hero_image && (
                        <img
                          src={resolveImage(formData.hero_image)}
                          alt="Hero Preview"
                          style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--glass-border)', flexShrink: 0 }}
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
                          setFormData(prev => ({ ...prev, hero_image: 'Uploading...' }));
                          const res = await api.post('/content/upload-image', uploadBody);
                          if (res && res.imageUrl) {
                            setFormData(prev => ({ ...prev, hero_image: res.imageUrl }));
                          }
                        } catch (err) {
                          alert('Failed to upload hero image: ' + (err.message || err));
                          setFormData(prev => ({ ...prev, hero_image: '' }));
                        }
                      }}
                      style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Other Image</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <input
                        className="form-input"
                        type="text"
                        name="other_image"
                        value={formData.other_image}
                        onChange={handleInputChange}
                        placeholder="e.g., /staff-2.jpg"
                        style={{ flexGrow: 1 }}
                      />
                      {formData.other_image && (
                        <img
                          src={resolveImage(formData.other_image)}
                          alt="Other Preview"
                          style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--glass-border)', flexShrink: 0 }}
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
                          setFormData(prev => ({ ...prev, other_image: 'Uploading...' }));
                          const res = await api.post('/content/upload-image', uploadBody);
                          if (res && res.imageUrl) {
                            setFormData(prev => ({ ...prev, other_image: res.imageUrl }));
                          }
                        } catch (err) {
                          alert('Failed to upload other image: ' + (err.message || err));
                          setFormData(prev => ({ ...prev, other_image: '' }));
                        }
                      }}
                      style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Service Overview</label>
                  <textarea
                    className="form-input"
                    style={{ minHeight: '100px', resize: 'vertical' }}
                    name="overview"
                    value={formData.overview}
                    onChange={handleInputChange}
                    placeholder="Detailed explanation of the service..."
                  />
                </div>

                {/* Bullets Sections */}
                <div style={styles.bulletsSection}>
                  {/* What we do */}
                  <div style={styles.bulletBox}>
                    <label className="form-label">What We Do / Scope</label>
                    <div style={styles.bulletInputRow}>
                      <input
                        className="form-input"
                        style={{ flexGrow: 1 }}
                        type="text"
                        placeholder="Add a point..."
                        value={newWhatWeDo}
                        onChange={(e) => setNewWhatWeDo(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={styles.addBulletBtn}
                        onClick={() => handleAddBullet('what_we_do', newWhatWeDo, setNewWhatWeDo)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <ul style={styles.bulletsList}>
                      {formData.what_we_do.map((item, idx) => (
                        <li key={idx} style={styles.bulletItem}>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const updated = [...formData.what_we_do];
                              updated[idx] = e.target.value;
                              setFormData({ ...formData, what_we_do: updated });
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'white',
                              outline: 'none',
                              width: '100%',
                              marginRight: '0.5rem',
                              fontSize: '0.8rem',
                              fontFamily: 'inherit'
                            }}
                          />
                          <button type="button" style={styles.bulletDeleteBtn} onClick={() => handleRemoveBullet('what_we_do', idx)}>
                            <FaTimes />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Who is for */}
                  <div style={styles.bulletBox}>
                    <label className="form-label">Who Is This For?</label>
                    <div style={styles.bulletInputRow}>
                      <input
                        className="form-input"
                        style={{ flexGrow: 1 }}
                        type="text"
                        placeholder="Add a point..."
                        value={newWhoIsFor}
                        onChange={(e) => setNewWhoIsFor(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={styles.addBulletBtn}
                        onClick={() => handleAddBullet('who_is_for', newWhoIsFor, setNewWhoIsFor)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <ul style={styles.bulletsList}>
                      {formData.who_is_for.map((item, idx) => (
                        <li key={idx} style={styles.bulletItem}>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const updated = [...formData.who_is_for];
                              updated[idx] = e.target.value;
                              setFormData({ ...formData, who_is_for: updated });
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'white',
                              outline: 'none',
                              width: '100%',
                              marginRight: '0.5rem',
                              fontSize: '0.8rem',
                              fontFamily: 'inherit'
                            }}
                          />
                          <button type="button" style={styles.bulletDeleteBtn} onClick={() => handleRemoveBullet('who_is_for', idx)}>
                            <FaTimes />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Benefits */}
                  <div style={styles.bulletBox}>
                    <label className="form-label">Key Benefits</label>
                    <div style={styles.bulletInputRow}>
                      <input
                        className="form-input"
                        style={{ flexGrow: 1 }}
                        type="text"
                        placeholder="Add a benefit..."
                        value={newKeyBenefits}
                        onChange={(e) => setNewKeyBenefits(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={styles.addBulletBtn}
                        onClick={() => handleAddBullet('key_benefits', newKeyBenefits, setNewKeyBenefits)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <ul style={styles.bulletsList}>
                      {formData.key_benefits.map((item, idx) => (
                        <li key={idx} style={styles.bulletItem}>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const updated = [...formData.key_benefits];
                              updated[idx] = e.target.value;
                              setFormData({ ...formData, key_benefits: updated });
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'white',
                              outline: 'none',
                              width: '100%',
                              marginRight: '0.5rem',
                              fontSize: '0.8rem',
                              fontFamily: 'inherit'
                            }}
                          />
                          <button type="button" style={styles.bulletDeleteBtn} onClick={() => handleRemoveBullet('key_benefits', idx)}>
                            <FaTimes />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label className="form-label">Call To Action (CTA) Text</label>
                  <input
                    className="form-input"
                    type="text"
                    name="cta"
                    value={formData.cta}
                    onChange={handleInputChange}
                    placeholder="e.g., Looking for temporary staff? Call us today."
                  />
                </div>

                <div style={styles.formGrid}>
                  <div className="form-group">
                    <label className="form-label">CTA Button Label</label>
                    <input
                      className="form-input"
                      type="text"
                      name="button_name"
                      value={formData.button_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CTA Link Path</label>
                    <input
                      className="form-input"
                      type="text"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Service</button>
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
  loadingContainer: {
    textAlign: 'center',
    padding: '4rem 0',
    color: 'var(--text-secondary)',
    fontSize: '1.1rem',
  },
  noDataCard: {
    textAlign: 'center',
    padding: '3rem 0',
    color: 'var(--text-secondary)',
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
    gap: '1.5rem',
  },
  svcCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    padding: '1.75rem',
  },
  svcIconContainer: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'var(--accent-glow)',
    color: 'var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svcIcon: {
    fontSize: '1.25rem',
  },
  svcInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    flexGrow: 1,
  },
  svcTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: 'white',
  },
  svcSlug: {
    fontSize: '0.85rem',
    fontFamily: 'monospace',
    color: 'var(--success)',
  },
  svcTagline: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    marginTop: '0.5rem',
  },
  svcActions: {
    display: 'flex',
    gap: '0.75rem',
    borderTop: '1px solid var(--glass-border)',
    paddingTop: '1rem',
    marginTop: '0.5rem',
  },
  svcActionBtn: {
    flexGrow: 1,
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
  },
  errorAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    color: 'var(--danger)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
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
    maxWidth: '850px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius)',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh',
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
    height: '100%',
  },
  modalBody: {
    overflowY: 'auto',
    paddingRight: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flexGrow: 1,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
    gap: '1rem',
  },
  bulletsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))',
    gap: '1.25rem',
    marginTop: '0.5rem',
  },
  bulletBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid var(--glass-border)',
    padding: '1rem',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    height: '240px',
  },
  bulletInputRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.75rem',
    flexShrink: 0,
  },
  addBulletBtn: {
    padding: '0.5rem',
    borderRadius: '8px',
    width: '38px',
    height: '38px',
    flexShrink: 0,
  },
  bulletsList: {
    listStyle: 'none',
    overflowY: 'auto',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  bulletItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.4rem 0.65rem',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid rgba(255, 255, 255, 0.02)',
    borderRadius: '6px',
    fontSize: '0.8rem',
  },
  bulletDeleteBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--danger)',
    cursor: 'pointer',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    padding: '0.1rem',
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
