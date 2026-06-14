<script setup>
import { ref } from 'vue'

const infoSistem = ref({ laporanAktif: 1, gudangPrivate: 1 })
const gudangPrivateItems = ref([
  { nama: 'HP Samsung', kategori: 'Elektronik', lokasi: 'nckdknd', tanggal: '10 Jun', status: 'Private' }
])
</script>

<template>
  <aside class="w-full lg:w-[400px] xl:w-[480px] 2xl:w-[550px] lg:h-full lg:overflow-y-auto p-4 lg:p-6 bg-[#050505] shrink-0 border-l lg:border-l-0 border-gray-800">
    
    <div class="bg-[#121212] border border-gray-800 rounded-2xl p-6 mb-6">
      <div class="flex items-center gap-2 mb-4">
        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h2 class="text-white font-bold text-lg lg:text-xl">Info Sistem</h2>
      </div>
      <p class="text-gray-400 text-sm leading-relaxed mb-6">
        Selamat datang di panel Admin Akademik. Pastikan untuk mencocokkan laporan mahasiswa dengan teliti dan mewajibkan mereka membawa <strong class="text-gray-300">KTM</strong> saat proses serah terima barang.
      </p>

      <div class="grid grid-cols-2 gap-4">
        <div class="border border-gray-800 rounded-xl p-4 text-center bg-[#0a0a0a]">
          <p class="text-3xl font-bold text-white mb-1">{{ infoSistem.laporanAktif }}</p>
          <p class="text-[11px] text-gray-500 font-bold tracking-wider">LAPORAN AKTIF</p>
        </div>
        <div class="border border-gray-800 rounded-xl p-4 text-center bg-[#0a0a0a]">
          <p class="text-3xl font-bold text-white mb-1">{{ infoSistem.gudangPrivate }}</p>
          <p class="text-[11px] text-gray-500 font-bold tracking-wider">GUDANG PRIVATE</p>
        </div>
      </div>
    </div>

    <div class="bg-[#121212] border border-gray-800 rounded-2xl p-6 mb-8">
      <div class="flex items-center gap-2 mb-5 border-b border-gray-800 pb-4">
        <svg class="w-6 h-6 text-purple-500 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
        <h2 class="text-white font-bold text-lg lg:text-xl">Gudang Private</h2>
      </div>

      <div class="space-y-4">
        <div v-for="(item, index) in gudangPrivateItems" :key="index" class="flex gap-4 items-center group cursor-pointer hover:bg-gray-800/30 p-2 -mx-2 rounded-xl transition">
          <div class="w-14 h-14 bg-[#1a1a1a] border border-gray-800 rounded-lg flex items-center justify-center shrink-0">
            <span class="text-xs text-gray-500 text-center leading-tight">Foto<br>Barang</span>
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <span class="bg-purple-900/40 text-purple-400 text-[10px] font-bold px-2 py-0.5 rounded-sm">{{ item.status }}</span>
              <span class="text-xs text-gray-500">{{ item.tanggal }}</span>
            </div>
            <h4 class="text-white text-sm lg:text-base font-bold truncate">{{ item.nama }}</h4>
            <p class="text-xs text-gray-500 truncate mt-1">Kategori: {{ item.kategori }}</p>
            <p class="text-xs text-gray-500 truncate mt-0.5">Lokasi: {{ item.lokasi }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-600 font-medium px-2">
      <a href="#" class="hover:text-gray-300 transition">Tentang</a>
      <a href="#" class="hover:text-gray-300 transition">Bantuan Admin</a>
      <span>© 2026 Kelas ti24se1</span>
    </div>
  </aside>
</template>