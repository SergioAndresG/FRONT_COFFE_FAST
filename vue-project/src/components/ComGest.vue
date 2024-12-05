<script setup lang="ts">
import ComImagen from './icons/IMGENES/ComImagen.vue';
import ComForAgregar from './ComForAgregar.vue';
import { onMounted, ref } from 'vue';
import ComForDel from './ComForDel.vue';
import ComForAct from './ComForAct.vue';
import axios from "axios";
import ComConsutUsu from './ComConsutUsu.vue';

const empleados = ref([]); // Lista reactiva para almacenar los empleados

// Función para cargar empleados desde el backend
const cargarEmpleados = async () => {
  try {
    const respuesta = await axios.get("http://localhost:8080/usuarios");
    empleados.value = respuesta.data.map(empleado => ({
      ...empleado,
    }));
  } catch (error) {
    console.error("Error al cargar empleados:", error);
  }
};
// Llamar a cargarEmpleados cuando el componente se monte
onMounted(() => {
  cargarEmpleados();
});

const isModalOpen = ref(false);
const isModalOpen2 = ref(false);
const isModalOpen3 = ref(false);
const isModalOpen4 = ref(false);


const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const Eliminar = () => {
  isModalOpen2.value = true;
};

const EliminarClose = () => {
  isModalOpen2.value = false;
};

const Actualizar = () => {
  isModalOpen3.value = true;
};

const ActualizarClose = () => {
  isModalOpen3.value = false;
};

const Consultar = () => {
  isModalOpen4.value = true
}

const ConsultarClose = () => {
  isModalOpen4.value = false
}
</script>

<template>
          <header>
    <nav>
      <ComImagen/>
      <div class="menu-hamburguesa" id="menu-hamburguesa">
        <ul class="menu">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/Nosotros">Nosotros</router-link></li>
        </ul>
      </div>
    </nav>
  </header>
  <hr>
  <hr id="l2">

  <h1>¡Bienvenido a la administración de usuarios!</h1>
  <p id="txt">Tienes la capacidad de manejar los usuarios de tu emprendimiento.</p>

  <hr id="l2">

 
    <div>
        <div>
    <!-- Botón que abre el modal -->
     <section id="button2-container">
        <button @click="openModal" id="A">Agregar Trabajador</button>
        <button @click="Eliminar" id="A">Eliminar Trabajador</button>
        <button @click="Actualizar" id="A">Actualizar Trabajador</button>
        <button @click="Consultar" id="A">Consultar Trabajador</button>
     </section>
     
    <!-- Componente Modal -->
    <ComForAgregar v-if="isModalOpen" @close="closeModal" />
    <ComForDel v-if="isModalOpen2" @close="EliminarClose" />
    <ComForAct v-if="isModalOpen3" @close="ActualizarClose" />
    <ComConsutUsu v-if="isModalOpen4" @close="ConsultarClose" />

  </div>
  </div>

  <div class="product-container">
    <div class="card2" v-for="empleado in empleados" :key="empleado.id" style="font-family: 'Jura', sans-serif;">
      <img v-if="empleado.rutaImagen" :src="`http://localhost:8080/imagenes/${empleado.rutaImagen}`"  class="product-image"/>
      <p>ID: <span class="product-id">{{ empleado.id }}</span></p>
      <div class="product-info">
        <p>Nombre: <span class="product-name">{{ empleado.nombre }}</span></p>
        <p>Documento: <span class="product-description">{{ empleado.documento }}</span></p>
      </div>
    </div>
  </div>  

   
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
  #b1{
    margin-left: 192px;
  }

    body{
    font-family: 'Jura', sans-serif;
    font-weight:normal;
  }

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px;
  background-color: #8f1a2c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #f0947f;
}

