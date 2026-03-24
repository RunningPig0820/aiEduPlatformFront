# AI Chat Panel Specification

## ADDED Requirements

### Requirement: REQ-AI-PANEL-001 可收起的右侧面板

AI 助手面板 MUST 作为右侧可收起面板，所有角色通用。

#### Scenario: 面板展开状态
- Given 用户访问任意已登录页面
- When AI 面板处于展开状态
- Then 面板宽度约 320px
- And 面板显示消息列表区域
- And 面板底部显示输入框和发送按钮

#### Scenario: 面板收起状态
- Given 用户访问任意已登录页面
- When AI 面板处于收起状态
- Then 面板收起为 48px 窄条
- And 窄条显示 AI对话 文字
- And 窄条底部显示展开按钮

#### Scenario: 面板展开收起动画
- Given AI 面板处于收起状态
- When 用户点击展开按钮
- Then 面板以动画形式展开
- And 动画使用 CSS transition 实现

### Requirement: REQ-AI-PANEL-002 对话功能

AI 面板 MUST 支持用户与 AI 进行对话。

#### Scenario: 发送消息
- Given AI 面板处于展开状态
- When 用户在输入框输入消息并点击发送
- Then 消息显示在消息列表中
- And AI 返回响应

#### Scenario: 消息列表显示
- Given AI 面板存在历史消息
- When 用户查看消息列表
- Then 用户消息显示在右侧
- And AI 响应显示在左侧
- And 消息按时间顺序排列

### Requirement: REQ-AI-PANEL-003 响应式适配

AI 面板 MUST 在不同设备上有不同的显示策略。

#### Scenario: 桌面端面板显示
- Given 用户使用桌面设备大于1024px
- When 页面加载完成
- Then AI 面板默认展开
- And 面板可收起为窄条

#### Scenario: 平板端面板显示
- Given 用户使用平板设备768到1024px
- When 页面加载完成
- Then AI 面板默认收起
- And 面板可展开

#### Scenario: 手机端面板隐藏
- Given 用户使用手机设备小于768px
- When 页面加载完成
- Then AI 面板完全隐藏
- And 页面显示浮动按钮用于触发 AI 面板