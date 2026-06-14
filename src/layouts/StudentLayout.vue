<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { studentData, fetchMyNotifications } from '../studentStore.js' 

const router = useRouter()
const route = useRoute()

const activeTab = ref('untuk-anda')
// STATE BARU: Buat ngatur saklar di sidebar kanan (riwayat / notifikasi)
const rightTab = ref('riwayat') 

const user = ref(JSON.parse(localStorage.getItem('user')) || { name: 'Mahasiswa', email: '' }) 

const handleLogout = async () => {
    try {
        // Nembak API backend buat ngancurin cookie 'auth_token'
        await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, { 
            method: 'POST',
            credentials: 'include' // Wajib ada biar cookie dikirim dan dihapus
        });
    } catch (error) {
        console.error('Gagal logout:', error);
    }

    // Bersihin data user dari local storage
    localStorage.removeItem('user');
   
    window.location.href = '/'; 
};

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Biar setiap layout ini dimuat (termasuk pas refresh), riwayat selalu ditarik
const fetchMyReports = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/lost-reports/my-reports', {
      credentials: 'include' 
    })
    const data = await res.json()
    if (data.status === 'success') {
      studentData.myReports = data.data 
    }
  } catch (error) {
    console.error('Gagal mengambil laporan saya:', error)
  }
}

// Jalankan saat layout pertama kali dirender
onMounted(() => {
  fetchMyReports()
  fetchMyNotifications()
})

watch(() => route.path, () => {
  activeTab.value = 'untuk-anda'
})
</script>

