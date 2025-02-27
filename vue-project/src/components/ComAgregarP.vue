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
  id_empleado: 0,
  categoria: "PLATO",
  imagen: null as File | null,
  fechaVencimiento: "", 
  stockMinimo: null,    
  tipo: "HECHO",
});


const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    formData.value.imagen = file;  // Guardar el archivo en lugar de la URL
  }
};


const handleSubmit = async () => {
  try {
    console.log("Datoa a enviar:",formData.value);
    // Validar datos antes de enviarlos
    if (
      !formData.value.nombre ||
      !formData.value.descripcion ||
      !formData.value.fechaVencimiento || 
      formData.value.precioUnitario === null ||
      formData.value.cantidad === null ||
      formData.value.stockMinimo === null || 
      !formData.value.tipo 
    ){
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor, complete todos los campos.",
      });
      return;
    }

    // Crear un objeto FormData para enviar tanto los datos como la imagen
    const form = new FormData();
    form.append("nombre", formData.value.nombre);
    form.append("cantidad", formData.value.cantidad.toString());
    form.append("descripcion", formData.value.descripcion);
    form.append("precio_unitario", formData.value.precioUnitario.toString());
    form.append("id_empleado", formData.value.id_empleado.toString());
    form.append("categoria", formData.value.categoria);
    form.append("fecha_vencimiento", formData.value.fechaVencimiento); // Nuevo campo
    form.append("stock_minimo", formData.value.stockMinimo.toString()); // Nuevo campo
    form.append("tipo", formData.value.tipo); // Nuevo campo

    // Si hay una imagen, añadirla a la solicitud
    if (formData.value.imagen instanceof File) {
      form.append("file", formData.value.imagen);
    }

    // Realizar la solicitud POST al backend
    const response = await axios.post("http://127.0.0.1:8000/productos", form, {
      headers: {
        "Content-Type": "multipart/form-data",  // Indicar que estamos enviando archivos
      },
    });

    Swal.fire({
      icon: "success",
      title: "Producto agregado con éxito",
      text: `El producto ${response.data.nombre} fue agregado correctamente.`,
    });

    // Limpiar el formulario después de enviar
    formData.value = {
      nombre: "",
      descripcion: "",
      precioUnitario: null,
      cantidad: null,
      id_empleado: 0,
      categoria: "PLATO",
      imagen: null,
      fechaVencimiento: "",
      stockMinimo: null,
      tipo: "HECHO",
    };
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
const emit = defineEmits(["close"]);
const closeModal = () => {
  emit("close");
};
</script>


<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button @click="closeModal" class="close-btn">X</button> <!-- Botón fuera del formulario -->
      <h1>Agregar Producto</h1>
      <div class="form-container">
        <form @submit.prevent="handleSubmit">

          <div class="column">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" v-model="formData.nombre" placeholder="Ingrese el nombre del producto" required />

            <label for="cantidad">Cantidad:</label>
            <input type="number" id="cantidad" v-model="formData.cantidad" placeholder="Ingrese la cantidad" required />

            <label for="fechaVencimiento">Fecha de Vencimiento:</label>
            <input type="date" id="fechaVencimiento" v-model="formData.fechaVencimiento" required />

            <label for="descripcion">Descripción:</label>
            <input type="text" id="descripcion" v-model="formData.descripcion" placeholder="Ingrese una descripción corta" required />

            <label for="precio">Precio Unitario:</label>
            <input type="number" id="precio" v-model="formData.precioUnitario" placeholder="Ingrese el precio unitario" required />
          </div>

          <div class="column">
            <label for="idEmpleado">ID Empleado:</label>
            <input type="number" id="idEmpleado" v-model="formData.id_empleado" placeholder="Ingrese el ID del empleado que registra" required />

            <label for="categoria">Categoría:</label>
            <select id="categoria" v-model="formData.categoria" required>
              <option value="PLATO">Comida</option>
              <option value="BEBIDA">Bebida</option>
            </select>

            <label for="tipo">Tipo:</label>
            <select id="tipo" v-model="formData.tipo" required>
              <option value="HECHO">Hecho</option>
              <option value="COMPRADO">Comprado</option>
            </select>

            <label for="stockMinimo">Stock Mínimo:</label>
            <input type="number" id="stockMinimo" v-model="formData.stockMinimo" placeholder="Ingrese el stock mínimo" required />

            <label for="imagen">Agregar imagen:</label>
            <input type="file" id="imagen" @change="handleImageUpload">
          </div>

          <button type="submit" class="agregar">Agregar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>


h1 {
  font-family: 'Jura', sans-serif;
  font-size: 24px;
  text-align: center;
  color: #ffd700;
  margin-top: -13px;
}

.form-container {
  border: 2px solid white;
  background-color: #000;
  padding: 20px;
  width: 1000px;
  height: 520px;
  max-width: 1200px;
  border-radius: 8px;
  display: flex;
  gap: 15px;
  margin-left: -20px;
}

form {
  display: flex;
  gap: 20px;
  width: 100%;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

label {
  color: #fff;
  font-size: 12px;
  margin-bottom: 5px;
  font-family: 'Jura', sans-serif;
}

input,
select {
  font-family: 'Jura', sans-serif;
  margin-bottom: 15px;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #cf9b00;
  color: #000;
  font-size: 14px;
  width: 450px;
  margin-left: 10px;
}

.agregar {
  background-color: #ffecb3;
  color: #000;
  padding: 10px 15px;
  width: 250px;
  height: 60px;
  font-size: 14px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s ease;
  font-family: 'Jura', sans-serif;
  margin-top: 430px;
  margin-left: -89px;
}

.agregar:hover {
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
  background-color: rgba(0, 0, 0, 0.261);
  padding: 30px;
  width: 1000px;
  height: 600px;
  max-width: 1000px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close-btn {
  color: rgb(255, 0, 0);
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  margin-top: -600px;
  margin-left: 780px;
  width: 450px;
  background-color:transparent;
}

.close-btn:hover {
  color: darkred;
}

</style>