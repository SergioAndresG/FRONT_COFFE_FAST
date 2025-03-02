<script setup lang="ts">
import { ref, watch } from "vue";
import axios from "axios";
import Swal from "sweetalert2";  // Asegúrate de importar SweetAlert2
import { s } from "vite/dist/node/types.d-aGj9QkWt";

const ingredientes = ref([])
const unidades = ref([])
const showIngredientesModal = ref(false)
const selectIngrediente = ref([])
const cantidadIngrediente = ref([])
const selectedUnidad = ref ([])

// Form data
const formData = ref({
  nombre: "",
  precio: null,
  cantidad: null,
  id_empleado: 0,
  categoria: "PLATO",
  imagen: null as File | null,
  stockMinimo: null,    
  tipo: "COMPRADO",
  ingredientes: [] as {nombre: string; simbolo: string; unidad} [],
});

// Watch para mostrar la ventana emergente con las materias primas cuando tipo es "HECHO"
watch(() => formData.value.tipo, (newValue) => {
  if(newValue == "HECHO"){
    // No se muestra automaticamente si no cuando el usuario lo abra con el boton
    formData.value.ingredientes = []
  } else {
    formData.value.ingredientes = []
  }
})


const cargarMateria = async () => {
  try {
    const respuesta = await axios.get("http://127.0.0.1:8000/materia");
    ingredientes.value = respuesta.data;
  } catch (error) {
    console.error("Error al cargar la materia prima")
  }
}

cargarMateria();

const cargarUnidadMedida = async () => {
  try {
    const respuesta = await axios.get("http://127.0.0.1:8000/materia/unidades-medida")
    unidades.value = respuesta.data
  } catch (error) {
    console.error("Error al cargar las unidades de medida")
  }
}

cargarUnidadMedida();

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    formData.value.imagen = file;  // Guardar el archivo en lugar de la URL
  }
};

const openIngredientesModal = () => {
  showIngredientesModal.value = true;
}

const closeIngredintesModal = () => {
  showIngredientesModal.value = false;
  selectIngrediente.value = null;
  cantidadIngrediente.value = null
  selectedUnidad.value = null;
}

const agregarIngrediente = () => {
  if(!selectIngrediente.value || cantidadIngrediente.value || selectedUnidad){
    Swal.fire({
      icon: "error",
      title: "Campos incompletos",
      text: "Por favor seleccione un ingrediente, ingrese la cantidad y seleccione una unidad",
    })
    return
  }
  // Buscar el ingrediente seleccionado en la lista
  const ingrediente = ingredientes.value.find(i=>i.id===selectIngrediente || i.nombre===selectIngrediente);

  if(!ingrediente){
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ingrediente no encontrado",
    });
    return;
  }

  // Agregar ingrediente a la lista
  formData.value.ingredientes.push({
    nombre: ingrediente.nombre,
    cantidad: cantidadIngrediente.value,
    unidad: selectedUnidad.value
  })


  // Limpiar los campos
  selectIngrediente.value = null;
  cantidadIngrediente.value = null;
  selectedUnidad.value = null
}

const eliminarIngrediente = (index: number) => {
  formData.value.ingredientes.splice(index, 1)
}




