import React from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import './SchoolCard.css';

const SchoolCard = ({ school }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/escolas/${school.id}`);
  };

  const getRankingStyle = (position) => {
    if (position === 1) return { backgroundColor: '#f5b942', color: '#333' }; // Dourado
    if (position === 2) return { backgroundColor: '#c0c4cc', color: '#333' }; // Prata
    if (position === 3) return { backgroundColor: '#cd7f32', color: '#fff' }; // Bronze
    return { backgroundColor: 'var(--color-accent)', color: '#fff' }; // Padrão
  };

  return (
    <div className="school-card" onClick={handleCardClick}>
      <div className="school-card-header">
        <div className="school-header-left">
          <div className="school-avatar">
            {school.name.charAt(0)}
          </div>
          <h3 className="school-name">{school.name}</h3>
        </div>
        <span 
          className="school-ranking-badge"
          style={getRankingStyle(school.rankingPosition)}
        >
          {school.rankingPosition}º lugar
        </span>
      </div>
      
      <div className="school-card-body">
        <p className="school-location">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {school.places}
        </p>
        
        <div className="school-rating-container">
          <StarRating rating={school.rating} />
        </div>
      </div>
      
      <div className="school-card-footer">
        <button className="view-school-btn">Ver Escola</button>
      </div>
    </div>
  );
};

export const SchoolCardSkeleton = () => {
  return (
    <div className="school-card skeleton-card">
      <div className="school-card-header">
        <div className="school-header-left">
          <div className="school-avatar skeleton-avatar"></div>
          <div className="skeleton-line skeleton-name"></div>
        </div>
        <div className="skeleton-line skeleton-badge"></div>
      </div>
      
      <div className="school-card-body">
        <div className="skeleton-line skeleton-location"></div>
        <div className="school-rating-container">
          <div className="skeleton-line skeleton-stars"></div>
        </div>
      </div>
      
      <div className="school-card-footer">
        <div className="skeleton-btn"></div>
      </div>
    </div>
  );
};

export default SchoolCard;

