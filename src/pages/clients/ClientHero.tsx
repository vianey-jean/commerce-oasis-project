/**
 * ClientHero - Section héroïque de la page Clients (style Pointage glassmorphism)
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Users, Crown, Star, Sparkles, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const premiumBtnClass = "group relative overflow-hidden rounded-xl sm:rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:scale-105 px-4 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-semibold";
const mirrorShine = "absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500";

interface ClientHeroProps {
  clientCount: number;
  onAddClient: () => void;
}

const ClientHero: React.FC<ClientHeroProps> = ({ clientCount, onAddClient }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient matching pointage */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-fuchsia-500/5 to-blue-600/10 dark:from-violet-900/30 dark:via-fuchsia-900/20 dark:to-blue-900/30" />
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Stats row - glass cards like pointage */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {/* Total clients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="group relative overflow-hidden rounded-2xl bg-white/60 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5"
          >
            <div className={mirrorShine} />
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total Clients</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">{clientCount}</p>
              </div>
            </div>
          </motion.div>

          {/* Status actif */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="group relative overflow-hidden rounded-2xl bg-white/60 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5"
          >
            <div className={mirrorShine} />
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/25">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Clients Actifs</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">{clientCount}</p>
              </div>
            </div>
          </motion.div>

          {/* Statut premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="group relative overflow-hidden rounded-2xl bg-white/60 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-5"
          >
            <div className={mirrorShine} />
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg shadow-amber-500/25">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Statut</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">Premium</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action buttons - like pointage hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap gap-2 sm:gap-3"
        >
          <button
            onClick={onAddClient}
            className={`${premiumBtnClass} bg-gradient-to-r from-violet-500/90 to-purple-600/90 text-white border-violet-400/30 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30`}
          >
            <span className={mirrorShine} />
            <Plus className="w-4 h-4 mr-1.5 inline" />
            Nouveau Client
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientHero;
