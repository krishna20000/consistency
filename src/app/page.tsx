"use client"

import React from 'react';
import { Dashboard } from '@/components/Dashboard';
import { TaskForm } from '@/components/TaskForm';
import { TaskCard } from '@/components/TaskCard';
import { TaskSection } from '@/components/TaskSection';
import { useDayFlow } from '@/hooks/use-dayflow';
import { ListTodo, Loader2, AlertTriangle } from 'lucide-react';

export default function InProgressPage() {
  const { 
    tasks, 
    addTask, 
    completeTask, 
    forwardTask, 
    deleteTask, 
    stats, 
    initialized 
  } = useDayFlow();

  if (!initialized) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <div className="text-primary font-bold tracking-widest uppercase text-sm">
          Syncing Tasks...
        </div>
      </div>
    );
  }

  const activeTasks = tasks.filter(t => t.status === 'active');
  const priorityTasks = activeTasks.filter(t => t.forwardedCount > 2);
  const regularTasks = activeTasks.filter(t => t.forwardedCount <= 2);

  return (
    <div className="space-y-10">
      <Dashboard stats={stats} />

      <section className="space-y-4">
        <h2 className="text-lg font-bold">New Goal</h2>
        <TaskForm onAdd={addTask} />
      </section>

      {priorityTasks.length > 0 && (
        <TaskSection 
          title="Priority Tasks" 
          icon={AlertTriangle} 
          count={priorityTasks.length}
        >
          {priorityTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onComplete={completeTask} 
              onForward={forwardTask} 
              onDelete={deleteTask}
              showDueDate={false}
            />
          ))}
        </TaskSection>
      )}

      <TaskSection 
        title="Today's Tasks" 
        icon={ListTodo} 
        count={regularTasks.length}
      >
        {regularTasks.length > 0 ? (
          regularTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onComplete={completeTask} 
              onForward={forwardTask} 
              onDelete={deleteTask}
              showDueDate={false}
            />
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl bg-white/5">
            <p className="text-muted-foreground italic">No active tasks. Time to plan ahead!</p>
          </div>
        )}
      </TaskSection>
    </div>
  );
}
