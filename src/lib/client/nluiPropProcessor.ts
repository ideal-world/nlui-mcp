import type { NLUIProps } from '../ui/nluiProps.types';

/**
 * 从URL或sessionStorage获取NLUIProps配置
 * Get NLUIProps configuration from URL or sessionStorage
 *
 * @returns NLUIProps配置对象或null
 */
export function getNLUIProps(): NLUIProps {
	if (typeof window === 'undefined') {
		throw new Error('getNLUIProps can only be called in a browser environment');
	}
	try {
		const urlParams = new URLSearchParams(window.location.search);

		// 获取sessionId
		const sessionId = urlParams.get('sessionId');
		if (!sessionId) {
			throw new Error('Missing sessionId in URL parameters');
		}
		const sessionStorageKey = `nluiProp_${sessionId}`;

		// 1. 优先从URL参数中获取 nlui 配置
		const nluiParam = urlParams.get('nlui');

		if (nluiParam) {
			const decoded = decodeURIComponent(nluiParam);
			const parsed = JSON.parse(decoded);
			if (isValidNLUIProps(parsed)) {
				// 保存到sessionStorage以便后续使用
				sessionStorage.setItem(sessionStorageKey, JSON.stringify(parsed));
				return parsed;
			} else {
				throw new Error('Invalid NLUIProps structure from URL parameter');
			}
		}

		// 2. 从sessionStorage中获取（使用当前URL的sessionId或default）
		const sessionData = sessionStorage.getItem(sessionStorageKey);
		if (!sessionData) {
			throw new Error('Missing sessionData');
		}

		const parsed = JSON.parse(sessionData);
		if (isValidNLUIProps(parsed)) {
			return parsed;
		} else {
			throw new Error('Invalid NLUIProps structure in sessionStorage for sessionId: ' + sessionId);
		}
	} catch (error) {
		console.error('Error parsing NLUIProps:', error);
		throw error;
	}
}

/**
 * 验证NLUIProps对象的基本结构
 * Validate basic structure of NLUIProps object
 */
function isValidNLUIProps(obj: any): obj is NLUIProps {
	return (
		obj &&
		typeof obj === 'object' &&
		obj.block &&
		typeof obj.block === 'object' &&
		obj.block.main &&
		typeof obj.block.main === 'object'
	);
}

/**
 * 生成示例NLUIProps配置
 * Generate example NLUIProps configuration
 */
export function getExampleNLUIProps(): NLUIProps {
	return {
		showTools: true,
		showDebug: true,
		block: {
			main: {
				kind: 'card',
				cardProps: {
					title: 'Welcome to NLUI',
					body: 'This is an example card component rendered by NLUI framework.',
					footer: 'NLUI Framework v1.0'
				}
			}
		}
	};
}

/**
 * 将NLUIProps保存到sessionStorage
 * Save NLUIProps to sessionStorage
 *
 * @param props NLUIProps配置对象
 * @param sessionId 会话ID，默认为'default'
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
