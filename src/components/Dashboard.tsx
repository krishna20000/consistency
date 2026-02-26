"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DayFlowStats } from '@/lib/types';
import { ClipboardList, CheckSquare, Clock, LayoutGrid, History, Zap, BarChart3, Flame } from 'lucide-react';

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/30 border-white/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BarChart3 size={48} />
          </div>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold mb-1">Total Tasks</p>
            <h2 className="text-3xl font-bold text-foreground">{stats.overallTotal}</h2>
          </CardContent>
        </Card>

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

      <div className="space-y-6">
        <div className="bg-card/30 rounded-xl p-6 border border-white/5">
          <div className="flex justify-between items-end mb-4">
            <div className="flex items-center gap-2">
              <Zap className="text-primary" size={18} />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest">Today's Momentum</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Success rate for today</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-primary">{stats.percentage}%</span>
          </div>
          <div className="relative">
            <Progress value={stats.percentage} className="h-4 bg-secondary/30 rounded-full" />
          </div>
        </div>

        <div className="bg-card/30 rounded-xl p-6 border border-white/5">
          <div className="flex justify-between items-end mb-4">
            <div className="flex items-center gap-2">
              <History className="text-accent" size={18} />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest">Total Momentum</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">All-time success rate</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-accent">{stats.overallPercentage}%</span>
          </div>
          <div className="relative">
            <Progress 
              value={stats.overallPercentage} 
              className="h-4 bg-secondary/30 rounded-full progress-glow" 
              indicatorClassName="bg-accent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
