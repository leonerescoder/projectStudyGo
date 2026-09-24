import React, { useState, useEffect } from 'react';
import SchoolCard, { SchoolCardSkeleton } from '../../components/SchoolCard/SchoolCard';
import './Escolas.css';

function Escolas() {
  const [escolas, setEscolas] = useState([]);
  const [activeFilter, setActiveFilter] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Fetch companies (escolas) from backend
  useEffect(() => {
    async function fetchEscolas() {
      setLoading(true);
      setErro(null);
      try {
        const token = localStorage.getItem('studygo_token') || localStorage.getItem('token') || '';
        const headers = {};
        if (token) {
          headers['Authorization'] = 'Bearer ' + token;
        }
        
        const response = await fetch("https://uc13-projeto.onrender.com/companie", {
          headers
        });
        
        if (!response.ok) {
          throw new Error(`Erro na API (${response.status})`);
        }

        const data = await response.json();
        const arrayData = Array.isArray(data) ? data : [];
        
        // Ordena por ranking (do maior pro menor)
        const sortedData = [...arrayData].sort((a, b) => (b.ranking || 0) - (a.ranking || 0));
        
        // Calcula o maior ranking da lista
        const maxRanking = sortedData.length > 0 ? (sortedData[0].ranking || 0) : 0;
        
        // Map backend data to frontend card format
        const mappedData = sortedData.map((companie, index) => {
          return {
            id: companie.id,
            name: companie.name,
            places: companie.places || "Não informado",
            ranking: companie.ranking || 0,
            rankingPosition: index + 1,
            coursesCount: Array.isArray(companie.courses) ? companie.courses.length : 0,
            foundation: companie.foundation || null,
            urlImg: companie.urlImg || "",
            createdAt: companie.foundation || new Date().toISOString()
          };
        });

        setEscolas(mappedData);
      } catch (error) {
        console.error("Erro ao buscar empresas:", error);
        setErro("Não foi possível carregar as escolas no momento. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }

    fetchEscolas();
  }, []);

  // Filter and Sort logic
  const filteredSchools = escolas.filter(school => 
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.places.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (activeFilter === 'ranking') {
      return a.rankingPosition - b.rankingPosition;
    }
    if (activeFilter === 'recentes') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0; // 'todas' default sort
  });

  return (
    <div id="escolas-page">
      <main className="escolas-content">
        <header className="escolas-header">
          <div>
            <h2 className="escolas-title">Escolas Parceiras</h2>
            <p className="escolas-subtitle">Encontre as melhores instituições de ensino para o seu desenvolvimento.</p>
          </div>
          
          <div className="escolas-controls">
            <div className="search-bar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="Pesquisar escolas..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="escolas-filters">
          <button 
            className={`filter-btn ${activeFilter === 'todas' ? 'active' : ''}`}
            onClick={() => setActiveFilter('todas')}
          >
            Todas
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'ranking' ? 'active' : ''}`}
            onClick={() => setActiveFilter('ranking')}
          >
            Ranking
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'recentes' ? 'active' : ''}`}
            onClick={() => setActiveFilter('recentes')}
          >
            Mais recentes
          </button>
        </div>

        {loading ? (
          <div className="escolas-grid">
            {[...Array(6)].map((_, index) => (
              <SchoolCardSkeleton key={index} />
            ))}
          </div>
        ) : erro ? (
          <div className="no-results">
            <p>{erro}</p>
          </div>
        ) : (
          <div className="escolas-grid">
            {filteredSchools.length > 0 ? (
              filteredSchools.map(school => (
                <SchoolCard key={school.id} school={school} />
              ))
            ) : (
              <div className="no-results">
                <p>Nenhuma escola encontrada para a pesquisa "{searchQuery}".</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Escolas;

