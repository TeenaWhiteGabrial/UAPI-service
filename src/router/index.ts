import Router from 'koa-router';
import { UserController } from '../controllers/user';
import { ProjectController } from '../controllers/project';
import { ApiController } from '../controllers/api';
import { LogViewer } from '../utils/logViewer';
import { jwtMiddlewareDeal } from '../middleware/jwt';

// 创建路由实例
const router = new Router();

// 用户认证相关路由（无需JWT验证）
router.post('/uapi-manage/auth/login', UserController.login);
router.post('/uapi-manage/auth/logout', UserController.logout);

// 用户管理相关路由（需要JWT验证）
router.get('/uapi-manage/users', jwtMiddlewareDeal, UserController.getUsers);
router.get('/uapi-manage/users/:id', jwtMiddlewareDeal, UserController.getUserById);
router.post('/uapi-manage/users', jwtMiddlewareDeal, UserController.createUser);
router.post('/uapi-manage/users/:id/update', jwtMiddlewareDeal, UserController.updateUser);
router.post('/uapi-manage/users/:id/delete', jwtMiddlewareDeal, UserController.deleteUser);
router.get('/uapi-manage/users/current', jwtMiddlewareDeal, UserController.getCurrentUser);

// 项目相关路由（需要JWT验证）
router.get('/uapi-manage/projects', jwtMiddlewareDeal, ProjectController.getProjects);
router.get('/uapi-manage/projects/:id', jwtMiddlewareDeal, ProjectController.getProjectById);
router.post('/uapi-manage/projects', jwtMiddlewareDeal, ProjectController.createProject);
router.post('/uapi-manage/projects/:id/update', jwtMiddlewareDeal, ProjectController.updateProject);
router.post('/uapi-manage/projects/:id/delete', jwtMiddlewareDeal, ProjectController.deleteProject);

// API接口相关路由（需要JWT验证）
router.get('/uapi-manage/apis', jwtMiddlewareDeal, ApiController.getAllApis);
router.get('/uapi-manage/apis/:id', jwtMiddlewareDeal, ApiController.getApiById);
router.post('/uapi-manage/apis', jwtMiddlewareDeal, ApiController.createApi);
router.post('/uapi-manage/apis/:id/update', jwtMiddlewareDeal, ApiController.updateApi);
router.post('/uapi-manage/apis/:id/delete', jwtMiddlewareDeal, ApiController.deleteApi);

// 项目下的接口路由（需要JWT验证）
router.get('/uapi-manage/projects/:projectId/apis', jwtMiddlewareDeal, ApiController.getApisByProjectId);

// 日志查看路由（需要JWT验证）
router.get('/uapi-manage/logs/error', jwtMiddlewareDeal, (ctx) => {
  const lines = parseInt(ctx.query.lines as string) || 50;
  const logs = LogViewer.getLatestErrorLogs(lines);
  ctx.body = {
    code: 200,
    message: '获取错误日志成功',
    data: logs
  };
});

router.get('/uapi-manage/logs/access', jwtMiddlewareDeal, (ctx) => {
  const lines = parseInt(ctx.query.lines as string) || 50;
  const logs = LogViewer.getLatestAccessLogs(lines);
  ctx.body = {
    code: 200,
    message: '获取访问日志成功',
    data: logs
  };
});

router.get('/uapi-manage/logs/all', jwtMiddlewareDeal, (ctx) => {
  const lines = parseInt(ctx.query.lines as string) || 50;
  const logs = LogViewer.getLatestAllLogs(lines);
  ctx.body = {
    code: 200,
    message: '获取所有日志成功',
    data: logs
  };
});

router.get('/uapi-manage/logs/search', jwtMiddlewareDeal, (ctx) => {
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

router.get('/uapi-manage/logs/info', jwtMiddlewareDeal, (ctx) => {
  const info = LogViewer.getLogFileInfo();
  ctx.body = {
    code: 200,
    message: '获取日志文件信息成功',
    data: info
  };
});

// 健康检查路由（无需JWT验证）
router.get('/uapi-manage/health', (ctx) => {
  ctx.body = {
    code: 200,
    message: '服务运行正常',
    timestamp: new Date().toISOString()
  };
});

// 根路由（无需JWT验证）
router.get('/uapi-manage/', (ctx) => {
  ctx.body = {
    code: 200,
    message: '欢迎使用 API 管理系统',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: '/auth/login',
        logout: '/auth/logout'
      },
      users: '/users',
      projects: '/projects',
      apis: '/apis',
      logs: '/logs',
      health: '/health'
    }
  };
});

export default router;
