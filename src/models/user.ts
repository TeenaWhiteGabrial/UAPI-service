import { ObjectId } from 'mongodb';

// 用户接口定义
export interface IUser {
  _id?: ObjectId;
  id: string;
  username: string;
  password: string;
  email?: string;
  avatar?: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLoginTime?: Date;
  isDeleted?: boolean; // 软删除标记
  createdAt?: Date;
  updatedAt?: Date;
}

// 用户模型类
export class User implements IUser {
  _id?: ObjectId;
  id: string;
  username: string;
  password: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLoginTime?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<IUser>) {
    this.id = data.id || '';
    this.username = data.username || '';
    this.password = data.password || '';
    this.email = data.email || '';
    this.avatar = data.avatar || '';
    this.role = data.role || 'user';
    this.status = data.status || 'active';
    this.lastLoginTime = data.lastLoginTime;
    this.isDeleted = data.isDeleted || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // 转换为数据库文档
  toDocument() {
    return {
      id: this.id,
      username: this.username,
      password: this.password,
      email: this.email,
      avatar: this.avatar,
      role: this.role,
      status: this.status,
      lastLoginTime: this.lastLoginTime,
      isDeleted: this.isDeleted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // 从数据库文档创建实例
  static fromDocument(doc: any): User {
    return new User({
      _id: doc._id,
      id: doc.id,
      username: doc.username,
      password: doc.password,
      email: doc.email,
      avatar: doc.avatar,
      role: doc.role,
      status: doc.status,
      lastLoginTime: doc.lastLoginTime,
      isDeleted: doc.isDeleted,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
} 