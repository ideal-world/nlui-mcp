/**
 * 统一日志管理器
 * Unified Logger for NLUI-MCP
 */

export enum LogLevel {
	DEBUG = 0,
	INFO = 1,
	WARN = 2,
	ERROR = 3,
	SILENT = 4
}

export interface LogContext {
	component?: string;
	action?: string;
	duration?: number;
	metadata?: Record<string, unknown>;
}

class Logger {
	private logLevel: LogLevel = LogLevel.INFO;
	private isDevelopment =
		typeof window !== 'undefined'
			? window.location.hostname === 'localhost'
			: process.env.NODE_ENV === 'development';

	/**
	 * 设置日志级别
	 * Set log level
	 */
	setLogLevel(level: LogLevel): void {
		this.logLevel = level;
	}

	/**
	 * 格式化日志消息
	 * Format log message
	 */
	private formatMessage(level: string, message: string, context?: LogContext): string {
		const timestamp = new Date().toISOString();
		const prefix = `[${timestamp}] [${level}]`;

		if (context?.component) {
			return `${prefix} [${context.component}] ${message}`;
		}

		return `${prefix} ${message}`;
	}

	/**
	 * 格式化上下文信息
	 * Format context information
	 */
	private formatContext(context?: LogContext): string {
		if (!context) return '';

		const parts: string[] = [];

		if (context.action) {
			parts.push(`Action: ${context.action}`);
		}

		if (context.duration !== undefined) {
			parts.push(`Duration: ${context.duration}ms`);
		}

		if (context.metadata) {
			parts.push(`Metadata: ${JSON.stringify(context.metadata, null, 2)}`);
		}

		return parts.length > 0 ? `\n${parts.join('\n')}` : '';
	}

	/**
	 * 输出调试信息
	 * Debug logging
	 */
	debug(message: string, context?: LogContext): void {
		if (this.logLevel <= LogLevel.DEBUG && this.isDevelopment) {
			const formattedMessage = this.formatMessage('DEBUG', message, context);
			const contextInfo = this.formatContext(context);
			console.debug(`🔍 ${formattedMessage}${contextInfo}`);
		}
	}

	/**
	 * 输出信息
	 * Info logging
	 */
	info(message: string, context?: LogContext): void {
		if (this.logLevel <= LogLevel.INFO) {
			const formattedMessage = this.formatMessage('INFO', message, context);
			const contextInfo = this.formatContext(context);
			console.info(`ℹ️ ${formattedMessage}${contextInfo}`);
		}
	}

	/**
	 * 输出警告
	 * Warning logging
	 */
	warn(message: string, context?: LogContext): void {
		if (this.logLevel <= LogLevel.WARN) {
			const formattedMessage = this.formatMessage('WARN', message, context);
			const contextInfo = this.formatContext(context);
			console.warn(`⚠️ ${formattedMessage}${contextInfo}`);
		}
	}

	/**
	 * 输出错误
	 * Error logging
	 */
	error(message: string, error?: Error | unknown, context?: LogContext): void {
		if (this.logLevel <= LogLevel.ERROR) {
			const formattedMessage = this.formatMessage('ERROR', message, context);
			const contextInfo = this.formatContext(context);

			if (error instanceof Error) {
				console.error(`❌ ${formattedMessage}${contextInfo}`, error);
			} else if (error) {
				console.error(`❌ ${formattedMessage}${contextInfo}`, String(error));
			} else {
				console.error(`❌ ${formattedMessage}${contextInfo}`);
			}
		}
	}

	/**
	 * 性能计时开始
	 * Start performance timing
	 */
	timeStart(label: string): void {
		if (this.isDevelopment) {
			console.time(`⏱️ ${label}`);
		}
	}

	/**
	 * 性能计时结束
	 * End performance timing
	 */
	timeEnd(label: string): void {
		if (this.isDevelopment) {
			console.timeEnd(`⏱️ ${label}`);
		}
	}

	/**
	 * 记录API调用
	 * Log API calls
	 */
	apiCall(method: string, url: string, duration: number, status?: number): void {
		const context: LogContext = {
			component: 'API',
			action: method,
			duration,
			metadata: { url, status }
		};

		if (status && status >= 400) {
			this.error(`API call failed: ${method} ${url}`, undefined, context);
		} else {
			this.info(`API call completed: ${method} ${url}`, context);
		}
	}
}

// 导出单例实例
export const logger = new Logger();

// 在开发环境下设置更详细的日志
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
	logger.setLogLevel(LogLevel.DEBUG);
}else{
	logger.setLogLevel(LogLevel.INFO);
}
