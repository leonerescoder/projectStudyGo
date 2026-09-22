import React from 'react';
import { Building2, CheckCircle2 } from 'lucide-react';
import './CompanyBanner.css';

export function CompanyBanner({ onRegisterClick }) {
  const benefits = [
    'Publique seus cursos',
    'Gerencie inscrições',
    'Acompanhe interessados',
    'Divulgue sua instituição'
  ];

  return (
    <div className="company-banner-container">
      <div className="company-banner-content">
        <div className="company-banner-left">
          <div className="company-banner-header">
            <div className="company-banner-icon-bg">
              <Building2 size={28} className="company-banner-icon" />
            </div>
            <div className="company-banner-titles">
              <h3>Sua empresa no StudyGo</h3>
              <p>Encontre alunos e divulgue seus cursos para milhares de estudantes.</p>
            </div>
          </div>
          <button 
            className="company-banner-btn"
            onClick={onRegisterClick}
          >
            Cadastrar minha empresa
          </button>
        </div>

        <div className="company-banner-right">
          <ul className="company-banner-benefits">
            {benefits.map((benefit, index) => (
              <li key={index} className="company-benefit-item">
                <CheckCircle2 size={18} className="company-benefit-icon" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
