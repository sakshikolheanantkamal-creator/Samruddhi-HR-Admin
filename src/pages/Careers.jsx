import { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  FaTrash,
  FaPlus,
  FaBriefcase,
  FaEdit,
  FaCheck,
  FaTimes,
  FaPalette,
  FaTag,
  FaUserTie,
  FaCheckCircle,
  FaEnvelope,
  FaHandshake,
  FaImage,
  FaUsers,
} from 'react-icons/fa';

const resolveImage = (path) => {
  if (!path) return '';
  if (path.startsWith('/uploads/')) {
    return `http://localhost:5000${path}`;
  }
  if (path.startsWith('http')) {
    return path;
  }
  return path.startsWith('/') ? path : `/${path}`;
};

const initialCareerPageContent = {
  hero: {
    badge: '',
    heading_line_1: '',
    heading_line_2: '',
    paragraphs: ['', '', ''],
    button_1_text: '',
    button_1_link: '',
    button_2_text: '',
    button_2_link: '',
    imageUrl: ''
  },
  why: {
    title: '',
    subtitle: '',
    benefits: []
  },
  opportunities: {
    title: '',
    subtitle: ''
  },
  eligibility: {
    left_title: '',
    right_title: '',
    can_apply: [],
    looking_for: []
  },
  contact: {
    heading: '',
    subtitle: '',
    intro: '',
    email: '',
    whatsapp: '',
    email_button: '',
    whatsapp_button: ''
  },
  commitment: {
    title: '',
    description: '',
    commitments: []
  }
};

