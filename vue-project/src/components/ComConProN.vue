//CONSULTA PRODUCTOS POR NOMBRE

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const router = useRouter();

// Propiedades reactivas
const nombreProducto = ref(""); 
const producto = ref(null); // Almacena los datos del producto

//funcion para consultar el producto por nombre
const handleSubmit = async () => {
  if (!nombreProducto.value) {  
    alert("Por favor, ingresa un nombre válido.");
    return;
  }

  producto.value = null

  try {
    const respuesta = await axios.get(`http://127.0.0.1:8000/productos/consulta-nombre/${nombreProducto.value}`);
    producto.value = respuesta.data;
  } catch (error) {
    console.error(nombreProducto.value, "Error al consultar producto:", error);
    producto.value = null;
    Swal.fire({
      title: "Producto no encontrado o error en la consulta",
      icon: "error"
    }) 
  }
};

// Redirigir al cerrar el modal
const cerrarModal = () => {
  router.push('/Productos');
};
</script>


<template>
  <div class="modal-overlay" @click="cerrarModal">
    <div class="modal-content" @click.stop>
      <h1>Consultar Producto</h1>
      <div class="form-container">
        <form @submit.prevent="handleSubmit">
          <label for="nombreProducto">Nombre del Producto:</label>
          <input
            type="text"
            id="nombreProducto" 
            v-model="nombreProducto" 
            placeholder="Ingrese el nombre del Producto"
          />
          <button type="submit">Consultar</button>
        </form>
        <transition name="fade-expand">
          <div v-if="producto" id="container">
            <h3>Información del Producto</h3>
            <p><strong>ID:</strong> {{ producto.id }}</p>
            <p><strong>Nombre:</strong> {{ producto.nombre }}</p>
            <p><strong>Cantidad:</strong> {{ producto.cantidad }}</p>
            <p><strong>Precio:</strong> {{ producto.precio_unitario }}</p>
          </div>
        </transition>
      </div>

        <img v-if="producto && producto.ruta_imagen" :src="`http://127.0.0.1:8000/productos/${producto.ruta_imagen}`" alt="Producto" class="imagen"  />
          <img v-else src="@/components/icons/IMGENES/breads-1867459_1280.jpg" alt="Producto" class="imagen" />
      </div>
    <button class="close-btn" @click="cerrarModal">X</button>
  </div>
</template>

  
  <style scoped>
  h1{
    font-family: 'Jura', sans-serif;
    font-size: 24px;
    margin-left: 60px;
    color: #ffd700;

  }
  /* Estilo del formulario */
.form-container {
  background-color: #49494830; 
  padding: 15px;
  width: 300px;
  margin: 0 auto;
  border-radius: 8px;
  margin-top: 50px;
  width: 500px;
  height: 370px;
  margin-left: 50px;
  border: 3px solid ;
}



form {
  display: flex;
  flex-direction: column;
}


#container {
  background-color: #A65814;
  color: black; 
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 460px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 8px;
  text-align: center;
  font-family: 'Jura', sans-serif;
}

label {
  color: #fff; /* Texto blanco */
  font-size: 10px;
  margin-bottom: 5px;
  font-family: 'Jura', sans-serif;
    text-align: center;
}

input {
    font-family: 'Jura', sans-serif;
  margin-bottom: 15px;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #cf9b00; 
  color: #000;
  font-size: 14px;
}

input::placeholder {
  color: #000;
  opacity: 0.8;
}

button {
  background-color: #ffecb3; 
  color: #000;
  padding: 10px 15px;
  font-size: 14px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s ease;
  font-family: 'Jura', sans-serif;

}

button:hover {
  background-color: #ffd700;
}


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  position: relative;
  background-color: black;
  margin-top: -33px;
  padding: 20px;
  width: 80%;
  height: 410px;
  max-width: flex;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close-icon:hover {
  color: red;
}

.close-btn {
  background-color: red;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  margin-top: -520px;
  margin-left: 700px;
}

.close-btn:hover {
  background-color: darkred;
}

.imagen {
  display: flex;
  width: 420px; 
  height: 420px;
  border-radius: 50%;
  object-fit:cover; 
  margin-left: 700px;
  margin-top: -200px;
  transform: translateY(-50%);
  transition: opacity 0.5s ease-in-out;
}

.image-container img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

/*Animacion para expandir el contenedor */
.fade-expand-enter-active, .fade-expand-leave-active {
  transition: max-height 0.5s ease-out, opacity 0.3s ease-in-out;
  overflow: hidden;
}

.fade-expand-enter-from, .fade-expand-leave-to {
  max-height: 0;
  opacity: o;
}

.fade-expand-enter-to, .fade-expand-leave-from {
  max-height: 250px;
  opacity: 1;

}
  </style>