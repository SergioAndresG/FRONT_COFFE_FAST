<script setup lang="ts">
import { computed, ref } from "vue";
import axios from "axios";
import Swal from "sweetalert2";  
import { defineEmits } from 'vue';
const emit = defineEmits(['close']);


//Variable para guaradar los daos de la busqueda
const searchTerm = ref("")
const productos = ref([]);
const ActModal = ref(false);
//Con la palabra any le indicamos que puede guardar un dato de cualquier tipo, en este caso de tipo del objeto producto
const productoSeleccionado = ref<any>(null);
const categorias = ref([]);


const formData = ref({
  id: null,
  nombre: "",
  categoria: "COMIDA",
  precio: null,
  cantidad: 0,
  stock_minimo: 0,
  idUsuarioR: 0
});

//estado para rastrear que se ha modificado
const camposModificados = ref({
  id: false,
  nombre: false,
  categoria: false,
  precio: false,
  cantidad: false,
  stock_minimo: false,
  idUsuarioR: false
})

const cargarCategorias = async () => {
  try {
    const respuesta = await axios.get("http://127.0.0.1:8000/productos/categorias")
    categorias.value = respuesta.data
  } catch (error) {
    console.error("Error al cargar los produtos", error)
  }
}

cargarCategorias();

const cargarProductos = async () => {
  try {
    const respuesta = await axios.get("http://127.0.0.1:8000/productos");
      productos.value = respuesta.data
  } catch (error) {
    console.error("Error al cargar los productos", error)
  }
}

//Funcion para filtrar los productos por terminos de busqueda
// Definimos la funcion computed para que se actualice cuando halla un cambio
const filtrarProductos = computed(() => {
  // Si el campo esta vacio devuelve los productos sin ningun cambgio
  if(!searchTerm.value.trim()) return productos.value
  // Obtenemos el valor lo pareseamos a minisculas y le quitamos los espacio (trim())
  const term = searchTerm.value.toLowerCase().trim()
  // Filtramos lo prodcutos que cumplan con el termino de busqueda
  // por cada producto tomamos su nombre, se pasa a minusculas y si incluye el termino de busqueda lo dejamos si no, lo descartamos
  return productos.value.filter(pro => pro.nombre.toLowerCase().includes(term))
});

cargarProductos();

const handleInputChange = async (campo: string) => {
  camposModificados.value[campo] = true
}

const handleSubmit = async () => {
  try {
    const camposActualizados: any = {};
    for (const campo in camposModificados.value) {
      if (camposModificados.value[campo]) {
        switch(campo) {
          case 'precio':
            camposActualizados['precio_unitario'] = Number(formData.value.precio.toFixed(2));
            break;
          case 'categoria':
            camposActualizados['categoria'] = formData.value.categoria;
            break;
          case 'idUsuarioR':
            camposActualizados['id_usuario'] = formData.value.idUsuarioR;
            break;
          default:
            camposActualizados[campo] = formData.value[campo];
        }
      }
    }

    console.log('Payload being sent:', camposActualizados);

    if (Object.keys(camposActualizados).length > 0) {
    const response = await axios.patch(
      `http://127.0.0.1:8000/productos/${formData.value.id}`, 
      camposActualizados
    );

    Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Producto actualizado exitosamente",
      });

    closeModal();
    cargarProductos();
    } else {
      Swal.fire({
        icon:"info",
        title:"Informacion",
        text:"No se han realizado cambios"
      })
    }
  } catch (error: any) {
    console.error("Full error:", error);
    console.error("Error response:", error.response?.data);
    
    Swal.fire({
      icon: "error",
      title: "Error al actualizar el producto",
      text: error.response?.data?.detail || "Hubo un problema al actualizar el producto.",
    });
  }
};

const openActModal = (producto: any) => {
  formData.value = {
  id: producto.id,
  nombre: producto.nombre || "",
  categoria: producto.categoria || null,
  precio: producto.precio_unitario || null,
  cantidad: producto.cantidad || null,
  stock_minimo: producto.stock_minimo || null,
  idUsuarioR: producto.id_usuario
};

for(const campo in camposModificados.value) {
  camposModificados.value[campo] = false;
}

 productoSeleccionado.value = producto;
  ActModal.value = true;
} 

const closeActModal = (producto: any) => {
  ActModal.value = false;
} 



const closeModal = () => {
  emit('close');  // Emitir el evento para cerrar el modal
};

