import type { NLUITableComponentProps } from '$lib/ui/components/table.types';
import * as m from '../../../paraglide/messages';

/**
 * 表格示例数据生成器
 * Table examples data generator
 */
export function getTableExamples(): NLUITableComponentProps[] {
  return [
    // 员工目录示例 / Employee Directory Example
    {
      title: m.example_employee_directory(),
      columns: [
        { key: 'name', title: m.example_employee_name() },
        { key: 'position', title: m.example_employee_position() },
        { key: 'department', title: m.example_employee_department() },
        { key: 'email', title: m.example_employee_email() },
        { key: 'startDate', title: m.example_employee_start_date() }
      ],
      rows: [
        {
          id: '1',
          data: {
            name: 'Alice Johnson',
            position: 'Senior Developer',
            department: 'Engineering',
            email: 'alice@company.com',
            startDate: '2022-03-15'
          }
        },
        {
          id: '2',
          data: {
            name: 'Bob Chen',
            position: 'Product Manager',
            department: 'Product',
            email: 'bob@company.com',
            startDate: '2021-08-22'
          }
        },
        {
          id: '3',
          data: {
            name: 'Carol Davis',
            position: 'UX Designer',
            department: 'Design',
            email: 'carol@company.com',
            startDate: '2023-01-10'
          }
        },
        {
          id: '4',
          data: {
            name: 'David Wilson',
            position: 'DevOps Engineer',
            department: 'Engineering',
            email: 'david@company.com',
            startDate: '2022-11-03'
          }
        },
        {
          id: '5',
          data: {
            name: 'Eva Martinez',
            position: 'Data Scientist',
            department: 'Analytics',
            email: 'eva@company.com',
            startDate: '2023-06-12'
          }
        }
      ],
      searchable: true,
      pageSize: 10
    },

    // 销售报告示例 / Sales Report Example
    {
      title: m.example_sales_report(),
      columns: [
        { key: 'month', title: m.example_sales_month() },
        { key: 'revenue', title: m.example_sales_revenue() },
        { key: 'growth', title: m.example_sales_growth() },
        { key: 'orders', title: m.example_sales_orders() }
      ],
      rows: [
        {
          id: '1',
          data: {
            month: 'January',
            revenue: '$45,230',
            growth: '+12.5%',
            orders: '342'
          }
        },
        {
          id: '2',
          data: {
            month: 'February',
            revenue: '$52,100',
            growth: '+15.2%',
            orders: '389'
          }
        },
        {
          id: '3',
          data: {
            month: 'March',
            revenue: '$48,750',
            growth: '-6.4%',
            orders: '371'
          }
        },
        {
          id: '4',
          data: {
            month: 'April',
            revenue: '$61,440',
            growth: '+26.0%',
            orders: '445'
          }
        },
        {
          id: '5',
          data: {
            month: 'May',
            revenue: '$58,920',
            growth: '-4.1%',
            orders: '423'
          }
        },
        {
          id: '6',
          data: {
            month: 'June',
            revenue: '$67,340',
            growth: '+14.3%',
            orders: '498'
          }
        }
      ],
      searchable: true,
      pageSize: 5
    },

    // 产品库存管理示例 / Product Inventory Management Example
    {
      title: m.example_product_inventory(),
      columns: [
        { key: 'name', title: m.example_product_name() },
        { key: 'sku', title: m.example_product_sku() },
        { key: 'category', title: m.example_product_category() },
        { key: 'stock', title: m.example_product_stock() },
        { key: 'price', title: m.example_product_price() },
        { key: 'status', title: m.example_product_status() }
      ],
      rows: [
        {
          id: '1',
          data: {
            name: 'iPhone 15 Pro',
            sku: 'IP15P-128',
            category: 'Smartphone',
            stock: '45',
            price: '$999',
            status: 'In Stock'
          }
        },
        {
          id: '2',
          data: {
            name: 'MacBook Air M2',
            sku: 'MBA-M2-256',
            category: 'Laptop',
            stock: '12',
            price: '$1,199',
            status: 'Low Stock'
          }
        },
        {
          id: '3',
          data: {
            name: 'AirPods Pro',
            sku: 'APP-GEN2',
            category: 'Audio',
            stock: '78',
            price: '$249',
            status: 'In Stock'
          }
        },
        {
          id: '4',
          data: {
            name: 'iPad Air',
            sku: 'IPA-11-64',
            category: 'Tablet',
            stock: '0',
            price: '$599',
            status: 'Out of Stock'
          }
        },
        {
          id: '5',
          data: {
            name: 'Apple Watch S9',
            sku: 'AWS9-41',
            category: 'Wearable',
            stock: '23',
            price: '$399',
            status: 'In Stock'
          }
        }
      ],
      searchable: true,
      pageSize: 5
    },

    // 用户反馈统计示例 / User Feedback Statistics Example
    {
      title: m.example_feedback_statistics(),
      columns: [
        { key: 'date', title: m.example_feedback_date() },
        { key: 'category', title: m.example_feedback_category() },
        { key: 'rating', title: m.example_feedback_rating() },
        { key: 'count', title: m.example_feedback_count() },
        { key: 'response', title: m.example_feedback_response() }
      ],
      rows: [
        {
          id: '1',
          data: {
            date: '2024-03-15',
            category: 'Feature Request',
            rating: '★★★★☆',
            count: '156',
            response: '85%'
          }
        },
        {
          id: '2',
          data: {
            date: '2024-03-14',
            category: 'Usage Issue',
            rating: '★★★☆☆',
            count: '89',
            response: '92%'
          }
        },
        {
          id: '3',
          data: {
            date: '2024-03-13',
            category: 'UI Improvement',
            rating: '★★★★★',
            count: '203',
            response: '78%'
          }
        },
        {
          id: '4',
          data: {
            date: '2024-03-12',
            category: 'Performance',
            rating: '★★☆☆☆',
            count: '67',
            response: '95%'
          }
        }
      ],
      searchable: true,
      pageSize: 8
    },

    // 项目进度跟踪示例 / Project Progress Tracking Example
    {
      title: m.example_project_tracking(),
      columns: [
        { key: 'project', title: m.example_project_name() },
        { key: 'manager', title: m.example_project_manager() },
        { key: 'progress', title: m.example_project_progress() },
        { key: 'deadline', title: m.example_project_deadline() },
        { key: 'priority', title: m.example_project_priority() }
      ],
      rows: [
        {
          id: '1',
          data: {
            project: 'Mobile App Refactor',
            manager: 'John Smith',
            progress: '85%',
            deadline: '2024-04-15',
            priority: 'High'
          }
        },
        {
          id: '2',
          data: {
            project: 'Data Analytics Platform',
            manager: 'Sarah Jones',
            progress: '45%',
            deadline: '2024-05-30',
            priority: 'Medium'
          }
        },
        {
          id: '3',
          data: {
            project: 'User Experience Optimization',
            manager: 'Mike Chen',
            progress: '92%',
            deadline: '2024-03-25',
            priority: 'High'
          }
        },
        {
          id: '4',
          data: {
            project: 'Backend Management System',
            manager: 'Lisa Wang',
            progress: '15%',
            deadline: '2024-06-20',
            priority: 'Low'
          }
        }
      ],
      searchable: true,
      pageSize: 8
    }
  ];
}
