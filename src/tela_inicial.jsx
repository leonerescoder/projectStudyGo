import React, { useState, useMemo, useEffect } from 'react';
import { Hero } from './components/Hero/Hero';
import { Features } from './components/Features/Features';
import { CourseGrid } from './components/CourseGrid/CourseGrid';
import { Footer } from './components/Footer/Footer';
import { CompanyBanner } from './components/CompanyBanner/CompanyBanner';
import { DirectorRegistrationModal } from './components/Auth/DirectorRegistrationModal';
import { CompanyRegistrationModal } from './components/Auth/CompanyRegistrationModal';
import { RankingSection } from './components/RankingSection/RankingSection';
import { buscaTodos } from './ApiCourses/ApiCourse';

import './tela_inicial.css';

const mockSchools = {
  1: 'Escola de Administração',
  2: 'Escola de Tecnologia',
  3: 'Escola de Negócios',
  4: 'Escola de Design'
};

const getSchoolName = (id) => mockSchools[id] || `Escola (ID: ${id})`;

const getVisualType = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('java')) return 'java-cup';
  if (n.includes('web') || n.includes('front') || n.includes('html')) return 'web-stack';
  if (n.includes('cloud') || n.includes('nuvem')) return 'cloud-net';
  if (n.includes('data') || n.includes('sql') || n.includes('banco')) return 'database-cylinder';
  if (n.includes('design') || n.includes('figma') || n.includes('ui')) return 'ui-design';
  return 'code-editor';
};

export function TelaInicial() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [courses, setCourses] = useState([]);
  const [isDirectorModalOpen, setIsDirectorModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  useEffect(() => {
    async function loadCourses() {
      try {
        const response = await buscaTodos();
        // Check if response is an array or wrapped in a property like .value or .data
        const data = Array.isArray(response) ? response : (response.value || response.data || []);
        
        // Ordena por ranking (views) decrescente para determinar posições reais
        const sorted = [...data].sort((a, b) => (b.ranking || 0) - (a.ranking || 0));
        const rankPositionMap = {};
        sorted.forEach((c, i) => { rankPositionMap[c.id] = i + 1; });

        const mappedCourses = data.map(c => ({
          id: c.id,
          title: c.name || 'Curso sem nome',
          category: c.fieldOfStudy || 'Geral',
          description: c.description || '',
          school: getSchoolName(c.companyId),
          workload: `${c.workload || 0} horas`,
          urlImg: c.urlImg,
          visualType: getVisualType(c.name),
          rawRanking: c.ranking || 0,
          rankPosition: rankPositionMap[c.id] || null,
          // Badge só aparece nos top 3 por posição real (não pelo valor bruto de views)
          badge: rankPositionMap[c.id] <= 3 ? { type: 'popular', text: 'Mais procurado' } : null
        }));
        setCourses(mappedCourses);
      } catch (err) {
        console.error("Erro ao buscar cursos na tela inicial:", err);
      }
    }
    loadCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
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
  }, [searchTerm, activeCategory, courses]);

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
        courses={courses}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* 2. Barra de Estatísticas / Diferenciais */}
      <Features />

      {/* 2.5 Seção de Ranking de Cursos */}
      <RankingSection courses={courses} />

      {/* 3. Seção de Cursos em Destaque com Filtros */}
      <CourseGrid
        courses={filteredCourses}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Banner para Empresas (Call to Action) */}
      <CompanyBanner onRegisterClick={() => setIsDirectorModalOpen(true)} />

      {/* 5. Rodapé Completo */}
      <Footer />

      {/* Modais */}
      <DirectorRegistrationModal 
        isOpen={isDirectorModalOpen} 
        onClose={() => setIsDirectorModalOpen(false)} 
        onSuccessRegistration={() => {
          setIsDirectorModalOpen(false);
          setIsCompanyModalOpen(true);
        }}
      />

      <CompanyRegistrationModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
      />
    </div>
  );
}

export default TelaInicial;
