"use client"

import React, { useState } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { TaskCard } from '@/components/TaskCard';
import { TaskSection } from '@/components/TaskSection';
import { ProductivityInsight } from '@/components/ProductivityInsight';
import { useDayFlow } from '@/hooks/use-dayflow';
import { AlertTriangle, Loader2, Settings2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

export default function DashboardPage() {
  const { 
    tasks, 
    completeTask, 
    forwardTask, 
    deleteTask, 
    restoreTask,
    stats, 
    initialized 
  } = useDayFlow();

  const { toast } = useToast();
  const [minForwarded, setMinForwarded] = useState<number>(3);

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
          Loading Dashboard...
        </div>
      </div>
    );
  }

  const priorityTasks = tasks.filter(t => t.status === 'active' && t.forwardedCount >= minForwarded);

  return (
    <div className="space-y-10">
      <ProductivityInsight stats={stats} tasks={tasks} />

      <Dashboard stats={{...stats, hasPriorityTasks: priorityTasks.length > 0}} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className={priorityTasks.length > 0 ? "text-destructive animate-pulse" : "text-muted-foreground/40"} size={20} />
            <h2 className="text-lg font-bold uppercase tracking-tight">Priority Focus</h2>
          </div>
          
          <div className="flex items-center gap-2 bg-card/20 px-3 py-1.5 rounded-lg border border-white/5">
            <Settings2 size={12} className="text-muted-foreground" />
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Min Forwarded:</span>
            <Input 
              type="number" 
              value={minForwarded} 
              onChange={(e) => setMinForwarded(Number(e.target.value))}
              className="w-12 h-6 text-xs p-1 bg-transparent border-white/10"
              min={0}
            />
          </div>
        </div>

        <TaskSection 
          title={`Critical Tasks (${minForwarded}+ days forwarded)`} 
          icon={AlertTriangle} 
          count={priorityTasks.length}
        >
          {priorityTasks.length > 0 ? (
            priorityTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onComplete={completeTask} 
                onForward={forwardTask} 
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-xl bg-white/5">
              <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">
                No tasks meet the current priority threshold.
              </p>
            </div>
          )}
        </TaskSection>
      </div>
    </div>
  );
}
