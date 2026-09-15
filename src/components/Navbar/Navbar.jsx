import React, { useState } from 'react';
import { Menu, Search, GraduationCap, X, ChevronRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const categoriesData = [
  {
    id: 1,
    name: 'Tecnologia',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
  },
  {
    id: 2,
    name: 'Mecânica',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
  },
  {
    id: 3,
    name: 'Gastronomia',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path></svg>
  },
  {
    id: 4,
    name: 'Idiomas',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
  },
  {
    id: 5,
    name: 'Saúde',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
  },
  {
    id: 6,
    name: 'Moda',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2"></circle><path d="M5 22v-6.5a2.5 2.5 0 0 1 5 0V22"></path><path d="M14 22v-6.5a2.5 2.5 0 0 1 5 0V22"></path><path d="M8 8a4 4 0 0 1 8 0"></path><path d="M12 4v4"></path></svg>
  },
  {
    id: 7,
    name: 'Artes',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
  },
  {
    id: 8,
    name: 'Música',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
  },
  {
    id: 9,
    name: 'Educação',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
  },
];

function Navbar() {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const toggleCategoryMenu = () => {
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
    setSelectedCategory(null);
  };

  const handleCategoryClick = (category) => {
    if (selectedCategory === category.id) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category.id);
    }
  };

  return (
    <header className="navbar-wrapper">
      <nav id="main-navbar" className="navbar">
        <div className="navbar-left">
          <button className="icon-btn menu-btn" onClick={toggleCategoryMenu} title="Menu de Categorias">
            <Menu size={24} />
          </button>
          <Link to="/" className="logo-container">
            <GraduationCap size={28} className="logo-icon" />
            <span className="logo-text">EducaFind</span>
          </Link>
        </div>

        <div className="navbar-center">
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Pesquisar cursos, escolas ou áreas..."
              className="search-input"
            />
          </div>
        </div>

        <div className="navbar-right">
          <ul className="nav-links">
            <li><Link to="/">Início</Link></li>
            <li><Link to="/escolas">Escolas</Link></li>
            <li><Link to="/cursos">Cursos</Link></li>
            <li className="nav-item-categorias" style={{ position: 'relative' }}>
              <button
                className={`nav-btn-link ${isCategoryMenuOpen ? 'active' : ''}`}
                onClick={toggleCategoryMenu}
              >
                Categorias
              </button>
            </li>
          </ul>
        </div>

        {isCategoryMenuOpen && (
          <>
            <div className="category-overlay-transparent" onClick={toggleCategoryMenu}></div>
            <div className="category-modal" onClick={(e) => e.stopPropagation()}>
              <div className="category-header">
                <div className="category-header-text">
                  <h3>Categorias</h3>
                  <p>Escolha a área de seu interesse</p>
                </div>
                <button className="close-btn" onClick={toggleCategoryMenu}>
                  <X size={16} />
                </button>
              </div>

              <div className="category-list">
                {categoriesData.map(cat => (
                  <div key={cat.id} className="category-item-container">
                    <button
                      className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                      onClick={() => handleCategoryClick(cat)}
                    >
                      <div className="category-btn-icon">
                        {cat.icon}
                      </div>
                      <span className="category-btn-name">{cat.name}</span>
                      <span className="category-btn-arrow">
                        {selectedCategory === cat.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </span>
                    </button>

                    {selectedCategory === cat.id && (
                      <div className="category-courses">
                        <Link to="/course/1" onClick={toggleCategoryMenu}>Curso de {cat.name} 1</Link>
                        <Link to="/course/1" onClick={toggleCategoryMenu}>Curso de {cat.name} 2</Link>
                        <Link to="/course/1" onClick={toggleCategoryMenu}>Curso de {cat.name} 3</Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;

