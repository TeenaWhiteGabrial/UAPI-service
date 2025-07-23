import { ObjectId } from 'mongodb';

// 用户模型接口
export interface IUser {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 用户模型类
export class User implements IUser {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<IUser>) {
    this.username = data.username || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.role = data.role || 'user';
    this.isActive = data.isActive ?? true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // 转换为数据库文档
  toDocument() {
    return {
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // 从数据库文档创建实例
  static fromDocument(doc: any): User {
    return new User({
      _id: doc._id,
      username: doc.username,
      email: doc.email,
      password: doc.password,
      role: doc.role,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
