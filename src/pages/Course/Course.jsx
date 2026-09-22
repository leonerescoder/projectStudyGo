import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Clock, BarChart, Calendar, Award, Code, Building } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { buscaID, buscaTodos } from '../../ApiCourses/ApiCourse';
import { getCourseImageUrl } from '../../utils/courseImage';
import './Course.css';

function Course() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true);
        setError(null);

        // Busca o curso pelo ID
        const courseData = await buscaID(id);
        setCourse(courseData);

        // Busca todos os cursos para pegar os relacionados (mesma área de estudo)
        try {
          const allCourses = await buscaTodos();
          const related = allCourses
            .filter(c =>
              c.id !== courseData.id &&
              (c.fieldOfStudy === courseData.fieldOfStudy || 
               c.categories?.some(cat => courseData.categories?.some(cc => cc.id === cat.id)))
            )
            .slice(0, 4);
          setRelatedCourses(related);
        } catch (e) {
          console.error("Erro ao buscar cursos relacionados", e);
        }
      } catch (err) {
        console.error('Erro ao carregar curso:', err);
        setError('Não foi possível carregar o curso. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [id]);

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

  if (error || !course) {
    return (
      <div id="course-page">
        <div className="course-error">
          <p>{error || 'Curso não encontrado.'}</p>
          <button onClick={() => navigate('/cursos')} className="back-link">
            Voltar ao catálogo
          </button>
        </div>
      </div>
    );
  }

  const categoryNames = course.categories?.map(c => c.name).join(', ') || course.fieldOfStudy || 'Geral';
  const companyName = course.company?.name || 'Escola';

  // Cores para os cards de cursos relacionados
  const relatedColors = ['#6366f1', '#0ea5e9', '#f59e0b', '#10b981'];

  return (
    <div id="course-page">
      <div className="breadcrumb">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </button>
        <span>Cursos / <span className="highlight">{course.fieldOfStudy || categoryNames}</span></span>
      </div>

      <div className="main-course-card">
        <div className="course-image-container">
          {course.ranking && course.ranking <= 5 && (
            <div className="badge">
              <span className="fire-icon">🔥</span> Mais procurado
            </div>
          )}
          {getCourseImageUrl(course) ? (
            <img src={getCourseImageUrl(course)} alt={course.name} className="course-image" />
          ) : (
            <div className="image-placeholder">
              <div className="python-logo">📚</div>
            </div>
          )}
        </div>

        <div className="course-details">
          {course.ranking && (
            <div className="ranking-badge">
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <div className="ranking-text">
                <span className="ranking-label">Ranking</span>
                <span className="ranking-value">{course.ranking}º lugar</span>
              </div>
            </div>
          )}

          <h1 className="course-title">{course.name}</h1>
          
          <div className="category-info">
            <div className="category-icon">
              <Code size={20} />
            </div>
            <div className="category-text">
              <span className="category-label">Categoria</span>
              <span className="category-value">{categoryNames}</span>
            </div>
          </div>

          <p className="course-description">
            {course.description || 'Descrição não disponível.'}
          </p>

          <button 
            className="school-info-btn"
            onClick={() => course.companyId && navigate(`/escolas/${course.companyId}`)}
          >
            <Building size={20} />
            Ver mais informações da escola — {companyName}
            <ChevronRight size={20} className="chevron" />
          </button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon"><Clock size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Carga Horária</span>
            <span className="stat-value">{course.workload || 0} horas</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><BarChart size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Área de Estudo</span>
            <span className="stat-value">{course.fieldOfStudy || 'N/A'}</span>
          </div>
        </div>
      </div>

      {relatedCourses.length > 0 && (
        <div className="related-courses">
          <div className="related-header">
            <div>
              <h2>Cursos Relacionados</h2>
              <p>Explore outros cursos na mesma área e amplie seus conhecimentos.</p>
            </div>
          </div>

          <div className="related-cards">
            {relatedCourses.map((rc, index) => (
              <div
                key={rc.id}
                className="related-card"
                onClick={() => navigate(`/course/${rc.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="card-image"
                  style={{ background: `linear-gradient(135deg, ${relatedColors[index % relatedColors.length]}, ${relatedColors[(index + 1) % relatedColors.length]})` }}
                >
                  {rc.ranking && (
                    <span className="card-ranking">{rc.ranking}º lugar</span>
                  )}
                  {getCourseImageUrl(rc) ? (
                    <img src={getCourseImageUrl(rc)} alt={rc.name} className="related-card-img" />
                  ) : (
                    <div className="card-logo">📚</div>
                  )}
                </div>
                <div className="card-content">
                  <h3>{rc.name}</h3>
                  <div className="card-category">
                    <Code size={16} /> {rc.fieldOfStudy || rc.categories?.map(c => c.name).join(', ') || 'Geral'}
                  </div>
                  <div className="card-duration">
                    <Clock size={16} /> {rc.workload || 0} horas
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
