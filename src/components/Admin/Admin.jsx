import React, { useState, useEffect } from 'react';
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
  LogOut,
  LogIn,
  Lock,
  Crown,
  ExternalLink,
  Server,
  Image as ImageIcon,
  Upload,
  Sparkles
} from 'lucide-react';
import { apiFetch } from '../../API/apiClient';
import { DB_CONFIG } from '../../data/databaseConfig';
import { useAuth } from '../../context/AuthContext';
import { getFallbackImageUrl, saveLocalCourseImage, getCourseImageUrl } from '../../utils/courseImage';
import './Admin.css';

const QUICK_IMAGE_PRESETS = [
  { label: '💻 Tecnologia', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80' },
  { label: '🤖 Inteligência Artificial', url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80' },
  { label: '🍳 Gastronomia', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80' },
  { label: '⚙️ Mecânica', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80' },
  { label: '🌍 Idiomas', url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80' },
  { label: '🎨 Design & Artes', url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80' }
];

export function Admin() {
  const { user, logout, openAuthModal, availableUsers, login } = useAuth();

  // Role Simulation State: 'ADMIN' or 'DIRECTOR'
  const [userRole, setUserRole] = useState(user?.type || 'ADMIN');
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'companies' | 'categories' | 'users'
  const [searchTerm, setSearchTerm] = useState('');

  // Sync role if authenticated user changes
  useEffect(() => {
    if (user?.type) {
      setUserRole(user.type);
    }
  }, [user]);

  // Guard: If Director, only users tab is restricted (categories and courses are accessible)
  useEffect(() => {
    if (userRole !== 'ADMIN' && activeTab === 'users') {
      setActiveTab('courses');
    }
  }, [userRole, activeTab]);

  // Data State (Buscar Dados)
  const [courses, setCourses] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [courseRes, compRes, catRes, userRes] = await Promise.all([
          apiFetch('/course'),
          apiFetch('/companie'),
          apiFetch('/categorie'),
          apiFetch('/user')
        ]);

        if (courseRes.ok) {
          const courseData = await courseRes.json();
          setCourses(Array.isArray(courseData) ? courseData : []);
        }
        if (compRes.ok) {
          const compData = await compRes.json();
          setCompanies(Array.isArray(compData) ? compData : []);
        }
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(Array.isArray(catData) ? catData : []);
        }
        if (userRes.ok) {
          const userData = await userRes.json();
          setUsers(Array.isArray(userData) ? userData : []);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do banco", error);
      }
    }
    loadData();
  }, []);

  // Modal State (Inserir Dados)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEntityType, setModalEntityType] = useState('course'); // 'course' | 'company' | 'category' | 'user'
  const [toastMessage, setToastMessage] = useState(null);

  // Derive the director's own company from the loaded companies list
  const directorCompany = userRole === 'DIRECTOR'
    ? companies.find(c => c.ownerId === user?.id) || null
    : null;

  // Form Fields State for Course
  const [courseForm, setCourseForm] = useState({
    name: '',
    description: '',
    urlImg: '',
    workload: '',
    Field_of_study: 'Tecnologia',
    company_name: '',
    ranking: '1',
    status: 'ATIVO'
  });

  // Pre-fill company_name for director when companies load
  useEffect(() => {
    if (userRole === 'DIRECTOR' && companies.length > 0) {
      const myComp = companies.find(c => c.ownerId === user?.id);
      if (myComp) {
        setCourseForm(prev => ({ ...prev, company_name: myComp.name }));
      }
    }
  }, [companies, userRole, user?.id]);

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

  // Handle local file upload for course image
  const handleCourseImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WEBP, etc.).');
        e.target.value = '';
        return;
      }
      
      const MAX_SIZE_MB = 2;
      const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
      if (file.size > MAX_SIZE_BYTES) {
        const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2);
        alert(`Atenção: A imagem selecionada (${sizeFormatted} MB) ultrapassa o tamanho padrão permitido de ${MAX_SIZE_MB}MB. Por favor, escolha uma imagem menor.`);
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Resize and compress image using Canvas to ensure it safely fits database columns and payload limits
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Get optimized base64
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setCourseForm(prev => ({ ...prev, urlImg: compressedDataUrl }));
        };
        img.onerror = () => {
          alert('Erro ao carregar o arquivo de imagem.');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const getCompanyName = (item) => {
    if (item.company_name) return item.company_name;
    if (item.companyName) return item.companyName;
    const comp = companies.find(c => c.id === item.companyId);
    return comp ? comp.name : 'Indefinida';
  };

  const filteredCourses = courses.filter(item => {
    const compName = getCompanyName(item);
    const matchesSearch = (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.Field_of_study || item.fieldOfStudy || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (compName).toLowerCase().includes(searchTerm.toLowerCase());
    if (userRole === 'DIRECTOR') {
      const isOwner = item.ownerId === user.id;
      const belongsToMyCompany = companies.some(c => c.id === item.companyId && c.ownerId === user.id);
      const userComp = user?.company_name || user?.companyName || '';
      const isLinkedByName = userComp && userComp !== 'StudyGo Central' && compName.toLowerCase().includes(userComp.toLowerCase());
      
      if (isOwner || belongsToMyCompany || isLinkedByName) return matchesSearch;
      return false;
    }
    return matchesSearch;
  });

  const filteredCompanies = companies.filter(item => {
    const matchesSearch = (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.places || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.cnpj || '').includes(searchTerm);
    if (userRole === 'DIRECTOR') {
      const isOwner = item.ownerId === user.id;
      const userComp = user?.company_name || user?.companyName || '';
      const isLinkedByName = userComp && userComp !== 'StudyGo Central' && (item.name || '').toLowerCase().includes(userComp.toLowerCase());
      
      if (isOwner || isLinkedByName) return matchesSearch;
      return false;
    }
    return matchesSearch;
  });

  const filteredCategories = categories.filter(item =>
    (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = userRole === 'ADMIN' ? users.filter(item => {
    return (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
           (item.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
           (item.type || '').toLowerCase().includes(searchTerm.toLowerCase());
  }) : [];

  // Handle deletion
  const handleDeleteCourse = async (id) => {
    if (window.confirm('Deseja realmente excluir este curso do banco de dados?')) {
      try {
        const response = await apiFetch(`/course/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setCourses(courses.filter(c => c.id !== id));
          showToast('Registro de Curso excluído do banco com sucesso!');
        } else {
          alert('Erro ao excluir curso.');
        }
      } catch (err) { console.error(err); }
    }
  };

  const handleDeleteCompany = async (id) => {
    if (window.confirm('Deseja realmente excluir esta instituição do banco de dados?')) {
      try {
        const response = await apiFetch(`/companie/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setCompanies(companies.filter(c => c.id !== id));
          showToast('Registro de Empresa/Escola excluído do banco!');
        } else {
          alert('Erro ao excluir instituição.');
        }
      } catch (err) { console.error(err); }
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Deseja excluir esta categoria do banco de dados?')) {
      try {
        const response = await apiFetch(`/categorie/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setCategories(categories.filter(c => c.id !== id));
          showToast('Categoria removida com sucesso!');
        } else {
          alert('Erro ao excluir categoria.');
        }
      } catch (err) { console.error(err); }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Deseja excluir este usuário do banco de dados?')) {
      try {
        const response = await apiFetch(`/user/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setUsers(users.filter(u => u.id !== id));
          showToast('Usuário removido do sistema!');
        } else {
          alert('Erro ao excluir usuário.');
        }
      } catch (err) { console.error(err); }
    }
  };

  // Handle Form Submit (Inserir dados no banco)
  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (modalEntityType === 'course') {
      const trimmedName = (courseForm.name || '').trim();
      if (!trimmedName || trimmedName.length < 2) {
        alert('Por favor, preencha o nome do curso com no mínimo 2 caracteres.');
        return;
      }
      if (!courseForm.workload) {
        alert('Por favor, informe a carga horária do curso.');
        return;
      }
      const trimmedDesc = (courseForm.description || '').trim();
      if (trimmedDesc.length < 10) {
        alert('Atenção: A descrição do curso deve conter pelo menos 10 caracteres.');
        return;
      }
      try {
        const selectedCompany = companies.find(c => c.name === courseForm.company_name);
        const companyId = selectedCompany ? selectedCompany.id : 1;
        const selectedCategory = categories.find(c => c.name === courseForm.Field_of_study);
        const categoryIds = selectedCategory ? [selectedCategory.id] : [1];

        const isBase64Upload = courseForm.urlImg && courseForm.urlImg.startsWith('data:');
        const safeBackendImageUrl = isBase64Upload
          ? getFallbackImageUrl(courseForm.Field_of_study)
          : (courseForm.urlImg ? courseForm.urlImg.trim().slice(0, 250) : getFallbackImageUrl(courseForm.Field_of_study));

        const payload = {
          name: courseForm.name,
          description: trimmedDesc,
          urlImg: safeBackendImageUrl,
          workload: Number(courseForm.workload),
          ranking: Number(courseForm.ranking) || 1,
          fieldOfStudy: courseForm.Field_of_study,
          companyId: companyId,
          categoryIds: categoryIds,
          ownerId: user?.id || 1,
          status: courseForm.status || 'ATIVO'
        };
        const response = await apiFetch('/course', { method: 'POST', body: JSON.stringify(payload) });
        if (response.ok) {
          const newCourse = await response.json();
          
          if (isBase64Upload) {
            saveLocalCourseImage(newCourse.id, courseForm.urlImg);
            saveLocalCourseImage(newCourse.name, courseForm.urlImg);
            newCourse.urlImg = courseForm.urlImg;
          }
          
          setCourses([newCourse, ...courses]);
          showToast(`✓ Curso "${newCourse.name}" inserido no banco com sucesso!`);
          setCourseForm({ name: '', description: '', urlImg: '', workload: '', Field_of_study: 'Tecnologia', company_name: directorCompany ? directorCompany.name : 'Senac São Carlos', ranking: '1', status: 'ATIVO' });
        } else {
          const errText = await response.text();
          let userMsg = errText;
          try {
            const errJson = JSON.parse(errText);
            if (errJson.details && Array.isArray(errJson.details) && errJson.details.length > 0) {
              userMsg = errJson.details.map(d => d.message || `${d.path?.join('.')}: campo inválido`).join('\n');
            } else if (errJson.error || errJson.message) {
              userMsg = errJson.error || errJson.message;
            }
          } catch (e) {}
          alert('Aviso ao cadastrar curso:\n' + userMsg);
          console.error('Erro backend:', errText);
        }
      } catch (err) { console.error(err); alert('Erro de conexão.'); }
    }
    else if (modalEntityType === 'company') {
      if (!companyForm.name || !companyForm.cnpj) {
        alert('Por favor, informe ao menos a Razão Social e o CNPJ.');
        return;
      }
      try {
        const payload = {
          name: companyForm.name,
          cnpj: companyForm.cnpj,
          foundation: companyForm.foundation || '2026-01-01',
          places: companyForm.places || 'Não informado',
          fundamentals: companyForm.fundaments || 'Formação e qualificação educacional.',
          methods: companyForm.methods || 'Presencial e EAD',
          ranking: Number(companyForm.ranking) || 1,
          ownerId: user?.id || 1
        };
        const response = await apiFetch('/companie', { method: 'POST', body: JSON.stringify(payload) });
        if (response.ok) {
          const newCompany = await response.json();
          setCompanies([newCompany, ...companies]);
          showToast(`✓ Instituição "${newCompany.name}" cadastrada no banco!`);
          setCompanyForm({ name: '', cnpj: '', foundation: '', places: '', fundaments: '', methods: '', ranking: '1', owner_name: '' });
        } else { alert('Erro ao inserir instituição no banco.'); }
      } catch (err) { console.error(err); alert('Erro de conexão.'); }
    }
    else if (modalEntityType === 'category') {
      if (!categoryForm.name || !categoryForm.name.trim()) {
        alert('Por favor, informe o nome da categoria.');
        return;
      }
      try {
        const payload = {
          name: categoryForm.name.trim(),
          description: categoryForm.description || 'Categoria de estudos'
        };
        const response = await apiFetch('/categorie', { method: 'POST', body: JSON.stringify(payload) });
        if (response.ok) {
          const newCat = await response.json();
          setCategories(prev => {
            const exists = prev.some(c => c.id === newCat.id || c.name.toLowerCase() === newCat.name.toLowerCase());
            return exists ? prev : [...prev, newCat];
          });
          setCourseForm(prev => ({ ...prev, Field_of_study: newCat.name }));
          showToast(`✓ Categoria "${newCat.name}" cadastrada no banco e disponível para todos os diretores!`);
          setCategoryForm({ name: '', description: '' });
        } else {
          const errText = await response.text();
          alert('Erro ao inserir categoria no banco: ' + errText);
        }
      } catch (err) { console.error(err); alert('Erro de conexão ao salvar categoria.'); }
    }
    else if (modalEntityType === 'user') {
      if (!userForm.name || !userForm.email || !userForm.cpf) {
        alert('Por favor, preencha Nome, CPF e E-mail.');
        return;
      }
      try {
        const payload = {
          name: userForm.name,
          cpf: userForm.cpf,
          email: userForm.email,
          type: userForm.type,
          status: userForm.status,
          birthDate: userForm.birth_date || '2000-01-01',
          password: userForm.password || '123',
          companyId: 1 // Defaulting to 1
        };
        const response = await apiFetch('/user', { method: 'POST', body: JSON.stringify(payload) });
        if (response.ok) {
          const newUser = await response.json();
          setUsers([newUser, ...users]);
          showToast(`✓ Usuário "${newUser.name}" registrado no banco!`);
          setUserForm({ name: '', cpf: '', email: '', type: 'DIRECTOR', status: 'ATIVO', birth_date: '', password: '123', company_name: 'Senac São Carlos' });
        } else { alert('Erro ao inserir usuário no banco.'); }
      } catch (err) { console.error(err); alert('Erro de conexão.'); }
    }

    setIsModalOpen(false);
  };

  const openModal = (type) => {
    setModalEntityType(type);
    setIsModalOpen(true);
  };

  // If user is logged out, show access restricted guard
  if (!user) {
    return (
      <div id="admin-page">
        <main className="admin-container">
          <div className="admin-auth-guard-card">
            <div className="auth-guard-icon-wrapper">
              <Lock size={44} className="auth-guard-lock-icon" />
            </div>
            <h2>Acesso Restrito ao Painel Administrativo</h2>
            <p>
              Esta área é exclusiva para Administradores e Diretores de Instituições de Ensino.
              Faça login com seu e-mail e senha cadastrados no banco de dados para gerenciar o sistema.
            </p>

            <button
              type="button"
              className="btn-guard-login"
              onClick={openAuthModal}
            >
              <LogIn size={18} />
              <span>Entrar com E-mail e Senha</span>
            </button>

            <div className="guard-quick-login-section">
              <span className="guard-quick-title">Acesso rápido aos usuários cadastrados no banco:</span>
              <div className="guard-users-grid">
                {availableUsers.filter(u => u.status === 'ATIVO').map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    className={`guard-user-btn ${(u.type || '').toLowerCase()}`}
                    onClick={() => login(u.email, u.password || '123')}
                  >
                    <div className="guard-avatar">
                      {u.type === 'ADMIN' ? <Crown size={18} /> : <GraduationCap size={18} />}
                    </div>
                    <div className="guard-info">
                      <strong>{u.name}</strong>
                      <span className="guard-role">{u.type === 'ADMIN' ? '👑 Administrador Global' : `🎓 Diretor (${u.company_name})`}</span>
                      <span className="guard-email">{u.email}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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

            {/* Active User Session Bar */}
            <div className="admin-active-session-pill">
              <div className="session-user-avatar">
                {user.type === 'ADMIN' ? <Crown size={15} /> : <GraduationCap size={15} />}
              </div>
              <div className="session-user-text">
                <span>Conectado como: <strong>{user.name}</strong> ({user.company_name})</span>
              </div>
              <button
                type="button"
                className="btn-session-logout"
                onClick={logout}
                title="Deslogar do sistema"
              >
                <LogOut size={14} />
                <span>Deslogar</span>
              </button>
            </div>
          </div>

          {/* Welcome Panel */}
          <div className="role-switcher-card">
            <div className="role-header">
              <ShieldCheck size={18} className="role-icon" />
              <span className="role-label">Painel de Controle</span>
            </div>
            <div style={{ marginTop: '12px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                Bem-vindo, {user?.name || 'Usuário'}! 👋
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px' }}>
                {userRole === 'ADMIN'
                  ? '👑 Você está acessando como Administrador Global — controle total da plataforma.'
                  : `🎓 Você está gerenciando a instituição vinculada à sua conta.`}
              </p>
            </div>
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

          {userRole === 'ADMIN' && (
            <div className="stat-card" onClick={() => setActiveTab('users')}>
              <div className="stat-icon icon-users">
                <Users size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Usuários no Sistema</span>
                <strong className="stat-number">{filteredUsers.length}</strong>
              </div>
            </div>
          )}
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

              <button
                className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
                onClick={() => setActiveTab('categories')}
              >
                <Layers size={18} />
                <span>Categorias ({filteredCategories.length})</span>
              </button>

              {userRole === 'ADMIN' && (
                <button
                  className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveTab('users')}
                >
                  <Users size={18} />
                  <span>Usuários ({filteredUsers.length})</span>
                </button>
              )}
            </div>

            <div className="actions-cluster">
              <button
                className="btn-insert-database"
                onClick={() => {
                  if (activeTab === 'courses') openModal('course');
                  else if (activeTab === 'companies') openModal('company');
                  else if (activeTab === 'categories') openModal('category');
                  else if (activeTab === 'users' && userRole === 'ADMIN') openModal('user');
                  else openModal('course');
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
                          <div className="course-name-row">
                            <div className="course-table-thumb">
                              {getCourseImageUrl(c) ? (
                                <img src={getCourseImageUrl(c)} alt={c.name} onError={(e) => { e.target.style.display = 'none'; }} />
                              ) : (
                                <span className="thumb-fallback">📚</span>
                              )}
                            </div>
                            <div className="name-wrapper">
                              <span className="item-title">{c.name}</span>
                              <span className="item-subtitle">{c.description}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge-tag category-badge">{c.Field_of_study || c.fieldOfStudy}</span>
                        </td>
                        <td className="cell-company">{getCompanyName(c)}</td>
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
                          <span className={`status-pill ${(c.status || '').toLowerCase()}`}>
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
          {activeTab === 'categories' && (
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
                          {userRole === 'ADMIN' ? (
                            <button
                              className="action-btn delete-btn"
                              title="Remover categoria"
                              onClick={() => handleDeleteCategory(cat.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Padrão Global</span>
                          )}
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
                          <span className={`status-pill ${(u.status || '').toLowerCase()}`}>
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

              <button
                type="button"
                className={`entity-tab ${modalEntityType === 'category' ? 'active' : ''}`}
                onClick={() => setModalEntityType('category')}
              >
                <Layers size={16} />
                <span>Categoria</span>
              </button>

              {userRole === 'ADMIN' && (
                <button
                  type="button"
                  className={`entity-tab ${modalEntityType === 'user' ? 'active' : ''}`}
                  onClick={() => setModalEntityType('user')}
                >
                  <Users size={16} />
                  <span>Usuário</span>
                </button>
              )}
            </div>

            {/* FORM: CURSO */}
            {modalEntityType === 'course' && (
              <form onSubmit={handleCreateSubmit} className="admin-form">
                <div className="form-group">
                  <label>
                    Nome do Curso * <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 'normal' }}>(mínimo 2 caracteres)</span>
                  </label>
                  <input
                    type="text"
                    minLength={2}
                    placeholder="Ex: IA, Java, Python na Prática..."
                    value={courseForm.name}
                    onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
                    required
                  />
                </div>

                {/* CAMPO DE IMAGEM */}
                <div className="form-group image-upload-section">
                  <label className="image-field-label">
                    <div className="label-with-icon">
                      <ImageIcon size={15} />
                      <span>Imagem de Capa do Curso</span>
                    </div>
                    <span className="label-tip">Cole o link da imagem ou selecione do computador (máx. 2MB)</span>
                  </label>

                  <div className="image-input-controls">
                    <input
                      type="text"
                      placeholder="https://exemplo.com/imagem.jpg ou faça upload"
                      value={courseForm.urlImg}
                      onChange={(e) => setCourseForm({...courseForm, urlImg: e.target.value})}
                      className="url-image-input"
                    />

                    <label className="btn-file-upload">
                      <Upload size={15} />
                      <span>Carregar Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCourseImageUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>

                  {/* Preset Suggestions */}
                  <div className="image-preset-bar">
                    <span className="preset-title">
                      <Sparkles size={13} /> Sugestões rápidas:
                    </span>
                    <div className="preset-buttons">
                      {QUICK_IMAGE_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="preset-btn"
                          onClick={() => setCourseForm({ ...courseForm, urlImg: preset.url })}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Image Preview */}
                  {courseForm.urlImg && (
                    <div className="course-image-preview-card">
                      <div className="preview-img-wrapper">
                        <img
                          src={courseForm.urlImg}
                          alt="Prévia do Curso"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                      </div>
                      <div className="preview-info">
                        <span className="preview-status">✓ Imagem carregada</span>
                        <button
                          type="button"
                          className="btn-remove-preview-img"
                          onClick={() => setCourseForm({ ...courseForm, urlImg: '' })}
                        >
                          Remover imagem
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ margin: 0 }}>Área de Estudo / Categoria *</label>
                      <button
                        type="button"
                        onClick={() => openModal('category')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#38bdf8',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                        title="Cadastrar nova categoria no banco de dados"
                      >
                        <Plus size={13} /> + Nova Categoria
                      </button>
                    </div>
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
                    {userRole === 'DIRECTOR' ? (
                      <div style={{
                        padding: '10px 14px',
                        background: 'rgba(99,102,241,0.1)',
                        border: '1px solid rgba(99,102,241,0.4)',
                        borderRadius: '8px',
                        color: '#a5b4fc',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        🏫 {directorCompany ? directorCompany.name : 'Carregando sua instituição...'}
                      </div>
                    ) : (
                      <select
                        value={courseForm.company_name}
                        onChange={(e) => setCourseForm({...courseForm, company_name: e.target.value})}
                      >
                        {companies.map(comp => (
                          <option key={comp.id} value={comp.name}>{comp.name}</option>
                        ))}
                      </select>
                    )}
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
                  <label>Status do Curso no Sistema</label>
                  <select
                    value={courseForm.status}
                    onChange={(e) => setCourseForm({...courseForm, status: e.target.value})}
                  >
                    <option value="ATIVO">🟢 ATIVO (Visível e disponível para matrículas)</option>
                    <option value="INATIVO">🔴 INATIVO (Oculto no catálogo público)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    Descrição do Curso * <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 'normal' }}>(mínimo 10 caracteres)</span>
                  </label>
                  <textarea
                    rows="3"
                    required
                    minLength={10}
                    placeholder="Descreva o conteúdo programático, metodologia e objetivos do curso (mín. 10 caracteres)..."
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
