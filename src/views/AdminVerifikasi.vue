<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import { adminData } from '../adminStore.js' 

const reports = ref([])
const isUpdating = ref(false)

const showModal = ref(false)
const currentReport = ref(null)
const selectedItemId = ref(null)

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

// Nembak API Broadcast (Otomatis memverifikasi laporan juga)
const broadcastSearch = async (reportId) => {
  if (!confirm('Kirim notifikasi ke SELURUH mahasiswa untuk bantu mencari barang ini?')) return

  isUpdating.value = true
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/reports/${reportId}/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    
    const json = await res.json()
    if (json.status === 'success') {
      alert('📢 Broadcast pencarian berhasil disebar ke seluruh mahasiswa!')
      fetchReports() 
    } else {
      alert('Gagal mengirim broadcast.')
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Terjadi kesalahan server.')
  } finally {
    isUpdating.value = false
  }
}

const markAsDone = async (reportId) => {
  if (!confirm('Yakin barang ini sudah diserahkan ke mahasiswa? Status akan menjadi Selesai.')) return

  isUpdating.value = true
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/reports/${reportId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'selesai' }) 
    })
    
    const json = await res.json()
    if (json.status === 'success') {
      alert('Mantap! Barang selesai dikembalikan.')
      fetchReports() 
    } else {
      alert('Gagal menyelesaikan laporan.')
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Terjadi kesalahan server.')
  } finally {
    isUpdating.value = false
  }
}

const openMatchModal = (report) => {
  currentReport.value = report
  selectedItemId.value = null
  showModal.value = true
}

const confirmMatch = async () => {
  if (!selectedItemId.value) return alert('Pilih barang dulu bro!')
  
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/match-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reportId: currentReport.value.id,
        itemId: selectedItemId.value
      })
    })
    
    if (res.ok) {
      alert('Mantap! Barang berhasil dicocokkan & notif terkirim.')
      showModal.value = false
      fetchReports() 
    } else {
      alert('Gagal mencocokkan barang.')
    }
  } catch (err) {
    alert('Server error saat mencocokkan.')
  }
}

