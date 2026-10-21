import axios from 'axios';
import type {
  Task,
  TaskListResponse,
  CreateTaskRequest,
  TaskPriority,
} from '@shared/api.interface';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error?.message || '请求失败';
    return Promise.reject(new Error(message));
  },
);

export async function getTasks(priority?: TaskPriority): Promise<Task[]> {
  const params = priority ? { priority } : {};
  const response = await api.get<TaskListResponse>('/tasks', { params });
  return response.data.items;
}

export async function createTask(data: CreateTaskRequest): Promise<Task> {
  const response = await api.post<Task>('/tasks', data);
  return response.data;
}

export async function updateTaskStatus(id: string, completed: boolean): Promise<Task> {
  const response = await api.patch<Task>(`/tasks/${id}`, { completed });
  return response.data;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
