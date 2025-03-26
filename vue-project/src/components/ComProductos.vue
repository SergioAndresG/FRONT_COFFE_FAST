<script setup lang="ts">
import Swal from 'sweetalert2';
import { computed, ref } from 'vue';
import axios from 'axios';
import ComImagen from './icons/IMGENES/ComImagen.vue';
import ComAgregarP from './ComAgregarP.vue';
import ComActP from './ComActP.vue';
import ComConsulPro from './ComConsulPro.vue';
import { useRouter } from 'vue-router';
import ComConsulProPre from './ComConsulProPre.vue';
// Libreria para el icono de busqueda
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


// Variable para almacenar datos de la busqueda de productos
const searchTerm = ref("")
// Variables para almacenar los datos traidos por el endpoint
const productos = ref([]);
const empleado = ref([]);
// Contraseña obtenida de la informacion proporcionada por el endpoint
const contraseñaProporcionada = ref("");

//Variables para la carta emergente con informacion del producto

const emergenteReceta = ref(false);
const productoSeleccionado = ref({})
const recetaSeleccionada = ref("");
const emergenteMasInformacion = ref(false);


const openReceta = (materiaPrima) => {
  emergenteReceta.value = true;
  recetaSeleccionada.value = materiaPrima;
};

const closeReceta = () => {
  emergenteReceta.value = false;
};



const cargarEmpleados = async () => {
  try {
    const empleados = await axios.get("http://127.0.0.1:8000/usuarios");
    empleado.value = empleados.data; // Asignamos los datos del empleado

    // Se busca el usuario con el rol de Jefe
    const jefe = empleado.value.find(e=>e.rol==="JEFE")
    if (jefe) {
      contraseñaProporcionada.value = jefe.contraseña // Se guarda solo la contraseña
    } else {
      console.error("No se encontro al jefe")
    }
  } catch (error) {
    console.error("Error al obtner la contraseña del Jefe")
    
  }
}

