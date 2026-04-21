import { useState, useCallback, useEffect, useMemo } from 'react'
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
 * 同步状态面板（支持年级统计）
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
 * 年级进度条组件
 */
function GradeProgressBar({ completed, failed, total }) {
  if (!total || total === 0) return null

  const completedPercent = Math.round((completed / total) * 100)
  const failedPercent = Math.round((failed / total) * 100)

  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-base-content/50 mb-1">
        <span>年级进度</span>
        <span>{completed}/{total} 成功</span>
      </div>
      <div className="w-full h-2 bg-base-200 rounded-full overflow-hidden flex">
        <div
          className="h-full bg-success transition-all"
          style={{ width: `${completedPercent}%` }}
        ></div>
        {failed > 0 && (
          <div
            className="h-full bg-error transition-all"
            style={{ width: `${failedPercent}%` }}
          ></div>
        )}
      </div>
      {failed > 0 && (
        <p className="text-xs text-error mt-1">{failed} 个年级同步失败</p>
      )}
    </div>
  )
}

/**
 * 同步记录列表（展示维度信息）
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
            <th>教材版本</th>
            <th>学科</th>
            <th>学段</th>
            <th>年级</th>
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
              <td>{record.edition || '-'}</td>
              <td>{record.subject || '-'}</td>
              <td>{record.stage || '-'}</td>
              <td>{record.grade || '-'}</td>
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
 * 同步记录筛选面板
 */
function SyncRecordsFilter({ filters, setFilters, dimensions }) {
  const { editions, subjects, stages } = dimensions

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      <select
        className="select select-bordered select-xs"
        value={filters.edition || ''}
        onChange={(e) => setFilters(f => ({ ...f, edition: e.target.value || undefined }))}
      >
        <option value="">全部版本</option>
        {editions.map((d) => (
          <option key={d.code} value={d.code}>{d.label}</option>
        ))}
      </select>

      <select
        className="select select-bordered select-xs"
        value={filters.subject || ''}
        onChange={(e) => setFilters(f => ({ ...f, subject: e.target.value || undefined }))}
      >
        <option value="">全部学科</option>
        {subjects.map((d) => (
          <option key={d.code} value={d.code}>{d.label}</option>
        ))}
      </select>

      <select
        className="select select-bordered select-xs"
        value={filters.stage || ''}
        onChange={(e) => setFilters(f => ({ ...f, stage: e.target.value || undefined }))}
      >
        <option value="">全部学段</option>
        {stages.map((d) => (
          <option key={d.code} value={d.code}>{d.label}</option>
        ))}
      </select>
    </div>
  )
}

/**
 * 同步类型选择
 */
const SYNC_TYPES = {
  FULL: { label: '全量同步', value: 'full' },
  TEXTBOOK: { label: '教材同步', value: 'textbook' },
}

/**
 * 手动同步对话框（教材版本→学科→年级联动筛选）
 */
