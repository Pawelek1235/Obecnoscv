<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Pulpit Wykładowcy</h1>

    <div class="mb-4">
      <label>Filtruj zajęcia:</label>
      <select v-model="filter" class="border p-1 rounded">
        <option value="all">Wszystkie</option>
        <option value="today">Dziś</option>
        <option value="tomorrow">Jutro</option>
      </select>
    </div>

    <table class="w-full border-collapse border">
      <thead>
        <tr class="bg-gray-200">
          <th class="border p-2">Przedmiot</th>
          <th class="border p-2">Grupa</th>
          <th class="border p-2">Termin</th>
          <th class="border p-2">Lokalizacja</th>
          <th class="border p-2">Akcje</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="session in filteredSessions" :key="session.sessionId" class="hover:bg-gray-100">
          <td class="border p-2">{{ session.subject }}</td>
          <td class="border p-2">{{ session.group }}</td>
          <td class="border p-2">{{ session.date }}</td>
          <td class="border p-2">{{ session.location }}</td>
          <td class="border p-2 text-center">
            <button
              @click="viewDetails(session.sessionId)"
              class="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Szczegóły
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useTeacherStore } from '../../stores/teacher'
import { useRouter } from 'vue-router'

const filter = ref('all')
const store = useTeacherStore()
const router = useRouter()

onMounted(() => {
  store.fetchSessions()
})

interface TeacherSession {
  sessionId: number
  subject: string
  group: string
  date: string
  location: string
}

const filteredSessions = computed(() => {
  const allSessions = store.sessions as TeacherSession[]
  if (filter.value === 'all') return allSessions

  const today = new Date().toISOString().slice(0, 10)
  if (filter.value === 'today') return allSessions.filter((s) => s.date.startsWith(today))

  if (filter.value === 'tomorrow') {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const t = tomorrow.toISOString().slice(0, 10)
    return allSessions.filter((s) => s.date.startsWith(t))
  }

  return allSessions
})

function viewDetails(sessionId: number) {
  router.push(`/teacher/session/${sessionId}`)
}
</script>