const cargarProductos = async () => {
  try {
    const respuesta = await axios.get("http://127.0.0.1:8000/productos"); 
    productos.value = respuesta.data; // Asigna los datos de la respuesta
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
};

cargarEmpleados();

const eliminarProducto = async (idProducto: number) => {
  try {

    if(!contraseñaProporcionada){
      console.error("no se encontro la contraseña del jefe");
      return;
    }

    // Crear el DTO con los datos necesarios
    const eliminarProductoDTO = {
      idProductoaEliminar: idProducto, // Usar el id pasado al método
      contraseñaProporcionada: String(contraseñaProporcionada.value),  // Usar la contraseña del jefe
    };

    console.log(eliminarProductoDTO)
  console.log(typeof idProducto)
  console.log(typeof contraseñaProporcionada)

    // Realizar la solicitud DELETE al backend
    const response = await axios.delete("http://127.0.0.1:8000/productos/eliminar", {
      data: eliminarProductoDTO,  // Enviar el DTO en el cuerpo de la solicitud
      headers: {
        "Content-Type": "application/json"
      }
    });

    Swal.fire({
      title: "Eliminado con exito",
      icon: "success"
    });
    cargarProductos();
  } catch (error) {
    Swal.fire({
      title: "Error al elminar el Producto",
      icon: "error",
      
    })
  }

};

const filtrarProductos = computed (()=> {
  if(!searchTerm.value.trim()) return productos.value;

  const term =searchTerm.value.toLowerCase().trim()
  return productos.value.filter(pro => 
    pro.nombre.toLowerCase().includes(term)
  )
}) 


const ActualizarProducto = ref(false);
const AgregarProducto = ref(false);
const ConsultarProducto = ref(false);


const openEmergente = (producto) => {
  emergenteMasInformacion.value = true; // Gurada el producto seleccionado
  productoSeleccionado.value = producto; // Para la informacion del producto selecionado

}

const closeEmergente = () => {
  emergenteMasInformacion.value = false;
}

const openAct = () => {
  ActualizarProducto.value = true;
   // Usamos esto para evitar scroll en el body principal
   document.documentElement.style.overflow = "hidden";
  document.documentElement.style.height = "100hv";
}

const closeAct = () => {
  ActualizarProducto.value = false;
  // Restaurtamos el scroll en el body principal
  document.documentElement.style.overflow = "";
  document.documentElement.style.height = "";
cargarProductos();

}

const openAdd = () => {
  AgregarProducto.value = true;
  // Usamos esto para evitar scroll en el body principal
  document.documentElement.style.overflow = "hidden";
  document.documentElement.style.height = "100hv";
};

const closeAdd = () => {
  AgregarProducto.value = false;
  // Restaurtamos el scroll en el body principal
  document.documentElement.style.overflow = "";
  document.documentElement.style.height = "";
cargarProductos();
};

const closeCons = () => {
  ConsultarProducto.value = false;
  // Restaurtamos el scroll en el body principal
  document.documentElement.style.overflow = "";
  document.documentElement.style.height = "";
}

const openCons = () => {
  ConsultarProducto.value = true;
   // Usamos esto para evitar scroll en el body principal
   document.documentElement.style.overflow = "hidden";
  document.documentElement.style.height = "100hv";
}

cargarProductos();


</script>

<template>
  <header>
    <nav>
      <ComImagen />
      <ul>
        <li><router-link to="/">HOME</router-link></li>
        <li><a href="/Inicio">Empleados</a></li>
        <li><a href="/Inicio">Administradores</a></li>
      </ul>
    </nav>
  </header>
  <hr />
  <hr id="l2" />
  <h1 id="panel">Panel Productos</h1>
  <hr id="l3" />
  <div class="button-container">
      <button @click="openAdd" class="custom-button">Agregar Producto</button>
      <button @click="openAct" class="custom-button">Actualizar Producto</button>
      <button @click="openCons" class="custom-button">Consultar Producto</button>
  </div>

  
  <transition name="fade2"><ComAgregarP v-if="AgregarProducto" @close="closeAdd"/></transition>
  <transition name="fade2"><ComConsulProPre v-if="ConsultarProducto" @close="closeCons"/></transition>
  <transition name="fade2"><ComActP v-if="ActualizarProducto" @close="closeAct"/></transition>


  <div class="search-bar">
    <input 
      type="text" 
      v-model="searchTerm" 
      placeholder="Buscar Productos..." 
      class="search-input"
      style="font-family: 'Jura', sans-serif;;"
    >
    <font-awesome-icon :icon="faSearch" class="search-icon"/>

  </div>
    

  <transition-group name="fade" tag="div" class="product-container">
  <div class="card2" v-for="producto in filtrarProductos" :key="producto.id">
    <div class="product-image">
      <img v-if="producto.ruta_imagen" :src="`http://127.0.0.1:8000/productos/${producto.ruta_imagen}`" class="product-image" />
        <span v-else>{{ producto.imagen }}</span>
    </div>
    <div class="product-info">
        <div class="info-left">
          <p>Producto: <span class="product-name"> {{ producto.nombre }}</span></p>
          <p>Cantidad: <span class="product-quantity">{{ producto.cantidad }}</span></p>
        </div>
        <div class="info-right">
          <p>Precio: <span class="product-price">${{ producto.precio_unitario }}</span></p>
          <p>Categoría: <span class="product-price">{{ producto.categoria }}</span></p>

          
        </div>  
    </div>
    <div class="product-buttons">
      <button class="delete-button" @click="eliminarProducto(producto.id)">
        Eliminar
      </button>
    </div>
     <button @click="openEmergente(producto)" class="card-button">Mas Informacion</button>
    </div>

    <div v-if="filtrarProductos.length === 0" class="no-results">
          No se encontraron ingredientes que coincidan con la búsqueda.
        </div>
  </transition-group>

  <div v-if="emergenteMasInformacion" class="moreInfo" @click.self="closeEmergente"> <!-- .self se para que si se da click por accidente no se cierre la ventana -->
    <div class="cardInfo">
        <div class="moreInfoImage">
          <img v-if="productoSeleccionado.ruta_imagen" :src="`http://127.0.0.1:8000/productos/${productoSeleccionado.ruta_imagen}`" class="product-image" />
        </div>
        <div class="container-info">
          <p>ID: <span class="product-id">{{ productoSeleccionado.id }}</span></p>
            <p>Producto: <span class="product-name"> {{ productoSeleccionado.nombre }}</span></p>
            <p>Tipo: <span class="product-description">{{ productoSeleccionado.tipo }}</span></p>
            <p>Cantidad: <span class="product-quantity">{{ productoSeleccionado.cantidad }}</span></p>
            <p>Precio: <span class="product-price">${{ productoSeleccionado.precio_unitario }}</span></p>
            <p>Categoría: <span class="product-price">{{ productoSeleccionado.categoria }}</span></p>
            <p>Stock Minimo: <span class="product-price">{{ productoSeleccionado.stock_minimo }}</span></p>
            <button v-if="productoSeleccionado.hecho" 
                  @click="openReceta(productoSeleccionado.materia_prima)" 
                  class="mirar-receta">
            Mirar Receta
          </button>

      </div>

      <button @click="closeEmergente" class="closeMore">Cerrar</button>
    </div>
  </div>

  <!-- Carta emergente para la receta -->
  <div v-if="emergenteReceta" class="moreInfo" @click.self="closeReceta">
  <div class="cardInfo">
    <div class="container-info">
      <h3>Materia Prima</h3>
      <p v-if="recetaSeleccionada.length > 0">{{ recetaSeleccionada }}</p>
      <p v-else>No hay materias primas registradas para este producto.</p>
    </div>
    <button @click="closeReceta" class="closeMore">Cerrar</button>
  </div>
</div>



</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jura:wght@700&display=swap');

/*Estilos papa la aparicion de ventanas suavemente */

.fade2-enter-active, .fade-leave-active{
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade2-enter-from, .fade-leave-to{
  opacity: 0;
  transform: scale(0.9);
}
header {
    padding: 20px;
    background-color: #000000;

  }
  
  ul li {
    text-decoration: none;
    border-bottom: 5px solid #A65814;
    transition: border-bottom-color 0.3s ease-in-out;
    border-radius: 5px;
  }
  
  ul li:hover {
    border-bottom-color: rgb(231, 242, 102);
  }

  nav{
    margin-left: 173px;
  }
  
  nav ul {
    list-style: none;
    display: flex;
    justify-content: space-evenly;
    margin-left: 314px;
    margin-top: -73px;
  }
  
  nav li a {
    font-family: 'Jura', sans-serif;

    text-decoration: none;
    color: white;
    padding: 10px;
  }
  
  #res:hover {
    background-color: #ff9178;
    color: aliceblue;
  }
  
  #res{
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
    background-color: #e03743;
    text-decoration: none;
    border-bottom: 0px;
    width: 150px;
    text-align: center;
    font-size: 18px;
    padding: 4px;
    border-radius: 15px;
    font-family: 'Jura', sans-serif;

  }
  
  hr {
    border-top: 2px solid #D9AB23; 
    margin: 20px 0; 
    margin-top: 54px;
    width: 1300px;
    margin-left: 7%;
  }
  
  #l2 {
    margin-top: 10px;
    width: 800px;
    margin-left: 22%;
  }
  #panel{
    color: #D9AB23;
    font-family: 'Jura', sans-serif;
    font-weight:normal;
    text-align: center;
  }

  #l3{
    width: 1100px;
    margin-left: 183px;
    margin-top: 4px;
  }
