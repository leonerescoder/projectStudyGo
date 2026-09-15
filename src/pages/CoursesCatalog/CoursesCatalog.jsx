import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, Calendar, BarChart, MapPin, ChevronRight, ChevronDown, Flame, Sparkles } from 'lucide-react';
import './CoursesCatalog.css';

const ALL_COURSES = [
  {
    id: 1,
    title: 'Python: Fundamento I',
    school: 'Senac',
    category: 'Tecnologia da Informação',
    hours: 100,
    duration: '3 meses',
    level: 'Iniciante',
    mode: 'Online',
    initials: 'SC',
    color: '#c2410c',
    tag: 'Mais procurado',
  },
  {
    id: 2,
    title: 'Lógica de Programação',
    school: 'Alura',
    category: 'Tecnologia da Informação',
    hours: 80,
    duration: '2 meses',
    level: 'Iniciante',
    mode: 'Online',
    initials: 'AL',
    color: '#16a34a',
    tag: null,
  },
  {
    id: 3,
    title: 'Desenvolvimento Web Completo',
    school: 'Senai',
    category: 'Tecnologia da Informação',
    hours: 160,
    duration: '5 meses',
    level: 'Iniciante',
    mode: 'Presencial',
    initials: 'SI',
    color: '#2563eb',
    tag: null,
  },
  {
    id: 4,
    title: 'Java do Zero ao Avançado',
    school: 'Alura',
    category: 'Tecnologia da Informação',
    hours: 120,
    duration: '4 meses',
    level: 'Intermediário',
    mode: 'Online',
    initials: 'AL',
    color: '#16a34a',
    tag: null,
  },
  {
    id: 5,
    title: 'Técnico em Inteligência Artificial',
    school: 'Senac',
    category: 'Tecnologia da Informação',
    hours: 240,
    duration: '8 meses',
    level: 'Intermediário',
    mode: 'Presencial',
    initials: 'SC',
    color: '#c2410c',
    tag: 'Novo',
  },
  {
    id: 6,
    title: 'Técnico em Segurança Cibernética',
    school: 'Senai',
    category: 'Tecnologia da Informação',
    hours: 200,
    duration: '6 meses',
    level: 'Avançado',
    mode: 'Presencial',
    initials: 'SI',
    color: '#2563eb',
    tag: null,
  },
];

function CoursesCatalog() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const filteredCourses = ALL_COURSES.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="courses-catalog-page">
      <div className="catalog-header">
        <h1>Catálogo de cursos</h1>
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
        {filteredCourses.map(course => (
          <div
            key={course.id}
            className="catalog-card"
            onClick={() => navigate(`/course/${course.id}`)}
          >
            <div className="catalog-card-logo" style={{ backgroundColor: course.color }}>
              {course.initials}
            </div>

            <div className="catalog-card-info">
              <div className="catalog-card-title-row">
                <h3>{course.title}</h3>
                {course.tag === 'Mais procurado' && (
                  <span className="tag tag-popular">
                    <Flame size={12} /> Mais procurado
                  </span>
                )}
                {course.tag === 'Novo' && (
                  <span className="tag tag-new">
                    <Sparkles size={12} /> Novo
                  </span>
                )}
              </div>
              <p className="catalog-card-school">
                {course.school} · {course.category}
              </p>
              <div className="catalog-card-meta">
                <span><Clock size={14} /> {course.hours} horas</span>
                <span><Calendar size={14} /> {course.duration}</span>
                <span><BarChart size={14} /> {course.level}</span>
                <span><MapPin size={14} /> {course.mode}</span>
              </div>
            </div>

            <div className="catalog-card-arrow">
              <ChevronRight size={22} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoursesCatalog;
