<script setup lang="ts">
import ComImagen from './icons/IMGENES/ComImagen.vue'
import { store } from './datos'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const horaActual = ref('')
let intervaloHora: ReturnType<typeof setInterval>

// Funcion para la hora
const actualizarHora = () => {
  const ahora = new Date()
  horaActual.value = ahora.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

const pedidos = ref<Array<{
  id: string
  titulo: string
  fecha: string
  cliente: string
  idCliente: string
  productos: Array<{
    nombre: string
    precio: number
    cantidad: number
  }>
  estado: 'nuevo' | 'en_proceso' | 'completado'
}>>([])

// Generar un ID único
const generarId = () => Math.random().toString(36).substr(2, 9)

// Función para verificar si una fecha es de hoy (versión mejorada)
const esDeHoy = (fechaStr: string): boolean => {
  try {
    const fechaPedido = new Date(fechaStr)
    const hoy = new Date()
    
    return fechaPedido.getDate() === hoy.getDate() &&
           fechaPedido.getMonth() === hoy.getMonth() &&
           fechaPedido.getFullYear() === hoy.getFullYear()
  } catch (e) {
    console.error('Error al parsear fecha:', e)
    return false
  }
}

// Computed property para filtrar pedidos del día actual
const pedidosDeHoy = computed(() => {
  return pedidos.value.filter(pedido => esDeHoy(pedido.fecha))
})

// Guardar pedidos en localStorage
const guardarPedidos = () => {
  localStorage.setItem('pedidos', JSON.stringify(pedidos.value))
  localStorage.setItem('historialPedidos', JSON.stringify(store.historialPedidos))
}

// Cargar pedidos desde localStorage
const cargarPedidos = () => {
  const pedidosGuardados = localStorage.getItem('pedidos')
  if (pedidosGuardados) {
    pedidos.value = JSON.parse(pedidosGuardados)
  }
  
  const historialGuardado = localStorage.getItem('historialPedidos')
  if (historialGuardado) {
    store.historialPedidos = JSON.parse(historialGuardado)
  }
}

// Observar cambios en la store para nuevos pedidos
watch(() => store.pedidoRealizado, (nuevoValor) => {
  if (nuevoValor && store.pedido.length > 0) {
    agregarNuevoPedido()
  }
})

// Función para agregar nuevo pedido
const agregarNuevoPedido = () => {
  const ahora = new Date()
  const nuevoPedido = {
    id: generarId(),
    titulo: `Pedido #${pedidos.value.length + 1}`,
    fecha: ahora.toISOString(), // Usar formato ISO
    cliente: store.cliente.nombre,
    idCliente: `${store.cliente.tipoId} ${store.cliente.numeroId}`,
    productos: [...store.pedido.map(p => ({
      nombre: p.nombre,
      precio: p.precio,
      cantidad: p.cantidad
    }))],
    estado: 'nuevo' as const
  }
  
  pedidos.value.unshift(nuevoPedido)
  store.addToHistorial(nuevoPedido)
  store.resetPedido()
  guardarPedidos()
}

// Función para cambiar el estado de un pedido
const cambiarEstadoPedido = (id: string, nuevoEstado: 'nuevo' | 'en_proceso' | 'completado') => {
  const pedido = pedidos.value.find(p => p.id === id);
  if (pedido) {
    pedido.estado = nuevoEstado;
    
    const estadoCliente = nuevoEstado === 'en_proceso' ? 'en_preparacion' : 
                         nuevoEstado === 'completado' ? 'completado' : 'procesando';
    
    const mensaje = nuevoEstado === 'en_proceso' ? 
      '👨‍🍳 Tu pedido está en proceso y siendo preparado por nuestros chefs' :
      '✅ ¡Pedido completado! Por favor recógelo en caja';
    
    store.actualizarEstadoCliente(pedido.idCliente.split(' ')[1], estadoCliente, mensaje);
    guardarPedidos()
  }
};

// Función para navegar a facturas
const irAFacturas = () => {
  router.push('/Facturas')
}

// Iniciar y limpiar el intervalo
onMounted(() => {
  cargarPedidos()
  actualizarHora()
  intervaloHora = setInterval(actualizarHora, 1000)

  if (store.historialPedidos.length > 0) {
    pedidos.value = [...store.historialPedidos]
  }
  
  if (store.pedidoRealizado && store.pedido.length > 0) {
    agregarNuevoPedido()
  }
})

onUnmounted(() => {
  clearInterval(intervaloHora)
})

// Guardar despues de cada cambio
watch(pedidos, () => {
  guardarPedidos()
}, { deep: true })
</script>

<template>
  <header>
    <nav>
      <ComImagen/>
      <ul>
        <li class="l"><router-link to="/Sesion">Empleados</router-link></li>
      </ul>
    </nav>
  </header>

  <div class="header-pedidos">
    <div class="titulo-container">
      <div class="titulo-izquierda">
        <i class="fas fa-utensils icono-titulo"></i>
        <span>Ordenes/Pedidos de Hoy</span>
      </div>
      <div class="titulo-derecha">
        <span>Cafeteria Coffee Bike <i class="fas fa-coffee icono-cafe"></i></span>
      </div>
    </div>
  </div>
  
  <div class="stats-container">
    <div class="facturas-card" @click="irAFacturas">
      <div class="facturas-header">
        <h3>Facturas del dia </h3>
      </div>
      <div class="facturas-content">
        <i class="fas fa-file-invoice facturas-icon"></i>
      </div>
    </div>

    <div class="orders-count-card">
      <div class="orders-count-header">
        <h3>N° de Órdenes</h3>
        <i class="fas fa-clipboard-list"></i>
      </div>
      <div class="orders-count-content">
        <span class="orders-number">{{ pedidosDeHoy.length }}</span>
        <span class="orders-label">Órdenes de hoy</span>
      </div>
    </div>

    <div class="time-card">
      <div class="time-header">
        <h3>Hora Actual</h3>
        <i class="fas fa-clock"></i>
      </div>
      <div class="time-content">
        <span class="time-number">{{ horaActual }}</span>
        <span class="time-label">Reloj en tiempo real</span>
      </div>
    </div>
  </div>

  <div class="contenedor-principal">
    <div class="contenido-principal">
      <div class="contenido-interno">
        <div v-if="pedidosDeHoy.length === 0" class="sin-pedidos">
          <p>No hay pedidos para el día de hoy</p>
        </div>
        
        <div class="pedidos-container" v-else>
          <div v-for="pedido in pedidosDeHoy" :key="pedido.id" class="pedido-completo">
            <div class="pedido-item" :class="{
                'nuevo': pedido.estado === 'nuevo',
                'en-proceso': pedido.estado === 'en_proceso',
                'completado': pedido.estado === 'completado'
              }">
              <div class="pedido-icono">
                <i class="fas fa-utensils"></i>
              </div>
              
              <div class="pedido-contenido">
                <div class="pedido-header">
                  <span class="pedido-numero">{{ pedido.titulo }}</span>
                  <span class="pedido-cliente">{{ pedido.cliente }}</span>
                </div>
                
                <div class="pedido-productos">
                  <div v-for="(producto, index) in pedido.productos" :key="index" class="producto-item">
                    {{ producto.nombre }} (x{{ producto.cantidad }}) - ${{ producto.precio * producto.cantidad }}
                  </div>
                </div>
                
                <div class="pedido-footer">
                  <div class="fecha-pedido">
                    <small>{{ pedido.fecha }}</small>
                  </div>
                  <div class="total-pedido">
                    <strong>Total: ${{
                      pedido.productos.reduce((total, producto) => 
                        total + (producto.precio * producto.cantidad), 0) 
                    }}</strong>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="pedido-acciones-externas">
              <button 
                class="btn-completado"
                @click="cambiarEstadoPedido(pedido.id, 'completado')"
                :disabled="pedido.estado === 'completado'"
              >
                {{ pedido.estado === 'completado' ? '✓ Completado' : 'Pedido completo' }}
              </button>
              <button 
                class="btn-proceso"
                @click="cambiarEstadoPedido(pedido.id, 'en_proceso')"
                :disabled="pedido.estado !== 'nuevo'"
              >
                {{ pedido.estado === 'en_proceso' ? '↻ En proceso' : 'Poner en proceso' }}
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
    border-bottom-color: rgb(231, 230, 244);
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
    margin-left: 830px;
    margin-top: 100px;
    padding: 0;

  }
  
  nav li a {
    font-family: 'Jura', sans-serif;

    text-decoration: none;
    color: white;
    padding: 10px;
  }
  
  #res:hover {
    background-color: #ff9178;
    color: aliceblue;
  }
  
  #res{
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
    background-color: #e03743;
    text-decoration: none;
    border-bottom: 0px;
    width: 150px;
    text-align: center;
    font-size: 18px;
    padding: 4px;
    border-radius: 15px;
    font-family: 'Jura', sans-serif;

  }

  .header-pedidos {
  background-color: transparent;
  padding: 15px 0;
  width: 82%;
  margin-left: 130px;

}

