<script setup>
import { ref } from 'vue'

// Dummy Data Riwayat Laporan (Samping Kanan)
const riwayatLaporan = ref([
  { nama_barang: 'KTM Mahasiswa', tanggal: '11 Jun', status: 'Dicari', warna: 'text-amber-500', bg: 'bg-amber-500/10' },
  { nama_barang: 'Helm Bogo Hitam', tanggal: '08 Jun', status: 'Selesai', warna: 'text-emerald-500', bg: 'bg-emerald-500/10' }
])
</script>

<template>
  <aside class="hidden lg:block w-[350px] xl:w-[400px] h-full overflow-y-auto p-6 bg-[#050505] shrink-0 border-l border-gray-800">
    <div class="bg-[#121212] border border-gray-800 rounded-2xl p-6 mb-6">
      <div class="flex items-center gap-2 mb-5 border-b border-gray-800 pb-4">
        <svg class="w-6 h-6 text-indigo-500 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h2 class="text-white font-bold text-lg">Riwayat Laporan Saya</h2>
      </div>

      <div class="space-y-4">
        <div v-for="(item, index) in riwayatLaporan" :key="index" class="p-3 border border-gray-800 rounded-xl bg-[#0a0a0a] hover:bg-gray-900 transition">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-white text-sm font-bold truncate">{{ item.nama_barang }}</h4>
            <span class="text-xs text-gray-500">{{ item.tanggal }}</span>
          </div>
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase" :class="[item.warna, item.bg]">
            <div class="w-1.5 h-1.5 rounded-full" :class="`bg-current`"></div>
            {{ item.status }}
          </div>
        </div>
        
        <div v-if="riwayatLaporan.length === 0" class="text-center py-6 text-gray-500 text-sm">
          Belum ada riwayat laporan kehilangan.
        </div>
      </div>
      
      <button class="w-full mt-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl transition">
        Lihat Semua
      </button>
    </div>
  </aside>
</template>