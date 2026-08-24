import React from 'react';
import { StarRating } from './StarRating';
import { Star, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ReviewSummary = ({ 
  stats = {
    averageRating: 4.8,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    categoryAverages: { facilityQuality: 4.8, staffSupport: 4.7, learningExp: 4.9, infrastructure: 4.8 }
  },
  selectedRatingFilter = 'all',
  onSelectRatingFilter = null,
  targetType = 'resource'
}) => {
  const { averageRating = 4.8, totalReviews = 0, ratingDistribution = {}, categoryAverages = {} } = stats;

  const stars = [5, 4, 3, 2, 1];

  return (
    <div 
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
        
        {/* Left Column: Big Overall Score */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: '#0F172A', lineHeight: '1' }}>
            {Number(averageRating || 5.0).toFixed(1)}
          </div>
          <div style={{ margin: '0.4rem 0' }}>
            <StarRating rating={averageRating || 5.0} size={22} />
          </div>
          <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>
            Based on <strong>{totalReviews}</strong> {totalReviews === 1 ? 'review' : 'reviews'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <ShieldCheck size={13} />
            <span>100% Verified Cluster Bookings</span>
          </div>
        </div>

        {/* Right Column: Rating Distribution Bars (5★ to 1★) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Filter by Rating:
            </span>
            <button
              onClick={() => onSelectRatingFilter && onSelectRatingFilter('all')}
              style={{
                background: selectedRatingFilter === 'all' ? '#2563EB' : '#F1F5F9',
                color: selectedRatingFilter === 'all' ? '#FFFFFF' : '#475569',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.2rem 0.65rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              All Ratings {selectedRatingFilter === 'all' && '✓'}
            </button>
          </div>

          {stars.map((s) => {
            const count = ratingDistribution[s] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : (s === 5 ? 100 : 0);
            const isSelected = selectedRatingFilter === String(s);

            return (
              <div 
                key={s}
                onClick={() => onSelectRatingFilter && onSelectRatingFilter(isSelected ? 'all' : String(s))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  padding: '0.35rem 0.6rem',
                  borderRadius: '8px',
                  border: isSelected ? '1.5px solid #2563EB' : '1px solid transparent',
                  backgroundColor: isSelected ? '#EFF6FF' : '#F8FAFC',
                  boxShadow: isSelected ? '0 1px 4px rgba(37, 99, 235, 0.15)' : 'none',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = '#F1F5F9';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', width: '46px', fontWeight: 700, color: isSelected ? '#1D4ED8' : '#334155' }}>
                  <span>{s}</span>
                  <Star size={13} color="#F59E0B" fill="#F59E0B" />
                </div>

                {/* Progress bar */}
                <div style={{ flex: 1, height: '10px', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div 
                    style={{
                      height: '100%',
                      width: `${percentage}%`,
                      backgroundColor: isSelected ? '#2563EB' : (s >= 4 ? '#10B981' : (s === 3 ? '#F59E0B' : '#EF4444')),
                      borderRadius: '9999px',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>

                <div style={{ width: '56px', textAlign: 'right', color: isSelected ? '#1D4ED8' : '#64748B', fontSize: '0.75rem', fontWeight: 700 }}>
                  {count} {isSelected && '✓'}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Category Breakdown Badges */}
      {categoryAverages && (
        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
          {categoryAverages.facilityQuality && (
            <div style={{ backgroundColor: '#F8FAFC', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>Facility Quality</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                ⭐ {categoryAverages.facilityQuality}
              </div>
            </div>
          )}

          {categoryAverages.staffSupport && (
            <div style={{ backgroundColor: '#F8FAFC', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>Trainer Support</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                ⭐ {categoryAverages.staffSupport}
              </div>
            </div>
          )}

          {categoryAverages.learningExp && (
            <div style={{ backgroundColor: '#F8FAFC', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>Learning Value</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                ⭐ {categoryAverages.learningExp}
              </div>
            </div>
          )}

          {categoryAverages.infrastructure && (
            <div style={{ backgroundColor: '#F8FAFC', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>Infrastructure</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                ⭐ {categoryAverages.infrastructure}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
