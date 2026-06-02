import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FaSave, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function ContactCMS() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: '',
    branch_mumbai: '',
    branch_pune: '',
    facebook: '',
    twitter: '',
    instagram: '',
    map_iframe: '',
  });

  // Section saving states
  const [sectionStatus, setSectionStatus] = useState({
    contact: { loading: false, success: false, error: '' },
    social: { loading: false, success: false, error: '' },
  });

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    try {
      setLoading(true);
      const data = await api.get('/content/contact_details');
      setFormData({
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        branch_mumbai: data.branch_mumbai || '',
        branch_pune: data.branch_pune || '',
        facebook: data.facebook || '',
        twitter: data.twitter || '',
        instagram: data.instagram || '',
        map_iframe: data.map_iframe || '',
      });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch contact details.');
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

  const handleSaveSection = async (sectionName) => {
    setSectionStatus(prev => ({
      ...prev,
      [sectionName]: { loading: true, success: false, error: '' }
    }));
    try {
      const latestData = await api.get('/content/contact_details').catch(() => ({}));
      let updatedPayload = { ...latestData };

      if (sectionName === 'contact') {
        updatedPayload.phone = formData.phone;
        updatedPayload.email = formData.email;
        updatedPayload.address = formData.address;
        updatedPayload.branch_mumbai = formData.branch_mumbai;
        updatedPayload.branch_pune = formData.branch_pune;
        updatedPayload.map_iframe = formData.map_iframe;
      } else if (sectionName === 'social') {
        updatedPayload.facebook = formData.facebook;
        updatedPayload.twitter = formData.twitter;
        updatedPayload.instagram = formData.instagram;
      }

      await api.post('/content/contact_details', updatedPayload);
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
      await api.post('/content/contact_details', formData);
      setSuccess('Contact coordinates saved successfully!');
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to update contact details.');
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.phone) {
    return <div style={styles.loading}>Loading contact details...</div>;
  }

  return (
    <div className="animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Contact Details</h1>
          <p style={styles.subtitle}>Configure corporate contact phone numbers, emails, addresses, map embed frames, and social links.</p>
        </div>
      </div>

      {error && <div style={styles.errorAlert}>{error}</div>}
      {success && <div style={styles.successAlert}>{success}</div>}

      <div style={styles.grid}>
        {/* Contact info column */}
        <div className="glass-card" style={styles.card}>
          <div style={styles.cardHeader}>
            <FaPhoneAlt style={styles.cardIcon} />
            <h3 style={styles.cardTitle}>Primary Contact Information</h3>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div style={styles.inputWrapper}>
              <FaPhoneAlt style={styles.inputIcon} />
              <input
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+91 8208021948"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Support Email ID</label>
            <div style={styles.inputWrapper}>
              <FaEnvelope style={styles.inputIcon} />
              <input
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="info@samruddhihrservices.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Corporate Office Address (Nashik)</label>
            <div style={styles.inputWrapper}>
              <FaMapMarkerAlt style={styles.inputIcon} />
              <textarea
                className="form-input"
                style={{ paddingLeft: '2.5rem', minHeight: '80px', resize: 'vertical' }}
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Office No 714/715, Shri Kalika Plaza, Opp. Kalika Mandir, Mumbai Naka, Nashik - 422001"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Branch - Mumbai Address</label>
            <div style={styles.inputWrapper}>
              <FaMapMarkerAlt style={styles.inputIcon} />
              <textarea
                className="form-input"
                style={{ paddingLeft: '2.5rem', minHeight: '80px', resize: 'vertical' }}
                name="branch_mumbai"
                value={formData.branch_mumbai}
                onChange={handleInputChange}
                placeholder="Shop No 1. Jawaharban, CHSL, Sahyog Nagar, Four Bungalows, Andheri West Mumbai – 400052"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Branch - Pune Address</label>
            <div style={styles.inputWrapper}>
              <FaMapMarkerAlt style={styles.inputIcon} />
              <textarea
                className="form-input"
                style={{ paddingLeft: '2.5rem', minHeight: '80px', resize: 'vertical' }}
                name="branch_pune"
                value={formData.branch_pune}
                onChange={handleInputChange}
                placeholder="CMA Pride, 2nd Floor, Plot No.6, S.No- 16/6, Erandwane Co.Op Hsg Soc., Pune – 411004"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Google Maps embed URL (src attribute in iframe)</label>
            <textarea
              className="form-input"
              style={{ minHeight: '120px', resize: 'vertical' }}
              name="map_iframe"
              value={formData.map_iframe}
              onChange={handleInputChange}
              placeholder="https://google.com/maps/embed..."
            />
          </div>

          <div style={styles.cardFooter}>
            {sectionStatus.contact.error && <span style={styles.cardError}>{sectionStatus.contact.error}</span>}
            {sectionStatus.contact.success && <span style={styles.cardSuccess}>Section saved!</span>}
            <button
              type="button"
              className="btn btn-primary"
              disabled={sectionStatus.contact.loading}
              onClick={() => handleSaveSection('contact')}
            >
              <FaSave />
              <span>{sectionStatus.contact.loading ? 'Saving...' : 'Save Primary Contact'}</span>
            </button>
          </div>
        </div>

        {/* Social channels and submit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card" style={styles.card}>
            <div style={styles.cardHeader}>
              <FaGlobe style={styles.cardIcon} />
              <h3 style={styles.cardTitle}>Social Media Channels</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Facebook Profile Link</label>
              <div style={styles.inputWrapper}>
                <FaFacebook style={{ ...styles.inputIcon, color: '#1877F2' }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Twitter Link</label>
              <div style={styles.inputWrapper}>
                <FaTwitter style={{ ...styles.inputIcon, color: '#1DA1F2' }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Instagram Link</label>
              <div style={styles.inputWrapper}>
                <FaInstagram style={{ ...styles.inputIcon, color: '#E1306C' }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>

            <div style={styles.cardFooter}>
              {sectionStatus.social.error && <span style={styles.cardError}>{sectionStatus.social.error}</span>}
              {sectionStatus.social.success && <span style={styles.cardSuccess}>Section saved!</span>}
              <button
                type="button"
                className="btn btn-primary"
                disabled={sectionStatus.social.loading}
                onClick={() => handleSaveSection('social')}
              >
                <FaSave />
                <span>{sectionStatus.social.loading ? 'Saving...' : 'Save Social Links'}</span>
              </button>
            </div>
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
    gap: '2rem',
    alignItems: 'flex-start',
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
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    color: 'var(--text-secondary)',
  },
  submitBtn: {
    padding: '0.9rem',
    fontSize: '1rem',
  },
  loading: {
    textAlign: 'center',
    padding: '4rem 0',
    color: 'var(--text-secondary)',
    fontSize: '1.1rem',
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