.button-container {
    display: flex;
    gap: 10px;
    margin-top: 53px;
    justify-content: center;
}

.custom-button {
    background-color: #A65814;
    color: #FFFFFF;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    font-family: 'Jura', sans-serif;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.custom-button:hover {
    background-color: #885b34;
}

/* Estilos de la barra de busqueda */
.search-input{
  margin-left: 32.8%;
  height: 30px;
  width: 520px;
  margin-top: 45px;
}
.search-input:focus {
  outline: none;  
  border: 1px solid #D9AB23; 
  box-shadow: 0 0 5px rgba(78, 141, 166, 0.5);  
  transition: ease-in-out 0.5s;
}
.search-icon{
  margin-left: 15px;
}

.product-container {
  width: 1000px;
  margin-left: 16%;
  margin-top: 70px;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Tres columnas */
  gap: 40px; /* Espacio entre los productos */
  padding: 28px; /* Margen interno */
  justify-content: center; /* Centrar el contenido horizontalmente */
}

.card2 {
  font-family: 'Jura', sans-serif;
  width: 320px;
  height: 480px;
  background-color: #a65814cc;
  color: white;
  border-radius: 12px;
  text-align: left;
  font-size: 14px;
  padding: 19px;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgb(72, 65, 65);
}

.fade-enter-active, .fade-leave-active{
  transition: opacity 0.8s ease-out, transform 0.5s ease-out;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.95);
}

