import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AttendMeBackendClient } from '@/backend/AttendMeBackendClient'

export interface StudentSession {
  sessionId: number
  subject: string
  date: string
  isoDate: string
  location: string
  status: 'Obecny' | 'Nieobecny'
}

// Definiujemy interfejs odpowiadający temu, co faktycznie przesyła backend
interface CourseSessionApi {
  id?: number
  courseName?: string
  dateStart?: Date | string | null
  location?: string // Dodajemy to pole tutaj, by TS go nie blokował
  isPresent?: boolean
}

export const useStudentStore = defineStore('student', () => {
  const sessions = ref<StudentSession[]>([])
  const deviceAuthorized = ref(false)
  const client = new AttendMeBackendClient('https://attendme-backend.runasp.net/')

  async function fetchSessions() {
    try {
      const result = await client.courseStudentSessionsGet({ pageNumber: 1, pageSize: 999 })

      // Rzutujemy na nasz interfejs zamiast na "any", co uciszy ESLint
      const items = (result.items ?? []) as CourseSessionApi[]

      sessions.value = items.map((s): StudentSession => {
        const d = s.dateStart ? new Date(s.dateStart) : new Date()
        return {
          sessionId: s.id ?? 0,
          subject: s.courseName ?? 'Nieznany przedmiot',
          date: d.toLocaleString(),
          isoDate: d.toISOString().slice(0, 10),
          location: s.location ?? 'Brak danych',
          status: s.isPresent ? 'Obecny' : 'Nieobecny',
        }
      })
    } catch (err) {
      console.error('Błąd pobierania sesji:', err)
    }
  }

  async function generateQRCode() {
    try {
      const tokenResult = await client.userAttendanceTicketGet()
      return tokenResult?.token ?? null
    } catch (err) {
      console.error('Błąd generowania QR:', err)
      return null
    }
  }

  async function authorizeDevice(tokenFromLink: string) {
    try {
      const deviceData = {
        deviceName: 'Telefon studenta',
        description: 'Urządzenie mobilne',
      }

      await client.userDeviceRegisterWithToken(
        tokenFromLink,
        deviceData as unknown as Parameters<typeof client.userDeviceRegisterWithToken>[1],
      )

      deviceAuthorized.value = true
    } catch (err) {
      console.error('Błąd rejestracji urządzenia:', err)
      throw err
    }
  }

  return {
    sessions,
    deviceAuthorized,
    fetchSessions,
    generateQRCode,
    authorizeDevice,
    client,
  }
})
