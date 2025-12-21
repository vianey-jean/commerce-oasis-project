import React, { useState, useMemo } from 'react';
import { RDV } from '@/types/rdv';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Clock,
  User,
  MapPin,
  GripVertical
} from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RdvCalendarProps {
  rdvs: RDV[];
  onRdvClick: (rdv: RDV) => void;
  onSlotClick: (date: string, time: string) => void;
  onRdvDrop: (rdv: RDV, newDate: string, newTime: string) => void;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8h à 19h

const statusColors: Record<string, string> = {
  planifie: 'bg-blue-500/90 hover:bg-blue-600 border-blue-600',
  confirme: 'bg-green-500/90 hover:bg-green-600 border-green-600',
  annule: 'bg-red-500/90 hover:bg-red-600 border-red-600',
  termine: 'bg-gray-500/90 hover:bg-gray-600 border-gray-600',
};

const RdvCalendar: React.FC<RdvCalendarProps> = ({
  rdvs,
  onRdvClick,
  onSlotClick,
  onRdvDrop,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggedRdv, setDraggedRdv] = useState<RDV | null>(null);
  const [dropTarget, setDropTarget] = useState<{ date: string; hour: number } | null>(null);
  const [showTimeDialog, setShowTimeDialog] = useState(false);
  const [pendingDrop, setPendingDrop] = useState<{ rdv: RDV; date: string } | null>(null);
  const [newTime, setNewTime] = useState('09:00');

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const rdvsByDay = useMemo(() => {
    const map: Record<string, RDV[]> = {};
    rdvs.forEach(rdv => {
      const dateKey = rdv.date;
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(rdv);
    });
    return map;
  }, [rdvs]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => addDays(prev, direction === 'prev' ? -7 : 7));
  };

  const goToToday = () => setCurrentDate(new Date());

  const handleDragStart = (e: React.DragEvent, rdv: RDV) => {
    setDraggedRdv(rdv);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', rdv.id);
  };

  const handleDragOver = (e: React.DragEvent, date: string, hour: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget({ date, hour });
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = (e: React.DragEvent, date: string) => {
    e.preventDefault();
    if (draggedRdv) {
      setPendingDrop({ rdv: draggedRdv, date });
      setNewTime(draggedRdv.heureDebut);
      setShowTimeDialog(true);
    }
    setDraggedRdv(null);
    setDropTarget(null);
  };

  const confirmTimeChange = () => {
    if (pendingDrop) {
      onRdvDrop(pendingDrop.rdv, pendingDrop.date, newTime);
    }
    setShowTimeDialog(false);
    setPendingDrop(null);
  };

  const getRdvPosition = (rdv: RDV) => {
    const [startHour, startMin] = rdv.heureDebut.split(':').map(Number);
    const [endHour, endMin] = rdv.heureFin.split(':').map(Number);
    
    const top = ((startHour - 8) * 60 + startMin) * (60 / 60);
    const height = ((endHour - startHour) * 60 + (endMin - startMin)) * (60 / 60);
    
    return { top: `${top}px`, height: `${Math.max(height, 25)}px` };
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Planning de la semaine
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Aujourd'hui
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[200px] text-center">
              {format(weekDays[0], 'd MMM', { locale: fr })} - {format(weekDays[6], 'd MMM yyyy', { locale: fr })}
            </span>
            <Button variant="outline" size="icon" onClick={() => navigateWeek('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* En-têtes des jours */}
          <div className="grid grid-cols-8 border-b">
            <div className="p-2 text-center text-xs font-medium text-muted-foreground border-r">
              Heure
            </div>
            {weekDays.map((day, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-2 text-center border-r last:border-r-0",
                  isSameDay(day, new Date()) && "bg-primary/10"
                )}
              >
                <div className="text-xs font-medium text-muted-foreground">
                  {format(day, 'EEE', { locale: fr })}
                </div>
                <div className={cn(
                  "text-lg font-bold",
                  isSameDay(day, new Date()) && "text-primary"
                )}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Grille horaire */}
          <div className="relative">
            {HOURS.map((hour) => (
              <div key={hour} className="grid grid-cols-8 border-b h-[60px]">
                <div className="p-1 text-xs text-muted-foreground text-center border-r flex items-start justify-center">
                  {hour}:00
                </div>
                {weekDays.map((day, dayIdx) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const isDropTarget = dropTarget?.date === dateStr && dropTarget?.hour === hour;
                  
                  return (
                    <div
                      key={dayIdx}
                      className={cn(
                        "relative border-r last:border-r-0 cursor-pointer transition-colors",
                        isDropTarget && "bg-primary/20",
                        isSameDay(day, new Date()) && "bg-primary/5"
                      )}
                      onClick={() => onSlotClick(dateStr, `${hour.toString().padStart(2, '0')}:00`)}
                      onDragOver={(e) => handleDragOver(e, dateStr, hour)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, dateStr)}
                    />
                  );
                })}
              </div>
            ))}

            {/* Affichage des RDV */}
            {weekDays.map((day, dayIdx) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayRdvs = rdvsByDay[dateStr] || [];
              
              return dayRdvs.map((rdv) => {
                const pos = getRdvPosition(rdv);
                const leftPercent = (dayIdx + 1) * (100 / 8);
                const widthPercent = 100 / 8 - 0.5;
                
                return (
                  <div
                    key={rdv.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, rdv)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRdvClick(rdv);
                    }}
                    className={cn(
                      "absolute rounded-md border-l-4 px-2 py-1 cursor-grab active:cursor-grabbing",
                      "text-white text-xs overflow-hidden shadow-sm",
                      "transition-all hover:shadow-md hover:z-10",
                      statusColors[rdv.statut]
                    )}
                    style={{
                      top: pos.top,
                      height: pos.height,
                      left: `calc(${leftPercent}% + 2px)`,
                      width: `calc(${widthPercent}% - 4px)`,
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <GripVertical className="h-3 w-3 opacity-50 flex-shrink-0" />
                      <span className="font-medium truncate">{rdv.titre}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 opacity-90">
                      <Clock className="h-2.5 w-2.5" />
                      <span>{rdv.heureDebut} - {rdv.heureFin}</span>
                    </div>
                    {rdv.clientNom && (
                      <div className="flex items-center gap-1 mt-0.5 opacity-90 truncate">
                        <User className="h-2.5 w-2.5" />
                        <span className="truncate">{rdv.clientNom}</span>
                      </div>
                    )}
                  </div>
                );
              });
            })}
          </div>
        </div>
      </CardContent>

      {/* Dialog pour choisir l'horaire après drag & drop */}
      <Dialog open={showTimeDialog} onOpenChange={setShowTimeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'horaire</DialogTitle>
            <DialogDescription>
              Vous déplacez "{pendingDrop?.rdv.titre}" vers le {pendingDrop?.date && format(parseISO(pendingDrop.date), 'EEEE d MMMM', { locale: fr })}.
              Choisissez la nouvelle heure de début.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newTime">Nouvelle heure de début</Label>
              <Input
                id="newTime"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTimeDialog(false)}>
              Annuler
            </Button>
            <Button onClick={confirmTimeChange}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RdvCalendar;
