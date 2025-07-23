import { DATABASE, ENV } from "../config/constant";
import { MongoClient } from 'mongodb';
import { dbLogger } from '../log/log';

const { dbName, user, password, host, port } =
  process.env.NODE_ENV === ENV.production
    ? DATABASE.production
    : DATABASE.development;

const uri = `mongodb://${user}:${password}@${host}:${port}/?authSource=${dbName}`

dbLogger.info('开始连接MongoDB数据库', { 
  host, 
  port, 
  dbName, 
  user,
  env: process.env.NODE_ENV || 'development'
});

export const client = new MongoClient(uri);

/** 建立连接 */
client.connect()
  .then(() => {
    dbLogger.info('MongoDB数据库连接成功', { 
      host, 
      port, 
      dbName 
    });
  })
  .catch((error) => {
    dbLogger.error('MongoDB数据库连接失败', { 
      host, 
      port, 
      dbName, 
      error: error.message,
      stack: error.stack
    });
    console.error('MongoDB连接失败:', error);
  });

/** 连接数据库 */
const db = client.db(dbName);

// 监听数据库连接事件
client.on('connected', () => {
  dbLogger.info('MongoDB客户端已连接');
});

client.on('disconnected', () => {
  dbLogger.warn('MongoDB客户端已断开连接');
});

client.on('error', (error) => {
  dbLogger.error('MongoDB客户端连接错误', { 
    error: error.message,
    stack: error.stack
  });
});

export default db;