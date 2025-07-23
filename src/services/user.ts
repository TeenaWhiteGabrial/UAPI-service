
import { User } from '../models/user';
import db from '../utils/pool';
import { ObjectId } from 'mongodb';

export class UserService {
  private collection = db.collection('users');

  // 获取所有用户
  async getAllUsers() {
    try {
      return await this.collection.find({}).toArray();
    } catch (error) {
      throw new Error('获取用户列表失败');
    }
  }

  // 根据ID获取用户
  async getUserById(id: string) {
    try {
      return await this.collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw new Error('获取用户信息失败');
    }
  }

  // 创建用户
  async createUser(userData: Partial<User>) {
    try {
      const user = new User(userData);
      const result = await this.collection.insertOne(user.toDocument());
      return result.insertedId;
    } catch (error) {
      throw new Error('创建用户失败');
    }
  }

  // 更新用户
  async updateUser(id: string, updateData: Partial<User>) {
    try {
      const result = await this.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updateData, updatedAt: new Date() } }
      );
      return result.matchedCount > 0;
    } catch (error) {
      throw new Error('更新用户失败');
    }
  }

  // 删除用户
  async deleteUser(id: string) {
    try {
      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      throw new Error('删除用户失败');
    }
  }

  // 根据用户名查找用户
  async findByUsername(username: string) {
    try {
      return await this.collection.findOne({ username });
    } catch (error) {
      throw new Error('查找用户失败');
    }
  }

  // 根据邮箱查找用户
  async findByEmail(email: string) {
    try {
      return await this.collection.findOne({ email });
    } catch (error) {
      throw new Error('查找用户失败');
    }
  }
}

export default new UserService(); 