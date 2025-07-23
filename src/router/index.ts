import Router from 'koa-router';
import { UserController } from '../controllers/user';
import { ProjectController } from '../controllers/project';
import { ApiController } from '../controllers/api';
import { LogViewer } from '../utils/logViewer';

// 创建路由实例
const router = new Router();

// 用户相关路由
router.get('/users', UserController.getUsers);
router.get('/users/:id', UserController.getUserById);
router.post('/users', UserController.createUser);
router.post('/users/:id/update', UserController.updateUser);
router.post('/users/:id/delete', UserController.deleteUser);

// 项目相关路由
router.get('/projects', ProjectController.getProjects);
router.get('/projects/:id', ProjectController.getProjectById);
router.post('/projects', ProjectController.createProject);
router.post('/projects/:id/update', ProjectController.updateProject);
router.post('/projects/:id/delete', ProjectController.deleteProject);

// API接口相关路由
router.get('/apis', ApiController.getAllApis);
router.get('/apis/:id', ApiController.getApiById);
router.post('/apis', ApiController.createApi);
router.post('/apis/:id/update', ApiController.updateApi);
router.post('/apis/:id/delete', ApiController.deleteApi);

// 项目下的接口路由
router.get('/projects/:projectId/apis', ApiController.getApisByProjectId);

// 日志查看路由
router.get('/logs/error', (ctx) => {
  const lines = parseInt(ctx.query.lines as string) || 50;
  const logs = LogViewer.getLatestErrorLogs(lines);
  ctx.body = {
    code: 200,
    message: '获取错误日志成功',
    data: logs
  };
});

router.get('/logs/access', (ctx) => {
  const lines = parseInt(ctx.query.lines as string) || 50;
  const logs = LogViewer.getLatestAccessLogs(lines);
  ctx.body = {
    code: 200,
    message: '获取访问日志成功',
    data: logs
  };
});

router.get('/logs/all', (ctx) => {
  const lines = parseInt(ctx.query.lines as string) || 50;
  const logs = LogViewer.getLatestAllLogs(lines);
  ctx.body = {
    code: 200,
    message: '获取所有日志成功',
    data: logs
  };
});

router.get('/logs/search', (ctx) => {
  const keyword = ctx.query.keyword as string;
  const type = ctx.query.type as 'error' | 'access' | 'all' || 'all';
  
  if (!keyword) {
    ctx.body = {
      code: 400,
      message: '搜索关键词不能为空'
    };
    return;
  }
  
  const logs = LogViewer.searchLogs(keyword, type);
  ctx.body = {
    code: 200,
    message: '搜索日志成功',
    data: logs
  };
});

router.get('/logs/info', (ctx) => {
  const info = LogViewer.getLogFileInfo();
  ctx.body = {
    code: 200,
    message: '获取日志文件信息成功',
    data: info
  };
});

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
    message: '欢迎使用 API 管理系统',
    version: '1.0.0',
    endpoints: {
      users: '/users',
      projects: '/projects',
      apis: '/apis',
      logs: '/logs',
      health: '/health'
    }
  };
});

export default router;
