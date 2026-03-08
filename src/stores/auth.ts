import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AttendMeBackendClient } from '@/backend/AttendMeBackendClient'

interface UserInfo {
  id?: number
  userName?: string
  role?: string
}

export const useAuthStore = defineStore('auth', () => {
  const client = new AttendMeBackendClient('https://attendme-backend.runasp.net')

  const user = ref<UserInfo | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function login(loginName: string, password: string) {
    loading.value = true
    error.value = null

    try {
      await client.userLogin(loginName, password)

      await loadUser()
      return true
    } catch (err) {
      console.error('Błąd logowania:', err)
      error.value = 'Nieprawidłowy login lub hasło'
      return false
    } finally {
      loading.value = false
    }
  }

  async function loadUser() {
    try {
      const userData = await client.userGet(undefined)
      user.value = userData as UserInfo
    } catch {
      user.value = null
    }
  }

  function logout() {
    sessionStorage.clear()
    localStorage.clear()
    user.value = null
  }

  return {
    client,
    user,
    loading,
    error,
    login,
    loadUser,
    logout,
  }
})
