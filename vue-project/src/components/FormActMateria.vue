<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

// Form data para agregar materia prima
const formData = ref({
  id: null,
  nombre: "",
  unidadMedida: "",
  stockActual: null,
  precioUnitario: null,
});

// Método para manejar el envío del formulario
const handleSubmit = async () => {
  try {
    // Validar datos antes de enviarlos
    if (
      !formData.value.nombre ||
      !formData.value.unidadMedida ||
      formData.value.stockActual === null ||
      formData.value.precioUnitario === null
    ) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    // Realizar la solicitud POST al backend
    const response = await axios.put(
      `http://localhost:8080/materia/${formData.value.id}`,
      formData.value
    );
    alert("Materia Prima actualizada con éxito: " + response.data.nombre);

    // Limpiar el formulario después de enviar
    formData.value.id = null;
    formData.value.nombre = "";
    formData.value.unidadMedida = "";
    formData.value.stockActual = null;
    formData.value.precioUnitario = null;

    // Cerrar el modal después de enviar
    closeModal();
  } catch (error) {
    console.error("Error al agregar la Materia Prima:", error);
    alert(
      "Hubo un problema al agregar la Materia Prima. Verifique los datos e intente nuevamente."
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
      <div class="modal-content" @click.stop>
        <h1>Actualizar Materia Prima</h1>
        <div class="form-container">
          <form @submit.prevent="handleSubmit">
            <label for="nombre">Nombre:</label>
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
  
            <label for="unidadMedida">Unidad de Medida:</label>
            <input
              type="text"
              id="unidadMedida"
              v-model="formData.unidadMedida"
              placeholder="Ingrese la unidad de medida (kg, l, etc.)"
              required
            />
  
            <label for="stockActual">Stock Actual:</label>
            <input
              type="number"
              id="stockActual"
              v-model="formData.stockActual"
              placeholder="Ingrese la cantidad actual en stock"
              required
            />
  
            <label for="precioUnitario">Precio Unitario:</label>
            <input
              type="number"
              id="precioUnitario"
              v-model="formData.precioUnitario"
              placeholder="Ingrese el precio unitario"
              required
            />
  
            <button type="submit">Agregar</button>
          </form>
        </div>
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
  margin-top: -33px;
  padding: 20px;
  width: 80%;
  height: 570px;
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