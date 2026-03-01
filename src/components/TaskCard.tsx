"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Task } from '@/lib/types';
import { Check, ArrowRight, Forward, Trash2, CalendarDays, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { differenceInCalendarDays, parseISO } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onComplete?: (id: string) => void;
  onForward?: (id: string) => void;
  onDelete: (id: string) => void;
  isToday?: boolean;
  showDueDate?: boolean;
}

export function TaskCard({ task, onComplete, onForward, onDelete, isToday, showDueDate = true }: TaskCardProps) {
  const isCompleted = task.status === 'completed';
  
  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysTaken = () => {
    if (!task.completedAt) return null;
    // Calculate difference in full calendar days
    const days = differenceInCalendarDays(
      parseISO(task.completedAt),
      parseISO(task.createdAt)
    );
    // Ensure we don't show negative days in case of clock drift
    return days < 0 ? 0 : days;
  };

  const daysTaken = getDaysTaken();

  return (
    <Card className={cn(
      "group bg-card/40 border-white/5 transition-all duration-300 hover:bg-card/60",
      isCompleted && "opacity-75 border-accent/20",
      isToday && !isCompleted && showDueDate && "border-primary/20 glow-primary"
    )}>
      <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <h4 className={cn(
              "text-lg font-medium tracking-tight break-words",
              isCompleted && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h4>
            {isToday && !isCompleted && showDueDate && (
              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">
                Today
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
            <span className="flex items-center gap-1">
              <CalendarDays size={12} className="text-muted-foreground/50" />
              Created {formatDate(task.createdAt)}
            </span>

            {isCompleted ? (
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1 text-accent">
                  <Check size={12} />
                  Completed at {formatTime(task.completedAt)}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground/60 border-l border-white/10 pl-4">
                  <Timer size={12} />
                  Took {daysTaken} {daysTaken === 1 ? 'Day' : 'Days'}
                </span>
              </div>
            ) : (
              <>
                {showDueDate && (
                  <span className="flex items-center gap-1">
                    Due {task.dueDate === new Date().toISOString().split('T')[0] ? 'Today' : task.dueDate}
                  </span>
                )}
                {task.forwardedCount > 0 && (
                  <span className="flex items-center gap-1 text-primary/70">
                    <Forward size={12} />
                    Forwarded {task.forwardedCount}x
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
          {!isCompleted && (
            <>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground gap-1.5 h-8"
                onClick={() => onComplete?.(task.id)}
              >
                <Check size={14} />
                Done
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-muted-foreground hover:text-foreground gap-1.5 h-8"
                onClick={() => onForward?.(task.id)}
              >
                <ArrowRight size={14} />
                +1 Day
              </Button>
            </>
          )}
          <Button 
            size="icon" 
            variant="ghost" 
            className="text-muted-foreground hover:text-destructive transition-colors h-8 w-8"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}