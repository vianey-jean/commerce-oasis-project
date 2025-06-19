
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FlashSaleNavigationProps {
  currentIndex: number;
  totalCount: number;
  onNavigate: (index: number) => void;
}

const FlashSaleNavigation: React.FC<FlashSaleNavigationProps> = ({
  currentIndex,
  totalCount,
  onNavigate
}) => {
  if (totalCount <= 1) return null;

  return (
    <div className="flex justify-center items-center mb-6">
      <button
        onClick={() => onNavigate(currentIndex - 1)}
        disabled={currentIndex === 0}
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed mr-4"
      >
        <ChevronLeft className="h-8 w-8 text-blue-800 font-bold" />
      </button>
      
      <div className="text-center">
        <p className="text-sm text-red-900 mb-1 font-bold">
          VENTE FLASH : {currentIndex + 1} sur {totalCount}
        </p>
        <div className="flex justify-center items-center space-x-2">
          {Array.from({ length: totalCount }, (_, index) => (
            <button
              key={index}
              onClick={() => onNavigate(index)} 
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      
      <button
        onClick={() => onNavigate(currentIndex + 1)}
        disabled={currentIndex === totalCount - 1}
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed ml-4"
      >
        <ChevronRight className="h-8 w-8 text-blue-800 font-bold" />
      </button>
    </div>
  );
};

export default FlashSaleNavigation;