#d {
  background-color: #8F1A2C;
  color: aliceblue;
  width: 100%; /* Asegura que la sección ocupe todo el ancho */
  padding: 20px 0; /* Añade algo de espacio arriba y abajo */
  text-align: center; /* Centra el texto dentro de la sección */
  box-sizing: border-box; /* Asegura que el padding no afecte el ancho total */
  margin-top: 20px;
  margin-left: 1px;
  border-radius: 0px 0px 50px 50px;
  
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

  h1, #txt {
  text-align: center;
  color: #A65814;
  font-family: 'Jura', sans-serif;
}

  .progress-container {
    width: 100%;
    max-width: 800px;
    margin-bottom: 20px;
    margin-left: 360px;
    margin-top: 23px;
 }

    .progress-label {
    font-family: 'Jura', sans-serif;

        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        font-size: 14px;
    }

    .progress-bar {
        background-color: #a658144e;
        border-radius: 10px;
        overflow: hidden;
        height: 15px;
        position: relative;
    }

    .progress-bar-inner {
        height: 100%;
        background-color: #D9AB23;
        width: 50%; /* Ajusta el ancho según el progreso */
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
  background-color: #1a1a1a;
  color: white;
  border-radius: 12px;
  text-align: center;
  padding: 15px;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.card2:hover {
  transform: scale(1.05);
  border-radius: 20px;
}

.product-image {
  border: solid #000000;
  width: 60%;
  height: 150px;
  border-radius: 10%;
  overflow: hidden;
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
  background-color: #d9ab23;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 15px;
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

    .employee-actions button {
    background-color: #A65814;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    margin-left: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  font-family: 'Jura', sans-serif;

    }

    .employee-actions button:hover {
    background-color: #A65814;
    }

    #A{
    font-family: 'Jura', sans-serif;
    list-style: none;
    margin-top: 23px;
    padding: 12px;
    color: #ddd;
    background-color: #D9AB23;
    border-radius: 50px;
    cursor: pointer;
    transition: background-color 0.3s;
}
#A a{
  text-decoration: none;
  color: #ddd
}
#A:hover{
  background-color: #A65814;
  color: #333;
}
    .button-container button {
    font-family: 'Jura', sans-serif;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    }

    .button-container button:hover {
    background-color: #A65814;
    }

    #button2-container{
        display: flex; 
        justify-content: space-around; 
        align-items: center; 
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

  footer p{
    font-family: 'Jura', sans-serif;

  }
  
  footer a {
      text-decoration: none;
      color: #333;
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



  @media screen and (min-width: 280px) and (max-width: 490px) {
    .menu-hamburguesa {
    position: fixed;
    top: 50px;
    right: 20px;
    z-index: 1000; /* Esto me asegura que el menu este encima del resto del contenido */
    }

    .menu-icon {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 40px;
      height: 30px;
      cursor: pointer;
    }

    .menu-icon span {
      display: block;
      height: 4px;
      background-color: #BF8B8F;
      margin-bottom: 5px;
    }

    #menu-toggle {
      display: none;
    }

    .menu {
      position: fixed;
      top: 5;
      right: -250px; 
      height: 90vh;
      width: 170px;
      background-color: #fff;
      list-style: none;
      padding: 50px 20px;
      box-shadow: -2px 0px 5px rgba(239, 179, 179, 0.716);
      transition: right 0.3s ease-in-out;
    }

    .menu li {
      margin: 20px 0;
    }

    .menu li a, .menu li router-link {
      text-decoration: none;
      color: #333;
    }

    #menu-toggle:checked + .menu-icon + .menu {
      right: 0; /*Este mueve el menu dentro de la pantalla */
    }

    #menu-toggle:checked + .menu-icon span:nth-child(1) {
      transform: rotate(45deg);
      position: relative;
      top: 12px;
    }

    #menu-toggle:checked + .menu-icon span:nth-child(2) {
      opacity: 0;
    }

    #menu-toggle:checked + .menu-icon span:nth-child(3) {
      transform: rotate(-45deg);
      position: relative;
      top: -8px;
    }
    nav ul {
      flex-direction: column;
      margin-left: 0;
      margin-top: 10px;
    }

    nav li {
      margin-bottom: 10px;
    }

    #l2, hr {
      width: 100%;
      margin-left: 0;
      margin-top: 30px;
    }


    .progress-container {
      margin-left: 0;
      width: 100%;
      margin-top: 60px;
    }

    .sidebar {
    width: 200px;
    background-color: #f2d2d0;
    padding: 20px;
    border-radius: 10px;
    margin-left: 10px;
    }
    .employee-actions button {
    align-items: center;
    }
    footer {
      padding: 10px;
      font-size: 12px;
    }

    .wrapper {
      height: auto;
      padding-top: 20px;
    }

    .wrapper .icon {
      width: 40px;
      height: 40px;
      font-size: 16px;
    }

    .wrapper .tooltip {
      font-size: 12px;
      padding: 3px 5px;
    }
 
  }
  </style>