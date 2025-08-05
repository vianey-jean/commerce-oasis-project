
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Fonction pour faire défiler vers le haut
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Gérer la visibilité du bouton selon le scroll
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          className={`
            fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50
            w-12 h-12 rounded-full p-0
            bg-gradient-to-r from-primary to-purple-600 
            hover:from-primary/90 hover:to-purple-700
            shadow-lg hover:shadow-xl
            transition-all duration-300 ease-in-out
            hover:scale-110
            group
          `}
          aria-label="Retour en haut"
        >
          <ArrowUp className="w-5 h-5 text-white group-hover:animate-bounce" />
        </Button>
      )}
    </>
  );
};

export default ScrollToTop;