</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content" @click.stop>
      <!-- Formulario u otro contenido aquí -->
      <button @click="closeModal" class="close-btn3">X</button>
      <h1>Seleccione el producto a Actualizar</h1>
      <div class="search-container">
          <input type="text" v-model="searchTerm" placeholder="Buscar Producto..." class="search-input">
      </div>
      <div class="productos-grid">
        <div v-for="productos in filtrarProductos" :key="productos.id" class="productos-card">
          <div class="productos-imagen">
            <img v-if="productos.ruta_imagen" :src="`http://127.0.0.1:8000/productos/${productos.ruta_imagen}`" />
          </div>
          <div class="productos-info">
            <h4>{{ productos.nombre }}</h4>
            <p v-if="productos.cantidad">Stock: {{ productos.cantidad }}</p>
            
        </div>
        
        <button 
            @click="openActModal(productos)"
            class="btn-agregar-productos">Actualizar
          </button>
          </div>
      </div>

      <div v-if="filtrarProductos.length === 0" class="no-results">
        No se encontraron resultados con la busqueda
      </div>

      <div class="modal-footer">
        <button @click="closeModal" class="btn-finalizar">Finalizar</button>
      </div>
    </div>

    <div class="modal-overlay" v-if="ActModal">
      <div class="form-container">
      <button @click="closeActModal" class="close-btn4">X</button>

        <form @submit.prevent="handleSubmit">
          <label for="id">ID del Producto:</label>
            <input
              type="number"
              id="id"
              v-model="formData.id"
              disabled
            />
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" v-model="formData.nombre" placeholder="Ingrese el nombre del producto" @input="handleInputChange('nombre')"/>

          <label for="categoria">Categoría:</label>
          <select id="categoria" v-model="formData.categoria" @input="handleInputChange('categoria')">7
            <option disabled value="">Seleccione una Categoría</option>
            <option v-for="categoria in categorias" :key="categoria" :value="categoria">
              {{ categoria }}
            </option>
            
          </select>
          <label for="precio">Precio</label>
          <input type="number" id="precio" v-model="formData.precio" step="0.01" placeholder="Ingrese el precio" 
            @input="handleInputChange('precio')"
          />

          <label for="cantidad">Cantidad:</label>
          <input type="number" id="cantidad" v-model.number="formData.cantidad" placeholder="Ingrese la cantidad" @input="handleInputChange('cantidad')"/>

          
          <label for="stock_minimo">Cantidad minimo de stock:</label>
          <input type="text" id="stock_minimo" v-model="formData.stock_minimo" placeholder="Ingrese una descripción corta" @input="handleInputChange('stock_minimo')"/>

          <label for="id_usuario">ID Usuario:</label>
          <input type="number" id="id_usuario" v-model="formData.idUsuarioR" placeholder="Ingrese el ID del usuario que Actualiza" disabled/>

          <button type="submit" class="act-bottom">Actualizar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1{
  font-family: 'Jura', sans-serif;
  font-size: 24px;
  text-align: center;
  color: #ffd700;
  margin-left: 20px;
}
/* Estilo del formulario */
.form-container {
  background-color: #000000; /* Fondo negro */
  padding: 15px;
  width: 700px;
  height: 585px;
  margin-top: 40px;
  border-radius: 8px;
  margin-left: 435.5px;
  border: 2px solid;
}
.close-btn4 {
  background-color: transparent;
  color: rgb(255, 0, 0);
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  width: 60px;
  margin-left: 640px;
  transition: all 0.3s ease-in-out;
}
.close-btn4:hover {
  background-color: darkred;
  transform: scale(1.1);
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
.act-bottom {
  background-color: #ffecb3;
  color: #000;
  padding: 10px 15px;
  font-size: 14px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s ease;
  font-family: 'Jura', sans-serif;
  width: 150px;
  margin-left: 280px;
  transition: all 3.0s ease-in-ou;
  margin-top: 18px;
}
.act-bottom:hover {
  background-color: #ffd700;
  transform: scale(1.05);
}
.modal-overlay {
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.modal-content {
  font-family: 'Jura', sans-serif;
  position: fixed;
  left: 27%;
  width: 50%;
  height: 95%;
  background-color: rgb(0, 0, 0);
    margin-top: 20px;
  transition: all 0.3s ease;
  border: solid #cf9b00;
  border-radius: 5%;
  overflow-y: auto; /* Activa el scroll vertical */
}
.productos-grid{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
  overflow-y: auto;
}
.productos-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.productos-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
.productos-imagen {
  height: 120px;
  overflow: hidden;
}
.productos-imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.productos-card:hover .productos-imagen img {
  transform: scale(1.05);
}
.productos-info {
  padding: 0.8rem;
}
.productos-info h4 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}
.productos-info p {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
}
.btn-agregar-productos {
  width: 100%;
  padding: 0.6rem;
  background-color: #000000;
  color: white;
  border: none;
  cursor: pointer;
  transition: transform ease-in-out 0.3s;
  font-family: 'Jura', sans-serif;
}
.btn-agregar-productos:hover {
  background-color: #cf9b00;
  transform: scale(1.1);
}
.no-results {
  padding: 2rem;
  text-align: center;
  color: #666;
  font-style: italic;
}
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
}
.btn-finalizar {
  background-color: #de0a0a;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.3s ease-in-out;
}
.btn-finalizar:hover{
  transform: scale(1.1);
}
.close-btn3 {
  background-color: transparent;
  color: rgb(255, 0, 0);
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  width: 60px;
  margin-left: 670px;
  margin-top: 23px;
  transition: all 0.3s ease-in-out;
}
.close-btn3:hover {
  background-color: darkred;
  transform: scale(1.1);
}
</style>