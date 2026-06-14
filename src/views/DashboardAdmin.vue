<script setup>
import { ref, computed, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue'; 
import { adminData } from '../adminStore.js'; 

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'vue-chartjs';

ChartJS.register(ArcElement, Tooltip, Legend);

const reports = ref([]);

const fetchReports = async () => {
  try {
    // TAMBAHIN CREDENTIALS INCLUDE
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/reports`, {
      credentials: 'include' 
    });
    const json = await res.json();
    if (json.status === 'success') {
      reports.value = json.data;
    }
  } catch (error) {
    console.error('Gagal menarik data:', error);
  }
};

const fetchPrivateItems = async () => {
  try {
    // TAMBAHIN CREDENTIALS INCLUDE
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/found-items/private`, {
      credentials: 'include'
    });
    const json = await res.json();
    if (json.status === 'success') {
      adminData.privateItems = json.data;
    }
  } catch (error) {
    console.error('Gagal narik gudang private:', error);
  }
};

onMounted(() => {
  fetchReports();
  fetchPrivateItems();
});

const stats = computed(() => {
    const data = reports.value;
    return {
        menunggu: data.filter(r => r.status === 'Menunggu Verifikasi').length,
        dicari: data.filter(r => r.status === 'Dicari').length,
        siapDiambil: data.filter(r => r.status === 'Siap Diambil').length,
        selesai: data.filter(r => r.status?.toLowerCase() === 'selesai').length,
        total: data.filter(r => r.status?.toLowerCase() !== 'selesai').length 
    };
});

const statusChartData = computed(() => ({
    labels: ['Menunggu Verifikasi', 'Dicari', 'Siap Diambil', 'Selesai'],
    datasets: [{
        data: [stats.value.menunggu, stats.value.dicari, stats.value.siapDiambil, stats.value.selesai],
        backgroundColor: ['#EAB308', '#8B5CF6', '#3B82F6', '#10B981'],
        borderColor: '#16181c', 
        borderWidth: 3,
        hoverOffset: 4
    }]
}));

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom', labels: { color: '#9CA3AF', padding: 15, font: { size: 11 } } },
        tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', padding: 12, cornerRadius: 8 }
    },
    cutout: '65%' 
};
</script>

<template>
    <AdminLayout>
        <div class="border-b border-gray-800 px-4 py-3 bg-black/90 backdrop-blur sticky top-0 z-10 hidden lg:block">
            <h2 class="text-xl font-bold text-white">Beranda Staf Akademik</h2>
        </div>

        <div class="p-4 sm:p-6 space-y-6">
            
            <div class="bg-gradient-to-r from-blue-900/30 to-blue-800/10 border border-blue-900/50 rounded-2xl p-6">
                <h3 class="text-2xl font-bold text-white mb-2">Selamat Bertugas!</h3>
                <p class="text-gray-400 text-sm">Gunakan panel ini untuk mengelola inventaris barang temuan dan melakukan verifikasi laporan kehilangan dari mahasiswa.</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <router-link to="/admin-input-temuan-barang" class="bg-[#16181c] hover:bg-gray-900 border border-gray-800 rounded-2xl p-5 transition group">
                    <div class="w-10 h-10 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    </div>
                    <h4 class="font-bold text-white mb-1">Input Temuan</h4>
                    <p class="text-[11px] text-gray-500">Catat barang temuan.</p>
                </router-link>

                <router-link to="/admin-verifikasi" class="bg-[#16181c] hover:bg-gray-900 border border-gray-800 rounded-2xl p-5 transition group">
                    <div class="w-10 h-10 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h4 class="font-bold text-white mb-1">Verifikasi</h4>
                    <p class="text-[11px] text-gray-500">Cocokkan laporan.</p>
                </router-link>

                <router-link to="/admin-riwayat" class="bg-[#16181c] hover:bg-gray-900 border border-gray-800 rounded-2xl p-5 transition group">
                    <div class="w-10 h-10 bg-purple-500/20 text-purple-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h4 class="font-bold text-white mb-1">Riwayat</h4>
                    <p class="text-[11px] text-gray-500">Laporan selesai.</p>
                </router-link>
            </div>

            <div class="bg-[#16181c] border border-gray-800 rounded-2xl p-5 flex flex-col items-center">
                <h4 class="font-bold text-white text-[15px] mb-2 flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    Statistik Status Laporan Aktif
                </h4>
                <div class="relative h-64 w-full max-w-[300px] flex-1 flex items-center justify-center">
                    <Doughnut v-if="stats.total > 0" :data="statusChartData" :options="chartOptions" />
                    <div v-else class="text-gray-500 text-sm">Belum ada data laporan aktif.</div>
                    
                    <div v-if="stats.total > 0" class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-4">
                        <span class="text-3xl font-extrabold text-white">{{ stats.total }}</span>
                        <span class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Aktif</span>
                    </div>
                </div>
            </div>

        </div>
    </AdminLayout>
</template>