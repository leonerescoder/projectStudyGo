import React from 'react';
import { ChevronLeft, ChevronRight, Star, Clock, BarChart, Calendar, Award, Code, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Course.css';

function Course() {
  return (
    <div id="course-page">
      <div className="breadcrumb">
        <button className="back-btn">
          <ChevronLeft size={20} />
        </button>
        <span>Cursos / <span className="highlight">Tecnologia da Informação</span></span>
      </div>

      <div className="main-course-card">
        <div className="course-image-container">
          <div className="badge">
            <span className="fire-icon">🔥</span> Mais procurado
          </div>
          {/* Using a solid background with a logo placeholder since we don't have the real image asset */}
          <div className="image-placeholder">
            <div className="python-logo">🐍</div>
          </div>
        </div>

        <div className="course-details">
          <div className="ranking-badge">
            <Star size={16} fill="#f59e0b" color="#f59e0b" />
            <div className="ranking-text">
              <span className="ranking-label">Ranking</span>
              <span className="ranking-value">4º lugar</span>
            </div>
          </div>

          <h1 className="course-title">Python: Fundamento I</h1>
          
          <div className="category-info">
            <div className="category-icon">
              <Code size={20} />
            </div>
            <div className="category-text">
              <span className="category-label">Categoria</span>
              <span className="category-value">Tecnologia da Informação</span>
            </div>
          </div>

          <p className="course-description">
            Python é uma linguagem de programação usada em 44 aplicações de Web, desenvolvimento de software, ciência de dados e Machine Learning. O aprendizado do programa para pessoas interessadas na tecnologia.
          </p>

          <button className="school-info-btn">
            <Building size={20} />
            Ver mais informações da escola
            <ChevronRight size={20} className="chevron" />
          </button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon"><Clock size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Carga Horária</span>
            <span className="stat-value">100 horas</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Calendar size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Duração</span>
            <span className="stat-value">3 meses</span>
          </div>
        </div>
      </div>

      <div className="related-courses">
        <div className="related-header">
          <div>
            <h2>Cursos Relacionados</h2>
            <p>Explore outros cursos na mesma área e amplie seus conhecimentos.</p>
          </div>
          <div className="nav-buttons">
            <button className="nav-btn"><ChevronLeft size={20} /></button>
            <button className="nav-btn"><ChevronRight size={20} /></button>
          </div>
        </div>

        <div className="related-cards">
          {/* Card 1 */}
          <div className="related-card">
            <div className="card-image logic-img">
              <span className="card-ranking">5º lugar</span>
              <div className="card-logo">{'</>'}</div>
            </div>
            <div className="card-content">
              <h3>Lógica de Programação</h3>
              <div className="card-category">
                <Code size={16} /> Tecnologia da Informação
              </div>
              <div className="card-duration">
                <Clock size={16} /> 80 horas
              </div>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="related-card">
            <div className="card-image java-img">
              <span className="card-ranking">7º lugar</span>
              <div className="card-logo">☕ Java</div>
            </div>
            <div className="card-content">
              <h3>Java do Zero ao Avançado</h3>
              <div className="card-category">
                <Code size={16} /> Tecnologia da Informação
              </div>
              <div className="card-duration">
                <Clock size={16} /> 120 horas
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="related-card">
            <div className="card-image web-img">
              <span className="card-ranking">9º lugar</span>
              <div className="card-logo">HTML CSS JS</div>
            </div>
            <div className="card-content">
              <h3>Desenvolvimento Web Completo</h3>
              <div className="card-category">
                <Code size={16} /> Tecnologia da Informação
              </div>
              <div className="card-duration">
                <Clock size={16} /> 160 horas
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="related-card">
            <div className="card-image cloud-img">
              <span className="card-ranking">12º lugar</span>
              <div className="card-logo">☁️</div>
            </div>
            <div className="card-content">
              <h3>Computação em Nuvem</h3>
              <div className="card-category">
                <Code size={16} /> Tecnologia da Informação
              </div>
              <div className="card-duration">
                <Clock size={16} /> 100 horas
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Course;
