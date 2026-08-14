import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building2, 
  CheckCircle2, 
  Plus, 
  Send,
  FileText,
  UserCheck
} from 'lucide-react';

export const Internships = () => {
  const { currentUser, showToast, refreshData } = useApp();
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'applications'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Apply Modal State
  const [applyingInternship, setApplyingInternship] = useState(null);
  const [resumeUrl, setResumeUrl] = useState('https://drive.google.com/sample_portfolio.pdf');
  const [coverNote, setCoverNote] = useState('');
  const [submittingApply, setSubmittingApply] = useState(false);

  // Post Internship Modal State
  const [showPostModal, setShowPostModal] = useState(false);
  const [newInternship, setNewInternship] = useState({
    companyName: '',
    title: '',
    location: 'Hybrid (Noida / Remote)',
    type: '6 Months Paid Internship',
    stipend: '₹40,000 / month',
    openings: 6,
    minDurationMonths: 6,
    deadline: '2026-09-15',
    description: '',
    requirements: 'Proficiency in Python and Git',
    logo: '💼'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [intRes, appRes] = await Promise.all([
        api.getInternships({ search: searchQuery }),
        api.getApplications()
      ]);
      setInternships(intRes.data || []);
      setApplications(appRes.data || []);
    } catch (err) {
      console.error('Failed to load internships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyingInternship) return;

    try {
      setSubmittingApply(true);
      await api.applyInternship(applyingInternship.id, {
        studentUserId: currentUser?.id,
        studentName: currentUser?.name,
        studentInstitutionId: currentUser?.institutionId,
        resumeUrl,
        coverNote
      });

      showToast(`Applied for ${applyingInternship.companyName}'s ${applyingInternship.title}!`);
      setApplyingInternship(null);
      setCoverNote('');
      await loadData();
      await refreshData();
    } catch (err) {
      showToast(err.message || 'Application failed', 'error');
    } finally {
      setSubmittingApply(false);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await api.updateApplicationStatus(appId, { status: newStatus });
      showToast(`Application marked as ${newStatus.toUpperCase()}`);
      await loadData();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handlePostInternship = async (e) => {
    e.preventDefault();
    try {
      await api.postInternship(newInternship);
      showToast(`Internship position '${newInternship.title}' posted across cluster!`);
      setShowPostModal(false);
      await loadData();
    } catch (err) {
      showToast(err.message || 'Failed to post internship', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'shortlisted': return 'badge-indigo';
      case 'interviewed': return 'badge-cyan';
      case 'selected': return 'badge-emerald';
      case 'rejected': return 'badge-rose';
      default: return 'badge-amber';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Cluster Internship & Industry Portal</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Direct industry internships pooled exclusively for students across all partner institutions.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', padding: '0.25rem' }}>
            <button 
              onClick={() => setActiveTab('listings')}
              className={`btn btn-sm ${activeTab === 'listings' ? 'btn-primary' : 'btn-outline'}`}
              style={{ border: 'none' }}
            >
              Open Opportunities ({internships.length})
            </button>
            <button 
              onClick={() => setActiveTab('applications')}
              className={`btn btn-sm ${activeTab === 'applications' ? 'btn-primary' : 'btn-outline'}`}
              style={{ border: 'none' }}
            >
              Application Review ({applications.length})
            </button>
          </div>

          {(currentUser?.role === 'recruiter' || currentUser?.role === 'admin') && (
            <button onClick={() => setShowPostModal(true)} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Post Internship</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'listings' ? (
        <>
          {/* Search bar */}
          <div className="glass-panel" style={{ padding: '1rem' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                placeholder="Search company, research domain, stipend, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input"
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>
          </div>

          {/* Internships Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {internships.map((item) => (
              <div 
                key={item.id} 
                className="glass-card" 
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.75rem' }}>{item.logo || '💼'}</span>
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          {item.companyName}
                        </div>
                        <span className="badge badge-emerald" style={{ fontSize: '0.6875rem', marginTop: '2px' }}>
                          Cluster Exclusive
                        </span>
                      </div>
                    </div>
                    <span className="badge badge-indigo">{item.openings} Openings</span>
                  </div>

                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: '1.3' }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.5' }}>
                    {item.description}
                  </p>

                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span><strong style={{ color: '#6ee7b7' }}>Stipend:</strong> {item.stipend}</span>
                      <span><strong style={{ color: '#67e8f9' }}>Location:</strong> {item.location}</span>
                    </div>
                    <div><strong style={{ color: '#a5b4fc' }}>Duration:</strong> {item.type} (Min {item.minDurationMonths} mos)</div>
                    <div><strong style={{ color: '#fcd34d' }}>Deadline:</strong> {item.deadline}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.375rem', fontWeight: 600 }}>KEY REQUIREMENTS</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                      {item.requirements?.map((req, idx) => (
                        <span key={idx} className="badge badge-cyan" style={{ fontSize: '0.6875rem' }}>
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Open to all 5 Cluster Colleges
                  </span>
                  <button 
                    onClick={() => setApplyingInternship(item)}
                    className="btn btn-primary btn-sm"
                  >
                    <Send size={14} />
                    <span>Apply Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Applications Review Pipeline */
        <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Candidate</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Institution</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Position & Company</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Pipeline Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <div style={{ fontWeight: 700 }}>{app.studentName}</div>
                    <a href={app.resumeUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', textDecoration: 'none' }}>
                      📄 View Resume / Dossier
                    </a>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>
                    {app.studentInstitutionName}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <div style={{ fontWeight: 600 }}>{app.internshipTitle}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{app.companyName} • {app.stipend}</div>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span className={`badge ${getStatusBadge(app.status)}`}>
                      {app.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <button 
                        onClick={() => handleStatusUpdate(app.id, 'shortlisted')}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                      >
                        Shortlist
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(app.id, 'selected')}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                      >
                        Accept
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Apply Modal */}
      <Modal
        isOpen={Boolean(applyingInternship)}
        onClose={() => setApplyingInternship(null)}
        title={`Apply for ${applyingInternship?.title || ''}`}
      >
        <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.875rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8125rem' }}>
            <div><strong>Company:</strong> {applyingInternship?.companyName}</div>
            <div><strong>Stipend:</strong> {applyingInternship?.stipend}</div>
            <div><strong>Applicant:</strong> {currentUser?.name} ({currentUser?.department})</div>
          </div>

          <div className="form-group">
            <label className="form-label">Resume / GitHub / Portfolio Link</label>
            <input 
              type="url"
              required
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Personal Statement / Why You're a Fit</label>
            <textarea 
              rows={3}
              required
              placeholder="Highlight relevant course projects, lab sessions, or cluster certifications..."
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              className="textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setApplyingInternship(null)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={submittingApply} className="btn btn-primary">
              {submittingApply ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Post Internship Modal */}
      <Modal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        title="Post Cluster-Wide Internship Opportunity"
      >
        <form onSubmit={handlePostInternship} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Hiring Company</label>
              <input 
                type="text"
                required
                placeholder="E.g. NVIDIA Research / Ather Energy"
                value={newInternship.companyName}
                onChange={(e) => setNewInternship({ ...newInternship, companyName: e.target.value })}
                className="input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Role Title</label>
              <input 
                type="text"
                required
                placeholder="E.g. Autonomous Navigation Intern"
                value={newInternship.title}
                onChange={(e) => setNewInternship({ ...newInternship, title: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Monthly Stipend</label>
              <input 
                type="text"
                required
                placeholder="E.g. ₹45,000 / month"
                value={newInternship.stipend}
                onChange={(e) => setNewInternship({ ...newInternship, stipend: e.target.value })}
                className="input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Location / Mode</label>
              <input 
                type="text"
                value={newInternship.location}
                onChange={(e) => setNewInternship({ ...newInternship, location: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description & Work Scope</label>
            <textarea 
              rows={3}
              placeholder="What will the intern work on..."
              value={newInternship.description}
              onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
              className="textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Key Requirements (Comma-separated)</label>
            <input 
              type="text"
              placeholder="E.g. ROS2, Python, Computer Vision, C++"
              value={newInternship.requirements}
              onChange={(e) => setNewInternship({ ...newInternship, requirements: e.target.value })}
              className="input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setShowPostModal(false)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Broadcast to Cluster Colleges
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
