## ADDED Requirements

### Requirement: 用户可以打开AI助手聊天面板

系统应提供AI助手入口，用户点击后可打开聊天面板。

#### Scenario: 打开聊天面板
- **WHEN** 用户点击页面右下角的AI助手按钮
- **THEN** 系统从右侧滑出聊天面板

#### Scenario: 关闭聊天面板
- **WHEN** 用户点击面板关闭按钮或点击面板外部区域
- **THEN** 聊天面板滑出隐藏

### Requirement: 用户可以与AI进行流式对话

系统应支持流式对话，实时显示AI回复内容。

#### Scenario: 发送消息并接收流式回复
- **WHEN** 用户输入消息并发送
- **THEN** 系统发送请求到流式对话API
- **AND** 实时显示AI回复的每个token
- **AND** 回复完成后显示使用的模型信息

#### Scenario: 流式对话过程中显示加载状态
- **WHEN** 用户发送消息后等待AI回复
- **THEN** 显示加载动画或输入提示符

#### Scenario: 流式对话出错时显示错误
- **WHEN** 流式对话过程中发生错误
- **THEN** 显示错误提示信息
- **AND** 提供重试选项

### Requirement: 用户可以选择AI模型

系统应允许用户选择不同的AI模型进行对话。

#### Scenario: 查看可用模型列表
- **WHEN** 用户点击模型选择器
- **THEN** 显示允许调用的模型列表
- **AND** 标注哪些是免费模型

#### Scenario: 选择模型后使用该模型对话
- **WHEN** 用户选择特定模型并发送消息
- **THEN** 使用选定的模型进行对话

#### Scenario: 默认使用GLM免费模型
- **WHEN** 用户未选择模型
- **THEN** 系统默认使用 zhipu/glm-4-flash 模型

### Requirement: 用户可以进行多轮对话

系统应支持多轮对话，保持上下文连贯。

#### Scenario: 多轮对话保持会话ID
- **WHEN** 用户在同一会话中发送多条消息
- **THEN** 系统使用相同的sessionId保持上下文

#### Scenario: 开始新会话
- **WHEN** 用户点击"新对话"按钮
- **THEN** 清空当前对话记录
- **AND** 生成新的sessionId