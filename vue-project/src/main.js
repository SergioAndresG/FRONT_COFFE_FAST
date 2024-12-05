import './assets/main.css'

import { createPinia } from "pinia";
import { createApp } from 'vue'
import App from './App.vue'
import router from './routers/misrutas';
import '@fortawesome/fontawesome-free/css/all.css'



const pinia = createPinia();
const app = createApp(App);

app.use(router)
app.use(pinia)
.mount('#app')

