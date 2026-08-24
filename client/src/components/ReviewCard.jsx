import React, { useState } from 'react';
import { StarRating } from './StarRating';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  ThumbsUp, 
  CheckCircle2, 
  Calendar, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  EyeOff, 
  Eye, 
  ShieldCheck,
  Building2,
  GraduationCap
} from 'lucide-react';

export const ReviewCard = ({ 
  review, 
  onEdit = null, 
  onDeleted = null,
  onHelpfulToggled = null,
  isAdminView = false 
}) => {
  const { currentUser, showToast } = useApp();
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [isHelpful, setIsHelpful] = useState(
    Array.isArray(review.helpfulUsers) && review.helpfulUsers.includes(currentUser?.id || 'user_student_1')
  );
  const [status, setStatus] = useState(review.status || 'active');
  const [loadingHelpful, setLoadingHelpful] = useState(false);

  const isAuthor = currentUser?.id === review.userId;
  const isAdmin = currentUser?.role === 'institution' || currentUser?.role === 'admin' || isAdminView;

  const handleHelpfulClick = async () => {
    if (loadingHelpful) return;
    try {
      setLoadingHelpful(true);
      const res = await api.toggleHelpful(review.id, currentUser?.id || 'user_student_1');
      setIsHelpful(res.isHelpful);
      setHelpfulCount(res.helpfulCount);
      showToast(res.message);
      if (onHelpfulToggled) onHelpfulToggled(review.id, res.helpfulCount);
    } catch (err) {
      showToast('Could not update helpful vote', 'error');
    } finally {
      setLoadingHelpful(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.deleteReview(review.id);
      showToast('Review deleted successfully');
      if (onDeleted) onDeleted(review.id);
    } catch (err) {
      showToast('Failed to delete review', 'error');
    }
  };

  const handleToggleModerate = async () => {
    const nextStatus = status === 'active' ? 'hidden' : 'active';
    try {
      await api.moderateReview(review.id, { status: nextStatus });
      setStatus(nextStatus);
      showToast(`Review status updated to ${nextStatus}.`);
    } catch (err) {
      showToast('Moderation action failed', 'error');
    }
  };

  return (
    <div 
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        opacity: status === 'hidden' ? 0.65 : 1,
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
    >
      {/* Header: User Avatar, Name, Verified Badge, Rating, Date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#EFF6FF',
            border: '2px solid #BFDBFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            flexShrink: 0
          }}>
            {review.userAvatar || '👨‍🎓'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                {review.userName || 'Scholar'}
              </span>

              {review.verified && (
                <span 
                  style={{
                    backgroundColor: '#ECFDF5',
                    color: '#059669',
                    border: '1px solid #A7F3D0',
                    borderRadius: '9999px',
                    padding: '0.15rem 0.5rem',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <CheckCircle2 size={11} />
                  <span>Verified Booking</span>
                </span>
              )}

              {status === 'hidden' && (
                <span style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: '4px', padding: '0.1rem 0.4rem', fontSize: '0.68rem', fontWeight: 700 }}>
                  Hidden by Moderator
                </span>
              )}
            </div>

            <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
              <span>{review.userInstitution || 'Cluster Institute'}</span>
              <span>•</span>
              <span>{new Date(review.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Star Rating Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <StarRating rating={review.rating} size={16} showNumber={true} />
        </div>
      </div>

      {/* Target Title Badge (if in multi-target reviews list) */}
      {review.targetTitle && (
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '0.2rem 0.6rem', borderRadius: '6px', alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <span>📌 {review.targetTitle}</span>
        </div>
      )}

      {/* Category Ratings Pills */}
      {review.categoryRatings && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', backgroundColor: '#F8FAFC', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
          {review.categoryRatings.facilityQuality && (
            <span style={{ fontSize: '0.72rem', color: '#475569' }}>
              Facility: <strong>{review.categoryRatings.facilityQuality}★</strong>
            </span>
          )}
          {review.categoryRatings.staffSupport && (
            <span style={{ fontSize: '0.72rem', color: '#475569' }}>
              • Staff Support: <strong>{review.categoryRatings.staffSupport}★</strong>
            </span>
          )}
          {review.categoryRatings.learningExp && (
            <span style={{ fontSize: '0.72rem', color: '#475569' }}>
              • Learning Value: <strong>{review.categoryRatings.learningExp}★</strong>
            </span>
          )}
          {review.categoryRatings.infrastructure && (
            <span style={{ fontSize: '0.72rem', color: '#475569' }}>
              • Infrastructure: <strong>{review.categoryRatings.infrastructure}★</strong>
            </span>
          )}
          {review.categoryRatings.instructorRating && (
            <span style={{ fontSize: '0.72rem', color: '#475569' }}>
              Instructor: <strong>{review.categoryRatings.instructorRating}★</strong>
            </span>
          )}
          {review.categoryRatings.workExp && (
            <span style={{ fontSize: '0.72rem', color: '#475569' }}>
              Work Experience: <strong>{review.categoryRatings.workExp}★</strong>
            </span>
          )}
        </div>
      )}

      {/* Review Text */}
      <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: '1.6', margin: 0 }}>
        {review.reviewText}
      </p>

      {/* Footer Actions: Helpful Button, Author Edit/Delete, Admin Moderation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
        {/* Helpful vote button */}
        <button
          onClick={handleHelpfulClick}
          disabled={loadingHelpful}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            border: isHelpful ? '1px solid #2563EB' : '1px solid #CBD5E1',
            backgroundColor: isHelpful ? '#EFF6FF' : '#FFFFFF',
            color: isHelpful ? '#2563EB' : '#64748B',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <ThumbsUp size={13} fill={isHelpful ? '#2563EB' : 'none'} />
          <span>{helpfulCount > 0 ? `${helpfulCount} people found this helpful` : 'Helpful'}</span>
        </button>

        {/* Right action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isAuthor && onEdit && (
            <button
              onClick={() => onEdit(review)}
              style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <Edit3 size={13} />
              <span>Edit</span>
            </button>
          )}

          {isAuthor && (
            <button
              onClick={handleDelete}
              style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </button>
          )}

          {isAdmin && (
            <>
              <button
                onClick={handleToggleModerate}
                style={{
                  background: 'none',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  padding: '0.25rem 0.5rem',
                  color: status === 'active' ? '#64748B' : '#059669',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                {status === 'active' ? <EyeOff size={12} /> : <Eye size={12} />}
                <span>{status === 'active' ? 'Hide' : 'Unhide'}</span>
              </button>

              <button
                onClick={handleDelete}
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '6px',
                  padding: '0.25rem 0.5rem',
                  color: '#DC2626',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
