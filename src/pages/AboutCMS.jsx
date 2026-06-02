import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FaSave, FaPlus, FaTimes, FaInfoCircle, FaListUl, FaEye, FaLightbulb, FaHeart, FaPlusSquare, FaTrash, FaEdit } from 'react-icons/fa';

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

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

export default function AboutCMS() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    imageUrl: '',
    paragraphs: [],
    vision: '',
    missions: [],
    features: [],
    facilitation_text: '',
    bottom_features: [],
  });

  // Bullets lists temp inputs
  const [newParagraph, setNewParagraph] = useState('');
  const [newMission, setNewMission] = useState('');
  
  // Why Choose Us Card state
  const [editingFeature, setEditingFeature] = useState(null);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [featureForm, setFeatureForm] = useState({ id: '', title: '', description: '', color: '#285e9c', icon: 'FaBriefcase' });

  // Section saving states
  const [sectionStatus, setSectionStatus] = useState({
    about: { loading: false, success: false, error: '' },
    visionmission: { loading: false, success: false, error: '' },
    features: { loading: false, success: false, error: '' },
  });

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    try {
      setLoading(true);
      const data = await api.get('/content/about_content');
        setFormData({
          imageUrl: data.imageUrl || '',
          paragraphs: (data.paragraphs || []).map(stripHtml),
          vision: stripHtml(data.vision || ''),
          missions: (data.missions || []).map(stripHtml),
          features: data.features || [],
          facilitation_text: stripHtml(data.facilitation_text || ''),
          bottom_features: data.bottom_features || [
            { icon: "FaBuilding", text: "Structured HR Solutions", color: "#285e9c" },
            { icon: "FaShieldAlt", text: "Compliant Operations", color: "#83a62e" },
            { icon: "FaHandshake", text: "Dependable Partnership", color: "#285e9c" },
            { icon: "FaChartLine", text: "Growth-Focused Approach", color: "#83a62e" }
          ],
        });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch about us content settings.');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddParagraph = () => {
    if (!newParagraph.trim()) return;
    setFormData({
      ...formData,
      paragraphs: [...formData.paragraphs, newParagraph.trim()],
    });
    setNewParagraph('');
  };

  const handleRemoveParagraph = (idx) => {
    setFormData({
      ...formData,
      paragraphs: formData.paragraphs.filter((_, i) => i !== idx),
    });
  };

  const handleAddMission = () => {
    if (!newMission.trim()) return;
    setFormData({
      ...formData,
      missions: [...formData.missions, newMission.trim()],
    });
    setNewMission('');
  };

  const handleRemoveMission = (idx) => {
    setFormData({
      ...formData,
      missions: formData.missions.filter((_, i) => i !== idx),
    });
  };

  // Why choose us items CRUD
  const handleOpenAddFeature = () => {
    setEditingFeature(null);
    setFeatureForm({ id: Date.now(), title: '', description: '', color: '#285e9c', icon: 'FaBriefcase' });
    setShowFeatureModal(true);
  };

  const handleOpenEditFeature = (feat) => {
    setEditingFeature(feat);
    setFeatureForm({ id: feat.id, title: feat.title, description: feat.description, color: feat.color || '#285e9c', icon: feat.icon || 'FaBriefcase' });
    setShowFeatureModal(true);
  };

  const handleSaveFeature = (e) => {
    e.preventDefault();
    if (!featureForm.title) return;

    let updatedFeatures;
    if (editingFeature) {
      updatedFeatures = formData.features.map(f => f.id === featureForm.id ? featureForm : f);
    } else {
      updatedFeatures = [...formData.features, featureForm];
    }

    setFormData({
      ...formData,
      features: updatedFeatures,
    });
    setShowFeatureModal(false);
  };

  const handleDeleteFeature = (id) => {
    if (!window.confirm('Are you sure you want to delete this feature card?')) return;
    setFormData({
      ...formData,
      features: formData.features.filter(f => f.id !== id),
    });
  };

  const handleSaveSection = async (sectionName) => {
    setSectionStatus(prev => ({
      ...prev,
      [sectionName]: { loading: true, success: false, error: '' }
    }));
    try {
      const latestData = await api.get('/content/about_content').catch(() => ({}));
      let updatedPayload = { ...latestData };

      if (sectionName === 'about') {
        updatedPayload.imageUrl = formData.imageUrl;
        updatedPayload.paragraphs = formData.paragraphs;
        updatedPayload.facilitation_text = formData.facilitation_text;
        updatedPayload.bottom_features = formData.bottom_features;
      } else if (sectionName === 'visionmission') {
        updatedPayload.vision = formData.vision;
        updatedPayload.missions = formData.missions;
      } else if (sectionName === 'features') {
        updatedPayload.features = formData.features;
      }

      await api.post('/content/about_content', updatedPayload);
      setFormData(prev => ({ ...prev, ...updatedPayload }));

      setSectionStatus(prev => ({
        ...prev,
        [sectionName]: { loading: false, success: true, error: '' }
      }));
      setTimeout(() => {
        setSectionStatus(prev => ({
          ...prev,
          [sectionName]: { ...prev[sectionName], success: false }
        }));
      }, 3000);
    } catch (err) {
      setSectionStatus(prev => ({
        ...prev,
        [sectionName]: { loading: false, success: false, error: err.message || 'Failed to save.' }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/content/about_content', formData);
      setSuccess('About us content saved successfully!');
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to update about us content.');
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.vision) {
    return <div style={styles.loading}>Loading about us content settings...</div>;
  }

  return (
    <div style={styles.container}>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
        <div style={styles.header}>
        <div>
          <h1 style={styles.title}>About Us & Vision</h1>
          <p style={styles.subtitle}>Manage descriptions, vision statements, mission bullets, and Why Choose Us highlight cards.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          <FaSave />
          <span>Save Changes</span>
        </button>
      </div>

      {error && <div style={styles.errorAlert}>{error}</div>}
      {success && <div style={styles.successAlert}>{success}</div>}

      <div style={styles.grid}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Main info card */}
          <div className="glass-card" style={styles.card}>
            <div style={styles.cardHeader}>
              <FaInfoCircle style={styles.cardIcon} />
              <h3 style={styles.cardTitle}>General About Us</h3>
            </div>

            <div className="form-group">
              <label className="form-label">About Us Side Image</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <input
                  className="form-input"
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="Image URL (or upload a file below)"
                  style={{ flexGrow: 1 }}
                />
                {formData.imageUrl && (
                  <img
                    src={resolveImage(formData.imageUrl)}
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
                    setError('');
                    setSuccess('');
                    // Temporarily show text as uploading
                    setFormData(prev => ({ ...prev, imageUrl: 'Uploading...' }));
                    const res = await api.post('/content/upload-image', uploadBody);
                    if (res && res.imageUrl) {
                      setFormData(prev => ({ ...prev, imageUrl: res.imageUrl }));
                      setSuccess('Image uploaded successfully.');
                    }
                  } catch (err) {
                    setError('Failed to upload image: ' + (err.message || err));
                    setFormData(prev => ({ ...prev, imageUrl: '' }));
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
              <label className="form-label">Main Description Paragraphs</label>
              <div style={styles.bulletInputRow}>
                <textarea
                  className="form-input"
                  style={{ flexGrow: 1, minHeight: '60px' }}
                  placeholder="Enter a paragraph..."
                  value={newParagraph}
                  onChange={(e) => setNewParagraph(e.target.value)}
                />
                <button type="button" className="btn btn-primary" onClick={handleAddParagraph} style={styles.addBtn}>
                  <FaPlus />
                </button>
              </div>
              <ul style={styles.bulletsList}>
                {formData.paragraphs.map((item, idx) => (
                  <li key={idx} style={styles.bulletItem}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newParagraphs = [...formData.paragraphs];
                        newParagraphs[idx] = e.target.value;
                        setFormData({ ...formData, paragraphs: newParagraphs });
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        outline: 'none',
                        width: '100%',
                        marginRight: '0.5rem',
                        fontSize: '0.9rem',
                        fontFamily: 'inherit'
                      }}
                    />
                    <button type="button" style={styles.deleteBtn} onClick={() => handleRemoveParagraph(idx)}>
                      <FaTimes />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="form-group">
              <label className="form-label">Financial Facilitation Extra Paragraph</label>
              <textarea
                className="form-input"
                style={{ minHeight: '80px', resize: 'vertical' }}
                name="facilitation_text"
                value={formData.facilitation_text}
                onChange={handleInputChange}
                placeholder="Recognizing the evolving needs of businesses and employees, we also offer financial facilitation services..."
              />
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Key Pillars (Bottom Highlights Row)</label>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  onClick={() => {
                    const updated = [...(formData.bottom_features || []), { icon: 'FaCheckCircle', text: 'New Pillar', color: '#285e9c' }];
                    setFormData({ ...formData, bottom_features: updated });
                  }}
                >
                  <FaPlus />
                  <span>Add Pillar</span>
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(formData.bottom_features || []).map((item, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr auto', gap: '0.5rem', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <select
                        className="form-input"
                        value={item.icon}
                        onChange={(e) => {
                          const updated = [...formData.bottom_features];
                          updated[idx].icon = e.target.value;
                          setFormData({ ...formData, bottom_features: updated });
                        }}
                      >
                        <option value="FaBuilding">FaBuilding (Structure)</option>
                        <option value="FaShieldAlt">FaShieldAlt (Compliance)</option>
                        <option value="FaHandshake">FaHandshake (Partnership)</option>
                        <option value="FaChartLine">FaChartLine (Growth)</option>
                        <option value="FaUserTie">FaUserTie (Staff)</option>
                        <option value="FaCheckCircle">FaCheckCircle (Check)</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <input
                        className="form-input"
                        type="text"
                        value={item.text}
                        onChange={(e) => {
                          const updated = [...formData.bottom_features];
                          updated[idx].text = e.target.value;
                          setFormData({ ...formData, bottom_features: updated });
                        }}
                        placeholder="Label text"
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <input
                        className="form-input"
                        type="text"
                        value={item.color}
                        onChange={(e) => {
                          const updated = [...formData.bottom_features];
                          updated[idx].color = e.target.value;
                          setFormData({ ...formData, bottom_features: updated });
                        }}
                        placeholder="Color e.g. #285e9c"
                      />
                    </div>
                    <button
                      type="button"
                      style={styles.deleteBtn}
                      onClick={() => {
                        const updated = formData.bottom_features.filter((_, i) => i !== idx);
                        setFormData({ ...formData, bottom_features: updated });
                      }}
                      title="Delete Pillar"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.cardFooter}>
              {sectionStatus.about.error && <span style={styles.cardError}>{sectionStatus.about.error}</span>}
              {sectionStatus.about.success && <span style={styles.cardSuccess}>Section saved!</span>}
              <button
                type="button"
                className="btn btn-primary"
                disabled={sectionStatus.about.loading}
                onClick={() => handleSaveSection('about')}
              >
                <FaSave />
                <span>{sectionStatus.about.loading ? 'Saving...' : 'Save General About Us'}</span>
              </button>
            </div>
          </div>

          {/* Vision mission card */}
          <div className="glass-card" style={styles.card}>
            <div style={styles.cardHeader}>
              <FaLightbulb style={styles.cardIcon} />
              <h3 style={styles.cardTitle}>Vision & Mission</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Vision Statement</label>
              <textarea
                className="form-input"
                style={{ minHeight: '80px', resize: 'vertical' }}
                name="vision"
                value={formData.vision}
                onChange={handleInputChange}
                placeholder="Vision statement"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Missions Points List</label>
              <div style={styles.bulletInputRow}>
                <input
                  className="form-input"
                  style={{ flexGrow: 1 }}
                  type="text"
                  placeholder="Add mission bullet..."
                  value={newMission}
                  onChange={(e) => setNewMission(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMission())}
                />
                <button type="button" className="btn btn-primary" onClick={handleAddMission} style={styles.addBtn}>
                  <FaPlus />
                </button>
              </div>
              <ul style={styles.bulletsList}>
                {formData.missions.map((item, idx) => (
                  <li key={idx} style={styles.bulletItem}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newMissions = [...formData.missions];
                        newMissions[idx] = e.target.value;
                        setFormData({ ...formData, missions: newMissions });
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        outline: 'none',
                        width: '100%',
                        marginRight: '0.5rem',
                        fontSize: '0.9rem',
                        fontFamily: 'inherit'
                      }}
                    />
                    <button type="button" style={styles.deleteBtn} onClick={() => handleRemoveMission(idx)}>
                      <FaTimes />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div style={styles.cardFooter}>
              {sectionStatus.visionmission.error && <span style={styles.cardError}>{sectionStatus.visionmission.error}</span>}
              {sectionStatus.visionmission.success && <span style={styles.cardSuccess}>Section saved!</span>}
              <button
                type="button"
                className="btn btn-primary"
                disabled={sectionStatus.visionmission.loading}
                onClick={() => handleSaveSection('visionmission')}
              >
                <FaSave />
                <span>{sectionStatus.visionmission.loading ? 'Saving...' : 'Save Vision & Mission'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Why Choose Us Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card" style={styles.card}>
            <div style={{ ...styles.cardHeader, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FaHeart style={styles.cardIcon} />
                <h3 style={styles.cardTitle}>Why Choose Us Features</h3>
              </div>
              <button type="button" className="btn btn-secondary" style={styles.addFeatureBtn} onClick={handleOpenAddFeature}>
                <FaPlus />
                <span>Add Card</span>
              </button>
            </div>

            {formData.features.length === 0 ? (
              <p style={styles.infoText}>No feature cards created yet. Click "Add Card".</p>
            ) : (
              <div style={styles.featuresList}>
                {formData.features.map((feat) => (
                  <div key={feat.id} style={{ ...styles.featItem, borderLeft: `5px solid ${feat.color || '#285e9c'}` }}>
                    <div style={styles.featText}>
                      <span style={styles.featTitle}>{feat.title}</span>
                      <span style={styles.featDesc}>{feat.description}</span>
                      <span style={styles.featMeta}>Icon: {feat.icon}</span>
                    </div>
                    <div style={styles.featActions}>
                      <button type="button" className="btn btn-secondary" style={styles.featActionBtn} onClick={() => handleOpenEditFeature(feat)} title="Edit Card">
                        <FaEdit />
                      </button>
                      <button type="button" className="btn btn-danger" style={styles.featActionBtn} onClick={() => handleDeleteFeature(feat.id)} title="Delete Card">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={styles.cardFooter}>
              {sectionStatus.features.error && <span style={styles.cardError}>{sectionStatus.features.error}</span>}
              {sectionStatus.features.success && <span style={styles.cardSuccess}>Section saved!</span>}
              <button
                type="button"
                className="btn btn-primary"
                disabled={sectionStatus.features.loading}
                onClick={() => handleSaveSection('features')}
              >
                <FaSave />
                <span>{sectionStatus.features.loading ? 'Saving...' : 'Save Features'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Feature Dialog Modal */}
      {showFeatureModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-card animate-fade-in" style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{editingFeature ? 'Edit Feature Card' : 'Add Feature Card'}</h3>
              <button type="button" style={styles.closeBtn} onClick={() => setShowFeatureModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveFeature} style={styles.modalForm}>
              <div className="form-group">
                <label className="form-label">Feature Title</label>
                <input
                  className="form-input"
                  type="text"
                  value={featureForm.title}
                  onChange={(e) => setFeatureForm({ ...featureForm, title: e.target.value })}
                  placeholder="e.g., Transparent practices"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Feature Description</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '60px', resize: 'vertical' }}
                  value={featureForm.description}
                  onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                  placeholder="Short explanatory text..."
                  required
                />
              </div>

              <div style={styles.modalGrid}>
                <div className="form-group">
                  <label className="form-label">React Icon Class</label>
                  <select
                    className="form-input"
                    value={featureForm.icon}
                    onChange={(e) => setFeatureForm({ ...featureForm, icon: e.target.value })}
                  >
                    <option value="FaBriefcase">FaBriefcase (Corporate)</option>
                    <option value="FaUserTie">FaUserTie (Staff / Recruitment)</option>
                    <option value="FaCheckCircle">FaCheckCircle (Compliance)</option>
                    <option value="FaRocket">FaRocket (Speed / Scale)</option>
                    <option value="FaHandshake">FaHandshake (Ethical / Partnerships)</option>
                    <option value="FaChartLine">FaChartLine (Value-added / Growth)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Theme Color Accent</label>
                  <input
                    className="form-input"
                    type="text"
                    value={featureForm.color}
                    onChange={(e) => setFeatureForm({ ...featureForm, color: e.target.value })}
                    placeholder="e.g., #285e9c"
                  />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowFeatureModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Card</button>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
    gap: '2rem',
  },
  card: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
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
    color: 'white',
  },
  bulletInputRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.75rem',
  },
  addBtn: {
    width: '38px',
    height: '46px',
    padding: '0',
    flexShrink: 0,
    borderRadius: '10px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
  },
  bulletsList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    maxHeight: '180px',
    overflowY: 'auto',
  },
  bulletItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0.75rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    fontSize: '0.85rem',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--danger)',
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
  },
  addFeatureBtn: {
    padding: '0.4rem 0.75rem',
    fontSize: '0.8rem',
    borderRadius: '8px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxHeight: '520px',
    overflowY: 'auto',
  },
  featItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--glass-border)',
    borderRadius: '10px',
  },
  featText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    flexGrow: 1,
    paddingRight: '1rem',
  },
  featTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'white',
  },
  featDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  featMeta: {
    fontSize: '0.75rem',
    color: 'var(--success)',
    fontFamily: 'monospace',
  },
  featActions: {
    display: 'flex',
    gap: '0.4rem',
  },
  featActionBtn: {
    padding: '0.4rem',
    fontSize: '0.8rem',
    borderRadius: '6px',
  },
  loading: {
    textAlign: 'center',
    padding: '4rem 0',
    color: 'var(--text-secondary)',
    fontSize: '1.1rem',
  },
  infoText: {
    color: 'var(--text-secondary)',
    textAlign: 'center',
    fontSize: '0.9rem',
    padding: '2rem 0',
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
    maxWidth: '520px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius)',
    padding: '2rem',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--glass-border)',
    paddingBottom: '1rem',
    marginBottom: '1.5rem',
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
    gap: '1rem',
  },
  modalGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    borderTop: '1px solid var(--glass-border)',
    paddingTop: '1.5rem',
    marginTop: '1.5rem',
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
