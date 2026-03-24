## Context

后端已完成LLM Gateway集成，提供流式对话API。前端使用Alpine.js + Tailwind + daisyUI技术栈，需要实现AI助手面板组件，支持流式对话体验。

**后端API已就绪：**
- `POST /api/llm/chat/stream` - SSE流式对话
- `GET /api/llm/allowed-models` - 获取允许调用的模型列表
- `GET /api/llm/scenes` - 获取场景列表

**技术约束：**
- SSE流式请求需要使用 `fetch` + `ReadableStream`，因为 `EventSource` 不支持POST
- 需要携带Cookie进行身份验证 (`credentials: 'include'`)
- 默认使用 `zhipu/glm-4-flash` 免费模型

## Goals / Non-Goals

**Goals:**
- 实现可复用的AI助手聊天面板组件
- 支持流式对话，实时显示AI回复
- 支持模型选择，默认使用GLM免费模型
- 为每个页面配置meta信息，提供AI上下文
- 支持多轮对话会话

**Non-Goals:**
- 不实现对话历史持久化（刷新后丢失）
- 不实现图片/文件上传（后端暂不支持）
- 不实现语音输入

## Decisions

### 1. 流式对话实现方式

**选择：使用 fetch + ReadableStream 解析SSE**

**原因：**
- 后端使用SSE格式返回流式数据
- EventSource不支持POST请求
- fetch方式可以灵活控制请求体

**实现要点：**
```javascript
// SSE解析：按行解析 event: 和 data:
const lines = buffer.split('\n');
for (const line of lines) {
  if (line.startsWith('event:')) eventType = line.slice(6).trim();
  if (line.startsWith('data:')) jsonData = line.slice(5).trim();
}
```

### 2. 页面Meta信息存储

**选择：使用全局常量文件 `src/constants/pageMeta.js`**

**原因：**
- 集中管理，便于维护
- 不需要在每个页面重复定义
- 可被AI助手API调用时引用

**数据结构：**
```javascript
export const PAGE_META = {
  'student_home': { title: '学生首页', scene: 'page_assistant' },
  'teacher_home': { title: '教师首页', scene: 'page_assistant' },
  // ...
};
```

### 3. AI助手面板组件设计

**选择：侧边滑出面板（Slide-over Panel）**

**原因：**
- 不遮挡主内容区域
- 用户可同时查看页面和AI对话
- 符合主流AI助手UI模式

**组件结构：**
- 固定在右下角的触发按钮（AI图标）
- 点击后滑出聊天面板
- 面板包含：消息列表、输入框、模型选择器

## Risks / Trade-offs

**[风险] SSE连接中断** → 显示错误提示，提供重试按钮

**[风险] 模型响应慢** → 显示加载动画，支持取消请求

**[风险] Token消耗** → 显示当前会话Token使用量（如果后端返回）

**[权衡] 不持久化历史** → 简化实现，但用户体验略差