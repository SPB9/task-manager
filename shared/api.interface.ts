export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  completed: boolean;
  createdAt: string;
}

export interface TaskListResponse {
  items: Task[];
}

export interface CreateTaskRequest {
  title: string;
  priority: TaskPriority;
}

export interface UpdateTaskRequest {
  title?: string;
  priority?: TaskPriority;
  completed?: boolean;
}

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  high: '高',
  medium: '中',
  low: '低',
};
