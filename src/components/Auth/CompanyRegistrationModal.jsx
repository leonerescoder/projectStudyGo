import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  BookOpen, 
  Target,
  Calendar,
  X,
  AlertCircle,
  CheckCircle2,
  Send
} from 'lucide-react';
import { BASE_URL } from '../../API/apiClient';
import { useAuth } from '../../context/AuthContext';
import './CompanyRegistrationModal.css';

export function CompanyRegistrationModal({ isOpen, onClose }) {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    foundation: '',
    places: '',
    fundaments: '',
    methods: ''
  });
  
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

  const formatCNPJ = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCnpjChange = (e) => {
    const formatted = formatCNPJ(e.target.value);
    setFormData(prev => ({ ...prev, cnpj: formatted }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!user || !user.id || !token) {
      setErrorMessage('Erro: Você precisa estar logado como Diretor para cadastrar uma empresa. (Token ausente)');
      return;
    }

    setLoading(true);

    try {
      // Formata a data para ISO-8601 (Prisma DateTime)
      let isoDate = formData.foundation;
      if (formData.foundation) {
        isoDate = new Date(formData.foundation).toISOString();
      }
      
      // Remove a máscara do CNPJ (deixa apenas os números)
      const rawCnpj = formData.cnpj.replace(/\D/g, '');

      const payload = {
        name: formData.name,
        cnpj: rawCnpj,
        foundation: isoDate,
        places: formData.places,
        fundaments: formData.fundaments,
        methods: formData.methods,
        ownerId: user.id
      };

      console.log('Enviando payload (Company):', payload);

      const response = await fetch(`${BASE_URL}/companie`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errData = {};
        try {
          errData = await response.json();
        } catch (e) {
          console.error(`Erro ao fazer parse do JSON (Status ${response.status}). Provavelmente a rota está errada.`);
          if (response.status === 404) {
            throw new Error(`A rota da API para salvar empresas não foi encontrada (404). Verifique se é /companie ou /company.`);
          }
        }
        
        console.error('Erro detalhado do servidor (Company):', errData);
        
        let errorMessage = 'Erro ao realizar o cadastro da empresa. Verifique os dados fornecidos.';
        
        if (errData.error && typeof errData.error === 'string') {
          errorMessage = errData.error;
        } else if (errData.message && typeof errData.message === 'string') {
          errorMessage = errData.message;
        } else if (errData.errors && Array.isArray(errData.errors)) {
          errorMessage = errData.errors.map(e => e.message || JSON.stringify(e)).join(', ');
        } else if (response.status !== 200 && response.status !== 201) {
          errorMessage = `Erro do servidor: Status ${response.status}. ` + errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      setSuccessMessage('Empresa cadastrada com sucesso! Bem-vindo à plataforma.');
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
        setFormData({ name: '', cnpj: '', foundation: '', places: '', fundaments: '', methods: '' });
      }, 3000);
      
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comp-modal-overlay" onClick={onClose}>
      <div className="comp-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="comp-modal-header">
          <div className="comp-badge">
            <Building2 size={20} className="comp-badge-icon" />
            <span>Cadastro da Empresa</span>
          </div>
          <button className="comp-close-btn" onClick={onClose} title="Fechar">
            <X size={20} />
          </button>
        </div>

        <div className="comp-title-section">
          <h2>Registre sua Instituição</h2>
          <p>Você foi autenticado como Diretor. Agora, insira os dados da sua escola ou empresa.</p>
        </div>

        {errorMessage && (
          <div className="comp-alert error">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="comp-alert success">
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="comp-form">
          
          <div className="comp-input-group">
            <label htmlFor="comp-name">Nome da Empresa</label>
            <div className="comp-input-with-icon">
              <Building2 size={18} className="comp-field-icon" />
              <input
                id="comp-name"
                name="name"
                type="text"
                placeholder="Ex: Senac São Carlos"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="comp-row-group">
            <div className="comp-input-group">
              <label htmlFor="comp-cnpj">CNPJ</label>
              <div className="comp-input-with-icon">
                <Target size={18} className="comp-field-icon" />
                <input
                  id="comp-cnpj"
                  name="cnpj"
                  type="text"
                  placeholder="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={handleCnpjChange}
                  maxLength="18"
                  required
                />
              </div>
            </div>

            <div className="comp-input-group">
              <label htmlFor="comp-foundation">Data de Fundação</label>
              <div className="comp-input-with-icon">
                <Calendar size={18} className="comp-field-icon" />
                <input
                  id="comp-foundation"
                  name="foundation"
                  type="date"
                  value={formData.foundation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="comp-input-group">
            <label htmlFor="comp-places">Locais de Atuação</label>
            <div className="comp-input-with-icon">
              <MapPin size={18} className="comp-field-icon" />
              <input
                id="comp-places"
                name="places"
                type="text"
                placeholder="Ex: São Paulo, SP - São Carlos"
                value={formData.places}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="comp-input-group">
            <label htmlFor="comp-fundaments">Fundamentos</label>
            <div className="comp-input-with-icon">
              <BookOpen size={18} className="comp-field-icon" />
              <input
                id="comp-fundaments"
                name="fundaments"
                type="text"
                placeholder="Ex: Educação profissional de excelência"
                value={formData.fundaments}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="comp-input-group">
            <label htmlFor="comp-methods">Métodos de Ensino</label>
            <div className="comp-input-with-icon">
              <Target size={18} className="comp-field-icon" />
              <input
                id="comp-methods"
                name="methods"
                type="text"
                placeholder="Ex: Presencial e EAD com laboratórios práticos"
                value={formData.methods}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="comp-submit-btn" disabled={loading}>
            <Send size={18} />
            <span>{loading ? 'Salvando Instituição...' : 'Finalizar Cadastro da Empresa'}</span>
          </button>
        </form>

      </div>
    </div>
  );
}
