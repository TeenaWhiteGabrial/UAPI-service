// 环境变量配置
import { anyKeyObject } from "../type/global";

export const ENV = {
  development: "development",
  production: "production",
};

// mongoDB配置 - 请根据实际需要修改
export const DATABASE = {
  // 本地环境
  development: {
    dbName: "your_database_name",
    user: "your_username",
    password: "your_password",
    host: "localhost",
    port: 27017,
  },

  // 生产环境
  production: {
    dbName: "your_database_name",
    user: "your_username",
    password: "your_password",
    host: "your_production_host",
    port: 27017,
  },
};

// jsonwebtoken-jwt配置
export const JWT = {
  secret: "your_jwt_secret_key", //密钥 - 请修改为安全的密钥
  expires: 60 * 60 * 24 * 30, // 30天
};

// 平台Map - 可根据需要修改
export const PLATFORM = {
  web: "Web应用",
  mobile: "移动应用",
  api: "API服务",
};

// 全局参数
export const FIXED_KEY = {
  port: 3000, // 默认端口，可根据需要修改
};

// 文件上传配置 - 可根据需要修改或删除
export const UPLOAD = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
  uploadPath: './uploads',
}

// 日志配置
export const LOG = {
  level: 'info',
  filename: './logs/app.log',
  maxSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5,
}
