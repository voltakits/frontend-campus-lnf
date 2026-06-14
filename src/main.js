import { createApp } from 'vue'
import './style.css' // Pastikan Tailwind v4 lu udah ter-import di sini
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router) // Suntikkan Vue Router ke aplikasi
app.mount('#app')