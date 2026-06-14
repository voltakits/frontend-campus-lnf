import { reactive } from 'vue';

// 1. Bikin brankas data yang bisa diakses dari halaman mana aja
export const adminData = reactive({
    privateItems: [],
    totalReports: 0,
});

// 2. Fungsi tembak API ke Express
export const fetchAdminData = async () => {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/dashboard-data`);
        const json = await res.json();
        if (json.status === 'success') {
            adminData.privateItems = json.data.privateItems;
            adminData.totalReports = json.data.totalReports;
        }
    } catch (error) {
        console.error('Gagal mengambil data admin:', error);
    }
};



