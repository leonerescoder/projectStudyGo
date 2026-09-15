import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StarRating from '../../components/StarRating/StarRating';
import './EscolaSelecionada.css';

// Using the same mock data for now
const MOCK_SCHOOLS = {
  1: {
    id: 1,
    name: 'Tech Academy Brasil',
    cnpj: '12.345.678/0001-90',
    foundedIn: '15/01/2023',
    places: 'São Paulo, SP - Híbrido',
    rating: 4.8,
    rankingPosition: 1,
    fundamentals: 'Focados na prática e em projetos reais, preparamos os alunos para os desafios do mercado de trabalho.',
    methods: 'Metodologia ativa, PBL (Project Based Learning), e mentorias semanais com especialistas.',
    courses: [
      { id: 101, title: 'Desenvolvimento Web Full Stack', duration: '6 meses' },
      { id: 102, title: 'UX/UI Design Moderno', duration: '4 meses' },
      { id: 103, title: 'Engenharia de Dados', duration: '8 meses' }
    ]
  },
  2: {
    id: 2,
    name: 'Instituto de Inovação Digital',
    cnpj: '98.765.432/0001-10',
    foundedIn: '20/03/2023',
    places: 'Rio de Janeiro, RJ - Presencial',
    rating: 4.5,
    rankingPosition: 2,
    fundamentals: 'Inovação e criatividade no coração do aprendizado.',
    methods: 'Aulas teóricas e laboratórios de ideação.',
    courses: [
      { id: 201, title: 'Gestão de Produtos Digitais', duration: '3 meses' }
    ]
  }
};

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
  
  // Get school data, or default if not found (since it's mock)
  const school = MOCK_SCHOOLS[id] || MOCK_SCHOOLS[1];

  const handleBackClick = () => {
    navigate('/escolas');
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

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
              {school.name.charAt(0)}
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
                        <h4>{course.title}</h4>
                        <span>Duração: {course.duration}</span>
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