export default function Careers() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // All career page content state
  const [careerPageContent, setCareerPageContent] = useState(initialCareerPageContent);
  const [savingAllContent, setSavingAllContent] = useState(false);
  const [sectionStatus, setSectionStatus] = useState({});
  const [newBenefit, setNewBenefit] = useState('');
  const [newEligibility, setNewEligibility] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newCommitment, setNewCommitment] = useState('');

  // Department modal state
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deptForm, setDeptForm] = useState({ title: '', icon: 'FaBriefcase', color: '#285e9c' });

  // Quick job input state keyed by department id
  const [quickJobText, setQuickJobText] = useState({});

  async function saveAllContent() {
    setSavingAllContent(true);
    setError('');
    setSuccess('');
    try {
      const updated = {
        hero: careerPageContent.hero,
        why: careerPageContent.why,
        opportunities: careerPageContent.opportunities,
        eligibility: careerPageContent.eligibility,
        contact: careerPageContent.contact,
        commitment: careerPageContent.commitment
      };
      await api.post('/content/careers_page_content', updated);
      setSuccess('All career page content saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save content.');
    } finally {
      setSavingAllContent(false);
    }
  }

  const getSectionStatus = (sectionName) => sectionStatus[sectionName] || { loading: false, success: false, error: '' };

  const handleSaveSection = async (sectionName) => {
    setSectionStatus((prev) => ({
      ...prev,
      [sectionName]: { loading: true, success: false, error: '' },
    }));

    try {
      const sectionValue = careerPageContent[sectionName];
      const latestContent = await api.get('/content/careers_page_content').catch(() => ({}));
      const updatedPayload = {
        ...latestContent,
        [sectionName]: sectionValue,
      };

      await api.post('/content/careers_page_content', updatedPayload);
      setCareerPageContent((prev) => ({
        ...prev,
        [sectionName]: sectionValue,
      }));

      setSectionStatus((prev) => ({
        ...prev,
        [sectionName]: { loading: false, success: true, error: '' },
      }));

      setTimeout(() => {
        setSectionStatus((prev) => ({
          ...prev,
          [sectionName]: { ...prev[sectionName], success: false },
        }));
      }, 3000);
    } catch (err) {
      setSectionStatus((prev) => ({
        ...prev,
        [sectionName]: { loading: false, success: false, error: err.message || 'Failed to save section.' },
      }));
    }
  };

  const handleCareerFieldChange = (section, field, value) => {
    setCareerPageContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleCareerListChange = (section, listKey, index, value) => {
    setCareerPageContent((prev) => {
      const list = prev[section][listKey] || [];
      const nextList = [...list];
      nextList[index] = value;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [listKey]: nextList,
        },
      };
    });
  };

  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        const [departmentsData, pageContent] = await Promise.all([
          api.get('/careers'),
          api.get('/content/careers_page_content'),
        ]);

        setDepartments(departmentsData || []);

        if (pageContent) {
          setCareerPageContent({
            hero: pageContent.hero || initialCareerPageContent.hero,
            why: pageContent.why || initialCareerPageContent.why,
            opportunities: pageContent.opportunities || initialCareerPageContent.opportunities,
            eligibility: pageContent.eligibility || initialCareerPageContent.eligibility,
            contact: pageContent.contact || initialCareerPageContent.contact,
            commitment: pageContent.commitment || initialCareerPageContent.commitment,
          });
        }
      } catch (err) {
        console.error('Failed to load careers CMS data:', err);
        setError('Failed to load careers CMS data.');
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, []);

  // Helper functions for managing lists
  const addBenefit = () => {
    if (!newBenefit.trim()) return;
    setCareerPageContent(prev => ({
      ...prev,
      why: {
        ...prev.why,
        benefits: [...prev.why.benefits, { icon: 'FaHandshake', text: newBenefit.trim() }]
      }
    }));
    setNewBenefit('');
  };

  const removeBenefit = (index) => {
    setCareerPageContent(prev => ({
      ...prev,
      why: {
        ...prev.why,
        benefits: prev.why.benefits.filter((_, i) => i !== index)
      }
    }));
  };

  const addEligibility = () => {
    if (!newEligibility.trim()) return;
    setCareerPageContent(prev => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        can_apply: [...prev.eligibility.can_apply, newEligibility.trim()]
      }
    }));
    setNewEligibility('');
  };

  const removeEligibility = (index) => {
    setCareerPageContent(prev => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        can_apply: prev.eligibility.can_apply.filter((_, i) => i !== index)
      }
    }));
  };

  const addRequirement = () => {
    if (!newRequirement.trim()) return;
    setCareerPageContent(prev => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        looking_for: [...prev.eligibility.looking_for, newRequirement.trim()]
      }
    }));
    setNewRequirement('');
  };

  const removeRequirement = (index) => {
    setCareerPageContent(prev => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        looking_for: prev.eligibility.looking_for.filter((_, i) => i !== index)
      }
    }));
  };

  const addCommitment = () => {
    if (!newCommitment.trim()) return;
    setCareerPageContent(prev => ({
      ...prev,
      commitment: {
        ...prev.commitment,
        commitments: [...prev.commitment.commitments, newCommitment.trim()]
      }
    }));
    setNewCommitment('');
  };

  const removeCommitment = (index) => {
    setCareerPageContent(prev => ({
      ...prev,
      commitment: {
        ...prev.commitment,
        commitments: prev.commitment.commitments.filter((_, i) => i !== index)
      }
    }));
  };

  // Department CRUD
  const handleOpenAddDept = () => {
    setEditingDept(null);
    setDeptForm({ title: '', icon: 'FaBriefcase', color: '#285e9c' });
    setShowDeptModal(true);
  };

  const handleOpenEditDept = (dept) => {
    setEditingDept(dept);
    setDeptForm({ title: dept.title, icon: dept.icon || 'FaBriefcase', color: dept.color || '#285e9c' });
    setShowDeptModal(true);
  };

  const handleSaveDept = async (e) => {
    e.preventDefault();
    if (!deptForm.title) return;

    try {
      if (editingDept) {
        const updated = await api.put(`/careers/departments/${editingDept.id}`, deptForm);
        setDepartments(departments.map((d) => (d.id === editingDept.id ? { ...d, ...updated } : d)));
      } else {
        const created = await api.post('/careers/departments', deptForm);
        setDepartments([...departments, { ...created, jobs: [], roles: [] }]);
      }
      setShowDeptModal(false);
    } catch (err) {
      alert(err.message || 'Failed to save department.');
    }
  };

  const handleDeleteDept = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department? All associated job roles will also be deleted.')) return;
    try {
      await api.delete(`/careers/departments/${id}`);
      setDepartments(departments.filter((d) => d.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete department.');
    }
  };

  // Job roles CRUD
  const handleAddJob = async (deptId) => {
    const title = quickJobText[deptId];
    if (!title || !title.trim()) return;

    try {
      const created = await api.post('/careers/jobs', { departmentId: deptId, title: title.trim() });
      setDepartments((prev) => prev.map((dept) => {
        if (dept.id === deptId) {
          const updatedJobs = [...(dept.jobs || []), { id: created.id, title: created.title }];
          return { ...dept, jobs: updatedJobs, roles: updatedJobs.map((j) => j.title) };
        }
        return dept;
      }));
      setQuickJobText((p) => ({ ...p, [deptId]: '' }));
    } catch (err) {
      alert(err.message || 'Failed to add job role.');
    }
  };

  const handleDeleteJob = async (deptId, jobId) => {
    if (!window.confirm('Are you sure you want to remove this job role?')) return;
    try {
      await api.delete(`/careers/jobs/${jobId}`);
      setDepartments((prev) => prev.map((dept) => {
        if (dept.id === deptId) {
          const updatedJobs = (dept.jobs || []).filter((j) => j.id !== jobId);
          return { ...dept, jobs: updatedJobs, roles: updatedJobs.map((j) => j.title) };
        }
        return dept;
      }));
    } catch (err) {
      alert(err.message || 'Failed to delete job role.');
    }
  };

  return (
    <>
      <div className="animate-fade-in" style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Careers</h1>
            <p style={styles.subtitle}>Manage the full careers page content, including hero text, benefits, eligibility, contact options, commitments, and department job listings.</p>
          </div>
          <div style={styles.headerActions}>
            <button className="btn btn-secondary" onClick={saveAllContent} disabled={savingAllContent}>
              {savingAllContent ? 'Saving All...' : 'Save All Sections'}
            </button>
            <button className="btn btn-primary" onClick={handleOpenAddDept}>
              <FaPlus /> <span>Add Department</span>
            </button>
          </div>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}
        {success && <div style={styles.successAlert}>{success}</div>}

        {/* Career Page CMS Sections */}
        <div className="glass-card" style={styles.sectionContentCard}>
          <div style={styles.sectionContentHeader}>
            <h3 style={styles.sectionContentTitle}>
              <FaCheckCircle style={{ marginRight: '0.75rem' }} />
              Why Work With Us
            </h3>
            <div style={styles.sectionHeaderActions}>
              <button
                className="btn btn-primary"
                onClick={() => handleSaveSection('why')}
                disabled={getSectionStatus('why').loading}
                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
              >
                {getSectionStatus('why').loading ? 'Saving...' : getSectionStatus('why').success ? 'Saved' : 'Save Section'}
              </button>
              {getSectionStatus('why').error && <span style={styles.sectionErrorText}>{getSectionStatus('why').error}</span>}
              {getSectionStatus('why').success && <span style={styles.sectionSuccessText}>Saved</span>}
            </div>
          </div>
          <div style={styles.sectionContentBody}>
            <div className="form-group">
              <label className="form-label">Section title</label>
              <input
                className="form-input"
                type="text"
                value={careerPageContent.why.title}
                onChange={(e) => handleCareerFieldChange('why', 'title', e.target.value)}
                placeholder="e.g., Why Work with Samruddhi HR Services"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Section subtitle</label>
              <textarea
                className="form-input"
                rows={2}
                value={careerPageContent.why.subtitle}
                onChange={(e) => handleCareerFieldChange('why', 'subtitle', e.target.value)}
                placeholder="Brief description of why candidates should work with you"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Benefits</label>
              {careerPageContent.why.benefits.map((item, idx) => (
                <div key={idx} style={styles.benefitRow}>
                  <input
                    className="form-input"
                    type="text"
                    value={item.text}
                    onChange={(e) => {
                      const nextBenefits = [...careerPageContent.why.benefits];
                      nextBenefits[idx] = { ...nextBenefits[idx], text: e.target.value };
                      setCareerPageContent((prev) => ({
                        ...prev,
                        why: {
                          ...prev.why,
                          benefits: nextBenefits,
                        },
                      }));
                    }}
                    placeholder={`Benefit ${idx + 1}`}
                  />
                  <button type="button" style={styles.inlineDeleteBtn} onClick={() => removeBenefit(idx)}>
                    <FaTimes />
                  </button>
                </div>
              ))}
              <div style={styles.inlineAddRow}>
                <input
                  className="form-input"
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  placeholder="Add new benefit"
                />
                <button type="button" className="btn btn-primary" onClick={addBenefit}>
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={styles.sectionContentCard}>
          <div style={styles.sectionContentHeader}>
            <h3 style={styles.sectionContentTitle}>
              <FaUsers style={{ marginRight: '0.75rem' }} />
              Eligibility Section
            </h3>
            <div style={styles.sectionHeaderActions}>
              <button
                className="btn btn-primary"
                onClick={() => handleSaveSection('eligibility')}
                disabled={getSectionStatus('eligibility').loading}
                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
              >
                {getSectionStatus('eligibility').loading ? 'Saving...' : getSectionStatus('eligibility').success ? 'Saved' : 'Save Section'}
              </button>
              {getSectionStatus('eligibility').error && <span style={styles.sectionErrorText}>{getSectionStatus('eligibility').error}</span>}
              {getSectionStatus('eligibility').success && <span style={styles.sectionSuccessText}>Saved</span>}
            </div>
          </div>
          <div style={styles.sectionContentBody}>
            <div className="form-group">
              <label className="form-label">Left title</label>
              <input
                className="form-input"
                type="text"
                value={careerPageContent.eligibility.left_title}
                onChange={(e) => handleCareerFieldChange('eligibility', 'left_title', e.target.value)}
                placeholder="e.g., Who Can Apply"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Right title</label>
              <input
                className="form-input"
                type="text"
                value={careerPageContent.eligibility.right_title}
                onChange={(e) => handleCareerFieldChange('eligibility', 'right_title', e.target.value)}
                placeholder="e.g., What We Look For"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Who Can Apply</label>
              {careerPageContent.eligibility.can_apply.map((item, idx) => (
                <div key={`apply-${idx}`} style={styles.benefitRow}>
                  <input
                    className="form-input"
                    type="text"
                    value={item}
                    onChange={(e) => handleCareerListChange('eligibility', 'can_apply', idx, e.target.value)}
                    placeholder={`Eligibility ${idx + 1}`}
                  />
                  <button type="button" style={styles.inlineDeleteBtn} onClick={() => removeEligibility(idx)}>
                    <FaTimes />
                  </button>
                </div>
              ))}
              <div style={styles.inlineAddRow}>
                <input
                  className="form-input"
                  type="text"
                  value={newEligibility}
                  onChange={(e) => setNewEligibility(e.target.value)}
                  placeholder="Add eligibility item"
                />
                <button type="button" className="btn btn-primary" onClick={addEligibility}>
                  <FaPlus />
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">What We Look For</label>
              {careerPageContent.eligibility.looking_for.map((item, idx) => (
                <div key={`look-${idx}`} style={styles.benefitRow}>
                  <input
                    className="form-input"
                    type="text"
                    value={item}
                    onChange={(e) => handleCareerListChange('eligibility', 'looking_for', idx, e.target.value)}
                    placeholder={`Requirement ${idx + 1}`}
                  />
                  <button type="button" style={styles.inlineDeleteBtn} onClick={() => removeRequirement(idx)}>
                    <FaTimes />
                  </button>
                </div>
              ))}
              <div style={styles.inlineAddRow}>
                <input
                  className="form-input"
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Add requirement"
                />
                <button type="button" className="btn btn-primary" onClick={addRequirement}>
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={styles.sectionContentCard}>
          <div style={styles.sectionContentHeader}>
            <h3 style={styles.sectionContentTitle}>
              <FaEnvelope style={{ marginRight: '0.75rem' }} />
              Contact Options
            </h3>
            <div style={styles.sectionHeaderActions}>
              <button
                className="btn btn-primary"
                onClick={() => handleSaveSection('contact')}
                disabled={getSectionStatus('contact').loading}
                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
              >
                {getSectionStatus('contact').loading ? 'Saving...' : getSectionStatus('contact').success ? 'Saved' : 'Save Section'}
              </button>
              {getSectionStatus('contact').error && <span style={styles.sectionErrorText}>{getSectionStatus('contact').error}</span>}
              {getSectionStatus('contact').success && <span style={styles.sectionSuccessText}>Saved</span>}
            </div>
          </div>
          <div style={styles.sectionContentBody}>
            <div className="form-group">
              <label className="form-label">Heading</label>
              <input
                className="form-input"
                type="text"
                value={careerPageContent.contact.heading}
                onChange={(e) => handleCareerFieldChange('contact', 'heading', e.target.value)}
                placeholder="e.g., How to Apply"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Subtitle</label>
              <input
                className="form-input"
                type="text"
                value={careerPageContent.contact.subtitle}
                onChange={(e) => handleCareerFieldChange('contact', 'subtitle', e.target.value)}
                placeholder="e.g., Choose the easiest way to send us your resume"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Intro text</label>
              <textarea
                className="form-input"
                rows={3}
                value={careerPageContent.contact.intro}
                onChange={(e) => handleCareerFieldChange('contact', 'intro', e.target.value)}
                placeholder="Introduction text for contact section"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  value={careerPageContent.contact.email}
                  onChange={(e) => handleCareerFieldChange('contact', 'email', e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp number</label>
                <input
                  className="form-input"
                  type="text"
                  value={careerPageContent.contact.whatsapp}
                  onChange={(e) => handleCareerFieldChange('contact', 'whatsapp', e.target.value)}
                  placeholder="+918208021948"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email button text</label>
                <input
                  className="form-input"
                  type="text"
                  value={careerPageContent.contact.email_button}
                  onChange={(e) => handleCareerFieldChange('contact', 'email_button', e.target.value)}
                  placeholder="e.g., Email Resume"
                />
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp button text</label>
                <input
                  className="form-input"
                  type="text"
                  value={careerPageContent.contact.whatsapp_button}
                  onChange={(e) => handleCareerFieldChange('contact', 'whatsapp_button', e.target.value)}
                  placeholder="e.g., WhatsApp Resume"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={styles.sectionContentCard}>
          <div style={styles.sectionContentHeader}>
            <h3 style={styles.sectionContentTitle}>
              <FaHandshake style={{ marginRight: '0.75rem' }} />
              Commitment Section
            </h3>
            <div style={styles.sectionHeaderActions}>
              <button
                className="btn btn-primary"
                onClick={() => handleSaveSection('commitment')}
                disabled={getSectionStatus('commitment').loading}
                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
              >
                {getSectionStatus('commitment').loading ? 'Saving...' : getSectionStatus('commitment').success ? 'Saved' : 'Save Section'}
              </button>
              {getSectionStatus('commitment').error && <span style={styles.sectionErrorText}>{getSectionStatus('commitment').error}</span>}
              {getSectionStatus('commitment').success && <span style={styles.sectionSuccessText}>Saved</span>}
            </div>
          </div>
          <div style={styles.sectionContentBody}>
            <div className="form-group">
              <label className="form-label">Section title</label>
              <input
                className="form-input"
                type="text"
                value={careerPageContent.commitment.title}
                onChange={(e) => handleCareerFieldChange('commitment', 'title', e.target.value)}
                placeholder="e.g., Our Commitment to Employees"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                rows={3}
                value={careerPageContent.commitment.description}
                onChange={(e) => handleCareerFieldChange('commitment', 'description', e.target.value)}
                placeholder="Description of your commitment to employees"
              />
            </div>
            {careerPageContent.commitment.commitments.map((item, idx) => (
              <div key={`commitment-${idx}`} style={styles.benefitRow}>
                <input
                  className="form-input"
                  type="text"
                  value={item}
                  onChange={(e) => handleCareerListChange('commitment', 'commitments', idx, e.target.value)}
                  placeholder={`Commitment ${idx + 1}`}
                />
                <button type="button" style={styles.inlineDeleteBtn} onClick={() => removeCommitment(idx)}>
                  <FaTimes />
                </button>
              </div>
            ))}
            <div style={styles.inlineAddRow}>
              <input
                className="form-input"
                type="text"
                value={newCommitment}
                onChange={(e) => setNewCommitment(e.target.value)}
                placeholder="Add commitment item"
              />
              <button type="button" className="btn btn-primary" onClick={addCommitment}>
                <FaPlus />
              </button>
            </div>
          </div>
        </div>

        {/* Hero Section - Moved here to appear before Career Opportunities */}
        <div className="glass-card" style={styles.sectionContentCard}>
          <div style={styles.sectionContentHeader}>
            <h3 style={styles.sectionContentTitle}>
              <FaUserTie style={{ marginRight: '0.75rem' }} />
              Hero Section
            </h3>
            <div style={styles.sectionHeaderActions}>
              <button
                className="btn btn-primary"
                onClick={() => handleSaveSection('hero')}
                disabled={getSectionStatus('hero').loading}
                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
              >
                {getSectionStatus('hero').loading ? 'Saving...' : getSectionStatus('hero').success ? 'Saved' : 'Save Section'}
              </button>
              {getSectionStatus('hero').error && <span style={styles.sectionErrorText}>{getSectionStatus('hero').error}</span>}
              {getSectionStatus('hero').success && <span style={styles.sectionSuccessText}>Saved</span>}
            </div>
          </div>
          <div style={styles.sectionContentBody}>
            <div className="form-group">
              <label className="form-label">Badge text</label>
              <input
                className="form-input"
                type="text"
                value={careerPageContent.hero.badge}
                onChange={(e) => handleCareerFieldChange('hero', 'badge', e.target.value)}
                placeholder="e.g., Join Our Team"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Heading line 1</label>
              <input
                className="form-input"
                type="text"
                value={careerPageContent.hero.heading_line_1}
                onChange={(e) => handleCareerFieldChange('hero', 'heading_line_1', e.target.value)}
                placeholder="e.g., Build Your Career with"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Heading line 2</label>
              <input
                className="form-input"
                type="text"
                value={careerPageContent.hero.heading_line_2}
                onChange={(e) => handleCareerFieldChange('hero', 'heading_line_2', e.target.value)}
                placeholder="e.g., Samruddhi HR Services"
              />
            </div>
            {[0, 1, 2].map((index) => (
              <div key={index} className="form-group">
                <label className="form-label">Paragraph {index + 1}</label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={careerPageContent.hero.paragraphs[index] || ''}
                  onChange={(e) => handleCareerListChange('hero', 'paragraphs', index, e.target.value)}
                  placeholder={`Paragraph ${index + 1}`}
                />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Primary button text</label>
              <input
                className="form-input"
                type="text"
                value={careerPageContent.hero.button_1_text}
                onChange={(e) => handleCareerFieldChange('hero', 'button_1_text', e.target.value)}
                placeholder="e.g., Browse Open Positions"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Primary button link</label>
              <input
                className="form-input"
                type="text"
                value={careerPageContent.hero.button_1_link}
                onChange={(e) => handleCareerFieldChange('hero', 'button_1_link', e.target.value)}
                placeholder="/careers"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Secondary button text</label>
              <input
                className="form-input"
                type="text"
                value={careerPageContent.hero.button_2_text}
                onChange={(e) => handleCareerFieldChange('hero', 'button_2_text', e.target.value)}
                placeholder="e.g., Why Join Us"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Secondary button link</label>
              <input
                className="form-input"
                type="text"
                value={careerPageContent.hero.button_2_link}
                onChange={(e) => handleCareerFieldChange('hero', 'button_2_link', e.target.value)}
                placeholder="#why-work-with-us"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <FaImage style={{ marginRight: '0.5rem' }} /> Hero image URL
              </label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  className="form-input"
                  type="text"
                  value={careerPageContent.hero.imageUrl}
                  onChange={(e) => handleCareerFieldChange('hero', 'imageUrl', e.target.value)}
                  placeholder="Image URL or upload a file"
                  style={{ flexGrow: 1, minWidth: '220px' }}
                />
                {careerPageContent.hero.imageUrl && careerPageContent.hero.imageUrl !== 'Uploading...' && (
                  <img
                    src={resolveImage(careerPageContent.hero.imageUrl)}
                    alt="Hero preview"
                    style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--glass-border)' }}
                  />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const uploadBody = new FormData();
                  uploadBody.append('image', file);
                  try {
                    setError('');
                    setSuccess('');
                    setCareerPageContent((prev) => ({ ...prev, hero: { ...prev.hero, imageUrl: 'Uploading...' } }));
                    const res = await api.post('/content/upload-image', uploadBody);
                    if (res && res.imageUrl) {
                      setCareerPageContent((prev) => ({ ...prev, hero: { ...prev.hero, imageUrl: res.imageUrl } }));
                      setSuccess('Image uploaded successfully.');
                    }
                  } catch (err) {
                    setError('Failed to upload image: ' + (err.message || err));
                    setCareerPageContent((prev) => ({ ...prev, hero: { ...prev.hero, imageUrl: '' } }));
                  }
                }}
                style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

       <div className="glass-card" style={styles.sectionContentCard}>
          <div style={styles.sectionContentHeader}>
            <h3 style={styles.sectionContentTitle}>
              <FaBriefcase style={{ marginRight: '0.75rem' }} />
              Career Opportunities Section
            </h3>
            <div style={styles.sectionHeaderActions}>
              <button
                className="btn btn-primary"
                onClick={() => handleSaveSection('opportunities')}
                disabled={getSectionStatus('opportunities').loading}
                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
              >
                {getSectionStatus('opportunities').loading ? 'Saving...' : getSectionStatus('opportunities').success ? 'Saved' : 'Save Section'}
              </button>
              {getSectionStatus('opportunities').error && (
                <span style={styles.sectionErrorText}>{getSectionStatus('opportunities').error}</span>
              )}
              {getSectionStatus('opportunities').success && (
                <span style={styles.sectionSuccessText}>Saved</span>
              )}
            </div>
          </div>
          <div style={styles.sectionContentBody}>
            <div className="form-group">
              <label className="form-label">Section Title</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g., Career Opportunities"
                value={careerPageContent.opportunities.title}
                onChange={(e) => handleCareerFieldChange('opportunities', 'title', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Section Subtitle</label>
              <textarea
                className="form-input"
                rows={2}
                placeholder="e.g., We regularly hire professionals across multiple departments."
                value={careerPageContent.opportunities.subtitle}
                onChange={(e) => handleCareerFieldChange('opportunities', 'subtitle', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Department Cards Section - Separate from Career Opportunities Section */}
        <div style={{ marginTop: '3rem', marginBottom: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid var(--glass-border)'
          }}>
            <div>
              <h2 style={{ 
                fontSize: '1.75rem', 
                fontWeight: '700', 
                color: 'white',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <FaBriefcase /> Department Management
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Manage departments and their active job openings displayed on the careers page.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>Loading careers...</div>
        ) : departments.length === 0 ? (
          <div className="glass-card" style={styles.noDataCard}>No departments created yet. Click "Add Department" to start.</div>
        ) : (
          <div style={styles.deptsGrid}>
            {departments.map((dept) => (
              <div key={dept.id} className="glass-card" style={{ ...styles.deptCard, borderLeft: `6px solid ${dept.color || '#285e9c'}` }}>
                <div style={styles.deptCardHeader}>
                  <div>
                    <h3 style={styles.deptTitle}>{dept.title}</h3>
                    <span style={styles.deptIconTag}>Icon: {dept.icon}</span>
                  </div>
                  <div style={styles.deptHeaderActions}>
                    <button className="btn btn-secondary" style={styles.miniBtn} onClick={() => handleOpenEditDept(dept)} title="Edit Category"><FaEdit /></button>
                    <button className="btn btn-danger" style={styles.miniBtn} onClick={() => handleDeleteDept(dept.id)} title="Delete Category"><FaTrash /></button>
                  </div>
                </div>

                <div style={styles.jobSection}>
                  <h4 style={styles.jobSectionTitle}>Active Openings</h4>

                  {(dept.jobs || []).length === 0 ? (
                    <p style={styles.noJobsText}>No active job roles in this department.</p>
                  ) : (
                    <ul style={styles.jobsList}>
                      {(dept.jobs || []).map((job) => (
                        <li key={job.id} style={styles.jobItem}>
                          <input
                            type="text"
                            value={job.title}
                            onChange={(e) => {
                              const newTitle = e.target.value;
                              setDepartments((prev) => prev.map((d) => {
                                if (d.id === dept.id) {
                                  return { ...d, jobs: d.jobs.map((j) => (j.id === job.id ? { ...j, title: newTitle } : j)) };
                                }
                                return d;
                              }));
                            }}
                            onBlur={async (e) => {
                              const newTitle = e.target.value.trim();
                              if (!newTitle) return;
                              try { await api.put(`/careers/jobs/${job.id}`, { title: newTitle }); } catch (err) { alert('Failed to update job title: ' + err.message); }
                            }}
                            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                            style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', marginRight: '0.5rem', fontSize: '0.875rem', fontFamily: 'inherit' }}
                          />
                          <button style={styles.jobSaveBtn} onClick={async () => {
                            const newTitle = job.title.trim(); if (!newTitle) return; try { await api.put(`/careers/jobs/${job.id}`, { title: newTitle }); alert('Job role title updated successfully.'); } catch (err) { alert('Failed to update job title: ' + err.message); }
                          }} title="Save Role Changes"><FaCheck /></button>
                          <button style={styles.jobDeleteBtn} onClick={() => handleDeleteJob(dept.id, job.id)} title="Remove Role"><FaTimes /></button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div style={styles.quickAddRow}>
                    <input style={styles.quickInput} type="text" placeholder="Add new job role..." value={quickJobText[dept.id] || ''} onChange={(e) => setQuickJobText({ ...quickJobText, [dept.id]: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && handleAddJob(dept.id)} />
                    <button className="btn btn-primary" style={styles.quickAddBtn} onClick={() => handleAddJob(dept.id)}><FaPlus /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal rendered outside main container for proper z-index isolation */}
      {showDeptModal && (
        <div style={styles.modalOverlay} onClick={() => setShowDeptModal(false)}>
          <div className="glass-card animate-fade-in" style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{editingDept ? 'Edit Department' : 'Add Department'}</h3>
              <button style={styles.closeBtn} onClick={() => setShowDeptModal(false)}><FaTimes /></button>
            </div>
            <form onSubmit={handleSaveDept} style={styles.modalForm}>
              <div className="form-group">
                <label className="form-label">Department Title *</label>
                <div style={styles.formInputWrapper}>
                  <FaTag style={styles.formInputIcon} />
                  <input className="form-input" style={{ paddingLeft: '2.5rem' }} type="text" placeholder="e.g., Human Resources" value={deptForm.title} onChange={(e) => setDeptForm({ ...deptForm, title: e.target.value })} required />
                </div>
              </div>

              <div style={styles.modalGrid}>
                <div className="form-group">
                  <label className="form-label">React Icon Class Name</label>
                  <select className="form-input" value={deptForm.icon} onChange={(e) => setDeptForm({ ...deptForm, icon: e.target.value })}>
                    <option value="FaUserTie">FaUserTie (HR / Recruiting)</option>
                    <option value="FaClipboardList">FaClipboardList (Operations / Compliance)</option>
                    <option value="FaBriefcase">FaBriefcase (Sales / BizDev)</option>
                    <option value="FaCalculator">FaCalculator (Finance / Accounts)</option>
                    <option value="FaUsers">FaUsers (Team / Support)</option>
                    <option value="FaCogs">FaCogs (Tech / Engineering)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Theme Color Accent</label>
                  <div style={styles.formInputWrapper}>
                    <FaPalette style={styles.formInputIcon} />
                    <input className="form-input" style={{ paddingLeft: '2.5rem' }} type="text" placeholder="e.g., #285e9c or #83a62e" value={deptForm.color} onChange={(e) => setDeptForm({ ...deptForm, color: e.target.value })} />
                  </div>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeptModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: '2.25rem', fontWeight: '700', marginBottom: '0.25rem' },
  subtitle: { color: 'var(--text-secondary)', fontSize: '1rem' },
  loadingContainer: { textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)', fontSize: '1.1rem' },
  noDataCard: { textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' },
  errorAlert: { backgroundColor: 'rgba(239, 68, 68, 0.12)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '12px' },
  successAlert: { backgroundColor: 'rgba(34, 197, 94, 0.12)', color: '#16a34a', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '1rem', borderRadius: '12px' },
  sectionContentCard: { padding: '1.75rem', marginBottom: '1rem' },
  sectionContentHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' },
  sectionContentTitle: { fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', color: 'white' },
  sectionContentBody: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  headerActions: { display: 'flex', gap: '0.75rem', alignItems: 'center' },
  sectionHeaderActions: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' },
  sectionSuccessText: { color: '#22c55e', fontSize: '0.9rem', fontWeight: '600' },
  sectionErrorText: { color: '#f87171', fontSize: '0.9rem', maxWidth: '240px', wordBreak: 'break-word' },
  benefitRow: { display: 'flex', gap: '0.75rem', alignItems: 'center' },
  inlineDeleteBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    color: '#ef4444',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '0.95rem',
  },
  inlineAddRow: { display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' },
  deptsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '1.5rem' },
  deptCard: { display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.75rem' },
  deptCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' },
  deptTitle: { fontSize: '1.25rem', fontWeight: '600', color: 'white' },
  deptIconTag: { fontSize: '0.8rem', color: 'var(--text-secondary)' },
  deptHeaderActions: { display: 'flex', gap: '0.4rem' },
  miniBtn: { padding: '0.4rem', fontSize: '0.8rem', borderRadius: '6px' },
  jobSection: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  jobSectionTitle: { fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' },
  noJobsText: { fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '0.5rem 0' },
  jobsList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '220px', overflowY: 'auto', paddingRight: '0.25rem' },
  jobItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', fontSize: '0.875rem' },
  jobDeleteBtn: { background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center' },
  jobSaveBtn: { background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginRight: '0.5rem' },
  quickAddRow: { display: 'flex', gap: '0.5rem', marginTop: '0.5rem' },
  quickInput: { flexGrow: 1, padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', fontSize: '0.875rem' },
  quickAddBtn: { padding: '0.5rem', borderRadius: '8px', width: '36px', height: '36px' },
  modalOverlay: { 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0,
    bottom: 0,
    width: '100vw', 
    height: '100vh', 
    backgroundColor: 'rgba(0,0,0,0.75)', 
    backdropFilter: 'blur(6px)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    zIndex: 9999, 
    padding: '1.5rem',
    overflow: 'auto'
  },
  modalContent: { 
    width: '100%', 
    maxWidth: '520px', 
    backgroundColor: 'var(--bg-secondary)', 
    border: '1px solid var(--glass-border)', 
    borderRadius: 'var(--border-radius)', 
    padding: '2rem',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    margin: 'auto',
    zIndex: 10000
  },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1.5rem' },
  modalTitle: { fontSize: '1.5rem', fontWeight: '700', fontFamily: 'var(--font-display)' },
  closeBtn: { background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.25rem', cursor: 'pointer', transition: 'var(--transition-smooth)' },
  modalForm: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formInputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  formInputIcon: { position: 'absolute', left: '1rem', color: 'var(--text-secondary)' },
  modalGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', marginTop: '1.5rem' },
};
