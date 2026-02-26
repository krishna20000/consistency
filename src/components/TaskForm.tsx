"use client"

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TaskFormProps {
  onAdd: (title: string) => void;
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 group">
      <div className="relative flex-1">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Planning today's task..."
          className="bg-card/50 border-white/10 h-12 focus:border-primary/50 transition-colors pr-10"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 pointer-events-none group-focus-within:text-primary/50 transition-colors">
          <Plus size={18} />
        </div>
      </div>
      <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg">
        Add Task
      </Button>
    </form>
  );
}
