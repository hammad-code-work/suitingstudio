// src/components/common/SearchBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <FiSearch
          size={16}
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
        />
        <input
          autoFocus
          className="form-input"
          style={{ paddingLeft: '42px' }}
          type="text"
          placeholder="Search products (e.g. 'embroidered dress', 'kids suit')..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary btn-sm">Search</button>
      {onClose && (
        <button type="button" onClick={onClose} style={{ padding: '8px', color: 'var(--color-text-muted)' }}>
          <FiX size={20} />
        </button>
      )}
    </form>
  );
};

export default SearchBar;
