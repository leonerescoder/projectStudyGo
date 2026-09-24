import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Clock, Calendar, BarChart, MapPin, ChevronRight, ChevronDown, Flame, Sparkles, Building } from 'lucide-react';
import { buscaTodos } from '../../ApiCourses/ApiCourse';
import { buscaEmpresas } from '../../API/apiCompany';
import { getCourseImageUrl } from '../../utils/courseImage';
import './CoursesCatalog.css';

function CoursesCatalog() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('popular');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const categoryFilter = searchParams.get('category') || '';
  const categoryTitle = categoryFilter ? `Cursos de ${categoryFilter}` : 'Catálogo de cursos';

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        setError(null);
        const [courseData, companyData] = await Promise.all([buscaTodos(), buscaEmpresas()]);
        const companiesById = Object.fromEntries(companyData.map(company => [company.id, company]));
        setCourses(courseData.map(course => ({ ...course, company: course.company || companiesById[course.companyId] })));
      } catch (err) {
        console.error('Erro ao carregar cursos:', err);
        setError('Não foi possível carregar os cursos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  const normalizedCategory = categoryFilter.toLowerCase();
  const normalizedSearch = searchTerm.toLowerCase();
  const filteredCourses = courses.filter(course => {
    const matchesCategory = !normalizedCategory ||
      (course.categories || []).some(category => (category.name || '').toLowerCase() === normalizedCategory) ||
      (course.fieldOfStudy || '').toLowerCase() === normalizedCategory;
    const matchesSearch = !normalizedSearch ||
      (course.name || '').toLowerCase().includes(normalizedSearch) ||
      (course.fieldOfStudy || '').toLowerCase().includes(normalizedSearch) ||
      (course.company?.name || '').toLowerCase().includes(normalizedSearch) ||
      (course.description || '').toLowerCase().includes(normalizedSearch) ||
      (course.categories || []).some(category => (category.name || '').toLowerCase().includes(normalizedSearch));
    return matchesCategory && matchesSearch;
  });

  const cardColors = ['#c2410c', '#16a34a', '#2563eb', '#9333ea', '#0891b2', '#dc2626'];

  function getInitials(name) {
    if (!name) return '??';
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  }

  if (loading) {
    return (
      <div id="courses-catalog-page">
        <div className="catalog-header">
          <h1>{categoryTitle}</h1>
          <p>Carregando cursos...</p>
        </div>
        <div className="catalog-loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="courses-catalog-page">
        <div className="catalog-header">
          <h1>Catálogo de cursos</h1>
          <p className="catalog-error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div id="courses-catalog-page">
      <div className="catalog-header">
        <h1>{categoryTitle}</h1>
        <p>Veja os cursos das escolas parceiras e abra para conhecer os detalhes.</p>
      </div>

      <div className="catalog-actions">
        <div className="catalog-search">
          <Search size={18} className="catalog-search-icon" />
          <input
            type="text"
            placeholder="Buscar por curso, escola ou área"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="catalog-sort">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="popular">Mais procurados</option>
            <option value="recent">Mais recentes</option>
            <option value="hours">Carga horária</option>
          </select>
          <ChevronDown size={16} className="sort-chevron" />
        </div>
      </div>

      <span className="catalog-count">{filteredCourses.length} cursos</span>

      <div className="catalog-list">
        {filteredCourses.map((course, index) => {
          const color = cardColors[index % cardColors.length];
          const companyName = course.company?.name || 'Escola';
          const initials = getInitials(companyName);
          const categories = course.categories?.map(c => c.name).join(', ') || course.fieldOfStudy || 'Geral';

          const courseImg = getCourseImageUrl(course);
          return (
            <div
              key={course.id}
              className="catalog-card"
              onClick={() => navigate(`/course/${course.id}`)}
            >
              <div className="catalog-card-logo" style={{ backgroundColor: courseImg ? 'transparent' : color, padding: 0, overflow: 'hidden' }}>
                {courseImg ? (
                  <img src={courseImg} alt={course.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.style.backgroundColor = color; e.target.parentNode.innerText = initials; }} />
                ) : (
                  initials
                )}
              </div>

              <div className="catalog-card-info">
                <div className="catalog-card-title-row">
                  <h3>{course.name}</h3>
                  {course.ranking && course.ranking <= 3 && (
                    <span className="tag tag-popular">
                      <Flame size={12} /> Mais procurado
                    </span>
                  )}
                </div>
                <p className="catalog-card-school">
                  {categories}
                </p>
                <div className="catalog-card-meta">
                  <span><Building size={14} /> {companyName}</span>
                  <span><Clock size={14} /> {course.workload || 0} horas</span>
                  <span><BarChart size={14} /> {course.fieldOfStudy || 'N/A'}</span>
                </div>
              </div>

              <div className="catalog-card-arrow">
                <ChevronRight size={22} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CoursesCatalog;
