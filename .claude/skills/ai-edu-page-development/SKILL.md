---
name: ai-edu-page-development
description: 新建或修改页面时使用，确保遵循项目架构规范
---

# 页面开发流程

新建或修改HTML页面时遵循此流程。

## 页面结构模板

```html
<!DOCTYPE html>
<html lang="zh-CN" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>页面标题 - AI教育平台</title>
  <!-- CDN 依赖（开发模式） -->
  <link href="https://cdn.jsdelivr.net/npm/daisyui@4.4.19/dist/full.min.css" rel="stylesheet" type="text/css" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
  <!-- 自定义样式 -->
  <link rel="stylesheet" href="/src/css/main.css">
</head>
<body class="bg-base-100" x-data="pageComponent()">
  <!-- 页面内容 -->
</body>
</html>
```

## 角色页面放置位置

| 角色 | 目录 | 示例 |
|------|------|------|
| 学生 | `pages/student/` | `pages/student/homework.html` |
| 老师 | `pages/teacher/` | `pages/teacher/class-manage.html` |
| 家长 | `pages/parent/` | `pages/parent/report.html` |
| 认证 | `pages/auth/` | `pages/auth/login.html` |
| 公共 | 根目录 | `index.html` |

## Alpine.js 组件模式

```javascript
function pageComponent() {
  return {
    // 状态
    loading: false,
    data: [],

    // 初始化
    init() {
      this.loadData()
    },

    // 方法
    async loadData() {
      this.loading = true
      try {
        // API 调用
      } finally {
        this.loading = false
      }
    }
  }
}
```

## 检查清单

- [ ] 页面放置在正确的角色目录
- [ ] 使用正确的 CDN 链接
- [ ] 引用 `/src/css/main.css`
- [ ] `x-data` 组件命名清晰
- [ ] 复用现有侧边栏/导航组件结构
- [ ] API 调用使用 `src/js/api.js` 封装

## 需要注册到 vite.config.js

新建页面后，需要在 `vite.config.js` 中添加入口：

```javascript
rollupOptions: {
  input: {
    // ... 现有入口
    newPage: resolve(__dirname, 'pages/role/new-page.html'),
  }
}
```