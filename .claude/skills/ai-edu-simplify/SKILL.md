---
name: ai-edu-simplify
description: 检查代码重用、质量和效率，然后修复发现的问题
---

# 代码简化检查

检查最近修改的代码，确保：

## 检查清单

### 1. 代码重用
- [ ] 是否有重复的代码块可以提取为函数？
- [ ] 是否有相似的Alpine.js组件可以合并？
- [ ] 是否有重复的CSS类组合可以提取为组件或工具类？

### 2. Alpine.js 最佳实践
- [ ] `x-data` 中是否包含过多逻辑？应该抽取到独立函数
- [ ] 是否有未使用的响应式变量？
- [ ] 事件处理是否简洁明了？
- [ ] 是否正确使用 `x-show` vs `x-if`（频繁切换用 `x-show`）

### 3. Tailwind CSS 规范
- [ ] 是否有过长的class列表？考虑使用 `@apply` 或提取组件
- [ ] 是否有硬编码的颜色值？应使用 daisyUI 主题变量
- [ ] 是否遵循移动优先的响应式设计？

### 4. API 调用
- [ ] 是否有重复的 fetch 调用？应使用 `src/js/api.js` 封装
- [ ] 错误处理是否一致？
- [ ] 是否正确处理 loading 状态？

### 5. 性能考量
- [ ] 是否有不必要的DOM操作？
- [ ] 大列表是否考虑虚拟滚动？
- [ ] 图片是否使用懒加载？

## 执行步骤

1. 使用 `git diff` 查看最近修改的代码
2. 逐一检查上述清单
3. 发现问题立即修复
4. 验证修改后功能正常

## 常见简化模式

### Alpine.js 组件抽取

```javascript
// 之前：内联过多逻辑
<div x-data="{
  items: [],
  loading: false,
  async load() { ... },
  async save() { ... },
  validate() { ... }
}">

// 之后：抽取到函数
<script>
function itemsManager() {
  return {
    items: [],
    loading: false,
    async load() { ... },
    async save() { ... },
    validate() { ... }
  }
}
</script>
<div x-data="itemsManager()">
```

### Tailwind 类组合简化

```html
<!-- 之前：重复的类组合 -->
<button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus">
<button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus">

<!-- 之后：使用 daisyUI 按钮 -->
<button class="btn btn-primary">
```

### API 调用封装

```javascript
// 之前：直接使用 fetch
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
})

// 之后：使用封装
import { authApi } from '/src/js/api.js'
const result = await authApi.login(username, password)
```