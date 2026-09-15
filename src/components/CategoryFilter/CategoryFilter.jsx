import React from 'react';

export const CATEGORIES_LIST = [
  { id: 'todos', name: 'Todos', icon: '🌐' },
  { id: 'ti', name: 'Tecnologia da Informação', icon: '💻' },
  { id: 'design', name: 'Design', icon: '🎨' },
  { id: 'gestao', name: 'Gestão & Negócios', icon: '📊' },
  { id: 'marketing', name: 'Marketing Digital', icon: '🚀' },
  { id: 'idiomas', name: 'Idiomas', icon: '🗣️' }
];

export function CategoryFilter({ activeCategory, onSelectCategory }) {
  return (
    <div className="category-filter-bar">
      {CATEGORIES_LIST.map((cat) => {
        const isActive = activeCategory === cat.name;
        return (
          <button
            key={cat.id}
            type="button"
            className={`filter-pill-btn ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.name)}
          >
            <span className="pill-icon">{cat.icon}</span>
            <span className="pill-text">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;
