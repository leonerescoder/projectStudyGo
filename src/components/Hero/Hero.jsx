import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroFallback from '../../assets/estudandes.jpg';
import heroGastronomia from '../../assets/hero-gastronomia.png';

const FEATURED_SLIDES = [
  {
    id: 'administracao',
    eyebrow: 'CURSO EM DESTAQUE',
    title: 'Técnico em Administração',
    image: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1600&q=90',
    terms: ['administração', 'administracao', 'gestão', 'gestao']
  },
  {
    id: 'ia',
    eyebrow: 'CURSO EM DESTAQUE',
    title: 'Introdução à Inteligência Artificial',
    image: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?auto=format&fit=crop&w=1600&q=90',
    terms: ['inteligência artificial', 'inteligencia artificial', 'machine learning', 'ia']
  },
  {
    id: 'banco-de-dados',
    eyebrow: 'CURSO EM DESTAQUE',
    title: 'Banco de Dados PostgreSQL',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=90',
    terms: ['banco de dados', 'postgresql', 'sql', 'database']
  },
  {
    id: 'gastronomia',
    eyebrow: 'CURSO EM DESTAQUE',
    title: 'Aprendendo a cozinhar como um adulto funcional',
    image: heroGastronomia,
    isCustomBanner: true,
    terms: ['gastronomia', 'culinária', 'culinaria', 'cozinha']
  }
];

export function Hero({ courses = [], searchTerm, onSearchChange, onSearchSubmit }) {
  const navigate = useNavigate();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

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
              style={activeSlide.isCustomBanner ? { objectFit: 'cover', background: 'transparent' } : {}}
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
                  <strong>{relatedCourse?.title || activeSlide.title}</strong>
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
          Mais de 100 escolas e milhares de cursos em um só lugar.
        </p>

        {/* Barra de Busca */}
        <form className="hero-search-wrapper" onSubmit={onSearchSubmit}>
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
        </form>
      </div>
    </section>
  );
}

export default Hero;
