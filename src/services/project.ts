import { Project } from '../models/project';
import db from '../utils/pool';
import { ObjectId } from 'mongodb';
import { dbLogger, businessLogger } from '../log/log';

export class ProjectService {
  private collection = db.collection('projects');

  // 获取所有项目（不包括已删除的）
  async getAllProjects() {
    try {
      dbLogger.info('开始获取所有项目列表');
      const projects = await this.collection.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).toArray();
      dbLogger.info(`成功获取项目列表，共${projects.length}条记录`);
      return projects;
    } catch (error: any) {
      dbLogger.error('获取项目列表失败', { error: error.message, stack: error.stack });
      throw new Error('获取项目列表失败');
    }
  }

  // 根据ID获取项目（不包括已删除的）
  async getProjectById(id: string) {
    try {
      dbLogger.info(`开始获取项目详情，ID: ${id}`);
      const project = await this.collection.findOne({ id, isDeleted: { $ne: true } });
      if (project) {
        dbLogger.info(`成功获取项目详情，ID: ${id}`);
      } else {
        dbLogger.warn(`未找到项目，ID: ${id}`);
      }
      return project;
    } catch (error: any) {
      dbLogger.error(`获取项目详情失败，ID: ${id}`, { error: error.message, stack: error.stack });
      throw new Error('获取项目信息失败');
    }
  }

  // 创建项目
  async createProject(projectData: Partial<Project>) {
    try {
      dbLogger.info('开始创建项目', { projectData: { id: projectData.id, name: projectData.name } });
      
      // 检查项目ID是否已存在（包括已删除的）
      const existingProject = await this.collection.findOne({ id: projectData.id });
      if (existingProject) {
        dbLogger.warn(`项目ID已存在: ${projectData.id}`);
        throw new Error('项目ID已存在');
      }

      const project = new Project(projectData);
      const result = await this.collection.insertOne(project.toDocument());
      dbLogger.info(`成功创建项目，ID: ${projectData.id}, MongoDB ID: ${result.insertedId}`);
      return result.insertedId;
    } catch (error: any) {
      dbLogger.error('创建项目失败', { projectData: { id: projectData.id, name: projectData.name }, error: error.message, stack: error.stack });
      throw new Error('创建项目失败');
    }
  }

  // 更新项目
  async updateProject(id: string, updateData: Partial<Project>) {
    try {
      dbLogger.info(`开始更新项目，ID: ${id}`, { updateData });
      const result = await this.collection.updateOne(
        { id, isDeleted: { $ne: true } },
        { $set: { ...updateData, updatedAt: new Date() } }
      );
      
      if (result.matchedCount > 0) {
        dbLogger.info(`成功更新项目，ID: ${id}, 影响记录数: ${result.modifiedCount}`);
      } else {
        dbLogger.warn(`未找到要更新的项目，ID: ${id}`);
      }
      
      return result.matchedCount > 0;
    } catch (error: any) {
      dbLogger.error(`更新项目失败，ID: ${id}`, { updateData, error: error.message, stack: error.stack });
      throw new Error('更新项目失败');
    }
  }

  // 软删除项目
  async deleteProject(id: string) {
    try {
      dbLogger.info(`开始软删除项目，ID: ${id}`);
      const result = await this.collection.updateOne(
        { id, isDeleted: { $ne: true } },
        { $set: { isDeleted: true, updatedAt: new Date() } }
      );
      
      if (result.matchedCount > 0) {
        dbLogger.info(`成功软删除项目，ID: ${id}`);
      } else {
        dbLogger.warn(`未找到要删除的项目，ID: ${id}`);
      }
      
      return result.matchedCount > 0;
    } catch (error: any) {
      dbLogger.error(`软删除项目失败，ID: ${id}`, { error: error.message, stack: error.stack });
      throw new Error('删除项目失败');
    }
  }

  // 根据项目ID查找项目（包括已删除的）
  async findByProjectId(projectId: string) {
    try {
      dbLogger.info(`开始查找项目，ID: ${projectId}`);
      const project = await this.collection.findOne({ id: projectId });
      if (project) {
        dbLogger.info(`成功查找项目，ID: ${projectId}`);
      } else {
        dbLogger.warn(`未找到项目，ID: ${projectId}`);
      }
      return project;
    } catch (error: any) {
      dbLogger.error(`查找项目失败，ID: ${projectId}`, { error: error.message, stack: error.stack });
      throw new Error('查找项目失败');
    }
  }

  // 根据项目ID查找项目（不包括已删除的）
  async findActiveProjectById(projectId: string) {
    try {
      dbLogger.info(`开始查找活跃项目，ID: ${projectId}`);
      const project = await this.collection.findOne({ id: projectId, isDeleted: { $ne: true } });
      if (project) {
        dbLogger.info(`成功查找活跃项目，ID: ${projectId}`);
      } else {
        dbLogger.warn(`未找到活跃项目，ID: ${projectId}`);
      }
      return project;
    } catch (error: any) {
      dbLogger.error(`查找活跃项目失败，ID: ${projectId}`, { error: error.message, stack: error.stack });
      throw new Error('查找项目失败');
    }
  }
}

export default new ProjectService(); 