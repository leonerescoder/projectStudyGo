import { apiFetch, BASE_URL } from '../API/apiClient.js';
import { INITIAL_CATEGORIES } from '../components/Admin/adminData.js';

export const CATEGORIES_UPDATE_EVENT = 'studygo_categories_updated';
const CATEGORIES_CACHE_KEY = 'studygo_global_categories';

/**
 * FASE 2: Função centralizada de normalização de categorias.
 * Converte para minúsculas, remove acentos, pontos, espaços, hífens,
 * caracteres especiais e não alfanuméricos para comparação consistente.
 *
 * Exemplos:
 * - "Tecnologia" -> "tecnologia"
 * - "TECNOLOGIA" -> "tecnologia"
 * - "Tecnológia" -> "tecnologia"
 * - "Tecnologia." -> "tecnologia"
 * - " tecnologia " -> "tecnologia"
 * - "Tecnologia-Web" -> "tecnologiaweb"
 * - "Tecnologia Web" -> "tecnologiaweb"
 *
 * @param {string} input Nome da categoria
 * @returns {string} String normalizada para comparação
 */
export function normalizeCategoryName(input) {
  if (!input || typeof input !== 'string') return '';
  return input
    .trim()
    .toLowerCase()
    .normalize('NFD') // Decompõe caracteres acentuados (ex: é -> e + acento)
    .replace(/[\u0300-\u036f]/g, '') // Remove marcas de acentos
    .replace(/[^a-z0-9]/g, ''); // Remove qualquer caractere não alfanumérico (pontos, traços, espaços, etc)
}

/**
 * Formata o nome para exibição limpa (remove pontuações soltas e espaços duplicados)
 */
export function cleanCategoryDisplay(input) {
  if (!input || typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[.,;:\-_/\\#$!%^&*()+=~`|<>?{}[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * FASE 6: Calcula a similaridade entre duas strings (0.0 a 1.0)
 * Combina Levenshtein Distance com análise de tokens/substrings.
 */
export function calculateSimilarity(strA, strB) {
  const normA = normalizeCategoryName(strA);
  const normB = normalizeCategoryName(strB);

  if (!normA || !normB) return 0;
  if (normA === normB) return 1.0;

  // Se uma contém a outra completamente (ex: "tec" em "tecnologia" ou "tecnologiaweb" e "tecnologia")
  if (normA.includes(normB) || normB.includes(normA)) {
    const minLen = Math.min(normA.length, normB.length);
    const maxLen = Math.max(normA.length, normB.length);
    const inclusionScore = minLen / maxLen;
    return Math.max(0.75, inclusionScore);
  }

  // Distância de Levenshtein
  const matrix = [];
  for (let i = 0; i <= normB.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= normA.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= normB.length; i++) {
    for (let j = 1; j <= normA.length; j++) {
      if (normB.charAt(i - 1) === normA.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substituição
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1) // inserção / deleção
        );
      }
    }
  }

  const distance = matrix[normB.length][normA.length];
  const maxLen = Math.max(normA.length, normB.length);
  const similarity = 1 - distance / maxLen;

  return Math.max(0, similarity);
}

/**
 * FASE 5 & 6: Analisa uma entrada de categoria contra uma lista existente.
 * Retorna se há equivalência exata, sugestões semelhantes ou nenhuma correspondência.
 *
 * @param {string} inputName Nome digitado pelo usuário
 * @param {Array} categoriesList Lista de categorias disponíveis
 */
export function findCategoryMatch(inputName, categoriesList = []) {
  const rawInput = (inputName || '').trim();
  const normalizedInput = normalizeCategoryName(rawInput);

  if (!normalizedInput) {
    return {
      status: 'EMPTY',
      exactMatch: null,
      similarMatches: [],
      rawInput,
      normalizedInput
    };
  }

  const list = Array.isArray(categoriesList) && categoriesList.length > 0
    ? categoriesList
    : INITIAL_CATEGORIES;

  let exactMatch = null;
  const similarMatches = [];

  for (const cat of list) {
    const catName = cat.name || '';
    const catNormalized = cat.nome_normalizado || normalizeCategoryName(catName);

    // 1. Correspondência Exata Normalizada
    if (catNormalized === normalizedInput) {
      exactMatch = {
        ...cat,
        nome_normalizado: catNormalized
      };
      break; // Encontrou equivalência total
    }

    // 2. Busca por Similaridade
    const simScore = calculateSimilarity(rawInput, catName);
    if (simScore >= 0.55) {
      similarMatches.push({
        category: {
          ...cat,
          nome_normalizado: catNormalized
        },
        score: simScore,
        isTokenOverlap: rawInput.toLowerCase().split(/\s+/).some(t => t.length >= 3 && catName.toLowerCase().includes(t))
      });
    }
  }

  // Ordena sugestões pela maior pontuação de similaridade
  similarMatches.sort((a, b) => b.score - a.score);

  if (exactMatch) {
    return {
      status: 'EXACT_MATCH',
      exactMatch,
      similarMatches: [],
      rawInput,
      normalizedInput
    };
  }

  if (similarMatches.length > 0) {
    return {
      status: 'SIMILAR_MATCH',
      exactMatch: null,
      similarMatches: similarMatches.map(m => m.category),
      rawInput,
      normalizedInput
    };
  }

  return {
    status: 'NO_MATCH',
    exactMatch: null,
    similarMatches: [],
    rawInput,
    normalizedInput
  };
}

/**
 * FASE 3: Busca e sincroniza a lista global de categorias do backend/API.
 * Garante que todos os administradores e diretores acessem a mesma base compartilhada.
 */
export async function getGlobalCategories() {
  try {
    const response = await apiFetch('/categorie');
    if (response.ok) {
      const data = await response.json();
      const rawList = Array.isArray(data) ? data : (data.value || data.data || []);
      
      if (rawList.length > 0) {
        // Enriquecer todas com nome_normalizado
        const enriched = rawList.map(cat => ({
          ...cat,
          nome_normalizado: cat.nome_normalizado || normalizeCategoryName(cat.name)
        }));

        // Salvar em cache local para disponibilidade instantânea
        try {
          localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(enriched));
        } catch (e) {
          console.warn('Erro ao salvar cache de categorias:', e);
        }

        return enriched;
      }
    }
  } catch (err) {
    console.warn('[categoryService] Não foi possível obter categorias da API, usando fallback:', err);
  }

  // Fallback: ler do cache local ou dos dados iniciais
  try {
    const cached = localStorage.getItem(CATEGORIES_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(c => ({
          ...c,
          nome_normalizado: c.nome_normalizado || normalizeCategoryName(c.name)
        }));
      }
    }
  } catch (e) {}

  return INITIAL_CATEGORIES.map(c => ({
    ...c,
    nome_normalizado: normalizeCategoryName(c.name)
  }));
}