.titulo-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
  border: 2px solid #A65814;
  padding: 10px 20px;
}

.titulo-izquierda {
  display: flex;
  align-items: center;
  gap: 15px;
  font-family: 'Jura', sans-serif;
  font-size: 35px;
  color: #c7981a;
  font-weight: bold;
  margin-left: 30px;
}

.icono-titulo {
  font-size: 1.8rem;
  color: #d9ab23;
}


.titulo-derecha {
  font-family: 'Jura', sans-serif;
  font-size: 1.5rem;
  color: #e6f3ff;
  font-weight: bold;
  flex-grow: 1;
  margin-left: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 580px;
}

.icono-cafe {
  font-size: 1.3rem;
  color: #e6f3ff;
  margin-left: 5px;
}

.titulo-derecha span {
  display: flex;
  align-items: center;
}

.stats-container {
  display: flex;
  gap: 90px; 
  justify-content: center;
  margin: 30px auto;
  max-width: 1000px;
  margin-left: 280px;
  flex-wrap: wrap; 
}

.stats-card {
  max-width: 900px;
  width: 600px;
  padding: 20px;
  background: #000000;
  border: 2px solid #7a460c;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  top: 0;
}

.stats-card.hovered {
  top: -5px;
  box-shadow: 0 4px 4px #d9ab23;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.stats-header h3 {
  margin: 0;
  color:#d9ab23;
  font-size: 1.2rem;
  font-family: 'Jura', sans-serif;
}

