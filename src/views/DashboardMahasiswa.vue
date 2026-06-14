<script setup>
import { ref, computed, onMounted } from 'vue'
import StudentLayout from '../layouts/StudentLayout.vue'
import { messaging, onMessage, getToken } from '../firebase.js'
import { studentData, fetchMyNotifications } from '../studentStore.js' 

const privateAnnouncements = ref([])
const myMatchedItems = ref([]) 
const searchAnnouncements = ref([]) 
const notification = ref(null) 

// STATE UNTUK FORM PERBAIKAN LAPORAN
const showFixModal = ref(false)
const isSubmitting = ref(false)
const editForm = ref({
  id: '',
  item_name: '',
  category: '',
  last_seen_location: '',
  description: ''
})

const categories = ['Elektronik', 'Dokumen', 'Aksesoris', 'Pakaian', 'Lainnya']

const rejectedReports = computed(() => {
  if (!studentData.myReports) return []
  return studentData.myReports.filter(r => r.status?.toLowerCase() === 'ditolak')
})

const fetchAnnouncements = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/found-items/announcements`)
    const data = await res.json()
    if (data.status === 'success') privateAnnouncements.value = data.data
  } catch (error) { console.error(error) }
}

const fetchMyMatchedItems = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/found-items/my-items`, { credentials: 'include' })
    const data = await res.json()
    if (data.status === 'success') {
      myMatchedItems.value = data.data.map(report => ({
        id: report.id,
        item_name: report.found_items?.item_name,
        category: report.found_items?.category,
        location: report.found_items?.location_found,
        description: report.detailed_description || '-',
        image_url: report.found_items?.image_url,
        created_at: report.created_at
      }))
    }
  } catch (error) { console.error(error) }
}

const fetchSearchAnnouncements = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lost-reports/broadcasts`)
    const data = await res.json()
    if (data.status === 'success') searchAnnouncements.value = data.data
  } catch (error) { console.error(error) }
}

const fetchMyReports = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lost-reports/my-reports`, { credentials: 'include' })
    const data = await res.json()
    if (data.status === 'success') studentData.myReports = data.data 
  } catch (error) { console.error(error) }
}

// BUKA MODAL DAN ISI DATA LAMA
const openFixModal = (report) => {
  editForm.value = {
    id: report.id,
    item_name: report.item_name || report.title || '',
    category: report.category || '',
    last_seen_location: report.location || report.last_seen_location || '',
    description: report.description || report.detailed_description || ''
  }
  showFixModal.value = true
}

// SUBMIT FORM PERBAIKAN
const submitFix = async () => {
  if (!editForm.value.item_name || !editForm.value.category || !editForm.value.last_seen_location || !editForm.value.description) {
    return alert('Semua kolom wajib diisi bro!')
  }
  
  isSubmitting.value = true
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lost-reports/my-reports/${editForm.value.id}/resubmit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ 
        item_name: editForm.value.item_name,
        category: editForm.value.category,
        last_seen_location: editForm.value.last_seen_location,
        new_description: editForm.value.description 
      })
    })
    
    const data = await res.json()
    if (data.status === 'success') {
      alert('Mantap! Laporan lu berhasil diperbaiki dan diajukan ulang ke akademik.')
      showFixModal.value = false
      fetchMyReports() 
    } else {
      alert('Gagal memperbaiki laporan.')
    }
  } catch (err) {
    alert('Terjadi kesalahan server.')
  } finally {
    isSubmitting.value = false
  }
}

const setupFirebaseMessaging = async () => {
  try {
    const permission = await Notification.requestPermission()
    if (permission === 'granted' && messaging) {
      const token = await getToken(messaging, { vapidKey: 'BGJ6altMcrbeo-25si11n6NtOsYXXowEAGj_9SnGqzM12h9Nur9MxZf-9U_Is6zZ_mBzsshkrvJd6SCKT6OrbZo' })
      if (token) {
        try {
          await fetch(`${import.meta.env.VITE_API_URL}/api/fcm/save-token`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ token: token })
          })
        } catch (err) {}
      }

      onMessage(messaging, (payload) => {
        notification.value = { title: payload.notification.title, body: payload.notification.body }
        fetchMyNotifications() // Langsung tarik notif seger dari database!

        fetchAnnouncements()
        fetchMyMatchedItems() 
        fetchSearchAnnouncements()
        fetchMyReports()
        setTimeout(() => { notification.value = null }, 5000)
      })
    }
  } catch (error) { console.error(error) }
}

