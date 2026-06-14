<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/')
}
</script>

<template>
  <aside class="hidden lg:flex w-[260px] flex-col justify-between py-6 px-4 h-full border-r border-gray-800 shrink-0 bg-[#050505]">
    <div class="space-y-6">
      <div class="px-2 mb-8">
        <h1 class="text-white font-bold text-xl tracking-wide">Campus<span class="text-blue-500">L&F</span></h1>
      </div>

      <nav class="space-y-2">
        <button class="flex items-center gap-4 px-3 py-3 w-full text-white bg-[#121212] border border-gray-800 rounded-xl font-semibold cursor-pointer">
          <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.099l-9 6.843v10.957h5v-6h8v6h5v-10.957l-9-6.843z"></path></svg>
          <span>Beranda</span>
        </button>
        <button class="flex items-center gap-4 px-3 py-3 w-full text-gray-400 hover:text-white hover:bg-gray-900 rounded-xl transition cursor-pointer font-medium">
          <svg class="h-6 w-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          <span>Lapor Kehilangan</span>
        </button>
      </nav>
    </div>

    <div @click="handleLogout" class="flex items-center gap-3 p-3 mt-auto bg-[#0a0a0a] border border-gray-800 rounded-xl hover:bg-gray-900 transition-colors cursor-pointer group">
      <div class="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white shrink-0">M</div>
      <div class="overflow-hidden">
        <p class="font-bold text-sm text-white truncate">Mahasiswa</p>
        <p class="text-indigo-400 text-xs font-semibold tracking-wide">USER</p>
      </div>
      <div class="ml-auto text-gray-500 group-hover:text-red-500 transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
      </div>
    </div>
  </aside>
</template>