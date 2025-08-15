import type { NLUICardComponentProps } from '$lib/ui/components/card.types';

export function getCardExamples(): NLUICardComponentProps[] {
  return [
    {
      title: 'Basic Information Card',
      body: 'This is a simple card component demonstrating basic content display with a clean layout.',
      primaryAction: {
        label: 'Learn More',
        linkUrl: '#',
        target: '_self'
      }
    },
    {
      title: 'Product Showcase Card',
      body: 'Features, pricing, and specifications for our latest product offering.',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop',
      footer: 'Updated 2 hours ago',
      primaryAction: {
        label: 'Buy Now',
        linkUrl: '#',
        target: '_self'
      },
      secondaryAction: {
        label: 'Add to Cart',
        linkUrl: '#',
        target: '_self'
      }
    },
    {
      title: 'Team Member Card',
      body: 'John Smith<br><em>Senior Software Developer</em><br>Experienced in full-stack development with expertise in React, Node.js, and cloud technologies.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      primaryAction: {
        label: 'Contact',
        linkUrl: 'mailto:john@example.com',
        target: '_self'
      }
    },
    {
      title: 'Status Card',
      body: 'System is running smoothly. All services are operational.',
      footer: 'Last checked: 5 minutes ago'
    },
    {
      title: 'iPhone 15 Pro',
      body: '配备强大的A17 Pro芯片，拥有专业级相机系统和钛金属设计。从128GB起，支持5G网络。',
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=200&fit=crop',
      footer: '价格：¥8,999起',
      primaryAction: {
        label: '立即购买',
        linkUrl: '#',
        target: '_self'
      },
      secondaryAction: {
        label: '了解更多',
        linkUrl: '#',
        target: '_self'
      }
    },
    {
      title: 'AI智能助手',
      body: '基于最新的GPT技术，提供24/7智能对话服务，帮助您快速处理各种问题和需求。支持多语言交流。',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
      footer: '免费试用30天',
      primaryAction: {
        label: '开始使用',
        linkUrl: '#',
        target: '_self'
      },
      secondaryAction: {
        label: '查看定价',
        linkUrl: '#',
        target: '_self'
      }
    },
    {
      title: '月度业绩报告',
      body: '本月销售额增长15%，新用户注册1,234人，用户活跃度提升8%。团队表现出色！',
      footer: '2024年3月报告',
      primaryAction: {
        label: '查看详情',
        linkUrl: '#',
        target: '_self'
      }
    },
    {
      title: '系统维护通知',
      body: '系统将于今晚23:00-01:00进行例行维护升级，期间部分功能可能无法使用，请提前安排工作。',
      footer: '维护时间：2小时',
      primaryAction: {
        label: '了解详情',
        linkUrl: '#',
        target: '_self'
      }
    },
    {
      title: '在线课程推荐',
      body: 'React全栈开发实战课程，从基础到进阶，包含项目实践。适合有一定JavaScript基础的学员。',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
      footer: '原价 ¥999，限时优惠 ¥699',
      primaryAction: {
        label: '立即报名',
        linkUrl: '#',
        target: '_self'
      },
      secondaryAction: {
        label: '试听课程',
        linkUrl: '#',
        target: '_self'
      }
    }
  ];
}
