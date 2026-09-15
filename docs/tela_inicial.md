# Especificação Detalhada - Tela Inicial (`tela_inicial.png`)

Este documento descreve detalhadamente todos os elementos, componentes visuais, hierarquia de conteúdo e interações da **Tela Inicial (Home)** da plataforma **EducaFind**.

---

## 1. Visão Geral da Tela
- **Nome da Tela:** Tela Inicial / Home Desktop
- **Arquivo de Referência:** `tela_inicial.png`
- **Público-alvo:** Estudantes, profissionais e pessoas em busca de capacitação e cursos.
- **Objetivo Principal:** Apresentar a proposta de valor da plataforma, fornecer ferramenta de busca rápida e direcionar o usuário para os cursos e escolas em destaque.

---

## 2. Estrutura e Seções da Tela

### 2.1. Barra de Navegação Superior (Header / Navbar)
Localizada no topo da página de ponta a ponta com fundo azul marinho escuro translúcido:
- **Lado Esquerdo:**
  - **Logo:** Ícone de capelo / chapéu de formatura estilizado acompanhado da tipografia **EducaFind**.
- **Centro:**
  - **Barra de Pesquisa no Header:** Campo de busca em formato pílula com ícone de lupa e o placeholder: `"Pesquisar cursos, escolas ou áreas..."`.
- **Lado Direito:**
  - **Menu de Navegação:** Links para `Início` (ativo/destacado), `Escolas`, `Cursos`, `Categorias`.
  - **Ícone de Usuário / Perfil:** Avatar circular para acesso à conta ou login.

---

### 2.2. Seção Hero (Destaque Principal)
Área com grande impacto visual e fundo temático escuro com elementos de estudo (livros clássicos empilhados e capelo de formatura com iluminação azul ciano e neon):
- **Badge Superior:**
  - Pequena pílula azul escura com ícone e o texto: `🎓 Seu futuro começa aqui`.
- **Título de Impacto (Headline):**
  - `"Encontre o curso ideal para o seu futuro."`
  - *Destaque de cor:* As palavras **"curso"** e **"seu futuro."** utilizam cor azul ciano vibrante para ênfase visual.
- **Subtítulo:**
  - `"Mais de 100 escolas e milhares de cursos em um só lugar."`
- **Barra de Busca Principal (Hero Search Bar):**
  - Campo de texto amplo com bordas arredondadas e fundo translúcido/branco.
  - Ícone de lupa no início e placeholder `"Pesquisar cursos, escolas ou áreas..."`.
  - Botão de ação integrado no lado direito com fundo azul vibrante e ícone de lupa branca para submissão da busca.

---

### 2.3. Barra de Diferenciais / Estatísticas (Feature Cards)
Container horizontal posicionado logo abaixo do hero, contendo 4 cards em estilo *glassmorphism* com bordas sutis e cantos arredondados:

| Card | Ícone | Título / Descrição |
| :--- | :--- | :--- |
| **1. Escolas** | Ícone de escola / prédio institucional | **Mais de 100 escolas** |
| **2. Cursos** | Ícone de biblioteca / livros | **Milhares de cursos** |
| **3. Ranking** | Ícone de troféu de premiação | **Ranking das melhores escolas** |
| **4. Certificação** | Ícone de certificado / diploma com selo | **Certificados reconhecidos** |

---

### 2.4. Seção de Cursos em Destaque
- **Cabeçalho da Seção:**
  - Título à esquerda: **"Cursos em destaque"** (em fonte branca e negrito).
  - Link de ação à direita: **"Ver todos →"** (link clicável em azul claro).
- **Grid de Cards de Cursos (4 Colunas):**

#### Card 1: Lógica de Programação
- **Badge Superior:** `🔥 Mais procurado`
- **Imagem / Banner:** Computador com código na tela e ícone `</>`.
- **Título:** **Lógica de Programação**
- **Categoria / Área:** Tecnologia da Informação
- **Carga Horária:** ⏱️ 80 horas

#### Card 2: Java do Zero ao Avançado
- **Imagem / Banner:** Ambiente de desenvolvimento com o símbolo clássico de xícara do Java.
- **Título:** **Java do Zero ao Avançado**
- **Categoria / Área:** Tecnologia da Informação
- **Carga Horária:** ⏱️ 120 horas

#### Card 3: Desenvolvimento Web Completo
- **Imagem / Banner:** Ilustrações e logos de HTML5, CSS3 e JavaScript (`5`, `3`, `JS`).
- **Título:** **Desenvolvimento Web Completo**
- **Categoria / Área:** Tecnologia da Informação
- **Carga Horária:** ⏱️ 180 horas

#### Card 4: Computação em Nuvem
- **Imagem / Banner:** Servidor com ícone de nuvem conectada e dados sincronizados.
- **Título:** **Computação em Nuvem**
- **Categoria / Área:** Tecnologia da Informação
- **Carga Horária:** ⏱️ 100 horas

---

## 3. Comportamentos e Interações Esperadas
1. **Busca:** Ao digitar no campo de busca do Header ou do Hero e pressionar Enter ou clicar na lupa, o usuário é redirecionado para a listagem filtrada de cursos/escolas.
2. **Navegação no Header:** 
   - Clicar em "Escolas" abre a listagem ranqueada de instituições de ensino.
   - Clicar em "Categorias" aciona o modal de seleção de áreas de conhecimento.
3. **Cards de Cursos:** Ao passar o mouse (*hover*), os cards elevam suavemente com brilho azul na borda. Clicar em qualquer card abre a página de detalhes do respectivo curso.
4. **Link "Ver todos":** Redireciona para o catálogo completo de cursos com filtros avançados.
