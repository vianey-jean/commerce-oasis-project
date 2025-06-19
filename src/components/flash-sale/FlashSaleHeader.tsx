
import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { DynamicIcon } from '@/utils/iconLoader';
import FlashSaleTimer from './FlashSaleTimer';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface FlashSaleData {
  id: string;
  title: string;
  description: string;
  discount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  backgroundColor?: string;
  icon?: string;
  emoji?: string;
  order?: number;
}

interface FlashSaleHeaderProps {
  flashSale: FlashSaleData;
  timeLeft: TimeLeft;
}

const FlashSaleHeader: React.FC<FlashSaleHeaderProps> = ({ flashSale, timeLeft }) => {
  const backgroundColor = flashSale.backgroundColor || '#dc2626';
  const iconName = flashSale.icon || 'Flame';
  const emoji = flashSale.emoji || '🔥';

  const timeUnits = [
    { label: 'Jours', value: timeLeft.days },
    { label: 'Heures', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-white rounded-lg p-8 mb-8 relative overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiIC8+PC9zdmc+')] opacity-30" />
      
      <div className="text-center relative z-10">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="p-2 bg-white/20 backdrop-blur rounded-full">
            <DynamicIcon name={iconName} className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold">{flashSale.title}</h1>
          <span className="text-2xl">{emoji}</span>
          <span className="bg-yellow-400 text-black px-4 py-2 rounded-full text-lg font-bold">
            -{flashSale.discount}% DE PROMOS
          </span>
        </div>
        
        <p className="text-xl mb-6 opacity-90">{flashSale.description}</p>
        
        <div className="flex justify-center items-center space-x-2 mb-4">
          <Clock className="h-5 w-5" />
          <span className="text-lg font-medium">Se termine dans:</span>
        </div>
        
        <div className="flex justify-center space-x-4">
          {timeUnits.map((time, index) => (
            <motion.div
              key={time.label}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                key={time.value}
                initial={{ rotateX: -90 }}
                animate={{ rotateX: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-black/30 backdrop-blur rounded-lg px-4 py-3 min-w-[70px] mb-2"
              >
                <div className="text-2xl font-bold">
                  {time.value.toString().padStart(2, '0')}
                </div>
              </motion.div>
              <div className="text-sm opacity-80">{time.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FlashSaleHeader;
