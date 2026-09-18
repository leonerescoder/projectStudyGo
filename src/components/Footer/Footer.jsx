import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="main-site-footer">
      <div className="footer-content-container">
        <div className="footer-columns-grid">
          {/* Coluna 1: Sobre StudyGo */}
          <div className="footer-col brand-col">
            <div className="footer-brand-header">
              <GraduationCap size={24} className="brand-cap-icon" />
              <span className="brand-name-text">StudyGo</span>
            </div>
            <p className="footer-description-text">
              A maior plataforma de descoberta, comparação e ranqueamento de cursos e instituições de ensino do Brasil.
            </p>
          </div>

          {/* Coluna 2: Navegação */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navegação</h4>
            <ul className="footer-links-list">
              <li><Link to="/">Início</Link></li>
              <li><Link to="/escolas">Escolas Parceiras</Link></li>
              <li><a href="#cursos-em-destaque">Cursos em Destaque</a></li>
              <li><Link to="/categorias">Categorias</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Institucional */}
          <div className="footer-col">
            <h4 className="footer-col-title">Institucional</h4>
            <ul className="footer-links-list">
              <li><a href="#sobre">Sobre nós</a></li>
              <li><a href="#empresas">Para Escolas / Empresas</a></li>
              <li><a href="#termos">Termos de Uso</a></li>
              <li><a href="#privacidade">Privacidade</a></li>
            </ul>
          </div>

          {/* Coluna 4: Contato & Suporte */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contato &amp; Suporte</h4>
            <ul className="footer-links-list contact-list">
              <li><span>Central de Ajuda</span></li>
              <li><span>contato@educafind.com.br</span></li>
              <li><span>São Paulo - SP, Brasil</span></li>
            </ul>
          </div>
        </div>

        {/* Linha Inferior de Copyright */}
        <div className="footer-bottom-bar">
          <span className="copy-text">© 2026 StudyGo. Desenvolvido em React moderno.</span>
          <span className="tagline-text">Conectando seu potencial ao futuro da educação.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
