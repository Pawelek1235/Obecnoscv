<template>
  <div class="p-6">
    <button class="mb-4 text-blue-600 underline" @click="$router.back()">← Powrót</button>

    <h1 class="text-2xl font-bold mb-4">Szczegóły zajęć: {{ session?.subject }}</h1>

    <div v-if="session" class="mb-6 p-4 bg-gray-50 rounded border">
      <p><strong>Grupa:</strong> {{ session.group }}</p>
      <p><strong>Termin:</strong> {{ session.date }}</p>
      <p><strong>Lokalizacja:</strong> {{ session.location }}</p>
    </div>

    <h2 class="text-xl font-semibold mb-2">Lista studentów</h2>

    <table class="w-full border-collapse border bg-white">
      <thead>
        <tr class="bg-gray-200">
          <th class="border p-2">Imię i nazwisko</th>
          <th class="border p-2">Status (kliknij, aby zmienić)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in studentList" :key="student.id" class="hover:bg-gray-50">
          <td class="border p-2">{{ student.name }}</td>
          <td class="border p-2 text-center">
            <button
              @click="toggleStudentAttendance(student.id)"
              :class="
                student.present
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'bg-red-100 text-red-800 border-red-300'
              "
              class="px-4 py-1 rounded-full font-semibold border transition-colors duration-200"
            >
              {{ student.present ? 'Obecny' : 'Nieobecny' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="studentList.length === 0" class="mt-4 text-gray-500 italic">
      Brak zapisanych logów obecności dla tej sesji.
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { useTeacherStore } from '../../stores/teacher'

const store = useTeacherStore()
const route = useRoute()
const sessionId = Number(route.params.id)

const session = computed(() => store.sessions.find((s) => s.sessionId === sessionId))

const studentList = ref(
  session.value?.attendanceLogs?.map((a) => ({
    id: a.attenderUserId,
    name: `Student #${a.attenderUserId}`,
    present: a.wasUserPresent,
  })) || [],
)

watch(
  session,
  (newSession) => {
    studentList.value =
      newSession?.attendanceLogs?.map((a) => ({
        id: a.attenderUserId,
        name: `Student #${a.attenderUserId}`,
        present: a.wasUserPresent,
      })) || []
  },
  { immediate: true },
)

function toggleStudentAttendance(studentId: number) {
  const student = studentList.value.find((s) => s.id === studentId)
  if (!student) return

  student.present = !student.present
  store.toggleAttendance(studentId, sessionId, student.present)
}
</script>
