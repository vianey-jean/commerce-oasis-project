
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, CreditCard, Plus, Check } from 'lucide-react';
import { savedCardsAPI, SavedCard } from '@/services/savedCardsAPI';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

interface SavedCardsManagerProps {
  onCardSelect: (card: SavedCard | null) => void;
  selectedCardId?: string;
  showAddNew?: boolean;
}

const SavedCardsManager: React.FC<SavedCardsManagerProps> = ({
  onCardSelect,
  selectedCardId,
  showAddNew = true
}) => {
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSavedCards();
    }
  }, [user]);

  const fetchSavedCards = async () => {
    try {
      const response = await savedCardsAPI.getUserCards();
      setSavedCards(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des cartes:', error);
      setSavedCards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) return;
    
    try {
      await savedCardsAPI.deleteCard(cardId);
      setSavedCards(cards => cards.filter(card => card.id !== cardId));
      toast.success('Carte supprimée avec succès');
      
      if (selectedCardId === cardId) {
        onCardSelect(null);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de la carte');
    }
  };

  const handleSetDefault = async (cardId: string) => {
    try {
      await savedCardsAPI.setDefaultCard(cardId);
      setSavedCards(cards => 
        cards.map(card => ({
          ...card,
          isDefault: card.id === cardId
        }))
      );
      toast.success('Carte définie comme carte par défaut');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getCardIcon = (cardType: string) => {
    return <CreditCard className="h-5 w-5" />;
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Cartes enregistrées</h3>
      
      {savedCards.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucune carte enregistrée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedCards.map((card) => (
            <Card
              key={card.id}
              className={`cursor-pointer transition-all ${
                selectedCardId === card.id 
                  ? 'ring-2 ring-red-500 bg-red-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => onCardSelect(card)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getCardIcon(card.cardType)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          •••• •••• •••• {card.lastFourDigits}
                        </span>
                        {card.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Par défaut
                          </Badge>
                        )}
                        {selectedCardId === card.id && (
                          <Check className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {card.cardholderName} • {card.expiryMonth}/{card.expiryYear}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!card.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(card.id);
                        }}
                        className="text-xs"
                      >
                        Définir par défaut
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCard(card.id);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {showAddNew && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onCardSelect(null)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Utiliser une nouvelle carte
        </Button>
      )}
    </div>
  );
};

export default SavedCardsManager;