.stats-header i {
  color: #d9ab23;
  font-size: 1.5rem;

}

.facturas-card {
  width: 200px;
  background-color: rgb(0, 0, 0);
  border-radius: 10px;
  border: 2px solid #7a460c;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.facturas-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 4px #d9ab23;
  
}

.facturas-header h3 {
  margin: 0 0 15px 0;
  font-size: 1.2rem;
  color: #d9ab23;
  font-family: 'Jura', sans-serif;
}

.facturas-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
}

.facturas-icon {
  font-size: 5rem;
  color: #c7981a;
  margin-top: 15px;

}


.orders-count-card {
  max-width: 800px;
  width: 230px;
  padding: 20px;
  background: #000000;
  border: 2px solid #7a460c;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.orders-count-card:hover {
  top: -5px;
  box-shadow: 0 4px 4px #d9ab23;
}

.orders-count-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.orders-count-header h3 {
  color:#d9ab23;
  font-size: 1.2rem;
  font-family: 'Jura', sans-serif;
  margin-top: -10px;
}

.orders-count-header i {
  color: #d9ab23;
  font-size: 1.5rem;
  margin-top: -30px;
}

.orders-count-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.orders-number {
  font-size: 3rem;
  font-weight: bold;
  color: #d9ab23;
  font-family: 'Jura', sans-serif;
  margin-top: 15px;
}

.orders-label {
  margin-top: 40px;
  font-size: 1rem;
  color: #e6f3ff;
  font-family: 'Jura', sans-serif;
}

