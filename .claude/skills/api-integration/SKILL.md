---
name: api-integration
description: 添加新的API调用或修改API集成时使用
---

# API 集成规范

确保 API 调用遵循项目规范。

## API 封装位置

所有 API 调用应封装在 `src/js/api.js` 中。

## 添加新 API

```javascript
// src/js/api.js

// 认证相关 API
export const authApi = {
  // 现有方法...
  login: (identifier, password) => request('/auth/login', { ... }),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // 添加新方法
  resetPassword: (email) => request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  })
}

// 新增 API 模块
export const homeworkApi = {
  getList: () => request('/homework/list'),
  submit: (id, answers) => request('/homework/submit', {
    method: 'POST',
    body: JSON.stringify({ homeworkId: id, answers })
  })
}
```

## 在页面中使用

```javascript
import { authApi, homeworkApi } from '/src/js/api.js'

// 在 Alpine 组件中
async handleSubmit() {
  this.loading = true
  try {
    const result = await homeworkApi.submit(this.homeworkId, this.answers)
    if (result.code === '00000') {
      // 成功处理
    } else {
      // 业务错误
      this.showError(result.message)
    }
  } catch (error) {
    // 网络错误
    this.showError('网络错误，请稍后重试')
  } finally {
    this.loading = false
  }
}
```

## 响应格式

后端统一返回格式：

```json
{
  "code": "00000",
  "message": "成功",
  "data": { ... }
}
```

## 错误处理模式

```javascript
async handleApiCall() {
  this.loading = true
  try {
    const result = await someApi.call()
    if (result.code === '00000') {
      // 成功
      this.data = result.data
    } else {
      // 业务逻辑错误
      this.message = { type: 'error', text: result.message }
    }
  } catch (error) {
    // 网络或系统错误
    this.message = { type: 'error', text: '网络错误，请稍后重试' }
  } finally {
    this.loading = false
  }
}
```

## 开发环境代理

Vite 已配置代理，开发时 `/api` 请求自动转发到 `http://localhost:8080`。

## 检查清单

- [ ] 新 API 添加到 `src/js/api.js`
- [ ] 使用统一的 `request` 函数
- [ ] 正确处理 loading 状态
- [ ] 统一错误处理模式
- [ ] 检查响应 code 字段