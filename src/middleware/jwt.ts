import { Context, Next } from "koa";
import { CODE } from "../config/code";
import { decodeToken } from "../utils/util";
import { getRequestType } from "../type/global";
import { PLATFORM } from "../config/constant";
import { UserService } from "../services/user";

/** 校验Token是否合法 */
export const jwtMiddlewareDeal = async (ctx: Context, next: Next) => {
  const token = ctx.request.headers.authorization;
  if (typeof token === "string") {
    try {
      // 移除Bearer前缀
      const cleanToken = token.replace('Bearer ', '');
      
      // 检查token是否已失效
      if (UserService.isTokenInvalid(cleanToken)) {
        throw CODE.tokenFailed;
      }

      const userId = decodeToken(cleanToken);

      if (userId === null || userId === undefined) {
        throw CODE.tokenFailed;
      }
      else {
        ctx.userId = userId;
      }
    } catch (error) {
      throw CODE.tokenFailed;
    }
  } else {
    throw CODE.tokenFailed;
  }
  return next();
};

// 校验header中platform是否合法
export const platformMiddlewareDeal = async (ctx: Context, next: Next) => {
  const { platform } = ctx.request.headers as getRequestType;
  // @ts-ignore
  if (!PLATFORM[platform]) {
    throw CODE.missingParameters;
  }
  ctx.platform = platform;
  return next();
};
