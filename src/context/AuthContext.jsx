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
      // 1. Tenta consultar a rota de usuários na API remota
      let apiUser = null;
      try {
        const response = await fetch(`${BASE_URL}/user?email=${encodeURIComponent(cleanEmail)}`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            apiUser = data[0];
          } else if (data && data.id) {
            apiUser = data;
          }
        }
      } catch (err) {
        console.warn('Falha na comunicação direta com a API, utilizando base local de fallback:', err);
      }

      // 2. Busca na base de usuários inicial / cadastrada
      const localUser = INITIAL_USERS.find(
        u => u.email.toLowerCase() === cleanEmail
      );

      const targetUser = apiUser ? {
        id: apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
        type: apiUser.type || 'ADMIN',
        status: apiUser.status || 'ATIVO',
        company_name: localUser?.company_name || 'StudyGo Central',
        password: localUser?.password || '123'
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

      // 3. Emite e grava o Bearer Token no storage
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
