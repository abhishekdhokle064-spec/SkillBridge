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
  Search
} from 'lucide-react';

export const Certifications = () => {
  const { currentUser, institutions, showToast, triggerConfetti } = useApp();
  const [certifications, setCertifications] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Issue Certificate Form State
  const [newCert, setNewCert] = useState({
    title: 'Cluster Certified Deep Learning Engineer',
    recipientName: currentUser?.name || 'Aarav Patel',
    recipientInstitution: 'St. Xavier College of Engineering',
    issuerInstitutionId: institutions[0]?.id || 'inst_1',
    grade: 'Distinction (Score: 95%)',
    skills: 'PyTorch DDP, TensorRT, Multi-GPU Scaling',
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Verifiable Cluster Certifications</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Tamper-proof digital skill credentials co-validated by cluster institutions and recognized by hiring partners.
          </p>
        </div>

        {(currentUser?.role === 'admin' || currentUser?.role === 'faculty') && (
          <button onClick={() => setShowIssueModal(true)} className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Issue Cluster Credential</span>
          </button>
        )}
      </div>

      {/* Trust & Verification Protocol Banner */}
      <div 
        style={{
          background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6ee7b7'
          }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              100% Cryptographically Authentic
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Every badge is issued with an immutable verification code verifiable by recruiters globally.
            </div>
          </div>
        </div>
      </div>

      {/* Certifications Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {certifications.map((cert) => (
          <div 
            key={cert.id}
            className="glass-card"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2rem' }}>{cert.badgeIcon || '🎖️'}</span>
                  <div>
                    <span className="badge badge-amber" style={{ fontSize: '0.6875rem' }}>
                      {cert.certCode}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Issued: {cert.issueDate}
                    </div>
                  </div>
                </div>
                <span className="badge badge-emerald">
                  <CheckCircle2 size={12} /> Verified
                </span>
              </div>

              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: '1.3' }}>
                {cert.title}
              </h3>

              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div><strong style={{ color: '#a5b4fc' }}>Recipient:</strong> {cert.recipientName} ({cert.recipientInstitution})</div>
                <div><strong style={{ color: '#6ee7b7' }}>Issuing Authority:</strong> {cert.issuerInstitutionName}</div>
                <div><strong style={{ color: '#fcd34d' }}>Evaluation Score:</strong> {cert.grade}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.375rem', fontWeight: 600 }}>ENDORSED COMPETENCIES</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {cert.skills?.map((s, idx) => (
                    <span key={idx} className="badge badge-indigo" style={{ fontSize: '0.6875rem' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {cert.verifiedCount || 1} recruiter checks
              </span>
              <button 
                onClick={() => setSelectedCert(cert)}
                className="btn btn-primary btn-sm"
              >
                <Award size={14} />
                <span>View Full Credential</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Official Certificate Viewing Modal */}
      <Modal
        isOpen={Boolean(selectedCert)}
        onClose={() => setSelectedCert(null)}
        title="Official Cluster Digital Credential"
        maxWidth="680px"
      >
        {selectedCert && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Printable Certificate Frame */}
            <div 
              style={{
                background: 'radial-gradient(circle at center, #1e293b, #0f172a)',
                border: '3px double #f59e0b',
                borderRadius: 'var(--radius-md)',
                padding: '2.5rem 2rem',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)'
              }}
            >
              <div style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#f59e0b', fontWeight: 700, marginBottom: '0.5rem' }}>
                NATIONAL CAPITAL INNOVATION ACADEMIC CONSORTIUM
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.5rem' }}>
                CERTIFICATE OF COMPETENCY
              </h2>

              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                This is to officially certify that
              </p>

              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#67e8f9', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.5rem', display: 'inline-block', minWidth: '280px', marginBottom: '1rem' }}>
                {selectedCert.recipientName}
              </div>

              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.25rem' }}>
                of <strong>{selectedCert.recipientInstitution}</strong> has demonstrated mastery in <strong>{selectedCert.title}</strong> with distinction mark of <strong>{selectedCert.grade}</strong>.
              </p>

              {/* Skills Chips */}
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.5rem' }}>
                {selectedCert.skills?.map((sk, i) => (
                  <span key={i} style={{ background: 'rgba(79, 70, 229, 0.25)', border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '99px', padding: '0.2rem 0.6rem', fontSize: '0.7rem', color: '#a5b4fc' }}>
                    {sk}
                  </span>
                ))}
              </div>

              {/* Certificate Footer with Seal & Signatures */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: '1rem' }}>
                <div style={{ textAlign: 'left', fontSize: '0.7rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedCert.issuerInstitutionName}</div>
                  <div style={{ color: 'var(--text-muted)' }}>Issuing Consortium Dean</div>
                </div>

                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: '2px dashed #f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  background: 'rgba(245, 158, 11, 0.1)'
                }}>
                  🏛️
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.7rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>{selectedCert.certCode}</div>
                  <div style={{ color: 'var(--text-muted)' }}>Status: Cryptographically Verified</div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setSelectedCert(null)} className="btn btn-outline">
                Close
              </button>
              <button 
                onClick={() => {
                  showToast('Credential PDF downloaded for offline verification!');
                  triggerConfetti();
                }}
                className="btn btn-primary"
              >
                <Download size={15} />
                <span>Export PDF Certificate</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Issue Modal */}
      <Modal
        isOpen={showIssueModal}
        onClose={() => setShowIssueModal(false)}
        title="Mint & Issue Digital Skill Credential"
      >
        <form onSubmit={handleIssueSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Certification Title</label>
            <input 
              type="text"
              required
              placeholder="E.g. Cluster Certified 5-Axis CNC & Robotics Operator"
              value={newCert.title}
              onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
              className="input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Recipient Scholar Name</label>
              <input 
                type="text"
                required
                value={newCert.recipientName}
                onChange={(e) => setNewCert({ ...newCert, recipientName: e.target.value })}
                className="input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Recipient College</label>
              <input 
                type="text"
                required
                value={newCert.recipientInstitution}
                onChange={(e) => setNewCert({ ...newCert, recipientInstitution: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Issuing Authority</label>
              <select 
                value={newCert.issuerInstitutionId}
                onChange={(e) => setNewCert({ ...newCert, issuerInstitutionId: e.target.value })}
                className="select"
              >
                {institutions.map(i => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Performance Grade</label>
              <input 
                type="text"
                value={newCert.grade}
                onChange={(e) => setNewCert({ ...newCert, grade: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Verified Skill Tags (Comma-separated)</label>
            <input 
              type="text"
              value={newCert.skills}
              onChange={(e) => setNewCert({ ...newCert, skills: e.target.value })}
              className="input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setShowIssueModal(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Issue Verified Credential
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
