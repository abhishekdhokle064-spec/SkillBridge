import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { ReviewCard } from '../components/ReviewCard';
import { ReviewModal } from '../components/ReviewModal';
import { ReviewSummary } from '../components/ReviewSummary';
import { StarRating } from '../components/StarRating';
import { 
  Star, 
  Search, 
  Filter, 
  ShieldCheck, 
  Plus, 
  Award, 
  Building2, 
  BookOpen, 
  Briefcase, 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle2,
  Layers,
  Sparkles,
  Edit3
} from 'lucide-react';

export const ReviewsPage = () => {
  const { currentUser, setActiveTab, showToast, triggerConfetti } = useApp();
  const [activeTab, setActiveTabState] = useState('all'); // 'my_reviews' | 'all' | 'admin'
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 4.8,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    categoryAverages: { facilityQuality: 4.8, staffSupport: 4.7, learningExp: 4.9, infrastructure: 4.8 }
  });
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [targetTypeFilter, setTargetTypeFilter] = useState('all'); // 'all' | 'resource' | 'course' | 'internship'
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortMode, setSortMode] = useState('recent'); // 'recent' | 'highest' | 'lowest' | 'helpful'

  // Edit Review Modal State
  const [editingReview, setEditingReview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const params = {
        sort: sortMode,
        targetType: targetTypeFilter !== 'all' ? targetTypeFilter : undefined,
        rating: ratingFilter !== 'all' ? ratingFilter : undefined,
        search: searchQuery || undefined
      };

      if (activeTab === 'my_reviews') {
        params.userId = currentUser?.id || 'user_student_1';
      }

      const res = await api.getReviews(params);
      setReviews(res.data || []);
      if (res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [activeTab, targetTypeFilter, ratingFilter, sortMode, searchQuery]);

  const handleEditClick = (review) => {
    setEditingReview(review);
    setShowEditModal(true);
  };

  const handleReviewDeleted = (deletedId) => {
    setReviews(prev => prev.filter(r => r.id !== deletedId));
    loadReviews();
  };

  const myReviewsCount = reviews.filter(r => r.userId === (currentUser?.id || 'user_student_1')).length;
  const isAdmin = currentUser?.role === 'institution' || currentUser?.role === 'admin';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* 1. Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <Star size={18} fill="#FFFFFF" />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
              Cluster Reviews & Ratings Hub
            </h1>
          </div>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            Transparent, verified ratings and peer feedback for shared laboratories, faculty masterclasses, and corporate internships.
          </p>
        </div>

        <button 
          onClick={() => setActiveTab('bookings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.25rem',
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
          }}
        >
          <Plus size={16} />
          <span>Write a Review from Bookings</span>
        </button>
      </div>

      {/* 2. Top Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.15rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '10px', backgroundColor: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
            ⭐
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Overall Cluster Rating</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.2' }}>{stats.averageRating} / 5.0</div>
            <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600 }}>High Satisfaction</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.15rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
            💬
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Verified Reviews</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.2' }}>{stats.totalReviews}</div>
            <div style={{ fontSize: '0.7rem', color: '#2563EB', fontWeight: 600 }}>Across 7 Member Colleges</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.15rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
            🛡️
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Verified Bookings</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.2' }}>100%</div>
            <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>Attendance Validated</div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.15rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '10px', backgroundColor: '#F5F3FF', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
            👍
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Helpful Peer Votes</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.2' }}>120+</div>
            <div style={{ fontSize: '0.7rem', color: '#7C3AED', fontWeight: 600 }}>Upvoted Insights</div>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs: All Community Reviews vs My Written Reviews vs Admin Moderation */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTabState('all')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '9999px',
            border: activeTab === 'all' ? '1px solid #2563EB' : '1px solid #E2E8F0',
            backgroundColor: activeTab === 'all' ? '#EFF6FF' : '#FFFFFF',
            color: activeTab === 'all' ? '#1D4ED8' : '#64748B',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          All Community Reviews ({stats.totalReviews})
        </button>

        <button
          onClick={() => setActiveTabState('my_reviews')}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '9999px',
            border: activeTab === 'my_reviews' ? '1px solid #2563EB' : '1px solid #E2E8F0',
            backgroundColor: activeTab === 'my_reviews' ? '#EFF6FF' : '#FFFFFF',
            color: activeTab === 'my_reviews' ? '#1D4ED8' : '#64748B',
            fontSize: '0.875rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          My Reviews
        </button>

        {isAdmin && (
          <button
            onClick={() => setActiveTabState('admin')}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              border: activeTab === 'admin' ? '1px solid #7C3AED' : '1px solid #E2E8F0',
              backgroundColor: activeTab === 'admin' ? '#F5F3FF' : '#FFFFFF',
              color: activeTab === 'admin' ? '#7C3AED' : '#64748B',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            🛡️ Admin Moderation Center
          </button>
        )}
      </div>

      {/* 4. Review Summary Breakdown (Only in 'all' tab) */}
      {activeTab === 'all' && (
        <ReviewSummary 
          stats={stats} 
          selectedRatingFilter={ratingFilter}
          onSelectRatingFilter={setRatingFilter}
        />
      )}

      {/* 5. Filter & Search Controls */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
        
        {/* Row 1: Search Box & Sort Selector */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              type="text"
              placeholder="Search by facility name, scholar name, or review content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.4rem',
                backgroundColor: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>Sort by:</span>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
              style={{
                padding: '0.6rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#334155',
                backgroundColor: '#FFFFFF',
                outline: 'none'
              }}
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rated (5★ to 1★)</option>
              <option value="lowest">Lowest Rated (1★ to 5★)</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* Row 2: Target Type Pills & Star Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem' }}>
          
          {/* Target Type Filter */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Items' },
              { id: 'resource', label: '🔬 Labs & Facilities' },
              { id: 'course', label: '👨‍🏫 Courses & Trainings' },
              { id: 'internship', label: '💼 Internships' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTargetTypeFilter(t.id)}
                style={{
                  padding: '0.35rem 0.8rem',
                  borderRadius: '6px',
                  border: targetTypeFilter === t.id ? '1px solid #2563EB' : '1px solid #E2E8F0',
                  backgroundColor: targetTypeFilter === t.id ? '#EFF6FF' : '#FFFFFF',
                  color: targetTypeFilter === t.id ? '#2563EB' : '#475569',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Star Ratings Pills */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {['all', '5', '4', '3', '2', '1'].map(r => (
              <button
                key={r}
                onClick={() => setRatingFilter(r)}
                style={{
                  padding: '0.3rem 0.65rem',
                  borderRadius: '9999px',
                  border: ratingFilter === r ? '1px solid #F59E0B' : '1px solid #E2E8F0',
                  backgroundColor: ratingFilter === r ? '#FFFBEB' : '#FFFFFF',
                  color: ratingFilter === r ? '#D97706' : '#64748B',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {r === 'all' ? 'All Ratings' : `${r} ★`}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Active Filter & Count Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', padding: '0 0.25rem' }}>
        <div style={{ fontSize: '0.875rem', color: '#475569', fontWeight: 600 }}>
          Showing <strong>{reviews.length}</strong> of <strong>{stats.totalReviews}</strong> {stats.totalReviews === 1 ? 'review' : 'reviews'}
          {ratingFilter !== 'all' && (
            <span style={{ marginLeft: '0.5rem', color: '#1D4ED8', backgroundColor: '#EFF6FF', padding: '0.15rem 0.55rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #BFDBFE' }}>
              Rated: {ratingFilter}★
            </span>
          )}
        </div>

        {(ratingFilter !== 'all' || targetTypeFilter !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setRatingFilter('all');
              setTargetTypeFilter('all');
              setSearchQuery('');
            }}
            style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <span>Reset All Filters</span>
            <span>✕</span>
          </button>
        )}
      </div>

      {/* 6. Reviews List Display */}
      {reviews.length === 0 ? (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '3.5rem 2rem', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.75rem' }}>
            ⭐
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
            No reviews yet
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748B', maxWidth: '420px', margin: '0 auto 1.5rem', lineHeight: '1.5' }}>
            {activeTab === 'my_reviews'
              ? 'You haven’t submitted any reviews yet. Complete a lab booking or training session to share your feedback!'
              : 'No reviews found matching your search or rating filter. Be the first to share your experience!'}
          </p>
          <button 
            onClick={() => setActiveTab('bookings')}
            style={{
              padding: '0.6rem 1.4rem',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            Go to My Bookings
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map((rev) => (
            <ReviewCard 
              key={rev.id} 
              review={rev} 
              onEdit={handleEditClick}
              onDeleted={handleReviewDeleted}
              isAdminView={activeTab === 'admin'}
            />
          ))}
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <ReviewModal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setEditingReview(null); }}
          targetType={editingReview.targetType}
          targetId={editingReview.targetId}
          targetTitle={editingReview.targetTitle}
          existingReview={editingReview}
          onReviewSubmitted={loadReviews}
        />
      )}

    </div>
  );
};
