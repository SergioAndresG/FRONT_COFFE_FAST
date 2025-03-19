<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

// Form data para actualizar materia prima
const formData = ref({
  id: null,
  nombre: "",
  cantidad: null,
  ruta_imagen: "",
  stock_minimo: null,
  fecha_ingreso: "",
  vida_util_dias: null,
  unidad_id: null,
});

// Método para manejar el envío del formulario
const handleSubmit = async () => {
  try {
    // Validar datos antes de enviarlos
    if (
      !formData.value.id ||
      !formData.value.nombre ||
      formData.value.cantidad === null ||
      formData.value.stock_minimo === null ||
      !formData.value.fecha_ingreso ||
      formData.value.vida_util_dias === null ||
      formData.value.unidad_id === null
    ) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    // Realizar la solicitud PUT al backend
    const response = await axios.put(
      `http://localhost:8080/materia/${formData.value.id}`,
      formData.value
    );

    alert("Materia Prima actualizada con éxito: " + response.data.nombre);

    // Limpiar el formulario después de enviar
    formData.value.id = null;
    formData.value.nombre = "";
    formData.value.cantidad = null;
    formData.value.ruta_imagen = "";
    formData.value.stock_minimo = null;
    formData.value.fecha_ingreso = "";
    formData.value.vida_util_dias = null;
    formData.value.unidad_id = null;

    // Cerrar el modal después de enviar
    closeModal();
  } catch (error) {
    console.error("Error al actualizar la Materia Prima:", error);
    alert(
      "Hubo un problema al actualizar la Materia Prima. Verifique los datos e intente nuevamente."
    );
  }
};

// Emitir evento para cerrar el modal
import { defineEmits } from "vue";
const emit = defineEmits(["close"]);
const closeModal = () => {
  emit("close");
};
</script>

<template>
  <div class="modal-overlay" @click="closeModal">
    <h1 class="titulo">Actualizar Materia Prima</h1>
    <div class="modal-content" @click.stop>
      <div class="form-container">
        <form @submit.prevent="handleSubmit">
          <label for="id">ID:</label>
          <input
            type="number"
            id="id"
            v-model="formData.id"
            placeholder="Ingrese el ID de la Materia Prima"
            required
          />

          <label for="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            v-model="formData.nombre"
            placeholder="Ingrese el nombre de la Materia Prima"
            required
          />

          <label for="cantidad">Cantidad:</label>
          <input
            type="number"
            id="cantidad"
            v-model="formData.cantidad"
            placeholder="Ingrese la cantidad"
            required
          />

          <label for="ruta_imagen">Ruta de la Imagen:</label>
          <input
            type="text"
            id="ruta_imagen"
            v-model="formData.ruta_imagen"
            placeholder="Ingrese la ruta de la imagen"
          />

          <label for="stock_minimo">Stock Mínimo:</label>
          <input
            type="number"
            id="stock_minimo"
            v-model="formData.stock_minimo"
            placeholder="Ingrese el stock mínimo"
            required
          />

          <label for="fecha_ingreso">Fecha de Ingreso:</label>
          <input
            type="date"
            id="fecha_ingreso"
            v-model="formData.fecha_ingreso"
            placeholder="Ingrese la fecha de ingreso"
            required
          />

          <label for="vida_util_dias">Vida Útil (días):</label>
          <input
            type="number"
            id="vida_util_dias"
            v-model="formData.vida_util_dias"
            placeholder="Ingrese la vida útil en días"
            required
          />

          <label for="unidad_id">ID de la Unidad:</label>
          <input
            type="number"
            id="unidad_id"
            v-model="formData.unidad_id"
            placeholder="Ingrese el ID de la unidad"
            required
          />

          <button type="submit">Actualizar</button>
        </form>
      </div>
    </div>
    <button @click="closeModal" class="close-btn">X</button>
  </div>
</template>
  

<style scoped>






.titulo{
  position: absolute;
  top: 9%;
  left: 51%;
  transform: translate(-50%, -50%);
  font-family: 'Jura', sans-serif;
  font-size: 28px;
  text-align: center;
  color: #ffd700;
  background-color: transparent;
  padding: 10px 20px;
  border-radius: 8px;
  width: auto;
}


h1 {
  font-family: 'Jura', sans-serif;
  font-size: 24px;
  text-align: center;
  color: #ffd700; /* Amarillo */
  margin-left: -20px;
  margin-top: -30px;
  position: relative;
  z-index: 10;
}

  /* Estilo del formulario */
.form-container {
  background-color: #00000077; /* Fondo negro */
  padding: 15px;
  width: 910px;
  height: 598px;
  margin: 0 auto;
  border-radius: 8px;
  margin-top: -20px;
  border: 2px solid;
  margin-left: -15px;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  color: #fff; /* Texto blanco */
  font-size: 13px;
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

input::placeholder {
  color: #000;
  opacity: 0.8;
}

button {
  background-color: #ffecb3; /* Botón amarillo claro */
  color: #000;
  padding: 10px 15px;
  font-size: 15px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s ease;
  font-family: 'Jura', sans-serif;
  width: 130px;
  height: 35px;
  margin-left:385px;
  margin-top: -9px;

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
  background-color: rgb(0, 0, 0);
  margin-top: 50px;
  padding: 17px;
  width: 910px;
  height: 590px;
  max-width: 1000px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close-btn {
  background-color: red;
  color: rgb(255, 255, 255);
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  margin-top: -630px;
  margin-right: 20px;
  margin-left: -60px;
  width: 60px;

}

.close-btn:hover {
  background-color: rgb(255, 255, 255);
}


/* transiciones para el */ 

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-enter-to, .fade-leave-from {
  opacity: 1;
}


</style>