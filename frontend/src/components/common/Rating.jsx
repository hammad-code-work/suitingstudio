// src/components/common/Rating.jsx
import React from 'react';
import { FiStar } from 'react-icons/fi';

const Rating = ({ value = 0, small = false }) => {
  const size = small ? 12 : 16;
  return (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={size}
          fill={star <= Math.round(value) ? '#f4a100' : 'transparent'}
          color={star <= Math.round(value) ? '#f4a100' : '#ccc'}
        />
      ))}
    </div>
  );
};

export default Rating;
