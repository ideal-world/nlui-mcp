<script lang="ts">
  import * as m from '../../../paraglide/messages';
  import { logger } from '../../utils/logger';
  import { FormValidator } from '../../utils/validation';
  import { getSizeClassSuffix, handleAction } from '../common/base.utils';
  import type { NLUIFormComponentProps, NLUIFormField } from './form.types';

  let formProps: NLUIFormComponentProps = $props();

  let formData = $state<Record<string, any>>({});
  let errors = $state<Record<string, string>>({});
  let isSubmitting = $state(false);

  $effect(() => {
    const initialData: Record<string, any> = {};
    formProps.fields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        initialData[field.name] = field.defaultValue;
      }
    });
    formData = initialData;
  });

  function validateField(field: NLUIFormField, value: any): string | null {
    try {
      const rules = {
        required: field.required,
        email: field.type === 'email',
        url: field.type === 'url',
        number: field.type === 'number',
        ...field.validation
      };
      return FormValidator.validateField(value, rules, field.label);
    } catch (error) {
      logger.warn('Field validation error', {
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
    if (formProps.fields.find((field) => field.name === fieldName)?.type === 'checkbox') {
      if (!formData[fieldName]) {
        formData[fieldName] = [];
      }
      if (formData[fieldName].includes(value)) {
        formData[fieldName] = formData[fieldName].filter((v: any) => v !== value);
      } else {
        formData[fieldName].push(value);
      }
    } else {
      formData[fieldName] = value;
    }
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
    isSubmitting = true;
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
    await handleAction('form', formProps.submitAction, formData);
    isSubmitting = false;
  }

  /**
   * 获取字段错误类名
   * Get field error class name
   */
  function getFieldErrorClass(fieldName: string): string {
    return errors[fieldName] ? 'is-invalid' : '';
  }
</script>

<!-- 表单容器 / Form Container -->
<div class="flex flex-col">
  {#if formProps.title}
    <div class="font-bold">{formProps.title}</div>
  {/if}

  <form onsubmit={handleSubmit}>
    {#each formProps.fields as field}
      <div class="flex pb-1.5">
        <label class="flex h-full w-1/6 items-center" for={field.name}>
          <span class="label-text">
            {field.label}
          </span>
          {#if field.required}
            <span class="text-red-500">*</span>
          {/if}
          {#if field.helpText}
            <span class="group relative">
              <span class="icon-[tabler--help] ml-0.5"></span>
              <div class="bg-base-100 text-base-content border-base-300 absolute top-1 left-6 z-10 hidden min-w-max rounded border px-3 py-2 text-sm whitespace-pre-line shadow-lg group-hover:block">
                {field.helpText}
              </div>
            </span>
          {/if}
        </label>
        <div class="w-5/6">
          {#if field.type === 'text' || field.type === 'password' || field.type === 'url'}
            <input
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              oninput={(e) => handleFieldChange(field.name, (e.target as HTMLInputElement)?.value || '')}
              onblur={() => handleFieldBlur(field)}
              class="input input-{getSizeClassSuffix(formProps.size)} {getFieldErrorClass(field.name)}"
              disabled={isSubmitting} />
          {:else if field.type === 'email' || field.type === 'date' || field.type === 'time' || field.type === 'datetime-local'}
            <input
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              oninput={(e) => handleFieldChange(field.name, (e.target as HTMLInputElement)?.value || '')}
              onblur={() => handleFieldBlur(field)}
              class="input input-{getSizeClassSuffix(formProps.size)} {getFieldErrorClass(field.name)} max-w-sm"
              disabled={isSubmitting} />
          {:else if field.type === 'color'}
            <input
              name={field.name}
              type="color"
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              oninput={(e) => handleFieldChange(field.name, (e.target as HTMLInputElement)?.value || '')}
              onblur={() => handleFieldBlur(field)}
              class=" border-0 input-{getSizeClassSuffix(formProps.size)} {getFieldErrorClass(field.name)}"
              disabled={isSubmitting} />
          {:else if field.type === 'number'}
            <div class="input max-w-sm input-{getSizeClassSuffix(formProps.size)} {getFieldErrorClass(field.name)}" data-input-number>
              <input
                name={field.name}
                type="text"
                value={formData[field.name] || ''}
                placeholder={field.placeholder}
                disabled={isSubmitting}
                oninput={(e) => handleFieldChange(field.name, (e.target as HTMLInputElement)?.value || '')}
                onblur={() => handleFieldBlur(field)}
                data-input-number-input />
              <span class="my-auto flex gap-3">
                <button type="button" class="btn btn-primary btn-soft size-5.5 min-h-0 rounded-sm p-0" aria-label="Decrement" data-input-number-decrement>
                  <span class="icon-[tabler--minus] size-3.5 shrink-0"></span>
                </button>
                <button type="button" class="btn btn-primary btn-soft size-5.5 min-h-0 rounded-sm p-0" aria-label="Increment" data-input-number-increment>
                  <span class="icon-[tabler--plus] size-3.5 shrink-0"></span>
                </button>
              </span>
            </div>
          {:else if field.type === 'textarea'}
            <textarea
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              oninput={(e) => handleFieldChange(field.name, (e.target as HTMLTextAreaElement)?.value || '')}
              onblur={() => handleFieldBlur(field)}
              class="textarea input-{getSizeClassSuffix(formProps.size)}  {getFieldErrorClass(field.name)}"
              rows="3"
              disabled={isSubmitting}></textarea>
          {:else if field.type === 'select' && field.options}
            <select
              name={field.name}
              value={formData[field.name] || ''}
              onchange={(e) => handleFieldChange(field.name, (e.target as HTMLSelectElement)?.value || '')}
              onblur={() => handleFieldBlur(field)}
              class="select select-{getSizeClassSuffix(formProps.size)} {getFieldErrorClass(field.name)}"
              disabled={isSubmitting}>
              <option value="">{field.placeholder || `请选择${field.label}`}</option>
              {#each field.options as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
          {:else if field.type === 'checkbox'}
            <div class="flex space-y-2">
              {#each field.options as option}
                <label class="label label-text">{option.label}</label>
                  <input
                    name={option.value}
                    type="checkbox"
                    value={option.value}
                    checked={formData[field.name]?.includes(option.value)}
                    onchange={(e) => handleFieldChange(field.name, (e.target as HTMLInputElement)?.value || '')}
                    class="checkbox checkbox-primary"
                    disabled={isSubmitting} />
              {/each}
            </div>

            <!-- <label class="label w-1/5 cursor-pointer justify-start gap-3">
              <input
                id={field.name}
                type="checkbox"
                checked={formData[field.name] || false}
                onchange={(e) => handleFieldChange(field.name, (e.target as HTMLInputElement)?.checked || false)}
                class="checkbox checkbox-primary"
                disabled={isSubmitting} />
              <span class="label-text">{field.placeholder || field.label}</span>
            </label> -->

            <!-- 单选框组 / Radio Group -->
          {:else if field.type === 'radio' && field.options}
            <div class="space-y-2">
              {#each field.options as option}
                <label class="label w-1/5 cursor-pointer justify-start gap-3">
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={formData[field.name] === option.value}
                    onchange={(e) => handleFieldChange(field.name, (e.target as HTMLInputElement)?.value || '')}
                    class="radio radio-primary"
                    disabled={isSubmitting} />
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
              onchange={(e) => handleFieldChange(field.name, (e.target as HTMLInputElement)?.value || '')}
              onblur={() => handleFieldBlur(field)}
              class="input input-bordered {getFieldErrorClass(field.name)}"
              disabled={isSubmitting} />

            <!-- 文件上传 / File Input -->
          {:else if field.type === 'file'}
            <input
              id={field.name}
              type="file"
              onchange={(e) => handleFieldChange(field.name, (e.target as HTMLInputElement)?.files?.[0] || null)}
              class="file-input file-input-bordered {getFieldErrorClass(field.name)}"
              disabled={isSubmitting} />
          {/if}

          <!-- 字段错误提示 / Field Error Message -->
          {#if errors[field.name]}
            <div class="label">
              <span class="label-text-alt text-error">{errors[field.name]}</span>
            </div>
          {/if}
        </div>
      </div>
    {/each}

    <!-- 表单操作按钮 / Form Action Buttons -->
    <div class="card-actions mt-6 justify-end">
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
