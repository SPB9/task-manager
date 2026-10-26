import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import type { Task, TaskPriority, TaskListResponse, CreateTaskRequest } from '../shared/api.interface';

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('错误：请在 .env 中配置 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

app.get('/api/tasks', async (req, res) => {
  try {
    const priority = req.query.priority as string | undefined;
    let query = supabase.from('tasks').select('*');

    if (priority && ['high', 'medium', 'low'].includes(priority)) {
      query = query.eq('priority', priority);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    const items: Task[] = (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      priority: row.priority as TaskPriority,
      completed: row.completed,
      createdAt: row.created_at,
    }));

    const response: TaskListResponse = { items };
    res.json(response);
  } catch (error: any) {
    console.error('获取任务失败:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error?.message || String(error) } });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, priority } = req.body as CreateTaskRequest;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: '任务标题不能为空' } });
    }
    if (!priority || !['high', 'medium', 'low'].includes(priority)) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: `无效的优先级：${priority || '空'}，必须是 high / medium / low` } });
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({ title: title.trim(), priority })
      .select()
      .single();

    if (error) throw error;

    const task: Task = {
      id: data.id,
      title: data.title,
      priority: data.priority as TaskPriority,
      completed: data.completed,
      createdAt: data.created_at,
    };

    res.status(201).json(task);
  } catch (error: any) {
    console.error('创建任务失败:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error?.message || String(error) } });
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body as { completed?: boolean };

    if (completed === undefined) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: '未提供可更新字段' } });
    }

    const { data, error } = await supabase
      .from('tasks')
      .update({ completed })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: '任务不存在' } });
    }

    const task: Task = {
      id: data.id,
      title: data.title,
      priority: data.priority as TaskPriority,
      completed: data.completed,
      createdAt: data.created_at,
    };

    res.json(task);
  } catch (error: any) {
    if (error?.code === 'PGRST116' || error?.message?.includes('0 rows')) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: '任务不存在' } });
    }
    console.error('更新任务失败:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error?.message || String(error) } });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .select('id');

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: '任务不存在' } });
    }

    res.status(204).send();
  } catch (error: any) {
    if (error?.code === 'PGRST116') {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: '任务不存在' } });
    }
    console.error('删除任务失败:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: error?.message || String(error) } });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;
