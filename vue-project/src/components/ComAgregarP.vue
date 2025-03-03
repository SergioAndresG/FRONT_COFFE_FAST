<script setup lang="ts">
import { ref, computed, watch } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

const ingredientes = ref([]);
const unidades = ref([]);
const showIngredientesModal = ref(false);
const showCantidadModal = ref(false);
const selectedIngrediente = ref(null);
const cantidadIngrediente = ref(null);
const selectedUnidad = ref(null);
const searchTerm = ref("");
const currentIngrediente = ref(null);

// Form data
const formData = ref({
  nombre: "",
  precio: null,
  cantidad: null,
  id_empleado: 0,
  categoria: "PLATO",
  imagen: null as File | null,
  stockMinimo: null,    
  tipo: "HECHO",
  ingredientes: [] as {id: number; nombre: string; cantidad: number; unidad: string; imagen?: string}[],
});

// Filtrar ingredientes según término de búsqueda
const filteredIngredientes = computed(() => {
  if (!searchTerm.value.trim()) return ingredientes.value;
  
  const term = searchTerm.value.toLowerCase().trim();
  return ingredientes.value.filter(ing => 
    ing.nombre.toLowerCase().includes(term)
  );
});

// Watch para resetear ingredientes si cambia el tipo
watch(() => formData.value.tipo, (newValue) => {
  if (newValue !== "HECHO") {
    formData.value.ingredientes = [];
  }
});

const cargarMateria = async () => {
  try {
    const respuesta = await axios.get("http://127.0.0.1:8000/materia");
    ingredientes.value = respuesta.data;
  } catch (error) {
    console.error("Error al cargar la materia prima");
  }
}

cargarMateria();

const cargarUnidadMedida = async () => {
  try {
    const respuesta = await axios.get("http://127.0.0.1:8000/materia/unidades-medida");
    unidades.value = respuesta.data;
  } catch (error) {
    console.error("Error al cargar las unidades de medida");
  }
}

cargarUnidadMedida();

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    formData.value.imagen = file;
  }
};

const openIngredientesModal = () => {
  showIngredientesModal.value = true;
  searchTerm.value = "";
};

const closeIngredientesModal = () => {
  showIngredientesModal.value = false;
};

const openCantidadModal = (ingrediente) => {
  currentIngrediente.value = ingrediente;
  cantidadIngrediente.value = null;
  selectedUnidad.value = null;
  showCantidadModal.value = true;
};

const closeCantidadModal = () => {
  showCantidadModal.value = false;
  currentIngrediente.value = null;
};

const agregarIngrediente = () => {
  if (!currentIngrediente.value || cantidadIngrediente.value === null || !selectedUnidad.value) {
    Swal.fire({
      icon: "error",
      title: "Campos incompletos",
      text: "Por favor, ingrese la cantidad y seleccione una unidad.",
    });
    return;
  }

  // Verificar si el ingrediente ya existe en la lista
  const ingredienteExistente = formData.value.ingredientes.findIndex(
    item => item.nombre === currentIngrediente.value.nombre
  );

  if (ingredienteExistente >= 0) {
    // Actualizar cantidad si ya existe
    formData.value.ingredientes[ingredienteExistente].cantidad = cantidadIngrediente.value;
    formData.value.ingredientes[ingredienteExistente].unidad = selectedUnidad.value;
    
    Swal.fire({
      icon: "success",
      title: "Ingrediente actualizado",
      text: `Se actualizó la cantidad de ${currentIngrediente.value.nombre}`,
      timer: 1500,
      showConfirmButton: false
    });
  } else {
    // Agregar nuevo ingrediente a la lista
    formData.value.ingredientes.push({
      id: currentIngrediente.value.id,
      nombre: currentIngrediente.value.nombre,
      cantidad: cantidadIngrediente.value,
      unidad: selectedUnidad.value,
      imagen: currentIngrediente.value.imagen || null
  });
    
    Swal.fire({
      icon: "success",
      title: "Ingrediente agregado",
      text: `${currentIngrediente.value.nombre} agregado a la receta`,
      timer: 1500,
      showConfirmButton: false
    });
  }

  // Cerrar modal
  closeCantidadModal();
};

