<script setup lang="ts">
import ComImagen from './icons/IMGENES/ComImagen.vue';
import { ref } from 'vue';
import axios from 'axios';


const empleados = ref(null);
const productos = ref(null);
const maxEmpleados = ref(30);
const maxProductos = ref(10);
const progresoEmpleados = ref(null);
const progresoProductos = ref(null);
const mostrarModal = ref(false); // Controla la visibilidad del modal

const obtenerEstadisticas = async () => {
  try {
    const response = await axios.get("http://localhost:8080/usuarios/estadisticas");
    const { empleados: empleadosCount, productos: productosCount, maxEmpleados: maxEmp, maxProductos: maxProd } = response.data;
    
    empleados.value = empleadosCount;
    productos.value = productosCount;
    maxEmpleados.value = maxEmp;
    maxProductos.value = maxProd;
    
    // Calcular el progreso basado en los valores obtenidos
    progresoEmpleados.value = (empleados.value / maxEmpleados.value) * 100;
    progresoProductos.value = (productos.value / maxProductos.value) * 100;
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
  }
};

const abrirModal = () => {
  mostrarModal.value = true; // Abre el modal
};

const cerrarModal = () => {
  mostrarModal.value = false; // Cierra el modal
};

// Llamar la función cuando el componente esté montado
obtenerEstadisticas();

</script>

<template>
   <header>
    <nav>
        <ComImagen/>
      <ul>
        <li><router-link to="/">HOME</router-link></li>
        <li><a href="/Sesion">Empleados</a></li>
        <li><a href="/Sesion">Administradores</a></li>
      </ul>
    </nav>
    <hr>
  <hr id="l2">
  </header>

  <h1>¡Bienvenido Jefe!</h1>
  <hr id="l2">

  <p id="txt">Como Jefe de tu emprendimiento tienes control total de tu equipo y negocio</p>

  <img src="https://www.blixt.tv/wp-content/uploads/2018/10/retrato-corporativo.jpg" alt="image" id="cara">

  <p id="jefe-name">
    Abudabi dabi
  </p>



  

  <section id="container-pro">
    <div class="progress-container">
      <div class="progress-label">
        <span>Empleados</span>
        <span>{{ empleados }}</span>
      </div>
      <div class="progress-bar">
        <div
          class="progress-bar-inner"
          :style="{ width: progresoEmpleados + '%' }"
        ></div>
      </div>
    </div>
    <div class="progress-container">
      <div class="progress-label">
        <span>Productos</span>
        <span>{{ productos }}</span>
      </div>
      <div class="progress-bar">
        <div
          class="progress-bar-inner"
          :style="{ width: progresoProductos + '%' }"
        ></div>
      </div>
    </div>
    <div class="button-container">
      <button id="b1" @click="abrirModal">Ver</button>
    </div>
  </section>

  <!-- Modal -->
  <div v-if="mostrarModal" class="modal-overlay">
    <div class="modal-content">
      <h2>Detalles de Estadísticas</h2>
      <p><strong>Empleados:</strong> {{ empleados }}</p>
      <p><strong>Productos:</strong> {{ productos }}</p>
      <button @click="cerrarModal">Cerrar</button>
    </div>
  </div>
  
    <section id="c">
      <p id="in">
        Gestion de Usuarios
      </p>
      <p id="vis">Visualiza y añade tus empleados</p>
      <div class="button-container2">
        <button id="v"><a href="/Gest">Ver mas</a></button>
      </div>
    </section>

    <div class="alert-config-container">
        <h1 class="alert-config-title">Configuración de Materia Prima</h1>
        <button class="alert-config-button"><a href="/Materia">Ver mas</a></button>
    </div>
    <div class="alert-config-container2">
        <h1 class="alert-config-title">Configuración de Productos.</h1>
        
        <button class="alert-config-button"><a href="/Productos">Ver mas</a></button>
    </div>

    <footer>
      <p>&copy; 2024 </p>
      
  <ul class="wrapper">
    <li class="icon facebook">
      <span class="tooltip">Facebook</span>
      <svg
        viewBox="0 0 320 512"
        height="1.2em"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
        ></path>
      </svg>
    </li>
    <li class="icon twitter">
  <span class="tooltip">X</span>
  <svg
    height="1.8em"
    fill="currentColor"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    class="x-icon"
  >
    <path
      d="M12 10 L36 38 M36 10 L12 38"
      stroke="currentColor"
      stroke-width="4"
      fill="none"
    ></path>
  </svg>
</li>
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
  </ul>
  
  </footer>

  </template>
  
  <style scoped>

@import url('https://fonts.googleapis.com/css2?family=Jura:wght@700&display=swap');

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  font-family: 'Jura', sans-serif;
  background: #000000;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  height: 200px;
  z-index: 9999;
}

.modal-content h2 {
  font-family: 'Jura', sans-serif;
  margin-bottom: 20px;
  margin-left: 3%;
  font-size: 22px;
}

.modal-content button {
  font-family: 'Jura', sans-serif;
  margin-top: 23px;
  background: #D9AB23;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.modal-content button:hover {
  background: #8F1A2C;
}
#get{
  text-decoration: none;
  color: black;
}

#get:hover{
    color: #e6e6e6;
}

  #b1{
    margin-left: 192px;
    width: 200px;
  }

    body{
    font-family: 'Jura', sans-serif;
    font-weight:normal;
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

#d {
  color: aliceblue;
  padding: 20px 0; /* Añade algo de espacio arriba y abajo */
  text-align: center; /* Centra el texto dentro de la sección */
  box-sizing: border-box; /* Asegura que el padding no afecte el ancho total */
  margin-top: 20px;
  font-family: 'Jura', sans-serif;
  
}

