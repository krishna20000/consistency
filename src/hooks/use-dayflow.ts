import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, DayFlowStats } from '@/lib/types';

const STORAGE_KEY = 'dayflow_tasks_v1';

export function useDayFlow() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Helper to consistently get local date string YYYY-MM-DD
  const toLocalISO = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Use a stable reference for today's date string
  const todayString = useMemo(() => toLocalISO(new Date()), [toLocalISO]);

  // Initialize and carry forward overdue tasks
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedTasks: Task[] = JSON.parse(stored);
        const currentToday = toLocalISO(new Date());
        
        const updatedTasks = parsedTasks.map(task => {
          if (task.status === 'active' && task.dueDate < currentToday) {
            return {
              ...task,
              dueDate: currentToday,
              forwardedCount: task.forwardedCount + 1
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
  }, [toLocalISO]);

  // Sync to localStorage
  useEffect(() => {
    if (initialized && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, initialized]);

  const addTask = useCallback((title: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      dueDate: toLocalISO(tomorrow),
      status: 'active',
      forwardedCount: 0,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  }, [toLocalISO]);

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
        const [y, m, d] = t.dueDate.split('-').map(Number);
        const currentDueDate = new Date(y, m - 1, d);
        currentDueDate.setDate(currentDueDate.getDate() + 1);

        return { 
          ...t, 
          dueDate: toLocalISO(currentDueDate), 
          forwardedCount: t.forwardedCount + 1 
        };
      }
      return t;
    }));
  }, [toLocalISO]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const stats = useMemo((): DayFlowStats => {
    const currentTodayStr = toLocalISO(new Date());

    const todayCompleted = tasks.filter(t => {
      if (t.status !== 'completed' || !t.completedAt) return false;
      return toLocalISO(new Date(t.completedAt)) === currentTodayStr;
    }).length;

    const todayPending = tasks.filter(t => {
      if (t.status !== 'active') return false;
      const createdToday = toLocalISO(new Date(t.createdAt)) === currentTodayStr;
      const dueTodayOrOverdue = t.dueDate <= currentTodayStr;
      return createdToday || dueTodayOrOverdue;
    }).length;

    const todayTotal = todayCompleted + todayPending;

    const overallCompleted = tasks.filter(t => t.status === 'completed').length;
    const overallPending = tasks.filter(t => t.status === 'active').length;
    const overallTotal = overallCompleted + overallPending;
    
    const percentage = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;
    const overallPercentage = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;

    // Calculate Streak
    const completedDates = Array.from(new Set(
      tasks
        .filter(t => t.status === 'completed' && t.completedAt)
        .map(t => toLocalISO(new Date(t.completedAt!)))
    )).sort((a, b) => b.localeCompare(a));

    let streak = 0;
    if (completedDates.length > 0) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = toLocalISO(yesterday);

      const hasActivityToday = completedDates[0] === currentTodayStr;
      const hasActivityYesterday = completedDates.includes(yesterdayStr);

      if (hasActivityToday || hasActivityYesterday) {
        streak = 1;
        let checkDate = new Date(hasActivityToday ? new Date() : yesterday);
        
        // Walk backwards
        while (true) {
          checkDate.setDate(checkDate.getDate() - 1);
          const checkDateStr = toLocalISO(checkDate);
          if (completedDates.includes(checkDateStr)) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    return { 
      todayTotal, 
      todayCompleted, 
      todayPending, 
      overallCompleted, 
      overallPending, 
      overallTotal,
      percentage,
      overallPercentage,
      streak
    };
  }, [tasks, toLocalISO]);

  return {
    tasks,
    addTask,
    completeTask,
    forwardTask,
    deleteTask,
    stats,
    todayString,
    initialized
  };
}
