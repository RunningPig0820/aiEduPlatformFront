import { Link } from 'react-router-dom'
import { BookOpen, GraduationCap, Users, Sparkles, Shield, Zap, ArrowRight } from 'lucide-react'

export function Home() {
  const features = [
    {
      icon: BookOpen,
      title: '学生端',
      desc: '智能错题本、知识图谱、个性化学习路径推荐',
      color: 'from-primary to-primary/70',
      textColor: 'text-primary',
      ringColor: 'ring-primary/20',
      link: '/login',
      linkLabel: '体验学生端'
    },
    {
      icon: GraduationCap,
      title: '老师端',
      desc: '智能批改、作业管理、学情分析、班级管理',
      color: 'from-secondary to-secondary/70',
      textColor: 'text-secondary',
      ringColor: 'ring-secondary/20',
      link: '/login',
      linkLabel: '体验老师端'
    },
    {
      icon: Users,
      title: '家长端',
      desc: '学习报告、家校沟通、成长记录、学情追踪',
      color: 'from-warning to-warning/70',
      textColor: 'text-warning',
      ringColor: 'ring-warning/20',
      link: '/login',
      linkLabel: '体验家长端'
    }
  ]

  return (
    <main className="flex-1">
      {/* ===== Hero 区域 ===== */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #0D9488 100%)' }}>
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          {/* AI 标签 */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-8 animate-fadeIn">
            <Sparkles size={16} className="text-yellow-300" />
            AI 驱动的智能教育平台
          </div>

          {/* 标题 */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-fadeIn leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">AI</span>
            <span className="ml-2">教育平台</span>
          </h1>

          {/* 副标题 */}
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-fadeIn leading-relaxed">
            智能学习，精准提升。为<span className="text-white font-medium">老师</span>、
            <span className="text-white font-medium">学生</span>、
            <span className="text-white font-medium">家长</span>提供全方位的教育服务。
          </p>

          {/* CTA 按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn">
            <Link
              to="/login"
              className="btn btn-warning btn-lg gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              立即体验 <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              className="btn btn-outline btn-lg text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50 transition-all"
            >
              了解更多
            </a>
          </div>

          {/* 特性亮点 */}
          <div className="flex flex-wrap justify-center gap-6 mt-14 text-sm text-white/70 animate-fadeIn">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-yellow-300" />
              <span>智能推荐</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-green-300" />
              <span>数据安全</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-300" />
              <span>AI 赋能</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 功能特性 ===== */}
      <section id="features" className="py-20 bg-base-200/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">平台功能</h2>
            <p className="text-base-content/60 max-w-lg mx-auto">多角色全覆盖，打造完整教育生态闭环</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item, index) => (
              <div
                key={item.title}
                className="group card bg-base-100 rounded-xl shadow-card-elevated hover:shadow-card-hover border border-base-200 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="card-body items-center text-center p-8">
                  {/* 图标容器 */}
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} ${item.textColor} flex items-center justify-center ring-4 ${item.ringColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon size={28} strokeWidth={1.5} />
                  </div>

                  <h3 className="card-title text-xl mb-2">{item.title}</h3>
                  <p className="text-base-content/60 mb-6 text-sm leading-relaxed">{item.desc}</p>

                  <Link
                    to={item.link}
                    className="btn btn-ghost btn-sm gap-1 group-hover:gap-2 transition-all"
                  >
                    {item.linkLabel} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer
        className="py-12 text-white"
        style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #0D9488 100%)' }}
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* 品牌 */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-3">
                <span className="text-yellow-300">AI</span> 教育平台
              </h3>
              <p className="text-white/70 text-sm leading-relaxed max-w-sm">
                以 AI 技术为核心，为教育行业提供智能化解决方案。让每一位学生都能享受个性化学习，让每一位老师都能高效教学。
              </p>
            </div>

            {/* 快速链接 */}
            <div>
              <h4 className="font-semibold mb-4 text-white/90">快速链接</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/login" className="text-white/70 hover:text-white transition-colors">学生端</Link></li>
                <li><Link to="/login" className="text-white/70 hover:text-white transition-colors">教师端</Link></li>
                <li><Link to="/login" className="text-white/70 hover:text-white transition-colors">家长端</Link></li>
                <li><a href="#features" className="text-white/70 hover:text-white transition-colors">平台功能</a></li>
              </ul>
            </div>

            {/* 联系方式 */}
            <div>
              <h4 className="font-semibold mb-4 text-white/90">联系我们</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li>邮箱: contact@ai-edu.com</li>
                <li>电话: 400-888-8888</li>
                <li>地址: 北京市海淀区</li>
              </ul>
            </div>
          </div>

          {/* 版权 */}
          <div className="border-t border-white/20 pt-6 text-center text-sm text-white/50">
            <p>&copy; {new Date().getFullYear()} AI 教育平台. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default Home
