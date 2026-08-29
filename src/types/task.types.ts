export type PriorityLevel = 'high' | 'medium' | 'low';

export type TaskCategory = 'Work' | 'Study' | 'Health' | 'Personal' | 'Project' | string;

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
  position: number;
  createdAt: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: PriorityLevel;
  category: TaskCategory;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  isCompleted: boolean;
  completedAt?: string;
  position: number;
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
}

export type TaskFilterTab = 'all' | 'today' | 'upcoming' | 'high_priority' | 'completed';
