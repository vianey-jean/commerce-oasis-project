
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppointmentService } from '@/services/AppointmentService';
import { Download, Upload, Calendar, FileText, Mail, Smartphone, Cloud, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ExportSyncManager: React.FC = () => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'ical'>('csv');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year' | 'all'>('month');
  const [isExporting, setIsExporting] = useState(false);
  const [syncSettings, setSyncSettings] = useState({
    googleCalendar: false,
    outlookCalendar: false,
    emailReminders: true,
    smsReminders: false
  });

  const exportAppointments = async () => {
    setIsExporting(true);
    try {
      const appointments = await AppointmentService.getAllWithStatus();
      
      let filteredAppointments = appointments;
      const now = new Date();
      
      // Filtrer par période
      if (dateRange !== 'all') {
        const cutoffDate = new Date();
        switch (dateRange) {
          case 'week':
            cutoffDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            cutoffDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            cutoffDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        filteredAppointments = appointments.filter(apt => 
          new Date(apt.date) >= cutoffDate
        );
      }

      let content: string;
      let filename: string;
      let mimeType: string;

      switch (exportFormat) {
        case 'csv':
          content = generateCSV(filteredAppointments);
          filename = `rendez-vous-${format(now, 'yyyy-MM-dd')}.csv`;
          mimeType = 'text/csv';
          break;
        case 'json':
          content = JSON.stringify(filteredAppointments, null, 2);
          filename = `rendez-vous-${format(now, 'yyyy-MM-dd')}.json`;
          mimeType = 'application/json';
          break;
        case 'ical':
          content = generateICalendar(filteredAppointments);
          filename = `rendez-vous-${format(now, 'yyyy-MM-dd')}.ics`;
          mimeType = 'text/calendar';
          break;
        default:
          throw new Error('Format non supporté');
      }

      // Télécharger le fichier
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Export réussi !', {
        description: `${filteredAppointments.length} rendez-vous exportés en ${exportFormat.toUpperCase()}`
      });

    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error('Erreur lors de l\'export', {
        description: 'Impossible d\'exporter les rendez-vous'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const generateCSV = (appointments: any[]) => {
    const headers = [
      'ID', 'Titre', 'Description', 'Date', 'Heure', 'Durée (min)', 
      'Lieu', 'Statut', 'Nom', 'Prénom', 'Téléphone', 'Date de naissance'
    ];
    
    const csvContent = [
      headers.join(','),
      ...appointments.map(apt => [
        apt.id,
        `"${apt.titre}"`,
        `"${apt.description}"`,
        apt.date,
        apt.heure,
        apt.duree,
        `"${apt.location}"`,
        apt.statut,
        `"${apt.nom || ''}"`,
        `"${apt.prenom || ''}"`,
        `"${apt.telephone || ''}"`,
        `"${apt.dateNaissance || ''}"`
      ].join(','))
    ].join('\n');
    
    return csvContent;
  };

  const generateICalendar = (appointments: any[]) => {
    const now = new Date();
    const timestamp = format(now, "yyyyMMdd'T'HHmmss'Z'");
    
    let icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Riziky Agendas//FR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    appointments.forEach(apt => {
      const startDateTime = new Date(`${apt.date} ${apt.heure}`);
      const endDateTime = new Date(startDateTime.getTime() + (apt.duree * 60000));
      
      icalContent.push(
        'BEGIN:VEVENT',
        `UID:${apt.id}@riziky-agendas.com`,
        `DTSTAMP:${timestamp}`,
        `DTSTART:${format(startDateTime, "yyyyMMdd'T'HHmmss")}`,
        `DTEND:${format(endDateTime, "yyyyMMdd'T'HHmmss")}`,
        `SUMMARY:${apt.titre}`,
        `DESCRIPTION:${apt.description.replace(/\n/g, '\\n')}`,
        `LOCATION:${apt.location}`,
        `STATUS:${apt.statut === 'validé' ? 'CONFIRMED' : apt.statut === 'annulé' ? 'CANCELLED' : 'TENTATIVE'}`,
        'END:VEVENT'
      );
    });

    icalContent.push('END:VCALENDAR');
    return icalContent.join('\r\n');
  };

  const syncWithGoogleCalendar = () => {
    toast.info('Synchronisation Google Calendar', {
      description: 'Cette fonctionnalité nécessite une configuration API'
    });
  };

  const syncWithOutlook = () => {
    toast.info('Synchronisation Outlook', {
      description: 'Cette fonctionnalité nécessite une configuration API'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Export & Synchronisation</h2>
        <p className="text-muted-foreground">Exportez vos données et synchronisez avec d'autres calendriers</p>
      </div>

      {/* Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exporter les rendez-vous
          </CardTitle>
          <CardDescription>
            Téléchargez vos rendez-vous dans différents formats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Format d'export</Label>
              <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      CSV (Excel)
                    </div>
                  </SelectItem>
                  <SelectItem value="json">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      JSON (Données)
                    </div>
                  </SelectItem>
                  <SelectItem value="ical">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      iCalendar (.ics)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Période</Label>
              <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">7 derniers jours</SelectItem>
                  <SelectItem value="month">30 derniers jours</SelectItem>
                  <SelectItem value="year">12 derniers mois</SelectItem>
                  <SelectItem value="all">Tous les rendez-vous</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={exportAppointments} disabled={isExporting} className="gap-2">
            <Download className="w-4 h-4" />
            {isExporting ? 'Export en cours...' : 'Exporter'}
          </Button>
        </CardContent>
      </Card>

      {/* Synchronisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Synchronisation calendriers
          </CardTitle>
          <CardDescription>
            Synchronisez avec vos calendriers externes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Google Calendar</span>
                </div>
                <Badge variant="outline">Beta</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Synchronisez automatiquement avec votre agenda Google
              </p>
              <Button onClick={syncWithGoogleCalendar} variant="outline" size="sm" className="w-full">
                Configurer
              </Button>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-800" />
                  <span className="font-medium">Outlook Calendar</span>
                </div>
                <Badge variant="outline">Beta</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Synchronisez avec Microsoft Outlook
              </p>
              <Button onClick={syncWithOutlook} variant="outline" size="sm" className="w-full">
                Configurer
              </Button>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Notifications automatiques
          </CardTitle>
          <CardDescription>
            Configurez les rappels et confirmations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Rappels par email</p>
                  <p className="text-sm text-muted-foreground">Envoyer des rappels 24h avant</p>
                </div>
              </div>
              <Badge variant={syncSettings.emailReminders ? "default" : "secondary"}>
                {syncSettings.emailReminders ? "Activé" : "Désactivé"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">Rappels par SMS</p>
                  <p className="text-sm text-muted-foreground">SMS 2h avant le rendez-vous</p>
                </div>
              </div>
              <Badge variant="outline">Bientôt</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportSyncManager;
