import React from 'react';
import './RankingSection.css';
import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { getCourseImageUrl } from '../../utils/courseImage';

export function RankingSection({ courses }) {
  const navigate = useNavigate();

  // Sort courses by ranking and get top 5
  const topCourses = [...courses]
    .sort((a, b) => (b.rawRanking || 0) - (a.rawRanking || 0))
    .slice(0, 5);

  const renderMedal = (index) => {
    const isTop3 = index < 3;
    const colors = ['#fbbf24', '#cbd5e1', '#d97706'];
    
    if (isTop3) {
      return (
        <div className={`ranking-medal top-${index + 1}`} style={{ '--medal-color': colors[index] }}>
          <svg className="medal-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
          </svg>
          <span className="medal-number">{index + 1}</span>
        </div>
      );
    }
    return (
      <div className="ranking-badge-simple">
        {index + 1}
      </div>
    );
  };

  return (
    <section className="ranking-section">
      <div className="ranking-container-full">

        <div className="ranking-main-content">
          <div className="ranking-header">
            <div className="ranking-title-area">
              <div className="trophy-icon-wrapper">
                <Trophy size={24} color="#38bdf8" />
              </div>
              <div>
                <h2 className="ranking-title">Ranking de Cursos</h2>
                <p className="ranking-subtitle">Confira os cursos mais bem avaliados e mais procurados pelos estudantes.</p>
              </div>
            </div>
          </div>

          <div className="ranking-cards-wrapper">
            {topCourses.map((course, index) => (
              <div 
                key={course.id} 
                className="ranking-course-card" 
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <div className="ranking-card-image-wrapper">
                  {renderMedal(index)}
                  {getCourseImageUrl(course) ? (
                    <img src={getCourseImageUrl(course)} alt={course.title} className="ranking-card-image" />
                  ) : (
                    <div className="ranking-image-placeholder">
                      <div className="placeholder-icon">📚</div>
                    </div>
                  )}
                </div>
                <div className="ranking-card-body">
                  <h3 className="ranking-card-title" title={course.title}>{course.title}</h3>
                  <p className="ranking-card-category">{course.category}</p>
                </div>
              </div>
            ))}
            {topCourses.length === 0 && (
              <div className="no-courses-ranked">
                Nenhum curso avaliado no momento.
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
