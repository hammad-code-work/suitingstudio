// src/components/common/Pagination.jsx
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Pagination.css';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const getPageNumbers = () => {
    const nums = [];
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= page - 1 && i <= page + 1)) {
        nums.push(i);
      } else if (nums[nums.length - 1] !== '...') {
        nums.push('...');
      }
    }
    return nums;
  };

  return (
    <div className="pagination">
      <button
        className="pagination__btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        <FiChevronLeft size={16} />
      </button>

      {getPageNumbers().map((num, i) =>
        num === '...' ? (
          <span key={`dots-${i}`} className="pagination__dots">...</span>
        ) : (
          <button
            key={num}
            className={`pagination__btn ${page === num ? 'pagination__btn--active' : ''}`}
            onClick={() => onPageChange(num)}
          >
            {num}
          </button>
        )
      )}

      <button
        className="pagination__btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