<template>
  <div class="min-h-screen bg-black text-white font-sans relative flex w-full">
            
    <header class="hidden sm:flex w-[80px] xl:w-[275px] flex-col justify-start h-screen sticky top-0 pt-4 pb-6 px-2 xl:px-4 border-r border-gray-800 shrink-0 overflow-y-auto">
      <div class="space-y-6"> 
        <div class="py-2 px-3 inline-block hover:bg-gray-900 rounded-full cursor-pointer transition">
          <router-link to="/dashboard-mahasiswa" class="flex items-center gap-2">
            <h1 class="hidden xl:block text-xl font-bold tracking-wide">Campus<span class="text-blue-500">L&F</span></h1>
            <h1 class="xl:hidden text-xl font-bold text-blue-500">C</h1>
          </router-link>
        </div>
        
        <nav class="space-y-4 mt-2 font-bold text-gray-200">
          <router-link to="/dashboard-mahasiswa" class="flex items-center xl:space-x-4 px-3 py-3 hover:bg-gray-900 rounded-full transition w-fit text-[22px]">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span class="hidden xl:inline">Beranda</span>
          </router-link>
        </nav>
        
        <router-link to="/lapor-barang" class="w-12 h-12 xl:w-11/12 bg-white hover:bg-gray-200 text-black font-bold xl:py-3.5 rounded-full mt-6 transition shadow-md flex items-center justify-center text-[18px]">
          <svg class="w-6 h-6 xl:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          <span class="hidden xl:inline">Lapor Barang</span>
        </router-link>

        <div class="pt-6 mt-4 border-t border-gray-800 w-full xl:w-11/12">
          <button @click="handleLogout" class="w-full flex items-center p-2 hover:bg-gray-900 rounded-2xl transition text-left border border-transparent hover:border-gray-800/50">
            <div class="w-10 h-10 shrink-0 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-white">
              {{ user.name.charAt(0).toUpperCase() }}
            </div>
            <div class="ml-3 hidden xl:block overflow-hidden flex-1">
              <p class="text-sm font-bold truncate text-white">{{ user.name }}</p>
              <p class="text-[11px] font-medium text-gray-500 truncate">Keluar Akun</p>
            </div>
            <svg class="w-5 h-5 ml-auto hidden xl:block text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </div>
      </div>
    </header>

    <main class="w-full max-w-[600px] min-h-screen pb-16 sm:pb-0 border-r border-gray-800 flex flex-col shrink-0">
      <div class="sm:hidden border-b border-gray-800 px-4 py-3 flex justify-between items-center sticky top-0 bg-black/90 backdrop-blur z-40">
        <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center font-bold text-sm text-white">
          {{ user.name.charAt(0).toUpperCase() }}
        </div>
        <h1 class="text-lg font-bold tracking-wide">Campus<span class="text-blue-500">L&F</span></h1>
        <div class="w-8"></div>
      </div>

      <div class="lg:hidden border-b border-gray-800 flex sticky top-[57px] sm:top-0 bg-black/90 backdrop-blur z-30">
        <button @click="activeTab = 'untuk-anda'" class="flex-1 flex justify-center items-center h-14 relative text-sm font-bold transition hover:bg-gray-900" :class="activeTab === 'untuk-anda' ? 'text-white' : 'text-gray-500'">
          <div class="h-full flex items-center relative">
            Informasi 
            <div v-if="activeTab === 'untuk-anda'" class="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full"></div>
          </div>
        </button>
        <button @click="activeTab = 'riwayat'" class="flex-1 flex justify-center items-center h-14 relative text-sm font-bold transition hover:bg-gray-900" :class="activeTab === 'riwayat' ? 'text-white' : 'text-gray-500'">
          <div class="h-full flex items-center relative">
            Riwayat Laporan
            <div v-if="activeTab === 'riwayat'" class="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full"></div>
          </div>
        </button>
      </div>
      
      <div v-show="activeTab === 'untuk-anda'" class="flex-1">
        <slot />
      </div>

      <div v-show="activeTab === 'riwayat'" class="lg:hidden flex-1 p-4 bg-black">
        <div class="bg-[#16181c] rounded-2xl pt-5 border border-gray-800 overflow-hidden">
          <h3 class="font-extrabold text-xl mb-2 px-5 text-white">Riwayat Laporan</h3>
          <div v-if="studentData.myReports && studentData.myReports.length > 0">
            <div v-for="report in studentData.myReports" :key="'mobile-'+report.id" class="p-4 hover:bg-white/5 transition border-b border-gray-800/50 flex gap-4 items-start" :class="{'opacity-70': report.status?.toLowerCase() === 'selesai'}">
              
              <img v-if="report.image_url" :src="report.image_url" class="w-20 h-20 rounded-lg object-cover border border-gray-700 bg-gray-900 shrink-0" />
              <div v-else class="w-20 h-20 rounded-lg border border-gray-700 bg-gray-900 shrink-0 flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start gap-2 mb-1">
                  <h4 class="font-bold text-white text-[15px] leading-tight truncate" :class="{'line-through text-gray-500': report.status?.toLowerCase() === 'selesai'}">{{ report.title }}</h4>
                  <span class="text-[9px] font-bold px-2 py-1 rounded-md border uppercase tracking-wider text-center shrink-0"
                        :class="{
                          'bg-yellow-900/30 text-yellow-500 border-yellow-900/50': report.status === 'Menunggu Verifikasi',
                          'bg-blue-900/30 text-blue-500 border-blue-900/50': report.status === 'Dicari',
                          'bg-emerald-900/30 text-emerald-500 border-emerald-900/50': report.status === 'Siap Diambil',
                          'bg-[#1e293b] text-slate-400 border-slate-700': report.status?.toLowerCase() === 'selesai'
                        }">
                    {{ report.status }}
                  </span>
                </div>
                
                <p class="text-[11px] text-gray-500 mb-2">{{ formatDate(report.created_at) }}</p>

                <div class="text-[12px] text-gray-400 space-y-1">
                  <p class="truncate"><span class="text-gray-500 font-medium">Kategori:</span> {{ report.category }}</p>
                  <p class="truncate"><span class="text-gray-500 font-medium">Lokasi:</span> {{ report.location }}</p>
                  <p class="line-clamp-2"><span class="text-gray-500 font-medium">Ciri-ciri:</span> {{ report.description || '-' }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="p-8 text-center text-sm text-gray-500">Belum ada riwayat laporan.</div>
        </div>
      </div>
    </main>

    <!-- SIDEBAR KANAN (DESKTOP) -->
    <aside class="hidden lg:block flex-1 h-screen sticky top-0 pt-2 pl-6 pr-6 overflow-y-auto">
      <div class="w-full">
        
        <!-- BAGIAN HEADER KANAN: TOMBOL SAKLAR TEKS -->
        <div class="flex justify-end mt-2 mb-4">
            <button @click="rightTab = rightTab === 'riwayat' ? 'notifikasi' : 'riwayat'"
                    class="bg-[#16181c] border border-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-xl transition shadow-lg text-sm font-bold">
                {{ rightTab === 'riwayat' ? 'Lihat Notifikasi' : 'Kembali ke Riwayat' }}
            </button>
        </div>

        <div class="bg-[#16181c] rounded-2xl pt-5 border border-gray-800 overflow-hidden w-full">
          
          <!-- KONTEN 1: RIWAYAT LAPORAN -->
          <div v-if="rightTab === 'riwayat'">
            <h3 class="font-extrabold text-xl mb-4 px-5 text-white">Riwayat Laporan</h3>
            
            <div v-if="studentData.myReports && studentData.myReports.length > 0">
              <div v-for="report in studentData.myReports" :key="'desktop-'+report.id" class="p-4 mx-4 mb-4 bg-black/40 border border-gray-800 rounded-xl flex gap-4 items-start transition hover:border-gray-700" :class="{'opacity-70': report.status?.toLowerCase() === 'selesai'}">
                
                <img v-if="report.image_url" :src="report.image_url" class="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border border-gray-700 bg-gray-900 shrink-0" />
                <div v-else class="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border border-gray-700 bg-gray-900 shrink-0 flex items-center justify-center">
                  <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start gap-2 mb-1">
                    <h4 class="font-bold text-white text-[15px] truncate" :class="{'line-through text-gray-500': report.status?.toLowerCase() === 'selesai'}">{{ report.title }}</h4>
                    <span class="text-[10px] font-bold px-2 py-1 rounded-md border uppercase tracking-wider text-center shrink-0"
                          :class="{
                            'bg-yellow-900/30 text-yellow-500 border-yellow-900/50': report.status === 'Menunggu Verifikasi',
                            'bg-blue-900/30 text-blue-500 border-blue-900/50': report.status === 'Dicari',
                            'bg-emerald-900/30 text-emerald-500 border-emerald-900/50': report.status === 'Siap Diambil',
                            'bg-[#1e293b] text-slate-400 border-slate-700': report.status?.toLowerCase() === 'selesai'
                          }">
                      {{ report.status }}
                    </span>
                  </div>
                  
                  <p class="text-[11px] text-gray-500 mb-2">{{ formatDate(report.created_at) }}</p>

                  <div class="text-[12px] text-gray-400 space-y-1">
                    <p class="truncate"><strong class="text-gray-500 font-medium">Kategori:</strong> {{ report.category }}</p>
                    <p class="truncate"><strong class="text-gray-500 font-medium">Lokasi:</strong> {{ report.location }}</p>
                    <p class="line-clamp-2"><strong class="text-gray-500 font-medium">Ciri-ciri:</strong> {{ report.description || '-' }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="p-8 text-center text-sm text-gray-500 border-t border-gray-800/50 mt-4">Belum ada riwayat laporan.[cite: 6]</div>
          </div>

          <!-- KONTEN 2: NOTIFIKASI -->
          <div v-else>
             <h3 class="font-extrabold text-xl mb-4 px-5 text-white">Notifikasi</h3>
             
             <div v-if="studentData.notifications && studentData.notifications.length > 0" class="px-4 pb-4 space-y-3 mt-1">
                 <div v-for="notif in studentData.notifications" :key="notif.id" class="bg-black/40 p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition">
                     <div class="flex items-center gap-2 mb-2">
                        <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        <p class="text-[10px] font-bold text-gray-500 uppercase">{{ formatDate(notif.created_at) }}</p>
                     </div>
                     <h4 class="font-bold text-white text-[14px] mb-1">{{ notif.title }}</h4>
                     <p class="text-[13px] text-gray-400 leading-relaxed">{{ notif.message }}</p>
                 </div>
             </div>
             <div v-else class="p-8 text-center text-sm text-gray-500 border-t border-gray-800/50 mt-4">
                 Belum ada notifikasi yang tersimpan.
             </div>
          </div>

        </div>
      </div>
    </aside>

    <nav class="sm:hidden fixed bottom-0 w-full bg-black border-t border-gray-800 flex justify-around items-center h-14 z-50">
      <router-link to="/dashboard-mahasiswa" class="flex flex-col items-center justify-center w-full h-full space-y-1 text-white">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        <span class="text-[10px] font-bold">Beranda</span>
      </router-link>
      
      <router-link to="/lapor-barang" class="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 hover:text-white transition">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        <span class="text-[10px] font-bold">Lapor</span>
      </router-link>
      
      <button @click="handleLogout" class="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 hover:text-red-500 transition">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        <span class="text-[10px] font-bold">Keluar</span>
      </button>
    </nav>

  </div>
</template>