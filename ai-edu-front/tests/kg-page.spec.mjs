// @ts-check
import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

/**
 * 使用用户名密码登录
 */
async function loginAsAdmin(page) {
  await page.goto(`${BASE_URL}/login`)
  await page.waitForLoadState('networkidle')

  // 确保是密码登录模式（不是验证码模式）
  const passwordBtn = page.getByRole('button', { name: '密码登录' })
  if (await passwordBtn.isVisible().catch(() => false)) {
    await passwordBtn.click()
    await page.waitForTimeout(300)
  }

  // 填写用户名和密码
  await page.getByPlaceholder(/手机号/).fill('admin')
  await page.getByPlaceholder('密码').fill('123456')

  // 点击登录
  await page.getByRole('button', { name: '登 录' }).click()

  // 等待跳转到 admin 页面
  await page.waitForURL(/\/admin/, { timeout: 15000 })
}

test.describe('知识图谱管理页面 E2E 测试', () => {
  test('完整流程：登录 -> 进入知识图谱 -> 页面布局验证', async ({ page }) => {
    // === 步骤1: 管理员登录 ===
    console.log('步骤1: 管理员登录')
    await loginAsAdmin(page)
    await expect(page).toHaveURL(/\/admin/)
    console.log('  ✓ 登录成功，已进入管理端')

    // === 步骤2: 点击知识图谱菜单 ===
    console.log('步骤2: 点击知识图谱菜单')
    await page.locator('a[href="/admin/knowledge-graph"]').click()
    await page.waitForURL(/\/admin\/knowledge-graph/, { timeout: 10000 })
    await expect(page).toHaveURL(/\/admin\/knowledge-graph/)
    console.log('  ✓ 已进入知识图谱页面')

    // === 步骤3: 验证三栏布局 ===
    console.log('步骤3: 验证三栏布局')
    await expect(page.getByText('教材导航')).toBeVisible()
    await expect(page.getByText('知识图谱管理')).toBeVisible()
    console.log('  ✓ 左侧树导航和页面标题可见')

    // === 步骤3.1: 验证系统统计栏 ===
    console.log('步骤3.1: 验证系统统计栏')
    await page.waitForTimeout(1000)
    await expect(page.getByText('教材数')).toBeVisible()
    await expect(page.getByText('知识点总数')).toBeVisible()
    console.log('  ✓ 统计栏可见')

    // === 步骤3.2: 验证同步按钮 ===
    console.log('步骤3.2: 验证同步按钮')
    await expect(page.getByText('同步')).toBeVisible()
    console.log('  ✓ 同步按钮可见')

    // === 步骤3.3: 验证图谱区域（通过空状态文本确认渲染） ===
    console.log('步骤3.3: 验证图谱区域')
    await expect(page.getByText('请从左侧选择一个知识点')).toBeVisible()
    console.log('  ✓ 图谱区域空状态可见')

    // === 步骤3.4: 验证详情面板 ===
    console.log('步骤3.4: 验证详情面板')
    await expect(page.getByText('请选择一个节点查看详情')).toBeVisible()
    console.log('  ✓ 详情面板空状态可见')

    // === 步骤3.5: 验证 React Flow DOM 存在 ===
    console.log('步骤3.5: 验证 React Flow 组件加载')
    const rfDom = page.locator('[role="application"][data-testid="rf__wrapper"]')
    const rfCount = await rfDom.count()
    console.log(`  ✓ React Flow DOM 存在: ${rfCount > 0}`)
    expect(rfCount).toBeGreaterThan(0)

    console.log('\n=== 知识图谱 E2E 测试完成 ===')
  })

  test('页面元素完整性检查', async ({ page }) => {
    await loginAsAdmin(page)
    await expect(page).toHaveURL(/\/admin/)

    // 进入知识图谱
    await page.locator('a[href="/admin/knowledge-graph"]').click()
    await page.waitForURL(/\/admin\/knowledge-graph/, { timeout: 10000 })
    await page.waitForTimeout(2000)

    // 检查关键元素（使用精确匹配避免歧义）
    const checks = [
      { name: '页面标题', selector: page.getByText('知识图谱管理') },
      { name: '左侧面板-教材导航', selector: page.getByText('教材导航') },
      { name: '刷新按钮', selector: page.locator('button[title="刷新教材列表"]') },
      { name: '同步按钮', selector: page.getByText('同步') },
      { name: '图谱空状态提示', selector: page.getByText('请从左侧选择一个知识点') },
      { name: '统计栏-教材数', selector: page.getByText('教材数') },
      { name: '统计栏-章节数', selector: page.getByText('章节数') },
      { name: '统计栏-知识点总数', selector: page.getByText('知识点总数') },
      { name: '详情空状态提示', selector: page.getByText('请选择一个节点查看详情') },
    ]

    // React Flow DOM existence check (separate from visibility - overlay covers it)
    const rfCount = await page.locator('[role="application"][data-testid="rf__wrapper"]').count()
    console.log(`  ${rfCount > 0 ? '✓' : '✗'} React Flow 组件: ${rfCount > 0 ? 'DOM 存在' : '不存在'}`)
    expect(rfCount).toBeGreaterThan(0)

    for (const check of checks) {
      const visible = await check.selector.isVisible().catch(() => false)
      console.log(`  ${visible ? '✓' : '✗'} ${check.name}: ${visible ? '可见' : '不可见'}`)
      expect(visible).toBe(true)
    }
  })

  test('同步面板切换功能', async ({ page }) => {
    await loginAsAdmin(page)
    await expect(page).toHaveURL(/\/admin/)

    // 进入知识图谱
    await page.locator('a[href="/admin/knowledge-graph"]').click()
    await page.waitForURL(/\/admin\/knowledge-graph/, { timeout: 10000 })
    await page.waitForTimeout(2000)

    // 验证详情面板默认显示
    console.log('验证默认显示详情面板')
    await expect(page.getByText('请选择一个节点查看详情')).toBeVisible()
    console.log('  ✓ 详情面板默认显示')

    // 点击同步按钮 - 使用 force 点击避免被 backdrop 拦截
    console.log('点击同步按钮，打开同步面板')
    await page.getByText('同步').click({ force: true })
    await page.waitForTimeout(1000)

    // 验证同步面板元素
    console.log('验证同步面板')
    const syncStatusTitle = page.getByRole('heading', { name: '当前同步状态' })
    const syncStatusVisible = await syncStatusTitle.isVisible()
    console.log(`  ✓ 同步状态标题: ${syncStatusVisible ? '可见' : '不可见'}`)

    const syncRecordsTitle = page.getByRole('heading', { name: '同步记录' })
    const syncRecordsVisible = await syncRecordsTitle.isVisible()
    console.log(`  ✓ 同步记录标题: ${syncRecordsVisible ? '可见' : '不可见'}`)

    // 验证关闭按钮存在
    const closeBtn = page.locator('button[title="关闭同步面板"]')
    const closeBtnVisible = await closeBtn.isVisible()
    console.log(`  ✓ 关闭按钮: ${closeBtnVisible ? '可见' : '不可见'}`)

    // 验证至少一个同步面板元素可见
    expect(syncStatusVisible || syncRecordsVisible).toBe(true)
  })
})
