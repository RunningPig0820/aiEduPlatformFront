## ADDED Requirements

### Requirement: 每个页面应定义唯一的pageCode

系统应为每个页面定义唯一的pageCode，用于AI助手上下文识别。

#### Scenario: 页面包含pageCode信息
- **WHEN** AI助手发起对话请求
- **THEN** 请求中包含当前页面的pageCode

### Requirement: 每个页面应提供页面上下文信息

系统应为每个页面定义meta信息，包括标题、场景等。

#### Scenario: 页面包含标题信息
- **WHEN** 用户在某个页面使用AI助手
- **THEN** AI助手知道当前页面标题

#### Scenario: 页面关联默认场景
- **WHEN** 用户在某个页面使用AI助手
- **THEN** 使用该页面关联的默认场景

### Requirement: 页面Meta信息应集中管理

页面Meta信息应在统一位置定义，便于维护。

#### Scenario: 从常量文件获取页面Meta
- **WHEN** 组件需要获取页面Meta信息
- **THEN** 从 pageMeta 常量文件中查找对应页面的配置