const handleSubmit = async () => {
  try {
    console.log("Datoa a enviar:",formData.value);
    // Validar datos antes de enviarlos
    if (
      !formData.value.nombre ||
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

    // Validar que si el producto es hecho verificar que tiene ingredientes

    if(formData.value.tipo=="HECHO"&&formData.value.ingredientes.length == 0){
      Swal.fire({
        icon: "error",
        title: "Receta Vacia",
        text: "Los productos hechos deben tener un ingrediente"
      })
      return
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

    // si hay ingredintes enviar el formato Json
    if (formData.value.tipo == 'HECHO') {
      const ingredientesJson = JSON.stringify(formData.value.ingredientes)
      form.append("ingredientes", ingredientesJson)
    } else {
      // Si no es hecho enviar una lista vacia
      form.append("ingredientes", JSON.stringify([]))
    }

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
      precio: null,
      cantidad: null,
      id_empleado: 0,
      categoria: "PLATO",
      imagen: null,
      stockMinimo: null,
      tipo: "COMPRADO",
      ingredientes: []
    };
    // Cerrar el modal después de enviar
    closeModal();
  } catch (error) {
    
    console.error("Error al agregar el producto:", error.response?.data || error.message);
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
            

            <label for="stockMinimo">Stock Mínimo:</label>
            <input type="number" id="stockMinimo" v-model="formData.stockMinimo" placeholder="Ingrese el stock mínimo" required />

            <label for="imagen">Agregar imagen:</label>
            <input type="file" id="imagen" @change="handleImageUpload">
          </div>

           <!-- Sección para ingredientes (solo visible si tipo es "HECHO") -->
           <div v-if="formData.tipo === 'HECHO'" class="full-width ingredientes-section">
            <h3>Receta del producto</h3>
            <button type="button" @click="openIngredientesModal" class="btn-agregar-ingrediente">Agregar Ingrediente</button>
            
            <div v-if="formData.ingredientes.length > 0" class="ingredientes-lista">
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
                  <tr v-for="(ingrediente, index) in formData.ingredientes" :key="index">
                    <td>{{ ingrediente.nombre }}</td>
                    <td>{{ ingrediente.cantidad }}</td>
                    <td>{{ ingrediente.unidad }}</td>
                    <td>
                      <button type="button" @click="eliminarIngrediente(index)" class="btn-eliminar">Eliminar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="no-ingredientes">
              No hay ingredientes agregados. Agregue ingredientes para completar la receta.
            </div>
          </div>

          <button type="submit" class="agregar">Agregar</button>
        </form>
        
          <!-- Modal de ingredientes -->
          <div v-if="showIngredientesModal" class="ingredientes-modal-overlay">
            <div class="ingredientes-modal">
              <h3>Agregar Ingrediente a la Receta</h3>
              <div class="ingrediente-form">
                <div class="ingrediente-campo">
                  <label for="selectIngrediente">Ingrediente:</label>
                  <select id="selectIngrediente" v-model="selectIngrediente">
                    <option v-for="ingrediente in ingredientes" :key="ingrediente.id" :value="ingrediente.id">
                      {{ ingrediente.nombre }}
                    </option>
                  </select>
                </div>
                
                <div class="ingrediente-campo">
                  <label for="cantidadIngrediente">Cantidad:</label>
                  <input type="number" id="cantidadIngrediente" v-model="cantidadIngrediente" placeholder="Cantidad" min="0" step="0.01">
                </div>
                
                <div class="ingrediente-campo">
                  <label for="unidadIngrediente">Unidad:</label>
                  <select id="unidadIngrediente" v-model="selectedUnidad">
                    <option v-for="unidad in unidades" :key="unidad.id" :value="unidad.simbolo">
                      {{ unidad.nombre }} ({{ unidad.simbolo }})
                    </option>
                  </select>
                </div>
              </div>
              
              <div class="ingredientes-modal-buttons">
                <button @click="agregarIngrediente" class="btn-agregar">Agregar a la Receta</button>
                <button @click="closeIngredintesModal" class="btn-cancelar">Cancelar</button>
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.form-container {
  display: flex;
  flex-direction: column;
}

form {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.column {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: bold;
}

input, select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.agregar {
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  align-self: flex-end;
}

.full-width {
  width: 100%;
  margin-top: 1rem;
}

.ingredientes-section {
  border-top: 1px solid #ddd;
  padding-top: 1rem;
}

.btn-agregar-ingrediente {
  background-color: #2196F3;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.ingredientes-lista {
  margin-top: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.btn-eliminar {
  background-color: #f44336;
  color: white;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.no-ingredientes {
  margin-top: 1rem;
  font-style: italic;
  color: #666;
}

/* Estilos para el modal de ingredientes */
.ingredientes-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100; /* Mayor que el modal principal */
}

.ingredientes-modal {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.ingrediente-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
}

.ingrediente-campo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ingredientes-modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-agregar {
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancelar {
  background-color: #f44336;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

</style>