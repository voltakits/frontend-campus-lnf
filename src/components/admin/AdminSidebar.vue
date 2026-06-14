<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
// Tangkap state dari Layout
const isSidebarOpen = inject('isSidebarOpen')

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/')
}
</script>

<template>
  <aside 
    :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    class="fixed lg:static top-0 left-0 z-50 bg-[#050505] w-[260px] flex flex-col justify-between py-6 px-4 h-full border-r border-gray-800 shrink-0 transition-transform duration-300 ease-in-out"
  >
    <div class="space-y-6">
      <!-- Header Sidebar Mobile (Ada tombol Close) -->
      <div class="flex items-center justify-between px-2 mb-8">
        <button class="text-white hover:text-gray-400 transition cursor-pointer">
          <svg viewBox="0 0 24 24" class="h-6 w-6 fill-current"><path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path></svg>
        </button>
        <button @click="isSidebarOpen = false" class="lg:hidden text-gray-500 hover:text-white cursor-pointer">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <nav class="space-y-2">
        <router-link to="/admin-dashboard" class="flex items-center gap-4 px-3 py-2 w-full text-white font-semibold cursor-pointer hover:bg-gray-900 rounded-lg transition" active-class="bg-[#121212] border border-gray-800 text-white" exact-active-class="bg-[#121212] border border-gray-800 text-white">
          <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.099l-9 6.843v10.957h5v-6h8v6h5v-10.957l-9-6.843z"></path></svg>
          <span>Beranda</span>
        </router-link>
        
        <router-link to="/admin-dashboard/input-temuan" class="flex items-center gap-4 px-3 py-2 w-full text-gray-400 hover:text-white hover:bg-gray-900 rounded-lg transition cursor-pointer font-medium" active-class="bg-[#121212] border border-gray-800 text-white" exact-active-class="bg-[#121212] border border-gray-800 text-white">
          <svg class="h-6 w-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          <span>Input Temuan</span>
        </router-link>
        
        <button class="flex items-center gap-4 px-3 py-2 w-full text-gray-400 hover:text-white transition cursor-pointer font-medium">
          <svg class="h-6 w-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>Verifikasi</span>
        </button>
        <button class="flex items-center gap-4 px-3 py-2 w-full text-gray-400 hover:text-white transition cursor-pointer font-medium">
          <svg class="h-6 w-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>Riwayat</span>
        </button>
      </nav>
    </div>

    <div @click="handleLogout" class="flex items-center gap-3 p-3 mt-auto bg-[#0a0a0a] border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors cursor-pointer">
      <div class="h-10 w-10 bg-blue-700 rounded-full flex items-center justify-center font-bold text-white shrink-0">A</div>
      <div class="overflow-hidden">
        <p class="font-bold text-sm text-white truncate">Admin Akademik</p>
        <p class="text-blue-500 text-xs font-semibold tracking-wide">STAF AKADEMIK</p>
      </div>
      <div class="ml-auto text-gray-500">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
      </div>
    </div>
  </aside>
</template>