import Router from 'koa-router';
import { ProjectController } from '../controllers/project';
import { ApiController } from '../controllers/api';
import { LogViewer } from '../utils/logViewer';

// 创建路由实例
const router = new Router();

// 项目相关路由
router.get('/uapi-manage/projects', ProjectController.getProjects);
router.get('/uapi-manage/projects/:id', ProjectController.getProjectById);
router.post('/uapi-manage/projects', ProjectController.createProject);
router.post('/uapi-manage/projects/:id/update', ProjectController.updateProject);
router.post('/uapi-manage/projects/:id/delete', ProjectController.deleteProject);

// API接口相关路由
router.get('/uapi-manage/apis', ApiController.getAllApis);
router.get('/uapi-manage/apis/:id', ApiController.getApiById);
router.post('/uapi-manage/apis', ApiController.createApi);
router.post('/uapi-manage/apis/:id/update', ApiController.updateApi);
router.post('/uapi-manage/apis/:id/delete', ApiController.deleteApi);

// 项目下的接口路由
router.get('/uapi-manage/projects/:projectId/apis', ApiController.getApisByProjectId);

// 日志查看路由
router.get('/uapi-manage/logs/error', (ctx) => {
  const lines = parseInt(ctx.query.lines as string) || 50;
  const logs = LogViewer.getLatestErrorLogs(lines);
  ctx.body = {
    code: 200,
    message: '获取错误日志成功',
    data: logs
  };
});

router.get('/uapi-manage/logs/access', (ctx) => {
  const lines = parseInt(ctx.query.lines as string) || 50;
  const logs = LogViewer.getLatestAccessLogs(lines);
  ctx.body = {
    code: 200,
    message: '获取访问日志成功',
    data: logs
  };
});

router.get('/uapi-manage/logs/all', (ctx) => {
  const lines = parseInt(ctx.query.lines as string) || 50;
  const logs = LogViewer.getLatestAllLogs(lines);
  ctx.body = {
    code: 200,
    message: '获取所有日志成功',
    data: logs
  };
});

router.get('/uapi-manage/logs/search', (ctx) => {
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

router.get('/uapi-manage/logs/info', (ctx) => {
  const info = LogViewer.getLogFileInfo();
  ctx.body = {
    code: 200,
    message: '获取日志文件信息成功',
    data: info
  };
});

// 健康检查路由
router.get('/uapi-manage/health', (ctx) => {
  ctx.body = {
    code: 200,
    message: '服务运行正常',
    timestamp: new Date().toISOString()
  };
});

// 根路由
router.get('/uapi-manage/', (ctx) => {
  ctx.body = {
    code: 200,
    message: '欢迎使用 API 管理系统',
    version: '1.0.0',
    endpoints: {
      projects: '/projects',
      apis: '/apis',
      logs: '/logs',
      health: '/health'
    }
  };
});

export default router;
