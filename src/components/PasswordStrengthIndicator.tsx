
import React, { useEffect } from 'react';
import { Check, X, Shield, Sparkles } from 'lucide-react';

interface PasswordStrengthCheckerProps {
  password: string;
  onValidityChange?: (isValid: boolean) => void;
}

/**
 * Composant qui vérifie la force du mot de passe
 * et affiche les critères requis avec un design moderne
 */
const PasswordStrengthChecker: React.FC<PasswordStrengthCheckerProps> = ({ 
  password, 
  onValidityChange 
}) => {
  // Vérifie les différents critères du mot de passe
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const hasMinLength = password.length >= 8;
  
  // Détermine si tous les critères sont remplis
  const isPasswordValid = hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar && hasMinLength;
  
  // Notifie le parent quand la validité change
  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(isPasswordValid);
    }
  }, [isPasswordValid, onValidityChange]);
  
  return (
    <div className="mt-3 p-4 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-slate-200/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Shield className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-700">Sécurité du mot de passe</span>
        <Sparkles className="w-4 h-4 text-indigo-500" />
      </div>
      
      <div className="space-y-2">
        <div className={`flex items-center gap-2 text-xs transition-all duration-300 ${hasMinLength ? 'text-emerald-600' : 'text-gray-500'}`}>
          <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
            hasMinLength 
              ? 'bg-emerald-500 shadow-lg shadow-emerald-200' 
              : 'bg-gray-200'
          }`}>
            {hasMinLength ? (
              <Check className="w-2.5 h-2.5 text-white" />
            ) : (
              <X className="w-2.5 h-2.5 text-gray-400" />
            )}
          </div>
          <span className={hasMinLength ? 'font-medium' : ''}>Au moins 8 caractères</span>
        </div>
        
        <div className={`flex items-center gap-2 text-xs transition-all duration-300 ${hasUpperCase ? 'text-emerald-600' : 'text-gray-500'}`}>
          <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
            hasUpperCase 
              ? 'bg-emerald-500 shadow-lg shadow-emerald-200' 
              : 'bg-gray-200'
          }`}>
            {hasUpperCase ? (
              <Check className="w-2.5 h-2.5 text-white" />
            ) : (
              <X className="w-2.5 h-2.5 text-gray-400" />
            )}
          </div>
          <span className={hasUpperCase ? 'font-medium' : ''}>Au moins une majuscule</span>
        </div>
        
        <div className={`flex items-center gap-2 text-xs transition-all duration-300 ${hasLowerCase ? 'text-emerald-600' : 'text-gray-500'}`}>
          <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
            hasLowerCase 
              ? 'bg-emerald-500 shadow-lg shadow-emerald-200' 
              : 'bg-gray-200'
          }`}>
            {hasLowerCase ? (
              <Check className="w-2.5 h-2.5 text-white" />
            ) : (
              <X className="w-2.5 h-2.5 text-gray-400" />
            )}
          </div>
          <span className={hasLowerCase ? 'font-medium' : ''}>Au moins une minuscule</span>
        </div>
        
        <div className={`flex items-center gap-2 text-xs transition-all duration-300 ${hasNumber ? 'text-emerald-600' : 'text-gray-500'}`}>
          <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
            hasNumber 
              ? 'bg-emerald-500 shadow-lg shadow-emerald-200' 
              : 'bg-gray-200'
          }`}>
            {hasNumber ? (
              <Check className="w-2.5 h-2.5 text-white" />
            ) : (
              <X className="w-2.5 h-2.5 text-gray-400" />
            )}
          </div>
          <span className={hasNumber ? 'font-medium' : ''}>Au moins un chiffre</span>
        </div>
        
        <div className={`flex items-center gap-2 text-xs transition-all duration-300 ${hasSpecialChar ? 'text-emerald-600' : 'text-gray-500'}`}>
          <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
            hasSpecialChar 
              ? 'bg-emerald-500 shadow-lg shadow-emerald-200' 
              : 'bg-gray-200'
          }`}>
            {hasSpecialChar ? (
              <Check className="w-2.5 h-2.5 text-white" />
            ) : (
              <X className="w-2.5 h-2.5 text-gray-400" />
            )}
          </div>
          <span className={hasSpecialChar ? 'font-medium' : ''}>Au moins un caractère spécial</span>
        </div>
      </div>
      
      {/* Barre de progression */}
      <div className="mt-3 pt-3 border-t border-gray-200/50">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-gray-600">Force:</span>
          <span className={`text-xs font-medium ${
            isPasswordValid 
              ? 'text-emerald-600' 
              : password.length > 0 
                ? 'text-orange-600' 
                : 'text-gray-500'
          }`}>
            {isPasswordValid ? 'Excellent' : password.length > 0 ? 'Faible' : 'Aucun'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-500 ${
              isPasswordValid 
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 w-full' 
                : password.length > 0 
                  ? 'bg-gradient-to-r from-orange-400 to-red-500 w-1/3' 
                  : 'w-0'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthChecker;
