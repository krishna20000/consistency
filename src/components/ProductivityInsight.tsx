"use client"

import React from 'react';
import { AlertCircle, Zap, TrendingUp, Info } from 'lucide-react';
import { DayFlowStats, Task } from '@/lib/types';

interface ProductivityInsightProps {
  stats: DayFlowStats;
  tasks: Task[];
}

export function ProductivityInsight({ stats, tasks }: ProductivityInsightProps) {
  const insights = [];

  if (stats.hasPriorityTasks) {
    insights.push({
      id: 'delayed',
      icon: AlertCircle,
      text: "You've delayed some tasks multiple times. focus on clearing the backlog.",
      color: 'text-destructive',
      bg: 'bg-destructive/10',
      border: 'border-destructive/20'
    });
  }

  if (stats.streak === 0 && stats.overallCompleted > 0) {
    insights.push({
      id: 'streak-broken',
      icon: AlertCircle,
      text: "Streak paused. Let's rebuild that momentum today.",
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20'
    });
  } 
  else if (stats.streak >= 2) {
    insights.push({
      id: 'streak-active',
      icon: Zap,
      text: `Momentum detected: ${stats.streak} day streak. keep it up.`,
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20'
    });
  }

  if (stats.percentage === 100 && stats.todayTotal > 0) {
    insights.push({
      id: 'perfect-day',
      icon: TrendingUp,
      text: "Peak performance: All daily goals secured.",
      color: 'text-accent',
      bg: 'bg-accent/10',
      border: 'border-accent/20'
    });
  }

  if (insights.length === 0 && stats.todayTotal === 0) {
    insights.push({
      id: 'start',
      icon: Info,
      text: "Ready for a new session? Add your first goal in the tasks tab.",
      color: 'text-muted-foreground',
      bg: 'bg-card/30',
      border: 'border-white/5'
    });
  }

  if (insights.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-px flex-1 bg-white/5" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">System Insights</span>
        <div className="h-px flex-1 bg-white/5" />
      </div>
      <div className="grid grid-cols-1 gap-2">
        {insights.map((insight) => (
          <div 
            key={insight.id} 
            className={`flex items-center gap-3 p-3 rounded-lg border ${insight.border} ${insight.bg} transition-all duration-300 animate-in fade-in slide-in-from-top-1`}
          >
            <insight.icon className={insight.color} size={14} />
            <p className={`text-[11px] font-bold uppercase tracking-wider ${insight.color}`}>
              {insight.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
