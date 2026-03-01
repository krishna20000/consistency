"use client"

import React, { useState } from 'react';
import { TaskCard } from '@/components/TaskCard';
import { TaskSection } from '@/components/TaskSection';
import { useDayFlow } from '@/hooks/use-dayflow';
import { CheckCircle2, Loader2, Search, Filter, Timer } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { differenceInCalendarDays, parseISO } from 'date-fns';

export default function CompletedPage() {
  const { 
    tasks, 
    deleteTask, 
    restoreTask,
    initialized 
  } = useDayFlow();

  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [durationFilter, setDurationFilter] = useState<string>('all');

  const handleDelete = (id: string) => {
    const removedTask = deleteTask(id);
    if (removedTask) {
      toast({
        title: <span className="text-blue-500 font-bold uppercase tracking-widest text-xs">Task deleted</span>,
        description: (
          <span className="text-muted-foreground text-xs">
            "<span className="text-orange-500 font-bold">{removedTask.title}</span>" removed from history.
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
          Loading History...
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => {
    if (t.status !== 'completed') return false;

    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    
    let matchesDuration = true;
    if (durationFilter !== 'all' && t.completedAt) {
      const daysTaken = differenceInCalendarDays(parseISO(t.completedAt), parseISO(t.createdAt));
      
      if (durationFilter === '0') matchesDuration = daysTaken === 0;
      else if (durationFilter === '1') matchesDuration = daysTaken === 1;
      else if (durationFilter === '2+') matchesDuration = daysTaken >= 2;
    }

    return matchesSearch && matchesCategory && matchesDuration;
  });

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative col-span-1 md:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <Input 
            placeholder="Search history..." 
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
          <Timer size={14} className="text-muted-foreground" />
          <Select value={durationFilter} onValueChange={setDurationFilter}>
            <SelectTrigger className="w-full h-10 text-[10px] font-bold uppercase tracking-widest border-white/10 bg-card/20">
              <SelectValue placeholder="Time Taken" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="uppercase text-[10px] font-bold">Any Duration</SelectItem>
              <SelectItem value="0" className="uppercase text-[10px] font-bold">Took 0 Days</SelectItem>
              <SelectItem value="1" className="uppercase text-[10px] font-bold">Took 1 Day</SelectItem>
              <SelectItem value="2+" className="uppercase text-[10px] font-bold">Took 2+ Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TaskSection 
        title="Achievement History" 
        icon={CheckCircle2} 
        count={completedTasks.length}
      >
        {completedTasks.length > 0 ? (
          completedTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-xl bg-white/5">
            <p className="text-muted-foreground text-sm italic">
              {search || categoryFilter !== 'all' || durationFilter !== 'all' ? "No completed tasks match your search." : "Your achievement wall is currently empty."}
            </p>
          </div>
        )}
      </TaskSection>
    </div>
  );
}
