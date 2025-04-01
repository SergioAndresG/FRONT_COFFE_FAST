<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import ComImagen from './icons/IMGENES/ComImagen.vue'
import { store } from './datos'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

interface ProductoPedido {
  nombre: string
  cantidad: number
  precio: number
}

interface Pedido {
  id: number
  titulo: string
  cliente: string
  idCliente: string
  productos: ProductoPedido[]
  fecha: string
  estado: 'nuevo' | 'en_proceso' | 'completado'
}

const router = useRouter();

const volver = () => {
  router.go(-1)
}


const pedidos = ref<Pedido[]>([])

// Cargar pedidos guardados
const cargarPedidos = () => {
  const guardados = localStorage.getItem('pedidos')
  if (guardados) {
    pedidos.value = JSON.parse(guardados)
  }
}

// Guardar pedidos
const guardarPedidos = () => {
  localStorage.setItem('pedidos', JSON.stringify(pedidos.value))
}

// Procesar nuevo pedido
const procesarNuevoPedido = () => {
  if (store.pedidoRealizado && store.pedido.length > 0 && store.cliente.nombre) {
    const nuevoId = pedidos.value.length > 0 
      ? Math.max(...pedidos.value.map(p => p.id)) + 1 
      : 1
    
    const nuevoPedido: Pedido = {
      id: nuevoId,
      titulo: `Pedido #${String(nuevoId).padStart(3, '0')}`,
      cliente: store.cliente.nombre,
      idCliente: `CL-${store.cliente.numeroId}`,
      productos: store.pedido.map(p => ({
        nombre: p.nombre,
        cantidad: p.cantidad,
        precio: p.precio
      })),
      fecha: new Date().toLocaleString(),
      estado: 'nuevo'
    }
    
    pedidos.value = [...pedidos.value, nuevoPedido]
    guardarPedidos()
    store.resetPedido()
    
    // Notificar a otras pestañas
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'pedidos-actualizados'
    }))
  }
}

// Escuchar cambios en el store
watch(() => store.pedidoRealizado, (nuevoValor) => {
  if (nuevoValor) {
    procesarNuevoPedido()
  }
})

// Escuchar eventos de almacenamiento entre pestañas
const manejarEventoStorage = (event: StorageEvent) => {
  if (event.key === 'pedidos-actualizados') {
    cargarPedidos()
  }
}

// Configurar
onMounted(() => {
  cargarPedidos()
  window.addEventListener('storage', manejarEventoStorage)
  
  // Verificar inmediatamente por si hay pedidos pendientes
  if (store.pedidoRealizado) {
    procesarNuevoPedido()
  }
})

onUnmounted(() => {
  window.removeEventListener('storage', manejarEventoStorage)
})

const cambiarEstadoPedido = (id: number, estado: 'en_proceso' | 'completado') => {
  const index = pedidos.value.findIndex(p => p.id === id)
  if (index !== -1) {
    pedidos.value[index].estado = estado
    guardarPedidos()
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'pedidos-actualizados'
    }))
  }
}



</script>

