# API 管理系统

这是一个基于 Koa 和 TypeScript 的 API 管理系统，支持项目和接口的完整 CRUD 操作。

## 功能特性

- 🚀 基于 Koa 2.x 和 TypeScript
- 🗄️ MongoDB 数据库集成
- 📝 完整的日志系统
- 🔐 JWT 认证支持
- 🛡️ 错误处理中间件
- 📦 PM2 进程管理
- 🔄 热重载开发环境
- 📋 项目管理功能
- 🔗 API 接口管理功能
- 🗑️ 软删除功能
- 🔒 请求方法限制（仅支持 GET 和 POST）

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

## 数据库结构

### projects 集合
```json
{
  "_id": ObjectId("6880f4c19738000019007346"),
  "id": "p01",
  "name": "四图一清单",
  "isDeleted": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### apis 集合
```json
{
  "_id": ObjectId("687e165e9738000019007343"),
  "id": "001",
  "projectId": "p01",
  "name": "企业分页列表",
  "description": "获取企业分页列表",
  "method": "POST",
  "url": "/manage/appeal/companyOriginal/page",
  "param": "{\"pageNo\":1,\"pageSize\":10}",
  "response": "{\"code\":200,\"msg\":\"ok\",\"data\":{}}",
  "isDeleted": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## API 端点

### 项目管理
- `GET /projects` - 获取项目列表（不包括已删除的）
- `GET /projects/:id` - 获取指定项目
- `POST /projects` - 创建项目
- `POST /projects/:id/update` - 更新项目
- `POST /projects/:id/delete` - 软删除项目

### API 接口管理
- `GET /apis` - 获取所有接口列表（不包括已删除的）
- `GET /apis/:id` - 获取指定接口详情
- `POST /apis` - 创建接口
- `POST /apis/:id/update` - 更新接口
- `POST /apis/:id/delete` - 软删除接口
- `GET /projects/:projectId/apis` - 获取项目下的所有接口

### 用户管理
- `GET /users` - 获取用户列表
- `GET /users/:id` - 获取指定用户
- `POST /users` - 创建用户
- `POST /users/:id/update` - 更新用户
- `POST /users/:id/delete` - 删除用户

### 日志管理
- `GET /logs/error` - 获取错误日志
- `GET /logs/access` - 获取访问日志
- `GET /logs/all` - 获取所有日志
- `GET /logs/search?keyword=xxx&type=error` - 搜索日志
- `GET /logs/info` - 获取日志文件信息

### 系统
- `GET /` - 欢迎页面
- `GET /health` - 健康检查

## 请求示例

### 创建项目
```bash
POST /projects
Content-Type: application/json

{
  "id": "p01",
  "name": "四图一清单"
}
```

### 更新项目
```bash
POST /projects/p01/update
Content-Type: application/json

{
  "name": "四图一清单-更新版"
}
```

### 删除项目
```bash
POST /projects/p01/delete
Content-Type: application/json

{}
```

### 创建接口
```bash
POST /apis
Content-Type: application/json

{
  "id": "001",
  "projectId": "p01",
  "name": "企业分页列表",
  "description": "获取企业分页列表",
  "method": "POST",
  "url": "/manage/appeal/companyOriginal/page",
  "param": "{\"pageNo\":1,\"pageSize\":10}",
  "response": "{\"code\":200,\"msg\":\"ok\",\"data\":{}}"
}
```

### 更新接口
```bash
POST /apis/001/update
Content-Type: application/json

{
  "name": "企业分页列表-更新版",
  "description": "获取企业分页列表（更新版）",
  "method": "GET",
  "url": "/manage/appeal/companyOriginal/page",
  "param": "{\"pageNo\":1,\"pageSize\":20}",
  "response": "{\"code\":200,\"msg\":\"ok\",\"data\":{}}"
}
```

### 删除接口
```bash
POST /apis/001/delete
Content-Type: application/json

{}
```

### 查看日志
```bash
# 查看最新的50行错误日志
GET /logs/error?lines=50

# 查看包含"获取接口列表失败"的日志
GET /logs/search?keyword=获取接口列表失败&type=error

# 查看日志文件信息
GET /logs/info
```

## 日志系统

### 日志文件
- `logs/error.log` - 错误日志
- `logs/access.log` - 访问日志
- `logs/all-the-logs.log` - 所有日志

### 日志级别
- `info` - 信息日志
- `warn` - 警告日志
- `error` - 错误日志

### 日志内容
- 请求ID追踪
- 请求和响应详情
- 数据库操作日志
- 业务逻辑日志
- 错误堆栈信息

### 日志配置
```typescript
export const LOG = {
  level: 'info',           // 日志级别
  maxSize: 10 * 1024 * 1024, // 单个日志文件最大大小 (10MB)
  maxFiles: 5,             // 保留的日志文件数量
}
```

## 特殊说明

### 软删除功能
- 删除操作使用软删除，数据不会真正从数据库中删除
- 删除的数据会设置 `isDeleted: true` 标记
- 查询接口默认不返回已删除的数据
- 已删除的数据仍然占用ID，避免ID重复

### 请求方法限制
- API接口的 `method` 字段只支持 `GET` 和 `POST`
- 创建或更新接口时会验证请求方法
- 不支持其他HTTP方法（PUT、DELETE、PATCH等）

### HTTP方法使用
- 所有查询操作使用 `GET` 方法
- 所有新增、修改、删除操作都使用 `POST` 方法
- 不使用 `PUT`、`DELETE` 等HTTP方法

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
