import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
    },
    {
      path: '/student',
      name: 'student',
      component: () => import('@/views/student/StudentDashboard.vue'),
      meta: { requiresAuth: true, role: 'Student' },
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: () => import('@/views/teacher/TeacherDashboard.vue'),
      meta: { requiresAuth: true, role: 'Teacher' },
    },
    {
      path: '/',
      redirect: '/login',
    },
  ],
})
function normalizeRole(role: unknown) {
  const value = String(role ?? '')
    .trim()

    .trim()
    .toLowerCase()

  if (['teacher', 'lecturer', 'wykladowca', 'wykładowca', '1'].includes(value)) {
    return 'Teacher'
  }

  if (['student', 'uczen', 'uczeń', '0'].includes(value)) {
    return 'Student'
  }

  return null
}
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!auth.ready) {
    await auth.restoreSession()
  }

  const user = auth.currentUser
  const role = normalizeRole(auth.currentUser?.role)

  if (to.path === '/login') {
    if (!user) return true
    if (role === 'Teacher') return '/teacher'
    if (role === 'Student') return '/student'
    return true
  }

  if (to.meta.requiresAuth && !user) {
    return '/login'
  }

  if (to.path === '/student') {
    if (role === 'Student') return true
    if (role === 'Teacher') return '/teacher'
    return '/login'
  }

  if (to.path === '/teacher') {
    if (role === 'Teacher') return true
    if (role === 'Student') return '/student'
    return '/login'
  }

  return true
})

export default router
