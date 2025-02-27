<<<<<<< HEAD
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './routers/misrutas';
import '@fortawesome/fontawesome-free/css/all.css'

createApp(App)
.use(router)
.mount('#app')
=======

import { createPinia } from "pinia";
import { createApp } from 'vue'
import App from './App.vue'
import router from './routers/misrutas';
import './assets/main.css'; // Importa el archivo CSS global
import 'sweetalert2/dist/sweetalert2.min.css'; // Asegúrate de que SweetAlert2 esté estilizado
import '@fortawesome/fontawesome-free/css/all.css'



const pinia = createPinia();
const app = createApp(App);

app.use(router)
app.use(pinia)
.mount('#app')

>>>>>>> master
