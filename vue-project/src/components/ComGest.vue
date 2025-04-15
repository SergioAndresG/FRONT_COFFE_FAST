<script setup lang="ts">
import ComImagen from './icons/IMGENES/ComImagen.vue';
import ComForAgregar from './ComForAgregar.vue';
import { onMounted, ref, computed } from 'vue';
import ComForDel from './ComForDel.vue';
import ComForAct from './ComForAct.vue';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'vue-router';

const empleados = ref([]); // Lista reactiva para almacenar los empleados
const searchTerm = ref("");

//funcion para boton para volver entre paginas
const router = useRouter();

const volver = () => {
  router.go(-1);
};

const filtrarProductos = computed (()=> {
  if(!searchTerm.value.trim()) return empleados.value;

  const term =searchTerm.value.toLowerCase().trim()
  return empleados.value.filter(pro => 
    pro.nombre.toLowerCase().includes(term)
  )
});


// Función para cargar empleados desde el backend
const cargarEmpleados = async () => {
  try {
    const respuesta = await axios.get("http://127.0.0.1:8000/usuarios");
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

const openModal = () => {
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
};
cargarEmpleados();
const Eliminar = () => {
  isModalOpen2.value = true;
};
cargarEmpleados();
const EliminarClose = () => {
  isModalOpen2.value = false;
};
cargarEmpleados();
const Actualizar = () => {
  isModalOpen3.value = true;
};
cargarEmpleados();
const ActualizarClose = () => {
  isModalOpen3.value = false;
};
cargarEmpleados();

</script>

<template>
  <header>
    <ComImagen style="margin-left: 41.5%;"/>
  </header>
  <div class="container-buttom-come-back"><button @click="volver" class="btn-come-back"><font-awesome-icon :icon="faArrowLeft" class="arrow-back"/>Regresar</button></div>
  <hr>

  <h1>Panel Usuarios</h1>

  <hr id="l2">
     <section class="button-container">
        <button @click="openModal" id="A">Agregar Trabajador</button>
        <button @click="Eliminar" id="A">Eliminar Trabajador</button>
        <button @click="Actualizar" id="A">Actualizar Trabajador</button>
     </section>
     <div class="search-bar">
    <input 
      type="text" 
      v-model="searchTerm" 
      placeholder="Buscar Usuarios..." 
      class="search-input"
      style="font-family: 'Jura', sans-serif;;"
    >
    <font-awesome-icon :icon="faSearch" class="search-icon"/>
  </div>
    <!-- Componente Modal -->
    <ComForAgregar v-if="isModalOpen" @close="closeModal" />
    <ComForDel v-if="isModalOpen2" @close="EliminarClose" />
    <ComForAct v-if="isModalOpen3" @close="ActualizarClose"/>

  <transition-group name="fade" tag="div" class="empleado-container">
  <div class="card2" v-for="empleado in filtrarProductos" :key="empleado.id">
    <div class="empleado-image">
      <img v-if="empleado.ruta_imagen" :src="`http://127.0.0.1:8000/usuarios/${empleado.ruta_imagen}`" class="empleado-image" />
        <span v-else>{{ empleado.imagen }}</span>
    </div>
    <div class="empleado-info">
        <div class="info-left">
          <p>Nombre: <span class="empleado-name"> {{ empleado.nombre }}</span></p>
          <p>Telefono: <span class="empleado-telefono">{{ empleado.telefono }}</span></p>
          <p>Correo: <span class="empleado-price">{{ empleado.correo }}</span></p>
        </div>
        <div class="info-right">
          <p>Documento: <span class="empleado-price">{{ empleado.documento }}</span></p>
          <p>Rol: <span class="empleado-price">{{ empleado.rol }}</span></p>

          
        </div>  
    </div>
    </div>

    <div v-if="filtrarProductos.length === 0" class="no-results">
          No se encontraron ingredientes que coincidan con la búsqueda.
        </div>
  </transition-group>  

   
    <footer>
      <p>&copy; 2025 </p>
  </footer>
</template>


  
<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Jura:wght@700&display=swap');
body{
  font-family: 'Jura', sans-serif;
  font-weight:normal;
}
header {
  padding: 10px;
  background-color: #000000;
}
.btn-come-back{
  width: 120px;
  height: 30px;
  border: none;
  border-radius: 10px;
  background-color: #faad14;
  font-family: 'Jura', sans-serif;
  display: flex;
  gap: 10px;
  justify-content: center;
  padding: 7px;
  transition: all 0.2s ease-in-out;
}
.btn-come-back:hover{
  background-color: #A65814;
  transform: scale(1.05);
  cursor:pointer;
}
.container-buttom-come-back{
  margin-top: -83px;
  margin-left: 10%;
  padding: 23px;
}
.arrow-back{
  margin-top: 1px;
}
hr {
  border-top: 2px solid #D9AB23;
  margin-top: 5px;
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
color: #D9AB23;
font-family: 'Jura', sans-serif;
}
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
.button-container {
    display: flex;
    gap: 10px;
    margin-top: 53px;
    justify-content: center;
}
#A{
  background-color: #A65814; 
    color: #FFFFFF;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    font-family: 'Jura', sans-serif;
    font-size: 14px;
    cursor: pointer;
    transition: 0.3s ease-in-out;
}
#A a{
  text-decoration: none;
  color: #ddd
}
#A:hover{
  background-color: #885b34;
  transform: translateY(-2px) scale(1.04);
}
.empleado-container {
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
  height: 480px;
  background-color: #A65814; 
  color: white;
  border-radius: 12px;
  text-align: left;
  font-size: 14px;
  padding: 19px;
  transition: transform 0.2s ease-in-out;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgb(72, 65, 65);
}
.card2:hover {
  border-color: #ff5900;
  box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.25);
  transform: scale(1.04);
  border-radius: 20px;
}

