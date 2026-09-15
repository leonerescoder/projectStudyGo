import React from 'react';
import { Building2, BookOpen, Trophy, Award } from 'lucide-react';

const STATS_DATA = [
  {
    id: 1,
    category: 'INSTITUIÇÕES',
    title: 'Mais de 100 escolas',
    icon: <Building2 size={22} />
  },
  {
    id: 2,
    category: 'VARIEDADE',
    title: 'Milhares de cursos',
    icon: <BookOpen size={22} />
  },
  {
    id: 3,
    category: 'QUALIDADE',
    title: 'Ranking das melhores escolas',
    icon: <Trophy size={22} />
  },
  {
    id: 4,
    category: 'GARANTIA',
    title: 'Certificados reconhecidos',
    icon: <Award size={22} />
  }
];

export function Features() {
  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-grid">
          {STATS_DATA.map((stat) => (
            <div key={stat.id} className="feature-card">
              <div className="feature-icon-container">
                {stat.icon}
              </div>
              <div className="feature-info">
                <span className="feature-category-label">{stat.category}</span>
                <span className="feature-title-text">{stat.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
