# AGENTS.md

## 项目概览

网页版思维导图工具，采用前后端分离架构：
- **前端**：Next.js 16 + React 19（SSR，端口 5000）
- **后端**：NestJS 12（REST API，端口 5001）
- **数据库**：SQLite（通过 TypeORM，兼容 MySQL 语法，数据存储在 `/tmp/mindmap.db`）

## 构建与测试命令

```bash
# 前端
pnpm ts-check          # TypeScript 类型检查
pnpm lint:build        # ESLint 检查
pnpm dev               # 启动开发服务器（端口 5000）

# 后端（server/ 目录）
cd server && npx nest build    # 构建 NestJS
cd server && node dist/main    # 启动后端（端口 5001）
```

## 目录结构

```
── server/                    # NestJS 后端
│   ├── src/
│   │   ├── main.ts           # 后端入口
│   │   ├── app.module.ts     # 根模块
│   │   ├── database/         # 数据库配置（TypeORM + SQLite）
│   │   ├── mind-map/         # 思维导图模块（CRUD）
│   │   │   ├── entities/     # MindMap 实体
│   │   │   ├── dto/          # 数据传输对象
│   │   │   ├── mind-map.service.ts
│   │   │   └── mind-map.controller.ts
│   │   └── node/             # 节点模块（CRUD + 颜色轮换）
│   │       ├── entities/     # MindMapNode 实体
│   │       ├── dto/
│   │       ├── node.service.ts
│   │       └── node.controller.ts
│   ── package.json
├── src/
│   ├── app/
│   │   ├── page.tsx          # 思维导图主页面
│   │   ├── layout.tsx        # 根布局
│   │   ├── globals.css       # 全局样式
│   │   └── api/              # Next.js API 代理路由
│   │       ├── mind-maps/    # 代理到 NestJS /api/mind-maps
│   │       └── nodes/        # 代理到 NestJS /api/nodes
│   ├── components/
│   │   ├── mind-map/         # 思维导图组件
│   │   │   ├── MindMapCanvas.tsx    # SVG 画布（拖拽/缩放）
│   │   │   ├── MindMapNode.tsx      # 节点渲染
│   │   │   ├── ConnectionLine.tsx   # 贝塞尔曲线连线
│   │   │   └── NodeToolbar.tsx      # 节点操作工具栏
│   │   └── ui/               # shadcn/ui 组件
│   ├── lib/
│   │   ├── api.ts            # API 客户端（类型定义 + 请求函数）
│   │   └── utils.ts          # 工具函数
│   └── hooks/                # 自定义 Hooks
├── .coze                      # 项目配置
├── tsconfig.json              # TypeScript 配置（排除 server/）
└── eslint.config.mjs          # ESLint 配置（排除 server/）
```

## API 接口

### 思维导图
- `POST /api/mind-maps` - 创建导图 `{ title, description? }`
- `GET /api/mind-maps` - 获取所有导图
- `GET /api/mind-maps/:id` - 获取单个导图（含节点）
- `PUT /api/mind-maps/:id` - 更新导图
- `DELETE /api/mind-maps/:id` - 删除导图

### 节点
- `POST /api/nodes` - 创建节点 `{ text, mindMapId, parentId?, x?, y?, colorIndex?, priority?, isRoot? }`
- `GET /api/nodes?mindMapId=xxx` - 获取导图所有节点
- `GET /api/nodes/:id` - 获取单个节点
- `PUT /api/nodes/:id` - 更新节点
- `DELETE /api/nodes/:id` - 删除节点（级联删除子节点）
- `GET /api/nodes/color/next?parentId=&mindMapId=` - 获取下一个颜色索引

## 核心功能

### 节点边框色轮换
- 七色顺序：赤(#EF4444) → 橙(#F97316) → 黄(#EAB308) → 绿(#22C55E) → 青(#06B6D4) → 蓝(#3B82F6) → 紫(#A855F7)
- 自动轮换：创建子节点时，根据同级节点数量自动分配颜色索引（`siblings.length % 7`）
- 手动设置：通过工具栏颜色选择器手动切换

### 优先级设置
- P0（无）：灰色，不显示徽章
- P1（高）：红色徽章
- P2（中）：橙色徽章
- P3（低）：灰色徽章

### 画布交互
- 拖拽空白区域平移画布
- 滚轮缩放
- 单击节点选中，显示操作工具栏
- 双击节点进入编辑模式
- Enter 保存编辑，Escape 取消

## 开发规范

- 包管理器：仅使用 pnpm
- 前端 API 调用通过 Next.js API Routes 代理到 NestJS 后端
- 数据库使用 SQLite（开发环境），生产环境可切换为 MySQL（修改 `server/src/database/database.module.ts` 中的 TypeORM 配置）
- NestJS 后端代码被 tsconfig.json 和 eslint.config.mjs 排除，不参与前端静态检查
