import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, TaskStatus } from '@/lib/types';

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
    const currentToday = getTodayString();
    const newTask: Task = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      dueDate: currentToday,
      status: 'active',
      forwardedCount: 0,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  }, [getTodayString]);

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
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const tomorrowStr = `${year}-${month}-${day}`;

    setTasks(prev => prev.map(t => 
      t.id === id ? { 
        ...t, 
        dueDate: tomorrowStr, 
        forwardedCount: t.forwardedCount + 1 
      } : t
    ));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const stats = useMemo(() => {
    const currentToday = getTodayString();
    const todayTasks = tasks.filter(t => t.dueDate === currentToday);
    const total = todayTasks.length;
    const completed = todayTasks.filter(t => t.status === 'completed').length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, percentage };
  }, [tasks, getTodayString]);

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
