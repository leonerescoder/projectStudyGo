import React from 'react';
import { Search } from 'lucide-react';
import heroBg from '../../assets/estudandes.jpg';

export function Hero({ searchTerm, onSearchChange, onSearchSubmit }) {
  return (
    <section
      className="hero-section"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',

      }}
    >
      <div className="hero-container">

        {/* Headline central */}
        <h1 className="hero-title">
          Encontre o <span className="highlight-cyan">curso ideal</span> para o <span className="highlight-cyan">seu futuro.</span>
        </h1>

        {/* Subtítulo */}
        <p className="hero-subtitle" style={{ color: '#e2e8f0', marginBottom: '2.5rem' }}>
          Mais de 100 escolas e milhares de cursos em um só lugar.
        </p>

        {/* Barra de Busca */}
        <form className="hero-search-wrapper" onSubmit={onSearchSubmit}>
          <div className="hero-search-input-box">
            <Search size={20} className="hero-search-icon" />
            <input
              type="text"
              placeholder="O que você procura?"
              className="hero-search-input"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <button type="submit" className="hero-search-btn" style={{ display: 'none' }}>
            Buscar
          </button>
        </form>
      </div>
    </section>
  );
}

export default Hero;
