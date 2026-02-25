"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Task } from '@/lib/types';
import { Check, ArrowRight, Forward, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onComplete?: (id: string) => void;
  onForward?: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onComplete, onForward, onDelete }: TaskCardProps) {
  const isCompleted = task.status === 'completed';
  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className={cn(
      "group bg-card/40 border-white/5 transition-all duration-300 hover:bg-card/60",
      isCompleted && "opacity-75 border-accent/20"
    )}>
      <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 space-y-1">
          <h4 className={cn(
            "text-lg font-medium tracking-tight break-words",
            isCompleted && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h4>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {isCompleted ? (
              <span className="flex items-center gap-1 text-accent">
                <Check size={12} />
                Completed at {formatTime(task.completedAt)}
              </span>
            ) : (
              task.forwardedCount > 0 && (
                <span className="flex items-center gap-1 text-primary/70 bg-primary/10 px-2 py-0.5 rounded-full">
                  <Forward size={12} />
                  Forwarded {task.forwardedCount} {task.forwardedCount === 1 ? 'time' : 'times'}
                </span>
              )
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
          {!isCompleted && (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground gap-1.5"
                onClick={() => onComplete?.(task.id)}
              >
                <Check size={16} />
                Done
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-muted-foreground hover:text-foreground gap-1.5"
                onClick={() => onForward?.(task.id)}
              >
                <ArrowRight size={16} />
                Tomorrow
              </Button>
            </>
          )}
          <Button 
            size="icon" 
            variant="ghost" 
            className="text-muted-foreground hover:text-destructive transition-colors h-8 w-8"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}