function SyncDialog({ open, onClose, onConfirm, syncing }) {
  // 维度数据
  const [dimensions, setDimensions] = useState({
    editions: [],
    subjects: [],
    stages: [],
  })
  const [loadingOptions, setLoadingOptions] = useState(true)

  // 同步类型选择
  const [syncType, setSyncType] = useState('full')

  // 筛选参数
  const [selectedEdition, setSelectedEdition] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedStage, setSelectedStage] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('')

  // 年级列表（联动加载）
  const [grades, setGrades] = useState([])
  const [loadingGrades, setLoadingGrades] = useState(false)

  // 加载维度数据（教材版本、学科、学段）
  useEffect(() => {
    if (!open) return
    setLoadingOptions(true)
    Promise.all([
      kgApi.getDimensionTextbooks().catch(() => []), // 教材版本维度
      kgApi.getDimensionSubjects().catch(() => []),
      kgApi.getDimensionStages().catch(() => []),
    ]).then(([editions, subjects, stages]) => {
      setDimensions({
        editions: Array.isArray(editions) ? editions : [],
        subjects: Array.isArray(subjects) ? subjects : [],
        stages: Array.isArray(stages) ? stages : [],
      })
      setLoadingOptions(false)
    })
  }, [open])

  // 联动加载年级（需要教材版本和学科）
  useEffect(() => {
    if (!open || !selectedEdition || !selectedSubject) {
      setGrades([])
      setSelectedGrade('')
      return
    }
    setLoadingGrades(true)
    kgApi.getDimensionGrades({ edition: selectedEdition, subject: selectedSubject })
      .then((result) => {
        const gradeList = Array.isArray(result) ? result.map((g) => ({
          label: g.label,
          textbookUri: g.textbookUri,
          value: g.label, // 用 label 作为下拉值
        })) : []
        setGrades(gradeList)
      })
      .catch(() => setGrades([]))
      .finally(() => setLoadingGrades(false))
  }, [open, selectedEdition, selectedSubject])

  // 重置筛选条件
  useEffect(() => {
    if (!open) {
      setSyncType('full')
      setSelectedEdition('')
      setSelectedSubject('')
      setSelectedStage('')
      setSelectedGrade('')
      setGrades([])
    }
  }, [open])

  if (!open) return null

  const handleConfirm = () => {
    const params = {
      edition: selectedEdition || undefined,
      subject: selectedSubject || undefined,
      stage: selectedStage || undefined,
      grade: selectedGrade || undefined,
    }

    if (syncType === 'textbook') {
      // 教材同步只需要 edition 和 subject
      onConfirm({
        type: 'textbook',
        edition: selectedEdition || undefined,
        subject: selectedSubject || undefined,
      })
    } else {
      onConfirm({
        type: 'full',
        ...params,
      })
    }
  }

  // 是否可以获取年级
  const canLoadGrades = selectedEdition && selectedSubject

  return (
    <dialog className={`modal ${open ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="text-lg font-bold mb-4">手动同步知识图谱</h3>

        <div className="flex flex-col gap-3">
          {/* 同步类型选择 */}
          <div className="form-control">
            <label className="label"><span className="label-text">同步类型</span></label>
            <div className="flex gap-2">
              {Object.values(SYNC_TYPES).map((t) => (
                <button
                  key={t.value}
                  className={`btn btn-sm ${syncType === t.value ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setSyncType(t.value)}
                  disabled={syncing}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-base-content/50 mt-1">
              {syncType === 'textbook' ? '仅同步教材基础信息，不同步知识点' : '全量同步知识点及关联关系'}
            </p>
          </div>

          {/* 教材版本下拉（第一位置） */}
          <div className="form-control">
            <label className="label"><span className="label-text">教材版本</span></label>
            {loadingOptions ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <select
                className="select select-bordered select-sm w-full"
                value={selectedEdition}
                onChange={(e) => {
                  setSelectedEdition(e.target.value)
                  setSelectedGrade('') // 版本变化时清空年级
                }}
              >
                <option value="">全部版本</option>
                {dimensions.editions.map((d) => (
                  <option key={d.code} value={d.code}>{d.label}</option>
                ))}
              </select>
            )}
          </div>

          {/* 学科下拉 */}
          <div className="form-control">
            <label className="label"><span className="label-text">学科</span></label>
            {loadingOptions ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <select
                className="select select-bordered select-sm w-full"
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value)
                  setSelectedGrade('') // 学科变化时清空年级
                }}
              >
                <option value="">全部学科</option>
                {dimensions.subjects.map((d) => (
                  <option key={d.code} value={d.code}>{d.label}</option>
                ))}
              </select>
            )}
          </div>

          {/* 学段下拉（全量同步时显示） */}
          {syncType === 'full' && (
            <div className="form-control">
              <label className="label"><span className="label-text">学段（可选）</span></label>
              {loadingOptions ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <select
                  className="select select-bordered select-sm w-full"
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                >
                  <option value="">全部学段</option>
                  {dimensions.stages.map((d) => (
                    <option key={d.code} value={d.code}>{d.label}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* 年级下拉（联动加载，需要先选教材版本和学科） */}
          {syncType === 'full' && (
            <div className="form-control">
              <label className="label"><span className="label-text">年级</span></label>
              {!canLoadGrades ? (
                <p className="text-xs text-base-content/50">请先选择教材版本和学科</p>
              ) : loadingGrades ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <select
                  className="select select-bordered select-sm w-full"
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                >
                  <option value="">全部年级</option>
                  {grades.map((g) => (
                    <option key={g.label} value={g.value}>{g.label}</option>
                  ))}
                </select>
              )}
              {canLoadGrades && grades.length === 0 && !loadingGrades && (
                <p className="text-xs text-warning mt-1">当前筛选条件下无可用年级</p>
              )}
            </div>
          )}
        </div>

        <div className="modal-action">
          <button className="btn btn-sm" onClick={onClose} disabled={syncing}>取消</button>
          <button
            className="btn btn-sm btn-primary"
            onClick={handleConfirm}
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
 * - 显示当前同步状态（支持年级统计进度条）
 * - 查看同步记录列表（展示维度信息）
 * - 同步记录筛选功能
 * - 手动触发全量同步或教材同步
 */
function SyncManager({ triggerOpen }) {
  const [syncStatus, setSyncStatus] = useState(null)
  const [syncResult, setSyncResult] = useState(null) // 同步结果（含年级统计）
  const [syncRecords, setSyncRecords] = useState([])
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [loadingRecords, setLoadingRecords] = useState(true)
  const [syncDialogOpen, setSyncDialogOpen] = useState(false)
  const [syncing, setSyncing] = useState(false)

  // 维度数据（用于筛选）
  const [dimensions, setDimensions] = useState({
    editions: [],
    subjects: [],
    stages: [],
  })

  // 筛选条件
  const [filters, setFilters] = useState({})

  // 加载维度数据
  useEffect(() => {
    Promise.all([
      kgApi.getDimensionTextbooks().catch(() => []),
      kgApi.getDimensionSubjects().catch(() => []),
      kgApi.getDimensionStages().catch(() => []),
    ]).then(([editions, subjects, stages]) => {
      setDimensions({
        editions: Array.isArray(editions) ? editions : [],
        subjects: Array.isArray(subjects) ? subjects : [],
        stages: Array.isArray(stages) ? stages : [],
      })
    })
  }, [])

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

  // 加载同步记录（支持筛选参数）
  const loadSyncRecords = useCallback(async () => {
    setLoadingRecords(true)
    try {
      const result = await kgApi.getSyncRecords({
        ...filters,
        page: 0,
        size: 20,
      })
      setSyncRecords(Array.isArray(result) ? result : [])
    } catch (err) {
      console.error('加载同步记录失败:', err)
    } finally {
      setLoadingRecords(false)
    }
  }, [filters])

  // 初始加载
  useEffect(() => {
    loadSyncStatus()
    loadSyncRecords()
  }, [loadSyncStatus, loadSyncRecords])

  // 筛选变化时重新加载记录
  useEffect(() => {
    loadSyncRecords()
  }, [filters, loadSyncRecords])

  // 监听触发打开同步对话框
  useEffect(() => {
    if (triggerOpen) {
      setSyncDialogOpen(true)
    }
  }, [triggerOpen])

  // 触发手动同步
  const handleSync = useCallback(async (params) => {
    setSyncing(true)
    setSyncResult(null)
    try {
      let result
      if (params.type === 'textbook') {
        // 教材同步
        result = await kgApi.syncTextbooks({
          edition: params.edition,
          subject: params.subject,
        })
      } else {
        // 全量同步
        const filtered = {}
        if (params.edition) filtered.edition = params.edition
        if (params.subject) filtered.subject = params.subject
        if (params.stage) filtered.stage = params.stage
        if (params.grade) filtered.grade = params.grade
        result = await kgApi.syncFull(filtered)
      }

      setSyncResult(result)
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

      {/* 同步结果年级进度 */}
      {syncResult && (
        <div className="bg-base-100 rounded-lg border border-base-300 p-3">
          <h4 className="text-sm font-semibold mb-2">最近同步结果</h4>
          <GradeProgressBar
            completed={syncResult.completedGrades || 0}
            failed={syncResult.failedGrades || 0}
            total={syncResult.totalGrades || 0}
          />
          <div className="grid grid-cols-3 gap-2 text-xs mt-2">
            <div>
              <span className="text-base-content/50">新增</span>
              <p className="font-medium">{syncResult.insertedCount ?? 0}</p>
            </div>
            <div>
              <span className="text-base-content/50">更新</span>
              <p className="font-medium">{syncResult.updatedCount ?? 0}</p>
            </div>
            <div>
              <span className="text-base-content/50">耗时</span>
              <p className="font-medium">{syncResult.duration ? `${syncResult.duration}s` : '-'}</p>
            </div>
          </div>
        </div>
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
        <SyncRecordsFilter
          filters={filters}
          setFilters={setFilters}
          dimensions={dimensions}
        />
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