import { Context } from 'koa';
import ApiService from '../services/api';
import ProjectService from '../services/project';
import { businessLogger } from '../log/log';

export class ApiController {
  // 获取所有接口列表
  static async getAllApis(ctx: Context) {
    try {
      businessLogger.info('开始处理获取所有API接口列表请求');
      const apis = await ApiService.getAllApis();
      
      ctx.body = {
        code: 200,
        message: '获取接口列表成功',
        data: apis
      };
      
      businessLogger.info('成功处理获取所有API接口列表请求', { count: apis.length });
    } catch (error: any) {
      businessLogger.error('处理获取所有API接口列表请求失败', { 
        error: error.message, 
        stack: error.stack 
      });
      
      ctx.body = {
        code: 500,
        message: '获取接口列表失败',
        error: error.message
      };
    }
  }

  // 获取项目下的所有接口列表
  static async getApisByProjectId(ctx: Context) {
    try {
      const { projectId } = ctx.params;
      businessLogger.info('开始处理获取项目API接口列表请求', { projectId });
      
      // 验证项目是否存在（不包括已删除的）
      const project = await ProjectService.findActiveProjectById(projectId);
      if (!project) {
        businessLogger.warn('项目不存在', { projectId });
        ctx.body = {
          code: 404,
          message: '项目不存在'
        };
        return;
      }
      
      const apis = await ApiService.getApisByProjectId(projectId);
      
      ctx.body = {
        code: 200,
        message: '获取项目接口列表成功',
        data: apis
      };
      
      businessLogger.info('成功处理获取项目API接口列表请求', { projectId, count: apis.length });
    } catch (error: any) {
      businessLogger.error('处理获取项目API接口列表请求失败', { 
        projectId: ctx.params.projectId,
        error: error.message, 
        stack: error.stack 
      });
      
      ctx.body = {
        code: 500,
        message: '获取项目接口列表失败',
        error: error.message
      };
    }
  }

  // 获取接口详情
  static async getApiById(ctx: Context) {
    try {
      const { id } = ctx.params;
      businessLogger.info('开始处理获取API接口详情请求', { apiId: id });
      
      const api = await ApiService.getApiById(id);
      
      if (!api) {
        businessLogger.warn('API接口不存在', { apiId: id });
        ctx.body = {
          code: 404,
          message: '接口不存在'
        };
        return;
      }
      
      ctx.body = {
        code: 200,
        message: '获取接口详情成功',
        data: api
      };
      
      businessLogger.info('成功处理获取API接口详情请求', { apiId: id });
    } catch (error: any) {
      businessLogger.error('处理获取API接口详情请求失败', { 
        apiId: ctx.params.id,
        error: error.message, 
        stack: error.stack 
      });
      
      ctx.body = {
        code: 500,
        message: '获取接口详情失败',
        error: error.message
      };
    }
  }

  // 创建接口
  static async createApi(ctx: Context) {
    let apiData: any;
    try {
      apiData = ctx.request.body;
      businessLogger.info('开始处理创建API接口请求', { 
        apiData: { id: apiData.id, name: apiData.name, projectId: apiData.projectId } 
      });
      
      // 参数验证
      if (!apiData.id || !apiData.projectId || !apiData.name || !apiData.method || !apiData.url) {
        businessLogger.warn('创建API接口参数不完整', { apiData });
        ctx.body = {
          code: 400,
          message: '接口ID、项目ID、名称、请求方法和URL不能为空'
        };
        return;
      }

      // 验证method只能是GET或POST
      if (!['GET', 'POST'].includes(apiData.method)) {
        businessLogger.warn('创建API接口请求方法不支持', { method: apiData.method });
        ctx.body = {
          code: 400,
          message: '请求方法只能是GET或POST'
        };
        return;
      }
      
      // 验证项目是否存在（不包括已删除的）
      const project = await ProjectService.findActiveProjectById(apiData.projectId);
      if (!project) {
        businessLogger.warn('创建API接口时项目不存在', { projectId: apiData.projectId });
        ctx.body = {
          code: 404,
          message: '项目不存在'
        };
        return;
      }
      
      const apiId = await ApiService.createApi(apiData);
      
      ctx.body = {
        code: 201,
        message: '创建接口成功',
        data: { id: apiId }
      };
      
      businessLogger.info('成功处理创建API接口请求', { apiId: apiData.id, mongoId: apiId });
    } catch (error: any) {
      businessLogger.error('处理创建API接口请求失败', { 
        apiData: apiData ? { id: apiData.id, name: apiData.name, projectId: apiData.projectId } : null,
        error: error.message, 
        stack: error.stack 
      });
      
      ctx.body = {
        code: 500,
        message: '创建接口失败',
        error: error.message
      };
    }
  }

  // 更新接口
  static async updateApi(ctx: Context) {
    try {
      const { id } = ctx.params;
      const updateData = ctx.request.body;
      businessLogger.info('开始处理更新API接口请求', { apiId: id, updateData });
      
      // 参数验证
      if (!updateData.name || !updateData.method || !updateData.url) {
        businessLogger.warn('更新API接口参数不完整', { apiId: id, updateData });
        ctx.body = {
          code: 400,
          message: '接口名称、请求方法和URL不能为空'
        };
        return;
      }

      // 验证method只能是GET或POST
      if (!['GET', 'POST'].includes(updateData.method)) {
        businessLogger.warn('更新API接口请求方法不支持', { apiId: id, method: updateData.method });
        ctx.body = {
          code: 400,
          message: '请求方法只能是GET或POST'
        };
        return;
      }
      
      const success = await ApiService.updateApi(id, updateData);
      
      if (!success) {
        businessLogger.warn('更新API接口时接口不存在', { apiId: id });
        ctx.body = {
          code: 404,
          message: '接口不存在'
        };
        return;
      }
      
      ctx.body = {
        code: 200,
        message: '更新接口成功'
      };
      
      businessLogger.info('成功处理更新API接口请求', { apiId: id });
    } catch (error: any) {
      businessLogger.error('处理更新API接口请求失败', { 
        apiId: ctx.params.id,
        updateData: ctx.request.body,
        error: error.message, 
        stack: error.stack 
      });
      
      ctx.body = {
        code: 500,
        message: '更新接口失败',
        error: error.message
      };
    }
  }

  // 删除接口
  static async deleteApi(ctx: Context) {
    try {
      const { id } = ctx.params;
      businessLogger.info('开始处理删除API接口请求', { apiId: id });
      
      const success = await ApiService.deleteApi(id);
      
      if (!success) {
        businessLogger.warn('删除API接口时接口不存在', { apiId: id });
        ctx.body = {
          code: 404,
          message: '接口不存在'
        };
        return;
      }
      
      ctx.body = {
        code: 200,
        message: '删除接口成功'
      };
      
      businessLogger.info('成功处理删除API接口请求', { apiId: id });
    } catch (error: any) {
      businessLogger.error('处理删除API接口请求失败', { 
        apiId: ctx.params.id,
        error: error.message, 
        stack: error.stack 
      });
      
      ctx.body = {
        code: 500,
        message: '删除接口失败',
        error: error.message
      };
    }
  }
} 