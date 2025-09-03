import type { NLUIFormComponentProps } from '$lib/ui/components/form.types';
import * as m from '../../../paraglide/messages';

/**
 * 表单示例数据生成器
 * Form examples data generator
 */
export function getFormExamples(): NLUIFormComponentProps[] {
  return [
    // 用户注册表单 / User Registration Form
    {
      title: m.example_form_registration_title(),
      fields: [
        {
          name: 'firstName',
          label: m.form_field_first_name(),
          type: 'text',
          required: true,
          placeholder: m.form_placeholder_first_name()
        },
        {
          name: 'lastName',
          label: m.form_field_last_name(),
          type: 'text',
          required: true,
          placeholder: m.form_placeholder_last_name()
        },
        {
          name: 'email',
          label: m.form_field_email(),
          type: 'email',
          required: true,
          placeholder: m.form_placeholder_email()
        }
      ],
      submitAction: {
        type: 'create',
        label: 'Submit',
        linkUrl: '/register',
        apiUrl: '/api/register',
        method: 'POST'
      }
    },

    // 联系我们表单 / Contact Us Form  
    {
      title: m.example_form_contact_title(),
      fields: [
        {
          name: 'email',
          label: m.form_field_email(),
          type: 'email',
          required: true,
          placeholder: m.form_placeholder_email()
        },
        {
          name: 'message',
          label: m.form_field_message(),
          type: 'textarea',
          required: true,
          placeholder: m.form_placeholder_message()
        }
      ],
      submitAction: {
        type: 'create',
        label: 'Send',
        linkUrl: '/contact',
        apiUrl: '/api/contact',
        method: 'POST'
      }
    }
  ];
}
