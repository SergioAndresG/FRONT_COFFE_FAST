<script setup lang="ts">
import ComImagen from './icons/IMGENES/ComImagen.vue';
import { ref } from "vue";
import axios from 'axios';

const productos = ref([])
const Materia = ref([]);

const cargarProductos = async () => {
  try {
    const respuesta = await axios.get("http://localhost:8080/productos"); // Ajusta la URL según tu backend
    productos.value = respuesta.data; // Asigna los datos de la respuesta
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
};

const cargarMateria = async () => {
  try {
    const respuesta = await axios.get("http://localhost:8080/materia"); // Ajusta la URL según tu backend
    Materia.value = respuesta.data; // Asigna los datos de la respuesta
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
};

cargarProductos();
cargarMateria();

// Arreglo reactivo de actividades
const activities = ref<string[]>([
  "Registrar entradas de productos",
  "Revisar inventario",
  "Actualizar precios",
  "Registrar entradas de productos",
  "Revisar inventario",
  "Actualizar precios",
  "Registrar entradas de productos",
]);

// Función para completar y eliminar la tarea
const completeTask = (index: number) => {
  activities.value.splice(index, 1); // Elimina la actividad seleccionada
};

  cargarProductos();
</script>

<template>
       <header>
    <nav>
        <ComImagen/>
      <ul>
        <li><router-link to="/">Home</router-link></li>
      </ul>
    </nav>
    <hr>
  <hr id="l2">

  </header>

  <h1>¡Bienvenido Empleado!</h1>

  <p id="txt">Visualiza el inventario y tus tareas del día.</p>

  <hr id="l2">

  <div class="container">
    <h1 id="ac">Estas son tus actividades del día:</h1>
    <div class="activity-list">
      <div 
        class="activity" 
        v-for="(activity, index) in activities" 
        :key="index"
      >
        <div class="square" @click="completeTask(index)"></div>
        <p>{{ activity }}</p>
      </div>
      <p v-if="activities.length === 0" class="no-tasks">¡Todas las tareas completadas!</p>
    </div>
  </div>

  <img src="https://vizualmexico.com.mx/wp-content/uploads/2014/01/AE_perfil-profesional_1-1200x1800.jpg" alt="image" id="cara">
  <p id="jefe-name">
    Juanito Lilu
  </p>

  <aside class="sidebar">
    <h2 style="font-family: 'Jura', sans-serif" >Productos</h2>
    <ul style="justify-content: center; width: 313px;">
      <li v-for="producto in productos" :key="producto.id" style="font-family: 'Jura', sans-serif; margin: 17px; margin-left: -15px">
         <p>Nombre Producto: {{ producto.nombre }}</p>
      </li>
    </ul>
    <button id="b1"><router-link to="/GPEmpleados" >Ver mas</router-link></button>
  </aside>
  <aside class="sidebar-two">
    <h2 style="font-family: 'Jura', sans-serif" >Materia Prima</h2>
    <ul style="justify-content: center; width: 313px;">
      <li v-for="materia in Materia" :key="materia.id" style="font-family: 'Jura', sans-serif; margin: 17px; margin-left: -15px">
         <p>Nombre Producto: {{ materia.nombre }}</p>
      </li>
    </ul>
    <button id="b1"><router-link to="/GMAEmp" >Ver mas</router-link></button>
  </aside>

  <footer>
      <p>&copy; 2024 </p>
      
      <ul class="wrapper">
    <a href="https://www.instagram.com/de_lonuestro?igsh=MXU3NTQ4cGY4cXI2ZA==" target="_blank" rel="noopener noreferrer">

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
  h1{
    font-family: 'Jura', sans-serif;
  text-align: center;
  color: #D9AB23;
  margin-top: -23px
  }

 #txt {
font-family: 'Jura', sans-serif;
  text-align: center;
  color: #ffffff;
}

/* Contenedor principal */
.container {
  color: #cfa469; /* Color naranja */
  padding: 20px;
  font-family: Arial, sans-serif;
  margin-left: 900px;
  margin-top: 433px;
  width: 320px;
  position:absolute;
}

/* Estilo del título */
#ac {
  font-size: 30px;
  margin-bottom: 20px;
  text-align: left;
  color: #A65814;
  margin-left: -80px;
  width: 800px;
}

/* Lista de actividades */
.activity-list {
  background-color: #fff4d9; /* Color beige */
  padding: 20px;
  display: inline-block;
  margin-top: 12px;
  width: 400px;
  height: 230px;
  margin-left: -40px;
}

/* Actividad individual */
.activity {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

/* Cuadro de color */
.square {
  width: 20px;
  height: 20px;
  background-color: #8c3420; /* Color marrón */
  margin-right: 10px;
}

/* Texto de la actividad */
p {
  margin: 0;
  font-size: 14px;
  color: black;
}

#cara {
    margin-top: 98px;
    width: 350px;
    height: 350px;
    margin-left: 193px;
    border-radius: 170px 170px 170px 170px;
  }

  #jefe-name{
    text-align: left;
    margin-left: 250px;
    margin-top: -414px;
    color: #D9AB23;
    font-size: 34px;
    font-family: 'Jura', sans-serif;

  }

  .sidebar{
    color: white;
    border: solid 2px;
    border-radius: 15px;
    width: 570px;
    margin-left: 52%;
    text-align: center;
    max-height: 500px;
    padding: 12px;
    margin-top: 28%;
  }

  .sidebar p{
    color: #fff
  }
  .sidebar li{
    list-style: none;
  }


  .sidebar p{
    color: #fff
  }
  .sidebar li{
    list-style: none;
  }

  
  
  .sidebar-two{
    color: white;
    border: solid 2px;
    border-radius: 15px;
    width: 570px;
    margin-left: 10%;
    text-align: center;
    max-height: 500px;
    padding: 12px;
    margin-top: -191px;
    margin-top: -134px;

  }

  .sidebar-two p{
    color: #fff
  }
  .sidebar-two li{
    list-style: none;
  }


  .sidebar-two p{
    color: #fff
  }
  .sidebar-two li{
    list-style: none;
  }

  #b1 a{
    text-decoration: none;
    color: black;
  }

  #b1{
    background-color: #FFF1C6;
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;

  }
  
  footer {
      padding: 20px;
      text-align: center;
      margin-top: 84px;
  }
  
  footer nav ul {
      list-style: none;
      display: inline-block;
  }
  
  footer nav li {
      display: inline;
      margin: 0 10px;
  }

  footer p{
    font-family: 'Jura', sans-serif;
    color: #ffffff;
    margin-top: 53px;
  }
  
  footer a {
      text-decoration: none;
      color: #ffffff;
    font-family: 'Jura', sans-serif;

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