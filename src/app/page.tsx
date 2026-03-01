"use client"

import React, { useState } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { TaskForm } from '@/components/TaskForm';
import { TaskCard } from '@/components/TaskCard';
import { TaskSection } from '@/components/TaskSection';
import { useDayFlow } from '@/hooks/use-dayflow';
import { ListTodo, Loader2, AlertTriangle, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskCategory } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

export default function InProgressPage() {
  const { 
    tasks, 
    addTask, 
    restoreTask,
    completeTask, 
    forwardTask, 
    deleteTask, 
    stats, 
    initialized 
  } = useDayFlow();

  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const handleDelete = (id: string) => {
    const removedTask = deleteTask(id);
    if (removedTask) {
      toast({
        title: "Task deleted",
        description: `"${removedTask.title}" has been removed.`,
        action: (
          <ToastAction altText="Undo" onClick={() => restoreTask(removedTask)}>
            Undo
          </ToastAction>
        ),
        duration: 5000,
      });
    }
  };

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

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return t.status === 'active' && matchesSearch && matchesCategory;
  });

  const priorityTasks = filteredTasks.filter(t => t.forwardedCount > 2);
  const regularTasks = filteredTasks.filter(t => t.forwardedCount <= 2);

  return (
    <div className="space-y-10">
      <Dashboard stats={stats} />

      <section className="space-y-4">
        <h2 className="text-lg font-bold">New Goal</h2>
        <TaskForm onAdd={addTask} />
      </section>

      <div className="flex flex-col md:flex-row items-center gap-3 bg-card/20 p-4 rounded-xl border border-white/5">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <Input 
            placeholder="Search tasks..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs bg-transparent border-white/10"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={14} className="text-muted-foreground hidden md:block" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[140px] h-9 text-[10px] font-bold uppercase tracking-widest border-white/10 bg-transparent">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="uppercase text-[10px] font-bold">All Categories</SelectItem>
              <SelectItem value="Work" className="uppercase text-[10px] font-bold">Work</SelectItem>
              <SelectItem value="Study" className="uppercase text-[10px] font-bold">Study</SelectItem>
              <SelectItem value="Health" className="uppercase text-[10px] font-bold">Health</SelectItem>
              <SelectItem value="Personal" className="uppercase text-[10px] font-bold">Personal</SelectItem>
              <SelectItem value="General" className="uppercase text-[10px] font-bold">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
              onDelete={handleDelete}
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
              onDelete={handleDelete}
              showDueDate={false}
            />
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl bg-white/5">
            <p className="text-muted-foreground italic">
              {search || categoryFilter !== 'all' ? "No results match your filters." : "No active tasks. Time to plan ahead!"}
            </p>
          </div>
        )}
      </TaskSection>
    </div>
  );
}
