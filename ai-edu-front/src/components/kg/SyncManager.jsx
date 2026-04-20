import { useState, useCallback, useEffect } from 'react'
import { kgApi } from '@/api/modules/kg'

/**
 * 状态标签映射
 */
const STATUS_MAP = {
  RUNNING: { label: '同步中', class: 'badge-info' },
  SUCCESS: { label: '成功', class: 'badge-success' },
  FAILED: { label: '失败', class: 'badge-error' },
  PENDING: { label: '等待中', class: 'badge-ghost' },
}

function StatusBadge({ status }) {
  const info = STATUS_MAP[status] || { label: status, class: 'badge-ghost' }
  return <span className={`badge ${info.class} badge-sm`}>{info.label}</span>
}

/**
 * 格式化时间
 */
function formatTime(timeStr) {
  if (!timeStr) return '-'
  return new Date(timeStr).toLocaleString('zh-CN')
}

/**
 * 同步状态面板
 */
function SyncStatusPanel({ status, onRefresh }) {
  if (!status) return null

  return (
    <div className="bg-base-100 rounded-lg border border-base-300 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold">当前同步状态</h4>
        <button className="btn btn-ghost btn-xs" onClick={onRefresh} title="刷新状态">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-base-content/50 text-xs">状态</span>
          <div className="mt-1"><StatusBadge status={status.status} /></div>
        </div>
        <div>
          <span className="text-base-content/50 text-xs">最近同步时间</span>
          <p className="font-medium">{formatTime(status.lastSyncAt)}</p>
        </div>
        <div>
          <span className="text-base-content/50 text-xs">最近同步状态</span>
          <div className="mt-1"><StatusBadge status={status.lastSyncStatus} /></div>
        </div>
        <div>
          <span className="text-base-content/50 text-xs">新增数</span>
          <p className="font-medium">{status.lastInsertedCount ?? '-'}</p>
        </div>
        <div>
          <span className="text-base-content/50 text-xs">更新数</span>
          <p className="font-medium">{status.lastUpdatedCount ?? '-'}</p>
        </div>
        <div>
          <span className="text-base-content/50 text-xs">校对状态</span>
          <p className="font-medium">{status.lastReconciliationStatus || '-'}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * 同步记录列表
 */
function SyncRecordsList({ records, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <span className="loading loading-spinner loading-md text-primary"></span>
      </div>
    )
  }

  if (!records || records.length === 0) {
    return (
      <div className="text-center py-6 text-base-content/50 text-sm">
        暂无同步记录
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-xs table-zebra">
        <thead>
          <tr>
            <th>类型</th>
            <th>范围</th>
            <th>状态</th>
            <th>新增</th>
            <th>更新</th>
            <th>开始时间</th>
            <th>完成时间</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.syncType || '-'}</td>
              <td className="max-w-[120px] truncate" title={record.scope}>{record.scope || '全部'}</td>
              <td><StatusBadge status={record.status} /></td>
              <td>{record.insertedCount ?? 0}</td>
              <td>{record.updatedCount ?? 0}</td>
              <td className="whitespace-nowrap">{formatTime(record.startedAt)}</td>
              <td className="whitespace-nowrap">{formatTime(record.finishedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * 手动同步对话框（教材下拉放在第一位置）
 */
function SyncDialog({ open, onClose, onConfirm, syncing }) {
  const [textbooks, setTextbooks] = useState([])
  const [subjects, setSubjects] = useState([])
  const [grades, setGrades] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)

  const [selectedTextbook, setSelectedTextbook] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('')

  // 加载下拉选项
  useEffect(() => {
    if (!open) return
    setLoadingOptions(true)
    Promise.all([
      kgApi.getTextbooks().catch(() => []),
      kgApi.getSubjects().catch(() => []),
    ]).then(([tbList, subjList]) => {
      setTextbooks(Array.isArray(tbList) ? tbList : [])
      setSubjects(Array.isArray(subjList) ? subjList : [])
      setLoadingOptions(false)
    })
  }, [open])

  if (!open) return null

  return (
    <dialog className={`modal ${open ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="text-lg font-bold mb-4">手动同步知识图谱</h3>

        <div className="flex flex-col gap-3">
          {/* 教材下拉（第一位置） */}
          <div className="form-control">
            <label className="label"><span className="label-text">教材（可选）</span></label>
            {loadingOptions ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <select
                className="select select-bordered select-sm w-full"
                value={selectedTextbook}
                onChange={(e) => setSelectedTextbook(e.target.value)}
              >
                <option value="">全部教材</option>
                {textbooks.map((tb) => (
                  <option key={tb.uri} value={tb.uri}>{tb.label} ({tb.grade} / {tb.subject})</option>
                ))}
              </select>
            )}
          </div>

          {/* 学科下拉 */}
          <div className="form-control">
            <label className="label"><span className="label-text">学科（可选）</span></label>
            {loadingOptions ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <select
                className="select select-bordered select-sm w-full"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">全部学科</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          </div>

          {/* 年级下拉 */}
          <div className="form-control">
            <label className="label"><span className="label-text">年级（可选）</span></label>
            {loadingOptions ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <select
                className="select select-bordered select-sm w-full"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
              >
                <option value="">全部年级</option>
                {grades.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="modal-action">
          <button className="btn btn-sm" onClick={onClose} disabled={syncing}>取消</button>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              onConfirm({
                textbookUri: selectedTextbook || undefined,
                subject: selectedSubject || undefined,
                grade: selectedGrade || undefined,
              })
            }}
            disabled={syncing}
          >
            {syncing ? <span className="loading loading-spinner loading-xs"></span> : null}
            {syncing ? '同步中...' : '开始同步'}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}></form>
    </dialog>
  )
}

/**
 * 知识图谱同步管理组件
 *
 * 功能：
 * - 显示当前同步状态
 * - 查看同步记录列表
 * - 手动触发全量同步（教材/学科/年级下拉筛选）
 * - 同步进行中状态提示
 */
function SyncManager({ triggerOpen }) {
  const [syncStatus, setSyncStatus] = useState(null)
  const [syncRecords, setSyncRecords] = useState([])
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [loadingRecords, setLoadingRecords] = useState(true)
  const [syncDialogOpen, setSyncDialogOpen] = useState(false)
  const [syncing, setSyncing] = useState(false)

  // 加载同步状态
  const loadSyncStatus = useCallback(async () => {
    try {
      const result = await kgApi.getSyncStatus()
      setSyncStatus(result)
    } catch (err) {
      console.error('加载同步状态失败:', err)
    } finally {
      setLoadingStatus(false)
    }
  }, [])

  // 加载同步记录
  const loadSyncRecords = useCallback(async () => {
    try {
      const result = await kgApi.getSyncRecords()
      setSyncRecords(Array.isArray(result) ? result : [])
    } catch (err) {
      console.error('加载同步记录失败:', err)
    } finally {
      setLoadingRecords(false)
    }
  }, [])

  // 初始加载
  useEffect(() => {
    loadSyncStatus()
    loadSyncRecords()
  }, [loadSyncStatus, loadSyncRecords])

  // 监听触发打开同步对话框
  useEffect(() => {
    if (triggerOpen) {
      setSyncDialogOpen(true)
    }
  }, [triggerOpen])

  // 触发手动同步
  const handleSync = useCallback(async (params) => {
    // 过滤空值
    const filtered = {}
    if (params.subject) filtered.subject = params.subject
    if (params.grade) filtered.grade = params.grade
    if (params.textbookUri) filtered.textbookUri = params.textbookUri

    setSyncing(true)
    try {
      const result = await kgApi.syncFull(filtered)
      setSyncDialogOpen(false)
      // 同步成功后刷新状态和记录
      await loadSyncStatus()
      await loadSyncRecords()
      return result
    } catch (err) {
      console.error('同步失败:', err)
      alert(`同步失败: ${err.message}`)
    } finally {
      setSyncing(false)
    }
  }, [loadSyncStatus, loadSyncRecords])

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      {/* 同步状态 */}
      {loadingStatus ? (
        <div className="flex justify-center py-4">
          <span className="loading loading-spinner loading-sm text-primary"></span>
        </div>
      ) : (
        <SyncStatusPanel status={syncStatus} onRefresh={loadSyncStatus} />
      )}

      {/* 手动同步按钮 */}
      <button
        className="btn btn-primary btn-sm"
        onClick={() => setSyncDialogOpen(true)}
        disabled={syncing}
      >
        {syncing ? <span className="loading loading-spinner loading-xs"></span> : null}
        {syncing ? '同步中...' : '手动同步'}
      </button>

      {/* 同步记录 */}
      <div className="flex-1 overflow-auto">
        <h4 className="text-sm font-semibold mb-2">同步记录</h4>
        <SyncRecordsList records={syncRecords} loading={loadingRecords} />
      </div>

      {/* 同步对话框 */}
      <SyncDialog
        open={syncDialogOpen}
        onClose={() => setSyncDialogOpen(false)}
        onConfirm={handleSync}
        syncing={syncing}
      />
    </div>
  )
}

export default SyncManager
