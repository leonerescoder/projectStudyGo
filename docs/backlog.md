# Backlog de Funcionalidades Implementadas

Este documento registra o histórico de funcionalidades implementadas no StudyGo para orientar agentes e desenvolvedores sobre a arquitetura atual e os padrões em uso.

---

## 2. Atualização visual da identidade

### Status
- **Concluído**

### Descrição
- Fundos das telas principais ajustados para branco, com texto preto e acentos em azul escuro.
- Menu hamburger removido da navbar; categorias continuam acessíveis pelo link "Categorias".
- Quadros e filtros da tela inicial receberam fundo preto e texto branco.
- Cards de cursos populares ficaram sem borda permanente e ganharam seleção visual em azul escuro no hover, sem deslocar o layout.

### Arquivos Modificados
- `src/components/Navbar/Navbar.jsx`
- `src/globals.css`
- `src/tela_inicial.css`
- `src/components/RankingSection/RankingSection.css`
- `src/components/CompanyBanner/CompanyBanner.css`
- `src/pages/Escolas/Escolas.css`
- `src/pages/Escolas/EscolaSelecionada.css`
- `src/pages/Course/Course.css`
- `src/components/Admin/Admin.css`
- `src/components/Admin/DirectorAdmin.css`

---

## 3. Hero animado de educação tecnológica

### Status
- **Concluído**

### Descrição
- A imagem estática do hero foi substituída por uma rede animada de nós conectados em canvas.
- Foram adicionados os ícones flutuantes de educação e a camada de gradiente/grid do componente enviado.
- O conteúdo existente do hero permanece sobre a animação, com contraste ajustado para leitura.

### Arquivos Modificados / Criados
- `src/components/TechEducationHero/TechEducationHero.jsx` (Novo)
- `src/components/Hero/Hero.jsx`
- `src/tela_inicial.css`

---

## 4. Imagens temáticas dos cursos

### Status
- **Concluído**

### Descrição
- A seleção de imagem dos cards agora considera o nome e a descrição do curso.
- Foram adicionados temas para programação, web, JavaScript, banco de dados, cloud, DevOps, design, segurança, redes e dados.
- As imagens dos cards mantêm o mesmo enquadramento e tamanho usando `object-fit: cover`.
- Imagens salvas localmente continuam tendo prioridade para não sobrescrever uploads existentes.

### Arquivos Modificados
- `src/utils/courseImage.js`
- `src/components/CourseGrid/CourseCard.jsx`
- `src/tela_inicial.css`

---

## 5. Ajuste de espaçamento da tela inicial

### Status
- **Concluído**

### Descrição
- Reduzido o espaço vertical entre os balões de diferenciais, o ranking de cursos e a seção de cursos populares.
- Mantida uma margem curta para separar visualmente as seções sem deixar áreas vazias excessivas.

### Arquivos Modificados
- `src/tela_inicial.css`
- `src/components/RankingSection/RankingSection.css`

---

## 6. Carrossel de cursos no hero

### Status
- **Concluído**

### Descrição
- Adicionada uma faixa de imagens de cursos na parte superior do hero.
- Setas laterais permitem navegar pelos cursos disponíveis.
- Cada imagem é clicável e direciona para `/course/:id`.
- A busca permanece abaixo da faixa de imagens, junto ao título e subtítulo da Home.
- O carrossel se adapta para desktop, tablet e celular.

### Arquivos Modificados
- `src/components/Hero/Hero.jsx`
- `src/tela_inicial.jsx`
- `src/tela_inicial.css`

---

## 7. Banner principal no estilo Buscapé

### Status
- **Concluído**

### Descrição
- Substituída a faixa de pequenos cards e o fundo de rede por um banner de imagem em largura total.
- O banner exibe uma imagem de curso por vez, com setas laterais e indicadores de posição.
- O clique no banner direciona para a página do curso exibido.
- O título e a barra de pesquisa ficaram abaixo do banner, seguindo a composição de sites de ofertas.
- URLs de imagem inválidas recebem uma imagem temática de fallback.

### Arquivos Modificados
- `src/components/Hero/Hero.jsx`
- `src/utils/courseImage.js`
- `src/tela_inicial.css`

---

## 8. Ampliação do banner e correção da busca

### Status
- **Concluído**

### Descrição
- Banner principal ampliado verticalmente para destacar melhor as imagens dos cursos.
- Removida a sobreposição dos balões sobre a barra de pesquisa.
- Imagens temáticas passaram a usar parâmetros de maior resolução e qualidade.
- Alturas menores foram definidas para tablet e celular.

### Arquivos Modificados
- `src/tela_inicial.css`
- `src/utils/courseImage.js`

---

## 9. Animação do banner principal

### Status
- **Concluído**

