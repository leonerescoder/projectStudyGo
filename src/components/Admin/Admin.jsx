import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  Layers, 
  Users, 
  Plus, 
  Search, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Star, 
  Database, 
  SlidersHorizontal, 
  X,
  ExternalLink 
} from 'lucide-react';
import { 
  INITIAL_COURSES, 
  INITIAL_COMPANIES, 
  INITIAL_CATEGORIES, 
  INITIAL_USERS 
} from './adminData';
import './Admin.css';

export function Admin() {
  // Role Simulation State: 'ADMIN' or 'DIRECTOR'
  const [userRole, setUserRole] = useState('ADMIN'); // 'ADMIN' | 'DIRECTOR'
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'companies' | 'categories' | 'users'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data State (Buscar Dados)
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [users, setUsers] = useState(INITIAL_USERS);

  // Modal State (Inserir Dados)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEntityType, setModalEntityType] = useState('course'); // 'course' | 'company' | 'category' | 'user'
  const [toastMessage, setToastMessage] = useState(null);

  // Form Fields State for Course
  const [courseForm, setCourseForm] = useState({
    name: '',
    description: '',
    workload: '',
    Field_of_study: 'Tecnologia',
    company_name: 'Senac São Carlos',
    ranking: '1',
    status: 'ATIVO'
  });

  // Form Fields State for Company
  const [companyForm, setCompanyForm] = useState({
    name: '',
    cnpj: '',
    foundation: '',
    places: '',
    fundaments: '',
    methods: '',
    ranking: '1',
    owner_name: ''
  });

  // Form Fields State for Category
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

  // Form Fields State for User
  const [userForm, setUserForm] = useState({
    name: '',
    cpf: '',
    email: '',
    type: 'DIRECTOR',
    status: 'ATIVO',
    birth_date: '',
    password: '123',
    company_name: 'Senac São Carlos'
  });

  // Helper toast trigger
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Filtered Lists based on Role & Search
  const filteredCourses = courses.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.Field_of_study.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    if (userRole === 'DIRECTOR') {
      return matchesSearch && item.company_name.includes('Senac');
    }
    return matchesSearch;
  });

  const filteredCompanies = companies.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.places.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.cnpj.includes(searchTerm);
    if (userRole === 'DIRECTOR') {
      return matchesSearch && item.name.includes('Senac');
    }
    return matchesSearch;
  });

  const filteredCategories = categories.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.type.toLowerCase().includes(searchTerm.toLowerCase());
    if (userRole === 'DIRECTOR') {
      return matchesSearch && item.company_name.includes('Senac');
    }
    return matchesSearch;
  });

  // Handle deletion
  const handleDeleteCourse = (id) => {
    if (window.confirm('Deseja realmente excluir este curso do banco de dados?')) {
      setCourses(courses.filter(c => c.id !== id));
      showToast('Registro de Curso excluído do banco com sucesso!');
    }
  };

  const handleDeleteCompany = (id) => {
    if (window.confirm('Deseja realmente excluir esta instituição do banco de dados?')) {
      setCompanies(companies.filter(c => c.id !== id));
      showToast('Registro de Empresa/Escola excluído do banco!');
    }
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Deseja excluir esta categoria do banco de dados?')) {
      setCategories(categories.filter(c => c.id !== id));
      showToast('Categoria removida com sucesso!');
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Deseja excluir este usuário do banco de dados?')) {
      setUsers(users.filter(u => u.id !== id));
      showToast('Usuário removido do sistema!');
    }
  };

  // Handle Form Submit (Inserir dados no banco)
  const handleCreateSubmit = (e) => {
    e.preventDefault();

    if (modalEntityType === 'course') {
      if (!courseForm.name || !courseForm.workload) {
        alert('Por favor, preencha o nome e a carga horária do curso.');
        return;
      }
      const newCourse = {
        id: courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1,
        name: courseForm.name,
        description: courseForm.description || 'Sem descrição informada.',
        workload: Number(courseForm.workload),
        ranking: Number(courseForm.ranking) || 1,
        Field_of_study: courseForm.Field_of_study,
        company_name: userRole === 'DIRECTOR' ? 'Senac São Carlos' : courseForm.company_name,
        company_id: 1,
        status: courseForm.status,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCourses([newCourse, ...courses]);
      showToast(`✓ Curso "${newCourse.name}" inserido no banco com sucesso!`);
      setCourseForm({
        name: '',
        description: '',
        workload: '',
        Field_of_study: 'Tecnologia',
        company_name: 'Senac São Carlos',
        ranking: '1',
        status: 'ATIVO'
      });
    } 
    else if (modalEntityType === 'company') {
      if (!companyForm.name || !companyForm.cnpj) {
        alert('Por favor, informe ao menos a Razão Social e o CNPJ.');
        return;
      }
      const newCompany = {
        id: companies.length > 0 ? Math.max(...companies.map(c => c.id)) + 1 : 1,
        name: companyForm.name,
        cnpj: companyForm.cnpj,
        foundation: companyForm.foundation || '2026-01-01',
        places: companyForm.places || 'Não informado',
        fundaments: companyForm.fundaments || 'Formação e qualificação educacional.',
        methods: companyForm.methods || 'Presencial e EAD',
        ranking: Number(companyForm.ranking) || 1,
        owner_name: companyForm.owner_name || 'Diretoria'
      };
      setCompanies([newCompany, ...companies]);
      showToast(`✓ Instituição "${newCompany.name}" cadastrada no banco!`);
      setCompanyForm({
        name: '',
        cnpj: '',
        foundation: '',
        places: '',
        fundaments: '',
        methods: '',
        ranking: '1',
        owner_name: ''
      });
    }
    else if (modalEntityType === 'category') {
      if (!categoryForm.name) {
        alert('Por favor, informe o nome da categoria.');
        return;
      }
      const newCat = {
        id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
        name: categoryForm.name,
        description: categoryForm.description || 'Categoria de estudos'
      };
      setCategories([...categories, newCat]);
      showToast(`✓ Categoria "${newCat.name}" cadastrada no banco!`);
      setCategoryForm({ name: '', description: '' });
    }
    else if (modalEntityType === 'user') {
      if (!userForm.name || !userForm.email || !userForm.cpf) {
        alert('Por favor, preencha Nome, CPF e E-mail.');
        return;
      }
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name: userForm.name,
        cpf: userForm.cpf,
        email: userForm.email,
        type: userForm.type,
        status: userForm.status,
        birth_date: userForm.birth_date || '2000-01-01',
        company_name: userForm.company_name
      };
      setUsers([newUser, ...users]);
      showToast(`✓ Usuário "${newUser.name}" registrado no banco!`);
      setUserForm({
        name: '',
        cpf: '',
        email: '',
        type: 'DIRECTOR',
        status: 'ATIVO',
        birth_date: '',
        password: '123',
        company_name: 'Senac São Carlos'
      });
    }

    setIsModalOpen(false);
  };

  const openModal = (type) => {
    setModalEntityType(type);
    setIsModalOpen(true);
  };

  return (
    <div id="admin-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle2 size={20} className="toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="admin-container">
        {/* Top Activity & Integration Banner */}
        <section className="activity-banner">
          <div className="banner-left">
            <div className="date-badge">
              <Clock size={15} />
              <span>Painel de Integração</span>
            </div>
            <h1 className="banner-title">Painel de Administração</h1>
            <p className="banner-subtitle">
              Gestão integrada com a base de dados (MySQL/API): Consulta e Inserção de Cursos, Instituições, Categorias e Perfis de Acesso.
            </p>
          </div>

          {/* Role Switcher */}
          <div className="role-switcher-card">
            <div className="role-header">
              <ShieldCheck size={18} className="role-icon" />
              <span className="role-label">Simulador de Perfil de Acesso:</span>
            </div>
            <div className="role-buttons">
              <button 
                type="button"
                className={`role-btn ${userRole === 'ADMIN' ? 'active admin' : ''}`}
                onClick={() => setUserRole('ADMIN')}
              >
                👑 Administrador (ADMIN)
              </button>
              <button 
                type="button"
                className={`role-btn ${userRole === 'DIRECTOR' ? 'active director' : ''}`}
                onClick={() => setUserRole('DIRECTOR')}
              >
                🎓 Diretor (DIRECTOR)
              </button>
            </div>
            <span className="role-desc">
              {userRole === 'ADMIN' 
                ? 'Visualizando todos os registros e permissão de gestão global da plataforma.' 
                : 'Modo Diretor: visualizando e gerindo apenas os cursos e dados da sua instituição.'}
            </span>
            {userRole === 'DIRECTOR' && (
              <Link 
                to="/diretor" 
                className="btn-open-director-portal"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 0.85rem',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  marginTop: '0.35rem',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)'
                }}
              >
                <span>Acessar Painel Dedicado do Diretor</span>
                <ExternalLink size={14} />
              </Link>
            )}
          </div>
        </section>

        {/* Integration Pillars Notice (Atividade Individual) */}
        <section className="integration-cards-grid">
          <div className="integration-card primary-blue">
            <div className="card-number-badge">1</div>
            <div className="card-info">
              <h3>Buscar dados do banco</h3>
              <p>Integração de leitura para exibição em tempo real com filtros e busca rápida.</p>
            </div>
            <Database className="card-bg-icon" size={48} />
          </div>

          <div className="integration-card secondary-cyan">
            <div className="card-number-badge">2</div>
            <div className="card-info">
              <h3>Inserir dados no banco</h3>
              <p>Cadastre novos registros na base MySQL com validações e feedback instantâneo.</p>
            </div>
            <Plus className="card-bg-icon" size={48} />
          </div>
        </section>

        {/* Metrics Overview Cards */}
        <section className="stats-row">
          <div className="stat-card" onClick={() => setActiveTab('courses')}>
            <div className="stat-icon icon-courses">
              <GraduationCap size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Cursos Cadastrados</span>
              <strong className="stat-number">{filteredCourses.length}</strong>
            </div>
          </div>

          <div className="stat-card" onClick={() => setActiveTab('companies')}>
            <div className="stat-icon icon-companies">
              <Building2 size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Escolas & Parceiros</span>
              <strong className="stat-number">{filteredCompanies.length}</strong>
            </div>
          </div>

          <div className="stat-card" onClick={() => setActiveTab('categories')}>
            <div className="stat-icon icon-categories">
              <Layers size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Categorias Ativas</span>
              <strong className="stat-number">{categories.length}</strong>
            </div>
          </div>

          <div className="stat-card" onClick={() => setActiveTab('users')}>
            <div className="stat-icon icon-users">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Usuários no Sistema</span>
              <strong className="stat-number">{filteredUsers.length}</strong>
            </div>
          </div>
        </section>

        {/* Main Content Area: Tabs + Action Bar + Tables */}
        <section className="admin-content-card">
          {/* Top Bar: Tabs & Inserir Button */}
          <div className="tabs-header-bar">
            <div className="nav-tabs">
              <button 
                className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
                onClick={() => setActiveTab('courses')}
              >
                <GraduationCap size={18} />
                <span>Cursos ({filteredCourses.length})</span>
              </button>

              <button 
                className={`tab-btn ${activeTab === 'companies' ? 'active' : ''}`}
                onClick={() => setActiveTab('companies')}
              >
                <Building2 size={18} />
                <span>Escolas ({filteredCompanies.length})</span>
              </button>

              {userRole === 'ADMIN' && (
                <>
                  <button 
                    className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
                    onClick={() => setActiveTab('categories')}
                  >
                    <Layers size={18} />
                    <span>Categorias ({filteredCategories.length})</span>
                  </button>

                  <button 
                    className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                  >
                    <Users size={18} />
                    <span>Usuários ({filteredUsers.length})</span>
                  </button>
                </>
              )}
            </div>

            <div className="actions-cluster">
              <button 
                className="btn-insert-database"
                onClick={() => {
                  if (activeTab === 'courses') openModal('course');
                  else if (activeTab === 'companies') openModal('company');
                  else if (activeTab === 'categories') openModal('category');
                  else openModal('user');
                }}
              >
                <Plus size={18} />
                <span>+ Inserir no Banco</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="table-toolbar">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input 
                type="text"
                placeholder={`Pesquisar em ${
                  activeTab === 'courses' ? 'Cursos' :
                  activeTab === 'companies' ? 'Escolas' :
                  activeTab === 'categories' ? 'Categorias' : 'Usuários'
                }...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="filter-badge-summary">
              <SlidersHorizontal size={16} />
              <span>
                Visualizando <strong>{
                  activeTab === 'courses' ? filteredCourses.length :
                  activeTab === 'companies' ? filteredCompanies.length :
                  activeTab === 'categories' ? filteredCategories.length : filteredUsers.length
                }</strong> registros
              </span>
            </div>
          </div>

          {/* ==================================================== */}
          {/* TAB 1: CURSOS (courses) */}
          {/* ==================================================== */}
          {activeTab === 'courses' && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Curso</th>
                    <th>Categoria / Área</th>
                    <th>Escola Parceira</th>
                    <th>Carga Horária</th>
                    <th>Ranking</th>
                    <th>Status</th>
                    <th className="th-actions">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((c) => (
                      <tr key={c.id}>
                        <td className="cell-id">#{c.id}</td>
                        <td className="cell-main">
                          <div className="name-wrapper">
                            <span className="item-title">{c.name}</span>
                            <span className="item-subtitle">{c.description}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge-tag category-badge">{c.Field_of_study}</span>
                        </td>
                        <td className="cell-company">{c.company_name}</td>
                        <td>
                          <div className="workload-badge">
                            <Clock size={14} />
                            <span>{c.workload}h</span>
                          </div>
                        </td>
                        <td>
                          <div className="ranking-badge-sm">
                            <Star size={14} fill="#f59e0b" color="#f59e0b" />
                            <span>{c.ranking}º lugar</span>
                          </div>
                        </td>
                        <td>
                          <span className={`status-pill ${c.status.toLowerCase()}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="cell-actions">
                          <button 
                            className="action-btn delete-btn" 
                            title="Remover do banco"
                            onClick={() => handleDeleteCourse(c.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="empty-table">
                        <Database size={32} />
                        <p>Nenhum curso encontrado no banco para os filtros informados.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: ESCOLAS (companies) */}
          {/* ==================================================== */}
          {activeTab === 'companies' && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Instituição / Razão Social</th>
                    <th>CNPJ</th>
                    <th>Locais de Atuação</th>
                    <th>Fundação</th>
                    <th>Ranking</th>
                    <th className="th-actions">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((comp) => (
                      <tr key={comp.id}>
                        <td className="cell-id">#{comp.id}</td>
                        <td className="cell-main">
                          <div className="name-wrapper">
                            <span className="item-title">{comp.name}</span>
                            <span className="item-subtitle">{comp.fundaments}</span>
                          </div>
                        </td>
                        <td className="cell-code">{comp.cnpj}</td>
                        <td>{comp.places}</td>
                        <td>{comp.foundation}</td>
                        <td>
                          <div className="ranking-badge-sm">
                            <Star size={14} fill="#f59e0b" color="#f59e0b" />
                            <span>{comp.ranking}º lugar</span>
                          </div>
                        </td>
                        <td className="cell-actions">
                          {userRole === 'ADMIN' && (
                            <button 
                              className="action-btn delete-btn" 
                              title="Remover do banco"
                              onClick={() => handleDeleteCompany(comp.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="empty-table">
                        <Database size={32} />
                        <p>Nenhuma instituição encontrada no banco de dados.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: CATEGORIAS (categories) */}
          {/* ==================================================== */}
          {activeTab === 'categories' && userRole === 'ADMIN' && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome da Categoria</th>
                    <th>Descrição dos Cursos Vinculados</th>
                    <th className="th-actions">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                      <tr key={cat.id}>
                        <td className="cell-id">#{cat.id}</td>
                        <td className="cell-main">
                          <span className="item-title">{cat.name}</span>
                        </td>
                        <td>{cat.description}</td>
                        <td className="cell-actions">
                          <button 
                            className="action-btn delete-btn" 
                            title="Remover categoria"
                            onClick={() => handleDeleteCategory(cat.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="empty-table">
                        <Database size={32} />
                        <p>Nenhuma categoria encontrada.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 4: USUÁRIOS (users) */}
          {/* ==================================================== */}
          {activeTab === 'users' && userRole === 'ADMIN' && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome do Usuário</th>
                    <th>E-mail</th>
                    <th>CPF</th>
                    <th>Tipo de Perfil</th>
                    <th>Instituição Vinculada</th>
                    <th>Status</th>
                    <th className="th-actions">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td className="cell-id">#{u.id}</td>
                        <td className="cell-main">
                          <div className="name-wrapper">
                            <span className="item-title">{u.name}</span>
                          </div>
                        </td>
                        <td className="cell-code">{u.email}</td>
                        <td className="cell-code">{u.cpf}</td>
                        <td>
                          <span className={`badge-tag ${u.type === 'ADMIN' ? 'admin-badge' : 'director-badge'}`}>
                            {u.type === 'ADMIN' ? '👑 ADMIN' : '🎓 DIRECTOR'}
                          </span>
                        </td>
                        <td>{u.company_name}</td>
                        <td>
                          <span className={`status-pill ${u.status.toLowerCase()}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="cell-actions">
                          <button 
                            className="action-btn delete-btn" 
                            title="Excluir usuário"
                            onClick={() => handleDeleteUser(u.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="empty-table">
                        <Database size={32} />
                        <p>Nenhum usuário localizado.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* ==================================================== */}
      {/* MODAL: INSERIR DADOS NO BANCO */}
      {/* ==================================================== */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Database className="modal-icon" size={22} />
                <div>
                  <h2>Inserir Dados no Banco</h2>
                  <p>Preencha os campos para salvar o novo registro na base de dados.</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Entity Selector inside Modal */}
            <div className="modal-entity-selector">
              <button 
                type="button"
                className={`entity-tab ${modalEntityType === 'course' ? 'active' : ''}`}
                onClick={() => setModalEntityType('course')}
              >
                <GraduationCap size={16} />
                <span>Curso</span>
              </button>

              <button 
                type="button"
                className={`entity-tab ${modalEntityType === 'company' ? 'active' : ''}`}
                onClick={() => setModalEntityType('company')}
              >
                <Building2 size={16} />
                <span>Escola/Empresa</span>
              </button>

              {userRole === 'ADMIN' && (
                <>
                  <button 
                    type="button"
                    className={`entity-tab ${modalEntityType === 'category' ? 'active' : ''}`}
                    onClick={() => setModalEntityType('category')}
                  >
                    <Layers size={16} />
                    <span>Categoria</span>
                  </button>

                  <button 
                    type="button"
                    className={`entity-tab ${modalEntityType === 'user' ? 'active' : ''}`}
                    onClick={() => setModalEntityType('user')}
                  >
                    <Users size={16} />
                    <span>Usuário</span>
                  </button>
                </>
              )}
            </div>

            {/* FORM: CURSO */}
            {modalEntityType === 'course' && (
              <form onSubmit={handleCreateSubmit} className="admin-form">
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

                <div className="form-row">
                  <div className="form-group">
                    <label>Área de Estudo / Categoria *</label>
                    <select 
                      value={courseForm.Field_of_study}
                      onChange={(e) => setCourseForm({...courseForm, Field_of_study: e.target.value})}
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
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
                    <label>Instituição Ofertante</label>
                    <select 
                      value={courseForm.company_name}
                      onChange={(e) => setCourseForm({...courseForm, company_name: e.target.value})}
                      disabled={userRole === 'DIRECTOR'}
                    >
                      {companies.map(comp => (
                        <option key={comp.id} value={comp.name}>{comp.name}</option>
                      ))}
                    </select>
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
                  <label>Descrição do Curso</label>
                  <textarea 
                    rows="3"
                    placeholder="Conteúdo programático, objetivos e competências desenvolvidas..."
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                  ></textarea>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-submit">
                    <Database size={16} />
                    <span>Gravar Curso no Banco</span>
                  </button>
                </div>
              </form>
            )}

            {/* FORM: EMPRESA/ESCOLA */}
            {modalEntityType === 'company' && (
              <form onSubmit={handleCreateSubmit} className="admin-form">
                <div className="form-group">
                  <label>Razão Social / Nome da Escola *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Centro Universitário Tech" 
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>CNPJ *</label>
                    <input 
                      type="text" 
                      placeholder="Ex: 12.345.678/0001-90" 
                      value={companyForm.cnpj}
                      onChange={(e) => setCompanyForm({...companyForm, cnpj: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Data de Fundação</label>
                    <input 
                      type="date" 
                      value={companyForm.foundation}
                      onChange={(e) => setCompanyForm({...companyForm, foundation: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Locais de Atuação / Cidades</label>
                  <input 
                    type="text" 
                    placeholder="Ex: São Paulo, SP - Campinas e EAD" 
                    value={companyForm.places}
                    onChange={(e) => setCompanyForm({...companyForm, places: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Fundamentos da Instituição</label>
                  <textarea 
                    rows="2"
                    placeholder="Valores, missão institucional e diferenciais..."
                    value={companyForm.fundaments}
                    onChange={(e) => setCompanyForm({...companyForm, fundaments: e.target.value})}
                  ></textarea>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-submit">
                    <Database size={16} />
                    <span>Gravar Escola no Banco</span>
                  </button>
                </div>
              </form>
            )}

            {/* FORM: CATEGORIA */}
            {modalEntityType === 'category' && (
              <form onSubmit={handleCreateSubmit} className="admin-form">
                <div className="form-group">
                  <label>Nome da Categoria *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Inteligência Artificial" 
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Descrição da Categoria</label>
                  <textarea 
                    rows="3"
                    placeholder="Descrição das áreas e tipos de cursos que engloba..."
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  ></textarea>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-submit">
                    <Database size={16} />
                    <span>Gravar Categoria no Banco</span>
                  </button>
                </div>
              </form>
            )}

            {/* FORM: USUÁRIO */}
            {modalEntityType === 'user' && (
              <form onSubmit={handleCreateSubmit} className="admin-form">
                <div className="form-group">
                  <label>Nome Completo *</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Lucas Ferreira" 
                    value={userForm.name}
                    onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>E-mail *</label>
                    <input 
                      type="email" 
                      placeholder="lucas@escola.com" 
                      value={userForm.email}
                      onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>CPF *</label>
                    <input 
                      type="text" 
                      placeholder="123.456.789-00" 
                      value={userForm.cpf}
                      onChange={(e) => setUserForm({...userForm, cpf: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo de Acesso</label>
                    <select 
                      value={userForm.type}
                      onChange={(e) => setUserForm({...userForm, type: e.target.value})}
                    >
                      <option value="DIRECTOR">🎓 DIRECTOR (Diretor de Escola)</option>
                      <option value="ADMIN">👑 ADMIN (Administrador Global)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Instituição Vinculada</label>
                    <select 
                      value={userForm.company_name}
                      onChange={(e) => setUserForm({...userForm, company_name: e.target.value})}
                    >
                      {companies.map(comp => (
                        <option key={comp.id} value={comp.name}>{comp.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-submit">
                    <Database size={16} />
                    <span>Gravar Usuário no Banco</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
