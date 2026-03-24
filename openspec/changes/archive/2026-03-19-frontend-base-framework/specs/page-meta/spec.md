# Page Meta Specification

## ADDED Requirements

### Requirement: REQ-PAGE-META-001 页面元信息定义

每个页面 MUST 定义元信息，为 AI 助手提供上下文。

#### Scenario: 页面元信息结构
- Given 开发者定义页面元信息
- When 元信息定义完成
- Then 元信息包含 code、name、description、features、aiPrompts 字段

#### Scenario: 获取页面元信息
- Given 页面元信息已定义
- When 调用 getPageMeta 函数
- Then 返回对应页面的元信息对象

### Requirement: REQ-PAGE-META-002 所有角色首页元信息

系统 MUST 定义所有角色的首页元信息。

#### Scenario: 学生首页元信息
- Given 学生首页元信息定义
- When 查询 STUDENT_HOME 元信息
- Then 返回学生首页的功能描述和 AI 提示

#### Scenario: 老师首页元信息
- Given 老师首页元信息定义
- When 查询 TEACHER_HOME 元信息
- Then 返回老师首页的功能描述和 AI 提示

#### Scenario: 家长首页元信息
- Given 家长首页元信息定义
- When 查询 PARENT_HOME 元信息
- Then 返回家长首页的功能描述和 AI 提示

#### Scenario: 管理员首页元信息
- Given 管理员首页元信息定义
- When 查询 ADMIN_HOME 元信息
- Then 返回管理员首页的功能描述和 AI 提示

### Requirement: REQ-PAGE-META-003 待开发功能页面元信息

待开发功能的页面 MUST 定义元信息。

#### Scenario: 待开发页面元信息
- Given 开发者定义待开发页面元信息
- When 元信息定义完成
- Then 元信息标记为 pending 状态
- And 功能描述说明该功能正在开发中