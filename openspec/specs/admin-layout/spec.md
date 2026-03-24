# Admin Layout Specification

## ADDED Requirements

### Requirement: REQ-ADMIN-LAYOUT-001 管理员端左右菜单布局

管理员端 MUST 使用专用的左右菜单布局，与学生/老师/家长端的 DashboardLayout 区分。

#### Scenario: 管理员登录后看到左右菜单布局
- Given 用户以管理员角色登录
- When 用户访问管理员端任意页面
- Then 页面显示左侧菜单栏（256px宽）
- And 页面显示右侧内容区（自适应宽度）
- And 页面顶部显示导航栏

#### Scenario: 移动端菜单可收起
- Given 用户使用移动设备访问
- When 页面加载完成
- Then 左侧菜单默认收起
- And 用户可通过汉堡按钮展开菜单

### Requirement: REQ-ADMIN-LAYOUT-002 管理员菜单项

管理员菜单 MUST 包含首页、组织管理、用户管理、权限管理、订单管理、数据看板等功能入口。

#### Scenario: 管理员菜单完整显示
- Given 用户以管理员角色登录
- When 用户查看左侧菜单
- Then 菜单包含首页、组织管理、用户管理、权限管理、订单管理、数据看板

### Requirement: REQ-ADMIN-LAYOUT-003 AI 助手面板集成

管理员布局 MUST 集成 AI 助手面板。

#### Scenario: 管理员端显示 AI 面板
- Given 用户以管理员角色登录
- When 用户访问任意管理员页面
- Then 页面右侧显示 AI 助手面板
- And 面板可展开/收起