import React, { useState, useEffect } from 'react';
import { Menu, Search, GraduationCap, X, ChevronRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const defaultIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>;

function Navbar() {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('http://10.60.44.43:3000/categorie')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Erro ao buscar categorias:", err));
  }, []);

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
                {categories.map(cat => (
                  <div key={cat.id} className="category-item-container">
                    <button
                      className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                      onClick={() => handleCategoryClick(cat)}
                    >
                      <div className="category-btn-icon">
                        {defaultIcon}
                      </div>
                      <span className="category-btn-name">{cat.name}</span>
                      <span className="category-btn-arrow">
                        {selectedCategory === cat.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </span>
                    </button>

                    {selectedCategory === cat.id && (
                      <div className="category-courses">
                        {cat.courses && cat.courses.length > 0 ? (
                          cat.courses.map(course => (
                            <Link key={course.id} to={`/curso/${course.id}`} onClick={toggleCategoryMenu} style={{ padding: '8px 16px', display: 'block', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}>
                              {course.name}
                            </Link>
                          ))
                        ) : (
                          <div style={{ padding: '8px 16px', color: 'var(--text-muted)', fontSize: '14px' }}>Sem cursos disponíveis</div>
                        )}
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

