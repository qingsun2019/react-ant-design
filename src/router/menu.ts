import { isUrl } from '@/utils'

const menuList: Array<any> = [
  {
    name: 'Dashboard',
    icon: 'dashboard',
    path: 'dashboard',
    children: [
      {
        name: '分析页',
        path: 'analysis'
      },
      {
        name: '监控页',
        path: 'monitor'
      },
      {
        name: '工作台',
        path: 'workplace'
        // hideInBreadcrumb: true,
        // hideInMenu: true, 菜单中隐藏
      }
    ]
  },
  {
    name: '表单页',
    icon: 'form',
    path: 'form',
    children: [
      {
        name: '基础表单',
        path: 'basic-form'
      },
      {
        name: '高级表单',
        authority: 'admin',
        path: 'advanced-form'
      },
      {
        name: '分步表单',
        path: 'step-form'
      }
    ]
  },
  {
    name: '列表页',
    icon: 'table',
    path: 'list',
    children: [
      {
        name: '查询表格',
        path: 'table-list'
      },
      {
        name: '标准列表',
        path: 'basic-list'
      },
      {
        name: '卡片列表',
        path: 'card-list'
      },
      {
        name: '搜索列表',
        path: 'search',
        children: [
          {
            name: '搜索列表（文章）',
            path: 'articles'
          },
          {
            name: '搜索列表（项目）',
            path: 'projects'
          },
          {
            name: '搜索列表（应用）',
            path: 'applications'
          }
        ]
      }
    ]
  },
  {
    name: '详情页',
    icon: 'profile',
    path: 'profile',
    children: [
      {
        name: '基础详情页',
        path: 'basic'
      },
      {
        name: '高级详情页',
        path: 'advanced',
        authority: 'admin'
      }
    ]
  },
  {
    name: '结果页',
    icon: 'check-circle-o',
    path: 'result',
    children: [
      {
        name: '成功',
        path: 'success'
      },
      {
        name: '失败',
        path: 'fail'
      }
    ]
  },
  {
    name: '异常页',
    icon: 'warning',
    path: 'exception',
    children: [
      {
        name: '403',
        path: '403'
      },
      {
        name: '404',
        path: '404'
      },
      {
        name: '500',
        path: '500'
      },
      {
        name: '触发异常',
        path: 'trigger',
        hideInMenu: true
      }
    ]
  },
  {
    name: '个人页',
    icon: 'user',
    path: 'account',
    children: [
      {
        name: '个人中心',
        path: 'center'
      },
      {
        name: '个人设置',
        path: 'settings'
      }
    ]
  },
  {
    name: '图形编辑器',
    icon: 'highlight',
    path: 'editor',
    children: [
      {
        name: '流程编辑器',
        path: 'flow'
      },
      {
        name: '脑图编辑器',
        path: 'mind'
      },
      {
        name: '拓扑编辑器',
        path: 'koni'
      }
    ]
  }
]

/**
 *
 * @param data
 * @param parentPath
 * @param parentAuthority
 */
function formatter (data: any, parentPath: string = '/', parentAuthority?: string) {
  return data.map((item: { path: any; authority?: any; children?: any; }) => {
    let { path } = item
    if (!isUrl(path)) {
      path = parentPath + item.path
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority
    }
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`,
        item.authority)
    }
    return result
  })
}

export const getMenuData = () => formatter(menuList)
