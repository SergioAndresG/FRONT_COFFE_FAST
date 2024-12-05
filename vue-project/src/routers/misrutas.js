import ComAdmi from "@/components/ComAdmi.vue";
import ComConsutUsu from "@/components/ComConsutUsu.vue";
import ComEmpleado from "@/components/ComEmpleado.vue";
import ComForAct from "@/components/ComForAct.vue";
import ComForAgregar from "@/components/ComForAgregar.vue";
import ComForDel from "@/components/ComForDel.vue";
import ComGest from "@/components/ComGest.vue";
import ComGestEmpleadoPr from "@/components/ComGestEmpleadoPr.vue";
import ComHome from "@/components/ComHome.vue";
import ComJefe from "@/components/ComJefe.vue";
import ComMateriaPrima from "@/components/ComMateriaPrima.vue";
import ComMateriaPrimaAd from "@/components/ComMateriaPrimaAd.vue";
import ComMateriaPrimaEm from "@/components/ComMateriaPrimaEm.vue";
import ComMenu from "@/components/ComMenu.vue";
import ComNostros from "@/components/ComNostros.vue";
import ComProductos from "@/components/ComProductos.vue";
import ComProductosAdmin from "@/components/ComProductosAdmin.vue";
import ComSesion from "@/components/ComSesion.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "Home",
        component: ComHome
    },
    {
        path: "/Nosotros",
        name: "Nosotros",
        component: ComNostros
    },
    {
        path: "/Sesion",
        name:"Sesion",
        component: ComSesion
    },
    {
        path: "/Jefe",
        name: "Jefe",
        component: ComJefe
    },
    {
        path: "/Admi",
        name: "Admi",
        component: ComAdmi
    },
    {
        path: "/Empleado",
        name: "Empleado",
        component: ComEmpleado
    },
    {
        path: "/Productos",
        name: "Productos",
        component: ComProductos

    },
    {
        path: "/Gest",
        name: "Gest",
        component: ComGest
    },
    {
        path: "/AgregarU",
        name: "AgregarU",
        component: ComForAgregar
    },
    {
        path: "/Menu",
        name: "Menu",
        component: ComMenu
    },
    {
        path: "/EliminarU",
        name: "EliminarU",
        component: ComForDel

    },
    {
        path: "/Actualizar",
        name: "Actualizar",
        component: ComForAct
    },
    {
        path: "/Consultar",
        name: "Consultar",
        component: ComConsutUsu
    },
    {
        path: "/Materia",
        name: "Materia",
        component: ComMateriaPrima
    },
    {
        path: "/GPEmpleados",
        name: "GPEmpleados",
        component: ComGestEmpleadoPr
    },
    {
        path: "/GPAdmi",
        name: "GPAdmi",
        component: ComProductosAdmin
    },
    {
        path: "/GMAdmi",
        name: "GMAdmi",
        component: ComMateriaPrimaAd
    },
    {
        path: "/GMAEmp",
        name: "GMAEmp",
        component: ComMateriaPrimaEm
    }, 
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;