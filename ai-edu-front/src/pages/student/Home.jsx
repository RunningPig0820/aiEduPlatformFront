import { useAuth } from '../../hooks/useAuth'
import StatCard from '../../components/common/StatCard'

export function StudentHome() {
  const { user } = useAuth()

  // Mock data - in real app, this would come from API
  const stats = {
    completedHomework: 12,
    errorCount: 5,
    masteryPoints: 28,
    studyHours: 36
  }

  const pendingHomework = [
    { id: 1, title: '第三章课后练习', subject: '数学', deadline: '2024-03-15' },
    { id: 2, title: '作文：我的理想', subject: '语文', deadline: '2024-03-16' },
    { id: 3, title: 'Unit 4 单词默写', subject: '英语', deadline: '2024-03-17' }
  ]

  const recentErrors = [
    { id: 1, question: '一元二次方程求解', knowledgePoint: '数学 · 代数' },
    { id: 2, question: '现在完成时用法', knowledgePoint: '英语 · 语法' }
  ]

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">欢迎回来，{user?.realName || '同学'}！</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="已完成作业"
          value={stats.completedHomework}
          color="primary"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          }
        />
        <StatCard
          title="错题数"
          value={stats.errorCount}
          color="warning"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          }
        />
        <StatCard
          title="知识点掌握"
          value={stats.masteryPoints}
          color="success"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          }
        />
        <StatCard
          title="学习时长"
          value={`${stats.studyHours}h`}
          color="info"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          }
        />
      </div>

      {/* 功能模块 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 待完成作业 */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              待完成作业
            </h2>
            <div className="space-y-2">
              {pendingHomework.map(homework => (
                <div key={homework.id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div>
                    <p className="font-medium">{homework.title}</p>
                    <p className="text-sm text-gray-500">{homework.subject} · 截止: {homework.deadline}</p>
                  </div>
                  <button className="btn btn-sm btn-primary">去完成</button>
                </div>
              ))}
              {pendingHomework.length === 0 && (
                <div className="text-center text-gray-400 py-4">
                  暂无待完成作业
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 智能错题本 */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              智能错题本
            </h2>
            <div className="space-y-2">
              {recentErrors.map(error => (
                <div key={error.id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div>
                    <p className="font-medium">{error.question}</p>
                    <p className="text-sm text-gray-500">{error.knowledgePoint}</p>
                  </div>
                  <button className="btn btn-sm btn-warning">巩固</button>
                </div>
              ))}
            </div>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-outline btn-sm">查看全部错题</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default StudentHome