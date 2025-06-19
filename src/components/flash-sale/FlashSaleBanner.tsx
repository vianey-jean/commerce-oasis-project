
import React, { useState, useEffect } from 'react';
import { flashSaleAPI } from '@/services/flashSaleAPI';
import { getSecureRoute } from '@/services/secureIds';
import FlashSaleCard from './FlashSaleCard';
import FlashSaleLoadingSkeleton from './FlashSaleLoadingSkeleton';

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

const FlashSaleBanner: React.FC = () => {
  const [timeLeftMap, setTimeLeftMap] = useState<{[key: string]: TimeLeft}>({});
  const [expiredSales, setExpiredSales] = useState<Set<string>>(new Set());
  const [activeFlashSales, setActiveFlashSales] = useState<FlashSale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFlashSaleData = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 Récupération des ventes flash actives via API...');
        
        const response = await flashSaleAPI.getActiveAll();
        
        if (response.data && response.data.length > 0) {
          console.log('✅ Ventes flash actives trouvées:', response.data);
          const sortedFlashSales = response.data.sort((a, b) => (a.order || 999) - (b.order || 999));
          setActiveFlashSales(sortedFlashSales);
        } else {
          console.log('ℹ️ Aucune vente flash active');
          setActiveFlashSales([]);
        }
        setIsLoading(false);
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log('ℹ️ Aucune vente flash active trouvée');
          setActiveFlashSales([]);
          setIsLoading(false);
        } else if (error.response?.status === 429) {
          console.log('⚠️ Rate limiting atteint, réessai dans 30 secondes');
          setTimeout(fetchFlashSaleData, 30000);
          return;
        } else {
          console.error('❌ Erreur lors du chargement des ventes flash:', error);
          setActiveFlashSales([]);
          setIsLoading(false);
        }
      }
    };

    fetchFlashSaleData();
    const interval = setInterval(fetchFlashSaleData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeFlashSales.length === 0) return;

    const calculateTimeLeft = () => {
      const newTimeLeftMap: {[key: string]: TimeLeft} = {};
      const newExpiredSales = new Set<string>();

      activeFlashSales.forEach(sale => {
        const endTime = new Date(sale.endDate).getTime();
        const now = new Date().getTime();
        const diff = endTime - now;

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          newTimeLeftMap[sale.id] = { days, hours, minutes, seconds };
        } else {
          newTimeLeftMap[sale.id] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
          newExpiredSales.add(sale.id);
        }
      });

      setTimeLeftMap(newTimeLeftMap);
      setExpiredSales(newExpiredSales);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [activeFlashSales]);

  if (isLoading) {
    return <FlashSaleLoadingSkeleton />;
  }

  if (activeFlashSales.length === 0) {
    return null;
  }

  const activeSales = activeFlashSales.filter(sale => !expiredSales.has(sale.id));

  if (activeSales.length === 0) {
    return null;
  }

  const secureFlashSaleRoute = getSecureRoute('/flash-sale');

  return (
    <div className="my-6 space-y-4">
      {activeSales.map((flashSale, index) => {
        const timeLeft = timeLeftMap[flashSale.id] || { days: 0, hours: 0, minutes: 0, seconds: 0 };

        return (
          <FlashSaleCard
            key={flashSale.id}
            flashSale={flashSale}
            index={index}
            timeLeft={timeLeft}
            secureFlashSaleRoute={secureFlashSaleRoute}
          />
        );
      })}
    </div>
  );
};

export default FlashSaleBanner;
