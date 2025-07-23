import { Context } from 'koa';
import { User } from '../models/user';
import db from '../utils/pool';

export class UserController {
  // 获取用户列表
  static async getUsers(ctx: Context) {
    try {
      const collection = db.collection('users');
      const users = await collection.find({}).toArray();
      
      ctx.body = {
        code: 200,
        message: '获取用户列表成功',
        data: users
      };
    } catch (error: any) {
      ctx.body = {
        code: 500,
        message: '获取用户列表失败',
        error: error.message
      };
    }
  }

  // 根据ID获取用户
  static async getUserById(ctx: Context) {
    try {
      const { id } = ctx.params;
      const collection = db.collection('users');
      const user = await collection.findOne({ _id: id });
      
      if (!user) {
        ctx.body = {
          code: 404,
          message: '用户不存在'
        };
        return;
      }
      
      ctx.body = {
        code: 200,
        message: '获取用户信息成功',
        data: user
      };
    } catch (error: any) {
      ctx.body = {
        code: 500,
        message: '获取用户信息失败',
        error: error.message
      };
    }
  }

  // 创建用户
  static async createUser(ctx: Context) {
    try {
      const userData = ctx.request.body;
      const user = new User(userData);
      
      const collection = db.collection('users');
      const result = await collection.insertOne(user.toDocument());
      
      ctx.body = {
        code: 201,
        message: '创建用户成功',
        data: { id: result.insertedId }
      };
    } catch (error: any) {
      ctx.body = {
        code: 500,
        message: '创建用户失败',
        error: error.message
      };
    }
  }

  // 更新用户
  static async updateUser(ctx: Context) {
    try {
      const { id } = ctx.params;
      const updateData = ctx.request.body;
      updateData.updatedAt = new Date();
      
      const collection = db.collection('users');
      const result = await collection.updateOne(
        { _id: id },
        { $set: updateData }
      );
      
      if (result.matchedCount === 0) {
        ctx.body = {
          code: 404,
          message: '用户不存在'
        };
        return;
      }
      
      ctx.body = {
        code: 200,
        message: '更新用户成功'
      };
    } catch (error: any) {
      ctx.body = {
        code: 500,
        message: '更新用户失败',
        error: error.message
      };
    }
  }

  // 删除用户
  static async deleteUser(ctx: Context) {
    try {
      const { id } = ctx.params;
      const collection = db.collection('users');
      const result = await collection.deleteOne({ _id: id });
      
      if (result.deletedCount === 0) {
        ctx.body = {
          code: 404,
          message: '用户不存在'
        };
        return;
      }
      
      ctx.body = {
        code: 200,
        message: '删除用户成功'
      };
    } catch (error: any) {
      ctx.body = {
        code: 500,
        message: '删除用户失败',
        error: error.message
      };
    }
  }
}