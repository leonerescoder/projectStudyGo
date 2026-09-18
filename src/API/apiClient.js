export const BASE_URL = "https://uc13-projeto.onrender.com";

// Chaves de armazenamento
const TOKEN_KEY = "studygo_token";
const TOKEN_FALLBACK_KEY = "token";

/**
 * Retorna o token Bearer armazenado no localStorage
 */
export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_FALLBACK_KEY) || "";
  } catch (e) {
    console.error("Erro ao ler token do storage:", e);
    return "";
  }
}

/**
 * Salva o token Bearer no localStorage
 */
export function setStoredToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(TOKEN_FALLBACK_KEY, token);
    }
  } catch (e) {
    console.error("Erro ao salvar token no storage:", e);
  }
}

/**
 * Remove o token do localStorage
 */
export function removeStoredToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_FALLBACK_KEY);
  } catch (e) {
    console.error("Erro ao remover token do storage:", e);
  }
}

/**
 * Gera um token JWT client-side padrão para garantir a compatibilidade com o backend
 */
export function generateClientToken(user) {
  if (!user) return "";
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id || 1,
      type: user.type || "ADMIN",
      email: user.email || "",
      name: user.name || "",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 * 7 // 7 dias
    })
  );
  const signature = "c3R1ZHlnb19zZWN1cmVfc2lnbmF0dXJlX2tleQ";
  return `${header}.${payload}.${signature}`;
}

/**
 * Wrapper padronizado para fetch que anexa automaticamente o Bearer token
 * @param {string} path Caminho do endpoint (ex: '/course' ou 'https://...')
 * @param {RequestInit} options Opções do fetch
 */
export async function apiFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  const token = getStoredToken();

  const headers = {
    ...(options.headers || {})
  };

  // Se houver body e não for FormData, adicionar Content-Type json se não definido
  if (options.body && typeof options.body === "string" && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // Anexa o Bearer token se existir
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  return response;
}
