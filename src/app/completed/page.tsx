"use client"

import React from 'react';
import { TaskCard } from '@/components/TaskCard';
import { TaskSection } from '@/components/TaskSection';
import { useDayFlow } from '@/hooks/use-dayflow';
import { CheckCircle2, Loader2, Trophy } from 'lucide-react';
import { Dashboard } from '@/components/Dashboard';

export default function CompletedPage() {
  const { 
    tasks, 
    deleteTask, 
    stats, 
    initialized 
  } = useDayFlow();

  if (!initialized) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <div className="text-primary font-bold tracking-widest uppercase text-sm">
          Loading History...
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="space-y-10">
      <Dashboard stats={stats} />

      <TaskSection 
        title="Completed History" 
        icon={CheckCircle2} 
        count={completedTasks.length}
      >
        {completedTasks.length > 0 ? (
          completedTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onDelete={deleteTask}
            />
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-xl bg-white/5 space-y-4">
            <div className="flex justify-center">
              <Trophy className="text-muted-foreground/20" size={48} />
            </div>
            <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold">
              Your achievement wall is empty. Get some things done!
            </p>
          </div>
        )}
      </TaskSection>
    </div>
  );
}