const eliminarIngrediente = (index: number) => {
  Swal.fire({
    title: "¿Eliminar ingrediente?",
    text: `¿Desea eliminar ${formData.value.ingredientes[index].nombre} de la receta?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      formData.value.ingredientes.splice(index, 1);
      Swal.fire({
        icon: "success",
        title: "Ingrediente eliminado",
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
};
const handleSubmit = async () => {
  try {
    // Validar datos antes de enviarlos
    if (
      !formData.value.nombre ||
      formData.value.cantidad === null ||
      formData.value.stockMinimo === null || 
      !formData.value.tipo 
    ) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor, complete todos los campos obligatorios.",
      });
      return;
    }

    // Validar que si es un producto hecho, tenga ingredientes
    if (formData.value.tipo === "HECHO" && formData.value.ingredientes.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Receta vacía",
        text: "Los productos de tipo 'Hecho' deben tener al menos un ingrediente.",
      });
      return;
    }

    // Crear un objeto FormData para enviar tanto los datos como la imagen
    const form = new FormData();
    form.append("nombre", formData.value.nombre);
    form.append("cantidad", formData.value.cantidad?.toString() ?? "0");
    form.append("precio_unitario", formData.value.precio?.toString() ?? "0");
    form.append("id_usuario", formData.value.id_empleado.toString());
    form.append("categoria", formData.value.categoria);
    form.append("stock_minimo", formData.value.stockMinimo?.toString() ?? "0");
    form.append("tipo", formData.value.tipo);

    // Si es tipo HECHO, enviar los ingredientes
    if (formData.value.tipo === "HECHO") {
      // Preparar lista de ingredientes en el formato que espera el backend
      const ingredientesParaEnviar = formData.value.ingredientes.map(ing => ({
        materia_prima_id: ing.id,
        cantidad_ingrediente: ing.cantidad
      }));
      
      // Convertir a string JSON
      const ingredientesJsonString = JSON.stringify(ingredientesParaEnviar);
      form.append("ingredientes", ingredientesJsonString);
    }

    // Si hay una imagen, añadirla a la solicitud
    if (formData.value.imagen instanceof File) {
      form.append("file", formData.value.imagen);
    }

    console.log("Enviando form data:");
    for (let pair of form.entries()) {
      console.log(pair[0]+ ': ' + pair[1]); 
    }

    // Realizar la solicitud POST al backend
    const response = await axios.post("http://127.0.0.1:8000/productos", form, {
      headers: {
        "Content-Type": "multipart/form-data",
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
      precio: null,
      cantidad: null,
      id_empleado: 0,
      categoria: "PLATO",
      imagen: null,
      stockMinimo: null,
      tipo: "HECHO",
      ingredientes: []
    };
    
    // Cerrar el modal después de enviar
    closeModal();
  } catch (error) {
    console.error("Error al agregar el producto:", error.response?.data || error.message);
    Swal.fire({
      icon: "error",
      title: "Error al agregar el producto",
      text: error.response?.data?.detail || "Hubo un problema al agregar el producto. Verifique los datos e intente nuevamente.",
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

            <label for="precio">Precio Unitario:</label>
            <input type="number" id="precio" v-model="formData.precio" placeholder="Ingrese el precio unitario" required />
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
           <Transition class="fade-expand">
                <div v-if="formData.tipo === 'HECHO'" class="ingredientes-button-container">
                   <button type="button" @click="openIngredientesModal" class="btn-agregar-receta">
                       Agregar/Editar Receta
                   </button>
                  <span v-if="formData.ingredientes.length > 0" class="ingredientes-count">
                        {{ formData.ingredientes.length }} ingredientes agregados
                  </span>
                </div>
            </Transition>
            

            <label for="stockMinimo">Stock Mínimo:</label>
            <input type="number" id="stockMinimo" v-model="formData.stockMinimo" placeholder="Ingrese el stock mínimo" required />

            <label for="imagen">Agregar imagen:</label>
            <input type="file" id="imagen" @change="handleImageUpload">
          </div>

          <button type="submit" class="agregar">Agregar</button>


        </form>
        
          <!-- Modal de ingredientes -->
          <div v-if="showIngredientesModal" class="ingredientes-modal-overlay">
    <div class="ingredientes-modal">
      <div class="modal-header">
        <h2>Seleccione ingredientes para la receta</h2>
        <button @click="closeIngredientesModal" class="close-btn">X</button>
      </div>

      <div class="search-container">
        <input 
          type="text" 
          v-model="searchTerm" 
          placeholder="Buscar ingredientes..." 
          class="search-input"
        >
      </div>

      <!-- Lista de ingredientes ya agregados -->
      <div v-if="formData.ingredientes.length > 0" class="added-ingredients">
        <h3>Ingredientes en la receta</h3>
        <table>
          <thead>
            <tr>
              <th>Ingrediente</th>
              <th>Cantidad</th>
              <th>Unidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ing, idx) in formData.ingredientes" :key="idx">
              <td class="ingredient-name">
                <img 
                  v-if="ing.imagen" 
                  :src="ing.imagen" 
                  alt="Imagen de ingrediente" 
                  class="ingredient-thumbnail"
                >
                {{ ing.nombre }}
              </td>
              <td>{{ ing.cantidad }}</td>
              <td>{{ ing.unidad }}</td>
              <td>
                <button @click="openCantidadModal(ing)" class="btn-edit">Editar</button>
                <button @click="eliminarIngrediente(idx)" class="btn-delete">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ingredientes-grid">
        <div 
          v-for="ingrediente in filteredIngredientes" 
          :key="ingrediente.id" 
          class="ingrediente-card"
        >
          <div class="ingrediente-imagen">
            <img v-if="ingredientes.ruta_imagen" :src="`http://127.0.0.1:8000/productos/${producto.ruta_imagen}`" />
          </div>
          <div class="ingrediente-info">
            <h4>{{ ingrediente.nombre }}</h4>
            <p v-if="ingrediente.stock">Stock: {{ ingrediente.stock }}</p>
          </div>
          <button 
            @click="openCantidadModal(ingrediente)" 
            class="btn-agregar-ingrediente"
          >
            Agregar
          </button>
        </div>
      </div>

      <div v-if="filteredIngredientes.length === 0" class="no-results">
        No se encontraron ingredientes que coincidan con la búsqueda.
      </div>

      <div class="modal-footer">
        <button @click="closeIngredientesModal" class="btn-finalizar">Finalizar</button>
      </div>
    </div>
  </div>

  <!-- Modal para cantidad y unidad -->
  <div v-if="showCantidadModal" class="cantidad-modal-overlay" @click="closeCantidadModal">
    <div class="cantidad-modal" @click.stop>
      <div class="modal-header">
        <h3>Agregar {{ currentIngrediente?.nombre }}</h3>
        <button @click="closeCantidadModal" class="close-btn">X</button>
      </div>

      <div class="cantidad-form">
        <div class="form-group">
          <label for="cantidad">Cantidad:</label>
          <input 
            type="number" 
            id="cantidad" 
            v-model="cantidadIngrediente" 
            placeholder="Ej: 250" 
            min="0.01" 
            step="0.01"
            class="cantidad-input"
            autofocus
          >
        </div>

        <div class="form-group">
          <label for="unidad">Unidad de medida:</label>
          <select id="unidad" v-model="selectedUnidad" class="unidad-select">
            <option value="" disabled selected>Seleccione una unidad</option>
            <option v-for="unidad in unidades" :key="unidad.id" :value="unidad.simbolo">
              {{ unidad.nombre }} ({{ unidad.simbolo }})
            </option>
          </select>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="closeCantidadModal" class="btn-cancelar">Cancelar</button>
        <button @click="agregarIngrediente" class="btn-confirmar">Confirmar</button>
      </div>
    </div>
  </div>
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
  backdrop-filter: blur(5px); /* Desenfoque del contenido detrás del overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: all 0.3s ease; /* Transición suave */
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
  color: rgb(247, 247, 247);
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  margin-left: 980px;
  width: 50px;
  background-color: red;
  transition: 0.3s ease;

}

.close-btn:hover {
  background-color: #cf0000;
  transform: scale(1.1);
}

.ingredientes-modal{
  font-family: 'Jura', sans-serif;
  position: fixed;
  top: 20%;
  left: 20%;
  width: 60%;
  height: 70%;
  background-color: rgb(0, 0, 0);
  justify-content: center;
  align-items: center;
  z-index: 1100;
  transition: all 0.3s ease;
  border: solid #cf9b00;
  border-radius: 15%;
}

.cerrar-ingredientes {
  color: rgb(247, 247, 247);
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  width: 50px;
  background-color: red;
  transition: 0.3s ease;
  margin-top: -51%;
  margin-left: 84%;

}

.cerrar-ingredientes:hover {
  background-color: #cf0000;
  transform: scale(1.1);
}


@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-content, .ingredientes-section {
  animation: modalAppear 0.2s ease-out forwards;
}

.btn-agregar-receta{
  background-color: #ffecb3;
  color: #000;
  width: 170px;
  height: 30px;
  font-size: 13px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s ease;
  font-family: 'Jura', sans-serif;
  margin-left: 149px;
}

.btn-agregar-receta:hover{
  background-color: #af9608;
  transform: scale(1.1);

}

/*Animacion para expandir el contenedor */
.fade-expand-enter-active, .fade-expand-leave-active {
  transition: max-height 2s ease-out, opacity 1s ease-in-out;
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
.ingrediente{
  margin-left: 38px;
}
.cantidad{
  margin-left: 53px;
  width: 100px;
}
.unidad{
  margin-left: 65px;
 
}
</style>