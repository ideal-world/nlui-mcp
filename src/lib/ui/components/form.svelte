<script lang="ts">
	import * as m from '../../../paraglide/messages';
	import { apiClient } from '../../utils/apiClient';
	import { ErrorHandler } from '../../utils/errorHandler';
	import { logger } from '../../utils/logger';
	import { FormValidator } from '../../utils/validation';
	import type { NLUIFormComponentProps, NLUIFormField } from './form.types';

	let formProps: NLUIFormComponentProps = $props();

	let formData = $state<Record<string, any>>({});
	let errors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);

	/**
	 * 初始化表单数据
	 * Initialize form data
	 */
	$effect(() => {
		const initialData: Record<string, any> = {};
		formProps.fields.forEach((field) => {
			if (field.defaultValue !== undefined) {
				initialData[field.name] = field.defaultValue;
			}
		});
		formData = initialData;
	});

	/**
	 * 验证单个字段
	 * Validate single field
	 */
	function validateField(field: NLUIFormField, value: any): string | null {
		try {
			const rules = {
				required: field.required,
				...field.validation
			};

			return FormValidator.validateField(value, rules, field.label);
		} catch (error) {
			logger.error('Field validation error', error, {
				component: 'FormComponent',
				action: 'validateField',
				metadata: { fieldName: field.name }
			});
			return m.unknown_error();
		}
	}

	/**
	 * 处理字段值变化
	 * Handle field value change
	 */
	function handleFieldChange(fieldName: string, value: any): void {
		formData[fieldName] = value;

		// 清除该字段的错误
		if (errors[fieldName]) {
			const { [fieldName]: removed, ...rest } = errors;
			errors = rest;
		}
	}

	/**
	 * 处理字段失焦验证
	 * Handle field blur validation
	 */
	function handleFieldBlur(field: NLUIFormField): void {
		const error = validateField(field, formData[field.name]);
		if (error) {
			errors = { ...errors, [field.name]: error };
		}
	}

	/**
	 * 处理表单提交
	 * Handle form submission
	 */
	async function handleSubmit(event: Event): Promise<void> {
		event.preventDefault();

		// 验证所有字段
		const validationResult = FormValidator.validateForm(formData, formProps.fields);
		errors = validationResult.errors;

		if (!validationResult.isValid) {
			logger.warn('Form validation failed', {
				component: 'FormComponent',
				action: 'submit',
				metadata: { errors: validationResult.errors }
			});
			return;
		}

		await submitForm();
	}

	/**
	 * 提交表单数据
	 * Submit form data
	 */
	async function submitForm(): Promise<void> {
		if (!formProps.submitUrl) {
			return;
		}

		isSubmitting = true;

		try {
			await apiClient.post(formProps.submitUrl, formData, {
				headers: {
					'Content-Type': 'application/json'
				}
			});
			// TODO 后置处理

			// 重置表单数据
			formData = {};
			errors = {};
		} catch (error) {
			const handledError = ErrorHandler.handle(error, {
				component: 'FormComponent',
				action: 'submit',
				metadata: { url: formProps.submitUrl }
			});
		} finally {
			isSubmitting = false;
		}
	}

	/**
	 * 重置表单
	 * Reset form
	 */
	function resetForm(): void {
		formData = {};
		errors = {};

		logger.info('Form reset', {
			component: 'FormComponent',
			action: 'reset'
		});
	}

	/**
	 * 获取字段错误类名
	 * Get field error class name
	 */
	function getFieldErrorClass(fieldName: string): string {
		return errors[fieldName] ? 'input-error' : '';
	}
</script>

