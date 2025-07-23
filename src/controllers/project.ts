import { Context } from 'koa';
import ProjectService from '../services/project';

export class ProjectController {
  // 获取项目列表
  static async getProjects(ctx: Context) {
    try {
      const projects = await ProjectService.getAllProjects();
      
      ctx.body = {
        code: 200,
        message: '获取项目列表成功',
        data: projects
      };
    } catch (error: any) {
      ctx.body = {
        code: 500,
        message: '获取项目列表失败',
        error: error.message
      };
    }
  }

  // 根据ID获取项目
  static async getProjectById(ctx: Context) {
    try {
      const { id } = ctx.params;
      const project = await ProjectService.getProjectById(id);
      
      if (!project) {
        ctx.body = {
          code: 404,
          message: '项目不存在'
        };
        return;
      }
      
      ctx.body = {
        code: 200,
        message: '获取项目信息成功',
        data: project
      };
    } catch (error: any) {
      ctx.body = {
        code: 500,
        message: '获取项目信息失败',
        error: error.message
      };
    }
  }

  // 创建项目
  static async createProject(ctx: Context) {
    try {
      const projectData = ctx.request.body;
      
      // 参数验证
      if (!projectData.id || !projectData.name) {
        ctx.body = {
          code: 400,
          message: '项目ID和名称不能为空'
        };
        return;
      }
      
      const projectId = await ProjectService.createProject(projectData);
      
      ctx.body = {
        code: 201,
        message: '创建项目成功',
        data: { id: projectId }
      };
    } catch (error: any) {
      ctx.body = {
        code: 500,
        message: '创建项目失败',
        error: error.message
      };
    }
  }

  // 更新项目
  static async updateProject(ctx: Context) {
    try {
      const { id } = ctx.params;
      const updateData = ctx.request.body;
      
      // 参数验证
      if (!updateData.name) {
        ctx.body = {
          code: 400,
          message: '项目名称不能为空'
        };
        return;
      }
      
      const success = await ProjectService.updateProject(id, updateData);
      
      if (!success) {
        ctx.body = {
          code: 404,
          message: '项目不存在'
        };
        return;
      }
      
      ctx.body = {
        code: 200,
        message: '更新项目成功'
      };
    } catch (error: any) {
      ctx.body = {
        code: 500,
        message: '更新项目失败',
        error: error.message
      };
    }
  }

  // 删除项目
  static async deleteProject(ctx: Context) {
    try {
      const { id } = ctx.params;
      const success = await ProjectService.deleteProject(id);
      
      if (!success) {
        ctx.body = {
          code: 404,
          message: '项目不存在'
        };
        return;
      }
      
      ctx.body = {
        code: 200,
        message: '删除项目成功'
      };
    } catch (error: any) {
      ctx.body = {
        code: 500,
        message: '删除项目失败',
        error: error.message
      };
    }
  }
} 