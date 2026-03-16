---
name: "OPSX: 提议"
description: 提出新变更 - 创建变更并在一步中生成所有制品
category: Workflow
tags: [workflow, artifacts, experimental]
---

提出新变更 - 创建变更并在一步中生成所有制品。

我将创建一个变更，包含以下制品：
- proposal.md（做什么和为什么）
- design.md（怎么做）
- tasks.md（实现步骤）

准备好实现时，运行 /opsx:apply

---

**输入**：`/opsx:propose` 后面的参数是变更名称（kebab-case 格式），或者描述用户想要构建什么。

**步骤**

1. **如果没有提供输入，询问他们想要构建什么**

   使用 **AskUserQuestion 工具**（开放式，无预设选项）询问：
   > "你想要处理什么变更？描述你想要构建或修复什么。"

   根据他们的描述，派生一个 kebab-case 格式的名称（例如，"添加用户认证" → `add-user-auth`）。

   **重要**：在不理解用户想要构建什么之前，不要继续。

2. **创建变更目录**
   ```bash
   openspec new change "<名称>"
   ```
   这会在 `openspec/changes/<名称>/` 创建一个带有 `.openspec.yaml` 的脚手架变更。

3. **获取制品构建顺序**
   ```bash
   openspec status --change "<名称>" --json
   ```
   解析 JSON 以获取：
   - `applyRequires`：实现前需要的制品 ID 数组（例如 `["tasks"]`）
   - `artifacts`：所有制品的列表，包含其状态和依赖关系

4. **按顺序创建制品直到准备好应用**

   使用 **TodoWrite 工具** 跟踪制品处理进度。

   按依赖顺序循环处理制品（先处理没有待处理依赖的制品）：

   a. **对于每个 `ready` 状态的制品（依赖已满足）**：
      - 获取指令：
        ```bash
        openspec instructions <制品id> --change "<名称>" --json
        ```
      - 指令 JSON 包括：
        - `context`：项目背景（对你的约束 - 不要包含在输出中）
        - `rules`：制品特定规则（对你的约束 - 不要包含在输出中）
        - `template`：输出文件要使用的结构
        - `instruction`：此制品类型的 schema 特定指导
        - `outputPath`：制品写入位置
        - `dependencies`：需要读取以获取上下文的已完成制品
      - 读取任何已完成的依赖文件以获取上下文
      - 使用 `template` 作为结构创建制品文件
      - 将 `context` 和 `rules` 作为约束应用 - 但不要复制到文件中
      - 显示简要进度："已创建 <制品id>"

   b. **继续直到所有 `applyRequires` 制品完成**
      - 创建每个制品后，重新运行 `openspec status --change "<名称>" --json`
      - 检查 `applyRequires` 中的每个制品 ID 在 artifacts 数组中是否都有 `status: "done"`
      - 当所有 `applyRequires` 制品都完成时停止

   c. **如果制品需要用户输入**（上下文不明确）：
      - 使用 **AskUserQuestion 工具** 进行澄清
      - 然后继续创建

5. **显示最终状态**
   ```bash
   openspec status --change "<名称>"
   ```

**输出**

完成所有制品后，总结：
- 变更名称和位置
- 创建的制品列表及简要描述
- 准备就绪："所有制品已创建！准备实现。"
- 提示："运行 `/opsx:apply` 开始实现。"

**制品创建指南**

- 遵循每个制品类型的 `openspec instructions` 中的 `instruction` 字段
- schema 定义了每个制品应包含的内容 - 遵循它
- 创建新制品前读取依赖制品以获取上下文
- 使用 `template` 作为输出文件的结构 - 填充其各个部分
- **重要**：`context` 和 `rules` 是对你的约束，而非文件内容
  - 不要将 `<context>`、`<rules>`、`<project_context>` 块复制到制品中
  - 这些指导你写什么，但永远不应出现在输出中

**边界规则**
- 创建实现所需的所有制品（由 schema 的 `apply.requires` 定义）
- 创建新制品前始终读取依赖制品
- 如果上下文关键性地不明确，询问用户 - 但更倾向于做出合理决策以保持势头
- 如果该名称的变更已存在，询问用户是继续它还是创建新的
- 写入后验证每个制品文件存在，然后再继续下一个