import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CourseCard } from './CourseCard';
import { CategoryFilter } from '../CategoryFilter/CategoryFilter';

export function CourseGrid({
  courses,
  categories = [],
  activeCategory,
  onSelectCategory,
  onResetFilters,
  sectionId = 'cursos-em-destaque',
  sectionTitle = 'Cursos populares',
  showCategoryFilter = true,
  categoryName
}) {
  const seeAllPath = categoryName ? `/cursos?category=${encodeURIComponent(categoryName)}` : '/cursos';
  return (
    <section id={sectionId} className="courses-showcase-section">
      <div className="courses-showcase-container">
        {/* Cabeçalho da Seção */}
        <div className="courses-section-top-header">
          <div className="title-with-bar">
            <span className="accent-bar"></span>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
              <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
            </svg>
            <h2 className="section-main-title">{sectionTitle}</h2>
          </div>

          <Link to={seeAllPath} className="see-all-pill-btn">
            <span>Ver todos</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {showCategoryFilter && <CategoryFilter categories={categories} activeCategory={activeCategory} onSelectCategory={onSelectCategory} />}

        {/* Grid de Cursos */}
        <div className="courses-grid-layout">
          {courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <div className="empty-courses-state">
              <p>Nenhum curso encontrado nesta categoria ou pesquisa.</p>
              <button
                type="button"
                className="btn-clear-filters"
                onClick={onResetFilters}
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CourseGrid;
