import { Navigate } from 'react-router-dom'
import {
  Home as HomeIcon,
  ClipboardList,
  BookX,
  BarChart3,
  MessageCircleQuestion,
  FileText,
  Video,
  PlayCircle,
  Users,
  Lightbulb,
  CheckCircle,
  UserPlus,
  User,
  MapPin,
  MessageSquare,
  Building,
  Shield,
  Network,
} from 'lucide-react'
import MainLayout from './components/layout/MainLayout'
import AuthLayout from './components/layout/AuthLayout'
import DashboardLayout from './components/layout/DashboardLayout'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute, { GuestRoute } from './components/common/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import NotFound from './pages/NotFound'
import StudentHome from './pages/student/Home'
import TeacherHome from './pages/teacher/Home'
import ParentHome from './pages/parent/Home'
import AdminHome from './pages/admin/Home'
import AdminOrganizations from './pages/admin/Organizations'
import KnowledgeGraphPage from './pages/kg/KnowledgeGraphPage'
import { ROUTES, ROLES } from './constants'

const iconSize = 20
const iconStroke = 1.5

// Student sidebar menu
const studentMenu = [
  { path: ROUTES.STUDENT, label: '首页', status: 'active', icon: <HomeIcon size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.STUDENT_HOMEWORK, label: '我的作业', status: 'pending', icon: <ClipboardList size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.STUDENT_ERRORS, label: '错题本', status: 'pending', icon: <BookX size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.STUDENT_REPORT, label: '学习报告', status: 'pending', icon: <BarChart3 size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.STUDENT_PRACTICE, label: '智能练习', status: 'pending', icon: <MessageCircleQuestion size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.STUDENT_PAPERS, label: '试卷中心', status: 'pending', icon: <FileText size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.STUDENT_AI_QA, label: 'AI答疑', status: 'pending', icon: <MessageCircleQuestion size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.STUDENT_LIVE, label: '直播课', status: 'pending', icon: <Video size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.STUDENT_VIDEO, label: '录播课', status: 'pending', icon: <PlayCircle size={iconSize} strokeWidth={iconStroke} /> },
]

// Teacher sidebar menu
const teacherMenu = [
  { path: ROUTES.TEACHER, label: '首页', status: 'active', icon: <HomeIcon size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.TEACHER_CLASSES, label: '班级管理', status: 'pending', icon: <Users size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.TEACHER_HOMEWORK, label: '作业管理', status: 'pending', icon: <ClipboardList size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.TEACHER_AI_PREPARE, label: 'AI备课', status: 'pending', icon: <Lightbulb size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.TEACHER_AI_PAPER, label: 'AI组卷', status: 'pending', icon: <FileText size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.TEACHER_AI_GRADE, label: 'AI批改', status: 'pending', icon: <CheckCircle size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.TEACHER_ANALYSIS, label: '学情分析', status: 'pending', icon: <BarChart3 size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.TEACHER_LIVE, label: '直播课', status: 'pending', icon: <Video size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.TEACHER_VIDEO, label: '录播课', status: 'pending', icon: <PlayCircle size={iconSize} strokeWidth={iconStroke} /> },
]

// Parent sidebar menu
const parentMenu = [
  { path: ROUTES.PARENT, label: '首页', status: 'active', icon: <HomeIcon size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.PARENT_CHILDREN, label: '孩子管理', status: 'pending', icon: <UserPlus size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.PARENT_PROFILE, label: '学生画像', status: 'pending', icon: <User size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.PARENT_PICKUP, label: '学生接送', status: 'pending', icon: <MapPin size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.PARENT_REPORT, label: '学习报告', status: 'pending', icon: <BarChart3 size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.PARENT_MESSAGES, label: '家校沟通', status: 'pending', icon: <MessageSquare size={iconSize} strokeWidth={iconStroke} /> },
]

// Admin sidebar menu
const adminMenu = [
  { path: ROUTES.ADMIN, label: '首页', status: 'active', icon: <HomeIcon size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.ADMIN_ORGANIZATIONS, label: '组织管理', status: 'active', icon: <Building size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.ADMIN_USERS, label: '用户管理', status: 'active', icon: <Users size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.ADMIN_PERMISSIONS, label: '权限管理', status: 'active', icon: <Shield size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.ADMIN_ORDERS, label: '订单管理', status: 'pending', icon: <ClipboardList size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.ADMIN_DASHBOARD, label: '数据看板', status: 'pending', icon: <BarChart3 size={iconSize} strokeWidth={iconStroke} /> },
  { path: ROUTES.ADMIN_KNOWLEDGE_GRAPH, label: '知识图谱', status: 'active', icon: <Network size={iconSize} strokeWidth={iconStroke} /> },
]

export const routes = [
  // 公开路由 - MainLayout
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: '404', element: <NotFound /> }
    ]
  },

  // 认证路由 - AuthLayout（仅未登录可访问）
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: (
          <GuestRoute>
            <Login />
          </GuestRoute>
        )
      }
    ]
  },

  // 学生端路由 - 需要登录且角色为 STUDENT
  {
    path: ROUTES.STUDENT,
    element: (
      <ProtectedRoute roles={[ROLES.STUDENT]}>
        <DashboardLayout menuItems={studentMenu} title="学生端" roleColor="success" />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <StudentHome /> }
    ]
  },

  // 老师端路由 - 需要登录且角色为 TEACHER
  {
    path: ROUTES.TEACHER,
    element: (
      <ProtectedRoute roles={[ROLES.TEACHER]}>
        <DashboardLayout menuItems={teacherMenu} title="老师端" roleColor="primary" />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <TeacherHome /> }
    ]
  },

  // 家长端路由 - 需要登录且角色为 PARENT
  {
    path: ROUTES.PARENT,
    element: (
      <ProtectedRoute roles={[ROLES.PARENT]}>
        <DashboardLayout menuItems={parentMenu} title="家长端" roleColor="warning" />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ParentHome /> }
    ]
  },

  // 管理员端路由 - 需要登录且角色为 ADMIN
  {
    path: ROUTES.ADMIN,
    element: (
      <ProtectedRoute roles={[ROLES.ADMIN]}>
        <AdminLayout menuItems={adminMenu} title="管理员端" pageCode="ADMIN_HOME" />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminHome /> },
      { path: 'organizations', element: <AdminOrganizations /> },
      { path: 'knowledge-graph', element: <KnowledgeGraphPage /> }
    ]
  },

  // 404 - 未匹配路由
  {
    path: '*',
    element: <Navigate to={ROUTES.NOT_FOUND} replace />
  }
]
