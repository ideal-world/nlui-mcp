import type { NLUIProps } from '../../../lib/ui/nluiProps.types';

export function getLayoutExamples(): { title: string; description: string; config: NLUIProps; preview?: boolean }[] {
  return [
    {
      title: '完整企业布局',
      description: '展示包含 header、footer、left、right、main 五个区域的完整布局结构',
      config: {
        block: {
          header: {
            kind: 'card',
            cardProps: {
              title: '企业管理系统',
              body: '欢迎使用数据分析平台'
            }
          },
          left: {
            kind: 'markdown',
            markdownProps: {
              content: `## 导航菜单
- 📊 仪表盘
- 👥 员工管理
- 📈 数据分析
- ⚙️ 系统设置`
            }
          },
          main: {
            kind: 'table',
            tableProps: {
              title: '数据概览',
              columns: [
                { key: 'name', title: '名称' },
                { key: 'value', title: '数值' },
                { key: 'status', title: '状态' }
              ],
              rows: [
                { id: 1, data: { name: '用户数', value: '1,234', status: '正常' } },
                { id: 2, data: { name: '订单数', value: '567', status: '增长' } },
                { id: 3, data: { name: '收入', value: '¥12,345', status: '稳定' } }
              ]
            }
          },
          right: {
            kind: 'chart',
            chartProps: {
              title: '趋势图',
              config: {
                chart: { type: 'line' },
                xaxis: { categories: ['一月', '二月', '三月', '四月'] }
              },
              series: [{ name: '销售额', data: [100, 200, 300, 400] }]
            }
          },
          footer: {
            kind: 'markdown',
            markdownProps: {
              content: '© 2024 企业管理系统'
            }
          }
        },
        showTools: true
      },
      preview: true
    },
    {
      title: '嵌套布局结构',
      description: '演示 main 区域内可以再次包含完整的布局结构',
      config: {
        block: {
          header: {
            kind: 'card',
            cardProps: {
              title: '嵌套布局演示',
              body: '外层布局的头部区域'
            }
          },
          main: {
            header: {
              kind: 'markdown',
              markdownProps: {
                content: '### 内层布局\n这是嵌套在主区域内的布局'
              }
            },
            left: {
              kind: 'card',
              cardProps: {
                title: '左侧面板',
                body: '嵌套布局的侧边栏'
              }
            },
            main: {
              kind: 'form',
              formProps: {
                title: '用户表单',
                fields: [
                  {
                    name: 'username',
                    label: '用户名',
                    type: 'text',
                    required: true
                  },
                  {
                    name: 'email',
                    label: '邮箱',
                    type: 'email',
                    required: true
                  }
                ],
                submitAction: {
                  linkUrl: '/submit',
                  apiUrl: '/api/submit',
                  method: 'POST',
                  type: 'create',
                  label: '提交'
                }
              }
            },
            right: {
              kind: 'timeline',
              timelineProps: {
                title: '操作记录',
                items: [
                  {
                    id: 1,
                    time: '2024-01-01',
                    title: '账户创建',
                    status: 'success'
                  },
                  {
                    id: 2,
                    time: '2024-01-02',
                    title: '首次登录'
                  }
                ]
              }
            }
          },
          footer: {
            kind: 'markdown',
            markdownProps: {
              content: '外层布局的底部信息'
            }
          }
        },
        showTools: true
      },
      preview: true
    },
    {
      title: '简单三栏布局',
      description: '包含左侧导航、主内容区和右侧工具栏的常见布局',
      config: {
        block: {
          left: {
            kind: 'markdown',
            markdownProps: {
              content: `## 导航
- 首页
- 产品
- 关于我们
- 联系方式`
            }
          },
          main: {
            kind: 'card',
            cardProps: {
              title: '主要内容',
              body: '这里是页面的主要内容区域，可以放置任何类型的组件。'
            }
          },
          right: {
            kind: 'markdown',
            markdownProps: {
              content: `## 工具栏
- 搜索
- 筛选
- 帮助`
            }
          }
        }
      }
    },
    {
      title: '头部导航布局',
      description: '包含顶部导航和主内容区的简洁布局',
      config: {
        block: {
          header: {
            kind: 'card',
            cardProps: {
              title: '网站标题',
              body: '导航：首页 | 产品 | 服务 | 联系'
            }
          },
          main: {
            kind: 'markdown',
            markdownProps: {
              content: `# 欢迎来到我们的网站

这是一个展示头部导航布局的示例。

## 特色功能
- 简洁的设计
- 响应式布局
- 易于导航

联系我们获取更多信息。`
            }
          }
        }
      }
    }
  ];
}
