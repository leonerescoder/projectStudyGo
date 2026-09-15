import React from 'react';
import './StarRating.css';

const StarRating = ({ rating, maxStars = 5 }) => {
  const stars = [];
  
  for (let i = 1; i <= maxStars; i++) {
    const isFilled = i <= Math.round(rating);
    stars.push(
      <span 
        key={i} 
        className={`star ${isFilled ? 'filled' : 'empty'}`}
      >
        ★
      </span>
    );
  }

  return (
    <div className="star-rating">
      {stars}
      <span className="rating-text">({rating})</span>
    </div>
  );
};

export default StarRating;
