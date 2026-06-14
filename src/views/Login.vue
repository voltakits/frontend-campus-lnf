<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, googleProvider } from '../firebase'
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'

const router = useRouter()

// State UI
const activeTab = ref('mahasiswa')
const adminEmail = ref('')
const adminPassword = ref('')
const errorMessage = ref('')
const loading = ref(false)

// ---------------------------------------------
// FUNGSI LOGIN GOOGLE (Domain-Based Auth)
// ---------------------------------------------
const loginGoogle = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    // 1. Login via Google
    const result = await signInWithPopup(auth, googleProvider)
    const email = result.user.email

    // 2. Validasi Domain di Frontend (Filter Awal)
    if (!email.endsWith('@global.ac.id')) {
      throw new Error('Akses ditolak! Gunakan email mahasiswa @global.ac.id')
    }

    // 3. Tembak ke Backend untuk registrasi/login
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login-google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Login gagal.')
    
    localStorage.setItem('user', JSON.stringify(data.user))
    router.push('/dashboard-mahasiswa')

  } catch (error) {
    errorMessage.value = error.message
    await auth.signOut() // Logout paksa jika domain salah atau backend error
  } finally {
    loading.value = false
  }
}

// ---------------------------------------------
// FUNGSI ADMIN AKADEMIK
// ---------------------------------------------
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
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
      
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-slate-800">Campus Lost & Found</h1>
        <p class="text-sm text-slate-500 mt-1">Sistem Informasi Pengamanan Barang Hilang</p>
      </div>

      <div class="flex p-1 bg-slate-100 rounded-xl mb-6">
        <button 
          @click="activeTab = 'mahasiswa'; errorMessage = ''"
          :class="activeTab === 'mahasiswa' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'"
          class="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all"
        >Mahasiswa</button>
        <button 
          @click="activeTab = 'akademik'; errorMessage = ''"
          :class="activeTab === 'akademik' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'"
          class="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all"
        >Akademik</button>
      </div>

      <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
        {{ errorMessage }}
      </div>

      <div v-if="activeTab === 'mahasiswa'" class="text-center space-y-6">
        <p class="text-sm text-slate-600">Masuk dengan akun Google kampus (@global.ac.id) untuk verifikasi identitas.</p>
        <button 
          @click="loginGoogle"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 border border-slate-200 rounded-xl shadow-sm transition-all disabled:opacity-50"
        >
          <span v-if="loading">Memproses...</span>
          <span v-else>Masuk dengan Google</span>
        </button>
      </div>

      <form v-else @submit.prevent="loginAdmin" class="space-y-4">
        <input v-model="adminEmail" type="email" placeholder="Email Admin" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" required />
        <input v-model="adminPassword" type="password" placeholder="Password" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" required />
        <button type="submit" :disabled="loading" class="w-full bg-slate-800 text-white font-medium py-2.5 rounded-xl text-sm">
          {{ loading ? 'Mengecek...' : 'Masuk Sebagai Admin' }}
        </button>
      </form>

    </div>
  </div>
</template>