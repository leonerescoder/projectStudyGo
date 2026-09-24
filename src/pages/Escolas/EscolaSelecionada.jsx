import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recordCourseClick } from '../../utils/rankingService';
import './EscolaSelecionada.css';

/* ─── Helpers ─────────────────────────────────────────────── */
const getRankingStyle = (position) => {
  if (position === 1) return { background: 'linear-gradient(135deg, #f5b942, #e8a020)', color: '#1a1200' };
  if (position === 2) return { background: 'linear-gradient(135deg, #c0c4cc, #9aa0aa)', color: '#1a1a1a' };
  if (position === 3) return { background: 'linear-gradient(135deg, #cd7f32, #b56a20)', color: '#fff' };
  return { background: 'rgba(184,144,71,0.15)', color: 'var(--brass)', border: '1px solid rgba(184,144,71,0.3)' };
};

const getScoreLabel = (score) => {
  if (score >= 9) return { label: 'Excelente', color: '#10b981' };
  if (score >= 7) return { label: 'Muito Bom', color: '#60a5fa' };
  if (score >= 5) return { label: 'Bom',       color: '#f59e0b' };
  if (score > 0)  return { label: 'Regular',   color: '#94a3b8' };
  return { label: 'Sem score', color: '#64748b' };
};

const formatDate = (dateString) => {
  if (!dateString || dateString === 'Não informada') return 'Não informada';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (e) {
    return dateString;
  }
};

/* ─── Conteúdo ilustrativo (mock) ────────────────────────── */
const MOCK_MISSION = (name) =>
  `A ${name} tem como missão formar profissionais altamente capacitados, unindo excelência acadêmica e inovação prática. Fundada com o propósito de democratizar o conhecimento, a instituição investe continuamente em infraestrutura, corpo docente e parcerias estratégicas para garantir uma formação completa e alinhada ao mercado.`;

const MOCK_DIFFERENTIALS = [
  { icon: '🔬', title: 'Laboratórios de Alta Tecnologia', desc: 'Estrutura de ponta para aulas práticas em ambientes reais.' },
  { icon: '🌐', title: 'Parcerias Internacionais', desc: 'Convênios com instituições de mais de 20 países.' },
  { icon: '📚', title: 'Biblioteca Especializada', desc: 'Acervo físico e digital com mais de 100 mil volumes.' },
  { icon: '🏆', title: 'Certificação Reconhecida', desc: 'Diplomas com reconhecimento nacional e international.' },
];

const MOCK_CONTACT = (name) => ({
  phone:   '(11) 4002-8922',
  email:   `contato@${name.toLowerCase().replace(/\s+/g, '')}.edu.br`,
  website: `www.${name.toLowerCase().replace(/\s+/g, '')}.edu.br`,
});

/* ─── SVG Icons (inline, sem dependência extra) ──────────── */
const IconBack = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconVerified = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
    <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);
const IconPin = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.93-.93a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.72 16z" />
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const IconExternal = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