// FUNGSI BARU: Tolak Laporan
const rejectReportAction = async (reportId) => {
  const reason = prompt('Masukkan alasan penolakan (misal: "Foto kurang jelas / Deskripsi ga nyambung"):')
  if (!reason) return // Kalau admin nge-cancel prompt, gajadi nolak

  isUpdating.value = true
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/reports/${reportId}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    })
    
    const json = await res.json()
    if (json.status === 'success') {
      alert('Laporan berhasil ditolak & pelapor telah dikabari.')
      fetchReports() 
    } else {
      alert('Gagal menolak laporan.')
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Terjadi kesalahan server.')
  } finally {
    isUpdating.value = false
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
    <div class="border-b border-gray-800 px-4 py-3 bg-black/90 backdrop-blur sticky top-0 z-10 hidden lg:block">
      <h2 class="text-xl font-bold text-white">Verifikasi Data Kehilangan</h2>
    </div>

    <div class="p-4 sm:p-6">
      <div class="bg-gradient-to-r from-emerald-900/30 to-emerald-800/10 border border-emerald-900/50 rounded-2xl p-6 mb-6">
        <h3 class="text-2xl font-bold text-white mb-2">Panel Verifikasi</h3>
        <p class="text-gray-400 text-sm">
          Periksa laporan kehilangan dari mahasiswa. Sebarkan info pencarian, atau cocokkan dengan barang di gudang.
        </p>
      </div>

      <div class="space-y-4">
        <div v-if="reports.filter(r => r.status?.toLowerCase() !== 'selesai').length > 0">
          <div v-for="report in reports.filter(r => r.status?.toLowerCase() !== 'selesai')" :key="report.id" class="bg-[#16181c] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition">
            <div class="flex flex-col sm:flex-row gap-5">
              <img v-if="report.image_url" :src="report.image_url" class="w-full sm:w-32 h-32 rounded-xl object-cover border border-gray-700 bg-black shrink-0" />
              <div v-else class="w-full sm:w-32 h-32 rounded-xl border border-dashed border-gray-700 bg-black shrink-0 flex flex-col items-center justify-center text-gray-600">
                <svg class="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span class="text-[10px] font-bold">Tanpa Foto</span>
              </div>

              <div class="flex-1 flex flex-col justify-center">
                <div class="flex justify-between items-start mb-2">
                  <span class="text-[11px] font-bold px-2.5 py-1 rounded border uppercase tracking-wider"
                        :class="report.status?.toLowerCase() === 'siap diambil' ? 'bg-green-900/30 text-green-500 border-green-900/50' : 
                               (report.status?.toLowerCase() === 'menunggu verifikasi' ? 'bg-yellow-900/30 text-yellow-500 border-yellow-900/50' : 'bg-blue-900/30 text-blue-500 border-blue-900/50')">
                    {{ report.status }}
                  </span>
                  <span class="text-xs text-gray-500 font-medium">{{ formatDate(report.created_at) }}</span>
                </div>
                <h4 class="font-extrabold text-white text-lg mb-2">{{ report.item_name }}</h4>
                <div class="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-3 bg-black/50 p-3 rounded-xl border border-gray-800/50">
                  <div><span class="text-gray-500 block text-[10px] uppercase font-bold mb-0.5">Kategori</span> {{ report.category }}</div>
                  <div><span class="text-gray-500 block text-[10px] uppercase font-bold mb-0.5">Lokasi</span> {{ report.last_seen_location }}</div>
                </div>

                <div class="flex flex-wrap gap-2 mt-auto pt-2">
                  
                  <!-- TOMBOL OREN: SEBAR INFO PENCARIAN -->
                  <button v-if="report.status?.toLowerCase() === 'menunggu verifikasi' || report.status?.toLowerCase() === 'dicari'" @click="broadcastSearch(report.id)" :disabled="isUpdating" class="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-5 rounded-lg text-sm transition flex items-center gap-1 shadow-lg shadow-orange-900/20">
                     <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                     Sebar Info Pencarian
                  </button>

                  <button v-if="report.status?.toLowerCase() === 'menunggu verifikasi' || report.status?.toLowerCase() === 'dicari'" @click="openMatchModal(report)" class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-5 rounded-lg text-sm transition">
                     Cocokkan Barang
                  </button>

                  <button v-if="report.status?.toLowerCase() === 'menunggu verifikasi'" 
                          @click="rejectReportAction(report.id)" :disabled="isUpdating" 
                          class="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-5 rounded-lg text-sm transition">
                    Tolak
                  </button>
                  
                  <button v-if="report.status?.toLowerCase() === 'siap diambil'" @click="markAsDone(report.id)" :disabled="isUpdating" class="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg text-sm transition shadow-lg">
                     ✅ Selesai (Sudah Diambil)
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="bg-[#16181c] border border-gray-800 rounded-2xl p-10 text-center">
          <svg class="w-12 h-12 text-gray-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <h3 class="text-lg font-bold text-white mb-1">Bersih!</h3>
          <p class="text-sm text-gray-500">Belum ada laporan mahasiswa yang perlu ditindaklanjuti.</p>
        </div>

      </div>
    </div>

    <!-- Modal Pilihan Barang -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div class="bg-[#16181c] border border-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
        <h3 class="text-xl font-bold text-white mb-4">Pilih Barang yang Cocok</h3>
        <div class="max-h-60 overflow-y-auto space-y-2 mb-6">
          <div v-for="item in adminData.privateItems" :key="item.id" 
               @click="selectedItemId = item.id"
               class="p-3 rounded-lg border cursor-pointer transition"
               :class="selectedItemId === item.id ? 'border-blue-500 bg-blue-900/20' : 'border-gray-800 bg-black hover:border-gray-700'">
            <p class="font-bold text-white">{{ item.item_name }}</p>
            <p class="text-xs text-gray-500">Lokasi: {{ item.location_found }}</p>
          </div>
        </div>
        <div class="flex justify-end gap-3">
          <button @click="showModal = false" class="px-4 py-2 text-gray-400 font-bold">Batal</button>
          <button @click="confirmMatch" class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold">Cocokkan</button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>