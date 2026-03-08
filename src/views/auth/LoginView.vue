<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Logowanie</h2>

            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label class="form-label">Login</label>
                <input
                  v-model="loginName"
                  type="text"
                  class="form-control"
                  autocomplete="username"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Hasło</label>
                <input
                  v-model="password"
                  type="password"
                  class="form-control"
                  autocomplete="current-password"
                />
              </div>

              <div v-if="errorMessage" class="alert alert-danger">
                {{ errorMessage }}
              </div>

              <button type="submit" class="btn btn-primary w-100">Zaloguj</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const loginName = ref('')
const password = ref('')
const errorMessage = ref('')

const authStore = useAuthStore()
const router = useRouter()

async function submitForm() {
  errorMessage.value = ''

  const success = await authStore.signIn(loginName.value, password.value)

  if (!success) {
    errorMessage.value = 'Nieprawidłowy login lub hasło.'
    return
  }

  const role = normalizeRole(authStore.currentUser?.role)

  if (role === 'Teacher') {
    await router.push('/teacher')
    return
  }

  if (role === 'Student') {
    await router.push('/student')
    return
  }

  errorMessage.value = 'Nieznana rola użytkownika.'
}
function normalizeRole(role: unknown) {
  const value = String(role ?? '')
    .trim()

    .trim()
    .toLowerCase()

  if (['teacher', 'lecturer', 'wykladowca', 'wykładowca', '1'].includes(value)) {
    return 'Teacher'
  }

  if (['student', 'uczen', 'uczeń', '0'].includes(value)) {
    return 'Student'
  }

  return null
}
</script>
