import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CourseCard } from './CourseCard';
import { CategoryFilter } from '../CategoryFilter/CategoryFilter';

export function CourseGrid({
  courses,
  activeCategory,
  onSelectCategory,
  onResetFilters
}) {
  return (
    <section id="cursos-em-destaque" className="courses-showcase-section">
      <div className="courses-showcase-container">
        {/* Cabeçalho da Seção */}
        <div className="courses-section-top-header">
          <div className="title-with-bar">
            <span className="accent-bar"></span>
            <h2 className="section-main-title">Cursos em destaque</h2>
          </div>

          <Link to="/cursos" className="see-all-pill-btn">
            <span>Ver todos</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Filtro de Categorias */}
        <CategoryFilter
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
        />

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
