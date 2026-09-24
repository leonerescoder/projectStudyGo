import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  PlusCircle, 
  ChevronDown, 
  Layers, 
  X, 
  Check, 
  HelpCircle,
  Tag
} from 'lucide-react';
import { 
  normalizeCategoryName, 
  findCategoryMatch, 
  cleanCategoryDisplay, 
  getGlobalCategories,
  CATEGORIES_UPDATE_EVENT 
} from '../../utils/categoryService';
import './CategorySmartInput.css';

/**
 * Componente Inteligente de Seleção e Criação de Categorias de Cursos
 * 
 * Atende às Fases 2, 3, 4, 5, 6, 7, 11 e 12:
 * - Autocomplete inteligente ao digitar
 * - Normalização instantânea de strings
 * - Detecção de equivalência exata (evita duplicatas)
 * - Detecção de categorias semanticamente semelhantes
 * - Decisão rápida: [Usar Existente] ou [Cadastrar Nova]
 * - Compartilhamento global entre todos os administradores e diretores
 */
export function CategorySmartInput({
  value = '',
  onChange,
  onSelectCategory,
  disabled = false,
  placeholder = "Digite ou escolha uma área/categoria (ex: Tecnologia, Gastronomia...)"
}) {
  const [inputValue, setInputValue] = useState(value || '');
  const [globalCategories, setGlobalCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [matchStatus, setMatchStatus] = useState(null);
  const [selectedCategoryObj, setSelectedCategoryObj] = useState(null);
  const [showAllList, setShowAllList] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Carrega categorias globais e escuta atualizações do sistema
  useEffect(() => {
    let isMounted = true;
    async function loadCats() {
      const cats = await getGlobalCategories();
      if (isMounted) {
        setGlobalCategories(cats);
      }
    }
    loadCats();

    const handleUpdate = () => loadCats();
    window.addEventListener(CATEGORIES_UPDATE_EVENT, handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener(CATEGORIES_UPDATE_EVENT, handleUpdate);
    };
  }, []);

  // Sincroniza com prop externa 'value'
  useEffect(() => {
    setInputValue(value || '');
    if (value && globalCategories.length > 0) {
      const match = findCategoryMatch(value, globalCategories);
      if (match.exactMatch) {
        setSelectedCategoryObj(match.exactMatch);
        setMatchStatus(match);
      } else {
        setMatchStatus(match);
      }
    } else if (!value) {
      setSelectedCategoryObj(null);
      setMatchStatus(null);
    }
  }, [value, globalCategories]);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
        setShowAllList(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Atualiza ao digitar no input
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setIsDropdownOpen(true);

    if (onChange) onChange(val);

    const match = findCategoryMatch(val, globalCategories);
    setMatchStatus(match);

    if (match.exactMatch) {
      setSelectedCategoryObj(match.exactMatch);
      if (onSelectCategory) onSelectCategory(match.exactMatch);
    } else {
      setSelectedCategoryObj(null);
    }
  };

  // Seleciona uma categoria existente
  const handleSelectExisting = (category) => {
    setInputValue(category.name);
    setSelectedCategoryObj(category);
    setIsDropdownOpen(false);
    setShowAllList(false);

    if (onChange) onChange(category.name);
    if (onSelectCategory) onSelectCategory(category);
  };

  // Confirma o uso do texto digitado como nova categoria inédita
  const handleConfirmNewCategory = () => {
    const clean = cleanCategoryDisplay(inputValue);
    setIsDropdownOpen(false);
    setShowAllList(false);
    if (onChange) onChange(clean);
  };

  // Limpa o campo
  const handleClear = () => {
    setInputValue('');
    setSelectedCategoryObj(null);
    setMatchStatus(null);
    if (onChange) onChange('');
    if (inputRef.current) inputRef.current.focus();
  };

  // Filtragem ao vivo para a lista suspensa
  const searchFilter = inputValue.trim().toLowerCase();
  const filteredSuggestions = globalCategories.filter(cat => {
    if (!searchFilter) return true;
    const normSearch = normalizeCategoryName(searchFilter);
    const catNorm = cat.nome_normalizado || normalizeCategoryName(cat.name);
    return (
      cat.name.toLowerCase().includes(searchFilter) ||
      catNorm.includes(normSearch) ||
      (cat.description && cat.description.toLowerCase().includes(searchFilter))
    );
  });

  return (
    <div className="category-smart-wrapper" ref={containerRef}>
      <div className={`category-smart-input-box ${isDropdownOpen ? 'focused' : ''} ${selectedCategoryObj ? 'has-selection' : ''}`}>
        <div className="input-icon-left">
          {selectedCategoryObj ? (
            <CheckCircle2 size={18} className="icon-success" />
          ) : (
            <Search size={18} className="icon-search" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsDropdownOpen(true)}
          disabled={disabled}
          placeholder={placeholder}
          className="category-smart-input"
          autoComplete="off"
        />

        {inputValue && !disabled && (
          <button
            type="button"
            className="btn-clear-cat"
            onClick={handleClear}
            title="Limpar campo"
          >
            <X size={15} />
          </button>
        )}

        <button
          type="button"
          className="btn-toggle-dropdown"
          onClick={() => {
            setShowAllList(prev => !prev);
            setIsDropdownOpen(prev => !prev);
          }}
          title="Ver todas as categorias cadastradas"
        >
          <ChevronDown size={17} className={`arrow-icon ${isDropdownOpen ? 'open' : ''}`} />
        </button>
      </div>

      {/* PAINEL DE FEEDBACK EM TEMPO REAL: DETECÇÃO / EQUIVALÊNCIA / SEMELHANÇA */}
      {inputValue.trim() && matchStatus && (
        <div className="category-detection-banner">
          {/* CASO 1: CATEGORIA EXATA / EQUIVALENTE ENCONTRADA */}
          {matchStatus.status === 'EXACT_MATCH' && matchStatus.exactMatch && (
            <div className="match-alert alert-exact">
              <div className="alert-content">
                <CheckCircle2 size={16} className="alert-icon" />
                <div>
                  <strong>Categoria já existente no sistema:</strong>
                  <span className="badge-cat-highlight">
                    {matchStatus.exactMatch.name} (ID: #{matchStatus.exactMatch.id})
                  </span>
                  <p className="alert-subtext">
                    O curso será vinculado automaticamente a esta categoria global, sem gerar duplicidades.
                  </p>
                </div>
              </div>
              {inputValue !== matchStatus.exactMatch.name && (
                <button
                  type="button"
                  className="btn-use-exact"
                  onClick={() => handleSelectExisting(matchStatus.exactMatch)}
                >
                  <Check size={14} /> Usar "{matchStatus.exactMatch.name}"
                </button>
              )}
            </div>
          )}

          {/* CASO 2: CATEGORIAS SEMELHANTES ENCONTRADAS */}
          {matchStatus.status === 'SIMILAR_MATCH' && matchStatus.similarMatches.length > 0 && (
            <div className="match-alert alert-similar">
              <div className="alert-content">
                <AlertTriangle size={16} className="alert-icon" />
                <div>
                  <strong>Encontramos categorias semelhantes já cadastradas:</strong>
                  <p className="alert-subtext">
                    Recomendamos reaproveitar uma categoria existente para manter a organização global.
                  </p>
                </div>
              </div>

              <div className="similar-pills-list">
                {matchStatus.similarMatches.slice(0, 4).map(simCat => (
                  <button
                    key={simCat.id}
                    type="button"
                    className="pill-similar-option"
                    onClick={() => handleSelectExisting(simCat)}
                  >
                    <Check size={13} />
                    <span>{simCat.name}</span>
                    <small className="pill-id">#{simCat.id}</small>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CASO 3: NENHUMA CORRESPONDÊNCIA -> CATEGORIA INÉDITA */}
          {matchStatus.status === 'NO_MATCH' && (
            <div className="match-alert alert-new">
              <div className="alert-content">
                <PlusCircle size={16} className="alert-icon" />
                <div>
                  <strong>Nova categoria inédita:</strong>
                  <span className="badge-new-cat">"{cleanCategoryDisplay(inputValue)}"</span>
                  <p className="alert-subtext">
                    Esta categoria será registrada globalmente e ficará disponível para todos os administradores e diretores.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DROPDOWN FLUTUANTE DE SUGESTÕES / TODAS AS CATEGORIAS */}
      {isDropdownOpen && (
        <div className="category-suggestions-dropdown">
          <div className="dropdown-header">
            <div className="header-label">
              <Layers size={14} />
              <span>Categorias Globais Disponíveis ({filteredSuggestions.length})</span>
            </div>
            <span className="header-tip">Clique para selecionar</span>
          </div>

          <div className="suggestions-list-scroll">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((cat) => {
                const isSelected = selectedCategoryObj?.id === cat.id;
                return (
                  <div
                    key={cat.id}
                    className={`suggestion-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectExisting(cat)}
                  >
                    <div className="suggestion-main">
                      <div className="item-title-row">
                        <span className="cat-name">{cat.name}</span>
                        <span className="cat-badge-id">ID: #{cat.id}</span>
                      </div>
                      {cat.description && (
                        <span className="cat-desc">{cat.description}</span>
                      )}
                    </div>
                    {isSelected && (
                      <div className="selected-indicator">
                        <Check size={16} />
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="no-suggestions-msg">
                <HelpCircle size={18} />
                <p>Nenhuma categoria encontrada com esse termo.</p>
                <button
                  type="button"
                  className="btn-create-typed"
                  onClick={handleConfirmNewCategory}
                >
                  <PlusCircle size={15} /> Cadastrar "{inputValue.trim()}" como nova categoria
                </button>
              </div>
            )}
          </div>

          {/* RODAPÉ DO DROPDOWN */}
          <div className="dropdown-footer">
            <Tag size={13} />
            <span>Categorias são <strong>compartilhadas por todos os administradores e diretores</strong>.</span>
          </div>
        </div>
      )}

      {/* TAGS RÁPIDAS DE CATEGORIAS POPULARES PARA SELEÇÃO EM 1 CLIQUE */}
      {!disabled && globalCategories.length > 0 && (
        <div className="quick-category-tags">
          <span className="quick-tags-title">Sugestões rápidas:</span>
          <div className="tags-container">
            {globalCategories.slice(0, 6).map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`quick-tag-btn ${selectedCategoryObj?.id === cat.id ? 'active' : ''}`}
                onClick={() => handleSelectExisting(cat)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CategorySmartInput;
