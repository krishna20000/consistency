"use client"

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TaskSectionProps {
  title: string;
  icon?: LucideIcon;
  count?: number;
  children: React.ReactNode;
}

export function TaskSection({ title, icon: Icon, count, children }: TaskSectionProps) {
  if (count === 0 && title !== "Today's Tasks") return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="text-primary" size={18} />}
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{title}</h3>
        </div>
        {count !== undefined && (
          <span className="text-xs font-medium bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3">
        {children}
      </div>
    </div>
  );
}