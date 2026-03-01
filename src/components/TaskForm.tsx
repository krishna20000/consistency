
"use client"

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskCategory } from '@/lib/types';
import { Plus } from 'lucide-react';

interface TaskFormProps {
  onAdd: (title: string, category: TaskCategory) => void;
}

const categories: TaskCategory[] = ['Coding', 'DSA', 'Health(Exercise)', 'General'];

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Coding');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), category);
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 group">
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
      
      <Select value={category} onValueChange={(val) => setCategory(val as TaskCategory)}>
        <SelectTrigger className="w-full md:w-[140px] h-12 bg-card/50 border-white/10 uppercase font-bold text-[10px] tracking-widest">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat} className="uppercase text-[10px] font-bold tracking-widest">
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg h-12">
        Add Task
      </Button>
    </form>
  );
}
