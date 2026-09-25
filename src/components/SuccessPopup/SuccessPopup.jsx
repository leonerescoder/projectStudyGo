import React, { useEffect } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  GraduationCap, 
  Layers, 
  Building2, 
  UserPlus, 
  X, 
  ArrowRight,
  Plus
} from 'lucide-react';
import './SuccessPopup.css';

/**
 * SuccessPopup - Pop-up intuitivo, moderno e animado de confirmação de cadastro
 * 
 * @param {boolean} isOpen - Controla a visibilidade do modal
 * @param {string} type - 'course' | 'category' | 'school' | 'director'
 * @param {string} title - Título principal do pop-up
 * @param {string} subtitle - Mensagem descritiva
 * @param {object} details - Detalhes do item cadastrado (name, category, school, badge, etc.)
 * @param {function} onClose - Callback ao fechar
 * @param {function} onAction - Callback opcional para "Cadastrar Outro"
 * @param {string} actionLabel - Rótulo do botão de ação secundária
 * @param {number} autoCloseTime - Tempo em ms para fechar automaticamente (padrão 4000ms, 0 desativa)
 */
export function SuccessPopup({
  isOpen,
  type = 'course',
  title = 'Salvo com Sucesso!',
  subtitle = 'Os dados foram gravados e sincronizados com o banco de dados.',
  details = null,
  onClose,
  onAction = null,
  actionLabel = null,
  autoCloseTime = 4000
}) {
  useEffect(() => {
    if (!isOpen || autoCloseTime <= 0) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, autoCloseTime);
    return () => clearTimeout(timer);
  }, [isOpen, autoCloseTime, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'course':
        return <GraduationCap size={28} className="popup-type-icon" />;
      case 'category':
        return <Layers size={28} className="popup-type-icon" />;
      case 'school':
      case 'company':
        return <Building2 size={28} className="popup-type-icon" />;
      case 'director':
        return <UserPlus size={28} className="popup-type-icon" />;
      default:
        return <Sparkles size={28} className="popup-type-icon" />;
    }
  };

  const getEntityLabel = () => {
    switch (type) {
      case 'course': return 'Curso';
      case 'category': return 'Categoria';
      case 'school':
      case 'company': return 'Instituição de Ensino';
      case 'director': return 'Diretor';
      default: return 'Registro';
    }
  };

  return (
    <div className="success-popup-overlay" onClick={onClose}>
      <div className="success-popup-card" onClick={(e) => e.stopPropagation()}>
        {/* Glow de fundo */}
        <div className="popup-glow-bg"></div>

        {/* Botão fechar topo */}
        <button className="popup-close-x" onClick={onClose} title="Fechar confirmação">
          <X size={18} />
        </button>

        {/* Círculo com checkmark animado */}
        <div className="popup-icon-wrapper">
          <div className="popup-icon-ring"></div>
          <div className="popup-icon-ring-outer"></div>
          <div className="popup-icon-inner">
            <CheckCircle2 size={44} className="popup-check-icon" />
          </div>
          <div className="popup-badge-corner">
            {getIcon()}
          </div>
        </div>

        {/* Cabeçalho */}
        <div className="popup-header-content">
          <span className="popup-type-pill">
            <span className="pill-dot"></span>
            {getEntityLabel()} Salvo
          </span>
          <h3 className="popup-title">{title}</h3>
          <p className="popup-subtitle">{subtitle}</p>
        </div>

        {/* Card de Detalhes do Registro Salvo */}
        {details && (
          <div className="popup-details-box">
            {details.name && (
              <div className="detail-item detail-item-main">
                <span className="detail-label">Nome:</span>
                <strong className="detail-val-highlight">{details.name}</strong>
              </div>
            )}
            
            <div className="detail-grid">
              {details.category && (
                <div className="detail-item">
                  <span className="detail-label">Categoria:</span>
                  <span className="detail-tag detail-cat-tag">🏷️ {details.category}</span>
                </div>
              )}
              {details.school && (
                <div className="detail-item">
                  <span className="detail-label">Escola:</span>
                  <span className="detail-tag detail-school-tag">🏫 {details.school}</span>
                </div>
              )}
              {details.ranking !== undefined && (
                <div className="detail-item">
                  <span className="detail-label">Ranking:</span>
                  <span className="detail-tag detail-rank-tag">🎯 {details.ranking} pts</span>
                </div>
              )}
              {details.status && (
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className="detail-tag detail-status-tag">🟢 {details.status}</span>
                </div>
              )}
              {details.cnpj && (
                <div className="detail-item">
                  <span className="detail-label">CNPJ:</span>
                  <span className="detail-val-mono">{details.cnpj}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Barra de progresso do timer automático */}
        {autoCloseTime > 0 && (
          <div className="popup-progress-track">
            <div 
              className="popup-progress-fill" 
              style={{ animationDuration: `${autoCloseTime}ms` }}
            ></div>
          </div>
        )}

        {/* Ações */}
        <div className="popup-actions">
          {onAction && actionLabel && (
            <button 
              type="button" 
              className="popup-btn-secondary" 
              onClick={() => {
                if (onClose) onClose();
                onAction();
              }}
            >
              <Plus size={16} />
              <span>{actionLabel}</span>
            </button>
          )}
          <button type="button" className="popup-btn-primary" onClick={onClose}>
            <span>Continuar</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessPopup;
