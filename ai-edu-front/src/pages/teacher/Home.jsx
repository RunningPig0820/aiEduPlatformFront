import { useAuth } from '../../hooks/useAuth'
import StatCard from '../../components/common/StatCard'
import { Users, ClipboardList, CheckCircle, Building, FolderOpen, BarChart3 } from 'lucide-react'

export function TeacherHome() {
  const { user } = useAuth()

  const stats = {
    studentCount: 128,
    pendingGrading: 15,
    gradedCount: 234,
    classCount: 3
  }

  const pendingHomework = [
    { id: 1, studentName: '张三', title: '第三章课后练习', subject: '数学', submitTime: '10分钟前' },
    { id: 2, studentName: '李四', title: '作文：我的理想', subject: '语文', submitTime: '1小时前' },
    { id: 3, studentName: '王五', title: 'Unit 4 练习', subject: '英语', submitTime: '2小时前' }
  ]

  const classList = [
    { id: 1, name: '高三(1)班', avgScore: 85 },
    { id: 2, name: '高三(2)班', avgScore: 78 },
    { id: 3, name: '高三(3)班', avgScore: 82 }
  ]

  // 老师端统一角色色：primary (靛蓝)
  return (
    <div className="page-enter space-y-6">
      <h1 className="text-2xl font-bold">欢迎回来，{user?.realName || '老师'}！</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="学生总数"
          value={stats.studentCount}
          color="primary"
          icon={<Users size={24} strokeWidth={1.5} />}
        />
        <StatCard
          title="待批改"
          value={stats.pendingGrading}
          color="primary"
          icon={<ClipboardList size={24} strokeWidth={1.5} />}
        />
        <StatCard
          title="已批改"
          value={stats.gradedCount}
          color="primary"
          icon={<CheckCircle size={24} strokeWidth={1.5} />}
        />
        <StatCard
          title="班级数"
          value={stats.classCount}
          color="primary"
          icon={<Building size={24} strokeWidth={1.5} />}
        />
      </div>

      {/* 功能模块 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 待批改作业 */}
        <div className="card bg-base-100 rounded-xl shadow-card-elevated border border-base-200">
          <div className="card-body p-5">
            <h2 className="card-title mb-3">
              <FolderOpen size={20} className="text-primary" />
              待批改作业
            </h2>
            <div className="space-y-2">
              {pendingHomework.map(homework => (
                <div
                  key={homework.id}
                  className="flex items-center justify-between p-3 rounded-lg border-l-[3px] border-primary/30 bg-base-200 hover:bg-base-300/50 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium">{homework.studentName} - {homework.title}</p>
                    <p className="text-sm text-base-content/50">{homework.subject} · {homework.submitTime}</p>
                  </div>
                  <button className="btn btn-sm btn-primary btn-ghost text-white hover:scale-95 transition-transform">批改</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 班级学情 */}
        <div className="card bg-base-100 rounded-xl shadow-card-elevated border border-base-200">
          <div className="card-body p-5">
            <h2 className="card-title mb-3">
              <BarChart3 size={20} className="text-primary" />
              班级学情概览
            </h2>
            <div className="space-y-4">
              {classList.map(cls => (
                <div key={cls.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-base-200/50 transition-colors">
                  <span className="font-medium">{cls.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32">
                      <div className="w-full h-2 bg-base-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${cls.avgScore}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-semibold w-12 text-right">{cls.avgScore}分</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherHome
