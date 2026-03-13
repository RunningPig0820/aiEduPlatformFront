# AI教育平台前端

独立的前端项目，支持 SPA 和 SSR 两种模式。

## 技术栈

- **构建工具**: Vite 5
- **CSS**: Tailwind CSS 3 + daisyUI
- **JS框架**: Alpine.js 3
- **开发语言**: 原生 JavaScript

## 目录结构

```
ai-edu-front/
├── index.html              # 首页
├── pages/                  # 页面
│   ├── auth/
│   │   └── login.html      # 登录/注册页
│   ├── student/
│   │   └── home.html       # 学生端首页
│   ├── teacher/
│   │   └── home.html       # 老师端首页
│   └── parent/
│       └── home.html       # 家长端首页
├── src/
│   ├── css/
│   │   └── main.css        # 主样式文件
│   └── js/
│       ├── api.js          # API 封装
│       └── auth.js         # 认证逻辑
├── scripts/
│   └── copy-to-backend.js  # 复制到后端脚本
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

开发模式下，API 请求会自动代理到后端 http://localhost:8080

## 构建

### 构建 SPA 版本

```bash
npm run build
```

构建产物在 `dist/` 目录

### 构建并复制到后端（SSR 模式）

```bash
npm run build:ssr
```

这会将构建产物复制到后端的 `templates` 和 `static` 目录，支持 Thymeleaf SSR 模式。

## 与后端协作

### 开发模式

1. 启动后端服务（端口 8080）
2. 启动前端开发服务器（端口 3000）
3. 前端通过代理访问后端 API

### 生产模式

两种部署方式：

1. **前后端分离部署**
   - 前端独立部署（Nginx 等）
   - 后端只提供 API 服务

2. **SSR 一体部署**
   - 执行 `npm run build:ssr`
   - 前端资源打包到后端
   - 后端提供页面渲染和 API

## API 接口

所有 API 以 `/api` 为前缀：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/auth/login` | POST | 登录 |
| `/api/auth/demo-login` | POST | 演示登录 |
| `/api/auth/register` | POST | 注册 |
| `/api/auth/send-code` | POST | 发送验证码 |
| `/api/auth/logout` | POST | 登出 |
| `/api/auth/current-user` | GET | 获取当前用户 |