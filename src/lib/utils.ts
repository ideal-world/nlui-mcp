/**
 * 通用工具函数集合
 * Common utility functions collection
 */

/**
 * 生成UUID
 * Generate UUID
 */
export function generateUUID(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

  export function isObject(item: any): boolean {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  export function mergeDeep(target: any, source: any): any {
    const output = { ...target };
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = mergeDeep(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

/**
 * 防抖函数
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func.apply(null, args), delay);
	};
}

/**
 * 节流函数
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
	func: T,
	delay: number
): (...args: Parameters<T>) => void {
	let lastCall = 0;
	return (...args: Parameters<T>) => {
		const now = Date.now();
		if (now - lastCall >= delay) {
			lastCall = now;
			func.apply(null, args);
		}
	};
}

/**
 * 深度克隆对象
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}

	if (obj instanceof Date) {
		return new Date(obj.getTime()) as T;
	}

	if (obj instanceof Array) {
		return obj.map((item) => deepClone(item)) as T;
	}

	if (typeof obj === 'object') {
		const clonedObj = {} as T;
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				clonedObj[key] = deepClone(obj[key]);
			}
		}
		return clonedObj;
	}

	return obj;
}

/**
 * 检查是否为空值
 * Check if value is empty
 */
export function isEmpty(value: unknown): boolean {
	if (value === null || value === undefined) {
		return true;
	}

	if (typeof value === 'string') {
		return value.trim().length === 0;
	}

	if (Array.isArray(value)) {
		return value.length === 0;
	}

	if (typeof value === 'object') {
		return Object.keys(value).length === 0;
	}

	return false;
}

/**
 * 安全的JSON解析
 * Safe JSON parse
 */
export function safeJsonParse<T>(jsonString: string, defaultValue: T): T {
	try {
		const parsed = JSON.parse(jsonString);
		return parsed !== null ? parsed : defaultValue;
	} catch {
		return defaultValue;
	}
}

/**
 * 格式化文件大小
 * Format file size
 */
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 格式化时间差
 * Format time difference
 */
export function formatTimeDiff(timestamp: number): string {
	const now = Date.now();
	const diff = now - timestamp;
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) {
		return `${days}天前`;
	} else if (hours > 0) {
		return `${hours}小时前`;
	} else if (minutes > 0) {
		return `${minutes}分钟前`;
	} else {
		return `${seconds}秒前`;
	}
}

/**
 * 截断文本
 * Truncate text
 */
export function truncateText(text: string, maxLength: number, suffix = '...'): string {
	if (text.length <= maxLength) {
		return text;
	}
	return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * 验证邮箱格式
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * 验证URL格式
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

/**
 * 获取URL参数
 * Get URL parameter
 */
export function getUrlParameter(name: string): string | null {
	if (typeof window === 'undefined') {
		return null;
	}
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(name);
}

/**
 * 设置URL参数
 * Set URL parameter
 */
export function setUrlParameter(name: string, value: string): void {
	if (typeof window === 'undefined') {
		return;
	}
	const url = new URL(window.location.href);
	url.searchParams.set(name, value);
	window.history.replaceState({}, '', url.toString());
}

/**
 * 复制到剪贴板
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
	try {
		if (navigator.clipboard && window.isSecureContext) {
			await navigator.clipboard.writeText(text);
			return true;
		} else {
			// Fallback for older browsers
			const textArea = document.createElement('textarea');
			textArea.value = text;
			textArea.style.position = 'fixed';
			textArea.style.left = '-999999px';
			textArea.style.top = '-999999px';
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			const result = document.execCommand('copy');
			textArea.remove();
			return result;
		}
	} catch {
		return false;
	}
}

/**
 * 生成随机字符串
 * Generate random string
 */
export function generateRandomString(length: number): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

/**
 * 等待指定时间
 * Wait for specified time
 */
export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 重试函数
 * Retry function
 */
export async function retry<T>(
	fn: () => Promise<T>,
	maxAttempts: number = 3,
	delay: number = 1000
): Promise<T> {
	let lastError: Error;

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error));
			if (attempt < maxAttempts) {
				await sleep(delay * attempt); // 递增延迟
			}
		}
	}

	throw lastError!;
}