### Descrição
- Banner alterna automaticamente entre os cursos a cada cinco segundos.
- Troca de imagem ganhou animação suave de entrada com zoom leve.
- A rotação pausa ao passar o mouse ou focar o banner.
- A preferência `prefers-reduced-motion` é respeitada.

### Arquivos Modificados
- `src/components/Hero/Hero.jsx`
- `src/tela_inicial.css`

---

## 10. Imagens fornecidas no banner da Home

### Status
- **Concluído**

### Descrição
- As quatro imagens fornecidas foram aplicadas ao carrossel principal: Administração, Inteligência Artificial, Banco de Dados PostgreSQL e Gastronomia.
- Cada banner busca um curso relacionado pelo nome, categoria ou descrição para manter o clique contextual.
- Caso não exista correspondência exata, o banner direciona para um curso disponível na posição atual.

### Arquivos Modificados
- `src/components/Hero/Hero.jsx`

---

## 11. Correção de imagens ausentes

### Status
- **Concluído**

### Descrição
- O banner principal deixou de depender da resposta da API para ser renderizado.
- Adicionado fallback local para o banner quando imagens externas falham.
- Cards de cursos populares e ranking também usam fallback local para evitar imagens quebradas.

### Arquivos Modificados
- `src/components/Hero/Hero.jsx`
- `src/components/CourseGrid/CourseCard.jsx`
- `src/components/RankingSection/RankingSection.jsx`

---

## 12. Correção da tela branca após atualização do banner

### Status
- **Concluído**

### Descrição
- Corrigida referência antiga a `activeCourse` no componente do banner.
- O erro de runtime impedia a renderização completa da aplicação.

### Arquivo Modificado
- `src/components/Hero/Hero.jsx`

---

## 13. Correção das informações da tela de curso

### Status
- **Concluído**

### Descrição
- A tela de detalhes agora trata respostas da API encapsuladas em `data` ou `value`.
- Imagens principal e relacionadas recebem fallback local quando a URL cadastrada falha.
- Imagens foram padronizadas para preencher corretamente seus containers.

### Arquivos Modificados
- `src/pages/Course/Course.jsx`
- `src/pages/Course/Course.css`

---

## 14. Carregamento independente das informações do curso

### Status
- **Concluído**

### Descrição
- A tela de detalhes agora libera nome, descrição, categoria e carga horária assim que o curso principal chega.
- A busca de ranking e cursos relacionados ocorre separadamente e não bloqueia mais a informação principal.

### Arquivo Modificado
- `src/pages/Course/Course.jsx`

---

## 15. Correção de contraste em cursos e escolas

### Status
- **Concluído**

### Descrição
- Textos das telas de curso e escolas foram ajustados para preto e cinza escuro em fundos claros.
- Corrigidos títulos, descrições, filtros, campos de busca, cards de escolas e informações da escola selecionada.
- Mantidos azul escuro para detalhes e branco somente em botões ou áreas coloridas.

### Arquivos Modificados
- `src/pages/Course/Course.css`
- `src/pages/Escolas/Escolas.css`
- `src/components/SchoolCard/SchoolCard.css`
- `src/pages/Escolas/EscolaSelecionada.css`

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

---

## 16. Dados da instituição nas telas relacionadas

### Status
- **Concluído**

### Descrição
- A tela de detalhes da instituição exibe a imagem cadastrada em `urlImg`, usando a inicial como fallback.
- O contato exibe `tel` e `email` vindos da API, sem o site mockado.
- A tela de detalhes do curso exibe a escola relacionada logo abaixo do nome e mantém o acesso para a instituição.

### Arquivos Modificados
- `src/pages/Escolas/EscolaSelecionada.jsx`
- `src/pages/Escolas/EscolaSelecionada.css`
- `src/pages/Course/Course.jsx`

---

## 17. Nome do curso no ranking

### Status
- **Concluído**

### Descrição
- Os cards do ranking agora exibem o nome do curso no lugar da categoria.

### Arquivo Modificado
- `src/components/RankingSection/RankingSection.jsx`

---

## 18. Posição do ranking no topo dos cards

### Status
- **Concluído**

### Descrição
- A posição de cada curso agora aparece no topo da imagem em um badge azul com troféu, seguindo a referência visual.

### Arquivos Modificados
- `src/components/RankingSection/RankingSection.jsx`
- `src/components/RankingSection/RankingSection.css`

---

## 19. Cores dos badges do ranking

### Status
- **Concluído**

### Descrição
- Os badges dos três primeiros colocados permanecem azuis.
- Os badges das posições seguintes ficam brancos e sem troféu.

### Arquivos Modificados
- `src/components/RankingSection/RankingSection.jsx`
- `src/components/RankingSection/RankingSection.css`
