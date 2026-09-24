import React, { useRef } from 'react';

export function CategoryFilter({ categories = [], activeCategory, onSelectCategory }) {
  const filterBarRef = useRef(null);
  const dragState = useRef({ isDragging: false, startX: 0, startScrollLeft: 0, moved: false });
  const allCategories = [{ id: 'all', name: 'Todos', icon: '🌐' }, ...categories];

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    dragState.current = { isDragging: true, startX: event.clientX, startScrollLeft: filterBarRef.current.scrollLeft, moved: false };
  };

  const handlePointerMove = (event) => {
    if (!dragState.current.isDragging) return;
    const distance = event.clientX - dragState.current.startX;
    if (Math.abs(distance) > 4) {
      dragState.current.moved = true;
      if (!filterBarRef.current.hasPointerCapture(event.pointerId)) filterBarRef.current.setPointerCapture(event.pointerId);
    }
    filterBarRef.current.scrollLeft = dragState.current.startScrollLeft - distance;
  };

  const handlePointerUp = (event) => {
    dragState.current.isDragging = false;
    if (filterBarRef.current.hasPointerCapture(event.pointerId)) filterBarRef.current.releasePointerCapture(event.pointerId);
  };

  const handleCategoryClick = (name) => {
    if (dragState.current.moved) {
      dragState.current.moved = false;
      return;
    }
    onSelectCategory(name);
  };

  return (
    <div ref={filterBarRef} className="category-filter-bar" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
      {allCategories.map((cat) => {
        const isActive = activeCategory === cat.name;
        return (
          <button
            key={cat.id}
            type="button"
            className={`filter-pill-btn ${isActive ? 'active' : ''}`}
            onClick={() => handleCategoryClick(cat.name)}
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
