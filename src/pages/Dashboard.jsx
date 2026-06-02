import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import {
  FaEnvelopeOpenText,
  FaUserGraduate,
  FaBriefcase,
  FaUserTie,
  FaCalendarAlt,
} from 'react-icons/fa';

export default function Dashboard() {
  const [stats, setStats] = useState({
    enquiriesCount: 0,
    applicationsCount: 0,
    servicesCount: 0,
    jobsCount: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [enquiries, applications, services, careers] = await Promise.all([
          api.get('/enquiries'),
          api.get('/applications'),
          api.get('/services'),
          api.get('/careers'),
        ]);

        // Calculate jobs count
        let totalJobs = 0;
        careers.forEach(dept => {
          totalJobs += (dept.jobs || []).length;
        });

        setStats({
          enquiriesCount: enquiries.length,
          applicationsCount: applications.length,
          servicesCount: services.length,
          jobsCount: totalJobs,
        });

        setRecentEnquiries(enquiries.slice(0, 5));
        setRecentApplications(applications.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to retrieve dashboard metrics.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div style={styles.loadingContainer}>Loading dashboard statistics...</div>;
  }

  const statCards = [
    {
      title: 'Employees Enquiries',
      value: stats.enquiriesCount,
      icon: FaEnvelopeOpenText,
      color: '#3b82f6',
      link: '/enquiries',
    },
    {
      title: 'Job Applications',
      value: stats.applicationsCount,
      icon: FaUserGraduate,
      color: '#10b981',
      link: '/applications',
    },
    {
      title: 'Services Managed',
      value: stats.servicesCount,
      icon: FaBriefcase,
      color: '#8b5cf6',
      link: '/services',
    },
    {
      title: 'Active Job Roles',
      value: stats.jobsCount,
      icon: FaUserTie,
      color: '#ec4899',
      link: '/careers',
    },
  ];

  return (
    <div className="animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Overview of client requests, job applications, and website content.</p>
        </div>
        <div style={styles.dateBadge}>
          <FaCalendarAlt />
          <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {error && <div style={styles.errorAlert}>{error}</div>}

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link key={i} to={card.link} className="glass-card" style={styles.statCard}>
              <div style={styles.statCardContent}>
                <span style={styles.statTitle}>{card.title}</span>
                <span style={styles.statValue}>{card.value}</span>
              </div>
              <div style={{ ...styles.statIconContainer, backgroundColor: `${card.color}15`, color: card.color }}>
                <Icon style={styles.statIcon} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recents Section */}
      <div style={styles.recentsGrid}>
        {/* Recent Enquiries */}
        <div className="glass-card" style={styles.recentsCard}>
          <div style={styles.recentsHeader}>
            <h3 style={styles.recentsTitle}>Recent Employees Enquiries</h3>
            <Link to="/enquiries" className="btn btn-secondary" style={styles.viewAllBtn}>View All</Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <p style={styles.noDataText}>No employees enquiries submitted yet.</p>
          ) : (
            <div style={styles.listContainer}>
              {recentEnquiries.map((enq) => (
                <div key={enq.id} style={styles.listItem}>
                  <div style={styles.listItemText}>
                    <span style={styles.listItemTitle}>{enq.company_name}</span>
                    <span style={styles.listItemSub}>{enq.contact_person} • {enq.service_required}</span>
                  </div>
                  <span style={styles.listItemDate}>
                    {new Date(enq.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Job Applications */}
        <div className="glass-card" style={styles.recentsCard}>
          <div style={styles.recentsHeader}>
            <h3 style={styles.recentsTitle}>Recent Job Applications</h3>
            <Link to="/applications" className="btn btn-secondary" style={styles.viewAllBtn}>View All</Link>
          </div>
          {recentApplications.length === 0 ? (
            <p style={styles.noDataText}>No job applications submitted yet.</p>
          ) : (
            <div style={styles.listContainer}>
              {recentApplications.map((app) => (
                <div key={app.id} style={styles.listItem}>
                  <div style={styles.listItemText}>
                    <span style={styles.listItemTitle}>{app.full_name}</span>
                    <span style={styles.listItemSub}>{app.job_role} • {app.experience}</span>
                  </div>
                  <div style={styles.listItemRight}>
                    <span className={`badge badge-${app.status === 'Pending' ? 'pending' : app.status === 'Rejected' ? 'danger' : 'success'}`} style={{ marginRight: '0.75rem' }}>
                      {app.status}
                    </span>
                    <span style={styles.listItemDate}>
                      {new Date(app.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    fontSize: '1.1rem',
    color: 'var(--text-secondary)',
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
  dateBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--glass-border)',
    padding: '0.65rem 1.25rem',
    borderRadius: '12px',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  errorAlert: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    color: 'var(--danger)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    padding: '1rem',
    borderRadius: '12px',
    fontSize: '0.95rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
    gap: '1.5rem',
  },
  statCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.75rem',
    cursor: 'pointer',
  },
  statCardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  statTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-display)',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  },
  statValue: {
    fontSize: '2.25rem',
    fontWeight: '700',
    fontFamily: 'var(--font-display)',
    color: 'white',
  },
  statIconContainer: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    fontSize: '1.5rem',
  },
  recentsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
    gap: '2rem',
  },
  recentsCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    padding: '2rem',
  },
  recentsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentsTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
  },
  viewAllBtn: {
    padding: '0.4rem 1rem',
    fontSize: '0.85rem',
    borderRadius: '8px',
  },
  noDataText: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    textAlign: 'center',
    padding: '2rem 0',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.015)',
    border: '1px solid var(--glass-border)',
    borderRadius: '10px',
    transition: 'var(--transition-smooth)',
  },
  listItemText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  listItemTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'white',
  },
  listItemSub: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  listItemDate: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  listItemRight: {
    display: 'flex',
    alignItems: 'center',
  },
};
