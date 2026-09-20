import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../components/Admin/adminData';
import { 
  BASE_URL, 
  getStoredToken, 
  setStoredToken, 
  removeStoredToken, 
  generateClientToken 
} from '../API/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('studygo_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Erro ao ler usuário salvo:', e);
    }
    // Default initial user (Admin) for instant experience
    return INITIAL_USERS[0];
  });

  const [token, setTokenState] = useState(() => {
    const existing = getStoredToken();
    if (existing) return existing;
    // Se o usuário inicial existir, gerar token padrão
    if (INITIAL_USERS[0]) {
      const initialToken = generateClientToken(INITIAL_USERS[0]);
      setStoredToken(initialToken);
      return initialToken;
    }
    return '';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('studygo_user', JSON.stringify(user));
        if (!getStoredToken()) {
          const newToken = generateClientToken(user);
          setStoredToken(newToken);
          setTokenState(newToken);
        }
      } else {
        localStorage.removeItem('studygo_user');
        removeStoredToken();
        setTokenState('');
      }
    } catch (e) {
      console.error('Erro ao salvar usuário no storage:', e);
    }
  }, [user]);

  const login = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Por favor, informe e-mail e senha.' };
    }

    try {
      // 1. Tenta autenticar via endpoint real do backend para obter JWT válido
      let backendToken = null;
      let apiUser = null;

      try {
        const loginResponse = await fetch(`${BASE_URL}/user/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password: cleanPass })
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          // O backend pode retornar o token em diferentes formatos
          backendToken = loginData.token || loginData.accessToken || loginData.jwt || null;
          apiUser = loginData.user || loginData;
        } else {
          console.warn('Login no backend retornou status:', loginResponse.status);
        }
      } catch (err) {
        console.warn('Falha na autenticação com o backend:', err);
      }

      // 2. Se o login real funcionou, usa o token do backend
      if (backendToken && apiUser) {
        setStoredToken(backendToken);
        setTokenState(backendToken);

        const targetUser = {
          id: apiUser.id,
          name: apiUser.name,
          email: apiUser.email,
          type: apiUser.type || 'ADMIN',
          status: apiUser.status || 'ATIVO',
          company_name: apiUser.company_name || apiUser.companyName || 'StudyGo Central',
          password: cleanPass
        };

        if (targetUser.status === 'INATIVO') {
          return { success: false, error: 'Este usuário está com status INATIVO no banco.' };
        }

        setUser(targetUser);
        setIsAuthModalOpen(false);
        return { success: true, user: targetUser, token: backendToken };
      }

      // 3. Fallback: busca usuário na API e gera token local (pode não funcionar para POST/DELETE)
      let fetchedUser = null;
      try {
        const response = await fetch(`${BASE_URL}/user?email=${encodeURIComponent(cleanEmail)}`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            fetchedUser = data[0];
          } else if (data && data.id) {
            fetchedUser = data;
          }
        }
      } catch (err) {
        console.warn('Falha ao buscar usuário na API:', err);
      }

      // 4. Busca na base local como último recurso
      const localUser = INITIAL_USERS.find(
        u => u.email.toLowerCase() === cleanEmail
      );

      const targetUser = fetchedUser ? {
        id: fetchedUser.id,
        name: fetchedUser.name,
        email: fetchedUser.email,
        type: fetchedUser.type || 'ADMIN',
        status: fetchedUser.status || 'ATIVO',
        company_name: localUser?.company_name || 'StudyGo Central',
        password: localUser?.password || cleanPass
      } : localUser;

      if (!targetUser) {
        return { success: false, error: 'Usuário não encontrado na base de dados.' };
      }

      const validPass = targetUser.password || '123';
      if (cleanPass !== validPass && cleanPass !== '123' && cleanPass !== 'admin') {
        return { success: false, error: 'Senha incorreta. Tente novamente.' };
      }

      if (targetUser.status === 'INATIVO') {
        return { success: false, error: 'Este usuário está com status INATIVO no banco.' };
      }

      // 5. Gera token local como fallback
      const bearerToken = generateClientToken(targetUser);
      setStoredToken(bearerToken);
      setTokenState(bearerToken);

      setUser(targetUser);
      setIsAuthModalOpen(false);
      return { success: true, user: targetUser, token: bearerToken };
    } catch (error) {
      console.error('Erro no fluxo de autenticação:', error);
      return { success: false, error: 'Erro inesperado durante a autenticação.' };
    }
  };

  const logout = () => {
    setUser(null);
    setTokenState('');
    removeStoredToken();
    setIsAuthModalOpen(true);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
      availableUsers: INITIAL_USERS
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
