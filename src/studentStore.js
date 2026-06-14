import { reactive } from 'vue';

export const studentData = reactive({
    myReports: [],
    notifications: [] // Dulu pakai localStorage, sekarang kosongin aja biar diisi dari API
});

export const fetchMyReports = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email) return;

    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lost-reports/my-reports?email=${user.email}`, {
            credentials: 'include'
        });
        const json = await res.json();
        if (json.status === 'success') {
            studentData.myReports = json.data;
        }
    } catch (error) {
        console.error('Gagal mengambil riwayat:', error);
    }
};


// FUNGSI BARU DIPERBARUI: Buat narik notif dari Backend via Cookie
export const fetchMyNotifications = async () => {
    try {
        // Langsung tembak! Backend udah tau siapa yang request dari credentials (Cookie)
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, {
            credentials: 'include'
        });
        
        const json = await res.json();
        if (json.status === 'success') {
            studentData.notifications = json.data;
        }
    } catch (error) {
        console.error('Gagal mengambil notifikasi:', error);
    }
};

// Auto-refresh keduanya tiap 3 detik!
setInterval(() => {
    fetchMyReports();
    fetchMyNotifications();
}, 3000);