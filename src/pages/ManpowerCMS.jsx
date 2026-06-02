import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FaSave, FaPlus, FaTimes, FaUsers, FaTrash, FaEdit } from 'react-icons/fa';

export default function ManpowerCMS() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cards, setCards] = useState([]);

  // Editor Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardForm, setCardForm] = useState({
    id: '',
    title: '',
    description: '',
    icon: 'FaUsers',
    color: '#285e9c',
    features: [],
  });

  // Feature item temp input
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    try {
      setLoading(true);
      const data = await api.get('/content/manpower_services');
      setCards(data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch manpower services content.');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setEditingCard(null);
    setCardForm({
      id: Date.now(),
      title: '',
      description: '',
      icon: 'FaUsers',
      color: '#285e9c',
      features: [],
    });
    setNewFeature('');
    setShowModal(true);
  };

  const handleOpenEdit = (card) => {
    setEditingCard(card);
    setCardForm({
      id: card.id,
      title: card.title,
      description: card.description || '',
      icon: card.icon || 'FaUsers',
      color: card.color || '#285e9c',
      features: card.features || [],
    });
    setNewFeature('');
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setCardForm({
      ...cardForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setCardForm({
      ...cardForm,
      features: [...cardForm.features, newFeature.trim()],
    });
    setNewFeature('');
  };

  const handleRemoveFeature = (index) => {
    setCardForm({
      ...cardForm,
      features: cardForm.features.filter((_, idx) => idx !== index),
    });
  };

  const handleSaveCard = (e) => {
    e.preventDefault();
    if (!cardForm.title) return;

    let updatedCards;
    if (editingCard) {
      updatedCards = cards.map(c => c.id === cardForm.id ? cardForm : c);
    } else {
      updatedCards = [...cards, cardForm];
    }

    setCards(updatedCards);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this manpower service offering?')) return;
    setCards(cards.filter(c => c.id !== id));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/content/manpower_services', cards);
      setSuccess('Manpower services configured and saved successfully.');
    } catch (err) {
      setError(err.message || 'Failed to save manpower services.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Manpower Services</h1>
            <p style={styles.subtitle}>Configure cards, lists of features, and styles shown in the Manpower Services directory.</p>
          </div>
          <div style={styles.headerActions}>
            <button className="btn btn-secondary" onClick={handleOpenAdd}>
              <FaPlus />
              <span>Add Card</span>
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              <FaSave />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}
        {success && <div style={styles.successAlert}>{success}</div>}

        {loading && cards.length === 0 ? (
          <div style={styles.loading}>Loading manpower list...</div>
        ) : cards.length === 0 ? (
          <div className="glass-card" style={styles.noDataCard}>
            No services cards configured yet. Click "Add Card".
          </div>
        ) : (
          <div style={styles.servicesGrid}>
            {cards.map((card) => (
              <div key={card.id} className="glass-card" style={{ ...styles.card, borderLeft: `6px solid ${card.color || '#285e9c'}` }}>
                <div style={styles.cardTop}>
                  <div>
                    <h3 style={styles.cardTitle}>{card.title}</h3>
                    <span style={styles.cardIconTag}>Icon: {card.icon}</span>
                  </div>
                  <div style={styles.cardHeaderActions}>
                    <button className="btn btn-secondary" style={styles.miniBtn} onClick={() => handleOpenEdit(card)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-danger" style={styles.miniBtn} onClick={() => handleDelete(card.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <p style={styles.cardDesc}>{card.description}</p>
                
                <div style={styles.featuresSection}>
                  <span style={styles.featuresLabel}>Bullet Points:</span>
                  {card.features.length === 0 ? (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No bullets defined.</span>
                  ) : (
                    <ul style={styles.featuresList}>
                      {card.features.map((feat, idx) => (
                        <li key={idx} style={styles.featuresItem}>{feat}</li>
                      ))}
                    </ul>
                  )}
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
              <h3 style={styles.modalTitle}>{editingCard ? 'Edit Manpower Card' : 'Add Manpower Card'}</h3>
              <button style={styles.closeBtn} onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveCard} style={styles.modalForm}>
              <div style={styles.modalBody}>
                <div className="form-group">
                  <label className="form-label">Service Card Title</label>
                  <input
                    className="form-input"
                    type="text"
                    name="title"
                    value={cardForm.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Factory Manpower"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Service Description</label>
                  <textarea
                    className="form-input"
                    style={{ minHeight: '60px', resize: 'vertical' }}
                    name="description"
                    value={cardForm.description}
                    onChange={handleInputChange}
                    placeholder="Provide description..."
                    required
                  />
                </div>

                <div style={styles.modalGrid}>
                  <div className="form-group">
                    <label className="form-label">React Icon Class</label>
                    <select
                      className="form-input"
                      name="icon"
                      value={cardForm.icon}
                      onChange={handleInputChange}
                    >
                      <option value="FaUsers">FaUsers (Temporary Staff)</option>
                      <option value="FaUserTie">FaUserTie (Recruitment / Execs)</option>
                      <option value="FaUsersCog">FaUsersCog (Bulk Hiring)</option>
                      <option value="FaFileInvoiceDollar">FaFileInvoiceDollar (Payroll)</option>
                      <option value="FaHome">FaHome (Home Loans)</option>
                      <option value="FaBriefcase">FaBriefcase (Business Loans)</option>
                      <option value="FaUniversity">FaUniversity (CASA Banking)</option>
                      <option value="FaHandshake">FaHandshake (Consulting)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Color Code</label>
                    <input
                      className="form-input"
                      type="text"
                      name="color"
                      value={cardForm.color}
                      onChange={handleInputChange}
                      placeholder="#285e9c"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Highlight Bullet Features</label>
                  <div style={styles.bulletInputRow}>
                    <input
                      className="form-input"
                      style={{ flexGrow: 1 }}
                      type="text"
                      placeholder="Add highlight point..."
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                    />
                    <button type="button" className="btn btn-primary" onClick={handleAddFeature} style={styles.addBtn}>
                      <FaPlus />
                    </button>
                  </div>
                  <ul style={styles.bulletsList}>
                    {cardForm.features.map((feat, idx) => (
                      <li key={idx} style={styles.bulletItem}>
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => {
                            const updated = [...cardForm.features];
                            updated[idx] = e.target.value;
                            setCardForm({ ...cardForm, features: updated });
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            outline: 'none',
                            width: '100%',
                            marginRight: '0.5rem',
                            fontSize: '0.85rem',
                            fontFamily: 'inherit'
                          }}
                        />
                        <button type="button" style={styles.deleteBtn} onClick={() => handleRemoveFeature(idx)}>
                          <FaTimes />
                        </button>
                      </li>
                    ))}
                  </ul>
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
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
    gap: '1.5rem',
  },
  card: {
    padding: '1.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid var(--glass-border)',
    paddingBottom: '0.75rem',
  },
  cardTitle: {
    fontSize: '1.2rem',
    color: 'white',
    fontWeight: '600',
  },
  cardIconTag: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  cardHeaderActions: {
    display: 'flex',
    gap: '0.4rem',
  },
  miniBtn: {
    padding: '0.4rem',
    fontSize: '0.8rem',
    borderRadius: '6px',
  },
  cardDesc: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
  },
  featuresSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  featuresLabel: {
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    color: 'white',
    letterSpacing: '0.02em',
  },
  featuresList: {
    listStyleType: 'disc',
    paddingLeft: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  featuresItem: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
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
    maxWidth: '560px',
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
  modalGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  bulletInputRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  addBtn: {
    width: '38px',
    height: '38px',
    padding: '0',
    flexShrink: 0,
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulletsList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    maxHeight: '130px',
    overflowY: 'auto',
  },
  bulletItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.4rem 0.65rem',
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
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
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
