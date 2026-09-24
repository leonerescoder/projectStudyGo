import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  BarChart,
  Code,
  Building
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { buscaID, buscaTodos } from '../../ApiCourses/ApiCourse';
import { getCourseImageUrl } from '../../utils/courseImage';
import courseImageFallback from '../../assets/estudandes.jpg';
import {
  recordCourseClick,
  enrichCourseWithRanking
} from '../../utils/rankingService';
import './Course.css';

function Course() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [rankPosition, setRankPosition] = useState(null);
  const [relatedRankMap, setRelatedRankMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true);
        setError(null);

        // Registra a visualização/clique do curso
        recordCourseClick(id);

        // Busca o curso pelo ID
        const rawCourseData = await buscaID(id);
        const courseResponse =
          rawCourseData?.value ||
          rawCourseData?.data ||
          rawCourseData;

        // Adiciona as informações de ranking
        const courseData = enrichCourseWithRanking(courseResponse);

        setCourse(courseData);

        // Busca todos os cursos para calcular ranking e cursos relacionados
        try {
          const rawAllCourses = await buscaTodos();

          const allCoursesData = Array.isArray(rawAllCourses)
            ? rawAllCourses
            : (
                rawAllCourses?.value ||
                rawAllCourses?.data ||
                []
              );

          // Enriquece todos os cursos com as informações de ranking
          const allCourses = allCoursesData.map((courseItem) =>
            enrichCourseWithRanking(courseItem)
          );

          // Ordena pelo ranking real
          const sorted = [...allCourses].sort(
            (a, b) =>
              (b.rawRanking || 0) - (a.rawRanking || 0)
          );

          // Descobre a posição do curso atual
          const position = sorted.findIndex(
            (courseItem) =>
              String(courseItem.id) === String(courseData.id)
          );

          setRankPosition(
            position !== -1 ? position + 1 : null
          );

          // Cria mapa de posição dos cursos
          const rankMap = {};

          sorted.forEach((courseItem, index) => {
            rankMap[courseItem.id] = index + 1;
          });

          setRelatedRankMap(rankMap);

          // Busca cursos relacionados
          const related = allCourses
            .filter(
              (courseItem) =>
                String(courseItem.id) !== String(courseData.id) &&
                (
                  courseItem.fieldOfStudy === courseData.fieldOfStudy ||
                  courseItem.categories?.some((category) =>
                    courseData.categories?.some(
                      (currentCategory) =>
                        currentCategory.id === category.id
                    )
                  )
                )
            )
            .slice(0, 4);

          setRelatedCourses(related);
        } catch (relatedError) {
          console.error(
            'Erro ao buscar cursos relacionados:',
            relatedError
          );
        }
      } catch (err) {
        console.error('Erro ao carregar curso:', err);

        setError(
          'Não foi possível carregar o curso. Tente novamente mais tarde.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [id]);

  // Tela de carregamento
  if (loading) {
    return (
      <div id="course-page">
        <div className="course-loading">
          <div className="loading-spinner"></div>
          <p>Carregando curso...</p>
        </div>
      </div>
    );
  }

  // Tela de erro
  if (error || !course) {
    return (
      <div id="course-page">
        <div className="course-error">
          <p>
            {error || 'Curso não encontrado.'}
          </p>

          <button
            onClick={() => navigate('/cursos')}
            className="back-link"
          >
            Voltar ao catálogo
          </button>
        </div>
      </div>
    );
  }

  // Nome das categorias
  const categoryNames =
    course.categories?.map((category) => category.name).join(', ') ||
    course.fieldOfStudy ||
    'Geral';

  // Nome da escola
  const companyName =
    course.company?.name || 'Escola';

  // Cores dos cards relacionados
  const relatedColors = [
    '#6366f1',
    '#0ea5e9',
    '#f59e0b',
    '#10b981'
  ];

  return (
    <div id="course-page">

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={20} />
        </button>

        <span>
          Cursos /{' '}
          <span className="highlight">
            {course.fieldOfStudy || categoryNames}
          </span>
        </span>
      </div>

      {/* Curso principal */}
      <div className="main-course-card">

        {/* Imagem */}
        <div className="course-image-container">

          {/* Badge de mais procurado */}
          {rankPosition !== null && rankPosition <= 5 && (
            <div className="badge">
              <span className="fire-icon">🔥</span>
              Mais procurado
            </div>
          )}

          {getCourseImageUrl(course) ? (
            <img
              src={getCourseImageUrl(course)}
              alt={course.name}
              className="course-image"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src =
                  courseImageFallback;
              }}
            />
          ) : (
            <div className="image-placeholder">
              <div className="python-logo">
                📚
              </div>
            </div>
          )}
        </div>

        {/* Informações do curso */}
        <div className="course-details">

          {/* Ranking */}
          {rankPosition !== null && (
            <div className="ranking-badge">
              <Star
                size={16}
                fill="#f59e0b"
                color="#f59e0b"
              />

              <div className="ranking-text">
                <span className="ranking-label">
                  Ranking
                </span>

                <span className="ranking-value">
                  {rankPosition}º lugar
                </span>
              </div>
            </div>
          )}

          {/* Nome */}
          <h1 className="course-title">
            {course.name}
          </h1>

          {/* Categoria */}
          <div className="category-info">
            <div className="category-icon">
              <Code size={20} />
            </div>

            <div className="category-text">
              <span className="category-label">
                Categoria
              </span>

              <span className="category-value">
                {categoryNames}
              </span>
            </div>
          </div>

          {/* Descrição */}
          <p className="course-description">
            {course.description ||
              'Descrição não disponível.'}
          </p>

          {/* Escola */}
          <button
            className="school-info-btn"
            onClick={() =>
              course.companyId &&
              navigate(`/escolas/${course.companyId}`)
            }
          >
            <Building size={20} />

            Ver mais informações da escola —{' '}
            {companyName}

            <ChevronRight
              size={20}
              className="chevron"
            />
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="stats-row">

        {/* Carga horária */}
        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={24} />
          </div>

          <div className="stat-info">
            <span className="stat-label">
              Carga Horária
            </span>

            <span className="stat-value">
              {course.workload || 0} horas
            </span>
          </div>
        </div>

        {/* Área de estudo */}
        <div className="stat-card">
          <div className="stat-icon">
            <BarChart size={24} />
          </div>

          <div className="stat-info">
            <span className="stat-label">
              Área de Estudo
            </span>

            <span className="stat-value">
              {course.fieldOfStudy || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Cursos relacionados */}
      {relatedCourses.length > 0 && (
        <div className="related-courses">

          <div className="related-header">
            <div>
              <h2>
                Cursos Relacionados
              </h2>

              <p>
                Explore outros cursos na mesma área
                e amplie seus conhecimentos.
              </p>
            </div>
          </div>

          <div className="related-cards">

            {relatedCourses.map((relatedCourse, index) => (
              <div
                key={relatedCourse.id}
                className="related-card"
                onClick={() => {
                  recordCourseClick(
                    relatedCourse.id,
                    relatedCourse
                  );

                  navigate(
                    `/course/${relatedCourse.id}`
                  );
                }}
                style={{ cursor: 'pointer' }}
              >

                {/* Imagem do curso relacionado */}
                <div
                  className="card-image"
                  style={{
                    background: `linear-gradient(
                      135deg,
                      ${
                        relatedColors[
                          index % relatedColors.length
                        ]
                      },
                      ${
                        relatedColors[
                          (index + 1) %
                            relatedColors.length
                        ]
                      }
                    )`
                  }}
                >

                  {/* Posição no ranking */}
                  {relatedRankMap[relatedCourse.id] && (
                    <span className="card-ranking">
                      {relatedRankMap[relatedCourse.id]}º lugar
                    </span>
                  )}

                  {getCourseImageUrl(relatedCourse) ? (
                    <img
                      src={getCourseImageUrl(
                        relatedCourse
                      )}
                      alt={relatedCourse.name}
                      className="related-card-img"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          courseImageFallback;
                      }}
                    />
                  ) : (
                    <div className="card-logo">
                      📚
                    </div>
                  )}
                </div>

                {/* Informações */}
                <div className="card-content">

                  <h3>
                    {relatedCourse.name}
                  </h3>

                  <div className="card-category">
                    <Code size={16} />

                    {relatedCourse.fieldOfStudy ||
                      relatedCourse.categories
                        ?.map((category) => category.name)
                        .join(', ') ||
                      'Geral'}
                  </div>

                  <div className="card-duration">
                    <Clock size={16} />

                    {relatedCourse.workload || 0} horas
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Course;