import { ObjectId } from 'mongodb';

// API接口
export interface IApi {
  _id?: ObjectId;
  id: string;
  projectId: string;
  name: string;
  description: string;
  method: 'GET' | 'POST'; // 限制为GET和POST
  url: string;
  param: string;
  response: string;
  isDeleted?: boolean; // 软删除标记
  createdAt?: Date;
  updatedAt?: Date;
}

// API模型类
export class Api implements IApi {
  _id?: ObjectId;
  id: string;
  projectId: string;
  name: string;
  description: string;
  method: 'GET' | 'POST';
  url: string;
  param: string;
  response: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<IApi>) {
    this.id = data.id || '';
    this.projectId = data.projectId || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.method = data.method || 'GET';
    this.url = data.url || '';
    this.param = data.param || '';
    this.response = data.response || '';
    this.isDeleted = data.isDeleted || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // 转换为数据库文档
  toDocument() {
    return {
      id: this.id,
      projectId: this.projectId,
      name: this.name,
      description: this.description,
      method: this.method,
      url: this.url,
      param: this.param,
      response: this.response,
      isDeleted: this.isDeleted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // 从数据库文档创建实例
  static fromDocument(doc: any): Api {
    return new Api({
      _id: doc._id,
      id: doc.id,
      projectId: doc.projectId,
      name: doc.name,
      description: doc.description,
      method: doc.method,
      url: doc.url,
      param: doc.param,
      response: doc.response,
      isDeleted: doc.isDeleted,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
} 