// Initial Mock Data aligned with docs/banco.sql
export const INITIAL_COURSES = [
  {
    id: 1,
    name: 'Lógica de Programação',
    description: 'Aprenda lógica estruturada, algoritmos e resolva desafios práticos.',
    workload: 80,
    ranking: 1,
    Field_of_study: 'Tecnologia',
    company_name: 'Senac São Carlos',
    company_id: 1,
    status: 'ATIVO',
    createdAt: '2026-02-10'
  },
  {
    id: 2,
    name: 'Java do Zero ao Avançado',
    description: 'Orientação a objetos, arquitetura em camadas e desenvolvimento corporativo.',
    workload: 120,
    ranking: 2,
    Field_of_study: 'Tecnologia',
    company_name: 'Alura Cursos',
    company_id: 2,
    status: 'ATIVO',
    createdAt: '2026-03-01'
  },
  {
    id: 3,
    name: 'Desenvolvimento Web Completo',
    description: 'HTML5, CSS3, React, Node.js e integração com banco de dados MySQL.',
    workload: 180,
    ranking: 3,
    Field_of_study: 'Tecnologia',
    company_name: 'SENAI Hub',
    company_id: 3,
    status: 'ATIVO',
    createdAt: '2026-03-15'
  },
  {
    id: 4,
    name: 'Computação em Nuvem AWS & Azure',
    description: 'Infraestrutura cloud, containers Docker, deploy contínuo e escalabilidade.',
    workload: 100,
    ranking: 4,
    Field_of_study: 'Tecnologia',
    company_name: 'Unopar Tech',
    company_id: 4,
    status: 'ATIVO',
    createdAt: '2026-04-02'
  },
  {
    id: 5,
    name: 'Gastronomia Internacional',
    description: 'Técnicas culinárias contemporâneas, confeitaria e cozinha internacional.',
    workload: 90,
    ranking: 5,
    Field_of_study: 'Gastronomia',
    company_name: 'Senac São Carlos',
    company_id: 1,
    status: 'ATIVO',
    createdAt: '2026-04-18'
  }
];

export const INITIAL_COMPANIES = [
  {
    id: 1,
    name: 'Senac São Carlos',
    cnpj: '03.709.814/0001-98',
    foundation: '1946-01-10',
    places: 'São Paulo, SP - São Carlos',
    fundaments: 'Educação profissional de excelência voltada para o mercado de trabalho.',
    methods: 'Presencial e Híbrido com laboratórios práticos de ponta.',
    ranking: 1,
    owner_name: 'Carlos Mendes'
  },
  {
    id: 2,
    name: 'Alura Cursos Online',
    cnpj: '15.221.908/0001-45',
    foundation: '2011-05-18',
    places: 'São Paulo - 100% Remoto',
    fundaments: 'Plataforma líder em capacitação e tecnologia contínua.',
    methods: 'EAD Interativo com projetos reais e comunidade ativa.',
    ranking: 2,
    owner_name: 'Paulo Silveira'
  },
  {
    id: 3,
    name: 'SENAI Formação Profissional',
    cnpj: '03.774.819/0001-60',
    foundation: '1942-01-22',
    places: 'São Paulo, SP',
    fundaments: 'Inovação e capacitação técnica industrial reconhecida.',
    methods: 'Aulas práticas em oficinas especializadas.',
    ranking: 3,
    owner_name: 'Roberto Viana'
  },
  {
    id: 4,
    name: 'Unopar Polo Tecnológico',
    cnpj: '43.728.910/0001-22',
    foundation: '1972-02-17',
    places: 'São Carlos, SP',
    fundaments: 'Ensino superior acessível e formação de competências digitais.',
    methods: 'Semipresencial e Digital.',
    ranking: 4,
    owner_name: 'Juliana Costa'
  }
];

export const INITIAL_CATEGORIES = [
  { id: 1, name: 'Tecnologia', description: 'Programação, Redes, Cloud, Inteligência Artificial e Dados' },
  { id: 2, name: 'Mecânica', description: 'Manutenção automotiva, robótica e processos industriais' },
  { id: 3, name: 'Gastronomia', description: 'Culinária, panificação, confeitaria e enologia' },
  { id: 4, name: 'Idiomas', description: 'Inglês, Espanhol, Francês e comunicação internacional' },
  { id: 5, name: 'Saúde', description: 'Enfermagem, nutrição, bem-estar e primeiros socorros' },
  { id: 6, name: 'Moda', description: 'Design de moda, costura, modelagem e tendências' },
  { id: 7, name: 'Artes', description: 'Pintura, ilustração digital, escultura e história da arte' },
  { id: 8, name: 'Música', description: 'Teoria musical, instrumentos, produção de áudio' },
  { id: 9, name: 'Educação', description: 'Pedagogia, metodologias ativas e gestão escolar' }
];

export const INITIAL_USERS = [
  {
    id: 1,
    name: 'Vanessa Silva (Você)',
    cpf: '123.456.789-00',
    email: 'vanessa.silva@studygo.com',
    type: 'ADMIN',
    status: 'ATIVO',
    birth_date: '1998-05-20',
    company_name: 'StudyGo Central'
  },
  {
    id: 2,
    name: 'Carlos Mendes',
    cpf: '987.654.321-11',
    email: 'carlos.mendes@senac.br',
    type: 'DIRECTOR',
    status: 'ATIVO',
    birth_date: '1982-11-14',
    company_name: 'Senac São Carlos'
  },
  {
    id: 3,
    name: 'Juliana Costa',
    cpf: '456.789.123-33',
    email: 'juliana.costa@unopar.br',
    type: 'DIRECTOR',
    status: 'ATIVO',
    birth_date: '1989-08-30',
    company_name: 'Unopar Polo Tecnológico'
  },
  {
    id: 4,
    name: 'Eduardo Martins',
    cpf: '333.222.111-99',
    email: 'eduardo.m@devmaster.com',
    type: 'DIRECTOR',
    status: 'INATIVO',
    birth_date: '1992-04-12',
    company_name: 'DevMaster Inst.'
  }
];
