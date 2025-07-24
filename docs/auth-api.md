# 用户认证 API 文档

## 接口权限说明

### 无需认证的接口
- `POST /uapi-manage/auth/login` - 用户登录
- `POST /uapi-manage/auth/logout` - 用户登出
- `GET /uapi-manage/health` - 健康检查
- `GET /uapi-manage/` - 根路由

### 需要认证的接口
所有其他接口都需要在请求头中携带有效的JWT token：
```
Authorization: Bearer <your_token_here>
```

## 登录接口

### 请求信息
- **URL**: `POST /uapi-manage/auth/login`
- **Content-Type**: `application/json`
- **认证**: 无需认证

### 请求参数
```json
{
  "username": "admin",
  "password": "admin123"
}
```

### 响应示例
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1234567890",
      "username": "admin",
      "email": "admin@example.com",
      "avatar": "",
      "role": "admin"
    }
  }
}
```

### 错误响应
```json
{
  "code": 401,
  "message": "用户名或密码错误"
}
```

## 登出接口

### 请求信息
- **URL**: `POST /uapi-manage/auth/logout`
- **认证**: 无需认证

### 请求头
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 响应示例
```json
{
  "code": 200,
  "message": "登出成功"
}
```

## 需要认证的接口

### 用户管理接口

#### 获取当前用户信息
- **URL**: `GET /uapi-manage/users/current`
- **认证**: 需要JWT token

#### 获取所有用户
- **URL**: `GET /uapi-manage/users`
- **认证**: 需要JWT token

#### 获取指定用户
- **URL**: `GET /uapi-manage/users/:id`
- **认证**: 需要JWT token

#### 创建用户
- **URL**: `POST /uapi-manage/users`
- **认证**: 需要JWT token

#### 更新用户
- **URL**: `POST /uapi-manage/users/:id/update`
- **认证**: 需要JWT token

#### 删除用户
- **URL**: `POST /uapi-manage/users/:id/delete`
- **认证**: 需要JWT token

### 项目管理接口

#### 获取所有项目
- **URL**: `GET /uapi-manage/projects`
- **认证**: 需要JWT token

#### 获取指定项目
- **URL**: `GET /uapi-manage/projects/:id`
- **认证**: 需要JWT token

#### 创建项目
- **URL**: `POST /uapi-manage/projects`
- **认证**: 需要JWT token

#### 更新项目
- **URL**: `POST /uapi-manage/projects/:id/update`
- **认证**: 需要JWT token

#### 删除项目
- **URL**: `POST /uapi-manage/projects/:id/delete`
- **认证**: 需要JWT token

### API接口管理

#### 获取所有API
- **URL**: `GET /uapi-manage/apis`
- **认证**: 需要JWT token

#### 获取指定API
- **URL**: `GET /uapi-manage/apis/:id`
- **认证**: 需要JWT token

#### 创建API
- **URL**: `POST /uapi-manage/apis`
- **认证**: 需要JWT token

#### 更新API
- **URL**: `POST /uapi-manage/apis/:id/update`
- **认证**: 需要JWT token

#### 删除API
- **URL**: `POST /uapi-manage/apis/:id/delete`
- **认证**: 需要JWT token

#### 获取项目下的API
- **URL**: `GET /uapi-manage/projects/:projectId/apis`
- **认证**: 需要JWT token

### 日志管理接口

#### 获取错误日志
- **URL**: `GET /uapi-manage/logs/error`
- **认证**: 需要JWT token

#### 获取访问日志
- **URL**: `GET /uapi-manage/logs/access`
- **认证**: 需要JWT token

#### 获取所有日志
- **URL**: `GET /uapi-manage/logs/all`
- **认证**: 需要JWT token

#### 搜索日志
- **URL**: `GET /uapi-manage/logs/search`
- **认证**: 需要JWT token

#### 获取日志文件信息
- **URL**: `GET /uapi-manage/logs/info`
- **认证**: 需要JWT token

## 认证失败响应

当token无效或缺失时，所有需要认证的接口都会返回：

```json
{
  "code": 401,
  "message": "Token验证失败"
}
```

## 使用流程

1. **登录**: 调用登录接口获取token
2. **使用API**: 在请求头中携带token访问其他接口
3. **登出**: 调用登出接口使token失效

## 默认管理员账户

- **用户名**: admin
- **密码**: admin123
- **角色**: admin

## 注意事项

1. Token有效期为30天
2. 登出后token立即失效
3. 所有需要认证的接口都必须在请求头中携带有效的token
4. 健康检查和根路由无需认证，可用于服务状态检查 