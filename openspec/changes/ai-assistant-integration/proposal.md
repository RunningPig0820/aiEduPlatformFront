## Why

平台需要为用户提供AI助手功能，帮助用户更好地使用平台。后端已完成LLM Gateway集成，前端需要对接AI对话能力，支持流式响应以提升用户体验。

## What Changes

- 新增AI助手聊天面板组件，支持流式对话
- 新增LLM API集成模块，封装对话、模型获取等接口
- 为每个页面添加页面meta信息（pageCode、title等），用于AI助手上下文
- 支持模型选择功能，默认使用GLM-4-Flash免费模型
- 支持多轮对话会话管理

## Capabilities

### New Capabilities

- `ai-chat-panel`: AI助手聊天面板组件，支持流式对话、模型选择、会话管理
- `llm-api`: LLM API集成模块，封装同步/流式对话、模型列表获取等接口
- `page-meta`: 页面meta信息系统，为每个页面定义pageCode和上下文信息

### Modified Capabilities

- 无现有capability需要修改

## Impact

**新增文件：**
- `src/js/llm.js` - LLM API集成模块
- `src/components/ai-chat-panel.js` - AI助手面板组件

**修改文件：**
- 各角色页面（student/home.html、teacher/home.html、parent/home.html）- 添加AI助手入口
- 各页面添加page-meta配置

**依赖后端API：**
- `POST /api/llm/chat/stream` - 流式对话
- `GET /api/llm/allowed-models` - 获取允许调用的模型列表
- `GET /api/llm/scenes` - 获取场景列表