/**
 * FASE 8: Salva ou reaproveita categoria no backend.
 * Se já existir uma categoria com o mesmo nome_normalizado, reutiliza o ID existente.
 * Se for inédita, cria no banco via POST /categorie.
 */
export async function saveOrGetCategory(name, description = '') {
  const cleanName = cleanCategoryDisplay(name);
  if (!cleanName || cleanName.length < 2) {
    throw new Error('O nome da categoria deve conter no mínimo 2 caracteres.');
  }

  const existingList = await getGlobalCategories();
  const matchResult = findCategoryMatch(cleanName, existingList);

  // 1. Se já existe categoria com equivalência exata, reutiliza sem criar duplicata
  if (matchResult.exactMatch) {
    return {
      category: matchResult.exactMatch,
      isNew: false,
      reused: true,
      message: `Reutilizada categoria existente "${matchResult.exactMatch.name}" (ID: ${matchResult.exactMatch.id}).`
    };
  }

  // 2. Se for inédita, cria no backend
  const nome_normalizado = normalizeCategoryName(cleanName);
  const payload = {
    name: cleanName,
    description: description || `Cursos e formações na área de ${cleanName}`,
    nome_normalizado
  };

  const response = await apiFetch('/categorie', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    const created = await response.json();
    const enriched = {
      ...created,
      nome_normalizado
    };

    // Atualiza o cache local e notifica a aplicação inteira
    const updatedList = [...existingList.filter(c => c.id !== enriched.id), enriched];
    try {
      localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(updatedList));
    } catch (e) {}

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(CATEGORIES_UPDATE_EVENT, { detail: enriched }));
    }

    return {
      category: enriched,
      isNew: true,
      reused: false,
      message: `Categoria "${enriched.name}" cadastrada com sucesso globalmente!`
    };
  }

  // Se o backend retornar erro mas já existir, tentar recuperar
  const errText = await response.text();
  throw new Error(`Erro ao salvar categoria no banco: ${errText}`);
}
