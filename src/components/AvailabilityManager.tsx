
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Plus, Trash2, Save, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TimeSlot {
  id: string;
  day: number; // 0-6 (Dimanche à Samedi)
  startTime: string;
  endTime: string;
  enabled: boolean;
}

interface AvailabilitySettings {
  defaultDuration: number;
  bufferTime: number;
  maxAdvanceBooking: number;
  minAdvanceBooking: number;
  timeSlots: TimeSlot[];
}

const DAYS_OF_WEEK = [
  'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
];

const AvailabilityManager: React.FC = () => {
  const [settings, setSettings] = useState<AvailabilitySettings>({
    defaultDuration: 60,
    bufferTime: 15,
    maxAdvanceBooking: 30,
    minAdvanceBooking: 24,
    timeSlots: [
      { id: '1', day: 1, startTime: '09:00', endTime: '12:00', enabled: true },
      { id: '2', day: 1, startTime: '14:00', endTime: '18:00', enabled: true },
      { id: '3', day: 2, startTime: '09:00', endTime: '12:00', enabled: true },
      { id: '4', day: 2, startTime: '14:00', endTime: '18:00', enabled: true },
      { id: '5', day: 3, startTime: '09:00', endTime: '12:00', enabled: true },
      { id: '6', day: 3, startTime: '14:00', endTime: '18:00', enabled: true },
      { id: '7', day: 4, startTime: '09:00', endTime: '12:00', enabled: true },
      { id: '8', day: 4, startTime: '14:00', endTime: '18:00', enabled: true },
      { id: '9', day: 5, startTime: '09:00', endTime: '12:00', enabled: true },
    ]
  });

  const [newSlot, setNewSlot] = useState({
    day: 1,
    startTime: '09:00',
    endTime: '17:00'
  });

  useEffect(() => {
    // Charger les paramètres depuis localStorage
    const saved = localStorage.getItem('availabilitySettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('availabilitySettings', JSON.stringify(settings));
    toast.success('Paramètres de disponibilité sauvegardés', {
      description: 'Vos horaires ont été mis à jour avec succès'
    });
  };

  const addTimeSlot = () => {
    if (newSlot.startTime >= newSlot.endTime) {
      toast.error('Erreur', {
        description: 'L\'heure de fin doit être après l\'heure de début'
      });
      return;
    }

    const slot: TimeSlot = {
      id: Date.now().toString(),
      day: newSlot.day,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      enabled: true
    };

    setSettings(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, slot]
    }));

    toast.success('Créneau ajouté', {
      description: `${DAYS_OF_WEEK[newSlot.day]} de ${newSlot.startTime} à ${newSlot.endTime}`
    });
  };

  const removeTimeSlot = (id: string) => {
    setSettings(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter(slot => slot.id !== id)
    }));
    toast.success('Créneau supprimé');
  };

  const toggleSlot = (id: string) => {
    setSettings(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map(slot =>
        slot.id === id ? { ...slot, enabled: !slot.enabled } : slot
      )
    }));
  };

  const updateSlot = (id: string, field: keyof TimeSlot, value: any) => {
    setSettings(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map(slot =>
        slot.id === id ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const getSlotsByDay = (day: number) => {
    return settings.timeSlots.filter(slot => slot.day === day);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Gestion des disponibilités</h2>
          <p className="text-muted-foreground">Configurez vos horaires de travail et créneaux disponibles</p>
        </div>
        <Button onClick={saveSettings} className="gap-2">
          <Save className="w-4 h-4" />
          Sauvegarder
        </Button>
      </div>

      {/* Paramètres généraux */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Paramètres généraux
          </CardTitle>
          <CardDescription>
            Configurez les règles de base pour vos rendez-vous
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultDuration">Durée par défaut (min)</Label>
              <Input
                id="defaultDuration"
                type="number"
                value={settings.defaultDuration}
                onChange={(e) => setSettings(prev => ({ ...prev, defaultDuration: parseInt(e.target.value) || 60 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bufferTime">Temps de pause (min)</Label>
              <Input
                id="bufferTime"
                type="number"
                value={settings.bufferTime}
                onChange={(e) => setSettings(prev => ({ ...prev, bufferTime: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAdvance">Réservation max (jours)</Label>
              <Input
                id="maxAdvance"
                type="number"
                value={settings.maxAdvanceBooking}
                onChange={(e) => setSettings(prev => ({ ...prev, maxAdvanceBooking: parseInt(e.target.value) || 30 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minAdvance">Réservation min (heures)</Label>
              <Input
                id="minAdvance"
                type="number"
                value={settings.minAdvanceBooking}
                onChange={(e) => setSettings(prev => ({ ...prev, minAdvanceBooking: parseInt(e.target.value) || 24 }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ajouter un nouveau créneau */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Ajouter un créneau
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label>Jour</Label>
              <Select value={newSlot.day.toString()} onValueChange={(value) => setNewSlot(prev => ({ ...prev, day: parseInt(value) }))}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Heure de début</Label>
              <Input
                type="time"
                value={newSlot.startTime}
                onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-32"
              />
            </div>
            <div className="space-y-2">
              <Label>Heure de fin</Label>
              <Input
                type="time"
                value={newSlot.endTime}
                onChange={(e) => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-32"
              />
            </div>
            <Button onClick={addTimeSlot} className="gap-2">
              <Plus className="w-4 h-4" />
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Créneaux existants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Créneaux configurés
          </CardTitle>
          <CardDescription>
            {settings.timeSlots.filter(slot => slot.enabled).length} créneaux actifs sur {settings.timeSlots.length} configurés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {DAYS_OF_WEEK.map((dayName, dayIndex) => {
              const daySlots = getSlotsByDay(dayIndex);
              if (daySlots.length === 0) return null;

              return (
                <div key={dayIndex} className="space-y-2">
                  <h4 className="font-semibold text-primary">{dayName}</h4>
                  <div className="space-y-2 pl-4">
                    {daySlots.map(slot => (
                      <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Switch
                            checked={slot.enabled}
                            onCheckedChange={() => toggleSlot(slot.id)}
                          />
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => updateSlot(slot.id, 'startTime', e.target.value)}
                              className="w-24"
                              disabled={!slot.enabled}
                            />
                            <span className="text-muted-foreground">à</span>
                            <Input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => updateSlot(slot.id, 'endTime', e.target.value)}
                              className="w-24"
                              disabled={!slot.enabled}
                            />
                          </div>
                          <Badge variant={slot.enabled ? "default" : "secondary"}>
                            {slot.enabled ? "Actif" : "Inactif"}
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeTimeSlot(slot.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Résumé */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-primary">Résumé de configuration</p>
              <p className="text-sm text-muted-foreground">
                • Durée par défaut: {settings.defaultDuration} minutes avec {settings.bufferTime} minutes de pause<br />
                • Réservations acceptées entre {settings.minAdvanceBooking}h et {settings.maxAdvanceBooking} jours à l'avance<br />
                • {settings.timeSlots.filter(slot => slot.enabled).length} créneaux actifs configurés
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityManager;
