import type { ApiActionProps, BaseComponentProps, LinkActionProps } from '../common/base.types';

export interface NLUIFormComponentProps extends BaseComponentProps {
  fields: FormField[];
  submitAction: LinkActionProps | ApiActionProps;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'password' | 'email' | 'url' | 'color' | 'date' | 'time' | 'datetime-local' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
  required?: boolean;
  placeholder?: string;
  /** For multiple = true, the value of this field is an array */
  defaultValue?: any;
  multiple?: boolean;
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
