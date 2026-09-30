import React, { useState, useEffect, useCallback } from 'react';
import {
  Crown,
  Copy,
  CheckCircle2,
  Clock,
  ShieldCheck,
  X,
  AlertCircle,
  Smartphone,
  QrCode,
  RefreshCw,
  Zap
} from 'lucide-react';
import './PaymentModal.css';

// Chave PIX fictícia para demonstração
const PIX_KEY = 'pagamentos@studygo.com.br';
const PIX_KEY_DISPLAY = 'pagamentos@studygo.com.br';

// Tempo de expiração do PIX: 30 minutos em segundos
const EXPIRY_SECONDS = 30 * 60;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function PaymentModal({ isOpen, onClose, planData }) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(EXPIRY_SECONDS);
  const [expired, setExpired] = useState(false);
  const [activeStep, setActiveStep] = useState(null);
  const [paymentStep, setPaymentStep] = useState(0);

  const plan = planData || {
    name: 'Premium',
    price: 'R$ 49,90',
    period: '/mês',
    total: 'R$ 598,80',
    billing: 'anual'
  };

  // Countdown timer
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(EXPIRY_SECONDS);
      setExpired(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'studygo_payment_status' && e.newValue === 'paid') {
        setPaymentStep(2);
        setTimeout(() => {
          window.location.href = '/admin';
        }, 2000);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(PIX_KEY).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  }, []);

  const handleRefresh = () => {
    setTimeLeft(EXPIRY_SECONDS);
    setExpired(false);
  };

  if (!isOpen) return null;

  const progressPct = ((EXPIRY_SECONDS - timeLeft) / EXPIRY_SECONDS) * 100;
  const isUrgent = timeLeft < 5 * 60;

  return (
    <div className="pix-overlay" onClick={onClose}>
      <div className="pix-container" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="pix-header">
          <div className="pix-header-left">
            <div className="pix-brand-badge">
              <Zap size={14} />
              <span>PIX Instantâneo</span>
            </div>
            <h2 className="pix-title">{paymentStep === 0 ? 'Finalizar assinatura' : 'Ambiente Bancário'}</h2>
            <p className="pix-subtitle">
              {paymentStep === 0 ? 'Conclua o pagamento via PIX para ativar sua conta imediatamente.' : 'Confirme os dados para efetivar a transação.'}
            </p>
          </div>
          <button className="pix-close-btn" onClick={onClose} title="Fechar">
            <X size={20} />
          </button>
        </div>

        {paymentStep === 2 ? (
          <div className="pix-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '20px', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(50,188,173,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#32bcad' }}>
              <CheckCircle2 size={40} />
            </div>
            <div style={{ color: '#fff' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Pagamento Confirmado!</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                Redirecionando para o painel de administração...
              </p>
            </div>
          </div>
        ) : paymentStep === 0 ? (
          <>
            <div className="pix-body">
          {/* Left: QR Code + Chave */}
          <div className="pix-left-col">

            {/* Plan Summary */}
            <div className="pix-plan-card">
              <div className="pix-plan-icon">
                <Crown size={22} />
              </div>
              <div className="pix-plan-info">
                <span className="pix-plan-name">Plano {plan.name}</span>
                <span className="pix-plan-billing">Cobrança {plan.billing}</span>
              </div>
              <div className="pix-plan-price">
                <span className="pix-plan-amount">{plan.price}</span>
                <span className="pix-plan-period">{plan.period}</span>
              </div>
            </div>

            {/* Total */}
            <div className="pix-total-row">
              <span className="pix-total-label">Total cobrado agora</span>
              <span className="pix-total-value">{plan.total}</span>
            </div>

            {/* QR Code placeholder */}
            <div className={`pix-qr-wrapper ${expired ? 'expired' : ''}`}>
              {expired ? (
                <div className="pix-qr-expired">
                  <RefreshCw size={32} className="pix-qr-expired-icon" />
                  <p>QR Code expirado</p>
                  <button className="pix-refresh-btn" onClick={handleRefresh}>
                    Gerar novo código
                  </button>
                </div>
              ) : (
                <>
                  <div className="pix-qr-graphic">
                    <QrCode size={90} strokeWidth={1.2} className="pix-qr-icon" />
                    <div className="pix-qr-corner pix-qr-tl" />
                    <div className="pix-qr-corner pix-qr-tr" />
                    <div className="pix-qr-corner pix-qr-bl" />
                    <div className="pix-qr-corner pix-qr-br" />
                  </div>
                  <p className="pix-qr-label">Escaneie com seu app bancário</p>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="pix-or-divider">
              <span>ou use a chave PIX</span>
            </div>

            {/* PIX Key copy */}
            <div className="pix-key-box">
              <div className="pix-key-info">
                <span className="pix-key-type">E-mail</span>
                <span className="pix-key-value">{PIX_KEY_DISPLAY}</span>
              </div>
              <button
                className={`pix-copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
                disabled={expired}
              >
                {copied ? (
                  <><CheckCircle2 size={16} /><span>Copiado!</span></>
                ) : (
                  <><Copy size={16} /><span>Copiar</span></>
                )}
              </button>
            </div>

            {/* Timer */}
            <div className={`pix-timer ${isUrgent && !expired ? 'urgent' : ''} ${expired ? 'expired' : ''}`}>
              <Clock size={16} />
              <span>
                {expired
                  ? 'Código expirado'
                  : `Expira em ${formatTime(timeLeft)}`}
              </span>
              <div className="pix-timer-bar">
                <div
                  className="pix-timer-progress"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Instructions */}
          <div className="pix-right-col">
            <h3 className="pix-steps-title">
              <Smartphone size={18} />
              Como pagar em 3 passos
            </h3>

            <div className="pix-steps">
              {[
                {
                  n: 1,
                  title: 'Abra seu banco',
                  desc: 'Acesse o app do seu banco ou fintech e vá até a área PIX.'
                },
                {
                  n: 2,
                  title: 'Escaneie ou cole a chave',
                  desc: 'Use a câmera para escanear o QR Code ou cole a chave e-mail.'
                },
                {
                  n: 3,
                  title: 'Confirme e pronto!',
                  desc: 'Após o pagamento, sua conta será ativada automaticamente em instantes.'
                }
              ].map((step) => (
                <div
                  key={step.n}
                  className={`pix-step ${activeStep === step.n ? 'active' : ''}`}
                  onClick={() => setActiveStep(activeStep === step.n ? null : step.n)}
                >
                  <div className="pix-step-number">{step.n}</div>
                  <div className="pix-step-content">
                    <p className="pix-step-title">{step.title}</p>
                    <p className="pix-step-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Warning: inactive until payment */}
            <div className="pix-warning-box">
              <AlertCircle size={18} className="pix-warning-icon" />
              <div>
                <p className="pix-warning-title">Conta inativa até o pagamento</p>
                <p className="pix-warning-desc">
                  Seu acesso ao painel ficará bloqueado até a confirmação do
                  pagamento. Após o PIX ser processado, a ativação é automática e
                  imediata.
                </p>
              </div>
            </div>

            {/* Security badge */}
            <div className="pix-security-row">
              <ShieldCheck size={16} className="pix-security-icon" />
              <span>Transação protegida com criptografia de ponta a ponta</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pix-footer">
          <span className="pix-footer-note">
            Após o pagamento, aguarde até <strong>5 minutos</strong> para ativação automática.
            Dúvidas? <a href="mailto:suporte@studygo.com.br">suporte@studygo.com.br</a>
          </span>
          <button className="pix-confirm-btn" onClick={() => {
            setPaymentStep(1);
            localStorage.setItem('studygo_payment_status', 'pending');
            window.open('/bank-auth', '_blank');
          }}>
            Realizar Pagamento
          </button>
        </div>
        </>
        ) : paymentStep === 1 ? (
          <div className="pix-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '20px', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
              <Clock size={40} />
            </div>
            <div style={{ color: '#fff' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Aguardando Pagamento</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                Conclua o pagamento na nova aba que foi aberta no seu navegador.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
