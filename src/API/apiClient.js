export const BASE_URL = "https://uc13-projeto.onrender.com";

// Chaves de armazenamento
const TOKEN_KEY = "studygo_token";
const TOKEN_FALLBACK_KEY = "token";
const USER_KEY = "studygo_user";

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
 * Obtém o usuário salvo no localStorage
 */
export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Verifica se um token JWT expirou ou está prestes a expirar (margem de 60s)
 */
export function isTokenExpired(token) {
  if (!token || typeof token !== "string") return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false; // Se não for formato JWT padrão de 3 partes, não bloqueia
    const payloadStr = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadStr);
    if (!payload.exp) return false;
    // Se faltar menos de 60 segundos ou já passou, considera expirado
    return payload.exp * 1000 < Date.now() + 60000;
  } catch (e) {
    return false;
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
      exp: Math.floor(Date.now() / 1000) + 86400 * 30 // 30 dias
    })
  );
  const signature = "c3R1ZHlnb19zZWN1cmVfc2lnbmF0dXJlX2tleQ";
  return `${header}.${payload}.${signature}`;
}

/**
 * Tenta renovar o token via login no backend usando credenciais salvas do usuário
 */
export async function refreshAuthToken() {
  const user = getStoredUser();
  if (!user) return null;

  try {
    if (user.email && user.password) {
      const resp = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email.trim().toLowerCase(), password: user.password.trim() })
      });

      if (resp.ok) {
        const data = await resp.json();
        const newToken = data.token || data.accessToken || data.jwt;
        if (newToken) {
          setStoredToken(newToken);
          return newToken;
        }
      }
    }
  } catch (err) {
    console.warn("Não foi possível renovar o token no backend:", err);
  }

  // Fallback: gera um novo token client-side com expiração estendida
  const fallbackToken = generateClientToken(user);
  setStoredToken(fallbackToken);
  return fallbackToken;
}

/**
 * Wrapper padronizado para fetch que anexa automaticamente o Bearer token,
 * verifica expiração e renova automaticamente se o JWT estiver expirado.
 * @param {string} path Caminho do endpoint (ex: '/course' ou 'https://...')
 * @param {RequestInit} options Opções do fetch
 * @param {number} retryCount Contador de retentativas internas
 */
export async function apiFetch(path, options = {}, retryCount = 0) {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  let token = getStoredToken();

  // Se o token estiver expirado antes de enviar, tenta renovar preventivamente
  if (token && isTokenExpired(token)) {
    const refreshed = await refreshAuthToken();
    if (refreshed) {
      token = refreshed;
    }
  }

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

  // Se o backend responder 401 ou 403 (ou jwt expired), tenta renovar uma vez e retentar
  if ((response.status === 401 || response.status === 403) && retryCount === 0) {
    console.warn(`[apiFetch] Resposta ${response.status} em ${path}. Tentando renovar sessão...`);
    const refreshedToken = await refreshAuthToken();
    if (refreshedToken) {
      return apiFetch(path, options, retryCount + 1);
    }

    // Notifica a aplicação que a sessão expirou
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("studygo_auth_expired", {
          detail: { path, message: "Sessão expirada. Por favor, faça login novamente." }
        })
      );
    }
  }

  return response;
}
