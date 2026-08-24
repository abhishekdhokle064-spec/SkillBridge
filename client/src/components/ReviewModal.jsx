import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { StarRating } from './StarRating';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Star, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const ReviewModal = ({ 
  isOpen, 
  onClose, 
  targetType = 'resource', // 'resource' | 'course' | 'internship'
  targetId, 
  targetTitle = 'Cluster Facility', 
  bookingId = null,
  enrollmentId = null,
  existingReview = null,
  onReviewSubmitted
}) => {
  const { currentUser, showToast, triggerConfetti } = useApp();
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Category specific ratings
  const [catFacility, setCatFacility] = useState(5);
  const [catStaff, setCatStaff] = useState(5);
  const [catLearning, setCatLearning] = useState(5);
  const [catInfra, setCatInfra] = useState(5);

  // Course specific
  const [catInstructor, setCatInstructor] = useState(5);
  const [catCourseContent, setCatCourseContent] = useState(5);

  // Internship specific
  const [catWorkExp, setCatWorkExp] = useState(5);
  const [catMentorship, setCatMentorship] = useState(5);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating || 5);
      setReviewText(existingReview.reviewText || '');
      if (existingReview.categoryRatings) {
        if (existingReview.categoryRatings.facilityQuality) setCatFacility(existingReview.categoryRatings.facilityQuality);
        if (existingReview.categoryRatings.staffSupport) setCatStaff(existingReview.categoryRatings.staffSupport);
        if (existingReview.categoryRatings.learningExp) setCatLearning(existingReview.categoryRatings.learningExp);
        if (existingReview.categoryRatings.infrastructure) setCatInfra(existingReview.categoryRatings.infrastructure);
        if (existingReview.categoryRatings.instructorRating) setCatInstructor(existingReview.categoryRatings.instructorRating);
        if (existingReview.categoryRatings.courseContent) setCatCourseContent(existingReview.categoryRatings.courseContent);
        if (existingReview.categoryRatings.workExp) setCatWorkExp(existingReview.categoryRatings.workExp);
        if (existingReview.categoryRatings.mentorship) setCatMentorship(existingReview.categoryRatings.mentorship);
      }
    } else {
      setRating(5);
      setReviewText('');
      setCatFacility(5);
      setCatStaff(5);
      setCatLearning(5);
      setCatInfra(5);
      setCatInstructor(5);
      setCatCourseContent(5);
      setCatWorkExp(5);
      setCatMentorship(5);
    }
  }, [existingReview, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      showToast('Please enter your review experience.', 'error');
      return;
    }

    if (reviewText.trim().length < 10) {
      showToast('Review must be at least 10 characters long.', 'error');
      return;
    }

    try {
      setSubmitting(true);

      let categoryRatings = {};
      if (targetType === 'resource') {
        categoryRatings = {
          facilityQuality: catFacility,
          staffSupport: catStaff,
          learningExp: catLearning,
          infrastructure: catInfra
        };
      } else if (targetType === 'course') {
        categoryRatings = {
          instructorRating: catInstructor,
          learningExp: catLearning,
          courseContent: catCourseContent
        };
      } else if (targetType === 'internship') {
        categoryRatings = {
          workExp: catWorkExp,
          learningExp: catLearning,
          mentorship: catMentorship,
          overall: rating
        };
      }

      if (existingReview?.id) {
        // Edit mode
        await api.updateReview(existingReview.id, {
          rating,
          reviewText: reviewText.trim(),
          categoryRatings
        });
        showToast('Your review has been updated successfully!');
      } else {
        // Create mode
        await api.createReview({
          targetType,
          targetId: String(targetId),
          targetTitle,
          bookingId,
          enrollmentId,
          userId: currentUser?.id || 'user_student_1',
          userName: currentUser?.name || 'Rahul Sharma',
          userAvatar: currentUser?.role === 'student' ? '👨‍🎓' : '👤',
          userInstitution: currentUser?.institutionName || 'GEC Nashik',
          rating,
          reviewText: reviewText.trim(),
          categoryRatings,
          verified: true
        });
        showToast('Thank you! Your review has been submitted.');
        triggerConfetti();
      }

      if (onReviewSubmitted) onReviewSubmitted();
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingLabel = (score) => {
    switch (score) {
      case 5: return '⭐⭐⭐⭐⭐ Outstanding & High Impact';
      case 4: return '⭐⭐⭐⭐ Very Good Experience';
      case 3: return '⭐⭐⭐ Average / Met Expectations';
      case 2: return '⭐⭐ Below Expectations';
      case 1: return '⭐ Poor Experience';
      default: return 'Rate your experience';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingReview ? `Edit Review: ${targetTitle}` : `Write a Review: ${targetTitle}`}
      maxWidth="580px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Verified Badge Header */}
        <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <ShieldCheck size={18} color="#059669" />
          <div style={{ fontSize: '0.8125rem', color: '#065F46' }}>
            <strong>Verified Institutional Experience:</strong> Your feedback helps fellow scholars across the cluster make informed learning choices.
          </div>
        </div>

        {/* 1. Overall Rating Selection */}
        <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.15rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
            Rate Your Overall Experience
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
            <StarRating rating={rating} size={28} interactive={true} onRate={setRating} />
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#D97706', marginTop: '0.25rem' }}>
            {getRatingLabel(rating)}
          </div>
        </div>

        {/* 2. Category Ratings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Experience Breakdown
          </div>

          {targetType === 'resource' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Facility & Equipment Quality</div>
                <StarRating rating={catFacility} size={16} interactive={true} onRate={setCatFacility} />
              </div>
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Trainer / Staff Support</div>
                <StarRating rating={catStaff} size={16} interactive={true} onRate={setCatStaff} />
              </div>
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Learning & Research Value</div>
                <StarRating rating={catLearning} size={16} interactive={true} onRate={setCatLearning} />
              </div>
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Lab Infrastructure & Cleanliness</div>
                <StarRating rating={catInfra} size={16} interactive={true} onRate={setCatInfra} />
              </div>
            </div>
          )}

          {targetType === 'course' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Instructor Guidance</div>
                <StarRating rating={catInstructor} size={16} interactive={true} onRate={setCatInstructor} />
              </div>
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Course Content & Depth</div>
                <StarRating rating={catCourseContent} size={16} interactive={true} onRate={setCatCourseContent} />
              </div>
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.65rem 0.85rem', gridColumn: 'span 2' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Hands-on Learning Experience</div>
                <StarRating rating={catLearning} size={16} interactive={true} onRate={setCatLearning} />
              </div>
            </div>
          )}

          {targetType === 'internship' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Work & Project Experience</div>
                <StarRating rating={catWorkExp} size={16} interactive={true} onRate={setCatWorkExp} />
              </div>
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Corporate Mentorship</div>
                <StarRating rating={catMentorship} size={16} interactive={true} onRate={setCatMentorship} />
              </div>
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.65rem 0.85rem', gridColumn: 'span 2' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Overall Skill Growth</div>
                <StarRating rating={catLearning} size={16} interactive={true} onRate={setCatLearning} />
              </div>
            </div>
          )}
        </div>

        {/* 3. Review Text Area */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
              Share Your Detailed Experience
            </label>
            <span style={{ fontSize: '0.72rem', color: reviewText.length > 450 ? '#EF4444' : '#94A3B8' }}>
              {reviewText.length} / 500
            </span>
          </div>
          <textarea
            rows={4}
            required
            maxLength={500}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Tell fellow cluster scholars what you liked, equipment performance, instructor support, or tips for the session..."
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '0.875rem',
              outline: 'none',
              backgroundColor: '#FFFFFF',
              fontFamily: 'inherit',
              lineHeight: '1.5',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.6rem 1.25rem',
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
            disabled={submitting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1.5rem',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
            }}
          >
            <Sparkles size={16} />
            <span>{submitting ? 'Submitting...' : (existingReview ? 'Update Review' : 'Submit Review')}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
