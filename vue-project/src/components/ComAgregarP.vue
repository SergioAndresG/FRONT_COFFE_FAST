<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";  // Asegúrate de importar SweetAlert2


// Form data
const formData = ref({
  nombre: "",
  descripcion: "",
  precioUnitario: null,
  cantidad: null,
  id_usuario: 0,
  categoria: "PLATO",
  imagen: "",
});


const handleImageUpload = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
  const reader = new FileReader();

  reader.onloadend = () => {
    // Alamacenamos la imagen como data url en formdata
    formData.value.imagen = reader.result as string;
  };

  if (file){
    reader.readAsDataURL(file);

    formData.value.imagen = file;
  }
}


// Método para manejar el envío del formulario
const handleSubmit = async () => {
  try {
    console.log(formData);

    // Validar datos antes de enviarlos
    if (
      !formData.value.nombre ||
      !formData.value.descripcion ||
      formData.value.precioUnitario === null ||
      formData.value.cantidad === null
    ) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }

    // Realizar la solicitud POST al backend
    const response = await axios.post("http://localhost:8080/productos", formData.value);

    Swal.fire({
    icon: "success",
    title: "Producto agregado con éxito",
    text: `El producto ${response.data.nombre} fue agregado correctamente.`,
    customClass: {
      title: 'custom-title', // Clase para el título
      popup: 'custom-popup', // Clase para el contenedor
      content: 'custom-content', // Clase para el contenido
    },
    });

    // Limpiar el formulario después de enviar
    formData.value.nombre = "";
    formData.value.descripcion = "";
    formData.value.precioUnitario = 0;
    formData.value.cantidad = 0;
    formData.value.id_usuario = null;
    formData.value.categoria = "";

    // Cerrar el modal después de enviar
    closeModal();
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    Swal.fire({
      icon: "error",
      title: "Error al agregar el producto",
      text: "Hubo un problema al agregar el producto. Verifique los datos e intente nuevamente.",
    });
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
      <h1>Agregar Producto</h1>
      <div class="form-container">
        <form @submit.prevent="handleSubmit">
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" v-model="formData.nombre" placeholder="Ingrese el nombre del producto" required />

          <label for="descripcion">Descripción:</label>
          <input type="text" id="descripcion" v-model="formData.descripcion" placeholder="Ingrese una descripción corta" required />

          <label for="precio">Precio Unitario:</label>
          <input type="number" id="precio" v-model="formData.precioUnitario" placeholder="Ingrese el precio unitario" required />

          <label for="categoria">Categoría:</label>
          <select id="categoria" v-model="formData.categoria" required>
            <option value="PLATO">Comida</option>
            <option value="BEBIDA">Bebida</option>
          </select>

          <label for="cantidad">Cantidad:</label>
          <input type="number" id="cantidad" v-model="formData.cantidad" placeholder="Ingrese la cantidad" required />

          <label for="idUsuario">ID Usuario:</label>
          <input type="number" id="idUsuario" v-model="formData.id_usuario" placeholder="Ingrese el ID del usuario que registra" required />

          <label for="imagen">Imagen:</label>
          <input type="file" id="imagen" @change="handleImageUpload">

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