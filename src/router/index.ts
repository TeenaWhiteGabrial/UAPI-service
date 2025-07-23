import Router from 'koa-router';
import { UserController } from '../controllers/user';

// 创建路由实例
const router = new Router();

// 用户相关路由
router.get('/users', UserController.getUsers);
router.get('/users/:id', UserController.getUserById);
router.post('/users', UserController.createUser);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

// 健康检查路由
router.get('/health', (ctx) => {
  ctx.body = {
    code: 200,
    message: '服务运行正常',
    timestamp: new Date().toISOString()
  };
});

// 根路由
router.get('/', (ctx) => {
  ctx.body = {
    code: 200,
    message: '欢迎使用 Koa TypeScript 模板',
    version: '1.0.0',
    endpoints: {
      users: '/users',
      health: '/health'
    }
  };
});

export default router;
