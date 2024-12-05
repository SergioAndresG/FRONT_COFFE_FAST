<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";  // Asegúrate de importar SweetAlert2

const isModalOpen = ref(false);

const formData = ref({
  id: null,
  nombre: "",
  descripcion: "",
  categoria: "COMIDA",
  Precio: 0,
  cantidad: 0,
  idUsuarioR: 0
});

const handleSubmit = async () => {
  try {
    // Enviar los datos del formulario al backend usando PUT
    const response = await axios.put(`http://localhost:8080/productos/${formData.value.id}`, {
      nombre: formData.value.nombre,
      descripcion: formData.value.descripcion,
      categoria: formData.value.categoria,
      precioUnitario: formData.value.Precio,
      cantidad: formData.value.cantidad,
      id_usuario: formData.value.idUsuarioR,
    });

    // Mensaje de éxito al actualizar el producto
    Swal.fire({
      icon: "success",
      title: "Producto actualizado",
      text: `El producto ${response.data.nombre} fue actualizado correctamente.`,
    });

    closeModal();
  } catch (error) {
    // Mensaje de error al actualizar el producto
    console.error("Error al actualizar el producto:", error);
    Swal.fire({
      icon: "error",
      title: "Error al actualizar el producto",
      text: "Hubo un problema al actualizar el producto. Intenta nuevamente.",
    });
  }
};

import { defineEmits } from 'vue';
const emit = defineEmits(['close']); // Emitir el evento 'close'

const closeModal = () => {
  emit('close');  // Emitir el evento para cerrar el modal
};
</script>

<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Formulario u otro contenido aquí -->
      <h1>Actualizar Producto</h1>
      <div class="form-container">
        <form @submit.prevent="handleSubmit">
          <label for="id">ID del Usuario:</label>
            <input
              type="number"
              id="id"
              v-model="formData.id"
              placeholder="Ingrese el ID del Producto"
              required
            />
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" v-model="formData.nombre" placeholder="Ingrese el nombre del producto" />

          <label for="descripcion">Descripción:</label>
          <input type="text" id="descripcion" v-model="formData.descripcion" placeholder="Ingrese una descripción corta" />

          <label for="categoria">Categoría:</label>
          <select id="categoria" v-model="formData.categoria" required>
            <option value="PLATO">Comida</option>
            <option value="BEBIDA">Bebida</option>
          </select>
          <label for="precio">Precio:</label>
          <input type="number" id="precio" v-model.number="formData.Precio" placeholder="Ingrese el precio" />

          <label for="cantidad">Cantidad:</label>
          <input type="number" id="cantidad" v-model.number="formData.cantidad" placeholder="Ingrese la cantidad" />

          <label for="idUsuario">ID Usuario:</label>
          <input type="number" id="idUsuario" v-model="formData.idUsuarioR" placeholder="Ingrese el ID del usuario que Actualiza" required />

          <button type="submit">Actualizar</button>
        </form>
      </div>

      <!-- Botón de cierre -->
      <button @click="closeModal" class="close-btn">Cerrar</button>
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

.form-container select{
  font-family: 'Jura', sans-serif;
  margin-bottom: 15px;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #cf9b00; /* Color amarillo similar */
  color: #000;
  font-size: 14px;
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
  background-color: black;
  margin-top: -53px;
  padding: 20px;
  width: 80%;
  height: 650px;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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


</style>