import React from 'react';
import { Menu, Search, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <div className="navbar-wrapper">
      <nav id="main-navbar" className="navbar">
        <div className="navbar-left">
          <button className="icon-btn menu-btn">
            <Menu size={24} />
          </button>
          <Link to="/" className="logo-container">
            <GraduationCap size={28} className="logo-icon" />
            <span className="logo-text">StudyGo</span>
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
            <li><Link to="/categorias">Categorias</Link></li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
