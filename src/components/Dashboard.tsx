"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DayFlowStats } from '@/lib/types';
import { ClipboardList, CheckSquare, Clock, LayoutGrid, History } from 'lucide-react';

interface DashboardProps {
  stats: DayFlowStats;
}

export function Dashboard({ stats }: DashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-white/5 glow-primary overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ClipboardList size={64} />
          </div>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mb-1">Today's Total</p>
            <h2 className="text-4xl font-bold text-foreground">{stats.todayTotal}</h2>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/5 glow-accent overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-accent">
            <CheckSquare size={64} />
          </div>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mb-1">Today's Done</p>
            <h2 className="text-4xl font-bold text-accent">{stats.todayCompleted}</h2>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clock size={64} />
          </div>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mb-1">Today's Pending</p>
            <h2 className="text-4xl font-bold text-foreground">{stats.todayPending}</h2>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-primary">
            <History size={48} />
          </div>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mb-1">Overall Completed</p>
            <h2 className="text-3xl font-bold text-primary">{stats.overallCompleted}</h2>
          </CardContent>
        </Card>

        <Card className="bg-accent/5 border-accent/10 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-accent">
            <LayoutGrid size={48} />
          </div>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mb-1">Total Active Tasks</p>
            <h2 className="text-3xl font-bold text-accent">{stats.overallPending}</h2>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card/30 rounded-xl p-6 border border-white/5">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Today's Momentum</h3>
            <p className="text-muted-foreground text-sm">Focus on what's due today.</p>
          </div>
          <span className="text-2xl font-bold text-accent">{stats.percentage}%</span>
        </div>
        <div className="relative">
          <Progress value={stats.percentage} className="h-6 bg-secondary/50 rounded-full" />
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ display: stats.percentage > 5 ? 'flex' : 'none' }}
          >
            <span className="text-[10px] font-bold text-primary-foreground drop-shadow-sm uppercase tracking-widest">
              Daily Success Rate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
