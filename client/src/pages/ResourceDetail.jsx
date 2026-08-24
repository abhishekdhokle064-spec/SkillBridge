import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { ReviewCard } from '../components/ReviewCard';
import { ReviewModal } from '../components/ReviewModal';
import { ReviewSummary } from '../components/ReviewSummary';
import { StarRating } from '../components/StarRating';
import { 
  ArrowLeft, 
  MapPin, 
  CheckCircle2, 
  Users, 
  Clock, 
  Calendar, 
  Star, 
  Cpu, 
  User, 
  Sparkles,
  ShieldCheck,
  Plus,
  MessageSquare
} from 'lucide-react';

export const ResourceDetail = () => {
  const { selectedResourceId, setActiveTab, currentUser, showToast, triggerConfetti, refreshData } = useApp();
  const [resource, setResource] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 4.8,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    categoryAverages: { facilityQuality: 4.8, staffSupport: 4.7, learningExp: 4.9, infrastructure: 4.8 }
  });
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortMode, setSortMode] = useState('recent');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState('2025-08-10');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('10:00 AM - 1:00 PM');
  const [bookingPurpose, setBookingPurpose] = useState('Hands-on learning for Mini Project');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async (resourceId) => {
    try {
      const res = await api.getReviews({
        targetType: 'resource',
        targetId: resourceId,
        rating: ratingFilter !== 'all' ? ratingFilter : undefined,
        sort: sortMode
      });
      setReviews(res.data || []);
      if (res.stats) {
        setReviewStats(res.stats);
      }
    } catch (err) {
      console.error('Error fetching resource reviews:', err);
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await api.getResources();
        const list = res.data || [];
        const found = list.find(r => r.id === selectedResourceId) || list[0];
        setResource(found);
        if (found) {
          await fetchReviews(found.id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [selectedResourceId, ratingFilter, sortMode]);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!resource) return;

    try {
      setSubmitting(true);
      await api.bookResource(resource.id, {
        requesterUserId: currentUser?.id || 'user_student_1',
        requesterInstitutionId: currentUser?.institutionId || 'inst_1',
        purpose: bookingPurpose,
        date: bookingDate,
        timeSlot: bookingTimeSlot
      });

      showToast(`Slot confirmed for '${resource.title}'! Entry pass generated.`);
      triggerConfetti();
      await refreshData();
      setTimeout(() => {
        setActiveTab('bookings');
      }, 1200);
    } catch (err) {
      showToast(err.message || 'Booking failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!resource) return <div>Loading resource details...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Back to Search Button */}
      <button 
        onClick={() => setActiveTab('resources')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: '#2563EB', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', alignSelf: 'flex-start' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Search</span>
      </button>

      {/* Main Two-Column Layout matching Image 2 Mid-Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Left Column: Details, Image, Tabs */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
          {/* Header Image */}
          <div style={{ height: '260px', borderRadius: '12px', overflow: 'hidden', position: 'relative', marginBottom: '1.25rem' }}>
            <img src={resource.imageUrl} alt={resource.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <span style={{ position: 'absolute', top: '14px', right: '14px', backgroundColor: '#10B981', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: '6px' }}>
              {resource.status || 'Available'}
            </span>
          </div>

          {/* Title & Institution */}
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
            {resource.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#2563EB', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            <MapPin size={16} />
            <span>{resource.institutionName} • {resource.location}</span>
          </div>

          {/* Sub Navigation Tabs */}
          <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #E2E8F0', marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 600 }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'equipment', label: 'Equipment & Specs' },
              { id: 'trainer', label: 'In-Charge Faculty' },
              { id: 'reviews', label: `Reviews & Ratings (${reviewStats.totalReviews})` }
            ].map((tab) => (
              <span
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                style={{
                  paddingBottom: '0.65rem',
                  cursor: 'pointer',
                  color: activeSubTab === tab.id ? '#2563EB' : '#64748B',
                  borderBottom: activeSubTab === tab.id ? '2px solid #2563EB' : '2px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </span>
            ))}
          </div>

          {/* Tab Content */}
          {activeSubTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                {resource.description}
              </p>

              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>Key Capabilities & Research Focus</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {(Array.isArray(resource.keyFeatures) ? resource.keyFeatures : (resource.specs?.split(',') || [])).map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#334155' }}>
                      <CheckCircle2 size={14} color="#10B981" />
                      <span>{feat.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.85rem', fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div>👥 <strong>Max Batch Capacity:</strong> {resource.capacity} Students</div>
                <div>⏱️ <strong>Available Daily Slots:</strong> {resource.timeSlots || '10:00 AM - 1:00 PM, 2:00 PM - 5:00 PM'}</div>
                <div>🏢 <strong>Cluster Host:</strong> {resource.institutionName}</div>
              </div>
            </div>
          )}

          {activeSubTab === 'equipment' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: '#EFF6FF', borderRadius: '8px', border: '1px solid #BFDBFE', fontSize: '0.8125rem', color: '#1E40AF' }}>
                ⚙️ Industrial equipment maintained under cluster cross-institutional calibration protocols.
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(Array.isArray(resource.equipment) ? resource.equipment : (resource.specs?.split(',') || [])).map((eq, i) => (
                  <li key={i}>{eq.trim()}</li>
                ))}
              </ul>
            </div>
          )}

          {activeSubTab === 'trainer' && (
            <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                  👨‍🏫
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{resource.trainerName || 'Dr. K. R. Joshi (Lead Incharge)'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Assigned Lead Cluster Instructor</div>
                </div>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: '1.5', margin: 0 }}>
                Available on site to supervise industrial arms, oversee code uploads, and guide research project methodologies.
              </p>
            </div>
          )}

          {activeSubTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Review Summary Breakdown Widget */}
              <ReviewSummary 
                stats={reviewStats} 
                selectedRatingFilter={ratingFilter}
                onSelectRatingFilter={setRatingFilter}
                targetType="resource"
              />

              {/* Action & Filter Header */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
                    Showing {reviews.length} of {reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? 'Review' : 'Reviews'}
                  </span>
                  {ratingFilter !== 'all' && (
                    <button
                      onClick={() => setRatingFilter('all')}
                      title="Click to reset filter and show all ratings"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.75rem',
                        color: '#1D4ED8',
                        backgroundColor: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        padding: '0.15rem 0.55rem',
                        borderRadius: '9999px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>Filtered: {ratingFilter}★</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>✕</span>
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                    <span>Sort:</span>
                    <select
                      value={sortMode}
                      onChange={(e) => setSortMode(e.target.value)}
                      style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.78rem', outline: 'none', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="recent">Most Recent</option>
                      <option value="highest">Highest Rated</option>
                      <option value="lowest">Lowest Rated</option>
                      <option value="helpful">Most Helpful</option>
                    </select>
                  </div>

                  <button
                    onClick={() => { setEditingReview(null); setShowReviewModal(true); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.45rem 0.95rem',
                      backgroundColor: '#2563EB',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
                    }}
                  >
                    <Plus size={14} />
                    <span>Write Review</span>
                  </button>
                </div>
              </div>

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '2.5rem', textAlign: 'center' }}>
                  <MessageSquare size={32} color="#94A3B8" style={{ margin: '0 auto 0.5rem' }} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>No reviews yet</h4>
                  <p style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '1rem' }}>Be the first to share your experience with this facility!</p>
                  <button
                    onClick={() => { setEditingReview(null); setShowReviewModal(true); }}
                    style={{ padding: '0.5rem 1.25rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Write a Review
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reviews.map(rev => (
                    <ReviewCard
                      key={rev.id}
                      review={rev}
                      onEdit={(r) => { setEditingReview(r); setShowReviewModal(true); }}
                      onDeleted={() => fetchReviews(resource.id)}
                    />
                  ))}
                </div>
              )}

            </div>
          )}
        </div>

        {/* Right Column: Book Resource Form Widget matching Image 2 */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '90px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Book Resource</span>
            <span style={{ fontSize: '0.75rem', color: '#10B981', backgroundColor: '#ECFDF5', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Free Access</span>
          </h2>

          <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Select Date
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none', backgroundColor: '#F8FAFC' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Select Time Slot
              </label>
              <select 
                value={bookingTimeSlot}
                onChange={(e) => setBookingTimeSlot(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none', backgroundColor: '#F8FAFC' }}
              >
                <option value="10:00 AM - 1:00 PM">10:00 AM - 1:00 PM</option>
                <option value="2:00 PM - 5:00 PM">2:00 PM - 5:00 PM</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Purpose of Booking
              </label>
              <textarea 
                rows={3}
                required
                value={bookingPurpose}
                onChange={(e) => setBookingPurpose(e.target.value)}
                placeholder="Hands-on learning for Mini Project"
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', outline: 'none', backgroundColor: '#F8FAFC' }}
              />
            </div>

            <div style={{ backgroundColor: '#F1F5F9', padding: '0.75rem', borderRadius: '8px', fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="#2563EB" />
              <span>Instant slot approval under Maharashtra Cluster MOU</span>
            </div>

            <button 
              type="submit"
              disabled={submitting}
              style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)' }}
            >
              {submitting ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => { setShowReviewModal(false); setEditingReview(null); }}
        targetType="resource"
        targetId={resource.id}
        targetTitle={resource.title}
        existingReview={editingReview}
        onReviewSubmitted={() => fetchReviews(resource.id)}
      />
    </div>
  );
};
