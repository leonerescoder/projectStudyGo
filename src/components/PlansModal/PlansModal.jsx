import React, { useState } from 'react';
import { 
  Building2, 
  BarChart3, 
  Star, 
  Store, 
  Building, 
  Crown, 
  Check, 
  ShieldCheck, 
  Lock,
  X
} from 'lucide-react';
import './PlansModal.css';

export function PlansModal({ isOpen, onClose, onPlanSelect }) {
  const [isAnnual, setIsAnnual] = useState(false);

  if (!isOpen) return null;

  const handleSelectPlan = (planName) => {
    // You could pass the selected plan data if needed later
    onPlanSelect(planName);
  };

  return (
    <div className="plans-modal-overlay">
      <div className="plans-modal-container">
        <button className="plans-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="plans-modal-content">
          <div className="plans-header-section">
            <div className="plans-header-left">
              <span className="plans-badge">PLANOS E PREÇOS</span>
              <h2 className="plans-title">
                Mais oportunidades para<br />
                o <span className="text-blue">seu negócio</span> crescer
              </h2>
              <p className="plans-subtitle">
                Escolha o plano ideal para a sua empresa, publique seus cursos, 
                conecte-se com mais alunos e fortaleça sua presença no StudyGo.
              </p>
              
              <div className="plans-toggle-container">
                <div className="plans-toggle">
                  <button 
                    className={`toggle-btn ${!isAnnual ? 'active' : ''}`}
                    onClick={() => setIsAnnual(false)}
                  >
                    Mensal
                  </button>
                  <button 
                    className={`toggle-btn ${isAnnual ? 'active' : ''}`}
                    onClick={() => setIsAnnual(true)}
                  >
                    Anual <span className="discount-badge">-20%</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="plans-header-right">
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <Building2 size={24} className="feature-icon" />
                </div>
                <p>Publique seus cursos e conquiste mais alunos</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <BarChart3 size={24} className="feature-icon" />
                </div>
                <p>Acompanhe resultados e métricas importantes</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <Star size={24} className="feature-icon" />
                </div>
                <p>Mais visibilidade para sua instituição</p>
              </div>
            </div>
          </div>

          <div className="plans-cards-container">
            {/* Plano Grátis */}
            <div className="plan-card">
              <div className="plan-icon-wrapper light-blue">
                <Store size={28} />
              </div>
              <h3>Plano Grátis</h3>
              <p className="plan-desc">Comece a presença digital da sua empresa com o essencial do StudyGo.</p>
              <div className="plan-price">
                <span className="currency">R$</span>
                <span className="amount">0,00</span>
                <span className="period">/mês</span>
              </div>
              <button 
                className="plan-btn outline"
                onClick={() => handleSelectPlan('gratis')}
              >
                Começar agora
              </button>
              <ul className="plan-features">
                <li><Check size={18} className="check-icon" /> Perfil da sua instituição</li>
                <li><Check size={18} className="check-icon" /> Até 3 cursos publicados</li>
                <li><Check size={18} className="check-icon" /> Categorias de interesse</li>
                <li><Check size={18} className="check-icon" /> Participação no ranking de instituições</li>
              </ul>
            </div>

            {/* Plano Profissional */}
            <div className="plan-card popular">
              <div className="popular-badge">Mais popular</div>
              <div className="plan-icon-wrapper blue">
                <Building size={28} />
              </div>
              <h3>Plano Profissional</h3>
              <p className="plan-desc">Expanda suas oportunidades e tenha mais destaque na plataforma.</p>
              <div className="plan-price">
                <span className="currency">R$</span>
                <span className="amount">{isAnnual ? '39,90' : '49,90'}</span>
                <span className="period">/mês</span>
              </div>
              <button 
                className="plan-btn solid"
                onClick={() => handleSelectPlan('profissional')}
              >
                Assinar agora
              </button>
              <ul className="plan-features">
                <li><Check size={18} className="check-icon" /> Até 15 cursos publicados</li>
                <li><Check size={18} className="check-icon" /> Destaque nas buscas da plataforma</li>
                <li><Check size={18} className="check-icon" /> Estatísticas básicas de visualizações</li>
                <li><Check size={18} className="check-icon" /> Perfil personalizado da sua empresa</li>
                <li><Check size={18} className="check-icon" /> Selo Profissional</li>
              </ul>
            </div>

            {/* Plano Premium */}
            <div className="plan-card">
              <div className="plan-icon-wrapper purple">
                <Crown size={28} />
              </div>
              <h3>Plano Premium</h3>
              <p className="plan-desc">Tenha o máximo de visibilidade e recursos para impulsionar o seu negócio.</p>
              <div className="plan-price">
                <span className="currency">R$</span>
                <span className="amount">{isAnnual ? '79,90' : '99,90'}</span>
                <span className="period">/mês</span>
              </div>
              <button 
                className="plan-btn outline"
                onClick={() => handleSelectPlan('premium')}
              >
                Assinar agora
              </button>
              <ul className="plan-features">
                <li><Check size={18} className="check-icon purple" /> Cursos ilimitados</li>
                <li><Check size={18} className="check-icon purple" /> Maior destaque nas buscas</li>
                <li><Check size={18} className="check-icon purple" /> Estatísticas avançadas de desempenho</li>
                <li><Check size={18} className="check-icon purple" /> Destaque na página inicial</li>
                <li><Check size={18} className="check-icon purple" /> Selo Premium</li>
              </ul>
            </div>
          </div>

          <div className="plans-footer">
            <div className="security-info">
              <div className="security-icon-wrapper">
                <ShieldCheck size={28} className="security-icon" />
              </div>
              <div>
                <h4>Pagamento seguro e confiável</h4>
                <p>Seus dados estão protegidos com a mais alta tecnologia de segurança.</p>
              </div>
            </div>
            <div className="payment-methods">
              <span className="method-text">VISA</span>
              <span className="method-text" style={{color: '#eb001b'}}>mastercard</span>
              <span className="method-text">elo</span>
              <span className="method-text" style={{color: '#32bcad'}}>pix</span>
            </div>
            <div className="encryption-info">
              <Lock size={16} />
              <span>Transações protegidas<br/>com criptografia</span>
            </div>
          </div>
        </div>

        <div className="plans-bottom-banner">
          <div className="bottom-banner-content">
            <h3>Pronto para levar sua instituição para o próximo nível?</h3>
            <p>Escolha o plano que mais combina com as suas necessidades e comece agora mesmo!</p>
            <button className="bottom-banner-btn" onClick={onClose}>
              Ver todos os planos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
