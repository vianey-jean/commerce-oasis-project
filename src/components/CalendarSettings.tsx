
import React, { useState } from 'react';
import { Settings, Clock, Bell, Calendar, Palette, Crown, Star, Sparkles, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CalendarSettingsData {
  timeFormat: '12h' | '24h';
  weekStart: 'sunday' | 'monday';
  notifications: boolean;
  emailReminders: boolean;
  theme: 'light' | 'dark' | 'auto';
  defaultDuration: number;
  workingHours: {
    start: string;
    end: string;
  };
}

const CalendarSettings = () => {
  const [settings, setSettings] = useState<CalendarSettingsData>({
    timeFormat: '24h',
    weekStart: 'monday',
    notifications: true,
    emailReminders: false,
    theme: 'light',
    defaultDuration: 60,
    workingHours: {
      start: '09:00',
      end: '18:00'
    }
  });

  const updateSetting = <K extends keyof CalendarSettingsData>(
    key: K, 
    value: CalendarSettingsData[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // Ici on sauvegarderait les paramètres
    console.log('Paramètres sauvegardés:', settings);
  };

  return (
    <Card className="luxury-card rounded-3xl premium-shadow-xl border-0 glow-effect h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 premium-gradient rounded-2xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl font-bold luxury-text-gradient">
              Paramètres du Calendrier
            </CardTitle>
            <p className="text-sm text-muted-foreground font-medium">
              Personnalisez votre expérience agenda
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            <Star className="w-4 h-4 text-yellow-400" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Format d'heure */}
        <div className="luxury-card rounded-2xl p-4 border border-primary/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <Label className="text-base font-bold text-primary">Format d'heure</Label>
          </div>
          <Select value={settings.timeFormat} onValueChange={(value: '12h' | '24h') => updateSetting('timeFormat', value)}>
            <SelectTrigger className="premium-input rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12h">12 heures (AM/PM)</SelectItem>
              <SelectItem value="24h">24 heures</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Début de semaine */}
        <div className="luxury-card rounded-2xl p-4 border border-primary/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-green-500" />
            </div>
            <Label className="text-base font-bold text-primary">Début de semaine</Label>
          </div>
          <Select value={settings.weekStart} onValueChange={(value: 'sunday' | 'monday') => updateSetting('weekStart', value)}>
            <SelectTrigger className="premium-input rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monday">Lundi</SelectItem>
              <SelectItem value="sunday">Dimanche</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notifications */}
        <div className="luxury-card rounded-2xl p-4 border border-primary/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Bell className="w-4 h-4 text-purple-500" />
            </div>
            <Label className="text-base font-bold text-primary">Notifications</Label>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium text-primary">Notifications push</Label>
                <p className="text-sm text-muted-foreground">Recevoir des alertes pour les rendez-vous</p>
              </div>
              <Switch 
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSetting('notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium text-primary">Rappels par email</Label>
                <p className="text-sm text-muted-foreground">Recevoir des emails de rappel</p>
              </div>
              <Switch 
                checked={settings.emailReminders}
                onCheckedChange={(checked) => updateSetting('emailReminders', checked)}
              />
            </div>
          </div>
        </div>

        {/* Durée par défaut */}
        <div className="luxury-card rounded-2xl p-4 border border-primary/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-orange-500" />
            </div>
            <Label className="text-base font-bold text-primary">Durée par défaut</Label>
          </div>
          <Select value={settings.defaultDuration.toString()} onValueChange={(value) => updateSetting('defaultDuration', parseInt(value))}>
            <SelectTrigger className="premium-input rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 heure</SelectItem>
              <SelectItem value="90">1h30</SelectItem>
              <SelectItem value="120">2 heures</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Heures de travail */}
        <div className="luxury-card rounded-2xl p-4 border border-primary/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-red-500" />
            </div>
            <Label className="text-base font-bold text-primary">Heures de travail</Label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Début</Label>
              <Select 
                value={settings.workingHours.start} 
                onValueChange={(value) => updateSetting('workingHours', { ...settings.workingHours, start: value })}
              >
                <SelectTrigger className="premium-input rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {hour}:00
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Fin</Label>
              <Select 
                value={settings.workingHours.end} 
                onValueChange={(value) => updateSetting('workingHours', { ...settings.workingHours, end: value })}
              >
                <SelectTrigger className="premium-input rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0');
                    return (
                      <SelectItem key={hour} value={`${hour}:00`}>
                        {hour}:00
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Thème */}
        <div className="luxury-card rounded-2xl p-4 border border-primary/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <Palette className="w-4 h-4 text-pink-500" />
            </div>
            <Label className="text-base font-bold text-primary">Thème</Label>
          </div>
          <Select value={settings.theme} onValueChange={(value: 'light' | 'dark' | 'auto') => updateSetting('theme', value)}>
            <SelectTrigger className="premium-input rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Clair</SelectItem>
              <SelectItem value="dark">Sombre</SelectItem>
              <SelectItem value="auto">Automatique</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bouton de sauvegarde */}
        <Button 
          onClick={saveSettings}
          className="w-full h-12 btn-premium premium-shadow-lg font-semibold rounded-2xl"
        >
          <Save className="w-5 h-5 mr-2" />
          Sauvegarder les paramètres
          <Sparkles className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default CalendarSettings;
