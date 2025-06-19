
import React from 'react';

const FlashSaleLoadingSkeleton: React.FC = () => {
  return (
    <div className="my-6 space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-xl"></div>
      ))}
    </div>
  );
};

export default FlashSaleLoadingSkeleton;
