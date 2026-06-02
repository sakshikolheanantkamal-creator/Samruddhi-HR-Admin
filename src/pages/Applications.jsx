import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FaTrash, FaEye, FaSearch, FaTimes, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFileAlt, FaDownload, FaBriefcase } from 'react-icons/fa';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      setLoading(true);
      const data = await api.get('/applications');
      setApplications(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch job applications.');
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updatedApp = await api.patch(`/applications/${id}/status`, { status: newStatus });
      setApplications(applications.map(app => app.id === id ? updatedApp : app));
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp(updatedApp);
      }
    } catch (err) {
      alert(err.message || 'Failed to update application status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/applications/${id}`);
      setApplications(applications.filter(app => app.id !== id));
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp(null);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete application.');
    }
  };

  const filteredApps = applications.filter(app => {
    const searchString = `${app.full_name} ${app.email} ${app.job_role} ${app.location}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getResumeUrl = (path) => {
    if (!path) return '#';
    // path inside database is 'uploads/resumes/filename.pdf'
    // backend is running on port 5000, so we access it via http://localhost:5000/uploads/resumes/filename.pdf
    return `http://localhost:5000/${path}`;
  };

  return (
    <div className="animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Job Applications</h1>
          <p style={styles.subtitle}>Review applicant submissions, download resumes, and manage statuses.</p>
        </div>
      </div>

      {error && <div style={styles.errorAlert}>{error}</div>}

      <div style={styles.actionsBar}>
        <div style={styles.searchWrapper}>
          <FaSearch style={styles.searchIcon} />
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search applicants by name, role, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={styles.filtersWrapper}>
          <select
            style={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Interviewed">Interviewed</option>
            <option value="Hired">Hired</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button className="btn btn-secondary" onClick={fetchApplications}>Refresh</button>
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingContainer}>Loading job applications...</div>
      ) : filteredApps.length === 0 ? (
        <div className="glass-card" style={styles.noDataCard}>
          No job applications found matching your criteria.
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Preferred Role</th>
                <th>Experience</th>
                <th>Resume</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id}>
                  <td style={{ fontWeight: '600' }}>
                    <div>{app.full_name}</div>
                    <div style={styles.subtext}>{app.email} • {app.location}</div>
                  </td>
                  <td>{app.job_role}</td>
                  <td>{app.experience}</td>
                  <td>
                    {app.resume_path ? (
                      <a
                        href={getResumeUrl(app.resume_path)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={styles.downloadLinkBtn}
                        title="Download Resume"
                      >
                        <FaDownload />
                        <span>Resume</span>
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)' }}>No file</span>
                    )}
                  </td>
                  <td>
                    <select
                      style={styles.tableStatusSelect}
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className={`badge badge-${app.status === 'Pending' ? 'pending' : app.status === 'Rejected' ? 'danger' : 'success'}`}
                    >
                      <option value="Pending" style={{ background: '#111726', color: 'white' }}>Pending</option>
                      <option value="Reviewed" style={{ background: '#111726', color: 'white' }}>Reviewed</option>
                      <option value="Interviewed" style={{ background: '#111726', color: 'white' }}>Interviewed</option>
                      <option value="Hired" style={{ background: '#111726', color: 'white' }}>Hired</option>
                      <option value="Rejected" style={{ background: '#111726', color: 'white' }}>Rejected</option>
                    </select>
                  </td>
                  <td>{new Date(app.created_at).toLocaleDateString()}</td>
                  <td>
                    <div style={styles.actionsCell}>
                      <button
                        className="btn btn-secondary"
                        style={styles.actionBtn}
                        onClick={() => setSelectedApp(app)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn btn-danger"
                        style={styles.actionBtn}
                        onClick={() => handleDelete(app.id)}
                        title="Delete Application"
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
      {selectedApp && (
        <div style={styles.modalOverlay} onClick={() => setSelectedApp(null)}>
          <div className="glass-card animate-fade-in" style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Application Detail</h3>
              <button style={styles.closeBtn} onClick={() => setSelectedApp(null)}>
                <FaTimes />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.infoSection}>
                <div style={styles.infoRow}>
                  <FaUser style={styles.infoIcon} />
                  <div>
                    <div style={styles.infoLabel}>Full Name</div>
                    <div style={styles.infoValue}>{selectedApp.full_name}</div>
                  </div>
                </div>

                <div style={styles.infoRow}>
                  <FaBriefcase style={styles.infoIcon} />
                  <div>
                    <div style={styles.infoLabel}>Preferred Role</div>
                    <div style={styles.infoValue}>{selectedApp.job_role}</div>
                  </div>
                </div>

                <div style={styles.infoRow}>
                  <FaPhone style={styles.infoIcon} />
                  <div>
                    <div style={styles.infoLabel}>Mobile Number</div>
                    <div style={styles.infoValue}>{selectedApp.mobile}</div>
                  </div>
                </div>

                <div style={styles.infoRow}>
                  <FaEnvelope style={styles.infoIcon} />
                  <div>
                    <div style={styles.infoLabel}>Email Address</div>
                    <div style={styles.infoValue}>{selectedApp.email}</div>
                  </div>
                </div>

                <div style={styles.infoRow}>
                  <FaMapMarkerAlt style={styles.infoIcon} />
                  <div>
                    <div style={styles.infoLabel}>Current Location</div>
                    <div style={styles.infoValue}>{selectedApp.location || 'N/A'}</div>
                  </div>
                </div>

                <div style={styles.infoRow}>
                  <FaUser style={styles.infoIcon} />
                  <div>
                    <div style={styles.infoLabel}>Experience Level</div>
                    <div style={styles.infoValue}>{selectedApp.experience}</div>
                  </div>
                </div>
              </div>

              <div style={styles.detailsDivider}></div>

              <div style={styles.messageSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={styles.msgTitle}>Applicant Message / Cover Details</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={styles.infoLabel}>Status:</span>
                    <select
                      style={styles.modalStatusSelect}
                      value={selectedApp.status}
                      onChange={(e) => handleStatusChange(selectedApp.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Interviewed">Interviewed</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div style={styles.detailsBox}>
                  <FaFileAlt style={styles.detailsBoxIcon} />
                  <p style={styles.detailsBoxText}>
                    {selectedApp.message || 'No additional message was provided by the applicant.'}
                  </p>
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setSelectedApp(null)}>Close</button>
              {selectedApp.resume_path && (
                <a
                  href={getResumeUrl(selectedApp.resume_path)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={styles.footerDownloadBtn}
                >
                  <FaDownload />
                  <span>Download Resume PDF</span>
                </a>
              )}
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
    maxWidth: '450px',
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
  filtersWrapper: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  filterSelect: {
    padding: '0.75rem 1rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--glass-border)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '0.95rem',
    outline: 'none',
    cursor: 'pointer',
  },
  tableStatusSelect: {
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    color: 'inherit',
    fontFamily: 'var(--font-sans)',
  },
  modalStatusSelect: {
    padding: '0.4rem 0.75rem',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '0.85rem',
    outline: 'none',
    cursor: 'pointer',
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
  downloadLinkBtn: {
    padding: '0.4rem 0.8rem',
    fontSize: '0.8rem',
    borderRadius: '8px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  footerDownloadBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
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
  messageSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  msgTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'white',
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
