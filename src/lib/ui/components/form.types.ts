import type { BaseComponentProps } from '../common/base.types';

export interface NLUIFormComponentProps extends BaseComponentProps {
	title?: string;
	fields: NLUIFormField[];
	submitText?: string;
	cancelText?: string;
	submitUrl?: string;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export interface NLUIFormField {
	name: string;
	label: string;
	type:
		| 'text'
		| 'email'
		| 'password'
		| 'number'
		| 'date'
		| 'select'
		| 'textarea'
		| 'checkbox'
		| 'radio'
		| 'file';
	required?: boolean;
	placeholder?: string;
	defaultValue?: string | number | boolean;
	/** Help text displayed below the field */
	helpText?: string;
	/** Options for select/radio fields */
	options?: { label: string; value: string | number }[];
	validation?: {
		minLength?: number;
		maxLength?: number;
		/** Regex validation pattern */
		pattern?: string;
		errorMessage?: string;
	};
}
