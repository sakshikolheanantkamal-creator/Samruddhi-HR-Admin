import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  FaSave, 
  FaPlus, 
  FaTimes, 
  FaHome, 
  FaListUl, 
  FaWhatsapp, 
  FaCalendarCheck,
  FaBriefcase,
  FaSearch,
  FaImage,
  FaEdit,
  FaTrash,
  FaIndustry,
  FaFileContract,
  FaRocket,
  FaHandshake,
  FaChartLine
} from 'react-icons/fa';
import { LuBriefcaseBusiness } from 'react-icons/lu';
import { LiaIndustrySolid, LiaFileContractSolid, LiaHandshakeSolid, LiaChartLineSolid } from 'react-icons/lia';
import { SlRocket } from 'react-icons/sl';

const defaultServicesWeProvide = [
  { id: 1, title: "Contract", color: "#285e9c", image: "/services/contract.png" },
  { id: 2, title: "Career", color: "#83a62e", image: "/services/success.png" },
  { id: 3, title: "Fulltime direct-hires", color: "#285e9c", image: "/services/fulltime-direct-hires.png" },
  { id: 4, title: "Contract to hire", color: "#83a62e", image: "/services/contract-to-hire.png" },
  { id: 5, title: "Training", color: "#285e9c", image: "/services/training.png" },
  { id: 6, title: "Counselling", color: "#83a62e", image: "/services/counselling.png" },
];

const defaultHowWeRecruit = [
  { id: 1, title: "Social Media", color: "#285e9c", image: "/services/socialmedia.png" },
  { id: 2, title: "Online Job Sites", color: "#83a62e", image: "/services/onlinejob-sites.png" },
  { id: 3, title: "Local Media", color: "#285e9c", image: "/services/local-media.png" },
  { id: 4, title: "Local Colleges", color: "#83a62e", image: "/services/local-colleges.png" },
];

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

const defaultWhyFeatures = [
  { id: 1, icon: "LuBriefcaseBusiness", title: "Strong understanding of corporate HR requirements", description: "Deep expertise in aligning HR strategies with business objectives", color: "#285e9c" },
  { id: 2, icon: "LiaIndustrySolid", title: "Industry-specific manpower solutions", description: "Customized recruitment for diverse sectors and specialized roles", color: "#83a62e" },
  { id: 3, icon: "LiaFileContractSolid", title: "Statutory compliance and audit readiness", description: "Complete adherence to labor laws and regulatory requirements", color: "#285e9c" },
  { id: 4, icon: "SlRocket", title: "Quick turnaround and scalable hiring", description: "Rapid deployment capabilities with flexible scaling options", color: "#83a62e" },
  { id: 5, icon: "LiaHandshakeSolid", title: "Transparent and ethical HR practices", description: "Integrity-driven processes ensuring fair and honest dealings", color: "#285e9c" },
  { id: 6, icon: "LiaChartLineSolid", title: "Value-added financial facilitation services", description: "Comprehensive support for loans and financial solutions", color: "#83a62e" },
];

const whyIconMap = {
  LuBriefcaseBusiness,
  LiaIndustrySolid,
  LiaFileContractSolid,
  SlRocket,
  LiaHandshakeSolid,
  LiaChartLineSolid,
  FaBriefcase,
  FaIndustry,
  FaFileContract,
  FaRocket,
  FaHandshake,
  FaChartLine,
};

const renderWhyIcon = (iconName) => {
  const IconComp = whyIconMap[iconName] || FaBriefcase;
  return <IconComp style={{ color: 'var(--accent)', fontSize: '1.25rem' }} />;
};

