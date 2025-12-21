import React, { useState, useEffect } from 'react';
import { RDV, RDVFormData } from '@/types/rdv';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { AlertTriangle, Calendar, Clock, User, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RdvFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RDVFormData) => Promise<void>;
  rdv?: RDV | null;
  defaultDate?: string;
  defaultTime?: string;
  conflicts?: RDV[];
}

const RdvForm: React.FC<RdvFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  rdv,
  defaultDate,
  defaultTime,
  conflicts = [],
}) => {
  const [formData, setFormData] = useState<RDVFormData>({
    titre: '',
    description: '',
    clientNom: '',
    clientTelephone: '',
    date: defaultDate || new Date().toISOString().split('T')[0],
    heureDebut: defaultTime || '09:00',
    heureFin: '10:00',
    lieu: '',
    statut: 'planifie',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (rdv) {
      setFormData({
        titre: rdv.titre,
        description: rdv.description || '',
        clientNom: rdv.clientNom,
        clientTelephone: rdv.clientTelephone || '',
        date: rdv.date,
        heureDebut: rdv.heureDebut,
        heureFin: rdv.heureFin,
        lieu: rdv.lieu || '',
        statut: rdv.statut,
        notes: rdv.notes || '',
      });
    } else {
      setFormData({
        titre: '',
        description: '',
        clientNom: '',
        clientTelephone: '',
        date: defaultDate || new Date().toISOString().split('T')[0],
        heureDebut: defaultTime || '09:00',
        heureFin: defaultTime ? addHour(defaultTime) : '10:00',
        lieu: '',
        statut: 'planifie',
        notes: '',
      });
    }
  }, [rdv, defaultDate, defaultTime, isOpen]);

  function addHour(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const newHours = (hours + 1) % 24;
    return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  const handleChange = (field: keyof RDVFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titre.trim() || !formData.clientNom.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {rdv ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
          </DialogTitle>
        </DialogHeader>

        {conflicts.length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Attention : {conflicts.length} conflit(s) détecté(s) sur ce créneau !
              {conflicts.map(c => (
                <div key={c.id} className="text-sm mt-1">
                  • {c.titre} ({c.heureDebut} - {c.heureFin})
                </div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titre">Titre *</Label>
            <Input
              id="titre"
              value={formData.titre}
              onChange={(e) => handleChange('titre', e.target.value)}
              placeholder="Ex: Consultation client"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientNom" className="flex items-center gap-1">
                <User className="h-3 w-3" /> Client *
              </Label>
              <Input
                id="clientNom"
                value={formData.clientNom}
                onChange={(e) => handleChange('clientNom', e.target.value)}
                placeholder="Nom du client"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientTelephone">Téléphone</Label>
              <Input
                id="clientTelephone"
                value={formData.clientTelephone}
                onChange={(e) => handleChange('clientTelephone', e.target.value)}
                placeholder="+261 34 00 000 00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Date *
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heureDebut" className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> Début *
              </Label>
              <Input
                id="heureDebut"
                type="time"
                value={formData.heureDebut}
                onChange={(e) => handleChange('heureDebut', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heureFin" className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> Fin *
              </Label>
              <Input
                id="heureFin"
                type="time"
                value={formData.heureFin}
                onChange={(e) => handleChange('heureFin', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lieu" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Lieu
            </Label>
            <Input
              id="lieu"
              value={formData.lieu}
              onChange={(e) => handleChange('lieu', e.target.value)}
              placeholder="Adresse ou lieu du rendez-vous"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="statut">Statut</Label>
            <Select
              value={formData.statut}
              onValueChange={(value) => handleChange('statut', value as RDVFormData['statut'])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planifie">Planifié</SelectItem>
                <SelectItem value="confirme">Confirmé</SelectItem>
                <SelectItem value="annule">Annulé</SelectItem>
                <SelectItem value="termine">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Description du rendez-vous..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Notes supplémentaires..."
              rows={2}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : rdv ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RdvForm;
