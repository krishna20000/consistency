import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, TaskStatus } from '@/lib/types';

const STORAGE_KEY = 'dayflow_tasks';

export function useDayFlow() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const getTodayString = useCallback(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Initialize and check for "new day" logic
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedTasks: Task[] = JSON.parse(stored);
        const todayStr = getTodayString();
        
        // Process daily logic: carry forward pending tasks to today
        const updatedTasks = parsedTasks.map(task => {
          if (task.status === 'active' && task.dueDate < todayStr) {
            // This task was missed from a previous day
            return {
              ...task,
              dueDate: todayStr,
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
    if (initialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, initialized]);

  const addTask = useCallback((title: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      dueDate: getTodayString(),
      status: 'active',
      forwardedCount: 0,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
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
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

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
    const todayStr = getTodayString();
    const todayTasks = tasks.filter(t => t.dueDate === todayStr);
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
    todayString: getTodayString(),
    initialized
  };
}