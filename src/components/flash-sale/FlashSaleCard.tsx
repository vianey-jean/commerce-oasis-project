
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DynamicIcon } from '@/utils/iconLoader';
import FlashSaleTimer from './FlashSaleTimer';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface FlashSale {
  id: string;
  title: string;
  description: string;
  discount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  productIds: string[];
  createdAt: string;
  backgroundColor?: string;
  icon?: string;
  emoji?: string;
  order?: number;
}

interface FlashSaleCardProps {
  flashSale: FlashSale;
  index: number;
  timeLeft: TimeLeft;
  secureFlashSaleRoute: string;
}

const FlashSaleCard: React.FC<FlashSaleCardProps> = ({ 
  flashSale, 
  index, 
  timeLeft, 
  secureFlashSaleRoute 
}) => {
  const backgroundColor = flashSale.backgroundColor || '#dc2626';
  const iconName = flashSale.icon || 'Flame';
  const emoji = flashSale.emoji || '🔥';

  return (
    <motion.div
      key={flashSale.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden relative border-0 shadow-xl">
        <div 
          className="absolute inset-0 z-0" 
          style={{ backgroundColor }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiIC8+PC9zdmc+')] opacity-30" />

        <div className="p-6 md:p-8 relative z-10 text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-white/20 backdrop-blur rounded-full">
                  <DynamicIcon name={iconName} className="h-6 w-6 text-white animate-pulse" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{flashSale.title}</h2>
                <span className="text-2xl">{emoji}</span>
                <motion.span 
                  className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: [0.9, 1.05, 0.95, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 5 }}
                >
                  -{flashSale.discount}%
                </motion.span>
              </div>

              <p className="text-lg mb-6 text-white/90 max-w-xl">{flashSale.description}</p>

              <Button
                variant="secondary"
                className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-6 py-6 rounded-full shadow-lg hover:shadow-xl transition-all group"
                asChild
              >
                <Link to={`${secureFlashSaleRoute}?index=${index}`}>
                  <span>Voir les produits</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <FlashSaleTimer timeLeft={timeLeft} />
          </div>
        </div>

        {/* Éléments décoratifs animés */}
        <motion.div
          className="absolute top-4 right-4 bg-white/10 w-16 h-16 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-4 left-10 bg-yellow-500/20 w-20 h-20 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
      </Card>
    </motion.div>
  );
};

export default FlashSaleCard;
