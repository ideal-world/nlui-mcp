import { isValidEmail, isEmpty } from '../utils';
import type { NLUIFormField } from '../ui/components/form.types';
import * as m from '../../paraglide/messages';

/**
 * 验证规则类型
 * Validation rule types
 */
export interface ValidationRule {
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	pattern?: string;
	email?: boolean;
	url?: boolean;
	number?: boolean;
	integer?: boolean;
	min?: number;
	max?: number;
	custom?: (value: any) => string | null;
}

/**
 * 验证结果
 * Validation result
 */
export interface ValidationResult {
	isValid: boolean;
	errors: Record<string, string>;
}

/**
 * 表单验证器
 * Form validator
 */
export class FormValidator {
	/**
	 * 验证单个字段
	 * Validate single field
	 */
	static validateField(
		value: any,
		rules: ValidationRule,
		fieldName: string,
		customMessages?: Record<string, string>
	): string | null {
		// 必填验证
		if (rules.required && isEmpty(value)) {
			return customMessages?.required || m.validation_required({ field: fieldName });
		}

		// 如果字段为空且非必填，跳过其他验证
		if (isEmpty(value) && !rules.required) {
			return null;
		}

		const stringValue = String(value);

		// 长度验证
		if (rules.minLength && stringValue.length < rules.minLength) {
			return (
				customMessages?.minLength ||
				m.validation_min_length({
					field: fieldName,
					min: rules.minLength
				})
			);
		}

		if (rules.maxLength && stringValue.length > rules.maxLength) {
			return (
				customMessages?.maxLength ||
				m.validation_max_length({
					field: fieldName,
					max: rules.maxLength
				})
			);
		}

		// 邮箱验证
		if (rules.email && !isValidEmail(stringValue)) {
			return customMessages?.email || m.validation_email({ field: fieldName });
		}

		// URL验证
		if (rules.url) {
			try {
				new URL(stringValue);
			} catch {
				return customMessages?.url || m.validation_url({ field: fieldName });
			}
		}

		// 数字验证
		if (rules.number) {
			const numValue = Number(value);
			if (isNaN(numValue)) {
				return customMessages?.number || m.validation_number({ field: fieldName });
			}

			if (rules.min !== undefined && numValue < rules.min) {
				return (
					customMessages?.min ||
					m.validation_min_value({
						field: fieldName,
						min: rules.min
					})
				);
			}

			if (rules.max !== undefined && numValue > rules.max) {
				return (
					customMessages?.max ||
					m.validation_max_value({
						field: fieldName,
						max: rules.max
					})
				);
			}
		}

		// 整数验证
		if (rules.integer) {
			const numValue = Number(value);
			if (isNaN(numValue) || !Number.isInteger(numValue)) {
				return customMessages?.integer || m.validation_integer({ field: fieldName });
			}
		}

		// 正则表达式验证
		if (rules.pattern) {
			try {
				const regex = new RegExp(rules.pattern);
				if (!regex.test(stringValue)) {
					return customMessages?.pattern || m.validation_pattern({ field: fieldName });
				}
			} catch {
				console.warn(`Invalid regex pattern: ${rules.pattern}`);
			}
		}

		// 自定义验证
		if (rules.custom) {
			const customError = rules.custom(value);
			if (customError) {
				return customError;
			}
		}

		return null;
	}

	/**
	 * 验证整个表单
	 * Validate entire form
	 */
	static validateForm(data: Record<string, any>, fields: NLUIFormField[]): ValidationResult {
		const errors: Record<string, string> = {};

		fields.forEach((field) => {
			const value = data[field.name];
			const rules: ValidationRule = {
				required: field.required,
				...field.validation
			};

			const error = this.validateField(value, rules, field.label);
			if (error) {
				errors[field.name] = error;
			}
		});

		return {
			isValid: Object.keys(errors).length === 0,
			errors
		};
	}

	/**
	 * 创建常用验证规则
	 * Create common validation rules
	 */
	static createRules() {
		return {
			required: (): ValidationRule => ({ required: true }),

			email: (): ValidationRule => ({
				email: true,
				pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
			}),

			phone: (): ValidationRule => ({
				pattern: '^1[3-9]\\d{9}$'
			}),

			password: (minLength = 6): ValidationRule => ({
				required: true,
				minLength,
				pattern: '^(?=.*[a-zA-Z])(?=.*\\d).+$'
			}),

			url: (): ValidationRule => ({ url: true }),

			number: (min?: number, max?: number): ValidationRule => ({
				number: true,
				min,
				max
			}),

			integer: (min?: number, max?: number): ValidationRule => ({
				integer: true,
				min,
				max
			}),

			length: (min?: number, max?: number): ValidationRule => ({
				minLength: min,
				maxLength: max
			}),

			custom: (validator: (value: any) => string | null): ValidationRule => ({
				custom: validator
			})
		};
	}
}

/**
 * 预定义验证规则
 * Predefined validation rules
 */
export const validationRules = FormValidator.createRules();
