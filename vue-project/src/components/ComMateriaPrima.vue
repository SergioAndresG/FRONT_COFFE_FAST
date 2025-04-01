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

  <FormAddMateria v-if="AgregarMateria" @close="closeAdd"/>
  <FormActMateria v-if="ActualizarMateria" @close="closeAct"/>

  <div class="product-container">
  <div class="card2" v-for="materia in materias_primas" :key="materia.id">
    <div class="product-image">
      <img v-if="materia.ruta_imagen" :src="`http://127.0.0.1:8000/${materia.ruta_imagen}`" class="product-image" />
        <span v-else>{{ materia.imagen }}</span>
    </div>
      <div class="product-info">
        <div class="info-left">
        <p>ID:<span class="product-id">{{ materia.id }}</span></p>
        <p>Nombre: <span class="product-name">{{ materia.nombre }}</span></p>
      </div>
      <div class="info-right">
        <p>Cantidad: <span class="product-quantity">{{ materia.cantidad}} {{ materia.unidad.simbolo }} </span></p>
        <p>Categoría: <span class="product-price">{{ materia.categoria }}</span></p>
      </div>
    </div>
    <div class="product-buttons">
      <button class="delete-button" @click="(materia.id)">
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


.product-container {
  width: 1000px;
  margin-left: 16%;
  margin-top: 70px;
  display: grid;
  grid-template-columns: repeat(3, 1fr); 
  gap: 30px; 
  padding: 20px; 
  justify-content: center; 
}
.card2 {
  font-family: 'Jura', sans-serif;
  width: 320px;
  height: 460px;
  background-color: #ad850d;
  color: white;
  border-radius: 12px;
  text-align: left;
  font-size: 14px;
  padding: 25px;
  transition: transform 0.2s ease-in-out;
}

.card2:hover {
  transform: scale(1.05);
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
  background-color: #f5d881;
  color: rgb(0, 0, 0);
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