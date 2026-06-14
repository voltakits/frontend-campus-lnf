<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
// IMPORT BRANKAS GLOBAL YANG BARUSAN DIBIKIN
import { adminData } from '../adminStore.js'; 

const router = useRouter();
const route = useRoute();

const activeMobileTab = ref('beranda');
const isSidebarOpen = ref(false);

const user = ref(JSON.parse(localStorage.getItem('user')) || { name: 'Admin Akademik' });

watch(() => route.path, () => {
    isSidebarOpen.value = false;
});

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
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};
</script>

<template>
    <div class="min-h-screen bg-black text-white font-sans relative w-full overflow-x-hidden flex">
        
        <div v-if="isSidebarOpen" @click="isSidebarOpen = false" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"></div>

        <header :class="isSidebarOpen ? 'translate-x-0 shadow-2xl shadow-blue-900/20' : '-translate-x-full lg:translate-x-0'" 
                class="fixed lg:static inset-y-0 left-0 z-50 w-[260px] bg-[#0a0a0c] lg:bg-black transition-transform duration-300 ease-in-out flex flex-col justify-start h-screen pt-4 pb-6 px-4 border-r border-gray-800 shrink-0 overflow-y-auto">
            <div class="space-y-6">
                <div class="flex items-center justify-between py-2 px-3">
                    <router-link to="/admin-dashboard" class="hover:bg-gray-900 rounded-full cursor-pointer transition p-2 -ml-2">
                        <div class="h-8 w-8 text-blue-500 font-bold text-xl">C<span class="text-white">L&F</span></div>
                    </router-link>
                    <button @click="isSidebarOpen = false" class="lg:hidden text-gray-500 hover:text-white p-2 -mr-2 rounded-full transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <nav class="space-y-2 mt-2 font-bold text-gray-200">
                    <router-link to="/admin-dashboard" class="flex items-center space-x-4 px-4 py-3 hover:bg-gray-900 rounded-2xl transition w-full text-[17px]">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        <span>Beranda</span>
                    </router-link>
                    <router-link to="/admin-input-temuan-barang" class="flex items-center space-x-4 px-4 py-3 hover:bg-gray-900 rounded-2xl transition w-full text-[17px]">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        <span>Input Temuan</span>
                    </router-link>
                    <router-link to="/admin-verifikasi" class="flex items-center space-x-4 px-4 py-3 hover:bg-gray-900 rounded-2xl transition w-full text-[17px]">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        <span>Verifikasi</span>
                    </router-link>
                     <router-link to="/admin-riwayat" class="flex items-center space-x-4 px-4 py-3 hover:bg-gray-900 rounded-2xl transition w-full text-[17px]">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        <span>Riwayat Selesai</span>
                    </router-link>
                    
                    <div class="pt-6 mt-4 border-t border-gray-800">
                        <button @click="handleLogout" class="w-full flex items-center p-3 hover:bg-gray-900 rounded-2xl transition text-left border border-gray-800/50">
                            <div class="w-10 h-10 shrink-0 rounded-full bg-blue-900 flex items-center justify-center font-bold text-white border border-blue-700">
                                {{ user.name.charAt(0) }}
                            </div>
                            <div class="ml-3 overflow-hidden flex-1">
                                <p class="text-sm font-bold truncate text-white">{{ user.name }}</p>
                                <p class="text-[11px] font-bold text-blue-400 truncate">STAF AKADEMIK</p>
                            </div>
                            <svg class="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        </button>
                    </div>
                </nav>
            </div>
        </header>

        <main class="flex-1 min-w-0 max-w-[650px] border-r border-gray-800 flex flex-col min-h-screen">
            <div class="lg:hidden border-b border-gray-800 px-4 py-3 flex justify-between items-center bg-black/90 backdrop-blur sticky top-0 z-30">
                <button @click="isSidebarOpen = true" class="text-gray-300 hover:text-white p-2 -ml-2 rounded-full hover:bg-gray-900 transition">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
                <div class="h-6 w-6 text-blue-500 font-bold">C<span class="text-white">L&F</span></div>
                <div class="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center font-bold text-sm text-white border border-blue-700">
                    {{ user.name.charAt(0) }}
                </div>
            </div>

            <div class="xl:hidden flex border-b border-gray-800 sticky top-[60px] lg:top-0 bg-black/90 backdrop-blur z-20">
                <button @click="activeMobileTab = 'beranda'"
                    class="flex-1 py-3 text-[15px] font-bold text-center border-b-[3px] transition-colors"
                    :class="activeMobileTab === 'beranda' ? 'border-blue-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'">
                    Beranda
                </button>
                <button @click="activeMobileTab = 'info'"
                    class="flex-1 py-3 text-[15px] font-bold text-center border-b-[3px] transition-colors"
                    :class="activeMobileTab === 'info' ? 'border-blue-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'">
                    Info Sistem
                </button>
            </div>

            <div v-show="activeMobileTab === 'beranda'" class="flex-1">
                <slot />
            </div>

            <div v-show="activeMobileTab === 'info'" class="flex-1 p-4 pb-12 xl:hidden space-y-6">
                <div class="bg-gradient-to-br from-[#16181c] to-black rounded-2xl p-6 border border-gray-800">
                    <h3 class="font-extrabold text-xl mb-4 text-white flex items-center gap-2">
                        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Info Sistem
                    </h3>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-black border border-gray-800 rounded-xl p-4 text-center">
                            <span class="block text-2xl font-bold text-white">{{ adminData.totalReports }}</span>
                            <span class="text-[10px] text-gray-500 font-bold uppercase">Laporan Aktif</span>
                        </div>
                        <div class="bg-black border border-gray-800 rounded-xl p-4 text-center">
                            <span class="block text-2xl font-bold text-white">{{ adminData.privateItems.length }}</span>
                            <span class="text-[10px] text-gray-500 font-bold uppercase">Gudang Private</span>
                        </div>
                    </div>
                </div>

                <div class="bg-[#16181c] rounded-2xl pt-5 border border-gray-800 overflow-hidden w-full">
                    <h3 class="font-extrabold text-xl mb-3 px-5 text-white flex items-center gap-2">
                        <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        Gudang Private
                    </h3>
                    
                    <div v-if="adminData.privateItems.length > 0">
                        <div v-for="item in adminData.privateItems" :key="item.id" class="p-4 border-b border-gray-800/50 flex gap-4">
                            <img :src="item.image_url || `https://placehold.co/400x400/1c1f26/cbd5e1?text=${item.category}`" class="w-20 h-20 rounded-xl object-cover border border-gray-700 bg-gray-900" />
                            <div class="flex-1 min-w-0 flex flex-col justify-center">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-[10px] font-bold px-2 py-0.5 rounded border bg-purple-900/30 text-purple-400 border-purple-900/50">Private</span>
                                    <span class="text-[10px] text-gray-500">{{ formatDate(item.created_at) }}</span>
                                </div>
                                <p class="font-extrabold text-white text-[14px] truncate">{{ item.item_name }}</p>
                                <p class="text-[12px] text-gray-400 truncate">Lokasi: {{ item.location_found }}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div v-else class="p-8 text-center text-sm text-gray-500">Gudang kosong. Belum ada barang temuan.</div>
                </div>
            </div>
        </main>

        <aside class="hidden xl:block flex-1 h-screen sticky top-0 pt-2 pl-6 pr-6 overflow-y-auto">
            <div class="w-full mt-2">
                
                <div class="bg-gradient-to-br from-[#16181c] to-black rounded-2xl p-6 border border-gray-800">
                    <h3 class="font-extrabold text-xl mb-4 text-white flex items-center gap-2">
                        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Info Sistem
                    </h3>
                    <p class="text-sm text-gray-400 leading-relaxed mb-4">Pastikan untuk mencocokkan laporan mahasiswa dengan teliti dan mewajibkan KTM.</p>
                    
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-black border border-gray-800 rounded-xl p-4 text-center">
                            <span class="block text-2xl font-bold text-white">{{ adminData.totalReports }}</span>
                            <span class="text-[10px] text-gray-500 font-bold uppercase">Laporan Aktif</span>
                        </div>
                        <div class="bg-black border border-gray-800 rounded-xl p-4 text-center">
                            <span class="block text-2xl font-bold text-white">{{ adminData.privateItems.length }}</span>
                            <span class="text-[10px] text-gray-500 font-bold uppercase">Gudang Private</span>
                        </div>
                    </div>
                </div>

                <div class="bg-[#16181c] rounded-2xl pt-5 border border-gray-800 overflow-hidden w-full mt-6">
                    <h3 class="font-extrabold text-xl mb-3 px-5 text-white flex items-center gap-2">
                        <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        Gudang Private
                    </h3>
                    
                    <div v-if="adminData.privateItems.length > 0">
                        <div v-for="item in adminData.privateItems" :key="item.id" class="p-4 hover:bg-white/5 transition cursor-pointer border-b border-gray-800/50 flex gap-4">
                            <img :src="item.image_url || `https://placehold.co/400x400/1c1f26/cbd5e1?text=${item.category}`" class="w-20 h-20 rounded-xl object-cover border border-gray-700 bg-gray-900" />
                            <div class="flex-1 min-w-0 flex flex-col justify-center">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-[10px] font-bold px-2 py-0.5 rounded border bg-purple-900/30 text-purple-400 border-purple-900/50">Private</span>
                                    <span class="text-[10px] text-gray-500">{{ formatDate(item.created_at) }}</span>
                                </div>
                                <p class="font-extrabold text-white text-[14px] truncate">{{ item.item_name }}</p>
                                <p class="text-[12px] text-gray-400 truncate">Lokasi: {{ item.location_found }}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div v-else class="p-8 text-center text-sm text-gray-500">Gudang kosong.</div>
                </div>
            </div>
        </aside>
    </div>
</template>