import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  GraduationCap, 
  X, 
  ChevronRight, 
  ChevronDown,
  ShieldCheck,
  LogOut,
  Crown,
  LayoutDashboard,
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { recordCourseClick } from '../../utils/rankingService';
import { getGlobalCategories, CATEGORIES_UPDATE_EVENT } from '../../utils/categoryService';
import { buscaTodos } from '../../ApiCourses/ApiCourse';
import { buscaEmpresas } from '../../API/apiCompany';
import heroFallback from '../../assets/estudandes.jpg';
import './Navbar.css';

const defaultIcon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>;

function Navbar() {
  const { user, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [companies, setCompanies] = useState([]);
  const userMenuRef = useRef(null);

  const isHomePage = location.pathname === '/';
  const showSearch = !isHomePage || hasScrolled;

  // Scroll listener — detecta se o usuário saiu do topo
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Resetar ao trocar de rota
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    async function loadCategories() {
      const globalCats = await getGlobalCategories();
      setCategories(Array.isArray(globalCats) ? globalCats : []);
    }
    async function loadData() {
      try {
        const [responseCourses, responseCompanies] = await Promise.all([
          buscaTodos(),
          buscaEmpresas()
        ]);
        
        const coursesData = Array.isArray(responseCourses) ? responseCourses : (responseCourses?.value || responseCourses?.data || []);
        setCourses(coursesData);
        
        const companiesData = Array.isArray(responseCompanies) ? responseCompanies : (responseCompanies?.value || responseCompanies?.data || []);
        setCompanies(companiesData);
      } catch (err) {
        console.error('Erro ao buscar dados no Navbar:', err);
      }
    }
    loadCategories();
    loadData();

    const handleUpdate = () => loadCategories();
    window.addEventListener(CATEGORIES_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(CATEGORIES_UPDATE_EVENT, handleUpdate);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    navigate(query ? `/cursos?search=${encodeURIComponent(query)}` : '/cursos');
    setSearchTerm('');
  };

  const searchResults = useMemo(() => {
    if (!searchTerm || !searchTerm.trim()) return [];
    const query = searchTerm.trim().toLowerCase();
    
    const matchedCourses = courses.filter(course => {
      return (
        (course.name || '').toLowerCase().includes(query) ||
        (course.category || '').toLowerCase().includes(query) ||
        (course.fieldOfStudy || '').toLowerCase().includes(query) ||
        (course.description || '').toLowerCase().includes(query)
      );
    }).map(c => ({ ...c, searchType: 'course' }));

    const matchedCompanies = companies.filter(company => {
      return (
        (company.name || '').toLowerCase().includes(query) ||
        (company.description || '').toLowerCase().includes(query) ||
        (company.category || '').toLowerCase().includes(query)
      );
    }).map(c => ({ ...c, searchType: 'company' }));

    return [...matchedCompanies, ...matchedCourses].slice(0, 6);
  }, [searchTerm, courses, companies]);

  return (
    <header className="navbar-wrapper">
      <nav id="main-navbar" className="navbar">
        <div className="navbar-left">
          <Link to="/" className="logo-container">
            <GraduationCap size={28} className="logo-icon" />
            <span className="logo-text">StudyGo</span>
          </Link>
        </div>

        <div className={`navbar-center ${showSearch ? 'search-visible' : 'search-hidden'}`}>
          <form className="search-bar" onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <Search size={20} className="search-icon" strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Pesquisar cursos, escolas ou áreas..."
              className="search-input"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              tabIndex={showSearch ? 0 : -1}
            />
            {searchTerm && searchTerm.trim() && (
              <div className="navbar-search-dropdown" style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '0.5rem',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                zIndex: 100,
                textAlign: 'left'
              }}>
                {searchResults.length > 0 ? (
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {searchResults.map(result => (
                      <li key={`${result.searchType}-${result.id}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <button
                          type="button"
                          onClick={() => {
                            if (result.searchType === 'course') {
                              navigate(`/course/${result.id}`);
                            } else {
                              navigate(`/escolas/${result.id}`);
                            }
                            setSearchTerm('');
                          }}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: result.searchType === 'company' ? '50%' : '6px',
                            backgroundColor: '#e2e8f0',
                            backgroundImage: `url(${result.urlImg || result.logo || heroFallback})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            flexShrink: 0
                          }} />
                          <div style={{ overflow: 'hidden' }}>
                            <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {result.name || result.title}
                            </strong>
                            <span style={{ color: '#64748b', fontSize: '0.8rem', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {result.searchType === 'company' ? 'Escola' : (result.category || result.fieldOfStudy)}
                            </span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ padding: '1.5rem 1rem', color: '#64748b', textAlign: 'center', fontSize: '0.95rem' }}>
                    Nenhum curso encontrado.
                  </div>
                )}
              </div>
            )}
          </form>
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

          {/* User Profile / Login Icon in top right */}
          <div className="navbar-auth-container" ref={userMenuRef}>
            {user ? (
              <div className="user-profile-menu-wrap">
                <button 
                  className={`user-profile-btn ${user.type.toLowerCase()} ${isUserMenuOpen ? 'active' : ''}`}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  title={`Conectado como ${user.name} (${user.type})`}
                >
                  <div className="user-avatar-icon">
                    {user.type === 'ADMIN' ? <Crown size={16} /> : <GraduationCap size={16} />}
                  </div>
                  <span className="user-short-name">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className={`chevron-indicator ${isUserMenuOpen ? 'rotated' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="user-dropdown-popover">
                    <div className="user-dropdown-header">
                      <div className="dropdown-user-avatar">
                        {user.type === 'ADMIN' ? <Crown size={20} /> : <GraduationCap size={20} />}
                      </div>
                      <div className="dropdown-user-details">
                        <strong className="dropdown-user-name">{user.name}</strong>
                        <span className="dropdown-user-email">{user.email}</span>
                        <div className="dropdown-badges-row">
                          <span className={`dropdown-role-pill ${user.type.toLowerCase()}`}>
                            {user.type === 'ADMIN' ? '👑 ADMIN' : '🎓 DIRETOR'}
                          </span>
                          <span className="dropdown-company-name">{user.company_name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="user-dropdown-actions">
                      <Link 
                        to="/admin" 
                        className="dropdown-action-btn admin-link"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        <span>Painel Administrativo</span>
                      </Link>

                      <button 
                        type="button" 
                        className="dropdown-action-btn logout-btn"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        <span>Deslogar / Sair</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className="navbar-login-btn"
                onClick={openAuthModal}
                title="Fazer Login de Admin ou Diretor"
              >
                <ShieldCheck size={18} className="login-icon" />
                <span>Entrar</span>
              </button>
            )}
          </div>
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
                {[...categories].sort((a, b) => (a.name || '').localeCompare(b.name || '')).map(cat => (
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
                            <Link
                              key={course.id}
                              to={`/course/${course.id}`}
                              onClick={() => {
                                recordCourseClick(course.id, course);
                                toggleCategoryMenu();
                              }}
                              style={{ padding: '8px 16px', display: 'block', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px' }}
                            >
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

