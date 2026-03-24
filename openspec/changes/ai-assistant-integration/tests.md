## Test Strategy

本项目使用以下测试策略：

- **单元测试**: 使用 Vitest + Testing Library 测试 React 组件和工具函数
- **集成测试**: 测试 API 调用和组件交互
- **E2E测试**: 使用 Playwright 测试关键用户流程（可选）

**测试工具**:
- Vitest (测试框架)
- @testing-library/react (组件测试)
- MSW (Mock Service Worker，用于 API mock)

## Test Cases

### 1. AI Chat Panel Tests

#### TC-1.1: 打开聊天面板
- **Priority**: High
- **Given**: 用户在任意页面
- **When**: 用户点击右下角AI助手按钮
- **Then**: 聊天面板从右侧滑出显示
- **Ref**: specs/ai-chat-panel/spec.md#用户可以打开ai助手聊天面板

#### TC-1.2: 关闭聊天面板
- **Priority**: High
- **Given**: 聊天面板已打开
- **When**: 用户点击关闭按钮或点击面板外部区域
- **Then**: 聊天面板滑出隐藏
- **Ref**: specs/ai-chat-panel/spec.md#用户可以打开ai助手聊天面板

#### TC-1.3: 发送消息并接收流式回复
- **Priority**: High
- **Given**: 聊天面板已打开，用户已输入消息
- **When**: 用户点击发送按钮或按回车键
- **Then**: 消息发送到流式对话API，AI回复实时逐字显示
- **Ref**: specs/ai-chat-panel/spec.md#用户可以与ai进行流式对话

#### TC-1.4: 流式对话显示加载状态
- **Priority**: Medium
- **Given**: 用户发送消息后等待AI回复
- **Then**: 显示加载动画或输入提示符
- **Ref**: specs/ai-chat-panel/spec.md#用户可以与ai进行流式对话

#### TC-1.5: 流式对话出错显示错误
- **Priority**: High
- **Given**: 流式对话过程中发生网络错误或API错误
- **When**: 收到错误响应
- **Then**: 显示错误提示信息，提供重试按钮
- **Ref**: specs/ai-chat-panel/spec.md#用户可以与ai进行流式对话

#### TC-1.6: 查看可用模型列表
- **Priority**: Medium
- **Given**: 聊天面板已打开
- **When**: 用户点击模型选择器
- **Then**: 显示允许调用的模型列表，标注免费模型
- **Ref**: specs/ai-chat-panel/spec.md#用户可以选择ai模型

#### TC-1.7: 选择模型后使用该模型对话
- **Priority**: High
- **Given**: 用户选择了特定模型
- **When**: 用户发送消息
- **Then**: 使用选定的模型进行对话
- **Ref**: specs/ai-chat-panel/spec.md#用户可以选择ai模型

#### TC-1.8: 默认使用GLM免费模型
- **Priority**: High
- **Given**: 用户未手动选择模型
- **When**: 用户发送消息
- **Then**: 系统默认使用 zhipu/glm-4-flash 模型
- **Ref**: specs/ai-chat-panel/spec.md#用户可以选择ai模型

#### TC-1.9: 多轮对话保持会话ID
- **Priority**: High
- **Given**: 用户在同一会话中发送多条消息
- **When**: 发送第二条消息
- **Then**: 系统使用相同的sessionId保持上下文
- **Ref**: specs/ai-chat-panel/spec.md#用户可以进行多轮对话

#### TC-1.10: 开始新会话
- **Priority**: Medium
- **Given**: 用户正在进行对话
- **When**: 用户点击"新对话"按钮
- **Then**: 清空当前对话记录，生成新的sessionId
- **Ref**: specs/ai-chat-panel/spec.md#用户可以进行多轮对话

### 2. LLM API Tests

#### TC-2.1: 调用流式对话API成功
- **Priority**: High
- **Given**: 后端服务可用
- **When**: 调用 streamChat 方法
- **Then**: 发送POST请求到 /api/llm/chat/stream，解析SSE事件流，对每个token调用onToken回调
- **Ref**: specs/llm-api/spec.md#系统应提供流式对话api封装

#### TC-2.2: 流式对话API返回错误
- **Priority**: High
- **Given**: 后端返回错误事件
- **When**: 调用 streamChat 方法收到错误事件
- **Then**: 调用onError回调并传递错误信息
- **Ref**: specs/llm-api/spec.md#系统应提供流式对话api封装

#### TC-2.3: 调用同步对话API成功
- **Priority**: Medium
- **Given**: 后端服务可用
- **When**: 调用 chat 方法
- **Then**: 发送POST请求到 /api/llm/chat，返回完整响应数据
- **Ref**: specs/llm-api/spec.md#系统应提供同步对话api封装

#### TC-2.4: 获取允许调用的模型列表
- **Priority**: High
- **Given**: 后端服务可用
- **When**: 调用 getAllowedModels 方法
- **Then**: 发送GET请求到 /api/llm/allowed-models，返回模型列表和默认模型信息
- **Ref**: specs/llm-api/spec.md#系统应提供模型列表查询api

#### TC-2.5: 获取场景列表
- **Priority**: Medium
- **Given**: 后端服务可用
- **When**: 调用 getScenes 方法
- **Then**: 发送GET请求到 /api/llm/scenes，返回场景列表信息
- **Ref**: specs/llm-api/spec.md#系统应提供场景列表查询api

#### TC-2.6: API请求携带Cookie
- **Priority**: High
- **Given**: 用户已登录
- **When**: 调用任何需要认证的LLM API
- **Then**: 请求配置包含 credentials: 'include'
- **Ref**: specs/llm-api/spec.md#api请求应携带认证信息

### 3. Page Meta Tests

#### TC-3.1: 页面包含pageCode信息
- **Priority**: Medium
- **Given**: AI助手组件初始化
- **When**: 发起对话请求
- **Then**: 请求中包含当前页面的pageCode
- **Ref**: specs/page-meta/spec.md#每个页面应定义唯一的pagecode

#### TC-3.2: 页面包含标题信息
- **Priority**: Medium
- **Given**: 用户在某个页面使用AI助手
- **Then**: AI助手知道当前页面标题
- **Ref**: specs/page-meta/spec.md#每个页面应提供页面上下文信息

#### TC-3.3: 从常量文件获取页面Meta
- **Priority**: Medium
- **Given**: 组件需要获取页面Meta信息
- **When**: 查询页面配置
- **Then**: 从 pageMeta 常量文件中查找对应页面的配置
- **Ref**: specs/page-meta/spec.md#页面meta信息应集中管理

## Test Environment

**前置条件**:
- Node.js 18+ 环境
- 安装依赖: `npm install`
- 安装测试依赖: vitest, @testing-library/react, msw

**Mock设置**:
- 使用 MSW 模拟后端 API 响应
- 模拟 SSE 流式响应用于测试流式对话

**测试数据**:
- 模拟用户登录状态
- 模拟模型列表数据
- 模拟对话消息

## Coverage Goals

| 指标 | 目标 |
|------|------|
| 代码覆盖率 | ≥ 80% |
| 需求覆盖率 | 100% (每个requirement至少1个测试用例) |
| 分支覆盖率 | ≥ 70% |

**关键路径必须覆盖**:
- 流式对话流程
- 模型选择功能
- 多轮会话管理
- 错误处理和重试