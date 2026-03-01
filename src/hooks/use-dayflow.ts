"use client"

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, DayFlowStats, TaskCategory } from '@/lib/types';
import { format, parseISO, addDays, subDays, isToday, isSameDay } from 'date-fns';

const STORAGE_KEY = 'consistency_lab_tasks_v3';

export function useDayFlow() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedTasks: Task[] = JSON.parse(stored);
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        
        const updatedTasks = parsedTasks.map(task => {
          if (task.status === 'active' && task.dueDate < todayStr) {
            return {
              ...task,
              dueDate: todayStr,
              forwardedCount: (task.forwardedCount || 0) + 1
            };
          }
          return task;
        });

        setTasks(updatedTasks);
      } catch (e) {
        setTasks([]);
      }
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, initialized]);

  const addTask = useCallback((title: string, category: TaskCategory = 'General') => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    
    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title,
      category,
      dueDate: todayStr,
      status: 'active',
      forwardedCount: 0,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const restoreTask = useCallback((task: Task) => {
    setTasks(prev => {
      if (prev.find(t => t.id === task.id)) return prev;
      return [task, ...prev];
    });
  }, []);

  const completeTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { 
        ...t, 
        status: 'completed', 
        completedAt: new Date().toISOString() 
      } : t
    ));
  }, []);

  const forwardTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const currentDueDate = parseISO(t.dueDate);
        const nextDueDate = addDays(currentDueDate, 1);

        return { 
          ...t, 
          dueDate: format(nextDueDate, 'yyyy-MM-dd'), 
          forwardedCount: (t.forwardedCount || 0) + 1 
        };
      }
      return t;
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    return taskToDelete;
  }, [tasks]);

  const stats = useMemo((): DayFlowStats => {
    if (!initialized) {
      return {
        todayTotal: 0, todayCompleted: 0, todayPending: 0,
        overallCompleted: 0, overallPending: 0, overallTotal: 0,
        percentage: 0, overallPercentage: 0, streak: 0,
        hasPriorityTasks: false
      };
    }

    const now = new Date();
    const todayStr = format(now, 'yyyy-MM-dd');

    const todayCompleted = tasks.filter(t => {
      if (t.status !== 'completed' || !t.completedAt) return false;
      return isSameDay(parseISO(t.completedAt), now);
    }).length;

    const todayPending = tasks.filter(t => {
      if (t.status !== 'active') return false;
      const isCreatedToday = isToday(parseISO(t.createdAt));
      const isDueTodayOrOverdue = t.dueDate <= todayStr;
      return isCreatedToday || isDueTodayOrOverdue;
    }).length;

    const todayTotal = todayCompleted + todayPending;
    const overallCompleted = tasks.filter(t => t.status === 'completed').length;
    const overallPending = tasks.filter(t => t.status === 'active').length;
    const overallTotal = overallCompleted + overallPending;
    
    const percentage = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;
    const overallPercentage = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;
    const hasPriorityTasks = tasks.some(t => t.status === 'active' && t.forwardedCount > 2);

    const completedDates = Array.from(new Set(
      tasks
        .filter(t => t.status === 'completed' && t.completedAt)
        .map(t => format(parseISO(t.completedAt!), 'yyyy-MM-dd'))
    )).sort((a, b) => b.localeCompare(a));

    let streak = 0;
    if (completedDates.length > 0) {
      const yesterdayStr = format(subDays(now, 1), 'yyyy-MM-dd');
      const hasActivityToday = completedDates[0] === todayStr;
      const hasActivityYesterday = completedDates.includes(yesterdayStr);

      if (hasActivityToday || hasActivityYesterday) {
        streak = 1;
        let checkDate = hasActivityToday ? now : subDays(now, 1);
        while (true) {
          checkDate = subDays(checkDate, 1);
          const checkDateStr = format(checkDate, 'yyyy-MM-dd');
          if (completedDates.includes(checkDateStr)) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    return { 
      todayTotal, todayCompleted, todayPending, 
      overallCompleted, overallPending, overallTotal,
      percentage, overallPercentage, streak, hasPriorityTasks
    };
  }, [tasks, initialized]);

  return {
    tasks,
    addTask,
    restoreTask,
    completeTask,
    forwardTask,
    deleteTask,
    stats,
    initialized
  };
}
