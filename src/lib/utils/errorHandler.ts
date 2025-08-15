import { logger } from './logger';
import type { LogContext } from './logger';
import * as m from '../../paraglide/messages';

/**
 * 错误类型枚举
 * Error types enumeration
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  API = 'API',
  RENDER = 'RENDER',
  CONFIG = 'CONFIG',
  PERMISSION = 'PERMISSION',
  UNKNOWN = 'UNKNOWN'
}

/**
 * 自定义错误类
 * Custom error class
 */
export class NLUIError extends Error {
  public readonly type: ErrorType;
  public readonly context?: LogContext;
  public readonly originalError?: Error;

  constructor(message: string, type: ErrorType = ErrorType.UNKNOWN, context?: LogContext, originalError?: Error) {
    super(message);
    this.name = 'NLUIError';
    this.type = type;
    this.context = context;
    this.originalError = originalError;

    // 确保错误堆栈正确
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NLUIError);
    }
  }

  /**
   * 获取用户友好的错误信息
   * Get user-friendly error message
   */
  getUserMessage(): string {
    switch (this.type) {
      case ErrorType.VALIDATION:
        return m.error_validation();
      case ErrorType.NETWORK:
        return m.error_network();
      case ErrorType.API:
        return m.error_api();
      case ErrorType.RENDER:
        return m.error_render();
      case ErrorType.CONFIG:
        return m.error_config();
      case ErrorType.PERMISSION:
        return m.error_permission();
      default:
        return m.error_unknown();
    }
  }
}

/**
 * 错误处理工具类
 * Error handling utility class
 */
export class ErrorHandler {
  /**
   * 处理并记录错误
   * Handle and log error
   */
  static handle(error: unknown, context?: LogContext): NLUIError {
    if (error instanceof NLUIError) {
      logger.error(error.message, error.originalError, {
        ...context,
        ...error.context,
        metadata: {
          type: error.type,
          ...context?.metadata,
          ...error.context?.metadata
        }
      });
      return error;
    }

    if (error instanceof Error) {
      const nluiError = new NLUIError(error.message, this.inferErrorType(error), context, error);

      logger.error(error.message, error, context);
      return nluiError;
    }

    const errorMessage = String(error);
    const nluiError = new NLUIError(errorMessage, ErrorType.UNKNOWN, context);
    logger.error(errorMessage, undefined, context);
    return nluiError;
  }

  /**
   * 推断错误类型
   * Infer error type from error message/properties
   */
  private static inferErrorType(error: Error): ErrorType {
    const message = error.message.toLowerCase();

    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorType.VALIDATION;
    }

    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return ErrorType.NETWORK;
    }

    if (message.includes('api') || message.includes('server')) {
      return ErrorType.API;
    }

    if (message.includes('render') || message.includes('component')) {
      return ErrorType.RENDER;
    }

    if (message.includes('config') || message.includes('setting')) {
      return ErrorType.CONFIG;
    }

    if (message.includes('permission') || message.includes('unauthorized')) {
      return ErrorType.PERMISSION;
    }

    return ErrorType.UNKNOWN;
  }

  /**
   * 创建验证错误
   * Create validation error
   */
  static createValidationError(message: string, field?: string): NLUIError {
    return new NLUIError(message, ErrorType.VALIDATION, {
      component: 'Validation',
      metadata: { field }
    });
  }

  /**
   * 创建网络错误
   * Create network error
   */
  static createNetworkError(message: string, url?: string, status?: number): NLUIError {
    return new NLUIError(message, ErrorType.NETWORK, {
      component: 'Network',
      metadata: { url, status }
    });
  }

  /**
   * 创建API错误
   * Create API error
   */
  static createApiError(message: string, endpoint?: string, status?: number): NLUIError {
    return new NLUIError(message, ErrorType.API, {
      component: 'API',
      metadata: { endpoint, status }
    });
  }

  /**
   * 创建渲染错误
   * Create render error
   */
  static createRenderError(message: string, componentType?: string): NLUIError {
    return new NLUIError(message, ErrorType.RENDER, {
      component: 'Renderer',
      metadata: { componentType }
    });
  }

  /**
   * 安全执行异步函数
   * Safely execute async function
   */
  static async safeExecute<T>(fn: () => Promise<T>, context?: LogContext): Promise<{ data?: T; error?: NLUIError }> {
    try {
      const data = await fn();
      return { data };
    } catch (error) {
      return { error: this.handle(error, context) };
    }
  }

  /**
   * 安全执行同步函数
   * Safely execute sync function
   */
  static safeSyncExecute<T>(fn: () => T, context?: LogContext): { data?: T; error?: NLUIError } {
    try {
      const data = fn();
      return { data };
    } catch (error) {
      return { error: this.handle(error, context) };
    }
  }
}

/**
 * 快捷错误创建函数
 * Shortcut error creation functions
 */
export const createError = {
  validation: ErrorHandler.createValidationError,
  network: ErrorHandler.createNetworkError,
  api: ErrorHandler.createApiError,
  render: ErrorHandler.createRenderError
};
