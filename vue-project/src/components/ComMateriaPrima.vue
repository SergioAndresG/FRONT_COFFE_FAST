<script setup lang="ts">
import Swal from 'sweetalert2';
import { ref,computed } from 'vue';
import axios from 'axios';
import ComImagen from './icons/IMGENES/ComImagen.vue';
import FormAddMateria from './FormAddMateria.vue';
import FormActMateria from './FormActMateria.vue';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


// Productos predefinidos para mostrar
const productos = ref([]);
const searchTerm = ref("");

const emergenteMasInformacion = ref(false);
const productoSeleccionado = ref({})

const cargarProductos = async () => {
  try {
    const respuesta = await axios.get("http://127.0.0.1:8000/materia");
    productos.value = respuesta.data; // Asigna los datos de la respuesta
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
};

cargarProductos();

const eliminarMateria = async (idMateria: number) => {
  try {
    const response = await axios.delete(`http://localhost:8080/materia/${idMateria}`);
    console.log("Materia eliminada con éxito", response.data);
    cargarProductos();
  } catch (error) {
    console.error("Error al eliminar la materia:", error);
  }
};

const filtrarProductos = computed(() => {
  if (!searchTerm.value.trim()) return productos.value;
  const term = searchTerm.value.toLowerCase().trim();
  return productos.value.filter(pro => pro.nombre.toLowerCase().includes(term));
});




const ActualizarMateria = ref(false);
const AgregarMateria = ref(false);

const openAct = () => {
  ActualizarMateria.value = true;
}
cargarProductos();

const closeAct = () => {
  ActualizarMateria.value = false;
}
cargarProductos();

const openAdd = () => {
  AgregarMateria.value = true;
};
cargarProductos();

const closeAdd = () => {
  AgregarMateria.value = false;
};

cargarProductos();


const openEmergente = (producto) => {
  emergenteMasInformacion.value = true; // Gurada el producto seleccionado
  productoSeleccionado.value = producto; // Para la informacion del producto selecionado

}


const closeEmergente = () => {
  emergenteMasInformacion.value = false;
}



</script>

<template>
  <header>
    <nav>
      <ComImagen />
      <ul>
        <li><router-link to="/">HOME</router-link></li>
        <li><a href="/Sesion">Empleados</a></li>
        <li><a href="/Sesion">Administradores</a></li>
      </ul>
    </nav>
  </header>
  <hr />
  <hr id="l2" />
  <h1 id="panel">Panel Materia Prima</h1>
  <hr id="l3" />

  <div class="button-container">
    <button @click="openAdd" class="custom-button">Agregar Materia Prima</button>
    <button @click="openAct" class="custom-button">Actualizar Materia Prima</button>
  </div>

  <FormAddMateria v-if="AgregarMateria" @close="closeAdd" />
  <FormActMateria v-if="ActualizarMateria" @close="closeAct" />

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
    

  <div class="product-container">
    <div class="card2" v-for="producto in filtrarProductos" :key="producto.id">
      <div class="product-image">
        <img
          v-if="producto.ruta_imagen"
          :src="`http://127.0.0.1:8000/${producto.ruta_imagen}`"
          class="product-image"
        />
        <span v-else>Sin imagen</span>
      </div>
      <p id="product-id">ID: <span class="product-id">{{ producto.id }}</span></p>
      <div class="product-info">
        <p>Nombre: <span class="product-name">{{ producto.nombre }}</span></p>
        <p>Cantidad: <span class="product-quantity">{{ producto.cantidad }} {{ producto.unidad.simbolo }}</span></p>
      </div>

      

      <div class="product-buttons">
        <button class="delete-button" @click="eliminarMateria(producto.id)">
          Eliminar
        </button>
      </div>
     <button @click="openEmergente(producto)" class="card-button">Mas Informacion</button>
    </div>
  </div>
  <div v-if="filtrarProductos.length === 0" class="no-results">
          No se encontraron ingredientes que coincidan con la búsqueda.
        </div>

  <div v-if="emergenteMasInformacion" class="moreInfo" @click.self="closeEmergente">
    <div class="cardInfo">
      <div class="moreInfoImage">
        <img
          v-if="productoSeleccionado.ruta_imagen"
          :src="`http://127.0.0.1:8000/productos/${productoSeleccionado.ruta_imagen}`"
          class="product-image"
        />
        <span v-else>Sin imagen</span>
      </div>
      <div class="container-info">
        <p>ID: <span class="product-id">{{ productoSeleccionado.id }}</span></p>
        <p>Producto: <span class="product-name">{{ productoSeleccionado.nombre }}</span></p>
        <p>Tipo: <span class="product-description">{{ productoSeleccionado.tipo }}</span></p>
        <p>Cantidad: <span class="product-quantity">{{ productoSeleccionado.cantidad }}</span></p>
        <p>Precio: <span class="product-price">${{ productoSeleccionado.precio_unitario }}</span></p>
        <p>Categoría: <span class="product-price">{{ productoSeleccionado.categoria }}</span></p>
        <p>Stock Mínimo: <span class="product-price">{{ productoSeleccionado.stock_minimo }}</span></p>
      </div>
      <button @click="closeEmergente" class="closeMore">Cerrar</button>
    </div>
  </div>

  <footer>
    <p>&copy; 2024</p>
    <ul class="wrapper">
      <a
        href="https://www.instagram.com/de_lonuestro?igsh=MXU3NTQ4cGY4cXI2ZA=="
        target="_blank"
        rel="noopener noreferrer"
      >
        <li class="icon instagram">
          <span class="tooltip">Instagram</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1.2em"
            fill="currentColor"
            class="bi bi-instagram"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"
            ></path>
          </svg>
        </li>
      </a>
    </ul>
  </footer>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jura:wght@700&display=swap');
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
    border-bottom-color: rgb(17, 0, 255);
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
    border-top: 2px solid #D9AB23; /* Ajusta el grosor y color según tus necesidades */
    margin: 20px 0; /* Ajusta el margen superior e inferior */
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
        font-family: Arial, sans-serif;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.3s;
        font-family: 'Jura', sans-serif;
    }

    .custom-button:hover {
        background-color: #D9AB23;
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

.info-button {
  background-color: #A65814;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.info-button:hover {
  background-color: #513d03;
}

    .product-container {
  width: 1000px;
  margin-left: 16%;
  margin-top: 70px;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Tres columnas */
  gap: 20px; /* Espacio entre los productos */
  padding: 20px; /* Margen interno */
  justify-content: center; /* Centrar el contenido horizontalmente */
}

.card2 {
  font-family: 'Jura', sans-serif;
  width: 320px;
  height: 340px;
  background-color: #c89a1f;
  color: rgb(255, 255, 255);
  border-radius: 12px;
  text-align: left;
  font-size: 17px;
  padding: 15px;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0px 4px 6px rgba(139, 108, 21, 0.705);
  border: 1px solid rgb(255, 255, 255);
}

.card2:hover {
  transform: scale(1.04);
  border-radius: 20px;
  box-shadow: 0px 4px 6px rgba(139, 108, 21, 0.705);
  background-color: #D9AB23;

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
  font-size: 19px;
}

.container-info{
  height: 200px;
  width: 200px;
  margin-left: 520px;
  margin-top: -380px;
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
  margin-top: 170px;
}
.closeMore:hover{
  transform: scale(1.1);
  transition: ease-out 0.3s;
  background-color: #b14a33;
}

.card-button {
 transform: translate(-50%, 125%);
 width: 50%;
 border-radius: 1rem;
 border: none;
 background-color: #A65814;
 color: #ffffff;
 font-size: 1rem;
 padding: .5rem 1rem;
 position: absolute;
 left: 50%;
 bottom: 0;
 opacity: 0;
 transition: 0.3s ease-out;
}
.card2:hover .card-button {
 transform: translate(-50%, 50%);
 opacity: 1;
 cursor: pointer;
}


.product-image {
  width: 60%;
  height: 150px;
  border-radius: 10%;
  overflow: hidden;
  margin-left: 10%;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  margin-top: 15px;
  margin-left: 45px;
}


#product-id {
  margin-top: 15px;
  margin-left: 45px;
}

