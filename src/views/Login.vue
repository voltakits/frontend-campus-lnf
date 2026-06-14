<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, googleProvider } from '../firebase'
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'

const router = useRouter()

// State Tabs
const activeTab = ref('mahasiswa')

// State Mahasiswa (2FA Flow: Google -> OTP)
const step = ref(1) // 1: Tombol Google, 2: Input OTP
const emailMahasiswa = ref('')
const otpCode = ref('')

// State Admin Akademik
const adminEmail = ref('')
const adminPassword = ref('')

// State UI Global
const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)

// ---------------------------------------------
// FUNGSI MAHASISWA STEP 1: LOGIN GOOGLE & REQUEST OTP
// ---------------------------------------------
const loginGoogleAndRequestOTP = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    // 1. Munculkan pop-up Google
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    emailMahasiswa.value = user.email

    // 2. Tembak API Express untuk kirim OTP ke email tersebut
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailMahasiswa.value })
    })
    
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Gagal mengirim OTP ke email Google')
    
    // 3. Pindah ke layar input OTP
    successMessage.value = `Login Google berhasil. OTP dikirim ke ${emailMahasiswa.value}`
    step.value = 2 

    // Sign out dari Firebase UI karena kita pakai custom JWT dari Express
    await auth.signOut() 

  } catch (error) {
    errorMessage.value = error.message || 'Gagal terhubung dengan Google.'
  } finally {
    loading.value = false
  }
}

// ---------------------------------------------
// FUNGSI MAHASISWA STEP 2: VERIFIKASI OTP
// ---------------------------------------------
const verifyOTP = async () => {
  errorMessage.value = ''
  if (!otpCode.value || otpCode.value.length !== 6) {
    errorMessage.value = 'Masukkan 6 digit kode OTP dengan benar!'
    return
  }

  loading.value = true
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // <--- PENTING: Wajib ada biar browser nerima set-cookie dari backend
      body: JSON.stringify({ email: emailMahasiswa.value, otpCode: otpCode.value })
    })
    
    const data = await res.json()
    
    if (!res.ok) throw new Error(data.error || 'OTP Salah!')
    
    // Cuma simpan data user, token sudah di-handle oleh cookie
    localStorage.setItem('user', JSON.stringify(data.user))
    
    successMessage.value = 'Verifikasi sukses! Mengalihkan ke dashboard...'
    
    setTimeout(() => router.push('/dashboard-mahasiswa'), 1000)
    
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}

// ---------------------------------------------
// FUNGSI ADMIN AKADEMIK: LOGIN FIREBASE (ATAU EXPRESS)
// ---------------------------------------------
const loginAdmin = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  if (!adminEmail.value || !adminPassword.value) {
    errorMessage.value = 'Email dan password admin wajib diisi!'
    return
  }

  loading.value = true
  try {
    const result = await signInWithEmailAndPassword(auth, adminEmail.value, adminPassword.value)
    console.log('Admin masuk:', result.user.email)
    
    successMessage.value = 'Login Admin sukses!'
     setTimeout(() => router.push('/admin-dashboard'), 1000)
    
  } catch (error) {
    errorMessage.value = 'Kredensial Admin salah atau tidak terdaftar!'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 selection:bg-blue-500 selection:text-white">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 transition-all">
      
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-slate-800 tracking-tight">Campus Lost & Found</h1>
        <p class="text-sm text-slate-500 mt-1">Sistem Informasi Pengamanan Barang Hilang</p>
      </div>

      <div class="flex p-1 bg-slate-100 rounded-xl mb-6">
        <button 
          @click="activeTab = 'mahasiswa'; errorMessage = ''; successMessage = ''; step = 1; otpCode = ''"
          :class="activeTab === 'mahasiswa' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
          class="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer text-center"
        >
          Mahasiswa
        </button>
        <button 
          @click="activeTab = 'akademik'; errorMessage = ''; successMessage = ''"
          :class="activeTab === 'akademik' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
          class="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer text-center"
        >
          Akademik
        </button>
      </div>

      <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded-r-lg">
        {{ successMessage }}
      </div>

      <div v-if="activeTab === 'mahasiswa'" class="space-y-4">
        
        <div v-if="step === 1" class="text-center space-y-6">
          <p class="text-sm text-slate-600">
            Masuk dengan akun Google kampus untuk verifikasi identitas, dilanjutkan dengan kode keamanan OTP.
          </p>
          <button 
            @click="loginGoogleAndRequestOTP"
            :disabled="loading"
            class="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 border border-slate-200 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.96 1 12 1 7.35 1 3.41 3.66 1.49 7.56l3.77 2.92c.88-2.64 3.38-4.44 6.74-4.44z"/>
              <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.57l3.77 2.92c2.2-2.03 3.48-5.02 3.48-8.64z"/>
              <path fill="#FBBC05" d="M5.26 14.76c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28L1.49 7.28C.54 9.12 0 11.19 0 13.33s.54 4.21 1.49 6.05l3.77-2.92z"/>
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.77-2.92c-1.1.74-2.52 1.18-4.19 1.18-3.36 0-5.86-1.8-6.74-4.44L1.49 16.78C3.41 20.68 7.35 23 12 23z"/>
            </svg>
            <span v-if="loading">Menghubungkan...</span>
            <span v-else>Masuk dengan Google</span>
          </button>
        </div>

        <div v-if="step === 2" class="space-y-4 text-center">
          <p class="text-sm text-slate-600">
            Kode 6-digit telah dikirim ke email <strong>{{ emailMahasiswa }}</strong>
          </p>
          <div>
            <input 
              v-model="otpCode"
              type="text" 
              maxlength="6"
              placeholder="••••••"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-center text-2xl tracking-[0.5em] font-mono"
            />
          </div>
          <div class="flex gap-2">
            <button 
              @click="step = 1; successMessage = ''"
              :disabled="loading"
              class="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50 text-sm"
            >
              Batal
            </button>
            <button 
              @click="verifyOTP"
              :disabled="loading"
              class="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50 text-sm"
            >
              <span v-if="loading">Memverifikasi...</span>
              <span v-else>Verifikasi & Masuk</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'akademik'">
        <form @submit.prevent="loginAdmin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Email Admin</label>
            <input 
              v-model="adminEmail"
              type="email" 
              placeholder="admin@kampus.ac.id"
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              v-model="adminPassword"
              type="password" 
              placeholder="••••••••"
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>

          <button 
            type="submit"
            :disabled="loading"
            class="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2.5 px-4 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50 text-sm mt-2"
          >
            <span v-if="loading">Mengecek Otentikasi...</span>
            <span v-else>Masuk Sebagai Admin</span>
          </button>
        </form>
      </div>

    </div>
  </div>
</template>