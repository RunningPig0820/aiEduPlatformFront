---
name: openspec-propose
description: 一步提出新变更并生成所有制品。当用户想要快速描述他们想要构建的内容，并获得包含设计、规格和任务的完整提案以便实现时使用。
license: MIT
compatibility: 需要 openspec CLI。
metadata:
  author: openspec
  version: "1.0"
  generatedBy: "1.2.0"
---

提出新变更 - 创建变更并在一步中生成所有制品。

我将创建一个变更，包含以下制品：
- proposal.md（做什么和为什么）
- design.md（怎么做）
- tasks.md（实现步骤）

准备好实现时，运行 /opsx:apply

---

**输入**：用户的请求应包含一个变更名称（kebab-case 格式）或者描述他们想要构建什么。

**步骤**

1. **如果没有提供清晰的输入，询问他们想要构建什么**

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

6. **同步制品到语雀（语雀知识库）**

   所有制品（design.md、api.md、tasks.md）创建完成后，将这三个文件同步到语雀。

   a. **确定目标语雀知识库**
      - 如果上下文中不知道目标 repo_id，使用 **AskUserQuestion** 询问：
        > "同步到哪个语雀知识库？"
      - 记录 repo_id 用于后续元数据写入

   b. **确定目标产品目录**
      - 根据变更名称/描述推断属于哪个产品（如 `knowledge-graph-ui` → 知识图谱页面化）
      - 目标位置：`产品中心 → <产品目录> → <change-name>/`
      - **如果不确定，使用 AskUserQuestion 询问**：
        > "这个变更属于哪个产品目录？"
        选项：知识图谱页面化、AI答疑、AI作业批改、学生知识点分析、教师知识点分析、RAG智能客服、组织中心、权限中心、英语知识图谱、AI听力、llm对接、其他(请输入)
      - 记录选中的产品目录名称及其 UUID

   c. **在语雀创建目录结构**
      ```
      mcp__yuque-mcp__yuque_update_toc
      action: appendNode, action_mode: child, target_uuid: <产品目录uuid>, type: TITLE, title: <change-name>
      ```
      记录返回的目录 UUID（change_dir_uuid）

   d. **创建/更新三个文档**
      对每个文件（api.md、design.md、tasks.md）：
      - 读取本地文件内容
      - 通过 `mcp__yuque-mcp__yuque_create_doc` 创建文档，format: markdown
      - 将文档添加到目录 TOC：
        ```
        mcp__yuque-mcp__yuque_update_toc
        action: appendNode, action_mode: child, target_uuid: <change目录uuid>, type: DOC, doc_id: <刚创建的doc_id>
        ```
      - 记录每个文件对应的 doc_id

   e. **在 design.md 和 tasks.md 中写入语雀元数据**
      在两个文件末尾追加 yuque-meta 注释，使得 `opsx:apply` 步骤能定位到语雀文档：
      ```markdown
      <!-- yuque-meta: {"repo_id": "{{repo_id}}", "product_dir": "知识图谱页面化", "product_uuid": "<uuid>", "change_dir_uuid": "<uuid>", "tasks_doc_id": <id>, "design_doc_id": <id>, "api_doc_id": <id>} -->
      ```
      如果不知道 repo_id，在同步前使用 **AskUserQuestion** 询问目标知识库。

   f. **验证同步**
      - 确认三个文档均已创建并在 TOC 中可见
      - 向用户报告语雀文档链接

**输出**

完成所有制品和语雀同步后，总结：
- 变更名称和位置
- 创建的制品列表及简要描述
- 语雀同步状态："已同步到语雀智启学堂: <产品目录>/<change-name>/"
- 准备就绪："所有制品已创建！准备实现。"
- 提示："运行 `/opsx:apply` 或让我实现以开始处理任务。"

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