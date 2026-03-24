# 前端基础框架 - 任务列表

## 任务概览

| # | 任务 | 状态 | 依赖 |
|---|------|------|------|
| 1 | 创建 AdminLayout 组件 | completed | - |
| 2 | 创建 AIChatPanel 组件 | completed | - |
| 3 | 创建页面元信息系统 | completed | - |
| 4 | 创建 PendingFeature 组件 | completed | - |
| 5 | 更新菜单配置和路由 | completed | 1, 4 |
| 6 | 更新 DashboardLayout 集成 AI 面板 | completed | 2 |
| 7 | 创建管理员端首页占位 | completed | 5 |
| 8 | 测试验证 | completed | 1-7 |

---

## Task 1: 创建 AdminLayout 组件

**描述**: 创建管理员端专用的左右菜单布局组件

**文件**:
- `src/components/layout/AdminLayout.jsx`

**要求**:
- 左侧菜单固定宽度 (256px)
- 右侧内容区自适应
- 集成 AIChatPanel 面板
- 顶部导航栏显示用户信息
- 响应式：移动端菜单可收起
- 使用 daisyUI drawer 组件

**验收标准**:
- [x] 布局正确显示左右菜单
- [x] 移动端菜单可通过按钮展开/收起
- [x] AI 面板正确集成
- [x] 用户头像和下拉菜单正常工作

---

## Task 2: 创建 AIChatPanel 组件

**描述**: 创建可收起的 AI 助手面板组件

**文件**:
- `src/components/common/AIChatPanel.jsx`

**要求**:
- 展开状态: 约 320px 宽度
- 收起状态: 48px 窄条，显示 "AI对话" 文字 + 展开按钮
- CSS transition 动画切换状态
- 消息列表区域
- 输入框 + 发送按钮
- 接收 pageMeta 作为 prop
- 预留 AI API 调用接口（暂时使用 mock 响应）

**验收标准**:
- [x] 展开/收起动画流畅
- [x] 收起状态显示 "AI对话" 和展开按钮
- [x] 可以输入消息并发送
- [x] 消息列表正确显示

---

## Task 3: 创建页面元信息系统

**描述**: 创建所有页面的元信息定义

**文件**:
- `src/constants/pageMeta.js`

**要求**:
- 定义所有角色的首页元信息
- 定义所有功能页面的元信息（待开发页面也要定义）
- 结构: code, name, description, features, aiPrompts
- 导出 getPageMeta(code) 工具函数

**验收标准**:
- [x] 所有页面都有对应的元信息
- [x] getPageMeta 可以正确获取元信息
- [x] 元信息结构完整

---

## Task 4: 创建 PendingFeature 组件

**描述**: 创建待开发功能的占位组件和提示

**文件**:
- `src/components/common/PendingFeature.jsx`
- `src/components/common/PendingToast.jsx`

**要求**:
- PendingFeature: 用于菜单项置灰显示
- 显示 "🔒 待开发" 标签
- 点击触发 Toast 提示
- Toast 内容: "该功能正在开发中，敬请期待..."

**验收标准**:
- [x] 置灰样式正确
- [x] 显示 "待开发" 标签
- [x] 点击显示 Toast 提示

---

## Task 5: 更新菜单配置和路由

**描述**: 更新所有角色的菜单配置，增加 status 字段和待开发功能项

**文件**:
- `src/routes.jsx`
- `src/constants/index.js` (新增 ADMIN 路由常量)

**要求**:
- 所有菜单项增加 status 字段
- 增加 ADMIN 角色和路由
- 管理员菜单配置
- Sidebar 组件支持 pending 状态菜单项
- pending 菜单项点击显示 Toast 而非跳转

**验收标准**:
- [x] 所有角色菜单配置完整
- [x] pending 状态菜单项样式正确
- [x] pending 菜单项点击显示 Toast
- [x] 管理员路由正确配置

---

## Task 6: 更新 DashboardLayout 集成 AI 面板

**描述**: 在现有 DashboardLayout 中集成 AIChatPanel

**文件**:
- `src/components/layout/DashboardLayout.jsx`

**要求**:
- 在内容区右侧集成 AIChatPanel
- 传递当前页面的 pageMeta
- 保持现有功能不变

**验收标准**:
- [x] AI 面板正确显示
- [x] 面板可展开/收起
- [x] 现有功能正常
- [x] 面板收起后，展开恢复对话历史

---

## Task 7: 创建管理员端首页占位

**描述**: 创建管理员端首页的占位页面

**文件**:
- `src/pages/admin/Home.jsx`

**要求**:
- 显示欢迎信息
- 显示基础统计数据卡片
- 使用 AdminLayout 布局

**验收标准**:
- [x] 页面正常显示
- [x] 布局正确

---

## Task 8: 测试验证

**描述**: 验证所有组件和功能正常工作

**测试用例**:
1. 管理员登录 → 跳转到管理员首页 → 看到左右菜单布局
2. 点击收起 AI 面板 → 面板收起为窄条
3. 点击展开 AI 面板 → 面板展开
4. 在 AI 面板输入消息 → 显示 mock 响应
5. 点击待开发菜单项 → 显示 Toast 提示
6. 学生登录 → 跳转到学生首页 → 看到 DashboardLayout + AI 面板

**验收标准**:
- [x] 所有测试用例通过