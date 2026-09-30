import React from 'react';
import { ShieldCheck } from 'lucide-react';
import './BankAuth.css';

function BankAuth() {
  const handleConfirm = () => {
    localStorage.setItem('studygo_payment_status', 'paid');
    window.close();
  };

  return (
    <div className="bank-auth-container">
      <div className="bank-auth-card">
        <div className="bank-auth-icon">
          <ShieldCheck size={48} />
        </div>
        <h2>Ambiente Bancário</h2>
        <p>Confirme os dados para efetivar a transação via PIX para <strong>StudyGo Plataforma Educacional</strong>.</p>
        <div className="bank-auth-details">
          <p><strong>Valor:</strong> R$ 598,80</p>
        </div>
        <button className="bank-confirm-btn" onClick={handleConfirm}>
          Confirmar Pagamento
        </button>
      </div>
    </div>
  );
}

export default BankAuth;
