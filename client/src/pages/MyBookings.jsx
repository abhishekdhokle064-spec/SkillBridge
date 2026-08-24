import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { ReviewModal } from '../components/ReviewModal';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  FileText,
  Building2,
  Star,
  Sparkles,
  Edit3
} from 'lucide-react';

export const MyBookings = () => {
  const { currentUser, setActiveTab, showToast, refreshData } = useApp();
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Review Modal State
  const [reviewBooking, setReviewBooking] = useState(null);
  const [existingReview, setExistingReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const [bkRes, revRes] = await Promise.all([
        api.getBookings(),
        api.getReviews({ userId: currentUser?.id || 'user_student_1' })
      ]);
      setBookings(bkRes.data || []);
      setReviews(revRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id, title) => {
    try {
      await api.updateBooking(id, { status: 'Cancelled' });
      showToast(`Booking for '${title}' cancelled.`);
      await loadBookings();
      await refreshData();
    } catch (err) {
      showToast('Failed to cancel booking', 'error');
    }
  };

  const handleOpenReviewModal = (bk) => {
    const existing = reviews.find(r => r.bookingId === bk.id || (r.targetId === bk.resourceId && r.userId === (currentUser?.id || 'user_student_1')));
    setReviewBooking(bk);
    setExistingReview(existing || null);
    setShowReviewModal(true);
  };

  const filtered = bookings.filter(b => {
    if (statusFilter === 'All') return true;
    return b.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>My Cluster Lab Bookings</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            Track your reserved facility time slots, access credentials, and institutional approvals.
          </p>
        </div>

        <button 
          onClick={() => setActiveTab('resources')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={16} />
          <span>Book New Facility</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        {['All', 'Confirmed', 'Completed', 'Pending', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              border: statusFilter === st ? '1px solid #2563EB' : '1px solid #E2E8F0',
              backgroundColor: statusFilter === st ? '#EFF6FF' : '#FFFFFF',
              color: statusFilter === st ? '#1D4ED8' : '#64748B',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '3rem', textAlign: 'center', color: '#64748B' }}>
          <Calendar size={36} color="#94A3B8" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>No bookings found</h3>
          <p style={{ fontSize: '0.875rem', marginBottom: '1.25rem' }}>Explore available high-end cluster laboratories and reserve a slot.</p>
          <button 
            onClick={() => setActiveTab('resources')}
            className="btn-hero-primary"
          >
            Explore Resources
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filtered.map((bk) => {
            const isCompleted = bk.status?.toLowerCase() === 'completed';
            const hasReviewed = reviews.some(r => r.bookingId === bk.id);

            return (
              <div 
                key={bk.id}
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                        {bk.resourceTitle?.includes('Robotics') ? '🤖' : (bk.resourceTitle?.includes('Python') || bk.resourceTitle?.includes('AI') ? '🧠' : '⚡')}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>{bk.resourceTitle}</h3>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{bk.institutionName}</div>
                      </div>
                    </div>

                    <span className={isCompleted || bk.status === 'Confirmed' || bk.status === 'approved' ? 'status-pill-green' : (bk.status === 'Cancelled' ? 'status-pill-orange' : 'status-pill-orange')}>
                      {bk.status}
                    </span>
                  </div>

                  <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.75rem', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
                    <div>📅 <strong>Date:</strong> {bk.date}</div>
                    <div>⏱️ <strong>Slot:</strong> {bk.timeSlot}</div>
                    <div>🎯 <strong>Purpose:</strong> {bk.purpose}</div>
                    <div>👤 <strong>Scholar:</strong> {bk.studentName || currentUser?.name} ({bk.studentInstitution || 'GEC Nashik'})</div>
                  </div>
                </div>

                {/* Conditional Actions: For Completed bookings show Review button; for others show cancel if eligible */}
                {isCompleted ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle2 size={13} /> Completed
                    </span>
                    <button 
                      onClick={() => handleOpenReviewModal(bk)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.4rem 0.85rem',
                        backgroundColor: hasReviewed ? '#F8FAFC' : '#EFF6FF',
                        color: hasReviewed ? '#475569' : '#1D4ED8',
                        border: hasReviewed ? '1px solid #CBD5E1' : '1px solid #BFDBFE',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: hasReviewed ? 'none' : '0 2px 6px rgba(37, 99, 235, 0.2)'
                      }}
                    >
                      <Star size={13} fill="#F59E0B" color="#F59E0B" />
                      <span>{hasReviewed ? 'Edit Review' : 'Write a Review'}</span>
                    </button>
                  </div>
                ) : (
                  bk.status !== 'Cancelled' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
                      <button 
                        onClick={() => handleCancel(bk.id, bk.resourceTitle)}
                        style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <Trash2 size={13} />
                        <span>Cancel Reservation</span>
                      </button>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewBooking && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => { setShowReviewModal(false); setReviewBooking(null); setExistingReview(null); }}
          targetType="resource"
          targetId={reviewBooking.resourceId}
          targetTitle={reviewBooking.resourceTitle}
          bookingId={reviewBooking.id}
          existingReview={existingReview}
          onReviewSubmitted={loadBookings}
        />
      )}
    </div>
  );
};
