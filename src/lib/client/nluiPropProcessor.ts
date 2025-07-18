import { apiClient } from '$lib/utils/apiClient';
import type { NLUIProps } from '../ui/nluiProps.types';

/**
 * 获取NLUIProps配置
 * Get NLUIProps configuration
 *
 * @returns NLUIProps配置对象
 */
export async function getNLUIProps(): Promise<NLUIProps> {
	if (typeof window === 'undefined') {
		throw new Error('getNLUIProps can only be called in a browser environment');
	}
	try {
		const urlParams = new URLSearchParams(window.location.search);

		// 检查是否有instanceId参数（新方式）
		const instanceId = urlParams.get('instanceId');

		if (instanceId) {
			return await getNLUIPropsByInstanceId(instanceId);
		}

		// 获取sessionId（测试用）
		const sessionId = urlParams.get('sessionId');
		if (!sessionId) {
			throw new Error('Missing instanceId or sessionId in URL parameters');
		}
		const sessionStorageKey = `nluiProp_${sessionId}`;

		// 从sessionStorage中获取（使用当前URL的sessionId）
		const sessionData = sessionStorage.getItem(sessionStorageKey);
		if (!sessionData) {
			throw new Error('Missing sessionData');
		}
		return JSON.parse(sessionData);
	} catch (error) {
		console.error('Error parsing NLUIProps:', error);
		throw error;
	}
}

/**
 * 通过instanceId从API获取NLUIProps配置
 * Get NLUIProps configuration from API by instanceId
 */
async function getNLUIPropsByInstanceId(instanceId: string): Promise<NLUIProps> {
	try {
		return await apiClient.get(`/api/nlui/${instanceId}`);
	} catch (error) {
		console.error('Error fetching NLUIProps by instanceId:', error);
		throw error;
	}
}

/**
 * 将NLUIProps保存到sessionStorage（测试用）
 */
export function saveNLUIPropsToSession(props: NLUIProps, sessionId: string): void {
	if (typeof window === 'undefined') {
		console.warn('saveNLUIPropsToSession can only be called in a browser environment');
		throw new Error('saveNLUIPropsToSession can only be called in a browser environment');
	}
	try {
		const sessionStorageKey = `nluiProp_${sessionId}`;
		sessionStorage.setItem(sessionStorageKey, JSON.stringify(props));
		console.log(`NLUIProps saved to sessionStorage with key: ${sessionStorageKey}`);
	} catch (error) {
		console.error('Error saving NLUIProps to session:', error);
		throw error;
	}
}
