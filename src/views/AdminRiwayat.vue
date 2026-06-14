<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'

const reports = ref([])

// Fungsi narik data laporan dari backend
const fetchReports = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/reports`)
    const json = await res.json()
    if (json.status === 'success') {
      reports.value = json.data
    }
  } catch (error) {
    console.error('Gagal menarik data laporan:', error)
  }
}

onMounted(() => {
  fetchReports()
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <AdminLayout>
    <!-- Header Desktop -->
    <div class="border-b border-gray-800 px-4 py-3 bg-black/90 backdrop-blur sticky top-0 z-10 hidden lg:block">
      <h2 class="text-xl font-bold text-white">Riwayat Barang Selesai</h2>
    </div>

    <div class="p-4 sm:p-6">
      <div class="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-6 mb-6">
        <h3 class="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Riwayat Penyerahan
        </h3>
        <p class="text-gray-400 text-sm">
          Daftar laporan kehilangan mahasiswa yang barangnya sudah berhasil dicocokkan dan diserahkan kembali.
        </p>
      </div>

      <div class="space-y-4">
        <!-- TAMPILKAN HANYA YANG STATUSNYA SELESAI (CASE-INSENSITIVE) -->
        <div v-if="reports.filter(r => r.status?.toLowerCase() === 'selesai').length > 0">
          <div v-for="report in reports.filter(r => r.status?.toLowerCase() === 'selesai')" :key="report.id" class="bg-[#16181c] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition opacity-80 hover:opacity-100">
            <div class="flex flex-col sm:flex-row gap-5">
              
              <!-- Gambar Barang -->
              <img v-if="report.image_url" :src="report.image_url" class="w-full sm:w-32 h-32 rounded-xl object-cover border border-gray-700 bg-black shrink-0 grayscale hover:grayscale-0 transition duration-300" />
              <div v-else class="w-full sm:w-32 h-32 rounded-xl border border-dashed border-gray-700 bg-black shrink-0 flex flex-col items-center justify-center text-gray-600">
                <svg class="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span class="text-[10px] font-bold">Tanpa Foto</span>
              </div>

              <!-- Detail Barang -->
              <div class="flex-1 flex flex-col justify-center">
                <div class="flex justify-between items-start mb-2">
                  <!-- Label Status Baku 'Selesai' -->
                  <span class="text-[11px] font-bold px-3 py-1 rounded border uppercase tracking-wider bg-gray-800 text-gray-400 border-gray-700 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    Selesai
                  </span>
                  <span class="text-xs text-gray-500 font-medium">Dilaporkan: {{ formatDate(report.created_at) }}</span>
                </div>
                
                <h4 class="font-extrabold text-gray-300 text-lg mb-2 line-through decoration-gray-600">{{ report.item_name }}</h4>
                
                <div class="grid grid-cols-2 gap-4 text-sm text-gray-400 bg-black/50 p-3 rounded-xl border border-gray-800/50">
                  <div><span class="text-gray-500 block text-[10px] uppercase font-bold mb-0.5">Kategori</span> {{ report.category }}</div>
                  <div><span class="text-gray-500 block text-[10px] uppercase font-bold mb-0.5">Lokasi Hilang</span> {{ report.last_seen_location }}</div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
        
        <!-- Jika Kosong -->
        <div v-else class="bg-[#16181c] border border-gray-800 rounded-2xl p-10 text-center">
          <svg class="w-12 h-12 text-gray-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 class="text-lg font-bold text-white mb-1">Belum Ada Riwayat</h3>
          <p class="text-sm text-gray-500">Barang yang sudah dikembalikan ke mahasiswa akan tampil di sini.</p>
        </div>

      </div>
    </div>
  </AdminLayout>
</template>