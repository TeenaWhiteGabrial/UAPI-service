import { ObjectId } from 'mongodb';

// 项目接口
export interface IProject {
  _id?: ObjectId;
  id: string;
  name: string;
  isDeleted?: boolean; // 软删除标记
  createdAt?: Date;
  updatedAt?: Date;
}

// 项目模型类
export class Project implements IProject {
  _id?: ObjectId;
  id: string;
  name: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<IProject>) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.isDeleted = data.isDeleted || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // 转换为数据库文档
  toDocument() {
    return {
      id: this.id,
      name: this.name,
      isDeleted: this.isDeleted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // 从数据库文档创建实例
  static fromDocument(doc: any): Project {
    return new Project({
      _id: doc._id,
      id: doc.id,
      name: doc.name,
      isDeleted: doc.isDeleted,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
} 