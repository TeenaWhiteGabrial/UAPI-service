# Koa TypeScript 项目模板

这是一个基于 Koa 和 TypeScript 的 Node.js 项目模板，集成了 MongoDB 数据库连接。

## 功能特性

- 🚀 基于 Koa 2.x 和 TypeScript
- 🗄️ MongoDB 数据库集成
- 📝 完整的日志系统
- 🔐 JWT 认证支持
- 🛡️ 错误处理中间件
- 📦 PM2 进程管理
- 🔄 热重载开发环境

## 快速开始

### 1. 安装依赖

```bash
npm install
# 或
pnpm install
```

### 2. 配置数据库

编辑 `src/config/constant.ts` 文件，修改数据库连接配置：

```typescript
export const DATABASE = {
  development: {
    dbName: "your_database_name",
    user: "your_username",
    password: "your_password",
    host: "localhost",
    port: 27017,
  },
  production: {
    // 生产环境配置
  },
};
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
src/
├── config/          # 配置文件
├── controllers/     # 控制器
├── middleware/      # 中间件
├── models/          # 数据模型
├── router/          # 路由
├── services/        # 业务逻辑
├── utils/           # 工具函数
├── log/             # 日志配置
└── app.ts           # 应用入口
```

## API 端点

- `GET /` - 欢迎页面
- `GET /health` - 健康检查
- `GET /users` - 获取用户列表
- `GET /users/:id` - 获取指定用户
- `POST /users` - 创建用户
- `PUT /users/:id` - 更新用户
- `DELETE /users/:id` - 删除用户

## 环境变量

- `NODE_ENV` - 环境模式 (development/production)

## 脚本命令

- `npm run dev` - 开发模式（热重载）
- `npm run build` - 构建项目
- `npm start` - 启动生产服务器
- `npm run prod` - PM2 生产模式启动
- `npm run stop` - 停止 PM2 进程
- `npm run list` - 查看 PM2 进程列表

## 自定义开发

1. 在 `src/models/` 中添加新的数据模型
2. 在 `src/services/` 中添加业务逻辑
3. 在 `src/controllers/` 中添加控制器
4. 在 `src/router/` 中注册路由

## 许可证

MIT
