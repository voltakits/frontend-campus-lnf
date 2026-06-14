<script setup>
import { ref } from 'vue'
import AdminLayout from '../layouts/AdminLayout.vue'

const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const formBarang = ref({
  item_name: '',
  category: '',
  location_found: '',
  description_private: ''
})

const imageFile = ref(null)
const imagePreview = ref(null)

// Fungsi nangkep gambar
const handleImageChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

// Fungsi ngehapus gambar kalau user salah pilih
const removeImage = () => {
  imageFile.value = null
  imagePreview.value = null
}

const submitBarang = async () => {
  if (!formBarang.value.item_name || !formBarang.value.category || !formBarang.value.location_found) return
  
  isSubmitting.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('item_name', formBarang.value.item_name)
    formData.append('category', formBarang.value.category)
    formData.append('location_found', formBarang.value.location_found)
    formData.append('description_private', formBarang.value.description_private)
    
    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/found-items`, {
      method: 'POST',
      body: formData
    })

    // UPDATE: Kita tangkap response sebagai teks dulu biar nggak crash kalau dikasih HTML
    const textResponse = await res.text()
    
    let data;
    try {
      data = JSON.parse(textResponse)
    } catch (parseError) {
      console.error("Error dari Backend (Bukan JSON):", textResponse)
      throw new Error("Backend server error/crash! Cek terminal Node.js lu bro.")
    }

    if (!res.ok) throw new Error(data.error || 'Gagal menyimpan barang')

    successMessage.value = 'Sukses! Barang dan gambar tersimpan, notifikasi telah disebar.'
    
    // Reset Form
    formBarang.value = { item_name: '', category: '', location_found: '', description_private: '' }
    removeImage()
    
    setTimeout(() => { successMessage.value = '' }, 4000)

  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AdminLayout>
    <div class="p-4 lg:p-8 max-w-4xl mx-auto w-full relative">
      <h1 class="hidden lg:block text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Input Barang Temuan</h1>

      <div class="bg-[#121212] border border-gray-800 rounded-2xl p-6 lg:p-8 shadow-xl">
        <div class="mb-8">
          <h2 class="text-lg font-bold text-white mb-2">Formulir Pencatatan Gudang</h2>
          <p class="text-gray-500 text-sm">Pastikan data diisi sesuai barang aslinya. Tambahkan foto agar validasi klaim lebih akurat.</p>
        </div>

        <div v-if="successMessage" class="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl flex items-center gap-3">
          <svg class="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          <p class="text-emerald-400 text-sm font-medium">{{ successMessage }}</p>
        </div>
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3">
          <svg class="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          <p class="text-red-400 text-sm font-medium">{{ errorMessage }}</p>
        </div>

        <form @submit.prevent="submitBarang" class="space-y-6">
          
          <div>
            <label class="block text-xs font-bold text-gray-400 mb-2 tracking-wide">FOTO BARANG</label>
            
            <label v-if="!imagePreview" class="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-800 border-dashed rounded-xl cursor-pointer bg-[#0a0a0a] hover:bg-gray-900 transition">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-10 h-10 text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                <p class="text-sm text-gray-400"><span class="font-bold text-blue-500">Klik untuk upload</span> gambar barang</p>
              </div>
              <input type="file" class="hidden" accept="image/*" @change="handleImageChange" />
            </label>
            
            <div v-else class="relative w-full h-48 sm:h-64 border border-gray-800 rounded-xl overflow-hidden bg-black group">
              <img :src="imagePreview" alt="Preview" class="w-full h-full object-contain" />
              
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <button @click="removeImage" type="button" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition cursor-pointer shadow-lg">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  Ganti Foto
                </button>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-400 mb-2 tracking-wide">NAMA BARANG</label>
            <input v-model="formBarang.item_name" type="text" placeholder="Contoh: Dompet Hitam Kulit" required class="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition">
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-bold text-gray-400 mb-2 tracking-wide">KATEGORI</label>
              <select v-model="formBarang.category" required class="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition appearance-none">
                <option value="" disabled>Pilih Kategori</option>
                <option value="Elektronik">Elektronik</option>
                <option value="Dokumen">Dokumen/KTM</option>
                <option value="Aksesoris">Aksesoris/Kunci</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 mb-2 tracking-wide">LOKASI DITEMUKAN</label>
              <input v-model="formBarang.location_found" type="text" placeholder="Misal: Gedung B Lt 2" required class="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-400 mb-2 tracking-wide">DESKRIPSI (PRIVATE)</label>
            <textarea v-model="formBarang.description_private" rows="4" placeholder="Isi detail spesifik yang hanya diketahui pemilik (misal: isi KTP atas nama siapa, ada baret di ujung kanan HP, dll)" class="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"></textarea>
          </div>

          <div class="pt-6 border-t border-gray-800 flex justify-end">
            <button type="submit" :disabled="isSubmitting" class="px-6 py-3 text-sm font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition shadow-[0_0_15px_rgba(37,99,235,0.2)] cursor-pointer flex items-center gap-2">
              <svg v-if="isSubmitting" class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              {{ isSubmitting ? 'Mengupload & Menyimpan...' : 'Simpan & Sebar Notifikasi' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>