<script setup>
import { ref } from 'vue'
import StudentLayout from '../layouts/StudentLayout.vue'

const activeUser = ref(JSON.parse(localStorage.getItem('user')) || { name: 'Mahasiswa', email: '' }) 
const isSubmitting = ref(false)
const selectedImage = ref(null)
const imagePreview = ref(null)

const form = ref({
  title: '',
  category: '',
  location: '',
  description: ''
})

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedImage.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const submitReport = async () => {
  if (!form.value.title || !form.value.category || !form.value.location) {
    alert('Judul, Kategori, dan Lokasi wajib diisi bro!')
    return
  }

  isSubmitting.value = true
  
  // Karena bawa gambar, kita pakai FormData (nggak bisa pakai JSON stringify biasa)
  const formData = new FormData()
  formData.append('email', activeUser.value.email)
  formData.append('title', form.value.title)
  formData.append('category', form.value.category)
  formData.append('location', form.value.location)
  formData.append('description', form.value.description)
  if (selectedImage.value) {
    formData.append('image', selectedImage.value)
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lost-reports/submit`, {
      method: 'POST',
      body: formData // Kirim mentahan form-nya
    })
    
    const data = await res.json()
    if (data.status === 'success') {
      alert('Laporan kehilangan berhasil dikirim!')
      // Reset form
      form.value = { title: '', category: '', location: '', description: '' }
      selectedImage.value = null
      imagePreview.value = null
    } else {
      alert(data.error || 'Gagal ngirim laporan.')
    }
  } catch (err) {
    alert('Server error.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <StudentLayout>
    <div class="border-b border-gray-800 px-4 py-3 bg-black/90 backdrop-blur sticky top-0 z-10 hidden sm:block">
      <h2 class="text-xl font-bold text-white">Lapor Barang Hilang</h2>
    </div>

    <div class="p-6">
      <div class="bg-[#16181c] border border-gray-800 rounded-2xl p-6">
        
        <div class="mb-6 relative border-2 border-dashed border-gray-700 rounded-xl bg-black hover:bg-gray-900 transition flex flex-col items-center justify-center p-8 overflow-hidden group cursor-pointer">
          <input type="file" accept="image/*" @change="handleImageUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
          <div v-if="!imagePreview" class="text-center">
            <svg class="w-10 h-10 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <p class="text-sm text-blue-500 font-bold">Klik untuk upload <span class="text-gray-500 font-normal">(Opsional)</span></p>
          </div>
          <img v-else :src="imagePreview" class="absolute inset-0 w-full h-full object-contain bg-black" />
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Barang</label>
            <input v-model="form.title" type="text" class="w-full bg-black border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition" placeholder="Misal: Dompet Hitam" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Kategori</label>
              <select v-model="form.category" class="w-full bg-black border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition cursor-pointer">
                <option value="" disabled>Pilih Kategori</option>
                <option value="Elektronik">Elektronik</option>
                <option value="Dokumen">Dokumen</option>
                <option value="Aksesoris">Aksesoris</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Lokasi Terakhir</label>
              <input v-model="form.location" type="text" class="w-full bg-black border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition" placeholder="Misal: Gedung B" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ciri Spesifik (Private)</label>
            <textarea v-model="form.description" rows="3" class="w-full bg-black border border-gray-800 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition resize-none" placeholder="Isi detail yang cuma lu yang tahu..."></textarea>
          </div>

          <button @click="submitReport" :disabled="isSubmitting" class="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition shadow-lg mt-4">
            {{ isSubmitting ? 'Mengirim Data...' : 'Kirim Laporan' }}
          </button>
        </div>
      </div>
    </div>
  </StudentLayout>
</template>