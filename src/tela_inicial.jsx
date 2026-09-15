import React, { useState, useMemo } from 'react';
import { Hero } from './components/Hero/Hero';
import { Features } from './components/Features/Features';
import { CourseGrid } from './components/CourseGrid/CourseGrid';
import { Footer } from './components/Footer/Footer';
import { COURSES_DATA } from './data/mockData';

import './tela_inicial.css';

export function TelaInicial() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredCourses = useMemo(() => {
    return COURSES_DATA.filter((course) => {
      // Filtro por categoria
      const matchesCategory =
        activeCategory === 'Todos' ||
        course.category.toLowerCase() === activeCategory.toLowerCase();

      // Filtro por busca
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        course.school.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const element = document.getElementById('cursos-em-destaque');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveCategory('Todos');
  };

  return (
    <div id="tela-inicial">
      {/* 1. Seção Hero Centralizada */}
      <Hero
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* 2. Barra de Estatísticas / Diferenciais */}
      <Features />

      {/* 3. Seção de Cursos em Destaque com Filtros */}
      <CourseGrid
        courses={filteredCourses}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Rodapé Completo */}
      <Footer />
    </div>
  );
}

export default TelaInicial;
