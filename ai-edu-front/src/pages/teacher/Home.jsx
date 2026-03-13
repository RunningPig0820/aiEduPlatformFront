import { useAuth } from '../../hooks/useAuth'
import StatCard from '../../components/common/StatCard'

export function TeacherHome() {
  const { user } = useAuth()

  // Mock data
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

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">欢迎回来，{user?.realName || '老师'}！</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="学生总数"
          value={stats.studentCount}
          color="primary"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          }
        />
        <StatCard
          title="待批改"
          value={stats.pendingGrading}
          color="secondary"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          }
        />
        <StatCard
          title="已批改"
          value={stats.gradedCount}
          color="success"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          }
        />
        <StatCard
          title="班级数"
          value={stats.classCount}
          color="info"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          }
        />
      </div>

      {/* 功能模块 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 待批改作业 */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              待批改作业
            </h2>
            <div className="space-y-2">
              {pendingHomework.map(homework => (
                <div key={homework.id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div>
                    <p className="font-medium">{homework.studentName} - {homework.title}</p>
                    <p className="text-sm text-gray-500">{homework.subject} · {homework.submitTime}</p>
                  </div>
                  <button className="btn btn-sm btn-primary">批改</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 班级学情 */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              班级学情概览
            </h2>
            <div className="space-y-4">
              {classList.map(cls => (
                <div key={cls.id} className="flex items-center justify-between">
                  <span>{cls.name}</span>
                  <div className="flex items-center gap-2">
                    <progress className="progress progress-primary w-32" value={cls.avgScore} max="100"></progress>
                    <span className="text-sm">{cls.avgScore}分</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TeacherHome