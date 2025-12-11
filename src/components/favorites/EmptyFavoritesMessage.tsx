/**
 * @fileoverview Composant d'affichage pour favoris vides
 * 
 * Ce composant affiche un message moderne et animé lorsque la liste
 * de favoris est vide.
 * 
 * @version 1.0.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag, Star, Sparkles, ArrowRight, TrendingUp, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Affiche un message stylisé pour les favoris vides
 */
const EmptyFavoritesMessage: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { duration: 0.5, ease: "backOut", delay: 0.2 }
    }
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  };

  const heartBeat = {
    scale: [1, 1.1, 1],
    transition: { duration: 1.5, repeat: Infinity }
  };

  return (
    <motion.div 
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 dark:from-rose-950/30 dark:via-pink-950/30 dark:to-fuchsia-950/30 border border-rose-200/50 dark:border-rose-800/50 shadow-xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-pink-400/20 to-fuchsia-400/20 rounded-full blur-3xl" />
        
        {/* Floating hearts */}
        <motion.div 
          className="absolute top-16 left-16 opacity-20"
          animate={{ y: [-5, 5, -5], rotate: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Heart className="h-10 w-10 text-rose-500 fill-rose-500" />
        </motion.div>
        <motion.div 
          className="absolute top-32 right-24 opacity-15"
          animate={{ y: [5, -5, 5], rotate: [5, -5, 5] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Heart className="h-8 w-8 text-pink-500 fill-pink-500" />
        </motion.div>
        <motion.div 
          className="absolute bottom-24 left-32 opacity-15"
          animate={{ y: [3, -3, 3], rotate: [0, 10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        >
          <Heart className="h-6 w-6 text-fuchsia-500 fill-fuchsia-500" />
        </motion.div>
        <motion.div 
          className="absolute bottom-16 right-16 opacity-20"
          animate={{ y: [-3, 3, -3], rotate: [0, -10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity }}
        >
          <Star className="h-10 w-10 text-yellow-500 fill-yellow-500" />
        </motion.div>
      </div>

      <div className="relative py-16 px-8 text-center">
        {/* Icon animé */}
        <motion.div 
          className="mb-8"
          variants={iconVariants}
        >
          <motion.div 
            className="relative inline-flex"
            animate={floatingAnimation}
          >
            <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-500 p-6 rounded-3xl shadow-2xl">
              <motion.div animate={heartBeat}>
                <Heart className="h-12 w-12 text-white" />
              </motion.div>
            </div>
            <motion.div 
              className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-full shadow-lg"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4 text-white" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Titre */}
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Votre liste de favoris est vide
        </motion.h2>

        {/* Description */}
        <motion.p 
          className="text-neutral-600 dark:text-neutral-300 mb-8 max-w-lg mx-auto text-lg leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Explorez notre collection et cliquez sur le cœur pour sauvegarder vos produits préférés
        </motion.p>

        {/* Suggestions */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link 
            to="/nouveautes"
            className="group bg-white/60 dark:bg-neutral-900/40 rounded-2xl p-4 border border-rose-200/50 dark:border-rose-800/50 hover:border-rose-400 dark:hover:border-rose-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <Sparkles className="h-8 w-8 text-rose-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Nouveautés</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Découvrez les dernières arrivées</p>
          </Link>
          <Link 
            to="/populaires"
            className="group bg-white/60 dark:bg-neutral-900/40 rounded-2xl p-4 border border-pink-200/50 dark:border-pink-800/50 hover:border-pink-400 dark:hover:border-pink-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <TrendingUp className="h-8 w-8 text-pink-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Tendances</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Les produits les plus aimés</p>
          </Link>
          <Link 
            to="/promotions"
            className="group bg-white/60 dark:bg-neutral-900/40 rounded-2xl p-4 border border-fuchsia-200/50 dark:border-fuchsia-800/50 hover:border-fuchsia-400 dark:hover:border-fuchsia-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <Gift className="h-8 w-8 text-fuchsia-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Promotions</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Offres exceptionnelles</p>
          </Link>
        </motion.div>

        {/* Bouton */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button 
            asChild 
            size="lg"
            className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 hover:from-rose-600 hover:via-pink-600 hover:to-fuchsia-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl px-10 py-6 h-auto text-lg font-semibold"
          >
            <Link to="/" className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Explorer nos produits
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmptyFavoritesMessage;
