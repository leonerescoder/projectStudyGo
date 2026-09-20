import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  X, 
  LogIn, 
  Eye, 
  EyeOff, 
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './LoginModal.css';

export function LoginModal() {
  const { isAuthModalOpen, closeAuthModal, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMessage(res.error);
      } else {
        setEmail('');
        setPassword('');
        closeAuthModal();
      }
    } catch (err) {
      setErrorMessage('Erro ao tentar autenticar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-modal-overlay" onClick={closeAuthModal}>
      <div className="login-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="login-modal-header">
          <div className="login-badge">
            <ShieldCheck size={20} className="login-badge-icon" />
            <span>Portal de Gestão</span>
          </div>
          <button className="login-close-btn" onClick={closeAuthModal} title="Fechar">
            <X size={20} />
          </button>
        </div>

        <div className="login-title-section">
          <h2>Entrar como Administrador ou Diretor</h2>
          <p>Informe seu e-mail institucional e senha para acessar os controles da plataforma.</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="login-error-alert">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label htmlFor="login-email">E-mail Institucional</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                id="login-email"
                type="email"
                placeholder="ex: vanessa.silva@studygo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="login-input-group">
            <div className="label-row">
              <label htmlFor="login-password">Senha de Acesso</label>
              <span className="password-hint">Padrão: 123</span>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            <LogIn size={18} />
            <span>{loading ? 'Autenticando...' : 'Entrar no Painel'}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
