import React from 'react';
import { GraduationCap, Search } from 'lucide-react';

export function Hero({ searchTerm, onSearchChange, onSearchSubmit }) {
  return (
    <section className="hero-section">
      <div className="hero-glow-bg"></div>
      <div className="hero-container">
        {/* Badge superior */}
        <div className="hero-pill-badge">
          <span className="badge-icon">🎓</span>
          <span>Seu futuro começa aqui</span>
        </div>

        {/* Headline central */}
        <h1 className="hero-title">
          Encontre o <span className="highlight-cyan">curso ideal</span> para o <span className="highlight-cyan">seu futuro.</span>
        </h1>

        {/* Subtítulo */}
        <p className="hero-subtitle">
          Mais de 100 escolas e milhares de cursos em um só lugar.
        </p>

        {/* Barra de Busca */}
        <form className="hero-search-wrapper" onSubmit={onSearchSubmit}>
          <div className="hero-search-input-box">
            <Search size={20} className="hero-search-icon" />
            <input
              type="text"
              placeholder="Pesquisar cursos, escolas ou áreas..."
              className="hero-search-input"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <button type="submit" className="hero-search-btn">
            <Search size={18} />
            <span>Buscar</span>
          </button>
        </form>
      </div>
    </section>
  );
}

export default Hero;
