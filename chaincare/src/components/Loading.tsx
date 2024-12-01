import React from 'react';

const CenteredLoader = ({ size = 50, color = "#3B82F6" }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md">
      <div
        className="animate-spin rounded-full border-4 border-transparent"
        style={{
          borderTopColor: color,
          width: `${size}px`,
          height: `${size}px`,
        }}
      />
    </div>
  );
};

export default CenteredLoader;
