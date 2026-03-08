import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/student',
      name: 'student',
      component: () => import('@/views/student/StudentDashboard.vue'),
      meta: { role: 'student' },
    },
    {
      path: '/student/session/:id',
      name: 'student-session',
      component: () => import('@/views/student/StudentSessionDetails.vue'),
      meta: { role: 'student' },
    },
    {
      path: '/device-auth',
      name: 'device-auth',
      component: () => import('@/views/student/StudentDeviceAuth.vue'),
      meta: { public: true },
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: () => import('@/views/teacher/TeacherDashboard.vue'),
      meta: { role: 'teacher' },
    },
    {
      path: '/teacher/session/:id',
      name: 'teacher-session',
      component: () => import('@/views/teacher/TeacherSessionDetails.vue'),
      meta: { role: 'teacher' },
    },
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!auth.initialized) {
    await auth.loginFromStorage()
  }

  if (to.meta.public) {
    if (to.path === '/login' && auth.user) {
      if (auth.user.isTeacher) return '/teacher'
      if (auth.user.isStudent) return '/student'
    }
    return true
  }

  if (!auth.user) {
    return '/login'
  }

  if (to.meta.role === 'teacher' && !auth.user.isTeacher) {
    return auth.user.isStudent ? '/student' : '/login'
  }

  if (to.meta.role === 'student' && !auth.user.isStudent) {
    return auth.user.isTeacher ? '/teacher' : '/login'
  }

  return true
})

export default router
