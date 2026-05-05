import { useState } from 'react'
import { Building, Search, Plus, Filter, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

export function AdminOrganizations() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // 模拟数据 - 实际应从 API 获取
  const organizations = [
    { id: 1, name: '北京市第一中学', type: '公立学校', users: 580, status: 'active', createdAt: '2024-01-15', region: '北京' },
    { id: 2, name: '上海实验小学', type: '公立学校', users: 320, status: 'active', createdAt: '2024-01-18', region: '上海' },
    { id: 3, name: '杭州教育培训中心', type: '培训机构', users: 150, status: 'pending', createdAt: '2024-01-20', region: '杭州' },
    { id: 4, name: '广州第二中学', type: '公立学校', users: 420, status: 'active', createdAt: '2024-01-22', region: '广州' },
    { id: 5, name: '深圳外国语学校', type: '公立学校', users: 380, status: 'active', createdAt: '2024-01-25', region: '深圳' },
    { id: 6, name: '成都树德中学', type: '公立学校', users: 290, status: 'active', createdAt: '2024-02-01', region: '成都' },
    { id: 7, name: '武汉学而思教育', type: '培训机构', users: 180, status: 'pending', createdAt: '2024-02-05', region: '武汉' },
    { id: 8, name: '南京外国语学校', type: '私立学校', users: 260, status: 'active', createdAt: '2024-02-08', region: '南京' },
    { id: 9, name: '重庆巴蜀中学', type: '公立学校', users: 510, status: 'active', createdAt: '2024-02-12', region: '重庆' },
    { id: 10, name: '天津新东方教育', type: '培训机构', users: 95, status: 'pending', createdAt: '2024-02-15', region: '天津' },
    { id: 11, name: '西安交大附中', type: '公立学校', users: 340, status: 'active', createdAt: '2024-02-18', region: '西安' },
    { id: 12, name: '长沙明德中学', type: '私立学校', users: 220, status: 'active', createdAt: '2024-02-22', region: '长沙' },
  ]

  // 筛选 + 分页
  const filtered = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.region.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="page-enter space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">组织管理</h1>
          <p className="text-sm text-base-content/50 mt-1">管理平台所有组织和机构</p>
        </div>
        <button className="btn btn-primary btn-sm gap-2">
          <Plus size={16} />
          创建组织
        </button>
      </div>

      {/* 搜索和筛选栏 */}
      <div className="card bg-base-100 rounded-xl shadow-sm border border-base-200">
        <div className="card-body p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                placeholder="搜索组织名称或地区..."
                className="input input-bordered w-full pl-10 h-10 text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              />
            </div>
            <button className="btn btn-outline btn-sm gap-2">
              <Filter size={14} />
              筛选
            </button>
          </div>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="card bg-base-100 rounded-xl shadow-card-elevated border border-base-200">
        <div className="overflow-x-auto">
          <table className="table">
            {/* 表头 */}
            <thead>
              <tr className="border-b-2 border-base-200">
                <th className="text-base-content/60 font-medium">组织名称</th>
                <th className="text-base-content/60 font-medium">类型</th>
                <th className="text-base-content/60 font-medium">地区</th>
                <th className="text-base-content/60 font-medium">用户数</th>
                <th className="text-base-content/60 font-medium">状态</th>
                <th className="text-base-content/60 font-medium">创建时间</th>
                <th className="text-base-content/60 font-medium text-right">操作</th>
              </tr>
            </thead>
            {/* 表体 */}
            <tbody>
              {paged.map(org => (
                <tr key={org.id} className="hover:bg-base-200/50 border-b border-base-200 last:border-b-0 transition-colors">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <Building size={16} className="text-secondary" />
                      </div>
                      <span className="font-medium">{org.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm">{org.type}</span>
                  </td>
                  <td>
                    <span className="text-sm">{org.region}</span>
                  </td>
                  <td>
                    <span className="font-semibold">{org.users.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className={`badge badge-sm gap-1 ${org.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {org.status === 'active' ? '正常' : '待审核'}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm text-base-content/50">{org.createdAt}</span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="btn btn-ghost btn-xs gap-1" title="查看">
                        <Eye size={14} />
                      </button>
                      <button className="btn btn-ghost btn-xs gap-1" title="编辑">
                        <Edit size={14} />
                      </button>
                      <button className="btn btn-ghost btn-xs text-error gap-1" title="删除">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 空状态 */}
          {paged.length === 0 && (
            <div className="text-center py-12 text-base-content/40">
              <Building size={48} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">暂无数据</p>
              <p className="text-sm">尝试调整搜索条件</p>
            </div>
          )}
        </div>

        {/* 分页 */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-base-200">
            <span className="text-sm text-base-content/50">
              共 {filtered.length} 条记录，第 {currentPage}/{totalPages} 页
            </span>
            <div className="flex items-center gap-2">
              <button
                className="btn btn-sm btn-ghost"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} />
                上一页
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // 智能分页：显示当前页附近的页码
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <button
                    key={pageNum}
                    className={`btn btn-sm ${currentPage === pageNum ? 'btn-secondary' : 'btn-ghost'}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                )
              })}
              <button
                className="btn btn-sm btn-ghost"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                下一页
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrganizations
