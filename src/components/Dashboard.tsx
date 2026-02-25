"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DayFlowStats } from '@/lib/types';
import { ClipboardList, CheckSquare, Clock } from 'lucide-react';

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
            <p className="text-muted-foreground text-sm font-medium mb-1">Total Tasks Today</p>
            <h2 className="text-4xl font-bold text-foreground">{stats.total}</h2>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/5 glow-accent overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-accent">
            <CheckSquare size={64} />
          </div>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-sm font-medium mb-1">Completed Today</p>
            <h2 className="text-4xl font-bold text-accent">{stats.completed}</h2>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clock size={64} />
          </div>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-sm font-medium mb-1">Pending Today</p>
            <h2 className="text-4xl font-bold text-foreground">{stats.pending}</h2>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card/30 rounded-xl p-6 border border-white/5">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Daily Progress</h3>
            <p className="text-muted-foreground text-sm">Keep up the momentum!</p>
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
              Success Rate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}