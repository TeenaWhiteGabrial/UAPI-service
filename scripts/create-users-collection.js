// MongoDB 用户集合创建脚本
// 请在 MongoDB 客户端中执行此脚本

// 切换到目标数据库
use api-manage;

// 创建用户集合
db.createCollection("users");

// 创建索引
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 });
db.users.createIndex({ "id": 1 }, { unique: true });
db.users.createIndex({ "isDeleted": 1 });

// 创建默认管理员用户
db.users.insertOne({
  id: "1", // 这里使用简单的ID，实际项目中会使用雪花算法生成
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

// 验证集合创建
print("用户集合创建完成");
print("默认管理员账户:");
print("用户名: admin");
print("密码: admin123");

// 查看创建的索引
print("创建的索引:");
db.users.getIndexes(); 