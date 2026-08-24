import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { 
  Award, 
  ShieldCheck, 
  ExternalLink, 
  Download, 
  Plus, 
  CheckCircle2, 
  QrCode,
  Sparkles,
  Search,
  Copy,
  Check,
  Share2,
  Printer,
  GraduationCap,
  Building2,
  Calendar,
  Star,
  FileCheck,
  Lock,
  Filter,
  Users
} from 'lucide-react';

export const Certifications = () => {
  const { currentUser, institutions, showToast, triggerConfetti } = useApp();
  const [certifications, setCertifications] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [copiedCode, setCopiedCode] = useState(null);

  // Issue Certificate Form State
  const [newCert, setNewCert] = useState({
    title: 'Cluster Certified Deep Learning Engineer',
    recipientName: currentUser?.name || 'Rahul Sharma',
    recipientInstitution: currentUser?.institutionName || 'Government Engineering College, Nashik',
    issuerInstitutionId: institutions[0]?.id || 'inst_1',
    grade: 'Distinction (Score: 95%)',
    skills: 'PyTorch DDP, TensorRT, Multi-GPU Scaling, CUDA Optimization',
    badgeIcon: '🏆'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getCertifications();
      setCertifications(res.data || []);
    } catch (err) {
      console.error('Failed to load certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCopyCode = (code, e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Verification code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handlePrintCertificate = () => {
    showToast('Preparing high-resolution certificate for print / export...');
    triggerConfetti();
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleShareCertificate = (cert) => {
    const text = `I'm proud to share my verified credential: "${cert.title}" co-accredited by ${cert.issuerInstitutionName} under the Western Maharashtra Innovation Consortium (Code: ${cert.certCode})!`;
    navigator.clipboard.writeText(text);
    showToast('Credential details and verification link copied for sharing!');
    triggerConfetti();
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.issueCertificate(newCert);
      showToast(res.message || 'Certificate successfully minted on cluster ledger!');
      triggerConfetti();
      setShowIssueModal(false);
      await loadData();
    } catch (err) {
      showToast(err.message || 'Failed to issue certificate', 'error');
    }
  };

  // Domain Filter definitions
  const domains = ['All', 'AI & Deep Learning', 'Robotics & Automation', 'IoT & Edge', 'Semiconductors & EV'];

  const filteredCerts = certifications.filter(cert => {
    const matchesSearch = 
      (cert.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cert.recipientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cert.certCode || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cert.issuerInstitutionName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(cert.skills) && cert.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));

    if (!matchesSearch) return false;

    if (selectedDomain === 'All') return true;
    if (selectedDomain === 'AI & Deep Learning') {
      return (cert.title || '').toLowerCase().includes('deep learning') || (cert.title || '').toLowerCase().includes('ai');
    }
    if (selectedDomain === 'Robotics & Automation') {
      return (cert.title || '').toLowerCase().includes('robot') || (cert.title || '').toLowerCase().includes('automation');
    }
    if (selectedDomain === 'IoT & Edge') {
      return (cert.title || '').toLowerCase().includes('iot') || (cert.title || '').toLowerCase().includes('edge');
    }
    if (selectedDomain === 'Semiconductors & EV') {
      return (cert.title || '').toLowerCase().includes('cleanroom') || (cert.title || '').toLowerCase().includes('ev') || (cert.title || '').toLowerCase().includes('powertrain');
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* 1. Header Section */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563EB, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <Award size={18} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
              Verifiable Cluster Credentials
            </h1>
          </div>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '0.15rem' }}>
            Cryptographically authentic skill credentials co-validated by cluster member institutions and trusted by top hiring partners.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={() => setShowIssueModal(true)} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.15rem',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            <Plus size={16} />
            <span>Mint & Issue Credential</span>
          </button>
        </div>
      </div>

      {/* 2. Top Stats Overview (4 Clean KPI Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.15rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
            🎓
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Active Cluster Credentials</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.2' }}>{certifications.length}</div>
            <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600 }}>+100% Co-Accredited</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.15rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
            🛡️
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Cryptographic Ledger</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.2' }}>100%</div>
            <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>Immutable & Tamper-Proof</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.15rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#FFFBEB', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
            🏛️
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Consortium Partner Colleges</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.2' }}>{institutions.length || 6}</div>
            <div style={{ fontSize: '0.7rem', color: '#D97706', fontWeight: 600 }}>Autonomous Institutes</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.15rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#F5F3FF', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
            💼
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Recruiter Validations</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.2' }}>76+</div>
            <div style={{ fontSize: '0.7rem', color: '#7C3AED', fontWeight: 600 }}>Instant Ledger Lookups</div>
          </div>
        </div>

      </div>

      {/* 3. Search & Filter Bar */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.15rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '280px', maxWidth: '460px' }}>
            <Search size={17} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              type="text"
              placeholder="Search by scholar name, certificate title, skill or cert code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 1rem 0.6rem 2.4rem',
                backgroundColor: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#0F172A',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>
            Showing <strong>{filteredCerts.length}</strong> verified credentials
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '9999px',
                border: selectedDomain === dom ? '1px solid #2563EB' : '1px solid #E2E8F0',
                backgroundColor: selectedDomain === dom ? '#EFF6FF' : '#FFFFFF',
                color: selectedDomain === dom ? '#2563EB' : '#475569',
                fontWeight: selectedDomain === dom ? 700 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Certifications Grid (Luminous & High-Contrast Design) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {filteredCerts.map((cert) => (
          <div 
            key={cert.id}
            className="cert-card-premium"
          >
            {/* Top Accent Gradient Bar */}
            <div 
              className="cert-top-bar"
              style={{
                background: cert.title.toLowerCase().includes('deep learning') || cert.title.toLowerCase().includes('ai')
                  ? 'linear-gradient(90deg, #2563EB, #38BDF8, #818CF8)'
                  : cert.title.toLowerCase().includes('robot')
                  ? 'linear-gradient(90deg, #F59E0B, #FBBF24, #F97316)'
                  : cert.title.toLowerCase().includes('cleanroom')
                  ? 'linear-gradient(90deg, #10B981, #34D399, #06B6D4)'
                  : cert.title.toLowerCase().includes('ev')
                  ? 'linear-gradient(90deg, #EC4899, #F43F5E, #FB7185)'
                  : 'linear-gradient(90deg, #8B5CF6, #6366F1, #3B82F6)'
              }}
            />

            <div className="cert-card-body">
              {/* Header with Icon, Cert Code, and Verified Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                    border: '2px solid #F59E0B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.2)'
                  }}>
                    {cert.badgeIcon || '🏆'}
                  </div>

                  <div>
                    <button 
                      onClick={(e) => handleCopyCode(cert.certCode, e)}
                      className="cert-code-pill"
                      title="Click to copy verification code"
                      style={{ cursor: 'pointer', border: '1px solid #BFDBFE' }}
                    >
                      {copiedCode === cert.certCode ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                      <span>{cert.certCode}</span>
                    </button>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '3px' }}>
                      Issued: {cert.issueDate || '2025-07-28'}
                    </div>
                  </div>
                </div>

                <span className="cert-verified-pill">
                  <CheckCircle2 size={13} />
                  <span>Verified</span>
                </span>
              </div>

              {/* Credential Title */}
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.35', marginBottom: '0.5rem' }}>
                {cert.title}
              </h3>

              {/* Structured Metadata Box (Light & High Contrast) */}
              <div className="cert-meta-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GraduationCap size={15} color="#2563EB" style={{ flexShrink: 0 }} />
                  <span style={{ color: '#64748B' }}>Recipient:</span>
                  <strong style={{ color: '#0F172A' }}>{cert.recipientName}</strong>
                  <span style={{ fontSize: '0.72rem', color: '#64748B', backgroundColor: '#E2E8F0', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                    {cert.recipientInstitution}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={15} color="#059669" style={{ flexShrink: 0 }} />
                  <span style={{ color: '#64748B' }}>Issuer:</span>
                  <strong style={{ color: '#059669' }}>{cert.issuerInstitutionName}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star size={15} color="#D97706" style={{ flexShrink: 0 }} />
                  <span style={{ color: '#64748B' }}>Evaluation:</span>
                  <strong style={{ color: '#D97706', backgroundColor: '#FEF3C7', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                    {cert.grade}
                  </strong>
                </div>
              </div>

              {/* Endorsed Competencies */}
              <div style={{ marginTop: '0.25rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                  ENDORSED COMPETENCIES
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {cert.skills?.map((s, idx) => (
                    <span key={idx} className="cert-skill-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer with Audit Counter and Actions */}
            <div style={{ 
              padding: '1rem 1.5rem', 
              borderTop: '1px solid #F1F5F9', 
              backgroundColor: '#FAFAFA', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              gap: '0.75rem'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={14} color="#10B981" />
                <span><strong>{cert.verifiedCount || 12}</strong> recruiter checks</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button 
                  onClick={() => setSelectedCert(cert)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.9rem',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Award size={14} />
                  <span>View Full Credential</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* 5. Masterpiece Digital Certificate Modal */}
      <Modal
        isOpen={Boolean(selectedCert)}
        onClose={() => setSelectedCert(null)}
        title="Official Inter-Institutional Digital Credential"
        maxWidth="740px"
      >
        {selectedCert && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* The Masterpiece Printable Diploma Frame */}
            <div className="official-diploma-sheet">
              {/* Decorative Corner Flanges */}
              <div className="diploma-corner-ornament top-left" />
              <div className="diploma-corner-ornament top-right" />
              <div className="diploma-corner-ornament bottom-left" />
              <div className="diploma-corner-ornament bottom-right" />

              <div style={{ textAlign: 'center' }}>
                <div className="diploma-consortium-name">
                  WESTERN MAHARASHTRA ACADEMIC & INNOVATION CONSORTIUM
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748B', letterSpacing: '0.05em', marginBottom: '0.85rem' }}>
                  Co-Accredited under National Skill Qualification Framework (NSQF) & Inter-College MOU
                </div>

                <h2 className="diploma-main-heading">
                  CERTIFICATE OF COMPETENCY
                </h2>

                <p style={{ fontSize: '0.85rem', color: '#64748B', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                  This is to officially certify that
                </p>

                <div className="diploma-recipient-title">
                  {selectedCert.recipientName}
                </div>

                <p style={{ fontSize: '0.875rem', color: '#334155', maxWidth: '520px', margin: '0 auto 1.25rem', lineHeight: '1.6' }}>
                  of <strong>{selectedCert.recipientInstitution}</strong> has successfully completed the rigorous evaluation and demonstrated mastery in <strong>{selectedCert.title}</strong> with distinction mark of <strong style={{ color: '#B45309' }}>{selectedCert.grade}</strong>.
                </p>

                {/* Verified Competencies */}
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.75rem' }}>
                  {selectedCert.skills?.map((sk, i) => (
                    <span 
                      key={i} 
                      style={{ 
                        background: '#EFF6FF', 
                        border: '1px solid #BFDBFE', 
                        borderRadius: '9999px', 
                        padding: '0.25rem 0.75rem', 
                        fontSize: '0.75rem', 
                        color: '#1E40AF',
                        fontWeight: 600
                      }}
                    >
                      ✓ {sk}
                    </span>
                  ))}
                </div>

                {/* Footer with Dean Signature, 3D Gold Embossed Seal, and Cryptographic Proof */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  borderTop: '2px solid #E2E8F0', 
                  paddingTop: '1.25rem', 
                  marginTop: '0.5rem',
                  gap: '1rem'
                }}>
                  
                  {/* Left: Authorized Signature */}
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.1rem', color: '#1E3A8A', fontWeight: 700, lineHeight: '1' }}>
                      Prof. Dr. V. K. Ramanujan
                    </div>
                    <div style={{ width: '130px', height: '1px', backgroundColor: '#64748B', margin: '4px 0' }} />
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F172A' }}>{selectedCert.issuerInstitutionName}</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748B' }}>Dean of Academic Cluster Affairs</div>
                  </div>

                  {/* Center: Radiant 3D Gold Embossed Seal */}
                  <div className="gold-embossed-seal">
                    <span style={{ fontSize: '2rem' }}>🏛️</span>
                  </div>

                  {/* Right: Cryptographic QR Code & Verification Status */}
                  <div style={{ textAlign: 'right', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #CBD5E1', 
                      padding: '4px', 
                      borderRadius: '6px',
                      display: 'inline-block',
                      marginBottom: '4px'
                    }}>
                      <svg width="42" height="42" viewBox="0 0 100 100">
                        {/* Realistic Mock SVG QR Code */}
                        <rect width="100" height="100" fill="#FFFFFF"/>
                        <rect x="10" y="10" width="30" height="30" fill="#0F172A"/>
                        <rect x="15" y="15" width="20" height="20" fill="#FFFFFF"/>
                        <rect x="20" y="20" width="10" height="10" fill="#0F172A"/>
                        <rect x="60" y="10" width="30" height="30" fill="#0F172A"/>
                        <rect x="65" y="15" width="20" height="20" fill="#FFFFFF"/>
                        <rect x="70" y="20" width="10" height="10" fill="#0F172A"/>
                        <rect x="10" y="60" width="30" height="30" fill="#0F172A"/>
                        <rect x="15" y="65" width="20" height="20" fill="#FFFFFF"/>
                        <rect x="20" y="70" width="10" height="10" fill="#0F172A"/>
                        <rect x="45" y="15" width="8" height="8" fill="#0F172A"/>
                        <rect x="45" y="45" width="10" height="10" fill="#0F172A"/>
                        <rect x="60" y="60" width="12" height="12" fill="#0F172A"/>
                        <rect x="75" y="75" width="15" height="15" fill="#0F172A"/>
                      </svg>
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1E40AF', fontFamily: 'monospace' }}>
                      {selectedCert.certCode}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Lock size={10} /> Validated on Cluster Ledger
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Modal Actions Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleCopyCode(selectedCert.certCode)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 0.9rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  <Copy size={14} />
                  <span>Copy Code</span>
                </button>

                <button 
                  onClick={() => handleShareCertificate(selectedCert)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 0.9rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  <Share2 size={14} />
                  <span>Share Credential</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => setSelectedCert(null)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#F1F5F9',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#475569',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>

                <button 
                  onClick={handlePrintCertificate}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1.25rem',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                  }}
                >
                  <Download size={15} />
                  <span>Export Official PDF</span>
                </button>
              </div>
            </div>

          </div>
        )}
      </Modal>

      {/* 6. Mint & Issue Certificate Modal */}
      <Modal
        isOpen={showIssueModal}
        onClose={() => setShowIssueModal(false)}
        title="Mint & Issue Verifiable Digital Skill Credential"
      >
        <form onSubmit={handleIssueSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Certification Title
            </label>
            <input 
              type="text"
              required
              placeholder="E.g. Cluster Certified 5-Axis CNC & Robotics Operator"
              value={newCert.title}
              onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Recipient Scholar Name
              </label>
              <input 
                type="text"
                required
                value={newCert.recipientName}
                onChange={(e) => setNewCert({ ...newCert, recipientName: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Recipient College / Institute
              </label>
              <input 
                type="text"
                required
                value={newCert.recipientInstitution}
                onChange={(e) => setNewCert({ ...newCert, recipientInstitution: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Issuing Consortium Authority
              </label>
              <select 
                value={newCert.issuerInstitutionId}
                onChange={(e) => setNewCert({ ...newCert, issuerInstitutionId: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', backgroundColor: '#FFFFFF' }}
              >
                {institutions.map(i => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                Performance Grade & Distinction
              </label>
              <input 
                type="text"
                value={newCert.grade}
                onChange={(e) => setNewCert({ ...newCert, grade: e.target.value })}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Verified Skill Competencies (Comma-separated)
            </label>
            <input 
              type="text"
              value={newCert.skills}
              onChange={(e) => setNewCert({ ...newCert, skills: e.target.value })}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
            <button 
              type="button" 
              onClick={() => setShowIssueModal(false)} 
              style={{
                padding: '0.6rem 1.15rem',
                backgroundColor: '#F1F5F9',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.6rem 1.4rem',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
              }}
            >
              <Sparkles size={16} />
              <span>Issue Verified Credential</span>
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
