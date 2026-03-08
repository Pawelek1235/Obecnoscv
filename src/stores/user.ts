import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(sessionStorage.getItem('jwtToken'))

  const user = ref<{ id: string; name: string; role: 'Teacher' | 'Student' } | null>(null)

  function setToken(newToken: string) {
    token.value = newToken
    sessionStorage.setItem('jwtToken', newToken)
  }

  function clearToken() {
    token.value = null
    sessionStorage.removeItem('jwtToken')
  }

  function setUser(data: typeof user.value) {
    user.value = data
  }

  function logout() {
    clearToken()
    user.value = null
  }

  return { token, user, setToken, clearToken, setUser, logout }
})
