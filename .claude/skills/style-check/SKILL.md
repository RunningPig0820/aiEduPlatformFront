---
name: style-check
description: 检查样式代码是否符合 Tailwind + daisyUI 规范
---

# 样式规范检查

确保代码遵循 Tailwind CSS 和 daisyUI 最佳实践。

## 核心原则

1. **优先使用 daisyUI 组件** - 不要重新发明轮子
2. **使用主题变量** - 避免硬编码颜色
3. **移动优先** - 默认样式针对移动端，使用断点扩展

## daisyUI 组件优先

```html
<!-- 好：使用 daisyUI 组件 -->
<button class="btn btn-primary">提交</button>
<div class="card bg-base-100 shadow-xl">...</div>
<input class="input input-bordered" />

<!-- 坏：手动实现 -->
<button class="px-4 py-2 bg-blue-500 text-white rounded">提交</button>
```

## 主题颜色变量

| 用途 | 类名 | 说明 |
|------|------|------|
| 主色 | `text-primary`, `bg-primary` | 品牌主色 |
| 次色 | `text-secondary`, `bg-secondary` | 辅助色 |
| 成功 | `text-success`, `bg-success` | 成功状态 |
| 警告 | `text-warning`, `bg-warning` | 警告状态 |
| 错误 | `text-error`, `bg-error` | 错误状态 |
| 背景 | `bg-base-100`, `bg-base-200` | 页面背景 |

## 响应式断点

```html
<!-- 移动优先，逐步增强 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- 手机1列，平板2列，桌面3列 -->
</div>
```

## 禁止事项

- ❌ 内联 `style` 属性（除非动态计算）
- ❌ 硬编码颜色值（如 `text-blue-500`）
- ❌ 自定义 CSS 文件中重复 Tailwind 功能
- ❌ 过度嵌套的 class 组合

## 自定义样式位置

仅当 Tailwind/daisyUI 无法满足时，在 `src/css/main.css` 添加：

```css
/* 页面特定样式 */
.auth-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 复杂动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```