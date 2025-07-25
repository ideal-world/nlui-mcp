import type { ApiActionProps, BaseComponentProps, LinkActionProps } from '../common/base.types';

export interface NLUIFormComponentProps extends BaseComponentProps {
	fields: NLUIFormField[];
	submitAction: LinkActionProps | ApiActionProps;
}

export interface NLUIFormField {
	name: string;
	label: string;
	type: 'text' | 'number' | 'password' | 'email' | 'url' | 'color' | 'date' | 'time' | 'datetime-local' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
	required?: boolean;
	placeholder?: string;
	defaultValue?: any;
	/** Help text displayed below the field */
	helpText?: string;
	/** Options for select/checkbox/radio fields */
	options?: { label: string; value: string | number }[];
	validation?: {
		/** When the type is a number, this corresponds to the minimum value; when the type is a string, this corresponds to the minimum length */
		min?: number;
		/** When the type is a number, this corresponds to the maximum value; when the type is a string, this corresponds to the maximum length */
		max?: number;
		/** Regex validation pattern */
		pattern?: string;
	};
}
