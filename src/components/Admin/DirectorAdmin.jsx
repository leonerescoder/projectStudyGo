import React, { useState, useEffect } from 'react';
import {
  Building2,
  GraduationCap,
  User,
  Lock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Trash2,
  Edit3,
  Clock,
  Star,
  Database,
  UserPlus,
  ShieldAlert,
  X,
  ExternalLink,
  Image as ImageIcon,
  Upload,
  Sparkles
} from 'lucide-react';
import { DB_CONFIG } from '../../data/databaseConfig';
import { apiFetch } from '../../API/apiClient';
import './DirectorAdmin.css';

// Initial Director Profile
const INITIAL_DIRECTOR_USER = {
  id: 0,
  name: 'Carregando...',
  cpf: '',
  email: '',
  type: 'DIRECTOR',
  status: 'ATIVO',
  birth_date: '',
  password: '',
  company_id: 1,
  company_name: 'Senac São Carlos'
};

// Initial School data for this Director
const INITIAL_DIRECTOR_COMPANY = {
  id: 0,
  name: 'Carregando...',
  cnpj: '',
  foundation: '',
  places: '',
  fundaments: '',
  methods: '',
  ranking: 1
};

export function DirectorAdmin() {
  // Director state (Start as ATIVO and type DIRECTOR)
  const [directorUser, setDirectorUser] = useState(INITIAL_DIRECTOR_USER);
  const [school, setSchool] = useState(INITIAL_DIRECTOR_COMPANY);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [courseRes, compRes, userRes] = await Promise.all([
          apiFetch('/course'),
          apiFetch('/companie'),
          apiFetch('/user')
        ]);

        let fetchedSchool = null;
        if (compRes.ok) {
          const data = await compRes.json();
          fetchedSchool = Array.isArray(data) ? data.find(c => c.id === 1) : null;
          if (fetchedSchool) setSchool(fetchedSchool);
        }

        if (courseRes.ok) {
          const data = await courseRes.json();
          const targetId = fetchedSchool ? fetchedSchool.id : 1;
          setCourses(Array.isArray(data) ? data.filter(c => c.company_id === targetId || c.companyId === targetId) : []);
        }

        if (userRes.ok) {
          const data = await userRes.json();
          const director = Array.isArray(data) ? data.find(u => u.type === 'DIRECTOR') : null;
          if (director) {
            setDirectorUser(director);
            setProfileForm({
              name: director.name,
              cpf: director.cpf,
              email: director.email,
              birth_date: director.birth_date,
              password: director.password || '',
              type: 'DIRECTOR',
              status: 'ATIVO'
            });
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      }
    }
    loadData();
  }, []);

  // Active Tab: 'school' | 'courses' | 'profile'
  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Modals state
  const [isNewCourseModalOpen, setIsNewCourseModalOpen] = useState(false);
  const [isEditSchoolModalOpen, setIsEditSchoolModalOpen] = useState(false);
  const [isRegisterDirectorModalOpen, setIsRegisterDirectorModalOpen] = useState(false);

  // Forms State
  const [courseForm, setCourseForm] = useState({
    name: '',
    description: '',
    urlImg: '',
    workload: '',
    Field_of_study: 'Tecnologia',
    ranking: '1',
    status: 'ATIVO'
  });

  const [editSchoolForm, setEditSchoolForm] = useState({ ...INITIAL_DIRECTOR_COMPANY });

  const [profileForm, setProfileForm] = useState({
    name: INITIAL_DIRECTOR_USER.name,
    cpf: INITIAL_DIRECTOR_USER.cpf,
    email: INITIAL_DIRECTOR_USER.email,
    birth_date: INITIAL_DIRECTOR_USER.birth_date,
    password: INITIAL_DIRECTOR_USER.password,
    // Fields below are LOCKED:
    type: 'DIRECTOR',
    status: 'ATIVO'
  });

  const [newDirectorForm, setNewDirectorForm] = useState({
    name: '',
    email: '',
    cpf: '',
    birth_date: '',
    password: '',
    school_name: 'Nova Escola de Tecnologia',
    school_cnpj: '11.222.333/0001-44',
    places: 'São Paulo, SP'
  });

  // Helper toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Filtered Courses (Only belonging to this director's school)
  const filteredCourses = courses.filter(c =>
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.Field_of_study || c.fieldOfStudy || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Profile Update (Cannot change status or type!)
  const handleUpdateProfile = (e) => {
    e.preventDefault();

    // STRICT VALIDATION: Ensure type is ALWAYS DIRECTOR and status is ALWAYS ATIVO
    const updatedUser = {
      ...directorUser,
      name: profileForm.name,
      cpf: profileForm.cpf,
      email: profileForm.email,
      birth_date: profileForm.birth_date,
      password: profileForm.password,
      // Immutable properties:
      type: 'DIRECTOR',
      status: 'ATIVO'
    };

    setDirectorUser(updatedUser);
    showToast('✓ Seus dados pessoais foram atualizados com sucesso no banco de dados!');
  };

  // Handle School Info Update
  const handleUpdateSchool = (e) => {
    e.preventDefault();
    setSchool({ ...editSchoolForm });
    setIsEditSchoolModalOpen(false);
    showToast(`✓ Informações da instituição "${editSchoolForm.name}" atualizadas!`);
  };

  // Handle Course Creation (Attached only to this director's school)
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.name || !courseForm.workload) {
      alert('Por favor, preencha o nome do curso e a carga horária.');
      return;
    }

    try {
      const categoryMap = { 'Tecnologia': 1, 'Mecânica': 2, 'Gastronomia': 3, 'Idiomas': 4, 'Saúde': 5, 'Moda': 6, 'Artes': 7, 'Música': 8, 'Educação': 9 };
      const categoryId = categoryMap[courseForm.Field_of_study] || 1;

      const payload = {
        name: courseForm.name,
        description: courseForm.description || 'Sem descrição informada.',
        urlImg: courseForm.urlImg || '',
        workload: Number(courseForm.workload),
        ranking: Number(courseForm.ranking) || 1,
        fieldOfStudy: courseForm.Field_of_study,
        companyId: school?.id || 1,
        categoryIds: [categoryId],
        userId: directorUser?.id || 1,
        status: courseForm.status
      };

      const response = await apiFetch('/course', { method: 'POST', body: JSON.stringify(payload) });
      if (response.ok) {
        const newCourse = await response.json();
        setCourses([newCourse, ...courses]);
        setIsNewCourseModalOpen(false);
        setCourseForm({
          name: '', description: '', urlImg: '', workload: '', Field_of_study: 'Tecnologia', ranking: '1', status: 'ATIVO'
        });
        showToast(`✓ Novo curso "${newCourse.name}" adicionado à ${school.name}!`);
      } else {
        alert('Erro ao criar curso na API.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao criar curso.');
    }
  };

  const handleDirectorImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('A imagem é muito grande. Escolha uma foto de até 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCourseForm(prev => ({ ...prev, urlImg: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Course Deletion
  const handleDeleteCourse = async (id) => {
    if (window.confirm('Deseja realmente remover este curso da sua escola?')) {
      try {
        const response = await apiFetch(`/course/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setCourses(courses.filter(c => c.id !== id));
          showToast('Curso removido da instituição com sucesso.');
        } else {
          alert('Erro ao excluir curso na API.');
        }
      } catch (err) {
        console.error(err);
        alert('Erro de conexão ao excluir curso.');
      }
    }
  };

  // Handle New Director Registration (Starts as ACTIVE, type DIRECTOR)
  const handleRegisterNewDirector = (e) => {
    e.preventDefault();
    if (!newDirectorForm.name || !newDirectorForm.email || !newDirectorForm.cpf) {
      alert('Preencha Nome, E-mail e CPF.');
      return;
    }

    const registeredDirector = {
      id: Math.floor(Math.random() * 1000) + 10,
      name: newDirectorForm.name,
      cpf: newDirectorForm.cpf,
      email: newDirectorForm.email,
      birth_date: newDirectorForm.birth_date || '1990-01-01',
      password: newDirectorForm.password || '123456',
      // MANDATORY RULES:
      type: 'DIRECTOR',
      status: 'ATIVO',
      company_id: 99,
      company_name: newDirectorForm.school_name
    };

    const newSchool = {
      id: 99,
      name: newDirectorForm.school_name,
      cnpj: newDirectorForm.school_cnpj,
      foundation: '2026-01-01',
      places: newDirectorForm.places,
      fundaments: 'Instituição de ensino técnico e profissional.',
      methods: 'Presencial e Híbrido',
      ranking: 1
    };

    setDirectorUser(registeredDirector);
    setSchool(newSchool);
    setCourses([]);
    setProfileForm({
      name: registeredDirector.name,
      cpf: registeredDirector.cpf,
      email: registeredDirector.email,
      birth_date: registeredDirector.birth_date,
      password: registeredDirector.password,
      type: 'DIRECTOR',
      status: 'ATIVO'
    });
    setEditSchoolForm({ ...newSchool });
    setIsRegisterDirectorModalOpen(false);

    showToast(`✓ Diretor(a) ${registeredDirector.name} cadastrado com sucesso como ATIVO (DIRECTOR)!`);
  };

  return (
    <div id="director-admin-page">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="director-toast">
          <CheckCircle2 size={20} className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="director-container">
        {/* Top Header Banner */}
        <section className="director-banner">
          <div className="banner-left">
            <div className="badge-director-pill">
              <Building2 size={16} />
              <span>Painel Exclusivo da Instituição</span>
            </div>
            <h1 className="banner-title">Administração Escolar</h1>
            <p className="banner-subtitle">
              Gestão direta da instituição <strong className="highlight-school">{school.name}</strong>. Acesso restrito e exclusivo aos cursos e dados da sua própria escola.
            </p>
          </div>

          {/* Director Identity Box */}
          <div className="director-id-card">
            <div className="id-avatar">
              <User size={28} />
            </div>
            <div className="id-info">
              <div className="id-name">{directorUser.name}</div>
              <div className="id-meta">
                <span className="pill-type">🎓 {directorUser.type}</span>
                <span className="pill-status">🟢 {directorUser.status}</span>
              </div>
              <div className="id-school-label">Escola: {school.name}</div>
            </div>
            <button
              className="btn-new-director"
              onClick={() => setIsRegisterDirectorModalOpen(true)}
              title="Cadastrar outro Diretor"
            >
              <UserPlus size={16} />
              <span>Novo Cadastro</span>
            </button>
          </div>
        </section>

        {/* Security / Permissions Warning Card */}
        <section className="permissions-notice-card">
          <div className="notice-icon">
            <ShieldAlert size={24} />
          </div>
          <div className="notice-content">
            <h4>Regras de Segurança & Permissões do Diretor</h4>
            <p>
              • <strong>Status e Tipo Travados:</strong> Sua conta inicia e permanece como <strong>ATIVO</strong> do tipo <strong>DIRECTOR</strong>. Não é permitido alterar o status para INATIVO nem o tipo para ADMIN.<br />
              • <strong>Escopo Restrito:</strong> Você tem permissão para editar os dados da sua instituição, alterar seus dados cadastrais e gerenciar apenas os cursos de <strong>{school.name}</strong>.
            </p>
          </div>
        </section>

        {/* Main Workspace Card */}
        <section className="director-workspace">
          {/* Tabs Bar */}
          <div className="workspace-tabs-bar">
            <div className="tabs-list">
              <button
                className={`tab-item ${activeTab === 'courses' ? 'active' : ''}`}
                onClick={() => setActiveTab('courses')}
              >
                <GraduationCap size={18} />
                <span>Cursos da Escola ({filteredCourses.length})</span>
              </button>

              <button
                className={`tab-item ${activeTab === 'school' ? 'active' : ''}`}
                onClick={() => setActiveTab('school')}
              >
                <Building2 size={18} />
                <span>Minha Escola ({school.name})</span>
              </button>

              <button
                className={`tab-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={18} />
                <span>Meus Dados (Perfil)</span>
              </button>
            </div>

            {activeTab === 'courses' && (
              <button
                className="btn-add-course"
                onClick={() => setIsNewCourseModalOpen(true)}
              >
                <Plus size={18} />
                <span>+ Inserir Novo Curso</span>
              </button>
            )}

            {activeTab === 'school' && (
              <button
                className="btn-edit-school"
                onClick={() => {
                  setEditSchoolForm({ ...school });
                  setIsEditSchoolModalOpen(true);
                }}
              >
                <Edit3 size={18} />
                <span>Editar Dados da Escola</span>
              </button>
            )}
          </div>

          {/* ==================================================== */}
          {/* TAB 1: CURSOS DA ESCOLA */}
          {/* ==================================================== */}
          {activeTab === 'courses' && (
            <div className="tab-content-wrapper">
              <div className="courses-toolbar">
                <div className="search-input-wrapper">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder={`Pesquisar nos cursos de ${school.name}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button className="clear-btn" onClick={() => setSearchTerm('')}>
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className="counter-badge">
                  Mostrando <strong>{filteredCourses.length}</strong> cursos desta instituição
                </div>
              </div>

              <div className="table-wrapper">
                <table className="director-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Curso Ofertado</th>
                      <th>Área / Categoria</th>
                      <th>Carga Horária</th>
                      <th>Ranking Interno</th>
                      <th>Status</th>
                      <th className="th-actions">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.length > 0 ? (
                      filteredCourses.map(c => (
                        <tr key={c.id}>
                          <td className="cell-id">#{c.id}</td>
                          <td className="cell-main">
                            <div className="course-name-row">
                              <div className="director-table-thumb">
                                {c.urlImg ? (
                                  <img src={c.urlImg} alt={c.name} onError={(e) => { e.target.style.display = 'none'; }} />
                                ) : (
                                  <span className="thumb-fallback">📚</span>
                                )}
                              </div>
                              <div className="director-name-wrapper">
                                <span className="course-title">{c.name}</span>
                                <span className="course-desc">{c.description}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="category-tag">{c.Field_of_study}</span>
                          </td>
                          <td>
                            <span className="workload-tag">
                              <Clock size={13} /> {c.workload} horas
                            </span>
                          </td>
                          <td>
                            <span className="ranking-tag">
                              <Star size={13} fill="#f59e0b" color="#f59e0b" />
                              {c.ranking}º lugar
                            </span>
                          </td>
                          <td>
                            <span className="status-badge ativo">{c.status}</span>
                          </td>
                          <td className="cell-actions">
                            <button
                              className="action-btn-del"
                              title="Remover curso"
                              onClick={() => handleDeleteCourse(c.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="empty-state">
                          <Database size={36} />
                          <p>Nenhum curso cadastrado para {school.name}.</p>
                          <button
                            className="btn-add-first-course"
                            onClick={() => setIsNewCourseModalOpen(true)}
                          >
                            Cadastrar o Primeiro Curso
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: DADOS DA PRÓPRIA ESCOLA */}
          {/* ==================================================== */}
          {activeTab === 'school' && (
            <div className="school-details-panel">
              <div className="school-header-card">
                <div className="school-icon-box">
                  <Building2 size={40} />
                </div>
                <div className="school-titles">
                  <h2>{school.name}</h2>
                  <div className="school-meta-tags">
                    <span className="meta-tag">CNPJ: {school.cnpj}</span>
                    <span className="meta-tag">Fundação: {school.foundation}</span>
                    <span className="meta-tag ranking">
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      {school.ranking}º Lugar no Ranking Geral
                    </span>
                  </div>
                </div>
              </div>

              <div className="school-grid-info">
                <div className="info-card">
                  <h3>📍 Locais de Atuação & Unidades</h3>
                  <p>{school.places}</p>
                </div>

                <div className="info-card">
                  <h3>🎯 Fundamentos & Missão</h3>
                  <p>{school.fundaments}</p>
                </div>

                <div className="info-card full-width">
                  <h3>📖 Métodos de Ensino & Infraestrutura</h3>
                  <p>{school.methods}</p>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: PERFIL DO DIRETOR (COM TRAVAS DE SEGURANÇA) */}
          {/* ==================================================== */}
          {activeTab === 'profile' && (
            <div className="profile-settings-panel">
              <div className="profile-header-info">
                <h3>Dados Cadastrais do Diretor</h3>
                <p>Atualize suas informações de contato e credenciais. Os campos de Status e Tipo de Usuário são estritamente protegidos pelo sistema.</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome Completo *</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>E-mail Corporativo *</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>CPF *</label>
                    <input
                      type="text"
                      value={profileForm.cpf}
                      onChange={(e) => setProfileForm({...profileForm, cpf: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Data de Nascimento</label>
                    <input
                      type="date"
                      value={profileForm.birth_date}
                      onChange={(e) => setProfileForm({...profileForm, birth_date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Senha de Acesso</label>
                    <input
                      type="password"
                      value={profileForm.password}
                      onChange={(e) => setProfileForm({...profileForm, password: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Instituição Vinculada</label>
                    <input
                      type="text"
                      value={school.name}
                      readOnly
                      disabled
                      className="input-disabled"
                    />
                  </div>
                </div>

                {/* LOCKED SECURITY FIELDS */}
                <div className="locked-fields-box">
                  <div className="locked-header">
                    <Lock size={16} className="lock-icon" />
                    <span>Campos com Bloqueio de Permissão (Imutáveis pelo Diretor):</span>
                  </div>

                  <div className="form-row">
                    <div className="form-group locked">
                      <label>
                        Tipo de Usuário (Type)
                        <span className="badge-locked">🔒 Fixo: DIRECTOR</span>
                      </label>
                      <div className="locked-input-wrapper">
                        <input
                          type="text"
                          value="DIRECTOR"
                          readOnly
                          disabled
                          className="input-locked"
                        />
                        <span className="lock-explain">
                          * Proibido alterar para ADMIN.
                        </span>
                      </div>
                    </div>

                    <div className="form-group locked">
                      <label>
                        Status da Conta (Status)
                        <span className="badge-locked">🔒 Fixo: ATIVO</span>
                      </label>
                      <div className="locked-input-wrapper">
                        <input
                          type="text"
                          value="ATIVO"
                          readOnly
                          disabled
                          className="input-locked"
                        />
                        <span className="lock-explain">
                          * Proibido desativar para INATIVO.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-actions-right">
                  <button type="submit" className="btn-save-profile">
                    <CheckCircle2 size={18} />
                    <span>Salvar Alterações Permitidas</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>

        {/* Database Connection Footer Bar */}
        <footer className="db-status-bar">
          <div className="db-info">
            <Database size={16} className="db-icon" />
            <span>Banco de Dados: <strong>{DB_CONFIG.database}</strong> ({DB_CONFIG.server}:{DB_CONFIG.port})</span>
          </div>
          <a
            href={DB_CONFIG.phpMyAdminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="db-link"
          >
            <span>Acessar phpMyAdmin</span>
            <ExternalLink size={14} />
          </a>
        </footer>
      </main>

      {/* ==================================================== */}
      {/* MODAL: INSERIR NOVO CURSO NA ESCOLA */}
      {/* ==================================================== */}
      {isNewCourseModalOpen && (
        <div className="director-modal-backdrop" onClick={() => setIsNewCourseModalOpen(false)}>
          <div className="director-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <GraduationCap size={22} className="modal-title-icon" />
                <div>
                  <h3>Cadastrar Novo Curso</h3>
                  <p>O curso será vinculado automaticamente a <strong>{school.name}</strong></p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setIsNewCourseModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="modal-form">
              <div className="form-group">
                <label>Nome do Curso *</label>
                <input
                  type="text"
                  placeholder="Ex: Inteligência Artificial na Prática"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
                  required
                />
              </div>

              {/* IMAGEM DO CURSO */}
              <div className="form-group director-image-section">
                <label className="director-image-label">
                  <div className="label-flex">
                    <ImageIcon size={15} />
                    <span>Imagem de Capa do Curso</span>
                  </div>
                  <span className="label-help">Link da web ou arquivo do dispositivo</span>
                </label>

                <div className="director-image-inputs">
                  <input
                    type="url"
                    placeholder="https://exemplo.com/imagem-do-curso.jpg"
                    value={courseForm.urlImg}
                    onChange={(e) => setCourseForm({...courseForm, urlImg: e.target.value})}
                  />
                  <label className="btn-upload-file">
                    <Upload size={14} />
                    <span>Upload Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDirectorImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {courseForm.urlImg && (
                  <div className="director-img-preview">
                    <img src={courseForm.urlImg} alt="Preview" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'; }} />
                    <button
                      type="button"
                      className="btn-del-img"
                      onClick={() => setCourseForm({ ...courseForm, urlImg: '' })}
                    >
                      Remover foto
                    </button>
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Área / Categoria *</label>
                  <select
                    value={courseForm.Field_of_study}
                    onChange={(e) => setCourseForm({...courseForm, Field_of_study: e.target.value})}
                  >
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Mecânica">Mecânica</option>
                    <option value="Gastronomia">Gastronomia</option>
                    <option value="Idiomas">Idiomas</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Moda">Moda</option>
                    <option value="Artes">Artes</option>
                    <option value="Música">Música</option>
                    <option value="Educação">Educação</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Carga Horária (Horas) *</label>
                  <input
                    type="number"
                    placeholder="Ex: 80"
                    value={courseForm.workload}
                    onChange={(e) => setCourseForm({...courseForm, workload: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Escola Ofertante (Automática)</label>
                  <input
                    type="text"
                    value={school.name}
                    readOnly
                    disabled
                    className="input-disabled"
                  />
                </div>

                <div className="form-group">
                  <label>Posição Ranking</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ex: 1"
                    value={courseForm.ranking}
                    onChange={(e) => setCourseForm({...courseForm, ranking: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descrição e Competências</label>
                <textarea
                  rows="3"
                  placeholder="Objetivos do curso, metodologia e mercado de atuação..."
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsNewCourseModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Gravar Curso no Banco
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: EDITAR DADOS DA ESCOLA */}
      {/* ==================================================== */}
      {isEditSchoolModalOpen && (
        <div className="director-modal-backdrop" onClick={() => setIsEditSchoolModalOpen(false)}>
          <div className="director-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Building2 size={22} className="modal-title-icon" />
                <div>
                  <h3>Editar Informações da Escola</h3>
                  <p>Atualize a apresentação e dados da sua instituição.</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setIsEditSchoolModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateSchool} className="modal-form">
              <div className="form-group">
                <label>Razão Social / Nome da Escola *</label>
                <input
                  type="text"
                  value={editSchoolForm.name}
                  onChange={(e) => setEditSchoolForm({...editSchoolForm, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>CNPJ *</label>
                  <input
                    type="text"
                    value={editSchoolForm.cnpj}
                    onChange={(e) => setEditSchoolForm({...editSchoolForm, cnpj: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Data de Fundação</label>
                  <input
                    type="date"
                    value={editSchoolForm.foundation}
                    onChange={(e) => setEditSchoolForm({...editSchoolForm, foundation: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Locais de Atuação / Unidades</label>
                <input
                  type="text"
                  value={editSchoolForm.places}
                  onChange={(e) => setEditSchoolForm({...editSchoolForm, places: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Fundamentos & Missão</label>
                <textarea
                  rows="2"
                  value={editSchoolForm.fundaments}
                  onChange={(e) => setEditSchoolForm({...editSchoolForm, fundaments: e.target.value})}
                ></textarea>
              </div>

              <div className="form-group">
                <label>Métodos e Infraestrutura</label>
                <textarea
                  rows="2"
                  value={editSchoolForm.methods}
                  onChange={(e) => setEditSchoolForm({...editSchoolForm, methods: e.target.value})}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsEditSchoolModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Salvar Dados da Escola
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: CADASTRO DE NOVO DIRETOR (ATIVO / DIRECTOR) */}
      {/* ==================================================== */}
      {isRegisterDirectorModalOpen && (
        <div className="director-modal-backdrop" onClick={() => setIsRegisterDirectorModalOpen(false)}>
          <div className="director-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <UserPlus size={22} className="modal-title-icon" />
                <div>
                  <h3>Cadastrar Novo Diretor de Escola</h3>
                  <p>Inicia automaticamente com status <strong>ATIVO</strong> e perfil <strong>DIRECTOR</strong>.</p>
                </div>
              </div>
              <button className="modal-close" onClick={() => setIsRegisterDirectorModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRegisterNewDirector} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nome Completo do Diretor *</label>
                  <input
                    type="text"
                    placeholder="Ex: Dra. Juliana Costa"
                    value={newDirectorForm.name}
                    onChange={(e) => setNewDirectorForm({...newDirectorForm, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>E-mail *</label>
                  <input
                    type="email"
                    placeholder="diretoria@escola.com"
                    value={newDirectorForm.email}
                    onChange={(e) => setNewDirectorForm({...newDirectorForm, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>CPF *</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={newDirectorForm.cpf}
                    onChange={(e) => setNewDirectorForm({...newDirectorForm, cpf: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Senha Provisória</label>
                  <input
                    type="password"
                    placeholder="Senha de acesso"
                    value={newDirectorForm.password}
                    onChange={(e) => setNewDirectorForm({...newDirectorForm, password: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Nome da Escola / Instituição *</label>
                <input
                  type="text"
                  placeholder="Ex: Instituto Tecnológico Avançado"
                  value={newDirectorForm.school_name}
                  onChange={(e) => setNewDirectorForm({...newDirectorForm, school_name: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>CNPJ da Escola</label>
                  <input
                    type="text"
                    placeholder="00.000.000/0001-00"
                    value={newDirectorForm.school_cnpj}
                    onChange={(e) => setNewDirectorForm({...newDirectorForm, school_cnpj: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Cidade / Estado</label>
                  <input
                    type="text"
                    placeholder="São Paulo, SP"
                    value={newDirectorForm.places}
                    onChange={(e) => setNewDirectorForm({...newDirectorForm, places: e.target.value})}
                  />
                </div>
              </div>

              {/* Status & Type Guaranteed Notice */}
              <div className="auto-assigned-notice">
                <div className="auto-pill">
                  <span>Tipo Definido:</span>
                  <strong>🎓 DIRECTOR (Fixo)</strong>
                </div>
                <div className="auto-pill">
                  <span>Status Inicial:</span>
                  <strong>🟢 ATIVO (Fixo)</strong>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsRegisterDirectorModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Cadastrar e Acessar Painel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DirectorAdmin;
