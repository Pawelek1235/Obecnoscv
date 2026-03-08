import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'


import LoginView from '@/views/auth/LoginView.vue'
import StudentDashboard from '@/views/student/StudentDashboard.vue'
import StudentSessionDetails from '@/views/student/StudentSessionDetails.vue'
import StudentDeviceAuth from '@/views/student/StudentDeviceAuth.vue'

const routes = [
  { path: '/login', component: LoginView },
  { path: '/student', component: StudentDashboard },
  { path: '/student/session/:id', component: StudentSessionDetails },
  { path: '/device-auth', component: StudentDeviceAuth },
  { path: '/', redirect: '/login' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!auth.user && to.path !== '/login') {
    await auth.loadUser()
  }


  if (!auth.user && to.path !== '/login') {
    return '/login'
  }
})

export default router
