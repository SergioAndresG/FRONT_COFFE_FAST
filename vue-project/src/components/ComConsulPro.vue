<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

// Propiedades reactivas
const idProducto = ref(null);
const producto = ref(null); // Almacena los datos del producto

// Función para consultar el producto por id
const handleSubmit = async () => {
  if (!idProducto.value) {
    alert("Por favor, ingresa un ID válido.");
    return;
  }

  try {
    const respuesta = await axios.get(`http://127.0.0.1:8000/productos/${idProducto.value}`);
    producto.value = respuesta.data; // Asigna los datos del producto
  } catch (error) {
    console.error("Error al consultar producto:", error);
    alert("Producto no encontrado o error en la consulta.");
    producto.value = null; // Limpia los datos si hay error
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
          <label for="idProducto">ID del Producto:</label>
          <input
            type="text"
            id="idProducto"
            v-model="idProducto"
            placeholder="Ingrese el ID del Producto"
          />
          <button type="submit">Consultar</button>
        </form>

        <!-- Mostrar información del producto si existe -->
        <div v-if="producto" id="container">
          <h3>Información del Producto</h3>
          <p><strong>Nombre:</strong> {{ producto.nombre }}</p>
          <p><strong>Cantidad:</strong> {{ producto.cantidad }}</p>
          <p><strong>Precio unidad:</strong> {{ producto.precio_unitario }}</p>
        </div>
      </div>

      <button class="close-btn" @click="cerrarModal">Cerrar</button>
    </div>
  </div>
</template>

  
  <style scoped>
  h1{
    font-family: 'Jura', sans-serif;
    font-size: 24px;
    text-align: center;
    color: #ffd700;

  }
  /* Estilo del formulario */
.form-container {
  background-color: #ffff0677; /* Fondo negro */
  padding: 15px;
  width: 300px;
  margin: 0 auto;
  border-radius: 8px;
  margin-top: -2px;
  width: 400px;
}

form {
  display: flex;
  flex-direction: column;
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
  background-color: #cf9b00; /* Color amarillo similar */
  color: #000;
  font-size: 14px;
}

input::placeholder {
  color: #000;
  opacity: 0.8;
}

button {
  background-color: #ffecb3; /* Botón amarillo claro */
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
  margin-top: 10px;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 20px;
}

.close-btn:hover {
  background-color: darkred;
}

#container{
    text-align: center;
    font-family: 'Jura', sans-serif;
}
  </style>