<!-- 表单容器 / Form Container -->
<div class="card bg-base-100 shadow-lg">
	{#if formProps.title}
		<div class="card-body">
			<h2 class="card-title">{formProps.title}</h2>
		</div>
	{/if}

	<form onsubmit={handleSubmit} class="card-body space-y-4">
		{#each formProps.fields as field}
			<div class="form-control">
				<label class="label" for={field.name}>
					<span class="label-text">
						{field.label}
						{#if field.required}
							<span class="text-error">*</span>
						{/if}
					</span>
				</label>

				<!-- 文本输入框 / Text Input -->
				{#if field.type === 'text' || field.type === 'email' || field.type === 'password'}
					<input
						id={field.name}
						type={field.type}
						placeholder={field.placeholder}
						value={formData[field.name] || ''}
						oninput={(e) =>
							handleFieldChange(field.name, (e.target as HTMLInputElement)?.value || '')}
						onblur={() => handleFieldBlur(field)}
						class="input input-bordered {getFieldErrorClass(field.name)}"
						disabled={isSubmitting}
					/>

					<!-- 数字输入框 / Number Input -->
				{:else if field.type === 'number'}
					<input
						id={field.name}
						type="number"
						placeholder={field.placeholder}
						value={formData[field.name] || ''}
						oninput={(e) =>
							handleFieldChange(field.name, (e.target as HTMLInputElement)?.value || '')}
						onblur={() => handleFieldBlur(field)}
						class="input input-bordered {getFieldErrorClass(field.name)}"
						disabled={isSubmitting}
					/>

					<!-- 多行文本 / Textarea -->
				{:else if field.type === 'textarea'}
					<textarea
						id={field.name}
						placeholder={field.placeholder}
						value={formData[field.name] || ''}
						oninput={(e) =>
							handleFieldChange(field.name, (e.target as HTMLTextAreaElement)?.value || '')}
						onblur={() => handleFieldBlur(field)}
						class="textarea textarea-bordered {getFieldErrorClass(field.name)}"
						rows="3"
						disabled={isSubmitting}
					></textarea>

					<!-- 选择框 / Select -->
				{:else if field.type === 'select' && field.options}
					<select
						id={field.name}
						value={formData[field.name] || ''}
						onchange={(e) =>
							handleFieldChange(field.name, (e.target as HTMLSelectElement)?.value || '')}
						onblur={() => handleFieldBlur(field)}
						class="select select-bordered {getFieldErrorClass(field.name)}"
						disabled={isSubmitting}
					>
						<option value="">{field.placeholder || `请选择${field.label}`}</option>
						{#each field.options as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>

					<!-- 复选框 / Checkbox -->
				{:else if field.type === 'checkbox'}
					<label class="label cursor-pointer justify-start gap-3">
						<input
							id={field.name}
							type="checkbox"
							checked={formData[field.name] || false}
							onchange={(e) =>
								handleFieldChange(field.name, (e.target as HTMLInputElement)?.checked || false)}
							class="checkbox checkbox-primary"
							disabled={isSubmitting}
						/>
						<span class="label-text">{field.placeholder || field.label}</span>
					</label>

					<!-- 单选框组 / Radio Group -->
				{:else if field.type === 'radio' && field.options}
					<div class="space-y-2">
						{#each field.options as option}
							<label class="label cursor-pointer justify-start gap-3">
								<input
									type="radio"
									name={field.name}
									value={option.value}
									checked={formData[field.name] === option.value}
									onchange={(e) =>
										handleFieldChange(field.name, (e.target as HTMLInputElement)?.value || '')}
									class="radio radio-primary"
									disabled={isSubmitting}
								/>
								<span class="label-text">{option.label}</span>
							</label>
						{/each}
					</div>

					<!-- 日期输入 / Date Input -->
				{:else if field.type === 'date'}
					<input
						id={field.name}
						type="date"
						value={formData[field.name] || ''}
						onchange={(e) =>
							handleFieldChange(field.name, (e.target as HTMLInputElement)?.value || '')}
						onblur={() => handleFieldBlur(field)}
						class="input input-bordered {getFieldErrorClass(field.name)}"
						disabled={isSubmitting}
					/>

					<!-- 文件上传 / File Input -->
				{:else if field.type === 'file'}
					<input
						id={field.name}
						type="file"
						onchange={(e) =>
							handleFieldChange(field.name, (e.target as HTMLInputElement)?.files?.[0] || null)}
						class="file-input file-input-bordered {getFieldErrorClass(field.name)}"
						disabled={isSubmitting}
					/>
				{/if}

				<!-- 字段错误提示 / Field Error Message -->
				{#if errors[field.name]}
					<div class="label">
						<span class="label-text-alt text-error">{errors[field.name]}</span>
					</div>
				{/if}

				<!-- 字段帮助文本 / Field Help Text -->
				{#if field.helpText}
					<div class="label">
						<span class="label-text-alt text-base-content/70">{field.helpText}</span>
					</div>
				{/if}
			</div>
		{/each}

		<!-- 表单操作按钮 / Form Action Buttons -->
		<div class="card-actions mt-6 justify-end">
			<button type="button" class="btn btn-outline" onclick={resetForm} disabled={isSubmitting}>
				{m.form_reset()}
			</button>

			<button type="submit" class="btn btn-primary" disabled={isSubmitting}>
				{#if isSubmitting}
					<span class="loading loading-spinner loading-sm"></span>
					{m.form_submitting()}
				{:else}
					{m.form_submit()}
				{/if}
			</button>
		</div>
	</form>
</div>
