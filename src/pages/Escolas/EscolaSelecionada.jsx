import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EscolaSelecionada.css';

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

const formatDate = (dateString) => {
  if (!dateString || dateString === 'Não informada') return 'Não informada';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (e) {
    return dateString;
  }
};

function EscolaSelecionada() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sobre');
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchool() {
      try {
        const token = localStorage.getItem('studygo_token') || localStorage.getItem('token') || '';
        const headers = {};
        if (token) {
          headers['Authorization'] = 'Bearer ' + token;
        }

        const response = await fetch("https://uc13-projeto.onrender.com/companie/" + id, {
          headers
        });

        if (!response.ok) {
          throw new Error(`Erro na API (${response.status})`);
        }

        const data = await response.json();
        const companieData = Array.isArray(data) ? data[0] : data;

        if (companieData) {
          setSchool({
            id: companieData.id,
            name: companieData.name,
            cnpj: companieData.cnpj || 'Não informado',
            foundedIn: companieData.foundation || 'Não informada',
            places: companieData.places || 'Não informado',
            ranking: companieData.ranking || 0,
            rankingPosition: companieData.ranking || 1,
            fundamentals: companieData.fundamentals || 'Não informado',
            methods: companieData.methods || 'Não informado',
            courses: companieData.courses || []
          });
        }
      } catch (error) {
        console.error("Erro ao buscar a empresa:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSchool();
  }, [id]);

  const handleBackClick = () => {
    navigate('/escolas');
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  if (loading) {
    return (
      <div id="escola-selecionada-page">
        <div className="escola-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div id="escola-selecionada-page">
        <div className="escola-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', gap: '1.5rem' }}>
          <h2 style={{ color: 'white' }}>Instituição não encontrada.</h2>
          <button onClick={handleBackClick} className="back-btn" style={{ position: 'relative', top: '0', left: '0', margin: '0' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Voltar para Escolas
          </button>
        </div>
      </div>
    );
  }

  const scoreInfo = getScoreLabel(school.ranking);

  return (
    <div id="escola-selecionada-page">
      <div className="escola-container">
        <button onClick={handleBackClick} className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Voltar para Escolas
        </button>

        <header className="escola-header-professional">
          {/* Cover image will go here in the future */}
          <div className="escola-cover-professional">
             <div className="escola-cover-overlay"></div>
          </div>
          
          <div className="escola-header-content-professional">
            <div className="escola-header-main-info">
              <div className="escola-logo-professional">
                {school.name ? school.name.charAt(0) : '?'}
              </div>
              
              <div className="escola-title-area">
                <div className="escola-title-top">
                    <h1 className="escola-name-professional">{school.name}</h1>
                    <span className="school-verified-tag-large">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                        </svg>
                        Instituição Verificada
                    </span>
                </div>
                
                <div className="escola-meta-professional">
                  <span className="escola-location-prof">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {school.places}
                  </span>
                </div>
              </div>
            </div>

            <div className="escola-stats-bar">
                <div className="escola-stat-item">
                    <span className="stat-label">Ranking</span>
                    <span className="stat-value badge" style={getRankingStyle(school.rankingPosition)}>
                        {school.rankingPosition}º Lugar
                    </span>
                </div>
                <div className="stat-divider"></div>
                <div className="escola-stat-item">
                    <span className="stat-label">Avaliação Institucional</span>
                    <div className="stat-score-wrapper">
                        <span className="stat-score-number" style={{ color: scoreInfo.color }}>
                            {school.ranking > 0 ? school.ranking.toFixed(1) : '—'}
                        </span>
                        <span className="stat-score-max">/10</span>
                        <span className="stat-score-text" style={{ color: scoreInfo.color }}>
                            {scoreInfo.label}
                        </span>
                    </div>
                </div>
                <div className="stat-divider"></div>
                 <div className="escola-stat-item">
                    <span className="stat-label">Cursos Ofertados</span>
                    <span className="stat-value">{school.courses?.length || 0}</span>
                </div>
            </div>
          </div>
        </header>

        <div className="escola-tabs">
          <button
            className={`filter-btn ${activeTab === 'sobre' ? 'active' : ''}`}
            onClick={() => setActiveTab('sobre')}
          >
            Sobre a Instituição
          </button>
          <button
            className={`filter-btn ${activeTab === 'cursos' ? 'active' : ''}`}
            onClick={() => setActiveTab('cursos')}
          >
            Cursos Disponíveis
          </button>
        </div>

        <div className="escola-content-grid full-width">
          {activeTab === 'sobre' && (
            <div className="escola-details-section">
              <h2>Informações Gerais</h2>

              <div className="info-group-cards">
                <div className="info-card">
                  <div className="info-card-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                  </div>
                  <div className="info-card-content">
                      <span className="info-label">Fundação</span>
                      <span className="info-value">{formatDate(school.foundedIn)}</span>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-card-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                  </div>
                  <div className="info-card-content">
                      <span className="info-label">CNPJ</span>
                      <span className="info-value">{school.cnpj}</span>
                  </div>
                </div>

                 <div className="info-card">
                  <div className="info-card-icon">
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                  </div>
                  <div className="info-card-content">
                      <span className="info-label">Locais de Atuação</span>
                      <span className="info-value">{school.places}</span>
                  </div>
                </div>
              </div>

              <div className="text-blocks-container">
                  <div className="text-block">
                    <div className="text-block-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                        <h3>Fundamentos</h3>
                    </div>
                    <p>{school.fundamentals}</p>
                  </div>

                  <div className="text-block">
                    <div className="text-block-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                            <polyline points="2 17 12 22 22 17"></polyline>
                            <polyline points="2 12 12 17 22 12"></polyline>
                        </svg>
                        <h3>Métodos de Ensino</h3>
                    </div>
                    <p>{school.methods}</p>
                  </div>
              </div>
            </div>
          )}

          {activeTab === 'cursos' && (
            <div className="escola-courses-section">
              <h2>Cursos Disponíveis ({school.courses?.length || 0})</h2>
              {school.courses && school.courses.length > 0 ? (
                <div className="courses-list-grid">
                  {school.courses.map(course => (
                    <div
                      key={course.id}
                      className="course-card-prof"
                      onClick={() => handleCourseClick(course.id)}
                    >
                      <div className="course-card-content">
                          <h4 className="course-card-title">{course.title || course.name}</h4>
                          <div className="course-card-meta">
                              <span className="course-meta-item">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <polyline points="12 6 12 12 16 14"></polyline>
                                  </svg>
                                  {course.duration || (course.workload ? `${course.workload} horas` : 'Carga horária não informada')}
                              </span>
                          </div>
                      </div>
                      <div className="course-card-action">
                          <span className="view-course-text">Ver Curso</span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-container">
                    <div className="empty-state-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                        </svg>
                    </div>
                    <p className="no-courses-msg">Esta instituição ainda não possui cursos cadastrados no momento.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EscolaSelecionada;
