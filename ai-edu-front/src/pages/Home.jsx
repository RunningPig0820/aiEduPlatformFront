import { Link } from 'react-router-dom'

export function Home() {
  return (
    <main className="flex-1 container mx-auto p-6">
      {/* Hero 区域 */}
      <div
        className="hero min-h-[60vh]"
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold text-white">
              <span className="text-yellow-300">AI</span> 教育平台
            </h1>
            <p className="mb-5 text-white/90">
              智能学习，精准提升。为老师、学生、家长提供全方位的教育服务。
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/login" className="btn btn-warning btn-lg">立即体验</Link>
              <a href="#features" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-gray-800">了解更多</a>
            </div>
          </div>
        </div>
      </div>

      {/* 功能特性 */}
      <div id="features" className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">平台功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 学生端 */}
          <div className="card bg-base-100 shadow-xl">
            <figure className="px-10 pt-10">
              <div className="text-6xl">📚</div>
            </figure>
            <div className="card-body items-center text-center">
              <h3 className="card-title">学生端</h3>
              <p>智能错题本、知识图谱、个性化学习路径推荐</p>
              <div className="card-actions">
                <Link to="/login" className="btn btn-success btn-sm">体验学生端</Link>
              </div>
            </div>
          </div>

          {/* 老师端 */}
          <div className="card bg-base-100 shadow-xl">
            <figure className="px-10 pt-10">
              <div className="text-6xl">👨‍🏫</div>
            </figure>
            <div className="card-body items-center text-center">
              <h3 className="card-title">老师端</h3>
              <p>智能批改、作业管理、学情分析、班级管理</p>
              <div className="card-actions">
                <Link to="/login" className="btn btn-primary btn-sm">体验老师端</Link>
              </div>
            </div>
          </div>

          {/* 家长端 */}
          <div className="card bg-base-100 shadow-xl">
            <figure className="px-10 pt-10">
              <div className="text-6xl">👨‍👩‍👧</div>
            </figure>
            <div className="card-body items-center text-center">
              <h3 className="card-title">家长端</h3>
              <p>学习报告、家校沟通、成长记录、学情追踪</p>
              <div className="card-actions">
                <Link to="/login" className="btn btn-warning btn-sm">体验家长端</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home