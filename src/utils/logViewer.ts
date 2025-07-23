import fs from 'fs';
import path from 'path';

// 日志查看工具
export class LogViewer {
  private logDir = path.join(__dirname, '../logs');

  // 获取最新的错误日志
  static getLatestErrorLogs(lines: number = 50): string[] {
    const logDir = path.join(__dirname, '../logs');
    const errorLogPath = path.join(logDir, 'error.log');
    
    if (!fs.existsSync(errorLogPath)) {
      return ['错误日志文件不存在'];
    }

    try {
      const content = fs.readFileSync(errorLogPath, 'utf8');
      const logLines = content.split('\n').filter(line => line.trim());
      return logLines.slice(-lines);
    } catch (error) {
      return [`读取错误日志失败: ${error}`];
    }
  }

  // 获取最新的访问日志
  static getLatestAccessLogs(lines: number = 50): string[] {
    const logDir = path.join(__dirname, '../logs');
    const accessLogPath = path.join(logDir, 'access.log');
    
    if (!fs.existsSync(accessLogPath)) {
      return ['访问日志文件不存在'];
    }

    try {
      const content = fs.readFileSync(accessLogPath, 'utf8');
      const logLines = content.split('\n').filter(line => line.trim());
      return logLines.slice(-lines);
    } catch (error) {
      return [`读取访问日志失败: ${error}`];
    }
  }

  // 获取最新的所有日志
  static getLatestAllLogs(lines: number = 50): string[] {
    const logDir = path.join(__dirname, '../logs');
    const allLogPath = path.join(logDir, 'all-the-logs.log');
    
    if (!fs.existsSync(allLogPath)) {
      return ['所有日志文件不存在'];
    }

    try {
      const content = fs.readFileSync(allLogPath, 'utf8');
      const logLines = content.split('\n').filter(line => line.trim());
      return logLines.slice(-lines);
    } catch (error) {
      return [`读取所有日志失败: ${error}`];
    }
  }

  // 搜索包含特定关键词的日志
  static searchLogs(keyword: string, logType: 'error' | 'access' | 'all' = 'all'): string[] {
    const logDir = path.join(__dirname, '../logs');
    let logPath: string;

    switch (logType) {
      case 'error':
        logPath = path.join(logDir, 'error.log');
        break;
      case 'access':
        logPath = path.join(logDir, 'access.log');
        break;
      default:
        logPath = path.join(logDir, 'all-the-logs.log');
    }

    if (!fs.existsSync(logPath)) {
      return [`${logType}日志文件不存在`];
    }

    try {
      const content = fs.readFileSync(logPath, 'utf8');
      const logLines = content.split('\n').filter(line => line.trim());
      return logLines.filter(line => line.toLowerCase().includes(keyword.toLowerCase()));
    } catch (error) {
      return [`搜索日志失败: ${error}`];
    }
  }

  // 获取日志文件信息
  static getLogFileInfo(): any {
    const logDir = path.join(__dirname, '../logs');
    const files = ['error.log', 'access.log', 'all-the-logs.log'];
    const info: any = {};

    files.forEach(file => {
      const filePath = path.join(logDir, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        info[file] = {
          size: `${(stats.size / 1024).toFixed(2)} KB`,
          modified: stats.mtime.toISOString(),
          exists: true
        };
      } else {
        info[file] = {
          exists: false
        };
      }
    });

    return info;
  }
} 