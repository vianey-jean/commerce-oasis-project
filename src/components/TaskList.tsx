
import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, X, Clock, Flag, Crown, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Préparer présentation client',
      completed: false,
      priority: 'high',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24)
    },
    {
      id: '2',
      title: 'Confirmer RDV médecin',
      completed: true,
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Acheter cadeau anniversaire',
      completed: false,
      priority: 'low',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)
    },
    {
      id: '4',
      title: 'Réviser formation React',
      completed: false,
      priority: 'medium'
    }
  ]);

  const [newTask, setNewTask] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.trim(),
        completed: false,
        priority: 'medium'
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setShowAddTask(false);
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-500/20';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/20';
      case 'low':
        return 'text-green-500 bg-green-500/20';
      default:
        return 'text-gray-500 bg-gray-500/20';
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card className="luxury-card rounded-3xl premium-shadow-xl border-0 glow-effect h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 premium-gradient rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl font-bold luxury-text-gradient">
              Liste des Tâches
            </CardTitle>
            <p className="text-sm text-muted-foreground font-medium">
              {completedTasks}/{totalTasks} tâches terminées
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            <Star className="w-4 h-4 text-yellow-400" />
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Progression</span>
            <span className="text-sm font-bold text-primary">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Bouton ajouter tâche */}
        {!showAddTask ? (
          <Button
            onClick={() => setShowAddTask(true)}
            className="w-full h-12 luxury-card border-2 border-dashed border-primary/30 hover:border-primary/60 bg-transparent hover:bg-primary/5 text-primary premium-hover rounded-xl"
            variant="ghost"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une tâche
          </Button>
        ) : (
          <div className="flex gap-2">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Nouvelle tâche..."
              className="flex-1 premium-input rounded-xl"
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              autoFocus
            />
            <Button
              onClick={addTask}
              className="btn-premium premium-shadow rounded-xl"
              size="sm"
            >
              <CheckCircle2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => {
                setShowAddTask(false);
                setNewTask('');
              }}
              variant="ghost"
              className="rounded-xl"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Liste des tâches */}
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`group relative p-4 rounded-2xl luxury-card premium-hover transition-all duration-300 border ${
                task.completed 
                  ? 'border-green-500/30 bg-green-500/5' 
                  : 'border-primary/10 hover:border-primary/30'
              } glow-effect`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    task.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-primary/40 hover:border-primary hover:bg-primary/10'
                  }`}
                >
                  {task.completed && <CheckCircle2 className="w-4 h-4" />}
                  {!task.completed && <Circle className="w-4 h-4 opacity-0" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className={`font-medium transition-all duration-300 ${
                    task.completed 
                      ? 'text-muted-foreground line-through' 
                      : 'text-primary group-hover:luxury-text-gradient'
                  }`}>
                    {task.title}
                  </div>
                  
                  <div className="flex items-center gap-3 mt-1">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                    <span className="text-xs text-muted-foreground capitalize">
                      {task.priority === 'high' ? 'Urgent' : 
                       task.priority === 'medium' ? 'Important' : 'Normal'}
                    </span>
                    
                    {task.dueDate && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {task.dueDate.toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {task.completed && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl pointer-events-none"></div>
              )}
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              Aucune tâche pour le moment
            </p>
            <p className="text-sm text-muted-foreground">
              Ajoutez votre première tâche !
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskList;