.empleado-info {
  display: flex;
  justify-content: space-between;
  margin-left: 25px;
}
.empleado-info p{
  font-size: 20px;
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
.empleado-image {
  width: 90%;
  height: 200px;
  border-radius: 10%;
  overflow: hidden;
  margin-left: 5.5%;
}
.empleado-name {
  color: rgb(255, 255, 255);
  display: block;

}
.empleado-id {
  margin-top: 300px;
}
.empleado-description {
    color: rgb(255, 255, 255);
    display: block;

}
.empleado-telefono {
    color: rgb(248, 247, 244);
    display: block;

}
.empleado-price {
    color: rgb(255, 255, 255);
    font-size: 1.1em;
}
.empleado-info span{
  font-size: 15px;
}
.info-left, .info-right {
  width: 50%;
}

.info-left p, .info-right p {
  margin: 20px;
  margin-left: -10px;
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

@media (max-width: 767px) {
  header {
    padding: 5px;
  }

  .container-buttom-come-back {
    margin-top: 10px;
    margin-left: 5%;
    padding: 10px;
  }

  .btn-come-back {
    width: 100px;
    height: 30px;
    font-size: 12px;
  }

  hr, #l2 {
    width: 90%;
    margin-left: 5%;
    margin-top: 10px;
  }

  h1 {
    font-size: 20px;
    margin-top: 10px;
  }

  .button-container {
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    gap: 10px;
  }

  #A {
    width: 80%;
    padding: 12px;
  }

  .search-bar {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .search-input {
    width: 80%;
    margin-left: 0;
    margin-top: 0;
  }

  .search-icon {
    display: none;
  }

  .empleado-container {
    width: 90%;
    margin-left: 5px;
    margin-top: 30px;
    grid-template-columns: 1fr;
    padding: 10px;
    gap: 20px;
  }

  .card2 {
    width: 90%;
    margin: 0 auto;
    height: auto;
    padding: 15px;
  }

  .empleado-image {
    width: 100%;
    height: 180px;
    margin-left: 0;
  }

  .empleado-info {
    flex-direction: column;
    margin-left: 0;
  }

  .info-left, .info-right {
    width: 100%;
  }

  .info-left p, .info-right p {
    margin: 10px 0;
  }

  /* Footer */
  footer {
    margin-top: 20px;
    padding: 15px;
  }

  /* Transiciones */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  .modal-overlay {
    align-items: flex-start;
    padding-top: 20px;
  }

  .modal-content {
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  }
}

  </style>