import { useEffect, useState } from 'react';
import { Plus, Check, Trash2, ListTodo } from 'lucide-react';
import { toast } from 'sonner';
import type { Task, TaskPriority } from '@shared/api.interface';
import { PRIORITY_LABEL } from '@shared/api.interface';
import {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
} from '@client/src/api/tasks';

const priorityColors: Record<TaskPriority, string> = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-green-100 text-green-700 border-green-200',
};

const priorityOrder: TaskPriority[] = ['high', 'medium', 'low'];

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [filter, setFilter] = useState<TaskPriority | 'all'>('all');
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async (priorityFilter: TaskPriority | 'all' = 'all') => {
    setLoading(true);
    try {
      const data = await getTasks(
        priorityFilter === 'all' ? undefined : priorityFilter,
      );
      setTasks(data);
    } catch (error) {
      console.error('获取任务列表失败', error);
      toast.error(error instanceof Error ? error.message : '获取任务列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(filter === 'all' ? undefined : filter);
  }, [filter]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const newTask = await createTask({ title: title.trim(), priority });
      setTasks((prev) => [newTask, ...prev]);
      setTitle('');
      setPriority('medium');
      toast.success('任务添加成功');
    } catch (error) {
      console.error('添加任务失败', error);
      toast.error(error instanceof Error ? error.message : '添加任务失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      const updated = await updateTaskStatus(id, !completed);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updated : t)),
      );
    } catch (error) {
      console.error('更新任务状态失败', error);
      toast.error(error instanceof Error ? error.message : '更新任务状态失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success('任务已删除');
    } catch (error) {
      console.error('删除任务失败', error);
      toast.error(error instanceof Error ? error.message : '删除任务失败');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-white mb-4">
            <ListTodo className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            智能任务管理
          </h1>
          <p className="text-slate-500 mt-2">高效管理你的每日任务</p>
        </div>

        <form
          onSubmit={handleAdd}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入新任务..."
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition cursor-pointer"
            >
              {priorityOrder.map((p) => (
                <option key={p} value={p}>
                  优先级：{PRIORITY_LABEL[p]}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="px-6 py-2.5 rounded-lg bg-primary text-white font-medium inline-flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Plus className="w-4 h-4" />
              添加
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-slate-500">筛选：</span>
          <div className="flex gap-1 bg-white rounded-lg p-1 border border-slate-200">
            {(['all', ...priorityOrder] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm rounded-md transition ${
                  filter === f
                    ? 'bg-primary text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f === 'all' ? '全部' : PRIORITY_LABEL[f]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-slate-400">加载中...</div>
          ) : tasks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="text-slate-300 mb-2">
                <ListTodo className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-slate-500">暂无任务，添加一个吧</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 hover:shadow-sm transition"
              >
                <button
                  onClick={() => handleToggle(task.id, task.completed)}
                  aria-label={task.completed ? '标记为未完成' : '标记为已完成'}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                    task.completed
                      ? 'bg-primary border-primary text-white'
                      : 'border-slate-300 hover:border-primary'
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-slate-800 ${
                      task.completed ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}
                    >
                      {PRIORITY_LABEL[task.priority]}优先级
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(task.createdAt).toLocaleString('zh-CN', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(task.id)}
                  aria-label="删除任务"
                  className="flex-shrink-0 w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
