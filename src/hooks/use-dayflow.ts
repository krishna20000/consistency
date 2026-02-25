import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, DayFlowStats } from '@/lib/types';

const STORAGE_KEY = 'dayflow_tasks_v1';

export function useDayFlow() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Get today's date in YYYY-MM-DD format (Local Time)
  const getTodayString = useCallback(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const getTomorrowString = useCallback(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const todayString = useMemo(() => getTodayString(), [getTodayString]);

  // Initialize and check for "new day" logic
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedTasks: Task[] = JSON.parse(stored);
        const currentToday = getTodayString();
        
        // Process daily logic: carry forward pending tasks from previous days to today
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
        console.error('Failed to parse tasks', e);
        setTasks([]);
      }
    }
    setInitialized(true);
  }, [getTodayString]);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    if (initialized && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, initialized]);

  const addTask = useCallback((title: string) => {
    const tomorrowStr = getTomorrowString();
    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      dueDate: tomorrowStr,
      status: 'active',
      forwardedCount: 0,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  }, [getTomorrowString]);

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
        const currentDueDate = new Date(t.dueDate);
        currentDueDate.setDate(currentDueDate.getDate() + 1);
        const year = currentDueDate.getFullYear();
        const month = String(currentDueDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDueDate.getDate()).padStart(2, '0');
        const newDateStr = `${year}-${month}-${day}`;

        return { 
          ...t, 
          dueDate: newDateStr, 
          forwardedCount: t.forwardedCount + 1 
        };
      }
      return t;
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const stats = useMemo((): DayFlowStats => {
    // Today's completed tasks are those with a completion timestamp matching today
    const todayCompleted = tasks.filter(t => 
      t.status === 'completed' && 
      t.completedAt?.startsWith(todayString)
    ).length;

    // Today's pending tasks are active tasks due today OR tasks created today (planning ahead)
    const todayPending = tasks.filter(t => 
      t.status === 'active' && 
      (t.dueDate <= todayString || t.createdAt.startsWith(todayString))
    ).length;

    const todayTotal = todayCompleted + todayPending;

    const overallCompleted = tasks.filter(t => t.status === 'completed').length;
    const overallPending = tasks.filter(t => t.status === 'active').length;
    const overallTotal = overallCompleted + overallPending;
    
    const percentage = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;
    const overallPercentage = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;

    return { 
      todayTotal, 
      todayCompleted, 
      todayPending, 
      overallCompleted, 
      overallPending, 
      percentage,
      overallPercentage
    };
  }, [tasks, todayString]);

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
