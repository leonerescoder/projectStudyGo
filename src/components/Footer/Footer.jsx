import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, MapPin, Headphones } from 'lucide-react';

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
              Plataforma de descoberta, comparação e ranqueamento de cursos e instituições de ensino do Brasil.
            </p>
          </div>

          {/* Coluna 2: Navegação */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navegação</h4>
            <ul className="footer-links-list">
              <li><Link to="/">Início</Link></li>
              <li><Link to="/escolas">Escolas Parceiras</Link></li>
              <li><Link to="/cursos">Cursos em Destaque</Link></li>
              <li><Link to="/cursos">Categorias</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Institucional */}
          <div className="footer-col">
            <h4 className="footer-col-title">Institucional</h4>
            <ul className="footer-links-list">
              <li><Link to="/">Sobre nós</Link></li>
              <li><Link to="/#company-registration-banner">Para Escolas / Empresas</Link></li>
              <li><Link to="/">Termos de Uso</Link></li>
              <li><Link to="/">Privacidade</Link></li>
            </ul>
          </div>

          {/* Coluna 4: Contato & Suporte */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contato &amp; Suporte</h4>
            <ul className="footer-links-list contact-list">
              <li>
                <Headphones size={15} />
                <span>Central de Ajuda</span>
              </li>
              <li>
                <Mail size={15} />
                <a href="mailto:contato@studygo.com.br">contato@studygo.com.br</a>
              </li>
              <li>
                <MapPin size={15} />
                <span>São Paulo - SP, Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha Inferior de Copyright */}
        <div className="footer-bottom-bar">
          <span className="copy-text">© 2026 StudyGo. Todos os direitos reservados.</span>
          <span className="tagline-text">Conectando seu potencial ao futuro da educação.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
