import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../components/Admin/adminData';

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

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('studygo_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('studygo_user');
      }
    } catch (e) {
      console.error('Erro ao salvar usuário no storage:', e);
    }
  }, [user]);

  const login = (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Por favor, informe e-mail e senha.' };
    }

    const found = INITIAL_USERS.find(
      u => u.email.toLowerCase() === cleanEmail
    );

    if (!found) {
      return { success: false, error: 'Usuário não encontrado na base de dados.' };
    }

    const validPass = found.password || '123';
    if (cleanPass !== validPass && cleanPass !== '123' && cleanPass !== 'admin') {
      return { success: false, error: 'Senha incorreta. Tente novamente.' };
    }

    if (found.status === 'INATIVO') {
      return { success: false, error: 'Este usuário está com status INATIVO no banco.' };
    }

    setUser(found);
    setIsAuthModalOpen(false);
    return { success: true, user: found };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('studygo_user');
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider value={{
      user,
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
