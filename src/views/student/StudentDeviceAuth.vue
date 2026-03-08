<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded shadow w-96 text-center border-t-4 border-blue-500">
      <h1 class="text-2xl font-bold mb-4">Autoryzacja urządzenia</h1>

      <p class="mb-6 text-gray-600">System AttendMe musi powiązać Twoje konto z tym urządzeniem.</p>

      <button
        @click="authorize"
        :disabled="isRegistering"
        class="w-full bg-blue-500 text-white px-4 py-2 rounded"
      >
        {{ isRegistering ? 'Rejestrowanie...' : 'Zarejestruj urządzenie' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStudentStore } from '@/stores/student'

const store = useStudentStore()
const router = useRouter()
const route = useRoute()

const isRegistering = ref(false)

async function authorize() {
  isRegistering.value = true

  try {
    const tokenFromLink = route.query.token as string

    if (!tokenFromLink) throw new Error('Brak tokenu')

    await store.authorizeDevice(tokenFromLink)

    router.push('/student')
  } catch (err) {
    console.error(err)
  } finally {
    isRegistering.value = false
  }
}
</script>
