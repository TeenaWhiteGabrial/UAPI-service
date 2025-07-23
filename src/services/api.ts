import { Api } from '../models/api';
import db from '../utils/pool';
import { ObjectId } from 'mongodb';
import { dbLogger, businessLogger } from '../log/log';

export class ApiService {
  private collection = db.collection('apis');

  // 获取所有接口（不包括已删除的）
  async getAllApis() {
    try {
      dbLogger.info('开始获取所有API接口列表');
      const apis = await this.collection.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).toArray();
      dbLogger.info(`成功获取API接口列表，共${apis.length}条记录`);
      return apis;
    } catch (error: any) {
      dbLogger.error('获取API接口列表失败', { error: error.message, stack: error.stack });
      throw new Error('获取接口列表失败');
    }
  }

  // 根据项目ID获取接口列表（不包括已删除的）
  async getApisByProjectId(projectId: string) {
    try {
      dbLogger.info(`开始获取项目${projectId}的API接口列表`);
      const apis = await this.collection.find({ projectId, isDeleted: { $ne: true } }).sort({ createdAt: -1 }).toArray();
      dbLogger.info(`成功获取项目${projectId}的API接口列表，共${apis.length}条记录`);
      return apis;
    } catch (error: any) {
      dbLogger.error(`获取项目${projectId}的API接口列表失败`, { error: error.message, stack: error.stack });
      throw new Error('获取项目接口列表失败');
    }
  }

  // 根据ID获取接口详情（不包括已删除的）
  async getApiById(id: string) {
    try {
      dbLogger.info(`开始获取API接口详情，ID: ${id}`);
      const api = await this.collection.findOne({ id, isDeleted: { $ne: true } });
      if (api) {
        dbLogger.info(`成功获取API接口详情，ID: ${id}`);
      } else {
        dbLogger.warn(`未找到API接口，ID: ${id}`);
      }
      return api;
    } catch (error: any) {
      dbLogger.error(`获取API接口详情失败，ID: ${id}`, { error: error.message, stack: error.stack });
      throw new Error('获取接口详情失败');
    }
  }

  // 创建接口
  async createApi(apiData: Partial<Api>) {
    try {
      dbLogger.info('开始创建API接口', { apiData: { id: apiData.id, name: apiData.name, projectId: apiData.projectId } });
      
      // 检查接口ID是否已存在（包括已删除的）
      const existingApi = await this.collection.findOne({ id: apiData.id });
      if (existingApi) {
        dbLogger.warn(`API接口ID已存在: ${apiData.id}`);
        throw new Error('接口ID已存在');
      }

      const api = new Api(apiData);
      const result = await this.collection.insertOne(api.toDocument());
      dbLogger.info(`成功创建API接口，ID: ${apiData.id}, MongoDB ID: ${result.insertedId}`);
      return result.insertedId;
    } catch (error: any) {
      dbLogger.error('创建API接口失败', { apiData: { id: apiData.id, name: apiData.name }, error: error.message, stack: error.stack });
      throw new Error('创建接口失败');
    }
  }

  // 更新接口
  async updateApi(id: string, updateData: Partial<Api>) {
    try {
      dbLogger.info(`开始更新API接口，ID: ${id}`, { updateData });
      const result = await this.collection.updateOne(
        { id, isDeleted: { $ne: true } },
        { $set: { ...updateData, updatedAt: new Date() } }
      );
      
      if (result.matchedCount > 0) {
        dbLogger.info(`成功更新API接口，ID: ${id}, 影响记录数: ${result.modifiedCount}`);
      } else {
        dbLogger.warn(`未找到要更新的API接口，ID: ${id}`);
      }
      
      return result.matchedCount > 0;
    } catch (error: any) {
      dbLogger.error(`更新API接口失败，ID: ${id}`, { updateData, error: error.message, stack: error.stack });
      throw new Error('更新接口失败');
    }
  }

  // 软删除接口
  async deleteApi(id: string) {
    try {
      dbLogger.info(`开始软删除API接口，ID: ${id}`);
      const result = await this.collection.updateOne(
        { id, isDeleted: { $ne: true } },
        { $set: { isDeleted: true, updatedAt: new Date() } }
      );
      
      if (result.matchedCount > 0) {
        dbLogger.info(`成功软删除API接口，ID: ${id}`);
      } else {
        dbLogger.warn(`未找到要删除的API接口，ID: ${id}`);
      }
      
      return result.matchedCount > 0;
    } catch (error: any) {
      dbLogger.error(`软删除API接口失败，ID: ${id}`, { error: error.message, stack: error.stack });
      throw new Error('删除接口失败');
    }
  }

  // 根据项目ID软删除所有接口
  async deleteApisByProjectId(projectId: string) {
    try {
      dbLogger.info(`开始软删除项目${projectId}的所有API接口`);
      const result = await this.collection.updateMany(
        { projectId, isDeleted: { $ne: true } },
        { $set: { isDeleted: true, updatedAt: new Date() } }
      );
      dbLogger.info(`成功软删除项目${projectId}的API接口，影响记录数: ${result.modifiedCount}`);
      return result.modifiedCount;
    } catch (error: any) {
      dbLogger.error(`软删除项目${projectId}的API接口失败`, { error: error.message, stack: error.stack });
      throw new Error('删除项目接口失败');
    }
  }

  // 根据接口ID查找接口（包括已删除的）
  async findByApiId(apiId: string) {
    try {
      dbLogger.info(`开始查找API接口，ID: ${apiId}`);
      const api = await this.collection.findOne({ id: apiId });
      if (api) {
        dbLogger.info(`成功查找API接口，ID: ${apiId}`);
      } else {
        dbLogger.warn(`未找到API接口，ID: ${apiId}`);
      }
      return api;
    } catch (error: any) {
      dbLogger.error(`查找API接口失败，ID: ${apiId}`, { error: error.message, stack: error.stack });
      throw new Error('查找接口失败');
    }
  }
}

export default new ApiService(); 