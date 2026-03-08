<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStudentStore } from '@/stores/student'
import type { StudentSession } from '@/stores/student'

const store = useStudentStore()
const route = useRoute()
const sessionId = Number(route.params.id)
const session = ref<StudentSession | null>(null)

// Ten sam interfejs co w sklepie, żeby uniknąć 'any'
interface CourseSessionApi {
  id?: number
  courseName?: string
  dateStart?: Date | string | null
  location?: string
  isPresent?: boolean
}

onMounted(async () => {
  try {
    const sessions = await store.client.courseStudentGroupSessionsGet(sessionId)

    // Rzutujemy na nasz interfejs zamiast na any
    const s = sessions?.[0] as CourseSessionApi | undefined

    if (s) {
      const d = s.dateStart ? new Date(s.dateStart) : new Date()
      session.value = {
        sessionId: s.id ?? 0,
        subject: s.courseName ?? 'Nieznany przedmiot',
        date: d.toLocaleString(),
        isoDate: d.toISOString().slice(0, 10),

        location: 'Brak danych',

        status: s.isPresent ? 'Obecny' : 'Nieobecny',
      }
    } else {
      session.value = null
    }
  } catch (err) {
    console.error('Błąd pobierania sesji', err)
  }
})
</script>
