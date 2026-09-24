import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SchoolCard.css';

const getRankingStyle = (position) => {
  if (position === 1) return { background: 'linear-gradient(135deg, #f5b942, #e8a020)', color: '#1a1200' };
  if (position === 2) return { background: 'linear-gradient(135deg, #c0c4cc, #9aa0aa)', color: '#1a1a1a' };
  if (position === 3) return { background: 'linear-gradient(135deg, #cd7f32, #b56a20)', color: '#fff' };
  return { background: 'rgba(44, 108, 251, 0.15)', color: '#2c6cfb', border: '1px solid rgba(44,108,251,0.3)' };
};

const getScoreLabel = (score) => {
  if (score >= 9) return { label: 'Excelente', color: '#10b981' };
  if (score >= 7) return { label: 'Muito Bom', color: '#3b82f6' };
  if (score >= 5) return { label: 'Bom', color: '#f59e0b' };
  if (score > 0)  return { label: 'Regular', color: '#94a3b8' };
  return { label: 'Sem score', color: '#64748b' };
};

const SchoolCard = ({ school }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/escolas/${school.id}`);
  };

  const scoreInfo = getScoreLabel(school.ranking);
  const scorePercent = Math.min((school.ranking / 10) * 100, 100);

  return (
    <div className="school-card" onClick={handleCardClick}>

      {/* Header */}
      <div className="school-card-header">
        <div className="school-header-left">
          <div className="school-avatar">
            {school.urlImg ? (
              <img src={school.urlImg} alt={school.name} className="school-logo-img" />
            ) : (
              school.name.charAt(0)
            )}
          </div>
          <div className="school-name-group">
            <h3 className="school-name">{school.name}</h3>
            <span className="school-verified-tag">
              <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
              Instituição Verificada
            </span>
          </div>
        </div>
        <span className="school-ranking-badge" style={getRankingStyle(school.rankingPosition)}>
          {school.rankingPosition}º
        </span>
      </div>

      {/* Body */}
      <div className="school-card-body">
        <p className="school-location">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {school.places}
        </p>

        {/* Score Section */}
        <div className="school-score-section">
          <div className="school-score-display">
            <span className="score-number" style={{ color: scoreInfo.color }}>
              {school.ranking > 0 ? school.ranking.toFixed(1) : '—'}
            </span>
            <div className="score-meta">
              <span className="score-out-of">/10</span>
              <span className="score-label-text" style={{ color: scoreInfo.color }}>
                {scoreInfo.label}
              </span>
            </div>
          </div>

          {school.coursesCount > 0 && (
            <span className="school-courses-tag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              {school.coursesCount} {school.coursesCount === 1 ? 'curso' : 'cursos'}
            </span>
          )}
        </div>

        {/* Score Progress Bar */}
        <div className="school-score-bar-track">
          <div
            className="school-score-bar-fill"
            style={{
              width: `${scorePercent}%`,
              backgroundColor: scoreInfo.color
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="school-card-footer">
        <button className="view-school-btn">
          Ver Instituição
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
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
          <div>
            <div className="skeleton-line skeleton-name"></div>
            <div className="skeleton-line skeleton-verified" style={{ marginTop: '6px' }}></div>
          </div>
        </div>
        <div className="skeleton-line skeleton-badge"></div>
      </div>

      <div className="school-card-body">
        <div className="skeleton-line skeleton-location"></div>
        <div className="skeleton-line skeleton-score" style={{ marginTop: '12px' }}></div>
        <div className="skeleton-line skeleton-bar" style={{ marginTop: '10px', height: '6px', borderRadius: '6px' }}></div>
      </div>

      <div className="school-card-footer">
        <div className="skeleton-btn"></div>
      </div>
    </div>
  );
};

export default SchoolCard;
