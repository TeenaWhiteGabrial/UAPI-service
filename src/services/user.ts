import { User, IUser } from '../models/user';
import { createSnowId, cryptoMd5, generatorToken } from '../utils/util';
import db from '../utils/pool';

// 存储失效的token（实际项目中建议使用Redis）
const invalidTokens = new Set<string>();

export class UserService {
  private static collection = db.collection('users');

  /**
   * 用户登录
   */
  static async login(username: string, password: string) {
    try {
      // 查找用户
      const userDoc = await this.collection.findOne({ 
        username, 
        isDeleted: { $ne: true } 
      });
      
      if (!userDoc) {
        throw new Error('用户名或密码错误');
      }

      const user = User.fromDocument(userDoc);

      // 验证密码
      const hashedPassword = cryptoMd5(password);
      if (user.password !== hashedPassword) {
        throw new Error('用户名或密码错误');
      }

      // 检查用户状态
      if (user.status !== 'active') {
        throw new Error('用户已被禁用');
      }

      // 更新最后登录时间
      await this.collection.updateOne(
        { id: user.id },
        { $set: { lastLoginTime: new Date(), updatedAt: new Date() } }
      );

      // 生成token
      const token = generatorToken(parseInt(user.id));

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          role: user.role
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 用户登出
   */
  static async logout(token: string) {
    try {
      // 将token加入失效列表
      invalidTokens.add(token);
      return { message: '登出成功' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 检查token是否失效
   */
  static isTokenInvalid(token: string): boolean {
    return invalidTokens.has(token);
  }

  /**
   * 创建用户
   */
  static async createUser(userData: {
    username: string;
    password: string;
    email?: string;
    role?: 'admin' | 'user';
  }) {
    try {
      // 检查用户名是否已存在
      const existingUser = await this.collection.findOne({ 
        username: userData.username,
        isDeleted: { $ne: true }
      });
      
      if (existingUser) {
        throw new Error('用户名已存在');
      }

      // 生成用户ID
      const userId = createSnowId().toString();
      
      // 加密密码
      const hashedPassword = cryptoMd5(userData.password);

      // 创建用户
      const user = new User({
        id: userId,
        username: userData.username,
        password: hashedPassword,
        email: userData.email,
        role: userData.role || 'user',
        status: 'active'
      });

      await this.collection.insertOne(user.toDocument());

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 根据ID获取用户信息
   */
  static async getUserById(userId: string) {
    try {
      const userDoc = await this.collection.findOne({ 
        id: userId,
        isDeleted: { $ne: true }
      });
      
      if (!userDoc) {
        throw new Error('用户不存在');
      }

      const user = User.fromDocument(userDoc);

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        lastLoginTime: user.lastLoginTime,
        createdAt: user.createdAt
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取所有用户
   */
  static async getAllUsers() {
    try {
      const users = await this.collection.find({ 
        isDeleted: { $ne: true } 
      }).toArray();
      
      return users.map(userDoc => {
        const user = User.fromDocument(userDoc);
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          status: user.status,
          lastLoginTime: user.lastLoginTime,
          createdAt: user.createdAt
        };
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * 更新用户信息
   */
  static async updateUser(userId: string, updateData: Partial<IUser>) {
    try {
      const userDoc = await this.collection.findOne({ 
        id: userId,
        isDeleted: { $ne: true }
      });
      
      if (!userDoc) {
        throw new Error('用户不存在');
      }

      // 如果更新密码，需要加密
      if (updateData.password) {
        updateData.password = cryptoMd5(updateData.password);
      }

      // 添加更新时间
      updateData.updatedAt = new Date();

      const result = await this.collection.updateOne(
        { id: userId },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        throw new Error('用户不存在');
      }

      // 返回更新后的用户信息（不包含密码）
      const updatedUserDoc = await this.collection.findOne({ id: userId });
      const updatedUser = User.fromDocument(updatedUserDoc);
      
      return {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        status: updatedUser.status,
        lastLoginTime: updatedUser.lastLoginTime,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 删除用户（软删除）
   */
  static async deleteUser(userId: string) {
    try {
      const userDoc = await this.collection.findOne({ 
        id: userId,
        isDeleted: { $ne: true }
      });
      
      if (!userDoc) {
        throw new Error('用户不存在');
      }

      // 软删除
      await this.collection.updateOne(
        { id: userId },
        { $set: { isDeleted: true, updatedAt: new Date() } }
      );
      
      return { message: '用户删除成功' };
    } catch (error) {
      throw error;
    }
  }
} 