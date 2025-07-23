import db from './pool';

// ID生成器类
export class IdGenerator {
  // 生成项目ID
  static async generateProjectId(): Promise<string> {
    const collection = db.collection('projects');
    const lastProject = await collection.findOne({}, { sort: { id: -1 } });
    
    if (!lastProject) {
      return 'p01';
    }
    
    const lastId = lastProject.id;
    const number = parseInt(lastId.substring(1)) + 1;
    return `p${number.toString().padStart(2, '0')}`;
  }

  // 生成API ID
  static async generateApiId(): Promise<string> {
    const collection = db.collection('apis');
    const lastApi = await collection.findOne({}, { sort: { id: -1 } });
    
    if (!lastApi) {
      return '001';
    }
    
    const lastId = lastApi.id;
    const number = parseInt(lastId) + 1;
    return number.toString().padStart(3, '0');
  }

  // 生成用户ID
  static async generateUserId(): Promise<string> {
    const collection = db.collection('users');
    const lastUser = await collection.findOne({}, { sort: { id: -1 } });
    
    if (!lastUser) {
      return 'u001';
    }
    
    const lastId = lastUser.id;
    const number = parseInt(lastId.substring(1)) + 1;
    return `u${number.toString().padStart(3, '0')}`;
  }
} 