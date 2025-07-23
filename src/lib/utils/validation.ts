import * as m from '../../paraglide/messages';
import type { NLUIFormField } from '../ui/components/form.types';
import { isEmpty, isValidEmail } from '../utils';

/**
 * 验证规则类型
 * Validation rule types
 */
export interface ValidationRule {
	required?: boolean;
	min?: number;
	max?: number;
	pattern?: string;
	email?: boolean;
	url?: boolean;
	number?: boolean;
	integer?: boolean;
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
	static validateField(value: any, rules: ValidationRule, fieldName: string): string | null {
		// 必填验证
		if (rules.required && isEmpty(value)) {
			return m.validation_required({ field: fieldName });
		}

		// 如果字段为空且非必填，跳过其他验证
		if (isEmpty(value) && !rules.required) {
			return null;
		}

		const stringValue = String(value);

		// 长度验证
		if (rules.min && stringValue.length < rules.min) {
			return m.validation_min_length({
				field: fieldName,
				min: rules.min
			});
		}

		if (rules.max && stringValue.length > rules.max) {
			return m.validation_max_length({
				field: fieldName,
				max: rules.max
			});
		}

		// 邮箱验证
		if (rules.email && !isValidEmail(stringValue)) {
			return m.validation_email({ field: fieldName });
		}

		// URL验证
		if (rules.url) {
			try {
				new URL(stringValue);
			} catch {
				return m.validation_url({ field: fieldName });
			}
		}

		// 数字验证
		if (rules.number) {
			const numValue = Number(value);
			if (isNaN(numValue)) {
				return m.validation_number({ field: fieldName });
			}

			if (rules.min !== undefined && numValue < rules.min) {
				return m.validation_min_value({
					field: fieldName,
					min: rules.min
				});
			}

			if (rules.max !== undefined && numValue > rules.max) {
				return m.validation_max_value({
					field: fieldName,
					max: rules.max
				});
			}
		}

		// 整数验证
		if (rules.integer) {
			const numValue = Number(value);
			if (isNaN(numValue) || !Number.isInteger(numValue)) {
				return m.validation_integer({ field: fieldName });
			}
		}

		// 正则表达式验证
		if (rules.pattern) {
			try {
				const regex = new RegExp(rules.pattern);
				if (!regex.test(stringValue)) {
					return m.validation_pattern({ field: fieldName });
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
}
