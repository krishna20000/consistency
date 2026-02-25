"use client"

import React from 'react';
import { Dashboard } from '@/components/Dashboard';
import { TaskForm } from '@/components/TaskForm';
import { TaskCard } from '@/components/TaskCard';
import { TaskSection } from '@/components/TaskSection';
import { useDayFlow } from '@/hooks/use-dayflow';
import { CheckCircle2, ListTodo, History, LayoutGrid, Loader2 } from 'lucide-react';

export default function Home() {
  const { 
    tasks, 
    addTask, 
    completeTask, 
    forwardTask, 
    deleteTask, 
    stats, 
    todayString, 
    initialized 
  } = useDayFlow();

  if (!initialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <div className="text-primary font-bold tracking-widest uppercase text-sm">
          Loading DayFlow...
        </div>
      </div>
    );
  }

  const activeTodayTasks = tasks.filter(t => t.dueDate === todayString && t.status === 'active');
  const completedTodayTasks = tasks.filter(t => t.dueDate === todayString && t.status === 'completed');
  const futureTasks = tasks.filter(t => t.dueDate > todayString);

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <LayoutGrid className="text-accent" size={24} />
            <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
              Day<span className="text-primary">Flow</span>
            </h1>
          </div>
          <p className="text-muted-foreground font-medium">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="text-xs text-muted-foreground bg-white/5 px-3 py-1.5 rounded-md border border-white/5 uppercase tracking-tighter">
          Personal Workspace
        </div>
      </header>

      <Dashboard stats={stats} />

      <section className="space-y-4">
        <h2 className="text-lg font-bold">Manage Focus</h2>
        <TaskForm onAdd={addTask} />
      </section>

      <div className="space-y-12">
        <TaskSection 
          title="Today's Tasks" 
          icon={ListTodo} 
          count={activeTodayTasks.length}
        >
          {activeTodayTasks.length > 0 ? (
            activeTodayTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onComplete={completeTask} 
                onForward={forwardTask} 
                onDelete={deleteTask}
              />
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl">
              <p className="text-muted-foreground italic">No active tasks for today. Add one above!</p>
            </div>
          )}
        </TaskSection>

        <TaskSection 
          title="Completed Today" 
          icon={CheckCircle2} 
          count={completedTodayTasks.length}
        >
          {completedTodayTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onDelete={deleteTask}
            />
          ))}
        </TaskSection>

        <TaskSection 
          title="Scheduled Tasks" 
          icon={History} 
          count={futureTasks.length}
        >
          {futureTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onDelete={deleteTask}
            />
          ))}
        </TaskSection>
      </div>

      <footer className="pt-12 border-t border-white/5 text-center">
        <p className="text-xs text-muted-foreground/40 font-mono tracking-widest uppercase">
          &copy; {new Date().getFullYear()} DayFlow // Focused Productivity
        </p>
      </footer>
    </main>
  );
}
