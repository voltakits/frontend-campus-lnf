<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, googleProvider } from '../firebase'
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'

const router = useRouter()

const activeTab = ref('mahasiswa')
const adminEmail = ref('')
const adminPassword = ref('')
const errorMessage = ref('')
const loading = ref(false)

const loginGoogle = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    const result = await signInWithPopup(auth, googleProvider)
    const email = result.user.email

    // Validasi domain di frontend
    if (!email.endsWith('@global.ac.id')) {
      await auth.signOut()
      throw new Error('Akses ditolak! Gunakan email mahasiswa @global.ac.id')
    }

    // Kirim ke backend
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login-google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // ← PENTING biar cookie auth_token tersimpan
      body: JSON.stringify({ email })
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Login gagal.')

    localStorage.setItem('user', JSON.stringify(data.user))
    router.push('/dashboard-mahasiswa')

  } catch (error) {
    errorMessage.value = error.message
    await auth.signOut()
  } finally {
    loading.value = false
  }
}

const loginAdmin = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    await signInWithEmailAndPassword(auth, adminEmail.value, adminPassword.value)
    router.push('/admin-dashboard')
  } catch (error) {
    errorMessage.value = 'Kredensial Admin salah!'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- Background hitam pekat ala Twitter/X -->
  <div class="min-h-screen bg-black flex flex-col justify-center items-center p-4 font-sans selection:bg-blue-500 selection:text-white">
    <!-- Card transparan dengan border tipis -->
    <div class="w-full max-w-md bg-black rounded-2xl border border-neutral-800 p-8 sm:p-10">

      <!-- Header -->
      <div class="text-center mb-8">
        <!-- Logo/Judul -->
        <h1 class="text-3xl font-bold text-white tracking-tight">Campus Lost & Found</h1>
        <p class="text-sm text-neutral-500 mt-2">Sistem Informasi Pengamanan Barang Hilang</p>
      </div>

      <!-- Custom Tabs -->
      <div class="flex p-1 bg-neutral-900 rounded-xl mb-8">
        <button
          @click="activeTab = 'mahasiswa'; errorMessage = ''"
          :class="activeTab === 'mahasiswa' ? 'bg-black text-white shadow-sm border border-neutral-700' : 'text-neutral-500 hover:text-gray-300'"
          class="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200"
        >Mahasiswa</button>
        <button
          @click="activeTab = 'akademik'; errorMessage = ''"
          :class="activeTab === 'akademik' ? 'bg-black text-white shadow-sm border border-neutral-700' : 'text-neutral-500 hover:text-gray-300'"
          class="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200"
        >Akademik</button>
      </div>

      <!-- Pesan Error -->
      <div v-if="errorMessage" class="mb-6 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded-xl text-center">
        {{ errorMessage }}
      </div>

      <!-- Tampilan Login Mahasiswa -->
      <div v-if="activeTab === 'mahasiswa'" class="text-center space-y-6">
        <p class="text-sm text-neutral-400">Masuk dengan akun Google kampus <strong class="text-white">@global.ac.id</strong> untuk verifikasi identitas.</p>
        
        <!-- Tombol Google High Contrast -->
        <button
          @click="loginGoogle"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-3 bg-white hover:bg-neutral-200 text-black font-bold py-3.5 px-4 rounded-full transition-all duration-200 disabled:opacity-50"
        >
          <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="w-5 h-5">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          <span v-if="loading">Memproses...</span>
          <span v-else>Masuk dengan Google</span>
        </button>
      </div>

      <!-- Tampilan Login Admin -->
      <form v-else @submit.prevent="loginAdmin" class="space-y-5">
        <div>
          <input v-model="adminEmail" type="email" placeholder="Email Admin" class="w-full px-4 py-3.5 bg-black border border-neutral-700 text-white placeholder-neutral-500 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm" required />
        </div>
        <div>
          <input v-model="adminPassword" type="password" placeholder="Password" class="w-full px-4 py-3.5 bg-black border border-neutral-700 text-white placeholder-neutral-500 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm" required />
        </div>
        <button type="submit" :disabled="loading" class="w-full bg-white hover:bg-neutral-200 text-black font-bold py-3.5 rounded-full transition-all duration-200 text-sm mt-2">
          {{ loading ? 'Mengecek...' : 'Masuk Sebagai Admin' }}
        </button>
      </form>

    </div>
  </div>
</template>