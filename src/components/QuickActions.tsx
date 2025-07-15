
import React from 'react';
import { Plus, Search, Download, Upload, Settings, Bell, Crown, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface QuickActionsProps {
  onAction: (actionId: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const actions: QuickAction[] = [
    {
      id: 'add',
      label: 'Nouveau RDV',
      icon: <Plus className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
      description: 'Créer un rendez-vous'
    },
    {
      id: 'search',
      label: 'Rechercher',
      icon: <Search className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      description: 'Trouver un rendez-vous'
    },
    {
      id: 'export',
      label: 'Exporter',
      icon: <Download className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      description: 'Télécharger l\'agenda'
    },
    {
      id: 'import',
      label: 'Importer',
      icon: <Upload className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500',
      description: 'Charger des données'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: <Settings className="w-5 h-5" />,
      color: 'from-gray-500 to-slate-500',
      description: 'Configuration'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      color: 'from-yellow-500 to-amber-500',
      description: 'Gérer les alertes'
    }
  ];

  return (
    <div className="luxury-card rounded-3xl p-6 premium-shadow-xl border-0 glow-effect">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 premium-gradient rounded-2xl flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold luxury-text-gradient">Actions Rapides Premium</h3>
          <p className="text-sm text-muted-foreground font-medium">Accès instantané aux fonctionnalités</p>
        </div>
        <Crown className="w-6 h-6 text-primary ml-auto" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Button
            key={action.id}
            onClick={() => onAction(action.id)}
            className="group relative h-20 p-4 luxury-card hover:premium-shadow-lg transition-all duration-300 rounded-2xl border-2 border-primary/20 hover:border-primary/40 premium-hover glow-effect overflow-hidden"
            variant="ghost"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex flex-col items-center gap-3 relative z-10">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white premium-shadow group-hover:scale-110 transition-transform duration-300`}>
                {action.icon}
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-primary group-hover:luxury-text-gradient transition-all duration-300">
                  {action.label}
                </div>
                <div className="text-xs text-muted-foreground group-hover:text-primary/70 transition-colors duration-300">
                  {action.description}
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
