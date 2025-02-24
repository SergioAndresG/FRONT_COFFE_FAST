<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

// Estado del formulario
const formData = ref({
  id: null, // Campo para el ID del usuario
  nombre: "",
  rol: "",
  subrol: null,
  correo: "",
  contraseña: "",
  confirmarContraseña: "",
  documento: null,
});

// Función para manejar el envío del formulario
const handleSubmit = async () => {
  // Validar que las contraseñas coincidan
  if (formData.value.contraseña !== formData.value.confirmarContraseña) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Las contraseñas no coinciden",
    });
    return;
  }

  try {
    // Realizar la solicitud PUT al backend para actualizar el usuario
      const response = await axios.put(`http://127.0.0.1:8000/usuarios/${formData.value.id}`, {
      nombre: formData.value.nombre,
      rol: formData.value.rol,
      subrol: formData.value.subrol,
      correo: formData.value.correo,
      contraseña: formData.value.contraseña,
      documento: parseInt(formData.value.documento),
      ruta_imagen: null 
    });

    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: "Usuario actualizado exitosamente",
    });

    console.log("Usuario actualizado con éxito:", response.data);
    closeModal();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un error al actualizar el usuario",
    });
    console.error("Error al actualizar el usuario:", error);
  }
};

// Emitir el evento 'close' para cerrar el modal
import { defineEmits } from "vue";
const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};
</script>


<template>
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h1>Actualizar Usuario</h1>
        <div class="form-container">
          <form @submit.prevent="handleSubmit">
            <!-- Campo para ID -->
            <label for="id">ID del Usuario:</label>
            <input
              type="number"
              id="id"
              v-model="formData.id"
              placeholder="Ingrese el ID del usuario"
              required
            />
  
            <!-- Campo para Nombre -->
            <label for="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              v-model="formData.nombre"
              placeholder="Ingrese su nombre"
            />
  
            <!-- Campo para Rol -->
            <label for="rol">Rol:</label>
            <select id="rol" v-model="formData.rol" required>
              <option disabled value="">Seleccione un rol</option>
              <option value="EMPLEADO">Empleado</option>
            </select>
  
            <!-- Campo para Sub-Rol -->
            <label for="subrol">Sub-Rol:</label>
            <select id="subrol" v-model="formData.subrol">
              <option disabled value="">Seleccione un sub-rol (opcional)</option>
              <option value="COSINERO">Cocinero</option>
              <option value="MESERO">Mesero</option>
              <option value="">Ninguno</option>
            </select>
  
            <!-- Campo para Correo -->
            <label for="correo">Correo:</label>
            <input
              type="email"
              id="correo"
              v-model="formData.correo"
              placeholder="Ingrese su correo"
            />
  
            <!-- Campo para Contraseña -->
            <label for="contraseña">Contraseña:</label>
            <input
              type="password"
              id="contraseña"
              v-model="formData.contraseña"
              placeholder="Ingrese su contraseña"
            />
  
            <!-- Campo para Confirmar Contraseña -->
            <label for="confirmarContraseña">Confirmar Contraseña:</label>
            <input
              type="password"
              id="confirmarContraseña"
              v-model="formData.confirmarContraseña"
              placeholder="Confirme su contraseña"
            />
  
            <!-- Campo para Documento -->
            <label for="documento">Documento:</label>
            <input
              type="number"
              id="documento"
              v-model="formData.documento"
              placeholder="Ingrese su documento"
            />
  
            <!-- Botón para Actualizar -->
            <button type="submit">Actualizar</button>
          </form>
        </div>
  
        <!-- Botón para Cerrar -->
        <button @click="closeModal" class="close-btn">Cerrar</button>
      </div>
    </div>
  </template>
  

<style scoped>


  h1{
    font-family: 'Jura', sans-serif;
    font-size: 22px;
    text-align: center;
    color: #ffd700;
    margin-top: -10px;
  }
  /* Estilo del formulario */
.form-container {
  background-color: #ffff0677; /* Fondo negro */
  padding: 15px;
  width: 300px;
  margin: 0 auto;
  border-radius: 8px;
  margin-top: -10px;
  width: 400px;
}

.form-container select{
    font-family: 'Jura', sans-serif;
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
  font-size: 12px;
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
  margin-top: -33px;
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