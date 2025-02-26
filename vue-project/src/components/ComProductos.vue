<script setup lang="ts">
import Swal from 'sweetalert2';
import { ref } from 'vue';
import axios from 'axios';
import ComImagen from './icons/IMGENES/ComImagen.vue';
import ComAgregarP from './ComAgregarP.vue';
import ComActP from './ComActP.vue';
import ComConsulPro from './ComConsulPro.vue';
import { useRouter } from 'vue-router';
import ComConsulProPre from './ComConsulProPre.vue';



const productos = ref([]);


const cargarProductos = async () => {
  try {
    const respuesta = await axios.get("http://127.0.0.1:8000/productos"); // Ajusta la URL según tu backend
    productos.value = respuesta.data; // Asigna los datos de la respuesta
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
};


const contraseñaProporcionada = "126";

const eliminarProducto = async (idProducto: number) => {
  try {
    // Crear el DTO con los datos necesarios
    const eliminarProductoDTO = {
      idProductoaEliminar: idProducto, // Usar el id pasado al método
      contraseñaProporcionada: contraseñaProporcionada,  // Usar la contraseña del jefe
    };

    // Realizar la solicitud DELETE al backend
    const response = await axios.delete("http://127.0.0.1:8000/productos/eliminar", {
      data: eliminarProductoDTO,  // Enviar el DTO en el cuerpo de la solicitud
    });

    console.log("Producto eliminado con éxito", response.data);
    cargarProductos();
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
  }
};


const ActualizarProducto = ref(false);
const AgregarProducto = ref(false);
const ConsultarProducto = ref(false);

const openAct = () => {
  ActualizarProducto.value = true;
}

const closeAct = () => {
  ActualizarProducto.value = false;
cargarProductos();

}

const openAdd = () => {
  AgregarProducto.value = true;
};

const closeAdd = () => {
  AgregarProducto.value = false;
cargarProductos();
};


const openCons = () => {
  ConsultarProducto.value = true;
};

const closeCons = () => {
  ConsultarProducto.value = false;
};




const router = useRouter();



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

  <ComConsulProPre v-if="ConsultarProducto" @close="closeCons"/>
  <ComAgregarP v-if="AgregarProducto" @close="closeAdd"/>
  <ComActP v-if="ActualizarProducto" @close="closeAct"/>

  <div class="product-container">
  <div class="card2" v-for="producto in productos" :key="producto.id">
    <div class="product-image">
      <img v-if="producto.ruta_imagen" :src="`http://127.0.0.1:8000/${producto.ruta_imagen}`" class="product-image" />
        <span v-else>{{ producto.imagen }}</span>
    </div>
    <p>ID: <span class="product-id">{{ producto.id }}</span></p>
    <div class="product-info">
      <p>Nombre: <span class="product-name">{{ producto.nombre }}</span></p>
      <p>Descripción: <span class="product-description">{{ producto.descripcion }}</span></p>
      <p>Cantidad: <span class="product-quantity">{{ producto.cantidad }}</span></p>
      <p>Precio: <span class="product-price">${{ producto.precio_unitario }}</span></p>
      <p>Categoría: <span class="product-price">{{ producto.categoria }}</span></p>
    </div>
    <div class="product-buttons">
      <button class="delete-button" @click="eliminarProducto(producto.id)">
        Eliminar
      </button>
    </div>
  </div>
</div>


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
    font-family: 'Jura', sans-serif;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.custom-button:hover {
    background-color: #885b34;
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
  background-color: #a65814ac;
  color: white;
  border-radius: 12px;
  text-align: left;
  font-size: 14px;
  padding: 19px;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid;
}

.card2:hover {
  transform: scale(1.10);
  border-radius: 20px;
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

</style>