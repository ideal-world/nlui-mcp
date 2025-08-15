import type { NLUITableComponentProps } from '$lib/ui/components/table.types';

export function getTableExamples(): NLUITableComponentProps[] {
  return [
    {
      title: 'Employee Directory',
      columns: [
        { key: 'name', title: 'Name' },
        { key: 'position', title: 'Position' },
        { key: 'department', title: 'Department' },
        { key: 'email', title: 'Email' },
        { key: 'startDate', title: 'Start Date' }
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
        }
      ],
      searchable: true,
      pageSize: 10
    },
    {
      title: 'Sales Report',
      columns: [
        { key: 'month', title: 'Month' },
        { key: 'revenue', title: 'Revenue ($)' },
        { key: 'growth', title: 'Growth (%)' },
        { key: 'orders', title: 'Orders' }
      ],
      rows: [
        { id: '1', data: { month: 'January', revenue: '$45,230', growth: '+12.5%', orders: '342' } },
        { id: '2', data: { month: 'February', revenue: '$52,100', growth: '+15.2%', orders: '389' } },
        { id: '3', data: { month: 'March', revenue: '$48,750', growth: '-6.4%', orders: '371' } },
        { id: '4', data: { month: 'April', revenue: '$61,440', growth: '+26.0%', orders: '445' } }
      ]
    },
    {
      title: '产品库存管理',
      columns: [
        { key: 'name', title: '产品名称' },
        { key: 'sku', title: 'SKU编码' },
        { key: 'category', title: '分类' },
        { key: 'stock', title: '库存' },
        { key: 'price', title: '单价' },
        { key: 'status', title: '状态' }
      ],
      rows: [
        { id: '1', data: { name: 'iPhone 15 Pro', sku: 'IP15P-128', category: '手机', stock: '45', price: '¥8,999', status: '正常' } },
        { id: '2', data: { name: 'MacBook Air M2', sku: 'MBA-M2-256', category: '笔记本', stock: '12', price: '¥9,499', status: '库存不足' } },
        { id: '3', data: { name: 'AirPods Pro', sku: 'APP-GEN2', category: '耳机', stock: '78', price: '¥1,899', status: '正常' } },
        { id: '4', data: { name: 'iPad Air', sku: 'IPA-11-64', category: '平板', stock: '0', price: '¥4,699', status: '缺货' } },
        { id: '5', data: { name: 'Apple Watch S9', sku: 'AWS9-41', category: '手表', stock: '23', price: '¥2,999', status: '正常' } }
      ],
      searchable: true,
      pageSize: 5
    },
    {
      title: '用户反馈统计',
      columns: [
        { key: 'date', title: '日期' },
        { key: 'category', title: '反馈类别' },
        { key: 'rating', title: '满意度' },
        { key: 'count', title: '反馈数量' },
        { key: 'response', title: '响应率' }
      ],
      rows: [
        { id: '1', data: { date: '2024-03-15', category: '功能建议', rating: '★★★★☆', count: '156', response: '85%' } },
        { id: '2', data: { date: '2024-03-14', category: '使用问题', rating: '★★★☆☆', count: '89', response: '92%' } },
        { id: '3', data: { date: '2024-03-13', category: '界面优化', rating: '★★★★★', count: '203', response: '78%' } },
        { id: '4', data: { date: '2024-03-12', category: '性能问题', rating: '★★☆☆☆', count: '67', response: '95%' } }
      ]
    },
    {
      title: '项目进度跟踪',
      columns: [
        { key: 'project', title: '项目名称' },
        { key: 'manager', title: '项目经理' },
        { key: 'progress', title: '进度' },
        { key: 'deadline', title: '截止日期' },
        { key: 'priority', title: '优先级' }
      ],
      rows: [
        { id: '1', data: { project: '移动端应用重构', manager: '张三', progress: '85%', deadline: '2024-04-15', priority: '高' } },
        { id: '2', data: { project: '数据分析平台', manager: '李四', progress: '45%', deadline: '2024-05-30', priority: '中' } },
        { id: '3', data: { project: '用户体验优化', manager: '王五', progress: '92%', deadline: '2024-03-25', priority: '高' } },
        { id: '4', data: { project: '后台管理系统', manager: '赵六', progress: '15%', deadline: '2024-06-20', priority: '低' } }
      ],
      searchable: true,
      pageSize: 8
    }
  ];
}
