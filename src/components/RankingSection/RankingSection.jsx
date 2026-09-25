import React from 'react';
import './RankingSection.css';
import { useNavigate } from 'react-router-dom';
import { Trophy, Star } from 'lucide-react';
import { getCourseImageUrl } from '../../utils/courseImage';
import courseImageFallback from '../../assets/estudandes.jpg';
import { recordCourseClick } from '../../utils/rankingService';

export function RankingSection({ courses }) {
  const navigate = useNavigate();

  // Sort courses by ranking (clicks + boosted points) and get top 5
  const topCourses = [...courses]
    .sort((a, b) => (b.rawRanking || 0) - (a.rawRanking || 0))
    .slice(0, 5);

  const renderMedal = (index) => {
    const isTopThree = index < 3;

    return (
      <div className={`ranking-position-badge ${isTopThree ? 'top-three' : 'other-position'}`}>
        {isTopThree && <Trophy size={16} />}
        <span>{index + 1}º</span>
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
                <h2 className="ranking-title">
                  Ranking de Cursos
                </h2>

                <p className="ranking-subtitle">
                  Confira os cursos mais bem avaliados e mais procurados pelos estudantes.
                </p>
              </div>
            </div>
          </div>

          <div className="ranking-cards-wrapper">
            {topCourses.map((course, index) => (
              <div
                key={course.id}
                className="ranking-course-card"
                onClick={() => {
                  recordCourseClick(course.id, course);
                  navigate(`/course/${course.id}`);
                }}
              >
                <div className="ranking-card-image-wrapper">
                  {renderMedal(index)}

                  {getCourseImageUrl(course) ? (
                    <img
                      src={getCourseImageUrl(course)}
                      alt={course.title}
                      className="ranking-card-image"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = courseImageFallback;
                      }}
                    />
                  ) : (
                    <div className="ranking-image-placeholder">
                      <div className="placeholder-icon">📚</div>
                    </div>
                  )}
                </div>

                <div className="ranking-card-body">
                  <h3
                    className="ranking-card-title"
                    title={course.title}
                  >
                    {course.title}
                  </h3>

                  <p className="ranking-card-category">
                    {course.title}
                  </p>

                  <div
                    className="ranking-card-footer"
                    style={{
                      marginTop: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Star
                        size={12}
                        fill="#f59e0b"
                        color="#f59e0b"
                      />

                      <strong>
                        {course.rawRanking || 0} pts
                      </strong>
                    </span>
                  </div>
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