<script lang="ts">
  import { saveNLUIPropsToSession } from '$lib/client/nluiPropProcessor';
  import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
  import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
  import Card from '$lib/ui/components/card.svelte';
  import type { NLUICardComponentProps } from '$lib/ui/components/card.types.js';
  import Form from '$lib/ui/components/form.svelte';
  import type { NLUIFormComponentProps } from '$lib/ui/components/form.types.js';
  import Table from '$lib/ui/components/table.svelte';
  import type { NLUITableComponentProps } from '$lib/ui/components/table.types.js';
  import type { NLUIProps } from '$lib/ui/nluiProps.types';
  import * as m from '../../paraglide/messages';

  // Card示例数据 / Card example data
  const cardExamples: NLUICardComponentProps[] = [
    {
      title: 'Basic Card',
      body: 'This is a basic card example with title and body content.',
      primaryAction: {
        label: 'Learn More',
        linkUrl: '#',
        target: '_self'
      }
    },
    {
      title: 'Card with Image',
      body: 'This card includes an image and demonstrates the visual layout.',
      image: 'https://picsum.photos/400/300?random=1',
      footer: 'Card footer content',
      primaryAction: {
        label: 'View Details',
        linkUrl: '#',
        target: '_self'
      },
      secondaryAction: {
        label: 'Share',
        linkUrl: '#',
        target: '_blank'
      }
    },
    {
      title: 'Horizontal Card',
      body: 'This is a horizontal layout card that displays content side by side.',
      image: 'https://picsum.photos/300/200?random=2',
      primaryAction: {
        label: 'Get Started',
        linkUrl: '#',
        target: '_self'
      }
    }
  ];

  // Table示例数据 / Table example data
  const basicTableData: NLUITableComponentProps = {
    title: 'User Management Table',
    columns: [
      { key: 'id', title: 'ID' },
      { key: 'name', title: 'Name' },
      { key: 'email', title: 'Email' },
      { key: 'role', title: 'Role', tagStyle: true },
      { key: 'status', title: 'Status', tagStyle: true }
    ],
    rows: [
      {
        id: 1,
        data: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'Admin',
          status: 'Active'
        }
      },
      {
        id: 2,
        data: {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'User',
          status: 'Inactive'
        }
      },
      {
        id: 3,
        data: {
          id: 3,
          name: 'Bob Johnson',
          email: 'bob@example.com',
          role: 'Moderator',
          status: 'Active'
        }
      },
      {
        id: 4,
        data: {
          id: 4,
          name: 'Alice Williams',
          email: 'alice@example.com',
          role: 'User',
          status: 'Active'
        }
      },
      {
        id: 5,
        data: {
          id: 5,
          name: 'Charlie Brown',
          email: 'charlie@example.com',
          role: 'User',
          status: 'Inactive'
        }
      },
      {
        id: 6,
        data: {
          id: 6,
          name: 'Diana Prince',
          email: 'diana@example.com',
          role: 'User',
          status: 'Active'
        }
      },
      {
        id: 7,
        data: {
          id: 7,
          name: 'Bruce Wayne',
          email: 'bruce@example.com',
          role: 'User',
          status: 'Inactive'
        }
      },
      {
        id: 8,
        data: {
          id: 8,
          name: 'Clark Kent',
          email: 'clark@example.com',
          role: 'User',
          status: 'Active'
        }
      },
      {
        id: 9,
        data: {
          id: 9,
          name: 'Peter Parker',
          email: 'peter@example.com',
          role: 'User',
          status: 'Active'
        }
      },
      {
        id: 10,
        data: {
          id: 10,
          name: 'Tony Stark',
          email: 'tony@example.com',
          role: 'User',
          status: 'Inactive'
        }
      },
      {
        id: 11,
        data: {
          id: 11,
          name: 'Natasha Romanoff',
          email: 'natasha@example.com',
          role: 'User',
          status: 'Active'
        }
      },
      {
        id: 12,
        data: {
          id: 12,
          name: 'Wanda Maximoff',
          email: 'wanda@example.com',
          role: 'User',
          status: 'Inactive'
        }
      }
    ],
    actions: [
      { label: 'Edit', linkUrl: 'http://www.example.com/edit/id={id}', target: '_self', type: 'edit' },
      { label: 'Delete', linkUrl: 'http://www.example.com/delete/id={id}', target: '_self', type: 'delete' }
    ],
    pageSize: 10,
    searchable: true
  };

  const simpleTableData: NLUITableComponentProps = {
    columns: [
      { key: 'product', title: 'Product' },
      { key: 'price', title: 'Price' },
      { key: 'stock', title: 'Stock' }
    ],
    rows: [
      { id: 1, data: { product: 'Laptop', price: '$999', stock: '15' } },
      { id: 2, data: { product: 'Phone', price: '$599', stock: '32' } },
      { id: 3, data: { product: 'Tablet', price: '$399', stock: '8' } }
    ]
  };

  // Form示例数据 / Form example data
  const basicFormData: NLUIFormComponentProps = {
    size: 'sm',
    title: 'User Registration Form',
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        required: true,
        defaultValue: 'John',
        placeholder: 'Enter your first name',
        validation: {
          min: 2,
          max: 50
        }
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: true,
        placeholder: 'Enter your last name',
        validation: {
          min: 2,
          max: 50
        }
      },
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        required: true,
        placeholder: 'Enter your email address',
        helpText: 'We will never share your email with anyone else.'
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        required: true,
        placeholder: 'Create a strong password',
        validation: {
          min: 8,
          max: 100,
          pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'
        },
        helpText: 'Password must contain at least 8 characters with uppercase, lowercase, and number.'
      },
      {
        name: 'age',
        label: 'Age',
        type: 'number',
        required: true,
        defaultValue: 21,
        validation: {
          min: 20,
          max: 120
        }
      },
      {
        name: 'country',
        label: 'Country',
        type: 'select',
        required: true,
        options: [
          { label: 'Select Country', value: '' },
          { label: 'United States', value: 'us' },
          { label: 'China', value: 'cn' },
          { label: 'United Kingdom', value: 'uk' },
          { label: 'Germany', value: 'de' },
          { label: 'Japan', value: 'jp' }
        ]
      },
      {
        name: 'bio',
        label: 'Biography',
        type: 'textarea',
        placeholder: 'Tell us about yourself...',
        validation: {
          max: 500
        },
        helpText: 'Optional. Maximum 500 characters.'
      },
      {
        name: 'newsletter',
        label: 'Subscribe to Newsletter',
        type: 'checkbox',
        multiple: true,
        options: [
          { label: 'Product Updates', value: 'product_updates' },
          { label: 'Feature Announcements', value: 'feature_announcements' },
          { label: 'Event Invitations', value: 'event_invitations' },
          { label: 'Promotions', value: 'promotions' }
        ],
        defaultValue: ['product_updates', 'feature_announcements'],
        helpText: 'Select the types of newsletter you want to receive.'
      },
      {
        name: 'isChecked',
        label: 'Is Checked',
        type: 'checkbox',
        defaultValue: true,
        helpText: 'Select the types of newsletter you want to receive.'
      },
      {
        name: 'gender',
        label: 'Gender',
        type: 'radio',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'Other', value: 'other' },
          { label: 'Prefer not to say', value: 'not_specified' }
        ]
      },
      {
        name: 'fileUpload',
        label: 'File Upload',
        type: 'file',
        multiple: true,
        required: true,
        helpText: 'Upload your profile picture.'
      }
    ],
    submitAction: {
      label: 'Create Account',
      linkUrl: '/api/register',
      target: '_self'
    }
  };

  const simpleFormData: NLUIFormComponentProps = {
    title: 'Contact Form',
    fields: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        placeholder: 'Your name'
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        placeholder: 'your@email.com'
      },
      {
        name: 'message',
        label: 'Message',
        type: 'textarea',
        required: true,
        placeholder: 'Your message...',
        validation: {
          min: 10,
          max: 1000
        }
      }
    ],
    submitAction: {
      label: 'Send Message',
      linkUrl: '/api/contact',
      target: '_self'
    }
  };

  const exampleProp: NLUIProps = {
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

  function tryExample() {
    const sessionId = 'demo-session';

    // 先保存到 sessionStorage
    saveNLUIPropsToSession(exampleProp, sessionId);

    // 确保保存完成后再刷新，添加URL参数以确保重新检测
    setTimeout(() => {
      window.location.href = `${window.location.origin}?sessionId=${sessionId}`;
    }, 100);
  }

  function tryCardExample() {
    // 创建包含card组件的示例配置 - 使用第一个卡片作为main
    const cardExampleProp = {
      showTools: true,
      showDebug: false,
      block: {
        main: {
          kind: 'card' as const,
          cardProps: cardExamples[0]
        }
      }
    };

    const sessionId = 'card-demo';

    // 先保存到 sessionStorage
    saveNLUIPropsToSession(cardExampleProp, sessionId);

    // 确保保存完成后再刷新，添加URL参数以确保重新检测
    setTimeout(() => {
      window.location.href = `${window.location.origin}?sessionId=${sessionId}`;
    }, 100);
  }

  function tryTableExample() {
    // 创建包含table组件的示例配置
    const tableExampleProp = {
      showTools: true,
      showDebug: true,
      block: {
        main: {
          kind: 'table' as const,
          tableProps: basicTableData
        }
      }
    };

    const sessionId = 'table-demo';

    // 先保存到 sessionStorage
    saveNLUIPropsToSession(tableExampleProp, sessionId);

    // 确保保存完成后再刷新，添加URL参数以确保重新检测
    setTimeout(() => {
      window.location.href = `${window.location.origin}?sessionId=${sessionId}`;
    }, 100);
  }

  function tryFormExample() {
    // 创建包含form组件的示例配置
    const formExampleProp = {
      showTools: true,
      showDebug: true,
      block: {
        main: {
          kind: 'form' as const,
          formProps: basicFormData
        }
      }
    };

    const sessionId = 'form-demo';

    // 先保存到 sessionStorage
    saveNLUIPropsToSession(formExampleProp, sessionId);

    // 确保保存完成后再刷新，添加URL参数以确保重新检测
    setTimeout(() => {
      window.location.href = `${window.location.origin}?sessionId=${sessionId}`;
    }, 100);
  }
</script>

<svelte:head>
  <title>{m.help_page_title()}</title>
  <meta name="description" content={m.help_page_description()} />
</svelte:head>

<!-- 顶部工具栏 / Top Toolbar -->
<div class="border-base-300 bg-base-100/80 relative z-50 border-b px-4 py-3 backdrop-blur-sm">
  <div class="mx-auto flex max-w-4xl items-center justify-between">
    <div class="flex items-center gap-3">
      <h1 class="text-base-content text-lg font-semibold">NLUI</h1>
      <span class="text-base-content/50 text-sm">•</span>
      <span class="text-base-content/70 text-sm">{m.help_page_title()}</span>
    </div>
    <div class="flex items-center gap-3">
      <ThemeSwitcher />
      <LanguageSwitcher />
    </div>
  </div>
</div>

<!-- 帮助页面主体 / Help Page Content -->
<div class="bg-base-200 min-h-screen px-8 py-6">
  <div class="mx-auto max-w-4xl">
    <div class="mb-8 text-center">
      <h1 class="text-base-content mb-3 text-3xl font-bold md:text-4xl">
        {m.help_page_title()}
      </h1>
      <p class="text-base-content/70 mb-6 text-lg">
        {m.help_page_description()}
      </p>
    </div>

    <div class="space-y-8">
      <!-- 使用说明 / Usage Instructions -->
      <div class="bg-base-100 rounded-lg p-6 shadow-lg">
        <h2 class="text-base-content mb-4 text-2xl font-bold">
          {m.help_usage_title()}
        </h2>
        <p class="text-base-content/70 mb-6">
          {m.help_usage_description()}
        </p>

        <div class="grid gap-6 md:grid-cols-2">
          <!-- URL参数方式 / URL Parameters -->
          <div class="bg-primary/10 rounded-lg p-4">
            <h3 class="text-primary mb-2 text-lg font-semibold">
              {m.help_url_params()}
            </h3>
            <p class="text-primary/70 mb-3 text-sm">
              {m.help_url_params_description()}
            </p>
            <code class="bg-primary/20 text-primary block rounded p-2 text-xs">
              ?nlui={'{'}"version":"1.0.0",...{'}'}&sessionId=your-session-id
            </code>
          </div>

          <!-- SessionStorage方式 / Session Storage -->
          <div class="bg-secondary/10 rounded-lg p-4">
            <h3 class="text-secondary mb-2 text-lg font-semibold">
              {m.help_session_storage()}
            </h3>
            <p class="text-secondary/70 mb-3 text-sm">
              {m.help_session_storage_description()}
            </p>
            <code class="bg-secondary/20 text-secondary block rounded p-2 text-xs"> sessionStorage.setItem('nluiProp_' + sessionId, JSON.stringify(config)) </code>
          </div>
        </div>
      </div>

      <!-- 示例配置 / Example Configuration -->
      <div class="bg-base-100 rounded-lg p-6 shadow-lg">
        <h2 class="text-base-content mb-4 text-2xl font-bold">
          {m.help_example_title()}
        </h2>

        <div class="bg-base-200 rounded-lg p-4">
          <pre class="text-base-content overflow-x-auto text-sm"><code>{JSON.stringify(exampleProp, null, 2)}</code></pre>
        </div>

        <div class="mt-4 flex gap-4">
          <button class="btn btn-primary" onclick={tryExample}>
            {m.help_try_example()}
          </button>
        </div>
      </div>

      <!-- Card组件示例 / Card Component Examples -->
      <div class="bg-base-100 rounded-lg p-6 shadow-lg">
        <h2 class="text-base-content mb-4 text-2xl font-bold">Card Components</h2>
        <p class="text-base-content/70 mb-6">Card components are versatile containers for displaying content with optional actions, images, and layouts.</p>

        <div class="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {#each cardExamples as cardData}
            <Card {...cardData} />
          {/each}
        </div>

        <div class="flex gap-4">
          <button class="btn btn-primary" onclick={tryCardExample}>
            {m.help_try_example()}
          </button>
        </div>
      </div>

      <!-- Table组件示例 / Table Component Examples -->
      <div class="bg-base-100 rounded-lg p-6 shadow-lg">
        <h2 class="text-base-content mb-4 text-2xl font-bold">Table Components</h2>
        <p class="text-base-content/70 mb-6">Table components provide flexible data display with sorting, actions, and various styling options.</p>

        <!-- 功能丰富的表格 / Feature-rich Table -->
        <div class="mb-8">
          <h3 class="mb-4 text-lg font-semibold">Full-Featured Table</h3>
          <Table {...basicTableData} />
        </div>

        <!-- 简单表格 / Simple Table -->
        <div class="mb-8">
          <h3 class="mb-4 text-lg font-semibold">Simple Table</h3>
          <Table {...simpleTableData} />
        </div>

        <div class="flex gap-4">
          <button class="btn btn-primary" onclick={tryTableExample}>
            {m.help_try_example()}
          </button>
        </div>
      </div>

      <!-- Form组件示例 / Form Component Examples -->
      <div class="bg-base-100 rounded-lg p-6 shadow-lg">
        <h2 class="text-base-content mb-4 text-2xl font-bold">Form Components</h2>
        <p class="text-base-content/70 mb-6">Form components provide comprehensive input handling with validation, various field types, and user-friendly interfaces for data collection.</p>

        <!-- 功能丰富的表单 / Feature-rich Form -->
        <div class="mb-8">
          <h3 class="mb-4 text-lg font-semibold">Registration Form</h3>
          <div class="max-w-2xl">
            <Form {...basicFormData} />
          </div>
        </div>

        <!-- 简单表单 / Simple Form -->
        <div class="mb-8">
          <h3 class="mb-4 text-lg font-semibold">Contact Form</h3>
          <div class="max-w-lg">
            <Form {...simpleFormData} />
          </div>
        </div>

        <div class="flex gap-4">
          <button class="btn btn-primary" onclick={tryFormExample}>
            {m.help_try_example()}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
