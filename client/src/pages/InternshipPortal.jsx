import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { ReviewModal } from '../components/ReviewModal';
import { ReviewCard } from '../components/ReviewCard';
import { StarRating } from '../components/StarRating';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Clock, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Send,
  Sparkles,
  Star,
  MessageSquare
} from 'lucide-react';

export const InternshipPortal = () => {
  const { currentUser, showToast, triggerConfetti } = useApp();
  const [internships, setInternships] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [applyingJob, setApplyingJob] = useState(null);
  const [resumeLink, setResumeLink] = useState('https://drive.google.com/rahul_sharma_portfolio.pdf');

  // Reviews State
  const [reviewInternship, setReviewInternship] = useState(null);
  const [showInternshipReviewModal, setShowInternshipReviewModal] = useState(false);
  const [viewingReviewsJob, setViewingReviewsJob] = useState(null);
  const [jobReviews, setJobReviews] = useState([]);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await api.getInternships();
        setInternships(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInternships();
  }, []);

  const handleApply = (e) => {
    e.preventDefault();
    if (!applyingJob) return;

    showToast(`Application submitted for ${applyingJob.companyName}'s ${applyingJob.title}!`);
    triggerConfetti();
    setApplyingJob(null);
  };

  const filtered = internships.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || item.type.toLowerCase().includes(selectedFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header matching Image 2 */}
      <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
          Internship Portal
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
          Kickstart your career with top companies
        </p>
      </div>

      {/* Search Bar Widget */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid #E2E8F0', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input 
            type="text"
            placeholder="Search internships..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.875rem', outline: 'none' }}
          />
        </div>

        <select style={{ padding: '0.65rem 1rem', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.875rem', color: '#475569', outline: 'none', backgroundColor: '#FFFFFF' }}>
          <option>Any Location</option>
          <option>Pune, Maharashtra</option>
          <option>Bengaluru, Karnataka</option>
          <option>Mumbai, Maharashtra</option>
        </select>

        <button 
          style={{ padding: '0.65rem 1.75rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
        >
          Search
        </button>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {['All', 'Technology', 'Manufacturing', 'Research', 'Government'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            style={{
              padding: '0.35rem 0.95rem',
              borderRadius: '9999px',
              border: selectedFilter === cat ? '1px solid #2563EB' : '1px solid #E2E8F0',
              backgroundColor: selectedFilter === cat ? '#EFF6FF' : '#FFFFFF',
              color: selectedFilter === cat ? '#1D4ED8' : '#64748B',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Internship Cards Grid matching Image 2 Bottom-Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {filtered.map((item) => (
          <div 
            key={item.id}
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              {/* Company Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#1E3A8A', fontSize: '0.9rem' }}>
                  {item.companyName}
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', lineHeight: '1.2' }}>
                    {item.title}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {item.companyFull || item.companyName}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#64748B', marginBottom: '0.75rem' }}>
                <MapPin size={13} color="#2563EB" />
                <span>{item.location}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#D97706', fontWeight: 700 }}>
                  <Star size={14} color="#F59E0B" fill="#F59E0B" />
                  <span>{item.id === 'int_1' ? '4.8' : (item.id === 'int_3' ? '5.0' : '4.9')}</span>
                  <span style={{ color: '#64748B', fontWeight: 500 }}>
                    ({item.id === 'int_1' ? '14' : (item.id === 'int_3' ? '16' : '10')} Alumni Reviews)
                  </span>
                </div>
                <button
                  onClick={async () => {
                    const res = await api.getReviews({ targetType: 'internship', targetId: item.id });
                    setJobReviews(res.data || []);
                    setViewingReviewsJob(item);
                  }}
                  style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  View Reviews
                </button>
              </div>

              {/* Skills Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.85rem' }}>
                {item.skills?.map((sk, idx) => (
                  <span key={idx} style={{ backgroundColor: '#F1F5F9', color: '#334155', fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 500 }}>
                    {sk}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', backgroundColor: '#F8FAFC', padding: '0.6rem 0.75rem', borderRadius: '6px', marginBottom: '1rem' }}>
                <div>⏱️ <strong>Duration:</strong> {item.duration}</div>
                <div>📅 <strong>Deadline:</strong> {item.deadline}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '0.5rem' }}>
              <button 
                onClick={() => { setReviewInternship(item); setShowInternshipReviewModal(true); }}
                style={{ padding: '0.55rem', backgroundColor: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
              >
                <Star size={13} fill="#F59E0B" color="#F59E0B" />
                <span>Rate</span>
              </button>
              <button 
                onClick={() => setApplyingJob(item)}
                style={{ padding: '0.55rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)' }}
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={Boolean(applyingJob)}
        onClose={() => setApplyingJob(null)}
        title={`Apply for ${applyingJob?.title || ''}`}
      >
        <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.8125rem' }}>
            <div><strong>Company:</strong> {applyingJob?.companyName}</div>
            <div><strong>Location:</strong> {applyingJob?.location}</div>
            <div><strong>Applicant:</strong> {currentUser?.name} ({currentUser?.institutionName || 'GEC Nashik'})</div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
              Portfolio / GitHub / Resume Link
            </label>
            <input 
              type="url"
              required
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setApplyingJob(null)} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit Application
            </button>
          </div>
        </form>
      </Modal>

      {/* Viewing Internship Alumni Reviews Modal */}
      <Modal
        isOpen={Boolean(viewingReviewsJob)}
        onClose={() => setViewingReviewsJob(null)}
        title={`Alumni Reviews: ${viewingReviewsJob?.companyName} - ${viewingReviewsJob?.title}`}
        maxWidth="620px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>Verified Internship Reviews</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Real feedback from cluster scholars who completed this internship.</div>
            </div>
            <button
              onClick={() => {
                const job = viewingReviewsJob;
                setViewingReviewsJob(null);
                setReviewInternship(job);
                setShowInternshipReviewModal(true);
              }}
              style={{ padding: '0.4rem 0.85rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              + Write Review
            </button>
          </div>

          {jobReviews.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>No reviews yet for this position.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '420px', overflowY: 'auto' }}>
              {jobReviews.map(r => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Internship Review Modal */}
      {reviewInternship && (
        <ReviewModal
          isOpen={showInternshipReviewModal}
          onClose={() => { setShowInternshipReviewModal(false); setReviewInternship(null); }}
          targetType="internship"
          targetId={reviewInternship.id}
          targetTitle={`${reviewInternship.companyName} - ${reviewInternship.title}`}
          onReviewSubmitted={() => {
            showToast('Internship review submitted successfully!');
          }}
        />
      )}
    </div>
  );
};
