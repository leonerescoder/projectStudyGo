import React, { useState } from 'react';
import {
  Building2,
  User,
  Mail,
  CreditCard,
  Calendar,
  Lock,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus,
  CheckCircle2
} from 'lucide-react';
import { BASE_URL } from '../../API/apiClient';
import { useAuth } from '../../context/AuthContext';
import { SuccessPopup } from '../SuccessPopup/SuccessPopup';
import './DirectorRegistrationModal.css';

export function DirectorRegistrationModal({ isOpen, onClose, onSuccessRegistration }) {
  const { login } = useAuth();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [savedDirectorDetails, setSavedDirectorDetails] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    dateOfBirth: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCpfChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formatted }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      // Formata a data para ISO-8601 (Prisma DateTime)
      let isoDate = formData.dateOfBirth;
      if (formData.dateOfBirth) {
        isoDate = new Date(formData.dateOfBirth).toISOString();
      }

      // Remove a máscara do CPF (deixa apenas os números)
      const rawCpf = formData.cpf.replace(/\D/g, '');

      const payload = {
        name: formData.name,
        cpf: rawCpf,
        email: formData.email,
        birthDate: isoDate, // Conforme o schema.prisma (o Prisma mapeia internamente para birth_date)
        password: formData.password,
        type: 'DIRECTOR',
        status: 'ATIVO'
      };

      console.log('Enviando payload:', payload);

      const response = await fetch(`${BASE_URL}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('Erro detalhado do servidor:', errData);

        let errorMessage = 'Erro ao realizar o cadastro. Verifique os dados fornecidos.';

        if (errData.error && typeof errData.error === 'string') {
          errorMessage = errData.error;
        } else if (errData.message && typeof errData.message === 'string') {
          errorMessage = errData.message;
        } else if (errData.errors && Array.isArray(errData.errors)) {
          // Se for um array de erros de validação (ex: Zod)
          errorMessage = errData.errors.map(e => e.message || JSON.stringify(e)).join(', ');
        }

        throw new Error(errorMessage);
      }

      setSuccessMessage('Cadastro concluído com sucesso!');
      setSavedDirectorDetails({
        name: formData.name,
        status: 'ATIVO'
      });
      setShowSuccessPopup(true);

      // Faz o login automático
      const loginResponse = await login(formData.email, formData.password);

      if (!loginResponse.success) {
        throw new Error('Cadastro realizado, mas falha ao fazer login automático. Por favor, faça o login manualmente.');
      }

      setTimeout(() => {
        setFormData({ name: '', cpf: '', email: '', dateOfBirth: '', password: '' });
      }, 500);

    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dir-modal-overlay" onClick={onClose}>
      <div className="dir-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="dir-modal-header">
          <div className="dir-badge">
            <Building2 size={20} className="dir-badge-icon" />
            <span>Cadastro de Diretor</span>
          </div>
          <button className="dir-close-btn" onClick={onClose} title="Fechar">
            <X size={20} />
          </button>
        </div>

        <div className="dir-title-section">
          <h2>Crie sua conta de gestor</h2>
          <p>Preencha os dados abaixo para ser o diretor e cadastrar sua empresa na plataforma.</p>
        </div>

        {errorMessage && (
          <div className="dir-alert error">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="dir-alert success">
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="dir-form">

          <div className="dir-input-group">
            <label htmlFor="name">Nome Completo</label>
            <div className="input-with-icon">
              <User size={18} className="field-icon" />
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Ex: Vanessa Silva"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="dir-row-group">
            <div className="dir-input-group">
              <label htmlFor="cpf">CPF</label>
              <div className="input-with-icon">
                <CreditCard size={18} className="field-icon" />
                <input
                  id="cpf"
                  name="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleCpfChange}
                  maxLength="14"
                  required
                />
              </div>
            </div>

            <div className="dir-input-group">
              <label htmlFor="dateOfBirth">Data de Nascimento</label>
              <div className="input-with-icon">
                <Calendar size={18} className="field-icon" />
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="dir-input-group">
            <label htmlFor="email">E-mail Institucional</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="vanessa.silva@suaempresa.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="dir-input-group">
            <label htmlFor="password">Senha</label>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Crie uma senha forte"
                value={formData.password}
                onChange={handleChange}
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

          <button 
            type="submit" 
            className={`dir-submit-btn ${successMessage ? 'dir-submit-btn-success' : ''}`} 
            disabled={loading || !!successMessage}
          >
            {loading ? (
              <>
                <span className="spinner-mini"></span>
                <span>Cadastrando...</span>
              </>
            ) : successMessage ? (
              <>
                <CheckCircle2 size={20} className="btn-success-check-icon" />
                <span>✓ Salvo com sucesso!</span>
              </>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Finalizar Cadastro</span>
              </>
            )}
          </button>
        </form>

      </div>

      <SuccessPopup
        isOpen={showSuccessPopup}
        type="director"
        title="Diretor Cadastrado com Sucesso!"
        subtitle="Sua conta de Diretor foi criada e autenticada. Você já tem acesso total ao painel administrativo."
        details={savedDirectorDetails}
        onClose={() => {
          setShowSuccessPopup(false);
          setSuccessMessage('');
          if (onSuccessRegistration) {
            onSuccessRegistration();
          } else {
            onClose();
          }
        }}
      />
    </div>
  );
}
