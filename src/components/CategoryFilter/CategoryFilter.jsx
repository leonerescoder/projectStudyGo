import React from 'react';

export const CATEGORIES_LIST = [
  { id: 'todos', name: 'Todos' },
  { id: 'ti', name: 'Tecnologia da Informação' },
  { id: 'design', name: 'Design' },
  { id: 'gestao', name: 'Gestão & Negócios' },
  { id: 'marketing', name: 'Marketing Digital' },
  { id: 'idiomas', name: 'Idiomas' }
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
            <span className="pill-text">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;
