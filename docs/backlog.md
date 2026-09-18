# Backlog de Funcionalidades Implementadas

Este documento registra o histórico de funcionalidades implementadas no StudyGo para orientar agentes e desenvolvedores sobre a arquitetura atual e os padrões em uso.

---

## 1. Sistema de Autenticação e Gestão de Bearer Token

### Status
- **Concluído**

### Descrição
- **Provedor de Autenticação:** `src/context/AuthContext.jsx` gerenciando estado do usuário ativo (`user`) e token de sessão (`token`).
- **Persistência em Storage:**
  - O Bearer Token é armazenado no `localStorage` sob as chaves `studygo_token` e `token`.
  - Os dados do usuário ativo são armazenados no `localStorage` sob a chave `studygo_user`.
- **API Remota:**
  - Base URL: `https://uc13-projeto.onrender.com`
  - Consulta de autenticação realiza verificação na rota `/user` (ex: `/user?email={email}`) e emite o Bearer Token compatível com JWT no client-side com fallback para credenciais da base inicial de usuários.
- **Utilitário Centralizado:**
  - Localizado em `src/API/apiClient.js` contendo funções auxiliares:
    - `getStoredToken()`
    - `setStoredToken(token)`
    - `removeStoredToken()`
    - `apiFetch(path, options)`
- **Injeção de Cabeçalho:**
  - Todas as requisições para a API remota (`/course`, `/companie`, `/categorie`, etc.) incluem o cabeçalho `Authorization: Bearer <token>` dinamicamente obtido do `localStorage`.

### Arquivos Modificados / Criados
- `src/API/apiClient.js` (Novo utilitário central de API e storage)
- `src/context/AuthContext.jsx` (Fluxo de login assíncrono, persistência e gerenciamento do token)
- `src/components/Auth/LoginModal.jsx` (Modal com tratamento de login assíncrono e feedback)
- `src/ApiCourses/ApiCourse.jsx` (Atualização da BASE_URL e passagem do token em todas as rotas)
- `src/API/apiCategorie.jsx` (Migração para endpoint remoto com Bearer token)
- `src/API/apiCompany.jsx` (Migração para endpoint remoto com Bearer token)
- `src/components/Navbar/Navbar.jsx` (Busca de categorias com Bearer token)
- `src/pages/Escolas/Escolas.jsx` (Busca de empresas parceiras com Bearer token)
- `src/pages/Escolas/EscolaSelecionada.jsx` (Busca de detalhes da instituição com Bearer token)
