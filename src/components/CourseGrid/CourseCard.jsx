import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Star, Rocket, Clock, Building } from 'lucide-react';
import { getCourseImageUrl } from '../../utils/courseImage';
import courseImageFallback from '../../assets/estudandes.jpg';

export function CourseCard({ course }) {
  const navigate = useNavigate();

  const renderBadge = () => {
    if (!course.badge) return null;

    if (course.badge.type === 'popular') {
      return (
        <div className="card-badge badge-popular">
          <Flame size={13} className="badge-fire-icon" />
          <span>{course.badge.text}</span>
        </div>
      );
    }
    if (course.badge.type === 'destaque') {
      return (
        <div className="card-badge badge-destaque">
          <Star size={13} fill="#fbbf24" color="#fbbf24" />
          <span>{course.badge.text}</span>
        </div>
      );
    }
    if (course.badge.type === 'alta') {
      return (
        <div className="card-badge badge-alta">
          <Rocket size={13} />
          <span>{course.badge.text}</span>
        </div>
      );
    }
    if (course.badge.type === 'novo') {
      return (
        <div className="card-badge badge-novo">
          <span>{course.badge.text}</span>
        </div>
      );
    }
    return null;
  };

  const imgUrl = getCourseImageUrl(course);

  const renderVisual = () => {
    if (imgUrl) {
      return (
        <div className="card-visual-frame visual-image">
          <img 
            src={imgUrl} 
            alt={course.title || course.name} 
            className="course-card-image"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = courseImageFallback;
            }}
          />
        </div>
      );
    }

    switch (course.visualType) {
      case 'code-editor':
        return (
          <div className="card-visual-frame visual-code-editor">
            <div className="editor-top-bar">
              <div className="editor-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="editor-tag">&lt;code&gt;</span>
            </div>
            <div className="editor-code-body">
              <div className="code-row c-cyan"></div>
              <div className="code-row c-pink"></div>
              <div className="code-row c-cyan-light"></div>
            </div>
            <span className="editor-closing-tag">&lt;/&gt;</span>
          </div>
        );

      case 'java-cup':
        return (
          <div className="card-visual-frame visual-java">
            <div className="java-steam-cup">
              <div className="steam-line"></div>
              <div className="steam-line"></div>
              <div className="cup-shape">☕</div>
            </div>
            <span className="visual-subtag tag-orange">JAVA ENTERPRISE</span>
          </div>
        );

      case 'web-stack':
        return (
          <div className="card-visual-frame visual-web">
            <div className="web-badges-row">
              <div className="tech-badge badge-html5">
                <span>5</span>
                <small>HTML5</small>
              </div>
              <div className="tech-badge badge-css3">
                <span>3</span>
                <small>CSS3</small>
              </div>
              <div className="tech-badge badge-js">
                <span>JS</span>
                <small>ES6+</small>
              </div>
            </div>
            <span className="visual-subtag tag-cyan">FULL STACK FRONTEND</span>
          </div>
        );

      case 'cloud-net':
        return (
          <div className="card-visual-frame visual-cloud">
            <div className="cloud-neon-wrapper">
              <svg className="cloud-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor">
                <path
                  d="M18 42h28a12 12 0 0 0 0-24 16 16 0 0 0-31.2 4.4A9 9 0 0 0 18 42z"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="32" cy="48" r="2" fill="currentColor" />
                <line x1="32" y1="42" x2="32" y2="46" strokeWidth="2" strokeDasharray="2 2" />
              </svg>
            </div>
            <span className="visual-subtag tag-cyan">CLOUD ARCHITECTURE</span>
          </div>
        );

      case 'database-cylinder':
        return (
          <div className="card-visual-frame visual-database">
            <div className="cylinder-stack">
              <div className="cylinder-ring"></div>
              <div className="cylinder-ring"></div>
              <div className="cylinder-ring"></div>
            </div>
            <span className="visual-subtag tag-cyan">SQL &amp; NoSQL DATABASES</span>
          </div>
        );

      case 'ui-design':
        return (
          <div className="card-visual-frame visual-design">
            <div className="figma-wireframe-box">
              <div className="wireframe-header">
                <span className="wf-circle"></span>
                <span className="wf-bar"></span>
              </div>
              <div className="wireframe-content">
                <div className="wf-block"></div>
                <div className="wf-block"></div>
              </div>
            </div>
            <span className="visual-subtag tag-purple">FIGMA &amp; PRODUCT DESIGN</span>
          </div>
        );

      default:
        return (
          <div className="card-visual-frame">
            <span className="default-icon">📚</span>
          </div>
        );
    }
  };

  return (
    <div
      className="course-card-item"
      onClick={() => navigate(`/course/${course.id}`)}
    >
      {/* Visual no topo */}
      <div className="card-top-container">
        {renderBadge()}
        {renderVisual()}
      </div>

      {/* Detalhes do Curso */}
      <div className="card-body-details">
        <span className="card-category-text">{course.category}</span>
        <h3 className="card-title-heading">{course.title}</h3>

        <div className="card-footer-meta">
          <div className="meta-item">
            <Clock size={14} className="meta-icon" />
            <span>{course.workload}</span>
          </div>
          <div className="meta-item">
            <Building size={14} className="meta-icon" />
            <span>{course.school}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