/* ─── Componente Principal ────────────────────────────────── */
function EscolaSelecionada() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sobre');
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchool() {
      try {
        const token = localStorage.getItem('studygo_token') || localStorage.getItem('token') || '';
        const headers = {};
        if (token) headers['Authorization'] = 'Bearer ' + token;

        const response = await fetch('https://uc13-projeto.onrender.com/companie/' + id, { headers });
        if (!response.ok) throw new Error(`Erro na API (${response.status})`);

        const data = await response.json();
        const companieData = Array.isArray(data) ? data[0] : data;

        let finalRankingPosition = 1;
        let finalScore = 0;

        try {
          const listResponse = await fetch('https://uc13-projeto.onrender.com/companie', { headers });
          if (listResponse.ok) {
            const listData = await listResponse.json();
            const arrayData = Array.isArray(listData) ? listData : [];
            const sortedData = [...arrayData].sort((a, b) => (b.ranking || 0) - (a.ranking || 0));
            const index = sortedData.findIndex(c => String(c.id) === String(id));
            if (index !== -1) finalRankingPosition = index + 1;
            const maxRanking = sortedData.length > 0 ? (sortedData[0].ranking || 0) : 0;
            finalScore = maxRanking === 0 ? 0 : ((companieData.ranking || 0) / maxRanking) * 10;
          }
        } catch (e) {
          console.error('Erro ao calcular ranking:', e);
        }

        if (companieData) {
          setSchool({
            id: companieData.id,
            name: companieData.name,
            cnpj: companieData.cnpj || 'Não informado',
            foundedIn: companieData.foundation || 'Não informada',
            places: companieData.places || 'Não informado',
            ranking: companieData.ranking || 0,
            score: finalScore,
            rankingPosition: finalRankingPosition,
            fundamentals: companieData.fundaments || 'Não informado',
            methods: companieData.methods || 'Não informado',
            courses: companieData.courses || [],
          });
        }
      } catch (error) {
        console.error('Erro ao buscar a empresa:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSchool();
  }, [id]);

  const handleBackClick = () => {
    navigate('/escolas');
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  if (loading) {
    return (
      <div id="escola-selecionada-page">
        <div className="escola-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div className="es-spinner"></div>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div id="escola-selecionada-page">
        <div className="escola-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem' }}>
          <h2 style={{ color: 'var(--text-onDark)' }}>Instituição não encontrada.</h2>
          <button onClick={() => navigate('/escolas')} className="es-back-btn">
            <IconBack /> Voltar para Escolas
          </button>
        </div>
      </div>
    );
  }

  const scoreInfo   = getScoreLabel(school.score);
  const mockContact = MOCK_CONTACT(school.name);
  const mapsUrl     = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.places + ' ' + school.name)}`;

  return (
    <div id="escola-selecionada-page">
      <div className="escola-container">

        {/* ── Botão Voltar ── */}
        <button onClick={() => navigate('/escolas')} className="es-back-btn">
          <IconBack /> Voltar para Escolas
        </button>

        {/* ══════════════════════════════════════
            CABEÇALHO / HERO
        ══════════════════════════════════════ */}
        <header className="escola-header-professional">
          <div className="escola-cover-professional">
            <div className="escola-cover-overlay"></div>
          </div>

          <div className="escola-header-content-professional">
            <div className="escola-header-main-info">
              {/* Logo / Inicial */}
              <div className="escola-logo-professional">
                {school.name ? school.name.charAt(0) : '?'}
              </div>

              <div className="escola-title-area">
                <div className="escola-title-top">
                  <h1 className="escola-name-professional">{school.name}</h1>
                  <span className="school-verified-tag-large">
                    <IconVerified /> Instituição Verificada
                  </span>
                </div>

                {/* Localização — clicável para Google Maps */}
                <div className="escola-meta-professional">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="escola-location-prof es-map-link"
                    title="Abrir localização no Google Maps"
                  >
                    <IconPin size={18} />
                    {school.places}
                    <IconExternal />
                  </a>
                </div>
              </div>
            </div>

            {/* Barra de estatísticas */}
            <div className="escola-stats-bar">
              <div className="escola-stat-item">
                <span className="stat-label">Ranking</span>
                <span className="stat-value badge" style={getRankingStyle(school.rankingPosition)}>
                  {school.rankingPosition}º Lugar
                </span>
              </div>
              <div className="stat-divider"></div>

              <div className="escola-stat-item">
                <span className="stat-label">Avaliação Institucional</span>
                <div className="stat-score-wrapper">
                  <span className="stat-score-number" style={{ color: scoreInfo.color }}>
                    {school.score > 0 ? school.score.toFixed(1) : '—'}
                  </span>
                  <span className="stat-score-max">/10</span>
                  <span className="stat-score-text" style={{ color: scoreInfo.color }}>
                    {scoreInfo.label}
                  </span>
                </div>
              </div>
              <div className="stat-divider"></div>

              <div className="escola-stat-item">
                <span className="stat-label">Cursos Ofertados</span>
                <span className="stat-value">{school.courses?.length || 0}</span>
              </div>
            </div>
          </div>
        </header>

        {/* ══════════════════════════════════════
            ABAS
        ══════════════════════════════════════ */}
        <div className="escola-tabs">
          {[
            { key: 'sobre',  label: 'Sobre a Instituição' },
            { key: 'cursos', label: `Cursos (${school.courses?.length || 0})` },
          ].map(tab => (
            <button
              key={tab.key}
              className={`filter-btn${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════
            CORPO: conteúdo + sidebar
        ══════════════════════════════════════ */}
        <div className="es-body-layout">

          {/* ── Área principal ── */}
          <div className="es-main">

            {/* ─── ABA: SOBRE ─── */}
            {activeTab === 'sobre' && (
              <div className="escola-details-section">

                {/* Missão / Apresentação */}
                <section className="es-section">
                  <h2 className="es-section-title">Sobre a Instituição</h2>
                  <p className="es-body-text">{MOCK_MISSION(school.name)}</p>
                </section>

                {/* Dados Gerais (dados reais) */}
                <section className="es-section">
                  <h2 className="es-section-title">Informações Gerais</h2>
                  <div className="info-group-cards">

                    <div className="info-card">
                      <div className="info-card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                      </div>
                      <div className="info-card-content">
                        <span className="info-label">Fundação</span>
                        <span className="info-value">{formatDate(school.foundedIn)}</span>
                      </div>
                    </div>

                    <div className="info-card">
                      <div className="info-card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                      </div>
                      <div className="info-card-content">
                        <span className="info-label">CNPJ</span>
                        <span className="info-value">{school.cnpj}</span>
                      </div>
                    </div>

                    <div className="info-card">
                      <div className="info-card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      </div>
                      <div className="info-card-content">
                        <span className="info-label">Locais de Atuação</span>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="info-value es-map-link"
                        >
                          {school.places} <IconExternal />
                        </a>
                      </div>
                    </div>

                  </div>
                </section>

                {/* Fundamentos e Métodos (dados reais) */}
                <section className="es-section">
                  <h2 className="es-section-title">Fundamentos e Metodologia</h2>
                  <div className="text-blocks-container">
                    <div className="text-block">
                      <div className="text-block-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                        <h3>Fundamentos</h3>
                      </div>
                      <p>{school.fundamentals}</p>
                    </div>
                    <div className="text-block">
                      <div className="text-block-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
                        <h3>Métodos de Ensino</h3>
                      </div>
                      <p>{school.methods}</p>
                    </div>
                  </div>
                </section>

                {/* Diferenciais / Infraestrutura (mock) */}
                <section className="es-section">
                  <h2 className="es-section-title">Infraestrutura e Diferenciais <span className="es-mock-badge">ilustrativo*</span></h2>
                  <div className="es-differentials-grid">
                    {MOCK_DIFFERENTIALS.map((d, i) => (
                      <div className="es-diff-card" key={i}>
                        <span className="es-diff-icon">{d.icon}</span>
                        <h4>{d.title}</h4>
                        <p>{d.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

              </div>
            )}

            {/* ─── ABA: CURSOS ─── */}
            {activeTab === 'cursos' && (
              <div className="escola-courses-section">
                <h2 className="es-section-title" style={{ marginBottom: '1.5rem' }}>
                  Cursos Disponíveis ({school.courses?.length || 0})
                </h2>

                {school.courses && school.courses.length > 0 ? (
                  <div className="courses-list-grid">
                    {school.courses.map(course => (
                      <div
                        key={course.id}
                        className="course-card-prof"
                        onClick={() => navigate(`/course/${course.id}`)}
                      >
                        <div className="course-card-content">
                          <h4 className="course-card-title">{course.title || course.name}</h4>
                          <div className="course-card-meta">
                            <span className="course-meta-item">
                              <IconClock />
                              {course.duration || (course.workload ? `${course.workload} horas` : 'Carga horária não informada')}
                            </span>
                          </div>
                        </div>
                        <div className="course-card-action">
                          <span className="view-course-text">Ver Curso</span>
                          <span className="arrow-icon"><IconArrow /></span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state-container">
                    <div className="empty-state-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                    </div>
                    <p className="no-courses-msg">Esta instituição ainda não possui cursos cadastrados.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── SIDEBAR ─── */}
          <aside className="es-sidebar">

            {/* Localização / Mapa */}
            <div className="es-sidebar-card">
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="es-sidebar-map-art" title="Abrir localização no Google Maps">
                <span className="es-map-pin-halo"></span>
                <IconPin size={72} />
              </a>
              <div className="es-sidebar-card-body">
                <h4>Localização</h4>
                <p className="es-sidebar-address">{school.places}</p>
                <a href={mapsUrl} target="_blank" rel="noreferrer" className="es-map-btn">
                  <IconPin size={15} /> Abrir no Google Maps
                </a>
              </div>
            </div>

            {/* Contato (mock) */}
            <div className="es-sidebar-card">
              <div className="es-sidebar-card-body">
                <h4>Fale com a Instituição <span className="es-mock-badge">ilustrativo*</span></h4>
                <ul className="es-contact-list">
                  <li><IconPhone /><span>{mockContact.phone}</span></li>
                  <li><IconMail /><span>{mockContact.email}</span></li>
                  <li><IconGlobe /><span>{mockContact.website}</span></li>
                </ul>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}

export default EscolaSelecionada;
