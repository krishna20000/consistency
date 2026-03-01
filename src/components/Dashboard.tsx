"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DayFlowStats } from '@/lib/types';
import { ClipboardList, CheckSquare, Clock, LayoutGrid, History, BarChart3, Flame, Activity, Globe, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardProps {
  stats: DayFlowStats;
}

export function Dashboard({ stats }: DashboardProps) {
  const isUrgent = stats.hasPriorityTasks;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={cn(
          "bg-card/50 border-white/5 overflow-hidden relative transition-all duration-500",
          isUrgent ? "border-destructive/30 glow-destructive" : "glow-primary"
        )}>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ClipboardList size={64} />
          </div>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mb-1">Today's Total</p>
            <h2 className={cn("text-4xl font-bold", isUrgent ? "text-destructive" : "text-foreground")}>
              {stats.todayTotal}
            </h2>
          </CardContent>
        </Card>

        <Card className={cn(
          "bg-card/50 border-white/5 overflow-hidden relative transition-all duration-500",
          isUrgent ? "border-destructive/30 glow-destructive" : "glow-accent"
        )}>
          <div className={cn("absolute top-0 right-0 p-4 opacity-10", isUrgent ? "text-destructive" : "text-accent")}>
            <CheckSquare size={64} />
          </div>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mb-1">Today's Done</p>
            <h2 className={cn("text-4xl font-bold", isUrgent ? "text-destructive" : "text-accent")}>
              {stats.todayCompleted}
            </h2>
          </CardContent>
        </Card>

        <Card className={cn(
          "bg-card/50 border-white/5 overflow-hidden relative transition-all duration-500",
          isUrgent ? "border-destructive/30 glow-destructive bg-destructive/5" : ""
        )}>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clock size={64} />
          </div>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mb-1">Today's Pending</p>
            <h2 className={cn("text-4xl font-bold", isUrgent ? "text-destructive" : "text-foreground")}>
              {stats.todayPending}
            </h2>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={cn(
          "bg-card/30 border-white/5 overflow-hidden relative transition-all duration-500",
          isUrgent && "border-destructive/20"
        )}>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BarChart3 size={48} />
          </div>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mb-1">Total Tasks</p>
            <h2 className={cn("text-3xl font-bold", isUrgent ? "text-destructive/80" : "text-foreground")}>
              {stats.overallTotal}
            </h2>
          </CardContent>
        </Card>

        <Card className={cn(
          "bg-primary/5 border-primary/10 overflow-hidden relative transition-all duration-500",
          isUrgent && "bg-destructive/5 border-destructive/20"
        )}>
          <div className={cn("absolute top-0 right-0 p-4 opacity-10", isUrgent ? "text-destructive" : "text-primary")}>
            <History size={48} />
          </div>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mb-1">Overall Completed</p>
            <h2 className={cn("text-3xl font-bold", isUrgent ? "text-destructive" : "text-primary")}>
              {stats.overallCompleted}
            </h2>
          </CardContent>
        </Card>

        <Card className={cn(
          "bg-accent/5 border-accent/10 overflow-hidden relative transition-all duration-500",
          isUrgent && "bg-destructive/5 border-destructive/20"
        )}>
          <div className={cn("absolute top-0 right-0 p-4 opacity-10", isUrgent ? "text-destructive" : "text-accent")}>
            <LayoutGrid size={48} />
          </div>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mb-1">Total Active Tasks</p>
            <h2 className={cn("text-3xl font-bold", isUrgent ? "text-destructive" : "text-accent")}>
              {stats.overallPending}
            </h2>
          </CardContent>
        </Card>
      </div>

      <div className={cn(
        "momentum-container space-y-8 bg-card/20 border border-white/5 p-6 rounded-xl transition-all duration-500",
        isUrgent && "border-destructive/30 bg-destructive/5"
      )}>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={cn("p-1.5 rounded-md", isUrgent ? "bg-destructive/10" : "bg-primary/10")}>
                {isUrgent ? (
                  <AlertTriangle size={14} className="text-destructive animate-pulse" />
                ) : (
                  <Activity size={14} className="text-primary" />
                )}
              </div>
              <p className={cn(
                "text-[10px] uppercase tracking-[0.25em] font-black",
                isUrgent ? "text-destructive" : "text-primary/80"
              )}>
                {isUrgent ? "Urgent Momentum" : "Daily Momentum"}
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={cn(
                "text-2xl font-black tracking-tighter transition-colors",
                isUrgent ? "text-destructive" : "text-primary"
              )}>
                {stats.percentage}
              </span>
              <span className={cn(
                "text-[10px] font-bold uppercase",
                isUrgent ? "text-destructive/50" : "text-primary/50"
              )}>%</span>
            </div>
          </div>
          <div className="relative pt-1">
            <Progress 
              value={stats.percentage} 
              className="h-3 bg-white/5 rounded-full overflow-hidden" 
              indicatorClassName={cn(
                "transition-all duration-1000 ease-in-out",
                isUrgent ? "progress-glow-destructive bg-destructive" : "progress-glow-primary bg-primary"
              )} 
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-accent/10">
                <Globe size={14} className="text-accent" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.25em] font-black text-accent/80">Lifetime Momentum</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-accent tracking-tighter">{stats.overallPercentage}</span>
              <span className="text-[10px] font-bold text-accent/50 uppercase">%</span>
            </div>
          </div>
          <div className="relative pt-1">
            <Progress 
              value={stats.overallPercentage} 
              className="h-3 bg-white/5 rounded-full overflow-hidden" 
              indicatorClassName="progress-glow-accent bg-accent transition-all duration-1000 ease-in-out" 
            />
          </div>
        </div>
      </div>

      {stats.streak > 0 && (
        <Card className="bg-orange-500/10 border-orange-500/20 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 text-orange-500/10 group-hover:text-orange-500/20 transition-colors">
            <Flame size={80} className="animate-pulse" />
          </div>
          <CardContent className="p-8 flex items-center gap-6">
            <div className="bg-orange-500 rounded-full p-4 shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              <Flame size={32} className="text-white fill-current" />
            </div>
            <div>
              <p className="text-orange-500 text-[10px] uppercase tracking-[0.2em] font-black mb-1">Consistency Streak</p>
              <h2 className="text-5xl font-black text-foreground tracking-tighter">
                {stats.streak} <span className="text-xl font-bold text-muted-foreground uppercase ml-1">Days</span>
              </h2>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}