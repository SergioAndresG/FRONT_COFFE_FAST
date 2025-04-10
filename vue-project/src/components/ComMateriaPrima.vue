<script setup lang="ts">
import Swal from 'sweetalert2';
import { ref } from 'vue';
import axios from 'axios';
import ComImagen from './icons/IMGENES/ComImagen.vue';
import FormAddMateria from './FormAddMateria.vue';
import FormActMateria from './FormActMateria.vue';

// Productos predefinidos para mostrar
  const materias_primas = ref([]);

  const cargarMateriasPrimas = async () => {
    try {
      const respuesta = await axios.get("http://127.0.0.1:8000/materia");
      materias_primas.value = respuesta.data; // Asigna los datos de la respuesta
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

cargarMateriasPrimas();

const eliminarMateria = async (idMateria: number) => {
  try {
    // Realizar la solicitud DELETE al backend enviando solo el ID en el cuerpo de la solicitud
    const response = await axios.delete(`http://localhost:8080/materia/${idMateria}`);

    console.log("Materia eliminada con éxito", response.data);

    // Recargar la lista de materias para reflejar los cambios
    cargarMateriasPrimas();
  } catch (error) {
    console.error("Error al eliminar la materia:", error);
  }
};


const ActualizarMateria = ref(false);
const AgregarMateria = ref(false);

const openAct = () => {
  ActualizarMateria.value = true;
}
cargarMateriasPrimas();

const closeAct = () => {
  ActualizarMateria.value = false;
}
cargarMateriasPrimas();

const openAdd = () => {
  AgregarMateria.value = true;
};
cargarMateriasPrimas();

const closeAdd = () => {
  AgregarMateria.value = false;
};
cargarMateriasPrimas();
</script>

<template>
  <header>
    <nav>
      <ComImagen class="logo"/>
      
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

  <FormAddMateria v-if="AgregarMateria" @close="closeAdd"/>
  <FormActMateria v-if="ActualizarMateria" @close="closeAct"/>

  <div class="product-container">
  <div class="card2" v-for="materia in materias_primas" :key="materia.id">
    <div class="product-image">
      <img v-if="materia.ruta_imagen" :src="`http://127.0.0.1:8000/${materia.ruta_imagen}`" class="product-image" />
      <span v-else>{{ materia.imagen }}</span>
    </div>
    <div class="product-info">
      <p class="product-name-label">{{ materia.nombre }}</p>
      <div class="info-details">
        <p>ID: <span class="product-id">{{ materia.id }}</span></p>
        <p>Cantidad: <span class="product-quantity">{{ materia.cantidad}} {{ materia.unidad.simbolo }}</span></p>
        <p>Fecha Vencimiento: <span class="product-price">{{ materia.fecha_vencimiento }}</span></p>
      </div>
    </div>
    <div class="product-buttons">
      <button class="delete-button" @click="eliminarMateria(materia.id)">
        Eliminar
      </button>
    </div>
  </div>
</div>

  <footer>
      <p>&copy; 2024 </p>  
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
hr {
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
  font-family: Arial, sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: 'Jura', sans-serif;
}
.custom-button:hover {
  background-color: #D9AB23;
}
.product-container {
  width: 100%;
  max-width: 1200px;
  margin: 70px auto 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 20px;
  justify-content: center;
}

.card2 {
  font-family: 'Jura', sans-serif;
  width: 90%;
  height: auto;
  min-height: 400px;
  background-color: #ad850d;
  color: white;
  border-radius: 12px;
  text-align: left;
  font-size: 14px;
  padding: 20px;
  transition: transform 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
}

.card2:hover {
  transform: scale(1.03);
  border-radius: 20px;
}

.product-image {
  width: 70%;
  height: 150px;
  border-radius: 10%;
  overflow: hidden;
  margin: 0 auto 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-name-label {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
  color: #ffffff;
}

.info-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-details p {
  margin: 0;
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-details span {
  font-size: 16px;
  color: #f5f5f5;
}

.product-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.delete-button {
  background-color: #f5d881;
  color: rgb(0, 0, 0);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
  width: 100%;
  max-width: 200px;
}

.delete-button:hover {
  background-color: #c89a1f;
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
@media (max-width: 767px) {
  .logo{
    margin-left: -28%;
    margin-top: 15%;
  }
  hr {
    margin-left: 9%;
    width: 300px;
    margin-top: -1rem;
  }
  #l2 {
    margin-top: 5px;
    margin-left: 23%;
    width: 200px;
  }
  #l3 {
    margin-top: 5px;
    margin-left: 23%;
    width: 200px;
  }
  .button-container{
    margin: 0;
    padding: 2vh;
  }
  .product-container {
    grid-template-columns: 1fr;
    width: 97%;
    margin: 30px auto 0;
    gap: 12px;
    padding: 10px;
  }
  .card2 {
    min-height: auto;
    padding: 12px;
    flex-direction: row;
    border-radius: 8px;
    height: auto;
  }
  .card2:hover {
    transform: scale(1.02);
    border-radius: 8px;
  }
  .product-image {
    width: 30%;
    height: 90px;
    margin: 0;
    border-radius: 6px;
    flex-shrink: 0;
  }
  .product-info {
    width: 70%;
    padding-left: 12px;
    justify-content: center;
  }
  .product-name-label {
    font-size: 18px;
    margin-bottom: 8px;
    text-align: left;
  }
  .info-details {
    gap: 6px;
  }
  
  .info-details p {
    font-size: 14px;
  }
  
  .info-details span {
    font-size: 13px;
  }
  
  .product-buttons {
    position: absolute;
    right: 10px;
    bottom: 12px;
    margin: 0;
  }
  
  .delete-button {
    font-size: 12px;
    padding: 6px 12px;
    max-width: none;
  }
}

</style>