export default function HomeCMS() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    hero_badge: '',
    hero_title: '',
    hero_desc_1: '',
    hero_desc_2: '',
    hero_desc_3: '',
    highlights: [],
    whatsapp_number: '',
    stats_years: '',
    stats_clients: '',
    hero_image: '',
    services_we_provide: [],
    how_we_recruit: [],
    services_side_image: '',
    employer_title: '',
    employer_desc: '',
    employer_btn_text: '',
    employer_btn_link: '',
    employer_image: '',
    candidate_title: '',
    candidate_desc: '',
    candidate_btn_text: '',
    candidate_btn_link: '',
    candidate_image: '',
    why_badge: '',
    why_title: '',
    why_subtitle: '',
    why_features: [],
    who_badge: '',
    who_title: '',
    who_desc_1: '',
    who_desc_2: '',
    who_btn_text: '',
    who_btn_link: '',
    who_image: '',
    who_highlights: [],
    who_stat_1_num: '',
    who_stat_1_lbl: '',
    who_stat_2_num: '',
    who_stat_2_lbl: '',
    who_stat_3_num: '',
    who_stat_3_lbl: '',
  });

  const [newHighlight, setNewHighlight] = useState('');
  const [newWhoHighlight, setNewWhoHighlight] = useState('');
  const [heroUploadProgress, setHeroUploadProgress] = useState('');
  const [employerUploadProgress, setEmployerUploadProgress] = useState('');
  const [candidateUploadProgress, setCandidateUploadProgress] = useState('');
  const [whoUploadProgress, setWhoUploadProgress] = useState('');

  // Why Choose Us features modal state
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [editingWhyCard, setEditingWhyCard] = useState(null);
  const [whyCardForm, setWhyCardForm] = useState({ id: '', title: '', description: '', icon: 'LuBriefcaseBusiness', color: '#285e9c' });

  // Services We Provide modal state
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingServiceCard, setEditingServiceCard] = useState(null);
  const [serviceCardForm, setServiceCardForm] = useState({ id: '', title: '', image: '', color: '#285e9c' });
  const [serviceUploadProgress, setServiceUploadProgress] = useState('');
  const [servicesSideUploadProgress, setServicesSideUploadProgress] = useState('');

  // How We Recruit modal state
  const [showRecruitModal, setShowRecruitModal] = useState(false);
  const [editingRecruitCard, setEditingRecruitCard] = useState(null);
  const [recruitCardForm, setRecruitCardForm] = useState({ id: '', title: '', image: '', color: '#285e9c' });
  const [recruitUploadProgress, setRecruitUploadProgress] = useState('');

  const [sectionStatus, setSectionStatus] = useState({
    header: { loading: false, success: false, error: '' },
    highlights: { loading: false, success: false, error: '' },
    stats: { loading: false, success: false, error: '' },
    services: { loading: false, success: false, error: '' },
    recruit: { loading: false, success: false, error: '' },
    portals: { loading: false, success: false, error: '' },
    whychooseus: { loading: false, success: false, error: '' },
    who: { loading: false, success: false, error: '' },
  });

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    try {
      setLoading(true);
      const data = await api.get('/content/homepage_content');
      setFormData({
        hero_badge: data.hero_badge || '',
        hero_title: data.hero_title || '',
        hero_desc_1: data.hero_desc_1 || '',
        hero_desc_2: data.hero_desc_2 || '',
        hero_desc_3: data.hero_desc_3 || '',
        highlights: data.highlights || [],
        whatsapp_number: data.whatsapp_number || '',
        stats_years: data.stats_years || '',
        stats_clients: data.stats_clients || '',
        hero_image: data.hero_image || '',
        services_we_provide: data.services_we_provide || defaultServicesWeProvide,
        how_we_recruit: data.how_we_recruit || defaultHowWeRecruit,
        services_side_image: data.services_side_image || '',
        employer_title: data.employer_title || 'For Employers',
        employer_desc: data.employer_desc || 'Register as an Employer today and publish your job openings.',
        employer_btn_text: data.employer_btn_text || 'Post Your Job For Free',
        employer_btn_link: data.employer_btn_link || '/enquiry',
        employer_image: data.employer_image || 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=200&h=200&fit=crop',
        candidate_title: data.candidate_title || 'For Candidates',
        candidate_desc: data.candidate_desc || 'Register as a candidate today, and discover job opportunities.',
        candidate_btn_text: data.candidate_btn_text || 'Register Candidate',
        candidate_btn_link: data.candidate_btn_link || '/careers',
        candidate_image: data.candidate_image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
        why_badge: data.why_badge || 'WHY CHOOSE US',
        why_title: data.why_title || 'Why Samruddhi HR Services',
        why_subtitle: data.why_subtitle || 'Your trusted partner in comprehensive HR and financial solutions with excellence at every step',
        why_features: data.why_features || defaultWhyFeatures,
        who_badge: data.who_badge || 'About Us',
        who_title: data.who_title || 'Who We Are',
        who_desc_1: data.who_desc_1 || 'Samruddhi HR Services specializes in manpower supply, HR outsourcing, payroll compliance, and corporate financial facilitation services for enterprises, factories, and service organizations.',
        who_desc_2: data.who_desc_2 || 'Our integrated approach helps businesses manage people, processes, and employee financial needs efficiently under one professional service umbrella.',
        who_btn_text: data.who_btn_text || 'Learn More About Us',
        who_btn_link: data.who_btn_link || '/about',
        who_image: data.who_image || '/industriesweserves/who3.png',
        who_highlights: data.who_highlights || ["Enterprises & Factories", "Service Organizations", "Integrated Solutions", "One Professional Umbrella"],
        who_stat_1_num: data.who_stat_1_num || '5000+',
        who_stat_1_lbl: data.who_stat_1_lbl || 'Clients',
        who_stat_2_num: data.who_stat_2_num || '10+',
        who_stat_2_lbl: data.who_stat_2_lbl || 'Years',
        who_stat_3_num: data.who_stat_3_num || '50K+',
        who_stat_3_lbl: data.who_stat_3_lbl || 'Placed',
      });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch homepage content.');
    } finally {
      setLoading(false);
    }
  }

  const handleSaveSection = async (sectionName) => {
    setSectionStatus(prev => ({
      ...prev,
      [sectionName]: { loading: true, success: false, error: '' }
    }));
    try {
      const latestData = await api.get('/content/homepage_content').catch(() => ({}));
      let updatedPayload = { ...latestData };
      
      if (sectionName === 'header') {
        updatedPayload.hero_badge = formData.hero_badge;
        updatedPayload.hero_title = formData.hero_title;
        updatedPayload.hero_desc_1 = formData.hero_desc_1;
        updatedPayload.hero_desc_2 = formData.hero_desc_2;
        updatedPayload.hero_desc_3 = formData.hero_desc_3;
        updatedPayload.hero_image = formData.hero_image;
      } else if (sectionName === 'highlights') {
        updatedPayload.highlights = formData.highlights;
      } else if (sectionName === 'stats') {
        updatedPayload.whatsapp_number = formData.whatsapp_number;
        updatedPayload.stats_years = formData.stats_years;
        updatedPayload.stats_clients = formData.stats_clients;
      } else if (sectionName === 'services') {
        updatedPayload.services_we_provide = formData.services_we_provide;
        updatedPayload.services_side_image = formData.services_side_image;
      } else if (sectionName === 'recruit') {
        updatedPayload.how_we_recruit = formData.how_we_recruit;
      } else if (sectionName === 'portals') {
        updatedPayload.employer_title = formData.employer_title;
        updatedPayload.employer_desc = formData.employer_desc;
        updatedPayload.employer_btn_text = formData.employer_btn_text;
        updatedPayload.employer_btn_link = formData.employer_btn_link;
        updatedPayload.employer_image = formData.employer_image;
        updatedPayload.candidate_title = formData.candidate_title;
        updatedPayload.candidate_desc = formData.candidate_desc;
        updatedPayload.candidate_btn_text = formData.candidate_btn_text;
        updatedPayload.candidate_btn_link = formData.candidate_btn_link;
        updatedPayload.candidate_image = formData.candidate_image;
      } else if (sectionName === 'whychooseus') {
        updatedPayload.why_badge = formData.why_badge;
        updatedPayload.why_title = formData.why_title;
        updatedPayload.why_subtitle = formData.why_subtitle;
        updatedPayload.why_features = formData.why_features;
      } else if (sectionName === 'who') {
        updatedPayload.who_badge = formData.who_badge;
        updatedPayload.who_title = formData.who_title;
        updatedPayload.who_desc_1 = formData.who_desc_1;
        updatedPayload.who_desc_2 = formData.who_desc_2;
        updatedPayload.who_btn_text = formData.who_btn_text;
        updatedPayload.who_btn_link = formData.who_btn_link;
        updatedPayload.who_image = formData.who_image;
        updatedPayload.who_highlights = formData.who_highlights;
        updatedPayload.who_stat_1_num = formData.who_stat_1_num;
        updatedPayload.who_stat_1_lbl = formData.who_stat_1_lbl;
        updatedPayload.who_stat_2_num = formData.who_stat_2_num;
        updatedPayload.who_stat_2_lbl = formData.who_stat_2_lbl;
        updatedPayload.who_stat_3_num = formData.who_stat_3_num;
        updatedPayload.who_stat_3_lbl = formData.who_stat_3_lbl;
      }

      await api.post('/content/homepage_content', updatedPayload);
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    setFormData({
      ...formData,
      highlights: [...formData.highlights, newHighlight.trim()],
    });
    setNewHighlight('');
  };

  const handleRemoveHighlight = (index) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, idx) => idx !== index),
    });
  };

  // Services We Provide Card CRUD
  const handleOpenAddService = () => {
    setEditingServiceCard(null);
    setServiceCardForm({ id: Date.now(), title: '', image: '/services/contract.png', color: '#285e9c' });
    setServiceUploadProgress('');
    setShowServiceModal(true);
  };

  const handleOpenEditService = (card) => {
    setEditingServiceCard(card);
    setServiceCardForm({ id: card.id, title: card.title, image: card.image || '', color: card.color || '#285e9c' });
    setServiceUploadProgress('');
    setShowServiceModal(true);
  };

  const handleSaveServiceCard = (e) => {
    e.preventDefault();
    if (!serviceCardForm.title) return;

    let updatedList;
    if (editingServiceCard) {
      updatedList = formData.services_we_provide.map(c => c.id === serviceCardForm.id ? serviceCardForm : c);
    } else {
      updatedList = [...formData.services_we_provide, serviceCardForm];
    }

    setFormData({
      ...formData,
      services_we_provide: updatedList,
    });
    setShowServiceModal(false);
  };

  const handleDeleteServiceCard = (id) => {
    if (!window.confirm('Are you sure you want to delete this service card?')) return;
    setFormData({
      ...formData,
      services_we_provide: formData.services_we_provide.filter(c => c.id !== id),
    });
  };

  // How We Recruit Card CRUD
  const handleOpenAddRecruit = () => {
    setEditingRecruitCard(null);
    setRecruitCardForm({ id: Date.now(), title: '', image: '/services/socialmedia.png', color: '#285e9c' });
    setRecruitUploadProgress('');
    setShowRecruitModal(true);
  };

  const handleOpenEditRecruit = (card) => {
    setEditingRecruitCard(card);
    setRecruitCardForm({ id: card.id, title: card.title, image: card.image || '', color: card.color || '#285e9c' });
    setRecruitUploadProgress('');
    setShowRecruitModal(true);
  };

  const handleSaveRecruitCard = (e) => {
    e.preventDefault();
    if (!recruitCardForm.title) return;

    let updatedList;
    if (editingRecruitCard) {
      updatedList = formData.how_we_recruit.map(c => c.id === recruitCardForm.id ? recruitCardForm : c);
    } else {
      updatedList = [...formData.how_we_recruit, recruitCardForm];
    }

    setFormData({
      ...formData,
      how_we_recruit: updatedList,
    });
    setShowRecruitModal(false);
  };

  const handleDeleteRecruitCard = (id) => {
    if (!window.confirm('Are you sure you want to delete this recruitment method card?')) return;
    setFormData({
      ...formData,
      how_we_recruit: formData.how_we_recruit.filter(c => c.id !== id),
    });
  };

  // Why Choose Us Card CRUD
  const handleOpenAddWhy = () => {
    setEditingWhyCard(null);
    setWhyCardForm({ id: Date.now(), title: '', description: '', icon: 'LuBriefcaseBusiness', color: '#285e9c' });
    setShowWhyModal(true);
  };

  const handleOpenEditWhy = (card) => {
    setEditingWhyCard(card);
    setWhyCardForm({ id: card.id, title: card.title, description: card.description || '', icon: card.icon || 'LuBriefcaseBusiness', color: card.color || '#285e9c' });
    setShowWhyModal(true);
  };

  const handleSaveWhyCard = (e) => {
    e.preventDefault();
    if (!whyCardForm.title) return;

    let updatedList;
    if (editingWhyCard) {
      updatedList = formData.why_features.map(c => c.id === whyCardForm.id ? whyCardForm : c);
    } else {
      updatedList = [...formData.why_features, whyCardForm];
    }

    setFormData({
      ...formData,
      why_features: updatedList,
    });
    setShowWhyModal(false);
  };

  const handleDeleteWhyCard = (id) => {
    if (!window.confirm('Are you sure you want to delete this feature card?')) return;
    setFormData({
      ...formData,
      why_features: formData.why_features.filter(c => c.id !== id),
    });
  };

  const handleAddWhoHighlight = () => {
    if (!newWhoHighlight.trim()) return;
    setFormData({
      ...formData,
      who_highlights: [...formData.who_highlights, newWhoHighlight.trim()],
    });
    setNewWhoHighlight('');
  };

  const handleRemoveWhoHighlight = (index) => {
    setFormData({
      ...formData,
      who_highlights: formData.who_highlights.filter((_, idx) => idx !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/content/homepage_content', formData);
      setSuccess('Homepage content saved successfully!');
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to update homepage content.');
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.hero_title) {
    return <div style={styles.loading}>Loading content settings...</div>;
  }

  return (
    <div style={styles.container}>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
        <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Home Page</h1>
          <p style={styles.subtitle}>Modify the dynamic text, statistics, highlights, and layout grids shown on the homepage.</p>
        </div>
      </div>

      {error && <div style={styles.errorAlert}>{error}</div>}
      {success && <div style={styles.successAlert}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Top Section Grid */}
        <div style={styles.grid}>
          {/* Left Column: Text fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card" style={styles.card}>
              <div style={styles.cardHeader}>
                <FaHome style={styles.cardIcon} />
                <h3 style={styles.cardTitle}>Hero Header Content</h3>
              </div>

              <div className="form-group">
                <label className="form-label">Top Badge Text</label>
                <input
                  className="form-input"
                  type="text"
                  name="hero_badge"
                  value={formData.hero_badge}
                  onChange={handleInputChange}
                  placeholder="Badge text e.g., Consultation for Manpower..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Main Hero Title</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '60px', resize: 'vertical' }}
                  name="hero_title"
                  value={formData.hero_title}
                  onChange={handleInputChange}
                  placeholder="Main header"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description Paragraph 1 (Strong Text Intro)</label>
                <textarea
                  className="form-input font-bold"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  name="hero_desc_1"
                  value={formData.hero_desc_1}
                  onChange={handleInputChange}
                  placeholder="Samruddhi HR Services is a..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description Paragraph 2</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  name="hero_desc_2"
                  value={formData.hero_desc_2}
                  onChange={handleInputChange}
                  placeholder="We provide contract staffing..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description Paragraph 3 (Financial Services Info)</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  name="hero_desc_3"
                  value={formData.hero_desc_3}
                  onChange={handleInputChange}
                  placeholder="We also offer home loans..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hero Side Image (Path or Upload)</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input
                    className="form-input"
                    type="text"
                    name="hero_image"
                    value={formData.hero_image}
                    onChange={handleInputChange}
                    placeholder="e.g., /home/pragyabehen.png"
                    style={{ flexGrow: 1 }}
                  />
                  {formData.hero_image && (
                    <img
                      src={resolveImage(formData.hero_image)}
                      alt="Hero Side Preview"
                      style={styles.cardThumb}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=80&h=80&fit=crop'; }}
                    />
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const uploadBody = new FormData();
                      uploadBody.append('image', file);
                      try {
                        setHeroUploadProgress('Uploading...');
                        const res = await api.post('/content/upload-image', uploadBody);
                        if (res && res.imageUrl) {
                          setFormData(prev => ({ ...prev, hero_image: res.imageUrl }));
                          setHeroUploadProgress('Upload complete!');
                        }
                      } catch (err) {
                        alert('Upload failed: ' + (err.message || err));
                        setHeroUploadProgress('');
                      }
                    }}
                    style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                  />
                  {heroUploadProgress && <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>{heroUploadProgress}</span>}
                </div>
              </div>
              
              <div style={styles.cardFooter}>
                {sectionStatus.header.error && <span style={styles.cardError}>{sectionStatus.header.error}</span>}
                {sectionStatus.header.success && <span style={styles.cardSuccess}>Header saved!</span>}
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={sectionStatus.header.loading}
                  onClick={() => handleSaveSection('header')}
                >
                  <FaSave />
                  <span>{sectionStatus.header.loading ? 'Saving...' : 'Save Header'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Bullets and Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Highlights */}
            <div className="glass-card" style={styles.card}>
              <div style={styles.cardHeader}>
                <FaListUl style={styles.cardIcon} />
                <h3 style={styles.cardTitle}>Hero Highlight Bullet Points</h3>
              </div>

              <div style={styles.bulletInputRow}>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Add highlight point..."
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHighlight())}
                />
                <button type="button" className="btn btn-primary" onClick={handleAddHighlight} style={styles.addBtn}>
                  <FaPlus />
                </button>
              </div>

              <ul style={styles.bulletsList}>
                {formData.highlights.map((item, idx) => (
                  <li key={idx} style={styles.bulletItem}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newHighlights = [...formData.highlights];
                        newHighlights[idx] = e.target.value;
                        setFormData({ ...formData, highlights: newHighlights });
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
                    <button type="button" style={styles.deleteBtn} onClick={() => handleRemoveHighlight(idx)}>
                      <FaTimes />
                    </button>
                  </li>
                ))}
              </ul>
              
              <div style={styles.cardFooter}>
                {sectionStatus.highlights.error && <span style={styles.cardError}>{sectionStatus.highlights.error}</span>}
                {sectionStatus.highlights.success && <span style={styles.cardSuccess}>Highlights saved!</span>}
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={sectionStatus.highlights.loading}
                  onClick={() => handleSaveSection('highlights')}
                >
                  <FaSave />
                  <span>{sectionStatus.highlights.loading ? 'Saving...' : 'Save Highlights'}</span>
                </button>
              </div>
            </div>

            {/* Socials / Stats */}
            <div className="glass-card" style={styles.card}>
              <div style={styles.cardHeader}>
                <FaCalendarCheck style={styles.cardIcon} />
                <h3 style={styles.cardTitle}>Stats Badges & Social Contact</h3>
              </div>

              <div className="form-group">
                <label className="form-label">WhatsApp Mobile Target (Number only with country code)</label>
                <div style={styles.inputWrapper}>
                  <FaWhatsapp style={styles.inputIcon} />
                  <input
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    type="text"
                    name="whatsapp_number"
                    value={formData.whatsapp_number}
                    onChange={handleInputChange}
                    placeholder="e.g., 918208021948"
                  />
                </div>
              </div>

              <div style={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label">Experience Badge (Years)</label>
                  <input
                    className="form-input"
                    type="text"
                    name="stats_years"
                    value={formData.stats_years}
                    onChange={handleInputChange}
                    placeholder="e.g., 15+"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Happy Clients Badge</label>
                  <input
                    className="form-input"
                    type="text"
                    name="stats_clients"
                    value={formData.stats_clients}
                    onChange={handleInputChange}
                    placeholder="e.g., 5K+"
                  />
                </div>
              </div>
              
              <div style={styles.cardFooter}>
                {sectionStatus.stats.error && <span style={styles.cardError}>{sectionStatus.stats.error}</span>}
                {sectionStatus.stats.success && <span style={styles.cardSuccess}>Stats saved!</span>}
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={sectionStatus.stats.loading}
                  onClick={() => handleSaveSection('stats')}
                >
                  <FaSave />
                  <span>{sectionStatus.stats.loading ? 'Saving...' : 'Save Stats'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Section Grid: Services & Recruitment */}
        <div style={styles.grid}>
          {/* Services We Provide Card List */}
          <div className="glass-card" style={styles.card}>
            <div style={{ ...styles.cardHeader, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FaBriefcase style={styles.cardIcon} />
                <h3 style={styles.cardTitle}>Services We Provide</h3>
              </div>
              <button type="button" className="btn btn-secondary" style={styles.addFeatureBtn} onClick={handleOpenAddService}>
                <FaPlus />
                <span>Add Card</span>
              </button>
            </div>

            {/* Services Section Side Image Upload */}
            <div className="form-group" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
              <label className="form-label">Services Section Side Image (Path or Upload)</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <input
                  className="form-input"
                  type="text"
                  name="services_side_image"
                  value={formData.services_side_image}
                  onChange={handleInputChange}
                  placeholder="e.g., /industriesweserves/services.png"
                  style={{ flexGrow: 1 }}
                />
                {formData.services_side_image && (
                  <img
                    src={resolveImage(formData.services_side_image)}
                    alt="Services Side Preview"
                    style={styles.cardThumb}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=80&h=80&fit=crop'; }}
                  />
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const uploadBody = new FormData();
                    uploadBody.append('image', file);
                    try {
                      setServicesSideUploadProgress('Uploading...');
                      const res = await api.post('/content/upload-image', uploadBody);
                      if (res && res.imageUrl) {
                        setFormData(prev => ({ ...prev, services_side_image: res.imageUrl }));
                        setServicesSideUploadProgress('Upload complete!');
                      }
                    } catch (err) {
                      alert('Upload failed: ' + (err.message || err));
                      setServicesSideUploadProgress('');
                    }
                  }}
                  style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                />
                {servicesSideUploadProgress && <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>{servicesSideUploadProgress}</span>}
              </div>
            </div>

            <div style={styles.servicesList}>
              {formData.services_we_provide.map((card, idx) => (
                <div key={card.id || idx} style={{ ...styles.bulletItem, borderLeft: `5px solid ${card.color || '#285e9c'}`, padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexGrow: 1, minWidth: 0 }}>
                    <img 
                      src={resolveImage(card.image)} 
                      alt={card.title} 
                      style={styles.cardThumb}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=80&h=80&fit=crop'; }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span style={{ fontWeight: '600', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.title}</span>
                      <span style={styles.cardMeta}>Theme Color: {card.color}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                    <button type="button" className="btn btn-secondary" style={styles.miniBtn} onClick={() => handleOpenEditService(card)} title="Edit Card">
                      <FaEdit />
                    </button>
                    <button type="button" className="btn btn-danger" style={styles.miniBtn} onClick={() => handleDeleteServiceCard(card.id)} title="Delete Card">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={styles.cardFooter}>
              {sectionStatus.services.error && <span style={styles.cardError}>{sectionStatus.services.error}</span>}
              {sectionStatus.services.success && <span style={styles.cardSuccess}>Services saved!</span>}
              <button
                type="button"
                className="btn btn-primary"
                disabled={sectionStatus.services.loading}
                onClick={() => handleSaveSection('services')}
              >
                <FaSave />
                <span>{sectionStatus.services.loading ? 'Saving...' : 'Save Services'}</span>
              </button>
            </div>
          </div>

          {/* How We Recruit Card List */}
          <div className="glass-card" style={styles.card}>
            <div style={{ ...styles.cardHeader, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FaListUl style={styles.cardIcon} />
                <h3 style={styles.cardTitle}>How We Recruit</h3>
              </div>
              <button type="button" className="btn btn-secondary" style={styles.addFeatureBtn} onClick={handleOpenAddRecruit}>
                <FaPlus />
                <span>Add Card</span>
              </button>
            </div>

            <div style={styles.servicesList}>
              {formData.how_we_recruit.map((card, idx) => (
                <div key={card.id || idx} style={{ ...styles.bulletItem, borderLeft: `5px solid ${card.color || '#285e9c'}`, padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexGrow: 1, minWidth: 0 }}>
                    <img 
                      src={resolveImage(card.image)} 
                      alt={card.title} 
                      style={styles.cardThumb}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=80&h=80&fit=crop'; }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span style={{ fontWeight: '600', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.title}</span>
                      <span style={styles.cardMeta}>Theme Color: {card.color}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                    <button type="button" className="btn btn-secondary" style={styles.miniBtn} onClick={() => handleOpenEditRecruit(card)} title="Edit Card">
                      <FaEdit />
                    </button>
                    <button type="button" className="btn btn-danger" style={styles.miniBtn} onClick={() => handleDeleteRecruitCard(card.id)} title="Delete Card">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={styles.cardFooter}>
              {sectionStatus.recruit.error && <span style={styles.cardError}>{sectionStatus.recruit.error}</span>}
              {sectionStatus.recruit.success && <span style={styles.cardSuccess}>Methods saved!</span>}
              <button
                type="button"
                className="btn btn-primary"
                disabled={sectionStatus.recruit.loading}
                onClick={() => handleSaveSection('recruit')}
              >
                <FaSave />
                <span>{sectionStatus.recruit.loading ? 'Saving...' : 'Save Methods'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Why Choose Us CMS Card */}
        <div className="glass-card" style={{ ...styles.card, width: '100%' }}>
          <div style={{ ...styles.cardHeader, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FaListUl style={styles.cardIcon} />
              <h3 style={styles.cardTitle}>Why Choose Us Section</h3>
            </div>
            <button type="button" className="btn btn-secondary" style={styles.addFeatureBtn} onClick={handleOpenAddWhy}>
              <FaPlus />
              <span>Add Card</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Section Badge</label>
              <input
                className="form-input"
                type="text"
                name="why_badge"
                value={formData.why_badge}
                onChange={handleInputChange}
                placeholder="WHY CHOOSE US"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Section Title</label>
              <input
                className="form-input"
                type="text"
                name="why_title"
                value={formData.why_title}
                onChange={handleInputChange}
                placeholder="Why Samruddhi HR Services"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Section Subtitle / Description</label>
            <textarea
              className="form-input"
              name="why_subtitle"
              value={formData.why_subtitle}
              onChange={handleInputChange}
              placeholder="Your trusted partner..."
              style={{ minHeight: '60px', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <label className="form-label" style={{ color: 'white', fontWeight: '600', margin: 0 }}>Features Cards Grid</label>
            <button type="button" className="btn btn-secondary" style={styles.addFeatureBtn} onClick={handleOpenAddWhy}>
              <FaPlus />
              <span>Add Card</span>
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {formData.why_features && formData.why_features.map((card, idx) => (
              <div key={card.id || idx} style={{ ...styles.bulletItem, borderLeft: `5px solid ${card.color || '#285e9c'}`, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {renderWhyIcon(card.icon)}
                    <span style={{ fontWeight: '600', color: 'white', fontSize: '0.9rem' }}>Card {idx + 1}: {card.icon}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button type="button" className="btn btn-secondary" style={styles.miniBtn} onClick={() => handleOpenEditWhy(card)} title="Edit Feature">
                      <FaEdit />
                    </button>
                    <button type="button" className="btn btn-danger" style={styles.miniBtn} onClick={() => handleDeleteWhyCard(card.id)} title="Delete Feature">
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontWeight: '600', color: 'var(--accent)', fontSize: '0.9rem' }}>{card.title}</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>{card.description}</p>
                  <span style={{ ...styles.cardMeta, fontSize: '0.7rem' }}>Theme Accent: {card.color}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.cardFooter}>
            {sectionStatus.whychooseus.error && <span style={styles.cardError}>{sectionStatus.whychooseus.error}</span>}
            {sectionStatus.whychooseus.success && <span style={styles.cardSuccess}>Section saved!</span>}
            <button
              type="button"
              className="btn btn-primary"
              disabled={sectionStatus.whychooseus.loading}
              onClick={() => handleSaveSection('whychooseus')}
            >
              <FaSave />
              <span>{sectionStatus.whychooseus.loading ? 'Saving...' : 'Save Why Choose Us'}</span>
            </button>
          </div>
        </div>

        {/* Employers & Candidates Portals Section */}
        <div className="glass-card" style={{ ...styles.card, width: '100%' }}>
          <div style={styles.cardHeader}>
            <FaBriefcase style={styles.cardIcon} />
            <h3 style={styles.cardTitle}>Employers & Candidates Portals</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '2rem' }}>
            {/* Employer Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--accent)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>For Employers Card</h4>
              
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  className="form-input"
                  type="text"
                  name="employer_title"
                  value={formData.employer_title}
                  onChange={handleInputChange}
                  placeholder="For Employers"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  name="employer_desc"
                  value={formData.employer_desc}
                  onChange={handleInputChange}
                  placeholder="Register as an Employer today..."
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Text</label>
                <input
                  className="form-input"
                  type="text"
                  name="employer_btn_text"
                  value={formData.employer_btn_text}
                  onChange={handleInputChange}
                  placeholder="Post Your Job For Free"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Link / Action Route</label>
                <input
                  className="form-input"
                  type="text"
                  name="employer_btn_link"
                  value={formData.employer_btn_link}
                  onChange={handleInputChange}
                  placeholder="e.g., /enquiry"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Employer Image (Path or Upload)</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input
                    className="form-input"
                    type="text"
                    name="employer_image"
                    value={formData.employer_image}
                    onChange={handleInputChange}
                    placeholder="e.g., https://images.unsplash.com/..."
                    style={{ flexGrow: 1 }}
                  />
                  {formData.employer_image && (
                    <img
                      src={resolveImage(formData.employer_image)}
                      alt="Employer Preview"
                      style={styles.cardThumb}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=80&h=80&fit=crop'; }}
                    />
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const uploadBody = new FormData();
                      uploadBody.append('image', file);
                      try {
                        setEmployerUploadProgress('Uploading...');
                        const res = await api.post('/content/upload-image', uploadBody);
                        if (res && res.imageUrl) {
                          setFormData(prev => ({ ...prev, employer_image: res.imageUrl }));
                          setEmployerUploadProgress('Upload complete!');
                        }
                      } catch (err) {
                        alert('Upload failed: ' + (err.message || err));
                        setEmployerUploadProgress('');
                      }
                    }}
                    style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                  />
                  {employerUploadProgress && <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>{employerUploadProgress}</span>}
                </div>
              </div>
            </div>

            {/* Candidate Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--accent)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>For Candidates Card</h4>
              
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  className="form-input"
                  type="text"
                  name="candidate_title"
                  value={formData.candidate_title}
                  onChange={handleInputChange}
                  placeholder="For Candidates"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  name="candidate_desc"
                  value={formData.candidate_desc}
                  onChange={handleInputChange}
                  placeholder="Register as a candidate today..."
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Text</label>
                <input
                  className="form-input"
                  type="text"
                  name="candidate_btn_text"
                  value={formData.candidate_btn_text}
                  onChange={handleInputChange}
                  placeholder="Register Candidate"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Link / Action Route</label>
                <input
                  className="form-input"
                  type="text"
                  name="candidate_btn_link"
                  value={formData.candidate_btn_link}
                  onChange={handleInputChange}
                  placeholder="e.g., /careers"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Candidate Image (Path or Upload)</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input
                    className="form-input"
                    type="text"
                    name="candidate_image"
                    value={formData.candidate_image}
                    onChange={handleInputChange}
                    placeholder="e.g., https://images.unsplash.com/..."
                    style={{ flexGrow: 1 }}
                  />
                  {formData.candidate_image && (
                    <img
                      src={resolveImage(formData.candidate_image)}
                      alt="Candidate Preview"
                      style={styles.cardThumb}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop'; }}
                    />
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const uploadBody = new FormData();
                      uploadBody.append('image', file);
                      try {
                        setCandidateUploadProgress('Uploading...');
                        const res = await api.post('/content/upload-image', uploadBody);
                        if (res && res.imageUrl) {
                          setFormData(prev => ({ ...prev, candidate_image: res.imageUrl }));
                          setCandidateUploadProgress('Upload complete!');
                        }
                      } catch (err) {
                        alert('Upload failed: ' + (err.message || err));
                        setCandidateUploadProgress('');
                      }
                    }}
                    style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                  />
                  {candidateUploadProgress && <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>{candidateUploadProgress}</span>}
                </div>
              </div>
            </div>
          </div>

          <div style={styles.cardFooter}>
            {sectionStatus.portals.error && <span style={styles.cardError}>{sectionStatus.portals.error}</span>}
            {sectionStatus.portals.success && <span style={styles.cardSuccess}>Portals saved!</span>}
            <button
              type="button"
              className="btn btn-primary"
              disabled={sectionStatus.portals.loading}
              onClick={() => handleSaveSection('portals')}
            >
              <FaSave />
              <span>{sectionStatus.portals.loading ? 'Saving...' : 'Save Portals'}</span>
            </button>
          </div>
        </div>

        {/* Who We Are CMS Card */}
        <div className="glass-card" style={{ ...styles.card, width: '100%' }}>
          <div style={styles.cardHeader}>
            <FaHome style={styles.cardIcon} />
            <h3 style={styles.cardTitle}>Who We Are Section</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Section Badge</label>
              <input
                className="form-input"
                type="text"
                name="who_badge"
                value={formData.who_badge}
                onChange={handleInputChange}
                placeholder="About Us"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Section Title</label>
              <input
                className="form-input"
                type="text"
                name="who_title"
                value={formData.who_title}
                onChange={handleInputChange}
                placeholder="Who We Are"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description Paragraph 1 (Strong Text Intro)</label>
            <textarea
              className="form-input"
              style={{ minHeight: '80px', resize: 'vertical' }}
              name="who_desc_1"
              value={formData.who_desc_1}
              onChange={handleInputChange}
              placeholder="Samruddhi HR Services specializes in..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description Paragraph 2</label>
            <textarea
              className="form-input"
              style={{ minHeight: '80px', resize: 'vertical' }}
              name="who_desc_2"
              value={formData.who_desc_2}
              onChange={handleInputChange}
              placeholder="Our integrated approach helps..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Button Text</label>
              <input
                className="form-input"
                type="text"
                name="who_btn_text"
                value={formData.who_btn_text}
                onChange={handleInputChange}
                placeholder="Learn More About Us"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Button Redirect Route</label>
              <input
                className="form-input"
                type="text"
                name="who_btn_link"
                value={formData.who_btn_link}
                onChange={handleInputChange}
                placeholder="/about"
              />
            </div>
          </div>

          {/* Section Image and Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '2rem' }}>
            {/* Image upload */}
            <div className="form-group">
              <label className="form-label">Who We Are Section Image (Path or Upload)</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <input
                  className="form-input"
                  type="text"
                  name="who_image"
                  value={formData.who_image}
                  onChange={handleInputChange}
                  placeholder="e.g., /industriesweserves/who3.png"
                  style={{ flexGrow: 1 }}
                />
                {formData.who_image && (
                  <img
                    src={resolveImage(formData.who_image)}
                    alt="Who We Are Preview"
                    style={styles.cardThumb}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=80&h=80&fit=crop'; }}
                  />
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const uploadBody = new FormData();
                    uploadBody.append('image', file);
                    try {
                      setWhoUploadProgress('Uploading...');
                      const res = await api.post('/content/upload-image', uploadBody);
                      if (res && res.imageUrl) {
                        setFormData(prev => ({ ...prev, who_image: res.imageUrl }));
                        setWhoUploadProgress('Upload complete!');
                      }
                    } catch (err) {
                      alert('Upload failed: ' + (err.message || err));
                      setWhoUploadProgress('');
                    }
                  }}
                  style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                />
                {whoUploadProgress && <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>{whoUploadProgress}</span>}
              </div>
            </div>

            {/* highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label className="form-label">Highlights Bullet Points</label>
              <div style={styles.bulletInputRow}>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Add point e.g. Integrated Solutions"
                  value={newWhoHighlight}
                  onChange={(e) => setNewWhoHighlight(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddWhoHighlight())}
                />
                <button type="button" className="btn btn-primary" onClick={handleAddWhoHighlight} style={styles.addBtn}>
                  <FaPlus />
                </button>
              </div>

              <ul style={styles.bulletsList}>
                {formData.who_highlights && formData.who_highlights.map((item, idx) => (
                  <li key={idx} style={styles.bulletItem}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newWhoHighlights = [...formData.who_highlights];
                        newWhoHighlights[idx] = e.target.value;
                        setFormData({ ...formData, who_highlights: newWhoHighlights });
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
                    <button type="button" style={styles.deleteBtn} onClick={() => handleRemoveWhoHighlight(idx)}>
                      <FaTimes />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stats Badges row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
            <label className="form-label" style={{ color: 'white', fontWeight: '600' }}>Image Stats Overlay Badges</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div className="form-group" style={{ flexGrow: 1 }}>
                  <label className="form-label">Stat 1 Number</label>
                  <input className="form-input" type="text" name="who_stat_1_num" value={formData.who_stat_1_num} onChange={handleInputChange} placeholder="5000+" />
                </div>
                <div className="form-group" style={{ flexGrow: 1 }}>
                  <label className="form-label">Stat 1 Label</label>
                  <input className="form-input" type="text" name="who_stat_1_lbl" value={formData.who_stat_1_lbl} onChange={handleInputChange} placeholder="Clients" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div className="form-group" style={{ flexGrow: 1 }}>
                  <label className="form-label">Stat 2 Number</label>
                  <input className="form-input" type="text" name="who_stat_2_num" value={formData.who_stat_2_num} onChange={handleInputChange} placeholder="10+" />
                </div>
                <div className="form-group" style={{ flexGrow: 1 }}>
                  <label className="form-label">Stat 2 Label</label>
                  <input className="form-input" type="text" name="who_stat_2_lbl" value={formData.who_stat_2_lbl} onChange={handleInputChange} placeholder="Years" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div className="form-group" style={{ flexGrow: 1 }}>
                  <label className="form-label">Stat 3 Number</label>
                  <input className="form-input" type="text" name="who_stat_3_num" value={formData.who_stat_3_num} onChange={handleInputChange} placeholder="50K+" />
                </div>
                <div className="form-group" style={{ flexGrow: 1 }}>
                  <label className="form-label">Stat 3 Label</label>
                  <input className="form-input" type="text" name="who_stat_3_lbl" value={formData.who_stat_3_lbl} onChange={handleInputChange} placeholder="Placed" />
                </div>
              </div>
            </div>
          </div>

          <div style={styles.cardFooter}>
            {sectionStatus.who.error && <span style={styles.cardError}>{sectionStatus.who.error}</span>}
            {sectionStatus.who.success && <span style={styles.cardSuccess}>Section saved!</span>}
            <button
              type="button"
              className="btn btn-primary"
              disabled={sectionStatus.who.loading}
              onClick={() => handleSaveSection('who')}
            >
              <FaSave />
              <span>{sectionStatus.who.loading ? 'Saving...' : 'Save Who We Are'}</span>
            </button>
          </div>
        </div>

        {/* Global Save Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
            <FaSave />
            <span>{loading ? 'Saving Content...' : 'Save Homepage Content'}</span>
          </button>
          {success && <span style={styles.cardSuccess}>{success}</span>}
          {error && <span style={styles.cardError}>{error}</span>}
        </div>
      </form>
    </div>

      {/* Services Modal */}
      {showServiceModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-card animate-fade-in" style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{editingServiceCard ? 'Edit Service Card' : 'Add Service Card'}</h3>
              <button type="button" style={styles.closeBtn} onClick={() => setShowServiceModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveServiceCard} style={styles.modalForm}>
              <div className="form-group">
                <label className="form-label">Card Title</label>
                <input
                  className="form-input"
                  type="text"
                  value={serviceCardForm.title}
                  onChange={(e) => setServiceCardForm({ ...serviceCardForm, title: e.target.value })}
                  placeholder="e.g., Contract Staffing"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Card Image (Path or Upload)</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input
                    className="form-input"
                    type="text"
                    value={serviceCardForm.image}
                    onChange={(e) => setServiceCardForm({ ...serviceCardForm, image: e.target.value })}
                    placeholder="e.g., /services/contract.png"
                    style={{ flexGrow: 1 }}
                  />
                  {serviceCardForm.image && (
                    <img
                      src={resolveImage(serviceCardForm.image)}
                      alt="Preview"
                      style={styles.cardThumb}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=80&h=80&fit=crop'; }}
                    />
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const uploadBody = new FormData();
                      uploadBody.append('image', file);
                      try {
                        setServiceUploadProgress('Uploading...');
                        const res = await api.post('/content/upload-image', uploadBody);
                        if (res && res.imageUrl) {
                          setServiceCardForm(prev => ({ ...prev, image: res.imageUrl }));
                          setServiceUploadProgress('Upload complete!');
                        }
                      } catch (err) {
                        alert('Upload failed: ' + (err.message || err));
                        setServiceUploadProgress('');
                      }
                    }}
                    style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                  />
                  {serviceUploadProgress && <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>{serviceUploadProgress}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Theme Color Accent</label>
                <input
                  className="form-input"
                  type="text"
                  value={serviceCardForm.color}
                  onChange={(e) => setServiceCardForm({ ...serviceCardForm, color: e.target.value })}
                  placeholder="#285e9c"
                />
              </div>

              <div style={styles.modalFooter}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowServiceModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Card</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recruitment Modal */}
      {showRecruitModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-card animate-fade-in" style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{editingRecruitCard ? 'Edit Recruitment Method' : 'Add Recruitment Method'}</h3>
              <button type="button" style={styles.closeBtn} onClick={() => setShowRecruitModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveRecruitCard} style={styles.modalForm}>
              <div className="form-group">
                <label className="form-label">Card Title</label>
                <input
                  className="form-input"
                  type="text"
                  value={recruitCardForm.title}
                  onChange={(e) => setRecruitCardForm({ ...recruitCardForm, title: e.target.value })}
                  placeholder="e.g., Local Colleges"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Card Image (Path or Upload)</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <input
                    className="form-input"
                    type="text"
                    value={recruitCardForm.image}
                    onChange={(e) => setRecruitCardForm({ ...recruitCardForm, image: e.target.value })}
                    placeholder="e.g., /services/local-colleges.png"
                    style={{ flexGrow: 1 }}
                  />
                  {recruitCardForm.image && (
                    <img
                      src={resolveImage(recruitCardForm.image)}
                      alt="Preview"
                      style={styles.cardThumb}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=80&h=80&fit=crop'; }}
                    />
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const uploadBody = new FormData();
                      uploadBody.append('image', file);
                      try {
                        setRecruitUploadProgress('Uploading...');
                        const res = await api.post('/content/upload-image', uploadBody);
                        if (res && res.imageUrl) {
                          setRecruitCardForm(prev => ({ ...prev, image: res.imageUrl }));
                          setRecruitUploadProgress('Upload complete!');
                        }
                      } catch (err) {
                        alert('Upload failed: ' + (err.message || err));
                        setRecruitUploadProgress('');
                      }
                    }}
                    style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                  />
                  {recruitUploadProgress && <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>{recruitUploadProgress}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Theme Color Accent</label>
                <input
                  className="form-input"
                  type="text"
                  value={recruitCardForm.color}
                  onChange={(e) => setRecruitCardForm({ ...recruitCardForm, color: e.target.value })}
                  placeholder="#83a62e"
                />
              </div>

              <div style={styles.modalFooter}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowRecruitModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Card</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Why Choose Us Modal */}
      {showWhyModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-card animate-fade-in" style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{editingWhyCard ? 'Edit Feature Card' : 'Add Feature Card'}</h3>
              <button type="button" style={styles.closeBtn} onClick={() => setShowWhyModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveWhyCard} style={styles.modalForm}>
              <div className="form-group">
                <label className="form-label">Card Title</label>
                <input
                  className="form-input"
                  type="text"
                  value={whyCardForm.title}
                  onChange={(e) => setWhyCardForm({ ...whyCardForm, title: e.target.value })}
                  placeholder="e.g., Industry-specific manpower solutions"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  value={whyCardForm.description}
                  onChange={(e) => setWhyCardForm({ ...whyCardForm, description: e.target.value })}
                  placeholder="e.g., Customized recruitment for diverse sectors..."
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Icon Symbol</label>
                <select
                  className="form-input"
                  value={whyCardForm.icon}
                  onChange={(e) => setWhyCardForm({ ...whyCardForm, icon: e.target.value })}
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'white' }}
                >
                  <option value="LuBriefcaseBusiness">Business Briefcase (LuBriefcaseBusiness)</option>
                  <option value="LiaIndustrySolid">Industry Factory (LiaIndustrySolid)</option>
                  <option value="LiaFileContractSolid">Compliance Document (LiaFileContractSolid)</option>
                  <option value="SlRocket">Rocket Speed (SlRocket)</option>
                  <option value="LiaHandshakeSolid">Ethical Handshake (LiaHandshakeSolid)</option>
                  <option value="LiaChartLineSolid">Growth Chart (LiaChartLineSolid)</option>
                  <option value="FaBriefcase">Briefcase (FaBriefcase)</option>
                  <option value="FaIndustry">Industry (FaIndustry)</option>
                  <option value="FaFileContract">Contract (FaFileContract)</option>
                  <option value="FaRocket">Rocket (FaRocket)</option>
                  <option value="FaHandshake">Handshake (FaHandshake)</option>
                  <option value="FaChartLine">Chart Line (FaChartLine)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Theme Color Accent</label>
                <input
                  className="form-input"
                  type="text"
                  value={whyCardForm.color}
                  onChange={(e) => setWhyCardForm({ ...whyCardForm, color: e.target.value })}
                  placeholder="#285e9c"
                />
              </div>

              <div style={styles.modalFooter}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowWhyModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Feature</button>
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
    maxHeight: '200px',
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
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  submitBtn: {
    display: 'inline-flex',
    alignSelf: 'flex-start',
    gap: '0.5rem',
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
  addFeatureBtn: {
    padding: '0.4rem 0.75rem',
    fontSize: '0.8rem',
    borderRadius: '8px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  servicesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    maxHeight: '380px',
    overflowY: 'auto',
  },
  miniBtn: {
    padding: '0.4rem',
    fontSize: '0.8rem',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
  },
  cardThumb: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    objectFit: 'cover',
    border: '1px solid var(--glass-border)',
    backgroundColor: '#1b2336',
    flexShrink: 0,
  },
  cardMeta: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginTop: '0.15rem',
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
