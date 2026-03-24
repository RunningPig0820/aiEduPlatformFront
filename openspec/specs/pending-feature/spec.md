# Pending Feature Specification

## ADDED Requirements

### Requirement: REQ-PENDING-001 菜单项待开发状态

待开发功能的菜单项 MUST 使用特殊的视觉样式。

#### Scenario: 菜单项置灰显示
- Given 菜单项状态为 pending
- When 用户查看菜单
- Then 菜单项显示为灰色置灰效果
- And 菜单项右侧显示待开发标签

#### Scenario: 点击待开发菜单项
- Given 菜单项状态为 pending
- When 用户点击该菜单项
- Then 页面显示 Toast 提示
- And 提示内容为该功能正在开发中
- And 不发生路由跳转

### Requirement: REQ-PENDING-002 卡片入口待开发状态

卡片式功能入口 MUST 使用待开发状态样式。

#### Scenario: 卡片置灰显示
- Given 卡片功能状态为 pending
- When 用户查看页面
- Then 卡片显示为灰色置灰效果
- And 卡片显示待开发标签

#### Scenario: 点击待开发卡片
- Given 卡片功能状态为 pending
- When 用户点击该卡片
- Then 页面显示 Toast 提示
- And 提示内容为该功能正在开发中

### Requirement: REQ-PENDING-003 Toast 提示组件

待开发功能 MUST 使用统一的 Toast 提示组件。

#### Scenario: Toast 提示显示
- Given 用户点击待开发功能
- When Toast 显示
- Then Toast 显示警告图标
- And Toast 内容为该功能正在开发中敬请期待
- And Toast 有知道了关闭按钮
- And Toast 在 3 秒后自动消失