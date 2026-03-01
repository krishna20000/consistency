"use client"

import React, { useState } from 'react';
import { TaskCard } from '@/components/TaskCard';
import { TaskSection } from '@/components/TaskSection';
import { useDayFlow } from '@/hooks/use-dayflow';
import { CheckCircle2, Loader2, Trophy, Search, Filter } from 'lucide-react';
import { Dashboard } from '@/components/Dashboard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

export default function CompletedPage() {
  const { 
    tasks, 
    deleteTask, 
    restoreTask,
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
          Loading History...
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    return t.status === 'completed' && matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10">
      <Dashboard stats={stats} />

      <div className="flex flex-col md:flex-row items-center gap-3 bg-card/20 p-4 rounded-xl border border-white/5">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <Input 
            placeholder="Search completed history..." 
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
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-xl bg-white/5 space-y-4">
            <div className="flex justify-center">
              <Trophy className="text-muted-foreground/20" size={48} />
            </div>
            <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold">
              {search || categoryFilter !== 'all' ? "No completed tasks match your search." : "Your achievement wall is empty. Get some things done!"}
            </p>
          </div>
        )}
      </TaskSection>
    </div>
  );
}
