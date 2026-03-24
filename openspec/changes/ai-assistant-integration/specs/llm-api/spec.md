## ADDED Requirements

### Requirement: 系统应提供流式对话API封装

系统应封装后端流式对话接口，支持SSE响应解析。

#### Scenario: 调用流式对话API成功
- **WHEN** 调用 streamChat 方法
- **THEN** 发送POST请求到 /api/llm/chat/stream
- **AND** 解析SSE事件流
- **AND** 对每个token事件调用onToken回调
- **AND** 完成时调用onDone回调

#### Scenario: 流式对话API返回错误
- **WHEN** 调用 streamChat 方法收到错误事件
- **THEN** 调用onError回调并传递错误信息

### Requirement: 系统应提供同步对话API封装

系统应封装后端同步对话接口，返回完整响应。

#### Scenario: 调用同步对话API成功
- **WHEN** 调用 chat 方法
- **THEN** 发送POST请求到 /api/llm/chat
- **AND** 返回完整的响应数据

### Requirement: 系统应提供模型列表查询API

系统应封装获取允许调用的模型列表接口。

#### Scenario: 获取允许调用的模型列表
- **WHEN** 调用 getAllowedModels 方法
- **THEN** 发送GET请求到 /api/llm/allowed-models
- **AND** 返回模型列表和默认模型信息

### Requirement: 系统应提供场景列表查询API

系统应封装获取场景列表接口。

#### Scenario: 获取场景列表
- **WHEN** 调用 getScenes 方法
- **THEN** 发送GET请求到 /api/llm/scenes
- **AND** 返回场景列表信息

### Requirement: API请求应携带认证信息

所有需要登录的API请求应携带Cookie认证。

#### Scenario: API请求携带Cookie
- **WHEN** 调用任何需要认证的LLM API
- **THEN** 请求配置包含 credentials: 'include'