<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Pulpit Studenta</h1>

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
          <th class="border p-2">Termin</th>
          <th class="border p-2">Status</th>
          <th class="border p-2">QR</th>
          <th class="border p-2">Szczegóły</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="session in filteredSessions" :key="session.sessionId" class="hover:bg-gray-100">
          <td class="border p-2">{{ session.subject }}</td>
          <td class="border p-2">{{ session.date }}</td>

          <td class="border p-2 text-center">
            <span :class="session.status === 'Obecny' ? 'text-green-600' : 'text-red-600'">
              {{ session.status }}
            </span>
          </td>

          <td class="border p-2 text-center">
            <div v-if="qrCodes[session.sessionId]" class="flex flex-col items-center">
              <img :src="qrCodes[session.sessionId]" alt="QR" class="w-16 h-16 border" />

              <button @click="qrCodes[session.sessionId] = undefined" class="text-xs text-gray-500">
                Usuń
              </button>
            </div>

            <button
              v-else
              @click="generateQR(session.sessionId)"
              class="px-2 py-1 border rounded bg-blue-50"
            >
              Generuj QR
            </button>
          </td>

          <td class="border p-2 text-center">
            <button
              @click="viewDetails(session.sessionId)"
              class="px-2 py-1 bg-blue-600 text-white rounded"
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
import { ref, computed, reactive, onMounted } from 'vue'
import { useStudentStore } from '@/stores/student'
import type { StudentSession } from '@/stores/student'
import { useRouter } from 'vue-router'

const store = useStudentStore()
const router = useRouter()

const filter = ref('all')
const qrCodes = reactive<Record<number, string | undefined>>({})

onMounted(async () => {
  await store.fetchSessions()
})

const filteredSessions = computed(() => {
  const allSessions = store.sessions
  if (filter.value === 'all') return allSessions

  const today = new Date().toISOString().slice(0, 10)

  if (filter.value === 'today') {
    return allSessions.filter((s: StudentSession) => s.isoDate === today)
  }

  if (filter.value === 'tomorrow') {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const t = tomorrow.toISOString().slice(0, 10)
    return allSessions.filter((s: StudentSession) => s.isoDate === t)
  }

  return allSessions
})

async function generateQR(sessionId: number) {
  const token = await store.generateQRCode()

  qrCodes[sessionId] = token
    ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${token}`
    : undefined
}

function viewDetails(sessionId: number) {
  router.push(`/student/session/${sessionId}`)
}
</script>
