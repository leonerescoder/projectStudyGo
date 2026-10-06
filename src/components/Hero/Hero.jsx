import React, { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroFallback from '../../assets/estudandes.jpg';
import imgGestao from '../../assets/banner-gestao.png';
import imgProgramacao from '../../assets/banner-programacao.png';
import imgBancoDeDados from '../../assets/banner-banco-de-dados.png';
import imgCulinaria from '../../assets/banner-culinaria.png';

const FEATURED_SLIDES = [
  {
    id: 'banco-de-dados',
    eyebrow: 'CURSO EM DESTAQUE',
    title: 'Banco de Dados PostgreSQL',
    image: imgBancoDeDados,
    objectFit: 'cover',
    objectPosition: 'center',
    terms: ['banco de dados', 'postgresql', 'sql', 'database']
  },
  {
    id: 'administracao',
    eyebrow: 'CURSO EM DESTAQUE',
    title: 'Técnico em Administração',
    image: imgGestao,
    objectFit: 'cover',
    objectPosition: 'center',
    terms: ['administração', 'administracao', 'gestão', 'gestao']
  },
  {
    id: 'programacao',
    eyebrow: 'CURSO EM DESTAQUE',
    title: 'Lógica e Programação',
    image: imgProgramacao,
    objectFit: 'cover',
    objectPosition: 'center',
    terms: ['programação', 'programacao', 'java', 'python', 'lógica', 'logica']
  },
  {
    id: 'gastronomia',
    eyebrow: 'CURSO EM DESTAQUE',
    title: 'Gastronomia Profissional',
    image: imgCulinaria,
    objectFit: 'cover',
    objectPosition: 'center',
    terms: ['gastronomia', 'culinária', 'culinaria', 'cozinha']
  }
];

export function Hero({ courses = [], searchTerm, onSearchChange, onSearchSubmit }) {
  const navigate = useNavigate();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchTerm || !searchTerm.trim()) return [];
    const query = searchTerm.trim().toLowerCase();
    return courses.filter(course => {
      return (
        (course.title || '').toLowerCase().includes(query) ||
        (course.category || '').toLowerCase().includes(query) ||
        (course.school || '').toLowerCase().includes(query) ||
        (course.description || '').toLowerCase().includes(query)
      );
    }).slice(0, 5);
  }, [searchTerm, courses]);

  const activeSlide = FEATURED_SLIDES[carouselIndex % FEATURED_SLIDES.length];
  const relatedCourse = courses.find((course) => {
    const courseText = `${course.title || ''} ${course.category || ''} ${course.description || ''}`.toLowerCase();
    return activeSlide.terms.some((term) => courseText.includes(term));
  }) || courses[carouselIndex % courses.length];

  useEffect(() => {
    if (isCarouselPaused) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    const intervalId = window.setInterval(() => {
      setCarouselIndex((currentIndex) => (currentIndex + 1) % FEATURED_SLIDES.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [isCarouselPaused]);

  const moveCarousel = (direction) => {
    setCarouselIndex((currentIndex) => {
      return (currentIndex + direction + FEATURED_SLIDES.length) % FEATURED_SLIDES.length;
    });
  };

  return (
    <section className="hero-section">
      {
        <div className="hero-banner-carousel" aria-label="Ofertas de cursos">
          <button
            type="button"
            className="hero-carousel-arrow hero-carousel-arrow-left"
            onClick={() => moveCarousel(-1)}
            aria-label="Imagem anterior"
          >
            <ArrowLeft size={24} />
          </button>

          <button
            type="button"
            className="hero-banner-slide"
            key={activeSlide.id}
            onClick={() => {
              if (relatedCourse) navigate(`/course/${relatedCourse.id}`);
            }}
            onMouseEnter={() => setIsCarouselPaused(true)}
            onMouseLeave={() => setIsCarouselPaused(false)}
            onFocus={() => setIsCarouselPaused(true)}
            onBlur={() => setIsCarouselPaused(false)}
            title={`Abrir ${relatedCourse?.title || activeSlide.title}`}
          >
            <img
              src={activeSlide.image}
              alt={activeSlide.title}
              className="hero-banner-image"
              style={{
                objectFit: activeSlide.objectFit || 'cover',
                background: activeSlide.backgroundColor || (activeSlide.isCustomBanner ? 'transparent' : 'initial'),
                objectPosition: activeSlide.objectPosition || 'center'
              }}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = heroFallback;
              }}
            />
            {!activeSlide.isCustomBanner && (
              <>
                <span className="hero-banner-overlay" />
                <span className="hero-banner-content">
                  <small>{activeSlide.eyebrow}</small>
                  <strong>{activeSlide.title}</strong>
                  <span>Clique para conhecer o curso</span>
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            className="hero-carousel-arrow hero-carousel-arrow-right"
            onClick={() => moveCarousel(1)}
            aria-label="Próxima imagem"
          >
            <ArrowRight size={24} />
          </button>

          <div className="hero-banner-dots" aria-hidden="true">
            {FEATURED_SLIDES.map((slide, index) => (
              <span key={slide.id} className={index === carouselIndex ? 'active' : ''} />
            ))}
          </div>
        </div>
      }

      <div className="hero-container">
        {/* Headline central */}
        <h1 className="hero-title">
          Encontre o <span className="highlight-cyan">curso ideal</span> para o <span className="highlight-cyan">seu futuro.</span>
        </h1>

        {/* Subtítulo */}
        <p className="hero-subtitle" style={{ color: '#e2e8f0', marginBottom: '2.5rem' }}>
          Escolas e cursos em um só lugar — encontre o que é certo para você.
        </p>

        {/* Barra de Busca */}
        <form className="hero-search-wrapper" onSubmit={onSearchSubmit} style={{ position: 'relative' }}>
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

          {/* Pop-up de resultados */}
          {searchTerm && searchTerm.trim() && (
            <div className="hero-search-dropdown" style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '0.5rem',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              zIndex: 50,
              textAlign: 'left'
            }}>
              {searchResults.length > 0 ? (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {searchResults.map(course => (
                    <li key={course.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <button
                        type="button"
                        onClick={() => navigate(`/course/${course.id}`)}
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
                          borderRadius: '6px',
                          backgroundColor: '#e2e8f0',
                          backgroundImage: `url(${course.urlImg || heroFallback})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          flexShrink: 0
                        }} />
                        <div style={{ overflow: 'hidden' }}>
                          <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {course.title}
                          </strong>
                          <span style={{ color: '#64748b', fontSize: '0.8rem', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {course.school} • {course.category}
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
    </section>
  );
}

export default Hero;