onMounted(() => {
  fetchAnnouncements()
  fetchMyMatchedItems() 
  fetchSearchAnnouncements() 
  fetchMyReports() 
  setupFirebaseMessaging()
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <StudentLayout>
    <transition enter-active-class="transition ease-out duration-300" enter-from-class="transform -translate-y-10 opacity-0" enter-to-class="transform translate-y-0 opacity-100" leave-active-class="transition ease-in duration-200" leave-from-class="transform translate-y-0 opacity-100" leave-to-class="transform -translate-y-10 opacity-0">
      <div v-if="notification" class="fixed top-5 left-1/2 transform -translate-x-1/2 z-[100] w-11/12 max-w-sm">
        <div class="bg-blue-600 border border-blue-400 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-start gap-3">
          <div class="mt-0.5 bg-white/20 p-1.5 rounded-full shrink-0">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </div>
          <div>
            <h4 class="font-bold text-sm">{{ notification.title }}</h4>
            <p class="text-xs text-blue-100 mt-0.5 leading-snug">{{ notification.body }}</p>
          </div>
        </div>
      </div>
    </transition>

    <div class="border-b border-gray-800 px-4 py-3 bg-black/90 backdrop-blur sticky top-0 z-10 hidden sm:block">
      <h2 class="text-xl font-bold text-white">Untuk Anda</h2>
    </div>

    <div class="p-4 sm:p-6 w-full space-y-6">
      
      <!-- LAPORAN DITOLAK -->
      <div v-if="rejectedReports.length > 0" class="bg-red-950/20 border border-red-900/50 rounded-2xl p-5 mb-6">
        <h3 class="font-bold text-red-500 mb-4 flex items-center gap-2">
           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
           Laporan Perlu Perbaikan
        </h3>
        
        <div class="divide-y divide-red-900/30">
          <div v-for="item in rejectedReports" :key="'rejected-'+item.id" class="py-4">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="shrink-0 mt-1">
                <img v-if="item.image_url" :src="item.image_url" class="w-full sm:w-28 h-32 sm:h-28 rounded-xl object-cover border border-red-900/50 bg-black opacity-80" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-extrabold text-white text-lg mb-1">{{ item.title || item.item_name }}</h4>
                <div class="bg-red-900/20 p-3 rounded-xl border border-red-900/40 mb-3">
                  <p class="text-red-400 text-[13px] leading-snug">
                    <strong class="text-red-500">Alasan Penolakan:</strong><br/>
                    {{ item.rejection_reason || 'Laporan tidak valid.' }}
                  </p>
                </div>
                <button @click="openFixModal(item)" class="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-5 rounded-lg text-sm transition w-full sm:w-auto shadow-lg shadow-red-900/20">
                   Perbaiki Laporan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AREA PENGUMUMAN AKADEMIK -->
      <div class="bg-[#0f1115] border border-gray-800 rounded-2xl p-5">
        <h3 class="font-bold text-white mb-4 flex items-center gap-2">
           <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
           Pengumuman Akademik
        </h3>
        
        <div v-if="myMatchedItems.length > 0 || privateAnnouncements.length > 0 || searchAnnouncements.length > 0" class="divide-y divide-gray-800">
          <!-- Item Pencarian -->
          <div v-for="item in searchAnnouncements" :key="'search-'+item.id" class="py-4 hover:bg-white/5 transition">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="shrink-0 mt-1">
                <img v-if="item.image_url" :src="item.image_url" class="w-full sm:w-28 h-40 sm:h-28 rounded-xl object-cover border border-orange-700/50 bg-black" />
                <div v-else class="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded border bg-orange-900/30 text-orange-500 border-orange-900/50 uppercase animate-pulse">Bantu Cari</span>
                  <span class="text-xs text-gray-500 ml-auto">{{ formatDate(item.created_at) }}</span>
                </div>
                <p class="text-gray-300 text-[15px] leading-relaxed mb-3">Telah hilang barang kategori <strong class="text-white">"{{ item.category }}"</strong> berupa <strong class="text-white text-lg block sm:inline mt-1 sm:mt-0">{{ item.item_name }}</strong>. Terakhir dilihat di <strong class="text-white">{{ item.last_seen_location }}</strong>.</p>
              </div>
            </div>
          </div>

          <!-- Item Match -->
          <div v-for="item in myMatchedItems" :key="'matched-'+item.id" class="py-6 hover:bg-white/5 transition border-b border-gray-800/50 last:border-0">
            <div class="flex flex-col gap-3">
              
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-[10px] font-bold px-2.5 py-1 rounded border bg-blue-900/40 text-blue-400 border-blue-700/50 uppercase animate-pulse">Kabar Baik!</span>
                  <span class="text-xs text-gray-500 ml-auto">{{ formatDate(item.created_at) }}</span>
                </div>
                <h4 class="font-extrabold text-white text-xl mb-1">{{ item.item_name }}</h4>
                <p class="text-blue-100/80 text-[14px] leading-relaxed">Laporan kehilangan lu telah berhasil dicocokkan! Barang saat ini aman di akademik.</p>
              </div>

              <div v-if="item.image_url" class="mt-2 mb-1">
                <img :src="item.image_url" class="w-full max-h-80 sm:max-h-96 object-contain rounded-2xl border border-gray-700 bg-black" />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-400 bg-[#16181c] p-4 rounded-xl border border-blue-900/30 mt-2">
                <div>
                  <span class="block text-[10px] uppercase font-bold text-gray-500 mb-1">Kategori</span> 
                  <span class="text-gray-200 font-medium">{{ item.category }}</span>
                </div>
                <div>
                  <span class="block text-[10px] uppercase font-bold text-gray-500 mb-1">Lokasi Ditemukan</span> 
                  <span class="text-gray-200 font-medium">{{ item.location }}</span>
                </div>
                <div class="sm:col-span-2">
                  <span class="block text-[10px] uppercase font-bold text-gray-500 mb-1">Ciri-ciri</span> 
                  <span class="text-gray-300">{{ item.description }}</span>
                </div>
              </div>

            </div>
          </div>

          <!-- Item Private -->
          <div v-for="item in privateAnnouncements" :key="'private-'+item.id" class="py-4 hover:bg-white/5 transition">
             <!-- ... (Kode item private sama persis seperti sebelumnya) ... -->
             <div class="flex flex-col sm:flex-row gap-4">
              <div class="shrink-0 mt-1">
                <div class="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                   <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded border bg-yellow-900/30 text-yellow-500 border-yellow-900/50 uppercase">Info Temuan</span>
                  <span class="text-xs text-gray-500 ml-auto">{{ formatDate(item.created_at) }}</span>
                </div>
                <p class="text-gray-300 text-[15px] leading-relaxed mb-3">{{ item.message }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="p-8 text-center border border-gray-800 rounded-xl mt-2">
          <p class="text-gray-500 text-sm">Belum ada pengumuman terbaru.</p>
        </div>
      </div>
    </div>

    <!-- MODAL FORM PERBAIKI LAPORAN (FULL FORM) -->
    <div v-if="showFixModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6">
      <div class="bg-[#16181c] border border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        <!-- Header Modal -->
        <div class="p-5 border-b border-gray-800 flex justify-between items-center bg-[#0f1115] rounded-t-2xl">
          <div>
            <h3 class="text-xl font-bold text-white">Perbaiki Laporan</h3>
            <p class="text-xs text-gray-400 mt-1">Perbarui informasi barang yang lu laporkan.</p>
          </div>
          <button @click="showFixModal = false" class="text-gray-500 hover:text-white p-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Body Modal (Bisa di-scroll) -->
        <div class="p-5 overflow-y-auto space-y-5">
          <!-- Catatan: Untuk upload foto baru di mode edit butuh logika storage tambahan. Kita skip dulu biar aman, user bisa perbaiki text-nya. -->
          
          <div>
            <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Nama Barang</label>
            <input type="text" v-model="editForm.item_name" class="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Kategori</label>
              <select v-model="editForm.category" class="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition appearance-none">
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Lokasi Terakhir</label>
              <input type="text" v-model="editForm.last_seen_location" class="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" />
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Ciri Spesifik (Private)</label>
            <textarea v-model="editForm.description" rows="4" class="w-full bg-black border border-gray-700 rounded-xl p-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" placeholder="Isi detail yang cuma lu yang tahu..."></textarea>
          </div>
        </div>
                  
        <!-- Footer Modal -->
        <div class="p-5 border-t border-gray-800 flex justify-end gap-3 bg-[#0f1115] rounded-b-2xl shrink-0">
          <button @click="showFixModal = false" class="px-5 py-2.5 text-gray-400 font-bold hover:text-white transition">Batal</button>
          <button @click="submitFix" :disabled="isSubmitting" class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2">
             <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
             {{ isSubmitting ? 'Mengirim...' : 'Kirim Laporan' }}
          </button>
        </div>
      </div>
    </div>

  </StudentLayout>
</template>