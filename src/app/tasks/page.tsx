"use client"

import React, { useState } from 'react';
import { TaskForm } from '@/components/TaskForm';
import { TaskCard } from '@/components/TaskCard';
import { TaskSection } from '@/components/TaskSection';
import { useDayFlow } from '@/hooks/use-dayflow';
import { ListTodo, Search, Filter, Clock, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { TaskCategory } from '@/lib/types';
import { differenceInCalendarDays, parseISO } from 'date-fns';

export default function TasksPage() {
  const { 
    tasks, 
    addTask, 
    restoreTask,
    completeTask, 
    forwardTask, 
    deleteTask, 
    initialized 
  } = useDayFlow();

  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [ageFilter, setAgeFilter] = useState<string>('all');

  const handleAddTask = (title: string, category: TaskCategory) => {
    const newTask = addTask(title, category);
    if (newTask) {
      toast({
        title: <span className="text-primary font-bold uppercase tracking-widest text-xs">Task added</span>,
        description: (
          <span className="text-muted-foreground text-xs">
            "<span className="text-orange-500 font-bold">{newTask.title}</span>" added to lab.
          </span>
        ),
        duration: 2000,
      });
    }
  };

  const handleDelete = (id: string) => {
    const removedTask = deleteTask(id);
    if (removedTask) {
      toast({
        title: <span className="text-blue-500 font-bold uppercase tracking-widest text-xs">Task deleted</span>,
        description: (
          <span className="text-muted-foreground text-xs">
            "<span className="text-orange-500 font-bold">{removedTask.title}</span>" removed from lab.
          </span>
        ),
        action: (
          <ToastAction 
            altText="Undo" 
            onClick={() => restoreTask(removedTask)}
            className="bg-[#00ff00] text-black hover:bg-[#00cc00] border-none font-mono font-bold px-4"
          >
            UNDO
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
          Loading Tasks...
        </div>
      </div>
    );
  }

  const activeTasks = tasks.filter(t => {
    if (t.status !== 'active') return false;
    
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    
    let matchesAge = true;
    if (ageFilter !== 'all') {
      const daysSinceCreated = differenceInCalendarDays(new Date(), parseISO(t.createdAt));
      matchesAge = daysSinceCreated <= Number(ageFilter);
    }

    return matchesSearch && matchesCategory && matchesAge;
  });

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h2 className="text-lg font-bold uppercase tracking-tight">Add New Goal</h2>
        <TaskForm onAdd={handleAddTask} />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative col-span-1 md:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <Input 
            placeholder="Search active tasks..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 text-xs bg-card/20 border-white/10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-muted-foreground" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full h-10 text-[10px] font-bold uppercase tracking-widest border-white/10 bg-card/20">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="uppercase text-[10px] font-bold">All Categories</SelectItem>
              <SelectItem value="Coding" className="uppercase text-[10px] font-bold">Coding</SelectItem>
              <SelectItem value="DSA" className="uppercase text-[10px] font-bold">DSA</SelectItem>
              <SelectItem value="Health(Exercise)" className="uppercase text-[10px] font-bold">Health(Exercise)</SelectItem>
              <SelectItem value="General" className="uppercase text-[10px] font-bold">General</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={14} className="text-muted-foreground" />
          <Select value={ageFilter} onValueChange={setAgeFilter}>
            <SelectTrigger className="w-full h-10 text-[10px] font-bold uppercase tracking-widest border-white/10 bg-card/20">
              <SelectValue placeholder="Age Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="uppercase text-[10px] font-bold">Any Age</SelectItem>
              <SelectItem value="1" className="uppercase text-[10px] font-bold">Added Today</SelectItem>
              <SelectItem value="2" className="uppercase text-[10px] font-bold">Last 2 Days</SelectItem>
              <SelectItem value="7" className="uppercase text-[10px] font-bold">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TaskSection 
        title="Active Workspace" 
        icon={ListTodo} 
        count={activeTasks.length}
      >
        {activeTasks.length > 0 ? (
          activeTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onComplete={completeTask} 
              onForward={forwardTask} 
              onDelete={handleDelete}
              showDueDate={true}
            />
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-xl bg-white/5">
            <p className="text-muted-foreground italic text-sm">
              {search || categoryFilter !== 'all' || ageFilter !== 'all' ? "No tasks match your filters." : "Your workspace is clear. Ready to add a new goal?"}
            </p>
          </div>
        )}
      </TaskSection>
    </div>
  );
}
