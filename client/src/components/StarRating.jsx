import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ 
  rating = 5, 
  max = 5, 
  size = 16, 
  interactive = false, 
  onRate = null, 
  showNumber = false,
  color = "#F59E0B"
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = hoverRating > 0 ? hoverRating : rating;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: interactive ? 'pointer' : 'default' }}
        onMouseLeave={() => interactive && setHoverRating(0)}
      >
        {Array.from({ length: max }, (_, index) => {
          const starNumber = index + 1;
          const isFilled = starNumber <= displayRating;
          const isHalf = !isFilled && starNumber - 0.5 <= displayRating;

          return (
            <span
              key={index}
              onClick={() => interactive && onRate && onRate(starNumber)}
              onMouseEnter={() => interactive && setHoverRating(starNumber)}
              style={{
                transition: 'transform 0.1s ease',
                transform: interactive && hoverRating === starNumber ? 'scale(1.2)' : 'scale(1)',
                display: 'inline-flex'
              }}
            >
              <Star
                size={size}
                color={isFilled || isHalf ? color : "#CBD5E1"}
                fill={isFilled ? color : (isHalf ? color : "none")}
              />
            </span>
          );
        })}
      </div>

      {showNumber && (
        <span style={{ fontSize: `${size * 0.85}px`, fontWeight: 700, color: '#0F172A', marginLeft: '0.25rem' }}>
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};
