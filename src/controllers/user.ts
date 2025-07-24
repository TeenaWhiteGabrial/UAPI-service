import { Context } from 'koa';
import { UserService } from '../services/user';

export class UserController {
  /**
   * 用户登录
   */
  static async login(ctx: Context) {
    try {
      const { username, password } = ctx.request.body as {
        username: string;
        password: string;
      };

      // 参数验证
      if (!username || !password) {
        ctx.status = 400;
        ctx.body = {
          code: 400,
          message: '用户名和密码不能为空'
        };
        return;
      }

      // 调用服务层登录
      const result = await UserService.login(username, password);

      ctx.body = {
        code: 200,
        message: '登录成功',
        data: result
      };
    } catch (error) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        message: error instanceof Error ? error.message : '登录失败'
      };
    }
  }

  /**
   * 用户登出
   */
  static async logout(ctx: Context) {
    try {
      const token = ctx.request.headers.authorization;
      
      if (!token) {
        ctx.status = 400;
        ctx.body = {
          code: 400,
          message: 'Token不能为空'
        };
        return;
      }

      // 移除Bearer前缀
      const cleanToken = token.replace('Bearer ', '');
      
      // 调用服务层登出
      await UserService.logout(cleanToken);

      ctx.body = {
        code: 200,
        message: '登出成功'
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: error instanceof Error ? error.message : '登出失败'
      };
    }
  }

  /**
   * 获取当前用户信息
   */
  static async getCurrentUser(ctx: Context) {
    try {
      const userId = ctx.userId;
      
      if (!userId) {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          message: '未登录'
        };
        return;
      }

      const user = await UserService.getUserById(userId);

      ctx.body = {
        code: 200,
        message: '获取用户信息成功',
        data: user
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: error instanceof Error ? error.message : '获取用户信息失败'
      };
    }
  }

  /**
   * 创建用户
   */
  static async createUser(ctx: Context) {
    try {
      const { username, password, email, role } = ctx.request.body as {
        username: string;
        password: string;
        email?: string;
        role?: 'admin' | 'user';
      };

      // 参数验证
      if (!username || !password) {
        ctx.status = 400;
        ctx.body = {
          code: 400,
          message: '用户名和密码不能为空'
        };
        return;
      }

      const user = await UserService.createUser({
        username,
        password,
        email,
        role
      });

      ctx.body = {
        code: 200,
        message: '用户创建成功',
        data: user
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: error instanceof Error ? error.message : '用户创建失败'
      };
    }
  }

  /**
   * 获取所有用户
   */
  static async getUsers(ctx: Context) {
    try {
      const users = await UserService.getAllUsers();

      ctx.body = {
        code: 200,
        message: '获取用户列表成功',
        data: users
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: error instanceof Error ? error.message : '获取用户列表失败'
      };
    }
  }

  /**
   * 根据ID获取用户
   */
  static async getUserById(ctx: Context) {
    try {
      const { id } = ctx.params;

      const user = await UserService.getUserById(id);

      ctx.body = {
        code: 200,
        message: '获取用户信息成功',
        data: user
      };
    } catch (error) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: error instanceof Error ? error.message : '用户不存在'
      };
    }
  }

  /**
   * 更新用户信息
   */
  static async updateUser(ctx: Context) {
    try {
      const { id } = ctx.params;
      const updateData = ctx.request.body;

      const user = await UserService.updateUser(id, updateData);

      ctx.body = {
        code: 200,
        message: '用户信息更新成功',
        data: user
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: error instanceof Error ? error.message : '用户信息更新失败'
      };
    }
  }

  /**
   * 删除用户
   */
  static async deleteUser(ctx: Context) {
    try {
      const { id } = ctx.params;

      await UserService.deleteUser(id);

      ctx.body = {
        code: 200,
        message: '用户删除成功'
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: error instanceof Error ? error.message : '用户删除失败'
      };
    }
  }
} 