.time-card {
  width: 230px;
  padding: 20px;
  background: #000000;
  border: 2px solid #7a460c;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.time-card:hover {
  top: -5px;
  box-shadow: 0 4px 4px #d9ab23;
}

.time-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 15px;
}

.time-header h3 {
  margin-top: -5px;
  color:#d9ab23;
  font-size: 1.2rem;
  font-family: 'Jura', sans-serif;
}

.time-header i {
  color: #d9ab23;
  font-size: 1.5rem;
  margin-top: -15px;
}

.time-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.time-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #d9ab23;
  font-family: 'Jura', sans-serif;
  margin-top: 10px;
  letter-spacing: 2px;
}

.time-label {
  font-size: 1rem;
  color: #e6f3ff;
  font-family: 'Jura', sans-serif;
  margin-top: 50px;
}

/* Ajustamos el ancho de las tarjetas para que sean consistentes */
.stats-card, .orders-count-card, .time-card {
  width: 230px;
  min-height: 200px;
}

.pedidos-container {
  display: flex;
  flex-direction: column;
  margin-left: 150px;
  margin-top: 40px;
  width: 100%;
  min-width: 800px;
  max-width: 1200px;
  font-family: 'Jura', sans-serif;
  box-sizing: border-box;
}

.pedido-completo {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  width: 100%;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.pedido-completo:hover .pedido-item {
  transform: scale(1.02);
  box-shadow: 0 8px 20px rgba(191, 135, 31, 0.877);
}

.pedido-item {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  transition: all 0.3s ease;
  flex-grow: 1;
  width: calc(100% - 170px);
  min-width: 0;
  background-color: #000000;
  border: 2px solid #BF871F;
  border-radius: 14px;
  position: relative;
}

.pedido-icono {
  font-size: 1.8rem;
  color: #7a460c;
  padding: 12px;
  background: #fff2cc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  margin-top: 40px;
}

.pedido-contenido {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.pedido-header {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-left: 20px;
}

.pedido-numero {
  font-weight: bold;
  color: #BF871F;
  font-size: 1.2rem;
}

.pedido-cliente {
  font-weight: bold;
  color: #e6f3ff;
  font-size: 1.1rem;
}

.pedido-productos {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 30px;
  margin-left: 20px;
  margin-top: 10px;
}

.producto-item {
  font-size: 0.95rem;
  color: #BF871F;
  padding: 5px;
  background: rgba(255, 242, 204, 0.1);
  border-radius: 5px;
}

.pedido-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px dashed #BF871F;
  width: 105%;
  margin-left: -60px;
}

.fecha-pedido {
  font-size: 1.2rem;
  color: #BF871F;
  margin-left: 0px;
}


.total-pedido {
  font-size: 1.2rem;
  font-weight: bold;
  color: #BF871F;
}


.pedido-acciones-externas {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 160px;
  padding: 40px;
  justify-content: center;
  margin-right: -40px;
  margin-top: 30px;
}

.btn-completado, .btn-proceso {
  padding: 10px 15px;
  font-size: 0.9rem;
  white-space: nowrap;
  border-radius: 8px;
  border: none;
  font-family: 'Jura', sans-serif;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-completado {
  background-color: #BF871F;
  color: #000;
}

.btn-completado:hover:not(:disabled) {
  background-color: #365e2c;
  transform: translateY(-2px);
  color: #ffffff;
  box-shadow: 0 4px 8px rgba(243, 242, 238, 0.742);
  border: 2px solid#e6f3ff;
}

.btn-proceso {
  background-color: #A65814;
  color: #000;
  border: 2px solid #000000;
}

.btn-proceso:hover:not(:disabled) {
  background-color: #ffffff;
  color: rgb(0, 0, 0);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(191, 135, 31, 0.718);
  border: 2px #7a460c;
}

.pedido-item.nuevo {
  border-left: 5px solid #FFA500;
}

.pedido-item.en-proceso {
  border-left: 5px solid #3498db;
}

.pedido-item.completado {
  border-left: 5px solid #2ecc71;
  opacity: 0.9;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>