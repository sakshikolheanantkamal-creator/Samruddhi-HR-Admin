import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FaTrash, FaEye, FaSearch, FaTimes, FaBuilding, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFileAlt } from 'react-icons/fa';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  async function fetchEnquiries() {
    try {
      setLoading(true);
      const data = await api.get('/enquiries');
      setEnquiries(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch enquiries.');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/enquiries/${id}`);
      setEnquiries(enquiries.filter(e => e.id !== id));
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(null);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete enquiry.');
    }
  };

  const filteredEnquiries = enquiries.filter(enq => {
    const searchString = `${enq.company_name} ${enq.contact_person} ${enq.email} ${enq.service_required}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Employees Enquiries</h1>
          <p style={styles.subtitle}>Manage and respond to employer service enquiries.</p>
        </div>
      </div>

      {error && <div style={styles.errorAlert}>{error}</div>}

      <div style={styles.actionsBar}>
        <div style={styles.searchWrapper}>
          <FaSearch style={styles.searchIcon} />
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search enquiries by company, person, service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary" onClick={fetchEnquiries}>Refresh</button>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>Loading enquiries...</div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="glass-card" style={styles.noDataCard}>
          No enquiries found matching your search.
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Contact</th>
                <th>Service Required</th>
                <th>Location</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.map((enq) => (
                <tr key={enq.id}>
                  <td style={{ fontWeight: '600' }}>{enq.company_name}</td>
                  <td>
                    <div>{enq.contact_person}</div>
                    <div style={styles.subtext}>{enq.email}</div>
                  </td>
                  <td>{enq.service_required}</td>
                  <td>{enq.location || 'N/A'}</td>
                  <td>{new Date(enq.created_at).toLocaleDateString()}</td>
                  <td>
                    <div style={styles.actionsCell}>
                      <button
                        className="btn btn-secondary"
                        style={styles.actionBtn}
                        onClick={() => setSelectedEnquiry(enq)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn btn-danger"
                        style={styles.actionBtn}
                        onClick={() => handleDelete(enq.id)}
                        title="Delete Enquiry"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div style={styles.modalOverlay} onClick={() => setSelectedEnquiry(null)}>
          <div className="glass-card animate-fade-in" style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Enquiry Detail</h3>
              <button style={styles.closeBtn} onClick={() => setSelectedEnquiry(null)}>
                <FaTimes />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.infoSection}>
                <div style={styles.infoRow}>
                  <FaBuilding style={styles.infoIcon} />
                  <div>
                    <div style={styles.infoLabel}>Company Name</div>
                    <div style={styles.infoValue}>{selectedEnquiry.company_name}</div>
                  </div>
                </div>

                <div style={styles.infoRow}>
                  <FaUser style={styles.infoIcon} />
                  <div>
                    <div style={styles.infoLabel}>Contact Person</div>
                    <div style={styles.infoValue}>{selectedEnquiry.contact_person}</div>
                  </div>
                </div>

                <div style={styles.infoRow}>
                  <FaPhone style={styles.infoIcon} />
                  <div>
                    <div style={styles.infoLabel}>Mobile Number</div>
                    <div style={styles.infoValue}>{selectedEnquiry.mobile}</div>
                  </div>
                </div>

                <div style={styles.infoRow}>
                  <FaEnvelope style={styles.infoIcon} />
                  <div>
                    <div style={styles.infoLabel}>Email Address</div>
                    <div style={styles.infoValue}>{selectedEnquiry.email}</div>
                  </div>
                </div>

                <div style={styles.infoRow}>
                  <FaMapMarkerAlt style={styles.infoIcon} />
                  <div>
                    <div style={styles.infoLabel}>Location</div>
                    <div style={styles.infoValue}>{selectedEnquiry.location || 'N/A'}</div>
                  </div>
                </div>
              </div>

              <div style={styles.detailsDivider}></div>

              <div style={styles.requirementSection}>
                <h4 style={styles.reqTitle}>Requirements</h4>
                <div style={styles.reqGrid}>
                  <div>
                    <span style={styles.infoLabel}>Service Required</span>
                    <p style={styles.reqValue}>{selectedEnquiry.service_required}</p>
                  </div>
                  <div>
                    <span style={styles.infoLabel}>Industry Type</span>
                    <p style={styles.reqValue}>{selectedEnquiry.industry_type || 'N/A'}</p>
                  </div>
                  <div>
                    <span style={styles.infoLabel}>Manpower Type</span>
                    <p style={styles.reqValue}>{selectedEnquiry.manpower_type || 'N/A'}</p>
                  </div>
                  <div>
                    <span style={styles.infoLabel}>Manpower Needed</span>
                    <p style={styles.reqValue}>{selectedEnquiry.manpower_number || 'N/A'}</p>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <span style={styles.infoLabel}>Requirement Details</span>
                  <div style={styles.detailsBox}>
                    <FaFileAlt style={styles.detailsBoxIcon} />
                    <p style={styles.detailsBoxText}>{selectedEnquiry.requirement_details}</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setSelectedEnquiry(null)}>Close</button>
              <a href={`mailto:${selectedEnquiry.email}`} className="btn btn-primary">Send Email Response</a>
            </div>
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
  actionsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  searchWrapper: {
    position: 'relative',
    flexGrow: 1,
    maxWidth: '500px',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    color: 'var(--text-secondary)',
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.75rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--glass-border)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.95rem',
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
  subtext: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginTop: '0.1rem',
  },
  actionsCell: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionBtn: {
    padding: '0.5rem',
    fontSize: '0.9rem',
    borderRadius: '8px',
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
    maxWidth: '680px',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--border-radius)',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh',
    overflowY: 'auto',
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
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    flexGrow: 1,
  },
  infoSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.25rem',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
  },
  infoIcon: {
    color: 'var(--accent)',
    marginTop: '0.25rem',
    fontSize: '1rem',
  },
  infoLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    marginBottom: '0.15rem',
  },
  infoValue: {
    fontSize: '0.95rem',
    fontWeight: '500',
    color: 'white',
  },
  detailsDivider: {
    height: '1px',
    backgroundColor: 'var(--glass-border)',
  },
  requirementSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  reqTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: 'white',
  },
  reqGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '1rem',
  },
  reqValue: {
    fontSize: '0.95rem',
    fontWeight: '500',
    color: 'white',
    marginTop: '0.15rem',
  },
  detailsBox: {
    display: 'flex',
    gap: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.015)',
    border: '1px solid var(--glass-border)',
    padding: '1.25rem',
    borderRadius: '10px',
    marginTop: '0.5rem',
  },
  detailsBoxIcon: {
    color: 'var(--text-secondary)',
    marginTop: '0.25rem',
    flexShrink: 0,
  },
  detailsBoxText: {
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    borderTop: '1px solid var(--glass-border)',
    paddingTop: '1.5rem',
    marginTop: '1.5rem',
  },
};
