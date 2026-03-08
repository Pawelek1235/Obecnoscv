import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { AttendMeBackendClient } from '@/backend/AttendMeBackendClient'

type AppUser = {
  id?: number
  userName?: string
  role?: string
}

const api = new AttendMeBackendClient('https://attendme-backend.runasp.net')

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<AppUser | null>(null)
  const ready = ref(false)
  const error = ref('')

  const isLoggedIn = computed(() => !!currentUser.value)

  async function fetchProfile() {
    const profile = await api.userGet(undefined)
    currentUser.value = profile as AppUser
  }

  async function signIn(login: string, password: string) {
    error.value = ''

    try {
      await api.userLogin(login, password)
      await fetchProfile()
      return true
    } catch (e) {
      console.error('Błąd logowania:', e)
      currentUser.value = null
      error.value = 'Nieprawidłowy login lub hasło'
      return false
    }
  }

  async function restoreSession() {
    try {
      await fetchProfile()
    } catch {
      currentUser.value = null
    } finally {
      ready.value = true
    }
  }

  function signOut() {
    currentUser.value = null
  }

  return {
    currentUser,
    ready,
    error,
    isLoggedIn,
    signIn,
    restoreSession,
    signOut,
  }
})
