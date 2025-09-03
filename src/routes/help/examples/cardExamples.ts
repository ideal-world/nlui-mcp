import type { NLUICardComponentProps } from '$lib/ui/components/card.types';
import * as m from '../../../paraglide/messages';

/**
 * 卡片示例数据生成器
 * Card examples data generator
 */
export function getCardExamples(): NLUICardComponentProps[] {
  return [
    // 基础信息卡片 / Basic Information Card
    {
      title: m.example_card_basic_title(),
      body: m.example_card_basic_body(),
      primaryAction: {
        label: m.button_learn_more(),
        linkUrl: '#',
        target: '_self'
      }
    },

    // 产品展示卡片 / Product Showcase Card
    {
      title: m.example_card_product_title(),
      body: m.example_card_product_body(),
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop',
      footer: m.footer_updated_ago(),
      primaryAction: {
        label: m.button_buy_now(),
        linkUrl: '#',
        target: '_self'
      },
      secondaryAction: {
        label: m.button_add_to_cart(),
        linkUrl: '#',
        target: '_self'
      }
    },

    // 团队成员卡片 / Team Member Card
    {
      title: m.example_card_team_title(),
      body: m.example_card_team_body(),
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      primaryAction: {
        label: m.button_contact(),
        linkUrl: 'mailto:john@example.com',
        target: '_self'
      }
    },

    // 状态卡片 / Status Card
    {
      title: m.example_card_status_title(),
      body: m.example_card_status_body(),
      footer: m.footer_last_checked()
    },

    // 产品卡片2 / Product Card 2
    {
      title: m.example_card_product2_title(),
      body: m.example_card_product2_body(),
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=200&fit=crop',
      footer: m.footer_price_from(),
      primaryAction: {
        label: m.button_buy_now(),
        linkUrl: '#',
        target: '_self'
      },
      secondaryAction: {
        label: m.button_learn_more(),
        linkUrl: '#',
        target: '_self'
      }
    },

    // AI智能助手卡片 / AI Assistant Card
    {
      title: m.example_card_ai_title(),
      body: m.example_card_ai_body(),
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
      footer: m.footer_free_trial(),
      primaryAction: {
        label: m.button_start_using(),
        linkUrl: '#',
        target: '_self'
      },
      secondaryAction: {
        label: m.button_view_pricing(),
        linkUrl: '#',
        target: '_self'
      }
    },

    // 月度业绩报告卡片 / Monthly Performance Report Card
    {
      title: m.example_card_report_title(),
      body: m.example_card_report_body(),
      footer: m.footer_march_report(),
      primaryAction: {
        label: m.button_view_details(),
        linkUrl: '#',
        target: '_self'
      }
    },

    // 系统维护通知卡片 / System Maintenance Notice Card
    {
      title: m.example_card_maintenance_title(),
      body: m.example_card_maintenance_body(),
      footer: m.footer_maintenance_time(),
      primaryAction: {
        label: m.button_understand_details(),
        linkUrl: '#',
        target: '_self'
      }
    },

    // 在线课程推荐卡片 / Online Course Recommendation Card
    {
      title: m.example_card_course_title(),
      body: m.example_card_course_body(),
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
      footer: m.footer_course_price(),
      primaryAction: {
        label: m.button_enroll_now(),
        linkUrl: '#',
        target: '_self'
      },
      secondaryAction: {
        label: m.button_trial_course(),
        linkUrl: '#',
        target: '_self'
      }
    }
  ];
}