.delete-button {
  background-color: #f5d881;
  color: rgb(0, 0, 0);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 5px;
  margin-left: 100px;
}

.delete-button:hover {
  background-color: #c89a1f;
}

.product-name {
    color: blue;
    color: rgb(255, 255, 255);
}

.product-id {
  margin-top: 300px;
}

.product-description {
    color: rgb(255, 255, 255);
}

.product-quantity {
    color: rgb(248, 247, 244);
}

.product-price {
    color: rgb(255, 255, 255);
    font-size: 1.1em;
}


        footer {
      padding: 20px;
      text-align: center;
      margin-top: 34px;
  }
  
  footer nav ul {
      list-style: none;
      display: inline-block;
  }
  
  footer nav li {
      display: inline;
      margin: 0 10px;
  }
  
  footer a {
      text-decoration: none;
      color: #333;
  }

  /* From Uiverse.io by david-mohseni */ 
  .wrapper {
    display: inline-flex;
    list-style: none;
    height: 120px;
    width: 100%;
    padding-top: 40px;
    font-family: "Poppins", sans-serif;
    justify-content: center;
    margin-left: -32px;
  }
  
  .wrapper .icon {
    position: relative;
    background: #000000;
    border-radius: 50%;
    margin: 10px;
    width: 50px;
    height: 50px;
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  .wrapper .tooltip {
    position: absolute;
    top: 0;
    font-size: 14px;
    background: #fff;
    color: #fff;
    padding: 5px 8px;
    border-radius: 5px;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  .wrapper .tooltip::before {
    position: absolute;
    content: "";
    height: 8px;
    width: 8px;
    background: #fff;
    bottom: -3px;
    left: 50%;
    transform: translate(-50%) rotate(45deg);
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  .wrapper .icon:hover .tooltip {
    top: -45px;
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }
  
  .wrapper .icon:hover span,
  .wrapper .icon:hover .tooltip {
    text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.1);
  }

  
  .wrapper .instagram:hover,
  .wrapper .instagram:hover .tooltip,
  .wrapper .instagram:hover .tooltip::before {
    background: #e4405f;
    color: #fff;
    margin-left: -13px;
  }

</style>