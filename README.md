# 智能任务管理系统

一个简洁美观的任务管理 Web 应用，基于 React + Express + Supabase 构建。

## 功能特性

- ✅ 添加任务（支持高/中/低三级优先级）
- ✅ 任务列表展示（标题、优先级、完成状态、创建时间）
- ✅ 一键切换完成/未完成状态（已完成任务显示删除线）
- ✅ 删除任务
- ✅ 按优先级筛选（全部/高/中/低）
- ✅ 任务按创建时间倒序排列
- ✅ 中文界面，简洁美观

## 技术栈

- **前端**: React 18 + TypeScript + Vite + Tailwind CSS
- **后端**: Express + TypeScript
- **数据库**: Supabase (PostgreSQL)
- **HTTP 客户端**: Axios
- **图标**: Lucide React
- **提示**: Sonner

## 前置要求

- Node.js >= 18
- npm >= 9
- 一个 [Supabase](https://supabase.com/) 项目账号

## 快速开始

### 1. 配置 Supabase

1. 在 [Supabase](https://supabase.com/) 创建一个新项目
2. 进入项目后，打开 SQL Editor
3. 执行 `supabase/schema.sql` 中的 SQL 语句创建任务表
4. 进入 **Settings → API**，复制以下信息：
   - Project URL
   - anon public key
   - service_role secret key（服务端使用）

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 Supabase 配置：

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. 安装依赖

```bash
npm install
```

### 4. 启动开发服务器

```bash
npm run dev
```

- 前端运行在: http://localhost:5173
- 后端 API 运行在: http://localhost:3001
- API 已通过 Vite 代理，前端直接调用 `/api/*` 即可

## 构建与部署

```bash
# 构建前端和后端
npm run build

# 生产环境启动
npm start
```

生产环境下，Express 服务器会同时托管前端静态文件和 API 接口，单端口即可运行。

## 项目结构

```
.
├── client/              # 前端 React 应用
│   ├── src/
│   │   ├── api/         # API 调用
│   │   ├── pages/       # 页面组件
│   │   ├── app.tsx      # 路由配置
│   │   ├── index.tsx    # 入口文件
│   │   └── index.css    # 全局样式
│   └── index.html
├── server/
│   └── index.ts         # Express 服务器入口
├── shared/
│   └── api.interface.ts # 前后端共享类型
├── supabase/
│   └── schema.sql       # 数据库表结构
├── .env.example         # 环境变量示例
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vite.config.ts
```

## API 接口

| 方法 | 路径 | 描述 | 参数 |
|------|------|------|------|
| GET | `/api/tasks` | 获取任务列表 | `priority` (可选): high/medium/low |
| POST | `/api/tasks` | 创建任务 | `{ title: string, priority: string }` |
| PATCH | `/api/tasks/:id` | 更新任务状态 | `{ completed: boolean }` |
| DELETE | `/api/tasks/:id` | 删除任务 | - |

## License

MIT