<template>
  <header>
    <nav>
      <ComImagen/>
      <ul>
        <div class="container-buttom-come-back"><button @click="volver" class="btn-come-back"><font-awesome-icon :icon="faArrowLeft" class="arrow-back"/>Regresar</button></div>
      </ul>
    </nav>
  </header>
  <h1>Panel de pedidos</h1>


  <div class="contenedor-principal">
    <div class="contenido-principal">
      <div class="contenido-interno">
        <div v-if="pedidos.length === 0" class="sin-pedidos">
          <p>No hay pedidos pendientes</p>
        </div>
        
        <div class="cartas-container" v-else>
          <div v-for="pedido in pedidos" :key="pedido.id" class="carta-item">
            <div class="carta" :class="{
              'nuevo': pedido.estado === 'nuevo',
              'en-proceso': pedido.estado === 'en_proceso',
              'completado': pedido.estado === 'completado'
            }">
              <div class="carta-contenido">
                <h3>{{ pedido.titulo }}</h3>
                <small>{{ pedido.fecha }}</small>
                
                <div class="info-cliente">
                  <div class="info-line">
                    <span class="info-label">Nombre:</span>
                    <span class="info-value">{{ pedido.cliente }}</span>
                  </div>
                  <div class="info-line">
                    <span class="info-label">ID:</span>
                    <span class="info-value">{{ pedido.idCliente }}</span>
                  </div>
                </div>
                
                <div class="divider"></div>
                
                <div class="productos-lista">
                  <h4>Productos:</h4>
                  <ul>
                    <li v-for="(producto, index) in pedido.productos" :key="index">
                      • {{ producto.nombre }} (x{{ producto.cantidad }}) - ${{ producto.precio * producto.cantidad }}
                    </li>
                  </ul>
                </div>

                <div class="total-pedido">
                  <strong>Total: ${{ 
                    pedido.productos.reduce((total, producto) => 
                      total + (producto.precio * producto.cantidad), 0) 
                  }}</strong>
                </div>
              </div>
            </div>

            <div class="botones-accion">
              <button 
                class="btn-completado"
                @click="cambiarEstadoPedido(pedido.id, 'completado')"
                :disabled="pedido.estado === 'completado'"
              >
                {{ pedido.estado === 'completado' ? 'Completado' : 'Marcar como completo' }}
              </button>
              <button 
                class="btn-proceso"
                @click="cambiarEstadoPedido(pedido.id, 'en_proceso')"
                :disabled="pedido.estado !== 'nuevo'"
              >
                {{ pedido.estado === 'en_proceso' ? 'En proceso' : 'Poner en proceso' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jura:wght@700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

body {
  font-family: 'Jura', sans-serif;
  font-weight: normal;
  color: black;
  margin: 0;
  padding: 0;
}
header {
  padding: 20px;
  background-color: #000000;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
ul li {
  text-decoration: none;
  border-bottom: 5px solid #A65814;
  transition: border-bottom-color 0.3s ease-in-out;
  border-radius: 5px;
}
ul li:hover {
  border-bottom-color: rgb(17, 0, 255);
}
nav{
  margin: 0 auto;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom:2px solid #c7981a;
  margin-left: 200px;
}
nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
  margin-left: 740px;
  margin-top: 100px;
  padding: 0;
}
nav li a {
  font-family: 'Jura', sans-serif;
  text-decoration: none;
  color: white;
  padding: 10px;
}
.btn-come-back{
  width: 120px;
  height: 30px;
  border: none;
  border-radius: 10px;
  background-color: #faad14;
  font-family: 'Jura', sans-serif;
  display: flex;
  gap: 10px;
  justify-content: center;
  padding: 7px;
  transition: all 0.2s ease-in-out;
}
.btn-come-back:hover{
  background-color: #A65814;
  transform: scale(1.05);
  cursor:pointer;
}
.container-buttom-come-back{
  margin-top: -43px;
  width: 100px;
  height: 10px;
  margin-left: -90%;
  padding: 23px;
}
.arrow-back{
  margin-top: 1px;
}
h1 {
  font-family: 'Jura', sans-serif;
  text-align: center;
  color: #ffffff;
  background-color: #A65814;
  width: 81.2%;
  margin-left: 130px;
  padding: 15px;
}
/* Contenedor principal */
.contenedor-principal {
    width: 83%;
    margin-left: 130px;
    margin-top: 20px;
    position: relative;
}

/* Contenido principal */
.contenido-principal {
    background-color: transparent;
    border: 2px solid #A65814;
    border-top: none;
    min-height: 400px;
    width: 96.8%;
    margin-top: -21px;
    position: relative;
    padding: 20px;
}

/* Contenedor de cartas */
.cartas-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 50px;
    margin-left: 70px;
    margin-top: 40px;
}

/* Cada item de carta + botones */
.carta-item {
    display: flex;
    flex-direction: column;
}

/* Estilo de la carta */
.carta {
    border: 2px solid #8a4a10;
    border-radius: 18px;
    padding: 15px;
    box-shadow: 0 4px 8px rgba(171, 117, 17, 0.1);
    background: #d9ab23cc;
    font-family: 'Jura', sans-serif;
    text-align: center;
    transform: translateY(-50px);
    min-height: 200px;
}

.carta-contenido h3 {
    color: #ffffff;
    margin-top: 0;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid #7b4414;
}

/* Estilos para la estructura de la carta */
.info-cliente {
    margin-bottom: 15px;
    text-align: left;
}

.info-line {
    display: flex;
    margin-bottom: 5px;
}

.info-label {
    font-weight: bold;
    width: 60px;
    color: #a35a19;
}

.info-value {
    flex-grow: 1;
    color: #000000;
    margin-left: 20px;
}

.divider {
    height: 2px;
    background-color: #7a460c;
    margin: 10px 0;
}

.productos-lista {
    text-align: left;
    color: #343333;
}

.productos-lista h4 {
    color: #A65814;
    margin-bottom: 10px;
    font-size: 1em;
}

.productos-lista ul {
    list-style: none;
    padding-left: 5px;
    margin: 0;
}

.productos-lista li {
    margin-bottom: 5px;
}

/* Contenedor de botones DEBAJO de la carta */
.botones-accion {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: calc(100% - 30px);
    margin: -30px auto 0;
    padding: 0 15px;
}

/* Estilos de botones */
.btn-completado, .btn-proceso {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-family: 'Jura', sans-serif;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-completado {
    background-color: #d9ab23;
    color: #000;
}

.btn-completado:hover {
    background-color: #c7981a;
    transform: translateY(-2px);
}

.btn-proceso {
    background-color: white;
    color: #000;
    border: 2px solid #A65814;
}

.btn-proceso:hover {
    background-color: #A65814;
    color: white;
    transform: translateY(-2px);
}
.total-pedido {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px dashed #A65814;
  text-align: right;
  font-size: 1.1em;
}

.carta.nuevo {
  border-left: 5px solid #FFA500;
  background: #fff9e6;
}

.carta.en-proceso {
  border-left: 5px solid #3498db;
  background: #e6f3ff;
}

.carta.completado {
  border-left: 5px solid #2ecc71;
  background: #e6ffe6;
  opacity: 0.8;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sin-pedidos {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
}
</style>