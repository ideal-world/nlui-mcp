import { logger } from './logger';
import { ErrorHandler, ErrorType } from './errorHandler';
import { retry } from '../utils';

/**
 * HTTP方法类型
 * HTTP method types
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * API请求配置
 * API request configuration
 */
export interface ApiRequestConfig {
	method?: HttpMethod;
	headers?: Record<string, string>;
	body?: any;
	timeout?: number;
	retries?: number;
	retryDelay?: number;
}

/**
 * API响应接口
 * API response interface
 */
export interface ApiResponse<T = any> {
	data: T;
	status: number;
	statusText: string;
	headers: Headers;
}

/**
 * API错误接口
 * API error interface
 */
export interface ApiError {
	message: string;
	status?: number;
	code?: string;
	details?: any;
}

/**
 * 统一的API客户端
 * Unified API client
 */
export class ApiClient {
	private baseUrl: string;
	private defaultHeaders: Record<string, string>;
	private defaultTimeout: number;

	constructor(
		baseUrl: string = '',
		defaultHeaders: Record<string, string> = {},
		defaultTimeout: number = 30000
	) {
		this.baseUrl = baseUrl.replace(/\/$/, ''); // 移除尾部斜杠
		this.defaultHeaders = {
			'Content-Type': 'application/json',
			...defaultHeaders
		};
		this.defaultTimeout = defaultTimeout;
	}

	/**
	 * 发送HTTP请求
	 * Send HTTP request
	 */
	 async sendRequest<T>(
		endpoint: string,
		config: ApiRequestConfig = {}
	): Promise<ApiResponse<T>> {
		const url = this.buildUrl(endpoint);
		const startTime = Date.now();

		const requestConfig: RequestInit = {
			method: config.method || 'GET',
			headers: {
				...this.defaultHeaders,
				...config.headers
			},
			signal: AbortSignal.timeout(config.timeout || this.defaultTimeout)
		};

		// 添加请求体
		if (config.body && config.method !== 'GET') {
			if (typeof config.body === 'object') {
				requestConfig.body = JSON.stringify(config.body);
			} else {
				requestConfig.body = config.body;
			}
		}

		try {
			logger.debug(`Sending ${config.method || 'GET'} request to ${url}`, {
				component: 'ApiClient',
				action: 'request',
				metadata: { endpoint, config }
			});

			const response = await fetch(url, requestConfig);
			const duration = Date.now() - startTime;

			// 记录API调用
			logger.apiCall(config.method || 'GET', url, duration, response.status);

			if (!response.ok) {
				let errorData: any;
				try {
					errorData = await response.json();
				} catch {
					errorData = { message: response.statusText };
				}

				throw ErrorHandler.createApiError(
					errorData.message || `HTTP ${response.status}: ${response.statusText}`,
					endpoint,
					response.status
				);
			}

			let data: T;
			const contentType = response.headers.get('content-type');

			if (contentType && contentType.includes('application/json')) {
				data = await response.json();
			} else {
				data = (await response.text()) as unknown as T;
			}

			return {
				data,
				status: response.status,
				statusText: response.statusText,
				headers: response.headers
			};
		} catch (error) {
			const duration = Date.now() - startTime;

			if (error instanceof DOMException && error.name === 'TimeoutError') {
				throw ErrorHandler.createNetworkError('请求超时', url);
			}

			if (error instanceof TypeError && error.message.includes('fetch')) {
				throw ErrorHandler.createNetworkError('网络连接失败', url);
			}

			throw ErrorHandler.handle(error, {
				component: 'ApiClient',
				action: 'request',
				duration,
				metadata: { endpoint, config }
			});
		}
	}

	/**
	 * 构建完整URL
	 * Build full URL
	 */
	private buildUrl(endpoint: string): string {
		if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
			return endpoint;
		}

		const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
		return `${this.baseUrl}${cleanEndpoint}`;
	}

	/**
	 * GET请求
	 * GET request
	 */
	async get<T>(endpoint: string, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<T> {
		const response = await this.sendRequest<T>(endpoint, { ...config, method: 'GET' });
		return response.data;
	}

	/**
	 * POST请求
	 * POST request
	 */
	async post<T>(
		endpoint: string,
		data?: any,
		config?: Omit<ApiRequestConfig, 'method'>
	): Promise<T> {
		const response = await this.sendRequest<T>(endpoint, {
			...config,
			method: 'POST',
			body: data
		});
		return response.data;
	}

	/**
	 * PUT请求
	 * PUT request
	 */
	async put<T>(
		endpoint: string,
		data?: any,
		config?: Omit<ApiRequestConfig, 'method'>
	): Promise<T> {
		const response = await this.sendRequest<T>(endpoint, {
			...config,
			method: 'PUT',
			body: data
		});
		return response.data;
	}

	/**
	 * DELETE请求
	 * DELETE request
	 */
	async delete<T>(
		endpoint: string,
		config?: Omit<ApiRequestConfig, 'method' | 'body'>
	): Promise<T> {
		const response = await this.sendRequest<T>(endpoint, { ...config, method: 'DELETE' });
		return response.data;
	}

	/**
	 * PATCH请求
	 * PATCH request
	 */
	async patch<T>(
		endpoint: string,
		data?: any,
		config?: Omit<ApiRequestConfig, 'method'>
	): Promise<T> {
		const response = await this.sendRequest<T>(endpoint, {
			...config,
			method: 'PATCH',
			body: data
		});
		return response.data;
	}

	/**
	 * 带重试的请求
	 * Request with retry
	 */
	async requestWithRetry<T>(endpoint: string, config: ApiRequestConfig = {}): Promise<T> {
		const { retries = 3, retryDelay = 1000, ...requestConfig } = config;

		return retry(
			() => this.sendRequest<T>(endpoint, requestConfig).then((res) => res.data),
			retries,
			retryDelay
		);
	}

	/**
	 * 设置默认头部
	 * Set default headers
	 */
	setDefaultHeader(key: string, value: string): void {
		this.defaultHeaders[key] = value;
	}

	/**
	 * 移除默认头部
	 * Remove default header
	 */
	removeDefaultHeader(key: string): void {
		delete this.defaultHeaders[key];
	}

	/**
	 * 设置认证令牌
	 * Set authentication token
	 */
	setAuthToken(token: string): void {
		this.setDefaultHeader('Authorization', `Bearer ${token}`);
	}

	/**
	 * 移除认证令牌
	 * Remove authentication token
	 */
	removeAuthToken(): void {
		this.removeDefaultHeader('Authorization');
	}
}

/**
 * 创建默认API客户端实例
 * Create default API client instance
 */
export const apiClient = new ApiClient();
