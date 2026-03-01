"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ListTodo, CheckCircle2, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard', icon: LayoutGrid },
    { href: '/tasks', label: 'Tasks', icon: ListTodo },
    { href: '/completed', label: 'Completed', icon: CheckCircle2 },
  ];

  return (
    <nav className="flex items-center gap-1 bg-card/30 p-1 rounded-lg border border-white/5">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2 px-3 md:px-4 py-2 rounded-md text-[10px] md:text-sm font-bold uppercase tracking-widest transition-all",
              isActive 
                ? "bg-primary text-primary-foreground shadow-lg" 
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
