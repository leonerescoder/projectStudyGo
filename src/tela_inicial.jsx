import React, { useState, useMemo, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { Hero } from './components/Hero/Hero';
import { Features } from './components/Features/Features';
import { CourseGrid } from './components/CourseGrid/CourseGrid';
import { Footer } from './components/Footer/Footer';
import { CompanyBanner } from './components/CompanyBanner/CompanyBanner';
import { DirectorRegistrationModal } from './components/Auth/DirectorRegistrationModal';
import { CompanyRegistrationModal } from './components/Auth/CompanyRegistrationModal';
import { RankingSection } from './components/RankingSection/RankingSection';
import { buscaTodos } from './ApiCourses/ApiCourse';
import { buscaCategorias } from './API/apiCategorie';
import { buscaEmpresas } from './API/apiCompany';
import {
  enrichCourseWithRanking,
  RANKING_UPDATE_EVENT
} from './utils/rankingService';

import './tela_inicial.css';

const mockSchools = {
  1: 'Escola de Administração',
  2: 'Escola de Tecnologia',
  3: 'Escola de Negócios',
  4: 'Escola de Design'
};

const getSchoolName = (id) =>
  mockSchools[id] || `Escola (ID: ${id})`;

const courseBelongsToCategory = (
  course,
  categoryName
) => {
  const normalizedCategory =
    categoryName?.toLowerCase() || '';

  const belongsByCategories =
    Array.isArray(course.categories) &&
    course.categories.some(
      (category) =>
        (category.name || '').toLowerCase() ===
        normalizedCategory
    );

  const belongsByField =
    (course.category || '').toLowerCase() ===
      normalizedCategory ||
    (course.fieldOfStudy || '').toLowerCase() ===
      normalizedCategory;

  return belongsByCategories || belongsByField;
};

const getVisualType = (name = '') => {
  const n = name.toLowerCase();

  if (n.includes('java')) return 'java-cup';
  if (
    n.includes('web') ||
    n.includes('front') ||
    n.includes('html')
  ) {
    return 'web-stack';
  }

  if (
    n.includes('cloud') ||
    n.includes('nuvem')
  ) {
    return 'cloud-net';
  }

  if (
    n.includes('data') ||
    n.includes('sql') ||
    n.includes('banco')
  ) {
    return 'database-cylinder';
  }

  if (
    n.includes('design') ||
    n.includes('figma') ||
    n.includes('ui')
  ) {
    return 'ui-design';
  }

  return 'code-editor';
};

export function TelaInicial() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] =
    useState('Todos');

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [isDirectorModalOpen, setIsDirectorModalOpen] =
    useState(false);

  const [isCompanyModalOpen, setIsCompanyModalOpen] =
    useState(false);

  useEffect(() => {
    async function loadCourses() {
      try {
        const [
          response,
          companyData
        ] = await Promise.all([
          buscaTodos(),
          buscaEmpresas()
        ]);

        const companiesList = Array.isArray(companyData)
          ? companyData
          : (
              companyData?.value ||
              companyData?.data ||
              []
            );

        setCompanies(companiesList);

        const rawData = Array.isArray(response)
          ? response
          : (
              response?.value ||
              response?.data ||
              []
            );

        // Enriquece cada curso com informações
        // de cliques e pontos do ranking.
        const data = rawData.map((course) =>
          enrichCourseWithRanking(course)
        );

        // Ordena os cursos pelo ranking total.
        const sorted = [...data].sort(
          (a, b) =>
            (b.rawRanking || 0) -
            (a.rawRanking || 0)
        );

        // Cria o mapa de posições.
        const rankPositionMap = {};

        sorted.forEach((course, index) => {
          rankPositionMap[course.id] =
            index + 1;
        });

        const mappedCourses = data.map((course) => {
          const company =
            course.company ||
            companiesList.find(
              (companyItem) =>
                companyItem.id ===
                course.companyId
            );

          const rankPosition =
            rankPositionMap[course.id] || null;

          return {
            id: course.id,

            title:
              course.name ||
              'Curso sem nome',

            category:
              course.categories
                ?.map((category) => category.name)
                .join(', ') ||
              course.fieldOfStudy ||
              'Geral',

            categories: Array.isArray(
              course.categories
            )
              ? course.categories
              : [],

            description:
              course.description || '',

            school:
              company?.name ||
              getSchoolName(
                course.companyId
              ),

            workload: `${
              course.workload || 0
            } horas`,

            urlImg: course.urlImg,

            visualType:
              getVisualType(course.name),

            rawRanking:
              course.rawRanking || 0,

            clicks:
              course.clicks || 0,

            boostedPoints:
              course.boostedPoints || 0,

            rankPosition,

            // Badge somente para os 3 primeiros.
            badge:
              rankPosition !== null &&
              rankPosition <= 3
                ? {
                    type: 'popular',
                    text: 'Mais procurado'
                  }
                : null
          };
        });

        setCourses(mappedCourses);
      } catch (err) {
        console.error(
          'Erro ao buscar cursos na tela inicial:',
          err
        );
      }
    }

    loadCourses();

    // Atualiza o ranking quando houver
    // novo clique ou alteração administrativa.
    const handleRankingUpdate = () => {
      loadCourses();
    };

    window.addEventListener(
      RANKING_UPDATE_EVENT,
      handleRankingUpdate
    );

    return () => {
      window.removeEventListener(
        RANKING_UPDATE_EVENT,
        handleRankingUpdate
      );
    };
  }, []);

  useEffect(() => {
    buscaCategorias()
      .then((data) => {
        setCategories(
          Array.isArray(data)
            ? data
            : (
                data?.value ||
                data?.data ||
                []
              )
        );
      })
      .catch((err) =>
        console.error(
          'Erro ao buscar categorias:',
          err
        )
      );
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Filtro por categoria.
      const matchesCategory =
        activeCategory === 'Todos' ||
        courseBelongsToCategory(
          course,
          activeCategory
        );

      // Filtro por busca.
      const query = searchTerm
        .trim()
        .toLowerCase();

      const matchesSearch =
        !query ||
        (course.title || '')
          .toLowerCase()
          .includes(query) ||
        (course.category || '')
          .toLowerCase()
          .includes(query) ||
        (course.school || '')
          .toLowerCase()
          .includes(query) ||
        (course.description || '')
          .toLowerCase()
          .includes(query);

      return (
        matchesCategory &&
        matchesSearch
      );
    });
  }, [
    searchTerm,
    activeCategory,
    courses
  ]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const element =
      document.getElementById(
        'cursos-em-destaque'
      );

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveCategory('Todos');
  };

  const handleCompanyCardClick = () => {
    document
      .getElementById(
        'company-registration-banner'
      )
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
  };

  return (
    <div id="tela-inicial">

      {/* 1. Seção Hero */}
      <Hero
        courses={courses}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Convite para empresas */}
      <button
        type="button"
        className="company-invite-card"
        onClick={handleCompanyCardClick}
      >
        <span className="company-invite-card-content">
          <strong>
            Cadastre sua empresa no StudyGo
          </strong>

          <span>
            Divulgue seus cursos para novos alunos
          </span>
        </span>

        <ArrowDown
          size={22}
          aria-hidden="true"
        />
      </button>

      {/* 2. Estatísticas / Diferenciais */}
      <Features />

      {/* 2.5. Ranking de cursos */}
      <RankingSection
        courses={courses}
      />

      {/* 3. Cursos em destaque */}
      <CourseGrid
        courses={filteredCourses}
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={
          setActiveCategory
        }
        onResetFilters={
          handleResetFilters
        }
      />

      {/* Cursos separados por categoria */}
      {categories.map((category) => {
        const categoryCourses =
          filteredCourses.filter(
            (course) =>
              courseBelongsToCategory(
                course,
                category.name
              )
          );

        if (!categoryCourses.length) {
          return null;
        }

        return (
          <CourseGrid
            key={category.id}
            sectionId={`categoria-${category.id}`}
            sectionTitle={category.name}
            categoryName={category.name}
            courses={categoryCourses}
            showCategoryFilter={false}
            onResetFilters={
              handleResetFilters
            }
          />
        );
      })}

      {/* 4. Banner para empresas */}
      <CompanyBanner
        onRegisterClick={() =>
          setIsDirectorModalOpen(true)
        }
      />

      {/* 5. Rodapé */}
      <Footer />

      {/* Modal de diretor */}
      <DirectorRegistrationModal
        isOpen={isDirectorModalOpen}
        onClose={() =>
          setIsDirectorModalOpen(false)
        }
        onSuccessRegistration={() => {
          setIsDirectorModalOpen(false);
          setIsCompanyModalOpen(true);
        }}
      />

      {/* Modal de empresa */}
      <CompanyRegistrationModal
        isOpen={isCompanyModalOpen}
        onClose={() =>
          setIsCompanyModalOpen(false)
        }
      />
    </div>
  );
}

export default TelaInicial;