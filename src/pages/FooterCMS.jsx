import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  FaSave,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaCopyright,
  FaHeading,
  FaLaptopCode,
  FaArrowUp,
  FaArrowDown,
  FaTrash,
  FaPlus,
  FaLink
} from 'react-icons/fa';

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

export default function FooterCMS() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Forms state
  const [footerData, setFooterData] = useState({
    logo_image: '',
    logo_title: '',
    logo_subtitle: '',
    company_header: '',
    services_header: '',
    contact_header: '',
    newsletter_header: '',
    newsletter_placeholder: '',
    newsletter_button_text: '',
    description: '',
    copyright: ''
  });

  const [contactData, setContactData] = useState({
    phone: '',
    email: '',
    address: '',
    facebook: '',
    twitter: '',
    instagram: '',
  });

  // Links List States
  const [companyLinks, setCompanyLinks] = useState([]);
  const [servicesLinks, setServicesLinks] = useState([]);

  // Add Item Input States
  const [newCompanyLinkName, setNewCompanyLinkName] = useState('');
  const [newCompanyLinkPath, setNewCompanyLinkPath] = useState('');
  const [newServicesLinkName, setNewServicesLinkName] = useState('');
  const [newServicesLinkPath, setNewServicesLinkPath] = useState('');

  // Progress and save states
  const [logoUploadProgress, setLogoUploadProgress] = useState('');
  const [brandStatus, setBrandStatus] = useState({ loading: false, success: false, error: '' });
  const [headersStatus, setHeadersStatus] = useState({ loading: false, success: false, error: '' });
  const [contactStatus, setContactStatus] = useState({ loading: false, success: false, error: '' });
  const [companyLinksStatus, setCompanyLinksStatus] = useState({ loading: false, success: false, error: '' });
  const [servicesLinksStatus, setServicesLinksStatus] = useState({ loading: false, success: false, error: '' });

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    try {
      setLoading(true);
      setError('');
      
      // Fetch footer specific content
      const footerRes = await api.get('/content/footer_content').catch(() => ({}));
      if (footerRes) {
        setFooterData({
          logo_image: footerRes.logo_image || '',
          logo_title: footerRes.logo_title || '',
          logo_subtitle: footerRes.logo_subtitle || '',
          company_header: footerRes.company_header || '',
          services_header: footerRes.services_header || '',
          contact_header: footerRes.contact_header || '',
          newsletter_header: footerRes.newsletter_header || '',
          newsletter_placeholder: footerRes.newsletter_placeholder || '',
          newsletter_button_text: footerRes.newsletter_button_text || '',
          description: footerRes.description || '',
          copyright: footerRes.copyright || '',
        });
        setCompanyLinks(footerRes.company_links || []);
        setServicesLinks(footerRes.services_links || []);
      }

      // Fetch contact details (phone, email, socials)
      const contactRes = await api.get('/content/contact_details').catch(() => ({}));
      if (contactRes) {
        setContactData({
          phone: contactRes.phone || '',
          email: contactRes.email || '',
          address: contactRes.address || '',
          facebook: contactRes.facebook || '',
          twitter: contactRes.twitter || '',
          instagram: contactRes.instagram || '',
        });
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch footer configuration.');
    } finally {
      setLoading(false);
    }
  }

  const handleFooterChange = (e) => {
    setFooterData({
      ...footerData,
      [e.target.name]: e.target.value
    });
  };

  const handleContactChange = (e) => {
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value
    });
  };

  const saveBrandSection = async (e) => {
    e.preventDefault();
    setBrandStatus({ loading: true, success: false, error: '' });
    try {
      const latestFooter = await api.get('/content/footer_content').catch(() => ({}));
      const updatedFooter = {
        ...latestFooter,
        logo_image: footerData.logo_image,
        logo_title: footerData.logo_title,
        logo_subtitle: footerData.logo_subtitle,
        description: footerData.description
      };
      await api.post('/content/footer_content', updatedFooter);
      setBrandStatus({ loading: false, success: true, error: '' });
      setTimeout(() => {
        setBrandStatus(prev => ({ ...prev, success: false }));
      }, 3000);
    } catch (err) {
      setBrandStatus({ loading: false, success: false, error: err.message || 'Failed to save.' });
    }
  };

  const saveHeadersSection = async (e) => {
    e.preventDefault();
    setHeadersStatus({ loading: true, success: false, error: '' });
    try {
      const latestFooter = await api.get('/content/footer_content').catch(() => ({}));
      const updatedFooter = {
        ...latestFooter,
        company_header: footerData.company_header,
        services_header: footerData.services_header,
        contact_header: footerData.contact_header,
        newsletter_header: footerData.newsletter_header,
        newsletter_placeholder: footerData.newsletter_placeholder,
        newsletter_button_text: footerData.newsletter_button_text,
        copyright: footerData.copyright
      };
      await api.post('/content/footer_content', updatedFooter);
      setHeadersStatus({ loading: false, success: true, error: '' });
      setTimeout(() => {
        setHeadersStatus(prev => ({ ...prev, success: false }));
      }, 3000);
    } catch (err) {
      setHeadersStatus({ loading: false, success: false, error: err.message || 'Failed to save.' });
    }
  };

  const saveContactSection = async (e) => {
    e.preventDefault();
    setContactStatus({ loading: true, success: false, error: '' });
    try {
      const currentContact = await api.get('/content/contact_details').catch(() => ({}));
      const updatedContact = {
        ...currentContact,
        phone: contactData.phone,
        email: contactData.email,
        address: contactData.address,
        facebook: contactData.facebook,
        twitter: contactData.twitter,
        instagram: contactData.instagram
      };
      await api.post('/content/contact_details', updatedContact);
      setContactStatus({ loading: false, success: true, error: '' });
      setTimeout(() => {
        setContactStatus(prev => ({ ...prev, success: false }));
      }, 3000);
    } catch (err) {
      setContactStatus({ loading: false, success: false, error: err.message || 'Failed to save.' });
    }
  };

  // Company links handlers
  const handleAddCompanyLink = (e) => {
    e.preventDefault();
    if (!newCompanyLinkName || !newCompanyLinkPath) return;
    setCompanyLinks([...companyLinks, { name: newCompanyLinkName, path: newCompanyLinkPath }]);
    setNewCompanyLinkName('');
    setNewCompanyLinkPath('');
  };

  const handleDeleteCompanyLink = (index) => {
    setCompanyLinks(companyLinks.filter((_, idx) => idx !== index));
  };

  const moveCompanyLink = (index, direction) => {
    const updated = [...companyLinks];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= companyLinks.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setCompanyLinks(updated);
  };

  const saveCompanyLinksSection = async () => {
    setCompanyLinksStatus({ loading: true, success: false, error: '' });
    try {
      let finalLinks = [...companyLinks];
      if (newCompanyLinkName && newCompanyLinkPath) {
        finalLinks.push({ name: newCompanyLinkName, path: newCompanyLinkPath });
        setCompanyLinks(finalLinks);
        setNewCompanyLinkName('');
        setNewCompanyLinkPath('');
      }
      const latestFooter = await api.get('/content/footer_content').catch(() => ({}));
      const updatedFooter = {
        ...latestFooter,
        company_links: finalLinks
      };
      await api.post('/content/footer_content', updatedFooter);
      setCompanyLinksStatus({ loading: false, success: true, error: '' });
      setTimeout(() => {
        setCompanyLinksStatus(prev => ({ ...prev, success: false }));
      }, 3000);
    } catch (err) {
      setCompanyLinksStatus({ loading: false, success: false, error: err.message || 'Failed to save.' });
    }
  };

  // Services links handlers
  const handleAddServicesLink = (e) => {
    e.preventDefault();
    if (!newServicesLinkName || !newServicesLinkPath) return;
    setServicesLinks([...servicesLinks, { name: newServicesLinkName, path: newServicesLinkPath }]);
    setNewServicesLinkName('');
    setNewServicesLinkPath('');
  };

  const handleDeleteServicesLink = (index) => {
    setServicesLinks(servicesLinks.filter((_, idx) => idx !== index));
  };

  const moveServicesLink = (index, direction) => {
    const updated = [...servicesLinks];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= servicesLinks.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setServicesLinks(updated);
  };

  const saveServicesLinksSection = async () => {
    setServicesLinksStatus({ loading: true, success: false, error: '' });
    try {
      let finalLinks = [...servicesLinks];
      if (newServicesLinkName && newServicesLinkPath) {
        finalLinks.push({ name: newServicesLinkName, path: newServicesLinkPath });
        setServicesLinks(finalLinks);
        setNewServicesLinkName('');
        setNewServicesLinkPath('');
      }
      const latestFooter = await api.get('/content/footer_content').catch(() => ({}));
      const updatedFooter = {
        ...latestFooter,
        services_links: finalLinks
      };
      await api.post('/content/footer_content', updatedFooter);
      setServicesLinksStatus({ loading: false, success: true, error: '' });
      setTimeout(() => {
        setServicesLinksStatus(prev => ({ ...prev, success: false }));
      }, 3000);
    } catch (err) {
      setServicesLinksStatus({ loading: false, success: false, error: err.message || 'Failed to save.' });
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadBody = new FormData();
    uploadBody.append('image', file);
    try {
      setLogoUploadProgress('Uploading logo...');
      const res = await api.post('/content/upload-image', uploadBody);
      if (res && res.imageUrl) {
        setFooterData(prev => ({ ...prev, logo_image: res.imageUrl }));
        setLogoUploadProgress('Upload complete!');
        setTimeout(() => setLogoUploadProgress(''), 3000);
      }
    } catch (err) {
      alert('Logo upload failed: ' + (err.message || err));
      setLogoUploadProgress('');
    }
  };

  if (loading && !footerData.description) {
    return <div style={styles.loading}>Loading footer configuration...</div>;
  }

  return (
    <div className="animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Footer</h1>
          <p style={styles.subtitle}>Configure all footer settings dynamically: brand logo, column headers, newsletter, quick links, contact, and copyright details.</p>
        </div>
      </div>

      {error && <div style={styles.errorAlert}>{error}</div>}

      <div style={styles.grid}>
        {/* Card 1: Logo & Brand Identity */}
        <div className="glass-card" style={styles.card}>
          <div style={styles.cardHeader}>
            <FaLaptopCode style={styles.cardIcon} />
            <h3 style={styles.cardTitle}>Logo & Brand Identity</h3>
          </div>

          <form onSubmit={saveBrandSection} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Logo Image Preview / Upload</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                <input
                  className="form-input"
                  type="text"
                  name="logo_image"
                  value={footerData.logo_image}
                  onChange={handleFooterChange}
                  placeholder="/logo/logo.png"
                  style={{ flexGrow: 1 }}
                />
                {footerData.logo_image && (
                  <img
                    src={resolveImage(footerData.logo_image)}
                    alt="Footer Logo Preview"
                    style={styles.logoPreview}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&h=80&fit=crop'; }}
                  />
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                />
                {logoUploadProgress && <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>{logoUploadProgress}</span>}
              </div>
            </div>

            <div style={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Logo Title (Primary)</label>
                <input
                  className="form-input"
                  type="text"
                  name="logo_title"
                  value={footerData.logo_title}
                  onChange={handleFooterChange}
                  placeholder="Samruddhi"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Logo Subtitle (Secondary)</label>
                <input
                  className="form-input"
                  type="text"
                  name="logo_subtitle"
                  value={footerData.logo_subtitle}
                  onChange={handleFooterChange}
                  placeholder="HR Services"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Brand Description (under logo)</label>
              <textarea
                className="form-input"
                style={{ minHeight: '120px', resize: 'vertical' }}
                name="description"
                value={footerData.description}
                onChange={handleFooterChange}
                placeholder="We provide reliable manpower, HR outsourcing, compliance support..."
                required
              />
            </div>

            <div style={styles.cardFooter}>
              {brandStatus.error && <span style={styles.cardError}>{brandStatus.error}</span>}
              {brandStatus.success && <span style={styles.cardSuccess}>Brand saved!</span>}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={brandStatus.loading}
              >
                <FaSave />
                <span>{brandStatus.loading ? 'Saving...' : 'Save Brand Settings'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Card 2: Column Headers & Newsletter */}
        <div className="glass-card" style={styles.card}>
          <div style={styles.cardHeader}>
            <FaHeading style={styles.cardIcon} />
            <h3 style={styles.cardTitle}>Column Titles & Newsletter</h3>
          </div>

          <form onSubmit={saveHeadersSection} style={styles.form}>
            <div style={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Column 1 Header (Company Links)</label>
                <input
                  className="form-input"
                  type="text"
                  name="company_header"
                  value={footerData.company_header}
                  onChange={handleFooterChange}
                  placeholder="Company"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Column 2 Header (Services Links)</label>
                <input
                  className="form-input"
                  type="text"
                  name="services_header"
                  value={footerData.services_header}
                  onChange={handleFooterChange}
                  placeholder="Services"
                  required
                />
              </div>
            </div>

            <div style={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Column 3 Header (Contact info)</label>
                <input
                  className="form-input"
                  type="text"
                  name="contact_header"
                  value={footerData.contact_header}
                  onChange={handleFooterChange}
                  placeholder="Contact"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Column 4 Header (Newsletter)</label>
                <input
                  className="form-input"
                  type="text"
                  name="newsletter_header"
                  value={footerData.newsletter_header}
                  onChange={handleFooterChange}
                  placeholder="Newsletter"
                  required
                />
              </div>
            </div>

            <div style={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Newsletter Placeholder Text</label>
                <input
                  className="form-input"
                  type="text"
                  name="newsletter_placeholder"
                  value={footerData.newsletter_placeholder}
                  onChange={handleFooterChange}
                  placeholder="Your email"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Newsletter Button Text</label>
                <input
                  className="form-input"
                  type="text"
                  name="newsletter_button_text"
                  value={footerData.newsletter_button_text}
                  onChange={handleFooterChange}
                  placeholder="Subscribe"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Copyright Notice Text</label>
              <div style={styles.inputWrapper}>
                <FaCopyright style={styles.inputIcon} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  type="text"
                  name="copyright"
                  value={footerData.copyright}
                  onChange={handleFooterChange}
                  placeholder="Samruddhi HR Services. All rights reserved."
                  required
                />
              </div>
            </div>

            <div style={styles.cardFooter}>
              {headersStatus.error && <span style={styles.cardError}>{headersStatus.error}</span>}
              {headersStatus.success && <span style={styles.cardSuccess}>Headers saved!</span>}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={headersStatus.loading}
              >
                <FaSave />
                <span>{headersStatus.loading ? 'Saving...' : 'Save Config'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Card 4: Company Links Editor */}
        <div className="glass-card" style={styles.card}>
          <div style={styles.cardHeader}>
            <FaLink style={styles.cardIcon} />
            <h3 style={styles.cardTitle}>Company Column Links</h3>
          </div>

          <div style={styles.list}>
            {companyLinks.length === 0 ? (
              <p style={styles.infoText}>No links configured.</p>
            ) : (
              companyLinks.map((link, index) => (
                <div key={index} style={styles.listItem}>
                  <div style={{ flexGrow: 1, marginRight: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => {
                        const updated = [...companyLinks];
                        updated[index].name = e.target.value;
                        setCompanyLinks(updated);
                      }}
                      style={styles.listItemInputName}
                      placeholder="Link Name"
                    />
                    <input
                      type="text"
                      value={link.path}
                      onChange={(e) => {
                        const updated = [...companyLinks];
                        updated[index].path = e.target.value;
                        setCompanyLinks(updated);
                      }}
                      style={styles.listItemInputPath}
                      placeholder="Destination Path"
                    />
                  </div>
                  <div style={styles.itemActions}>
                    <button
                      className="btn btn-secondary"
                      style={styles.actionBtn}
                      onClick={() => moveCompanyLink(index, 'up')}
                      disabled={index === 0}
                    >
                      <FaArrowUp />
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={styles.actionBtn}
                      onClick={() => moveCompanyLink(index, 'down')}
                      disabled={index === companyLinks.length - 1}
                    >
                      <FaArrowDown />
                    </button>
                    <button
                      className="btn btn-danger"
                      style={styles.actionBtn}
                      onClick={() => handleDeleteCompanyLink(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add form */}
          <form onSubmit={handleAddCompanyLink} style={{ ...styles.form, marginTop: '1rem', borderTop: '1px dashed var(--glass-border)', paddingTop: '1.25rem' }}>
            <h4 style={styles.sectionSubtitle}>Add Company Link</h4>
            <div style={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Link Text</label>
                <input
                  className="form-input"
                  type="text"
                  value={newCompanyLinkName}
                  onChange={(e) => setNewCompanyLinkName(e.target.value)}
                  placeholder="e.g., About Us"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Route Path</label>
                <input
                  className="form-input"
                  type="text"
                  value={newCompanyLinkPath}
                  onChange={(e) => setNewCompanyLinkPath(e.target.value)}
                  placeholder="e.g., /about"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
              <FaPlus />
              <span>Add Link</span>
            </button>
          </form>

          <div style={styles.cardFooter}>
            {companyLinksStatus.error && <span style={styles.cardError}>{companyLinksStatus.error}</span>}
            {companyLinksStatus.success && <span style={styles.cardSuccess}>Links saved!</span>}
            <button
              type="button"
              className="btn btn-primary"
              disabled={companyLinksStatus.loading}
              onClick={saveCompanyLinksSection}
            >
              <FaSave />
              <span>{companyLinksStatus.loading ? 'Saving...' : 'Save Company Links'}</span>
            </button>
          </div>
        </div>

        {/* Card 5: Services Links Editor */}
        <div className="glass-card" style={styles.card}>
          <div style={styles.cardHeader}>
            <FaLink style={styles.cardIcon} />
            <h3 style={styles.cardTitle}>Services Column Links</h3>
          </div>

          <div style={styles.list}>
            {servicesLinks.length === 0 ? (
              <p style={styles.infoText}>No links configured.</p>
            ) : (
              servicesLinks.map((link, index) => (
                <div key={index} style={styles.listItem}>
                  <div style={{ flexGrow: 1, marginRight: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => {
                        const updated = [...servicesLinks];
                        updated[index].name = e.target.value;
                        setServicesLinks(updated);
                      }}
                      style={styles.listItemInputName}
                      placeholder="Link Name"
                    />
                    <input
                      type="text"
                      value={link.path}
                      onChange={(e) => {
                        const updated = [...servicesLinks];
                        updated[index].path = e.target.value;
                        setServicesLinks(updated);
                      }}
                      style={styles.listItemInputPath}
                      placeholder="Destination Path"
                    />
                  </div>
                  <div style={styles.itemActions}>
                    <button
                      className="btn btn-secondary"
                      style={styles.actionBtn}
                      onClick={() => moveServicesLink(index, 'up')}
                      disabled={index === 0}
                    >
                      <FaArrowUp />
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={styles.actionBtn}
                      onClick={() => moveServicesLink(index, 'down')}
                      disabled={index === servicesLinks.length - 1}
                    >
                      <FaArrowDown />
                    </button>
                    <button
                      className="btn btn-danger"
                      style={styles.actionBtn}
                      onClick={() => handleDeleteServicesLink(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add form */}
          <form onSubmit={handleAddServicesLink} style={{ ...styles.form, marginTop: '1rem', borderTop: '1px dashed var(--glass-border)', paddingTop: '1.25rem' }}>
            <h4 style={styles.sectionSubtitle}>Add Services Link</h4>
            <div style={styles.formGrid}>
              <div className="form-group">
                <label className="form-label">Link Text</label>
                <input
                  className="form-input"
                  type="text"
                  value={newServicesLinkName}
                  onChange={(e) => setNewServicesLinkName(e.target.value)}
                  placeholder="e.g., Compliances"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Route Path</label>
                <input
                  className="form-input"
                  type="text"
                  value={newServicesLinkPath}
                  onChange={(e) => setNewServicesLinkPath(e.target.value)}
                  placeholder="e.g., /services/compliances"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
              <FaPlus />
              <span>Add Link</span>
            </button>
          </form>

          <div style={styles.cardFooter}>
            {servicesLinksStatus.error && <span style={styles.cardError}>{servicesLinksStatus.error}</span>}
            {servicesLinksStatus.success && <span style={styles.cardSuccess}>Links saved!</span>}
            <button
              type="button"
              className="btn btn-primary"
              disabled={servicesLinksStatus.loading}
              onClick={saveServicesLinksSection}
            >
              <FaSave />
              <span>{servicesLinksStatus.loading ? 'Saving...' : 'Save Services Links'}</span>
            </button>
          </div>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Card 3: Contact Details & Social Media */}
        <div className="glass-card" style={styles.card}>
          <div style={styles.cardHeader}>
            <FaPhone style={styles.cardIcon} />
            <h3 style={styles.cardTitle}>Contact Details & Social Media</h3>
          </div>

          <form onSubmit={saveContactSection} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div style={styles.inputWrapper}>
                <FaPhone style={styles.inputIcon} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  type="text"
                  name="phone"
                  value={contactData.phone}
                  onChange={handleContactChange}
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
                  value={contactData.email}
                  onChange={handleContactChange}
                  placeholder="info@samruddhihrservices.com"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Office Address</label>
              <div style={styles.inputWrapper}>
                <FaMapMarkerAlt style={styles.inputIcon} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  type="text"
                  name="address"
                  value={contactData.address}
                  onChange={handleContactChange}
                  placeholder="Nashik, Maharashtra"
                  required
                />
              </div>
            </div>

            <div style={{ ...styles.divider, margin: '1.5rem 0' }} />

            <h4 style={{ ...styles.sectionSubtitle, marginBottom: '1rem' }}>Social Links</h4>

            <div className="form-group">
              <label className="form-label">Facebook Page Link</label>
              <div style={styles.inputWrapper}>
                <FaFacebook style={{ ...styles.inputIcon, color: '#1877F2' }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  type="text"
                  name="facebook"
                  value={contactData.facebook}
                  onChange={handleContactChange}
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Twitter/X Link</label>
              <div style={styles.inputWrapper}>
                <FaTwitter style={{ ...styles.inputIcon, color: '#1DA1F2' }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  type="text"
                  name="twitter"
                  value={contactData.twitter}
                  onChange={handleContactChange}
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Instagram Link</label>
              <div style={styles.inputWrapper}>
                <FaInstagram style={{ ...styles.inputIcon, color: '#E1306C' }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  type="text"
                  name="instagram"
                  value={contactData.instagram}
                  onChange={handleContactChange}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>

            <div style={styles.cardFooter}>
              {contactStatus.error && <span style={styles.cardError}>{contactStatus.error}</span>}
              {contactStatus.success && <span style={styles.cardSuccess}>Section saved!</span>}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={contactStatus.loading}
              >
                <FaSave />
                <span>{contactStatus.loading ? 'Saving...' : 'Save Contact & Socials'}</span>
              </button>
            </div>
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
    marginBottom: '1rem',
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
  sectionSubtitle: {
    fontSize: '1.05rem',
    fontWeight: '600',
    color: 'white',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
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
    marginBottom: '1rem',
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
  divider: {
    height: '1px',
    backgroundColor: 'var(--glass-border)',
    width: '100%',
  },
  logoPreview: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    objectFit: 'contain',
    border: '1px solid var(--glass-border)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: '4px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    maxHeight: '320px',
    overflowY: 'auto',
    paddingRight: '0.25rem',
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
  itemActions: {
    display: 'flex',
    gap: '0.4rem',
  },
  actionBtn: {
    padding: '0.4rem',
    fontSize: '0.8rem',
    borderRadius: '6px',
  },
  infoText: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    textAlign: 'center',
    padding: '1.5rem 0',
  },
  listItemInputName: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
    padding: '2px 4px',
    borderBottom: '1px dashed rgba(255,255,255,0.1)',
  },
  listItemInputPath: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '0.8rem',
    fontFamily: 'monospace',
    outline: 'none',
    width: '100%',
    padding: '2px 4px',
  },
};
