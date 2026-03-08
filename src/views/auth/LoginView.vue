<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded shadow w-96">
      <h1 class="text-2xl font-bold mb-6 text-center">AttendMe Login</h1>

      <form @submit.prevent="submit">
        <div class="mb-4">
          <label class="block mb-1">Login</label>
          <input
            v-model="loginName"
            type="text"
            class="w-full border p-2 rounded"
            placeholder="Wpisz login"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block mb-1">Hasło</label>
          <input
            v-model="password"
            type="password"
            class="w-full border p-2 rounded"
            placeholder="Wpisz hasło"
            required
          />
        </div>

        <p v-if="authStore.error" class="text-red-600 mb-4">
          {{ authStore.error }}
        </p>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Logowanie...' : 'Zaloguj' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const loginName = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()

async function submit() {
  const success = await authStore.login(loginName.value, password.value)

  if (success) {
    router.push('/student')
  }
}
</script>
