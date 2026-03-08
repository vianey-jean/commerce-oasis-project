import React, { useState } from 'react';
import { GripVertical, Edit3, Trash2, Mic, X, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Note } from '@/services/api/noteApi';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, onDragStart }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'edit' | 'delete' | null>(null);

  const handleConfirm = () => {
    if (confirmAction === 'edit') {
      setShowDetail(false);
      setConfirmAction(null);
      onEdit();
    } else if (confirmAction === 'delete') {
      setShowDetail(false);
      setConfirmAction(null);
      onDelete();
    }
  };

  return (
    <>
      <div
        draggable
        onDragStart={onDragStart}
        onClick={() => setShowDetail(true)}
        className="group relative rounded-2xl border border-white/30 dark:border-white/10 backdrop-blur-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02]"
        style={{ backgroundColor: note.color === '#ffffff' ? 'rgba(255,255,255,0.9)' : note.color + 'e6' }}
      >
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 opacity-70" />

        <div className="p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <GripVertical className="h-4 w-4 text-gray-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
              <h4 className={cn("text-sm font-bold text-gray-900 dark:text-white truncate", note.bold && "text-base")}>
                {note.title || 'Sans titre'}
              </h4>
            </div>
            <Eye className="h-4 w-4 text-gray-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {note.content && (
            <div className="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap line-clamp-4 leading-relaxed">
              {note.content.split('\n').map((line, i) => (
                <span key={i} className={cn(
                  note.boldLines?.includes(i) && 'font-bold',
                  note.underlineLines?.includes(i) && 'underline'
                )}>
                  {line}{i < note.content.split('\n').length - 1 && '\n'}
                </span>
              ))}
            </div>
          )}

          {note.voiceText && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 bg-violet-50/50 dark:bg-violet-900/10 px-2 py-1 rounded-lg">
              <Mic className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{note.voiceText.substring(0, 60)}...</span>
            </div>
          )}

          {note.drawing && (
            <div className="mt-2 rounded-xl overflow-hidden border border-gray-200/50 dark:border-gray-600/50">
              <img 
                src={note.drawing} 
                alt="Dessin" 
                className="w-full h-24 object-contain bg-white" 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="mt-2 text-[10px] text-gray-400 font-medium">
            {new Date(note.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto p-0 rounded-3xl border-white/20 dark:border-white/10"
          style={{ backgroundColor: note.color === '#ffffff' ? 'rgba(255,255,255,0.97)' : note.color + 'f5' }}>
          <div className="p-5 sm:p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <h3 className={cn("text-lg font-black text-gray-900 dark:text-white", note.bold && "text-xl")}>
                {note.title || 'Sans titre'}
              </h3>
              <button onClick={() => setShowDetail(false)} className="p-1.5 rounded-xl hover:bg-black/10 transition-colors">
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            {/* Full content */}
            {note.content && (
              <div className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                {note.content.split('\n').map((line, i) => (
                  <span key={i} className={cn(
                    note.boldLines?.includes(i) && 'font-bold',
                    note.underlineLines?.includes(i) && 'underline'
                  )}>
                    {line}{i < note.content.split('\n').length - 1 && '\n'}
                  </span>
                ))}
              </div>
            )}

            {/* Voice text */}
            {note.voiceText && (
              <div className="p-3 rounded-xl bg-violet-50/80 dark:bg-violet-900/20 border border-violet-200/50 dark:border-violet-700/50">
                <div className="flex items-center gap-2 mb-1">
                  <Mic className="h-3.5 w-3.5 text-violet-500" />
                  <span className="text-xs font-bold text-violet-600 dark:text-violet-400">Note vocale</span>
                </div>
                <p className="text-sm text-violet-700 dark:text-violet-300">{note.voiceText}</p>
              </div>
            )}

            {/* Drawing */}
            {note.drawing && (
              <div className="rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-600/50 shadow-sm">
                <img 
                  src={note.drawing} 
                  alt="Dessin" 
                  className="w-full object-contain bg-white" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Date */}
            <div className="text-xs text-gray-400 font-medium">
              Créé le {new Date(note.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              {note.updatedAt !== note.createdAt && (
                <> · Modifié le {new Date(note.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</>
              )}
            </div>

            {/* Actions at bottom */}
            <div className="flex gap-2 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
              <button
                onClick={(e) => { e.stopPropagation(); setConfirmAction('edit'); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200/50 dark:border-cyan-700/50 text-cyan-600 dark:text-cyan-400 font-bold text-sm hover:shadow-lg transition-all"
              >
                <Edit3 className="h-4 w-4" /> Modifier
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setConfirmAction('delete'); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200/50 dark:border-red-700/50 text-red-600 dark:text-red-400 font-bold text-sm hover:shadow-lg transition-all"
              >
                <Trash2 className="h-4 w-4" /> Supprimer
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmAction !== null} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent className="max-w-sm rounded-3xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border-white/20 dark:border-white/10">
          <div className="text-center space-y-4 p-4">
            <div className={cn(
              "mx-auto w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
              confirmAction === 'delete' ? "bg-gradient-to-br from-red-500 to-rose-600" : "bg-gradient-to-br from-cyan-500 to-blue-600"
            )}>
              {confirmAction === 'delete' ? <Trash2 className="h-6 w-6 text-white" /> : <Edit3 className="h-6 w-6 text-white" />}
            </div>
            <p className="text-base font-bold text-gray-900 dark:text-white">
              {confirmAction === 'delete' ? 'Confirmer la suppression ?' : 'Confirmer la modification ?'}
            </p>
            <p className="text-sm text-gray-500">
              {confirmAction === 'delete' ? 'Cette action est irréversible.' : 'Vous allez modifier cette note.'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirm}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-all",
                  confirmAction === 'delete' ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700" : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                )}
              >
                Confirmer
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NoteCard;
