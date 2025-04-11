import ComAdmi from "@/components/ComAdmi.vue";
import ComConsulProPre from "@/components/ComConsulProPre.vue";
import ComConsulPro from "@/components/ComConsulPro.vue";
import ComConProN from "@/components/ComConProN.vue";
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
import SnowFall from "@/components/SnowFall.vue";
import { createRouter, createWebHistory } from "vue-router";
import ComConProC from "@/components/ComConProC.vue";
import ActulizacionPerfil from "@/components/ActualizacionPerfil.vue";
import ComPCliente from "@/components/ComPCliente.vue";
import ComPedidos from "@/components/ComPedidos.vue";
import ComPfacturas from "@/components/ComPfacturas.vue";
import FormAddStock from "@/components/FormAddStock.vue";

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
    {
        path: "/Snowl",
        name: "Snowl",
        component: SnowFall
    },
    {
        path: "/ConsultarPre",
        name: "ConsultarPre",
        component: ComConsulProPre
    },
    {
        path: "/ConsultarProid",
        name: "ConsultarProid",
        component: ComConsulPro
    },
    {
        path: "/ConsultarProN",
        name: "ConsultarProN",
        component: ComConProN
    },
    {
        path: "/ConsultarProC",
        name: "ConsultarProC",
        component: ComConProC
    },
    {
        path: "/ActualizarPerfil",
        name: "ActualizarPerfil",
        component: ActulizacionPerfil
    },
    {
        path:"/Clientes",
        name:"PedidoCliente",
        component: ComPCliente
    },
    {
        path:"/Pedidos",
        name:"Pedidos",
        component: ComPedidos
    },
    {
        path: "/Facturas",
        name:"Facturas",
        component:ComPfacturas
    },
    {
        path: "/FormAddStock",
        name: "FormAddStock",
        component: FormAddStock
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;