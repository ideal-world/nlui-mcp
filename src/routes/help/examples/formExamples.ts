import type { NLUIFormComponentProps } from '$lib/ui/components/form.types';

export function getFormExamples(): NLUIFormComponentProps[] {
  return [
    {
      title: 'User Registration Form',
      fields: [
        {
          name: 'firstName',
          label: 'First Name',
          type: 'text',
          required: true,
          placeholder: 'Enter your first name'
        },
        {
          name: 'lastName',
          label: 'Last Name',
          type: 'text',
          required: true,
          placeholder: 'Enter your last name'
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
          placeholder: 'your.email@example.com'
        },
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          required: true,
          validation: {
            min: 8
          }
        },
        {
          name: 'country',
          label: 'Country',
          type: 'select',
          required: true,
          options: [
            { value: 'us', label: 'United States' },
            { value: 'cn', label: 'China' },
            { value: 'jp', label: 'Japan' },
            { value: 'de', label: 'Germany' }
          ]
        },
        {
          name: 'newsletter',
          label: 'Subscribe to newsletter',
          type: 'checkbox'
        }
      ],
      submitAction: {
        label: 'Create Account',
        linkUrl: '/api/register',
        target: '_self'
      }
    },
    {
      title: 'Contact Form',
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          required: true,
          placeholder: 'Your full name'
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
          placeholder: 'your.email@example.com'
        },
        {
          name: 'subject',
          label: 'Subject',
          type: 'text',
          required: true,
          placeholder: 'Brief subject line'
        },
        {
          name: 'message',
          label: 'Message',
          type: 'textarea',
          required: true,
          placeholder: 'Your message here...',
          validation: {
            min: 20,
            max: 1000
          }
        }
      ],
      submitAction: {
        label: 'Send Message',
        linkUrl: '/api/contact',
        target: '_self'
      }
    },
    {
      title: '客户反馈表单',
      fields: [
        {
          name: 'name',
          label: '姓名',
          type: 'text',
          required: true,
          placeholder: '请输入您的姓名'
        },
        {
          name: 'email',
          label: '邮箱',
          type: 'email',
          required: true,
          placeholder: 'example@company.com'
        },
        {
          name: 'rating',
          label: '满意度评分',
          type: 'select',
          required: true,
          options: [
            { value: '5', label: '非常满意' },
            { value: '4', label: '满意' },
            { value: '3', label: '一般' },
            { value: '2', label: '不满意' },
            { value: '1', label: '非常不满意' }
          ]
        },
        {
          name: 'category',
          label: '反馈类别',
          type: 'select',
          required: true,
          options: [
            { value: 'product', label: '产品功能' },
            { value: 'service', label: '客户服务' },
            { value: 'technical', label: '技术支持' },
            { value: 'other', label: '其他' }
          ]
        },
        {
          name: 'feedback',
          label: '具体反馈',
          type: 'textarea',
          required: true,
          placeholder: '请详细描述您的意见和建议...',
          validation: {
            min: 10,
            max: 500
          }
        }
      ],
      submitAction: {
        label: '提交反馈',
        linkUrl: '/api/feedback',
        target: '_self'
      }
    },
    {
      title: '活动报名表单',
      fields: [
        {
          name: 'participant',
          label: '参与者姓名',
          type: 'text',
          required: true,
          placeholder: '请输入姓名'
        },
        {
          name: 'phone',
          label: '联系电话',
          type: 'text',
          required: true,
          placeholder: '138-0000-0000'
        },
        {
          name: 'company',
          label: '所在公司',
          type: 'text',
          placeholder: '公司名称（可选）'
        },
        {
          name: 'position',
          label: '职位',
          type: 'text',
          placeholder: '您的职位'
        },
        {
          name: 'dietary',
          label: '饮食要求',
          type: 'select',
          options: [
            { value: 'none', label: '无特殊要求' },
            { value: 'vegetarian', label: '素食' },
            { value: 'halal', label: '清真' },
            { value: 'allergies', label: '有过敏情况' }
          ]
        }
      ],
      submitAction: {
        label: '确认报名',
        linkUrl: '/api/registration',
        target: '_self'
      }
    }
  ];
}