.fade-leave-to{
  opacity: 0;
  transform: translateY(15px) scale(0.95);
}

.card2:hover {
  transform: scale(1.04);
  border-radius: 20px;
}

.card-button {
 transform: translate(-50%, 125%);
 width: 60%;
 border-radius: 1rem;
 border: none;
 background-color: #D9AB23;
 color: #fff;
 font-size: 1rem;
 padding: .5rem 1rem;
 position: absolute;
 left: 50%;
 bottom: 0;
 opacity: 0;
 transition: 0.3s ease-out;
}

.card2:hover {
 border-color: #ff5900;
 box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.25);
}

/*boton despues de hacer hover*/
.card2:hover .card-button {
 transform: translate(-50%, 50%);
 opacity: 1;
 cursor: pointer;
}

.product-image {
  width: 90%;
  height: 200px;
  border-radius: 10%;
  overflow: hidden;
  margin-left: 5.5%;
}

.product-info {
  display: flex;
  justify-content: space-between;
  margin-left: 25px;
}

.product-info p{
  font-size: 20px;
}

.product-info span{
  font-size: 15px;
}

.info-left, .info-right {
  width: 50%;
}

.info-left p, .info-right p {
  margin: 20px;
}

.delete-button {
  background-color: #f3ea78;
  color: rgb(9, 8, 8);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 15px;
  margin-left: 100px;
}

.delete-button:hover {
  background-color: #deaf2e;
}

.product-name {
    color: rgb(255, 255, 255);
    display: block;
}

.product-description {
    color: rgb(255, 255, 255);
    display: block;

}

.product-quantity {
    color: rgb(248, 247, 244);
    display: block;

}

.product-price {
    color: rgb(255, 255, 255);
    font-size: 1.1em;
    display: block;

}

.moreInfo{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;

}

.cardInfo {
  background: rgb(0, 0, 0);
  padding: 20px;
  border-radius: 10px;
  width: 800px;
  height: 500px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  border: solid 1px #fff;
  font-family: 'Jura', sans-serif;
}

.container-info{
  height: 200px;
  width: 200px;
  margin-left: 520px;
  margin-top: -410px;
}

.moreInfoImage img{
  background-color: #A65814;
  width: 400px;
  margin-top: 40px;
  height: 400px;
  margin-left: -350px;
}

.closeMore{
  background-color: #a41010;
  color: rgb(255, 255, 255);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 15px;
  margin-left: 100px;
  margin-top: 220px;
}
.closeMore:hover{
  transform: scale(1.1);
  transition: ease-out 0.3s;
  background-color: #b14a33;
}
.no-results{
  font-size: 24px;
  font-family: 'Jura', sans-serif;
  margin-left: 280px;
  width: 500px;
  height: 200px;

}

.no-results {
  animation: Text 0.2s ease-out forwards;
}

@keyframes Text {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.mirar-receta {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 15px;
}

.mirar-receta:hover {
  background-color: #45a049;
}
</style>