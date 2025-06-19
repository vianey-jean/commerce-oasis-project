
import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface FlashSaleTimerProps {
  timeLeft: TimeLeft;
}

const FlashSaleTimer: React.FC<FlashSaleTimerProps> = ({ timeLeft }) => {
  const timeUnits = [
    { label: 'Jours', value: timeLeft.days },
    { label: 'Heures', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds }
  ];

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full">
        <Clock className="h-5 w-5" />
        <span className="text-sm font-medium">Se termine dans :</span>
      </div>

      <div className="flex space-x-2">
        {timeUnits.map((unit, unitIndex) => (
          <motion.div
            key={unit.label}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: unitIndex * 0.1 }}
            className="text-center"
          >
            <motion.div
              key={`${unit.label}-${unit.value}`}
              initial={{ rotateX: -90 }}
              animate={{ rotateX: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-black/30 backdrop-blur-md rounded-lg px-3 py-2 min-w-[60px] mb-1 border border-white/10"
            >
              <div className="text-xl font-bold">
                {unit.value.toString().padStart(2, '0')}
              </div>
            </motion.div>
            <div className="text-xs opacity-80">{unit.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FlashSaleTimer;
