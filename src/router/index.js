import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import AdminRiwayat from '../views/AdminRiwayat.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    // Ini halaman buat mahasiswa nanti
    path: '/dashboard-mahasiswa',
    name: 'DashboardMahasiswa',
    // Gunakan lazy loading biar performa web lu ngebut
    component: () => import('../views/DashboardMahasiswa.vue') 
  },
  {
    // Ini halaman buat admin akademik nanti
    path: '/admin-dashboard',
    name: 'DashboardAdmin',
    component: () => import('../views/DashboardAdmin.vue')
  },
  {
    // Rute Baru buat halaman input
    path: '/admin-input-temuan-barang',
    name: 'InputTemuan',
    component: () => import('../views/InputTemuan.vue')
  },
  { 
    path: '/lapor-barang', 
    name: 'LaporBarang',
    component: () => import('../views/LaporBarangFix.vue') 
  },
  { 
    path: '/admin-verifikasi', 
    name: 'AdminVerifikasi',
    component: () => import('../views/AdminVerifikasi.vue') 
  },

  {
    path: '/admin-riwayat',
    name: 'AdminRiwayat',
    component: AdminRiwayat
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router