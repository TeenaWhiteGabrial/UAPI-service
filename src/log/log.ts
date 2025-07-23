import Koa from 'koa'
import log4js from 'log4js'
import { getClientIpAddress } from '../utils/util'
import { LOG } from '../config/constant'

// 创建日志目录
import fs from 'fs'
import path from 'path'

const logDir = path.join(__dirname, '../logs')
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
}

log4js.configure({
    pm2: true,
    appenders: {
        // 控制台输出
        console: {
            type: 'console',
            layout: {
                type: 'pattern',
                pattern: '%[%d{yyyy-MM-dd hh:mm:ss.SSS} [%p] %c -%] %m'
            }
        },
        // 所有日志文件
        everything: {
            type: 'dateFile',
            filename: path.join(logDir, 'all-the-logs.log'),
            maxLogSize: LOG.maxSize,
            backups: LOG.maxFiles,
            layout: {
                type: 'pattern',
                pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} [%p] %c - %m'
            }
        },
        // 错误日志文件
        error: {
            type: 'dateFile',
            filename: path.join(logDir, 'error.log'),
            maxLogSize: LOG.maxSize,
            backups: LOG.maxFiles,
            layout: {
                type: 'pattern',
                pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} [%p] %c - %m'
            }
        },
        // 访问日志文件
        access: {
            type: 'dateFile',
            filename: path.join(logDir, 'access.log'),
            maxLogSize: LOG.maxSize,
            backups: LOG.maxFiles,
            layout: {
                type: 'pattern',
                pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} [%p] %c - %m'
            }
        }
    },
    categories: {
        default: { 
            appenders: ['console', 'everything'], 
            level: LOG.level 
        },
        error: { 
            appenders: ['console', 'error'], 
            level: 'error' 
        },
        access: { 
            appenders: ['console', 'access'], 
            level: 'info' 
        }
    }
})

export const logger = log4js.getLogger()
export const errorLogger = log4js.getLogger('error')
export const accessLogger = log4js.getLogger('access')

// 请求日志中间件
export const loggerMiddleware = async (ctx: Koa.Context, next: Koa.Next) => {
    // 请求开始时间
    const start = new Date()
    const requestId = generateRequestId()
    
    // 记录请求信息
    const remoteAddress = getClientIpAddress(ctx)
    const requestInfo = {
        requestId,
        method: ctx.method,
        url: ctx.url,
        query: ctx.query,
        body: ctx.request.body,
        headers: {
            'user-agent': ctx.headers['user-agent'],
            'content-type': ctx.headers['content-type']
        },
        remoteAddress,
        timestamp: start.toISOString()
    }
    
    logger.info(`[${requestId}] 请求开始: ${JSON.stringify(requestInfo)}`)
    
    try {
        await next()
        
        // 记录响应信息
        const end = new Date()
        const ms = end.getTime() - start.getTime()
        const responseInfo = {
            requestId,
            status: ctx.status,
            body: ctx.body,
            responseTime: `${ms}ms`,
            timestamp: end.toISOString()
        }
        
        if (ctx.status >= 400) {
            errorLogger.warn(`[${requestId}] 请求异常: ${JSON.stringify(responseInfo)}`)
        } else {
            accessLogger.info(`[${requestId}] 请求完成: ${ctx.method} ${ctx.url} ${ctx.status} ${ms}ms`)
        }
        
    } catch (error: any) {
        // 记录错误信息
        const end = new Date()
        const ms = end.getTime() - start.getTime()
        
        const errorInfo = {
            requestId,
            method: ctx.method,
            url: ctx.url,
            error: {
                message: error.message,
                stack: error.stack,
                code: error.code
            },
            responseTime: `${ms}ms`,
            timestamp: end.toISOString()
        }
        
        errorLogger.error(`[${requestId}] 请求错误: ${JSON.stringify(errorInfo)}`)
        
        // 重新抛出错误，让错误处理中间件处理
        throw error
    }
}

// 生成请求ID
function generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 数据库操作日志
export const dbLogger = {
    info: (message: string, data?: any) => {
        logger.info(`[DB] ${message}`, data ? JSON.stringify(data) : '')
    },
    error: (message: string, error?: any) => {
        errorLogger.error(`[DB] ${message}`, error ? JSON.stringify(error) : '')
    },
    warn: (message: string, data?: any) => {
        logger.warn(`[DB] ${message}`, data ? JSON.stringify(data) : '')
    }
}

// 业务逻辑日志
export const businessLogger = {
    info: (message: string, data?: any) => {
        logger.info(`[BUSINESS] ${message}`, data ? JSON.stringify(data) : '')
    },
    error: (message: string, error?: any) => {
        errorLogger.error(`[BUSINESS] ${message}`, error ? JSON.stringify(error) : '')
    },
    warn: (message: string, data?: any) => {
        logger.warn(`[BUSINESS] ${message}`, data ? JSON.stringify(data) : '')
    }
}