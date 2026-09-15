import React, { useState } from 'react';
import SchoolCard from '../../components/SchoolCard/SchoolCard';
import './Escolas.css';

// Mock Data
const MOCK_SCHOOLS = [
  {
    id: 1,
    name: 'Tech Academy Brasil',
    places: 'São Paulo, SP',
    rating: 4.8,
    rankingPosition: 1,
    createdAt: '2023-01-15'
  },
  {
    id: 2,
    name: 'Instituto de Inovação Digital',
    places: 'Rio de Janeiro, RJ',
    rating: 4.5,
    rankingPosition: 2,
    createdAt: '2023-03-20'
  },
  {
    id: 3,
    name: 'Code & Learn',
    places: 'Belo Horizonte, MG',
    rating: 4.2,
    rankingPosition: 3,
    createdAt: '2023-06-10'
  },
  {
    id: 4,
    name: 'Escola do Futuro',
    places: 'Curitiba, PR',
    rating: 5.0,
    rankingPosition: 4,
    createdAt: '2023-08-05'
  },
  {
    id: 5,
    name: 'Centro de Tecnologia Avançada',
    places: 'Recife, PE',
    rating: 3.9,
    rankingPosition: 5,
    createdAt: '2022-11-30'
  },
  {
    id: 6,
    name: 'Dev Start',
    places: 'Remoto',
    rating: 4.7,
    rankingPosition: 6,
    createdAt: '2023-09-01'
  }
];

function Escolas() {
  const [activeFilter, setActiveFilter] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and Sort logic
  const filteredSchools = MOCK_SCHOOLS.filter(school => 
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
      </main>
    </div>
  );
}

export default Escolas;
