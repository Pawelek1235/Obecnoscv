import { defineStore } from 'pinia'
import { AttendMeBackendClient } from '@/backend/AttendMeBackendClient'

interface CourseSession {
  id?: number
  name?: string
  date?: string
  [key: string]: unknown
}

export const useTeacherStore = defineStore('teacher', {
  state: () => ({
    sessions: [] as CourseSession[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchSessions() {
      const client = new AttendMeBackendClient('https://attendme-backend.runasp.net')

      this.loading = true
      this.error = null

      try {
        // Tu uciszamy ESLinta tylko dla tej jednej linii, bo musimy "oszukać" klienta API
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await (client as any).courseSessionsAll(1, 9999)

        console.log('Odpowiedź z serwera:', res)

        if (Array.isArray(res)) {
          this.sessions = res as CourseSession[]
        } else if (res && res.items) {
          this.sessions = res.items as CourseSession[]
        } else {
          this.sessions = []
        }
      } catch (err) {
        console.error('Błąd pobierania sesji:', err)
        this.error = 'Nie udało się pobrać listy zajęć'
      } finally {
        this.loading = false
      }
    },
  },
})
