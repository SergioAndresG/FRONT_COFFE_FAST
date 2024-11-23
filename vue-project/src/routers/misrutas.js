import ComHome from "@/components/ComHome.vue";
import { createRouter, createWebHistory } from "vue-router";


const routes = [
    {
        path: "/",
        name: "Home",
        component: ComHome
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;