body {
    font-family: 'Jura', sans-serif;
    font-weight: normal;
    color: black; /* Cambiado aquí */
}
  
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

  #cara {
    margin-top: 94px;
    width: 300px;
    height: 350px;
    margin-left: 623px;
    border-radius: 170px 170px 170px 170px;
  }

  #jefe-name{
    text-align: center;
    margin-top: -414px;
    color: #D9AB23;
    font-size: 34px;
    font-family: 'Jura', sans-serif;

  }

#container-pro{
    margin-top: 115px;
}

.progress-container {
    width: 80%;
    max-width: 400px;
    margin-bottom: 20px;
    margin-left: 150px;
    margin-top: 34px;
}

.progress-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: 14px;
    font-family: 'Jura', sans-serif;
    margin-top: 23px;

}

.progress-bar {
    background-color: #f2d2d0;
    border-radius: 10px;
    overflow: hidden;
    height: 15px;
    position: relative;
    
}

.progress-bar-inner {
    height: 100%;
    background-color: #A65814;
    width: 50%; /* Ajusta el ancho según el progreso */
}

.button-container {
    display: flex;
    justify-content: space-between;
    width: 80%;
    max-width: 400px;
    margin-left: 60px;
    margin-top: 23px;
    
}

.button-container button {
    background-color: #FFF1C6;
    color: black;
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.button-container button:hover {
    background-color: #A65814;
    color: white;
}
  

.message-container{
  color: white;
  background-color: #1877f2;
  height: 200px;
  width: 200px;
  margin-left: 163px;
  text-align: center;
}

.message-container h2{
  color: white;
}

.message-container ul{
  color: white;
}

.list-message{
  color: white;
  background-color: #8F1A2C;
  width: 100px;
  height: 100px
}

#c{
  width: 510px;
  height: 350px;
  margin-left: 990px;
  margin-top: -300px;
  border-radius: 50px;
  border: 1px solid #D9AB23; 
}

#in {
  color: #D9AB23;
  padding: 34px;
  margin-left: 104px;
  font-size: 23px;
  font-family: 'Jura', sans-serif;
}

.button-container2 {
    display: flex;
    justify-content: space-between;
    width: 80%;
    max-width: 400px;
    margin-left: 208px;
    margin-top: 51px;
    
}
.button-container2 button {
  font-family: 'Jura', sans-serif;
  background-color: #D99923;
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}
.button-container2 button a {
  text-align: center;
  text-decoration: none;
  color: white;

}
.button-container2 button:hover {
    background-color: #f2d2d0;
    color: black
}

#vis{
    margin-left: 120px;
  font-family: 'Jura', sans-serif;

}

#g{
  color: #F0947F;
  font-size: 29px;
  margin-top: 10px;
  margin-left: -40px;
}
#p{
  margin-left: -990px;
  color: #8F1A2C;
  text-decoration: underline;
}
#a{
  background-color: #f2d2d0;
    color: #8F1A2C;
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-left: 34px;
    margin-top: 24px;
    margin-left: -19px
}
h2{
  margin-left: -112px;
  font-size: 15px;
  margin-top: 10px;
  color: #8F1A2C;
}

/* Estilo del contenedor principal */
.alert-config-container2 {
        background-color: #D9AB23; /* Color de fondo del contenedor */
        padding: 20px;
        border-radius: 30px 30px 30px 30px; /* Bordes redondeados en la parte superior */
        text-align: center; /* Centrar el texto */
        width: 30%; /* Ancho del contenedor */
        margin: 0 auto; /* Centrar el contenedor en la página */
        margin-left: 264px;
        margin-top: -120px;
    }
.alert-config-container {
        background-color: #D9AB23; /* Color de fondo del contenedor */
        padding: 20px;
        border-radius: 30px 30px 30px 30px; /* Bordes redondeados en la parte superior */
        text-align: center; /* Centrar el texto */
        width: 30%; /* Ancho del contenedor */
        margin: 0 auto; /* Centrar el contenedor en la página */
        margin-left: 804px;
        margin-top: 50px;
    }

    /* Estilo del título con línea personalizada debajo */
    .alert-config-title {
        font-size: 24px;
        color: #fff;
        position: relative;
        display: inline-block;
        margin-bottom: 20px;
    }

    .alert-config-title::after {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -10px;
        width: 60%; /* Ancho de la línea */
        height: 3px; /* Grosor de la línea */
        background-color: black; /* Color de la línea */
    }

    /* Estilo del texto de descripción */
    .alert-config-description {
        font-size: 16px;
        color: #ffe0e0; /* Color del texto de descripción */
        margin-bottom: 30px;
    }

    /* Estilo del botón */
    .alert-config-button {
        background-color: #fff;
        color: black;
        padding: 10px 30px;
        border: none;
        border-radius: 20px; /* Bordes redondeados del botón */
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .alert-config-button a{
      color: #000000;
      text-decoration: none;
    }

    .alert-config-button:hover {
        background-color: #e6e6e6; /* Color de fondo al pasar el ratón */
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
  
  .wrapper .facebook:hover,
  .wrapper .facebook:hover .tooltip,
  .wrapper .facebook:hover .tooltip::before {
    background: #1877f2;
    color: #fff;
  }
  
  .wrapper .twitter:hover,
  .wrapper .twitter:hover .tooltip,
  .wrapper .twitter:hover .tooltip::before {
    background: #000000;
    color: #fff;
  }
  
  .wrapper .instagram:hover,
  .wrapper .instagram:hover .tooltip,
  .wrapper .instagram:hover .tooltip::before {
    background: #e4405f;
    color: #fff;
  }

  </style>