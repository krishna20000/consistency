export type TaskStatus = 'active' | 'completed';

export interface Task {
  id: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  status: TaskStatus;
  completedAt?: string; // ISO String
  forwardedCount: number;
  createdAt: string; // ISO String
}

export interface DayFlowStats {
  total: number;
  completed: number;
  pending: number;
  percentage: number;
}