# 数据库设置说明

## MongoDB 用户集合创建

### 方法一：使用 MongoDB Shell

1. 连接到 MongoDB 数据库：
```bash
mongosh "mongodb://misaka:ipcMasterTopazzz@39.105.212.130:27017/api-manage?authSource=api-manage"
```

2. 执行以下命令创建用户集合：

```javascript
// 创建用户集合
db.createCollection("users");

// 创建索引
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 });
db.users.createIndex({ "id": 1 }, { unique: true });
db.users.createIndex({ "isDeleted": 1 });

// 创建默认管理员用户
db.users.insertOne({
  id: "1",
  username: "admin",
  password: "21232f297a57a5a743894a0e4a801fc3", // admin123 的 MD5 值
  email: "admin@example.com",
  avatar: "",
  role: "admin",
  status: "active",
  isDeleted: false,
  createdAt: new Date(),
  updatedAt: new Date()
});
```

### 方法二：使用脚本文件

1. 将 `scripts/create-users-collection.js` 文件内容复制到 MongoDB Shell 中执行

### 方法三：使用 MongoDB Compass

1. 连接到数据库
2. 创建 `users` 集合
3. 手动创建索引
4. 插入默认管理员用户

## 用户集合结构

### 字段说明

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| _id | ObjectId | 是 | MongoDB 自动生成的唯一标识 |
| id | String | 是 | 业务唯一标识（雪花算法生成） |
| username | String | 是 | 用户名（唯一） |
| password | String | 是 | 密码（MD5加密） |
| email | String | 否 | 邮箱 |
| avatar | String | 否 | 头像URL |
| role | String | 是 | 角色（admin/user） |
| status | String | 是 | 状态（active/inactive） |
| lastLoginTime | Date | 否 | 最后登录时间 |
| isDeleted | Boolean | 是 | 软删除标记 |
| createdAt | Date | 是 | 创建时间 |
| updatedAt | Date | 是 | 更新时间 |

### 索引说明

- `username`: 唯一索引，用于用户名查询
- `email`: 普通索引，用于邮箱查询
- `id`: 唯一索引，用于业务ID查询
- `isDeleted`: 普通索引，用于软删除过滤

## 默认管理员账户

- **用户名**: admin
- **密码**: admin123
- **角色**: admin
- **状态**: active

## 注意事项

1. 密码使用 MD5 加密存储
2. 支持软删除，不会物理删除数据
3. 用户名和邮箱需要唯一
4. 用户ID使用雪花算法生成，确保全局唯一
5. 所有时间字段使用 UTC 时间 