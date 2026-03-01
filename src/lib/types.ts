
export type TaskStatus = 'active' | 'completed';

export type TaskCategory = 'Coding' | 'DSA' | 'Health(Exercise)' | 'General';

export interface Task {
  id: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  status: TaskStatus;
  category: TaskCategory;
  completedAt?: string; // ISO String
  forwardedCount: number;
  createdAt: string; // ISO String
}

export interface DayFlowStats {
  todayTotal: number;
  todayCompleted: number;
  todayPending: number;
  overallCompleted: number;
  overallPending: number;
  overallTotal: number;
  percentage: number;
  overallPercentage: number;
  streak: number;
  hasPriorityTasks: boolean;
}
