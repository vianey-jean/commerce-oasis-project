
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AppointmentService, Appointment } from '@/services/AppointmentService';
import { AlertTriangle, Clock, Calendar, User, MapPin, Phone } from 'lucide-react';
import { format, parseISO, isWithinInterval, addMinutes, subMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

interface Conflict {
  id: string;
  type: 'overlap' | 'too_close' | 'double_booking';
  severity: 'high' | 'medium' | 'low';
  appointments: Appointment[];
  message: string;
  suggestion: string;
}

const ConflictManager: React.FC = () => {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await AppointmentService.getAllWithStatus();
      setAppointments(data);
      analyzeConflicts(data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Impossible de charger les rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  const analyzeConflicts = (appointments: Appointment[]) => {
    const conflicts: Conflict[] = [];
    const validAppointments = appointments.filter(apt => apt.statut === 'validé');

    // Vérifier les chevauchements et conflits
    for (let i = 0; i < validAppointments.length; i++) {
      for (let j = i + 1; j < validAppointments.length; j++) {
        const apt1 = validAppointments[i];
        const apt2 = validAppointments[j];

        // Même date
        if (apt1.date === apt2.date) {
          const start1 = parseTime(apt1.heure);
          const end1 = addMinutes(start1, apt1.duree);
          const start2 = parseTime(apt2.heure);
          const end2 = addMinutes(start2, apt2.duree);

          // Chevauchement exact
          if (apt1.heure === apt2.heure) {
            conflicts.push({
              id: `overlap-${apt1.id}-${apt2.id}`,
              type: 'double_booking',
              severity: 'high',
              appointments: [apt1, apt2],
              message: 'Double réservation détectée',
              suggestion: 'Déplacer l\'un des rendez-vous ou modifier les horaires'
            });
          }
          // Chevauchement partiel
          else if (isWithinInterval(start2, { start: start1, end: end1 }) || 
                   isWithinInterval(start1, { start: start2, end: end2 })) {
            conflicts.push({
              id: `overlap-${apt1.id}-${apt2.id}`,
              type: 'overlap',
              severity: 'high',
              appointments: [apt1, apt2],
              message: 'Chevauchement de rendez-vous',
              suggestion: 'Ajuster les horaires pour éviter le conflit'
            });
          }
          // Trop proche (moins de 15 minutes entre)
          else if (Math.abs(start1.getTime() - end2.getTime()) < 15 * 60 * 1000 ||
                   Math.abs(start2.getTime() - end1.getTime()) < 15 * 60 * 1000) {
            conflicts.push({
              id: `close-${apt1.id}-${apt2.id}`,
              type: 'too_close',
              severity: 'medium',
              appointments: [apt1, apt2],
              message: 'Rendez-vous très rapprochés',
              suggestion: 'Prévoir plus de temps entre les rendez-vous'
            });
          }
        }
      }
    }

    setConflicts(conflicts);
  };

  const parseTime = (timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const getSeverityColor = (severity: Conflict['severity']) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getSeverityBadge = (severity: Conflict['severity']) => {
    switch (severity) {
      case 'high': return <Badge variant="destructive">Critique</Badge>;
      case 'medium': return <Badge className="bg-orange-100 text-orange-700">Attention</Badge>;
      case 'low': return <Badge variant="outline">Information</Badge>;
    }
  };

  const resolveConflict = async (conflictId: string) => {
    toast.info('Résolution de conflit', {
      description: 'Fonctionnalité de résolution automatique en développement'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Gestion des conflits</h2>
          <p className="text-muted-foreground">
            Détection et résolution des conflits de rendez-vous
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadAppointments}>
            Actualiser
          </Button>
          {conflicts.length > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="w-3 h-3" />
              {conflicts.length} conflit{conflicts.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      {conflicts.length === 0 ? (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-800">Aucun conflit détecté</p>
                <p className="text-green-600">Tous vos rendez-vous sont bien organisés !</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {conflicts.map(conflict => (
            <Card key={conflict.id} className={`border-l-4 ${getSeverityColor(conflict.severity)}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="w-5 h-5" />
                    {conflict.message}
                  </CardTitle>
                  {getSeverityBadge(conflict.severity)}
                </div>
                <CardDescription>
                  {conflict.suggestion}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {conflict.appointments.map((appointment, index) => (
                      <div key={appointment.id} className="p-4 border rounded-lg bg-background">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-primary">{appointment.titre}</h4>
                          <Badge variant="outline">RDV {index + 1}</Badge>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {format(parseISO(appointment.date), 'EEEE dd MMMM yyyy', { locale: fr })}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {appointment.heure} ({appointment.duree} min)
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {appointment.location}
                          </div>
                          {(appointment.nom || appointment.prenom) && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              {appointment.prenom} {appointment.nom}
                            </div>
                          )}
                          {appointment.telephone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {appointment.telephone}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => resolveConflict(conflict.id)}
                      variant="outline"
                      size="sm"
                    >
                      Résoudre automatiquement
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConflictManager;
