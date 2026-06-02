import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FaTrash, FaEye, FaSearch, FaTimes } from 'react-icons/fa';

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    try {
      setLoading(true);
      const data = await api.get('/contact-submissions');
      setSubmissions(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch contact enquiry.');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact submission? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/contact-submissions/${id}`);
      setSubmissions(submissions.filter((submission) => submission.id !== id));
      if (selectedSubmission && selectedSubmission.id === id) {
        setSelectedSubmission(null);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete contact submission.');
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const searchString = `${submission.name} ${submission.email} ${submission.phone} ${submission.message}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <div className="animate-fade-in" style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Contact Enquiry</h1>
            <p style={styles.subtitle}>View leads submitted via the Contact Us page.</p>
          </div>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <div style={styles.actionsBar}>
          <div style={styles.searchWrapper}>
            <FaSearch style={styles.searchIcon} />
            <input
              style={styles.searchInput}
              type="text"
              placeholder="Search submissions by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary" onClick={fetchSubmissions}>Refresh</button>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>Loading contact enquiry...</div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="glass-card" style={styles.noDataCard}>
            No contact enquiry found matching your search.
          </div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>{submission.name}</td>
                    <td>{submission.email}</td>
                    <td>{submission.phone}</td>
                    <td>{submission.message?.slice(0, 70) || ''}{submission.message?.length > 70 ? '...' : ''}</td>
                    <td>{new Date(submission.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style={styles.actionsCell}>
                        <button
                          className="btn btn-secondary"
                          style={styles.actionBtn}
                          onClick={() => setSelectedSubmission(submission)}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-danger"
                          style={styles.actionBtn}
                          onClick={() => handleDelete(submission.id)}
                          title="Delete Submission"
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
      </div>

      {/* Modal rendered outside main container for proper centering */}
      {selectedSubmission && (
        <div style={styles.modalOverlay} onClick={() => setSelectedSubmission(null)}>
          <div className="glass-card animate-fade-in" style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Submission Details</h3>
              <button style={styles.closeBtn} onClick={() => setSelectedSubmission(null)}>
                <FaTimes />
              </button>
            </div>
            <div style={styles.modalBody}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  className="form-input"
                  type="text"
                  value={selectedSubmission.name}
                  readOnly
                  style={{ cursor: 'default' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="text"
                  value={selectedSubmission.email}
                  readOnly
                  style={{ cursor: 'default' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  className="form-input"
                  type="text"
                  value={selectedSubmission.phone}
                  readOnly
                  style={{ cursor: 'default' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-input"
                  rows={4}
                  value={selectedSubmission.message || 'No message provided.'}
                  readOnly
                  style={{ cursor: 'default', resize: 'none' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Submitted</label>
                <input
                  className="form-input"
                  type="text"
                  value={new Date(selectedSubmission.created_at).toLocaleString()}
                  readOnly
                  style={{ cursor: 'default' }}
                />
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setSelectedSubmission(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
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
    padding: '0.85rem 1rem 0.85rem 3rem',
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: 'white',
  },
  loadingContainer: {
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--text-secondary)',
  },
  noDataCard: {
    padding: '2rem',
    borderRadius: '1rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  errorAlert: {
    padding: '1rem 1.5rem',
    borderRadius: '1rem',
    backgroundColor: '#571c27',
    color: '#ffe4e6',
  },
  actionsCell: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionBtn: {
    minWidth: '38px',
    height: '38px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '1.5rem',
    overflow: 'auto',
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
    margin: 'auto',
    position: 'relative',
    zIndex: 10000,
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
