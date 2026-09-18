import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StarRating from '../../components/StarRating/StarRating';
import './EscolaSelecionada.css';

const getRankingStyle = (position) => {
  if (position === 1) return { backgroundColor: '#f5b942', color: '#333' }; // Dourado
  if (position === 2) return { backgroundColor: '#c0c4cc', color: '#333' }; // Prata
  if (position === 3) return { backgroundColor: '#cd7f32', color: '#fff' }; // Bronze
  return { backgroundColor: 'var(--color-accent)', color: '#fff' }; // Padrão
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

        // If data is an array (e.g., from some backends like JSON server or specific implementations)
        const companieData = Array.isArray(data) ? data[0] : data;

        if (companieData) {
          const ranking = companieData.ranking || 0;
          let rating = 0;
          if (ranking >= 10) {
            rating = 5;
          } else {
            rating = Math.round((ranking / 10) * 5);
          }

          // Map data to expected format
          setSchool({
            id: companieData.id,
            name: companieData.name,
            cnpj: companieData.cnpj || 'Não informado',
            foundedIn: companieData.foundation || 'Não informada',
            places: companieData.places || 'Não informado',
            rating: rating,
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
          <h2 style={{ color: 'white' }}>Carregando informações da instituição...</h2>
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

  return (
    <div id="escola-selecionada-page">
      <div className="escola-container">
        {/* Breadcrumb / Back Button */}
        <button onClick={handleBackClick} className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Voltar para Escolas
        </button>

        {/* Header Section */}
        <header className="escola-header-card">
          <div className="escola-cover-banner"></div>

          <div className="escola-header-content">
            <div className="escola-large-avatar">
              {school.name ? school.name.charAt(0) : '?'}
            </div>

            <div className="escola-header-info">
              <h1 className="escola-name">{school.name}</h1>
              <div className="escola-meta">
                <span className="escola-location">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {school.places}
                </span>
                {school.rankingPosition && (
                  <span
                    className="school-ranking-badge"
                    style={getRankingStyle(school.rankingPosition)}
                  >
                    {school.rankingPosition}º lugar
                  </span>
                )}
                <div className="escola-rating">
                  <StarRating rating={school.rating} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Tabs System */}
        <div className="escola-tabs">
          <button
            className={`filter-btn ${activeTab === 'sobre' ? 'active' : ''}`}
            onClick={() => setActiveTab('sobre')}
          >
            Sobre
          </button>
          <button
            className={`filter-btn ${activeTab === 'cursos' ? 'active' : ''}`}
            onClick={() => setActiveTab('cursos')}
          >
            Cursos
          </button>
        </div>

        {/* Content Section */}
        <div className="escola-content-grid full-width">
          {/* Aba: Sobre */}
          {activeTab === 'sobre' && (
            <div className="escola-details-section">
              <h2>Sobre a Instituição</h2>

              <div className="info-group">
                <div className="info-item">
                  <span className="info-label">CNPJ</span>
                  <span className="info-value">{school.cnpj}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Fundação</span>
                  <span className="info-value">{school.foundedIn}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Locais de Atuação</span>
                  <span className="info-value">{school.places}</span>
                </div>
              </div>

              <div className="text-group">
                <h3>Fundamentos</h3>
                <p>{school.fundamentals}</p>
              </div>

              <div className="text-group">
                <h3>Métodos</h3>
                <p>{school.methods}</p>
              </div>
            </div>
          )}

          {/* Aba: Cursos */}
          {activeTab === 'cursos' && (
            <div className="escola-courses-section">
              <h2>Cursos Oferecidos</h2>
              {school.courses && school.courses.length > 0 ? (
                <div className="courses-list">
                  {school.courses.map(course => (
                    <div
                      key={course.id}
                      className="course-list-item"
                      onClick={() => handleCourseClick(course.id)}
                    >
                      <div className="course-item-info">
                        <h4>{course.title || course.name}</h4>
                        <span>Duração: {course.duration || (course.workload ? course.workload + ' horas' : 'Não informada')}</span>
                      </div>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-courses-msg">Nenhum curso cadastrado no momento.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EscolaSelecionada;
