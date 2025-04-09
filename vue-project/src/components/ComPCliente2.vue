<script setup lang="ts">
import lottie from 'lottie-web'
import { onMounted, onUnmounted, ref, computed, reactive, watch } from 'vue'
import '@fortawesome/fontawesome-free/css/all.min.css'
import jsPDF from 'jspdf'
import { store } from './datos'
import { useRouter } from 'vue-router'

const router = useRouter()
const clienteId = computed(() => store.cliente.numeroId)

// Definicion del tipo para estados de pedido
type EstadoPedido = 'procesando' | 'en_preparacion' | 'completado'

// Estado reactivo - DEFINIDO AL PRINCIPIO
const estadoVista = reactive({
  textoEstado: 'Esperando confirmación del pedido',
  iconoEstado: 'fa-clock',
  ultimoEstado: 'procesando' as EstadoPedido,
  cargando: false,
  ultimaActualizacion: Date.now()
})

// Refs
const animationContainer = ref(null)
const isHovering = ref(false)
let intervalId: ReturnType<typeof setInterval>
let ws: WebSocket | null = null

const actualizarIcono = (estado: EstadoPedido) => {
  switch(estado) {
    case 'en_preparacion': estadoVista.iconoEstado = 'fa-utensils'; break
    case 'completado': estadoVista.iconoEstado = 'fa-check-circle'; break
    default: estadoVista.iconoEstado = 'fa-clock'
  }
}

// Guardar toda la informacion importante del estado
const guardarEstadoCompleto = () => {
  const estadoGuardado = {
    cliente: store.cliente,
    pedido: store.pedido,
    ultimoEstado: estadoVista.ultimoEstado,
    textoEstado: estadoVista.textoEstado,
    timestamp: Date.now()
  }
  
  localStorage.setItem('estado_completo', JSON.stringify(estadoGuardado))
  localStorage.setItem(`cliente_${clienteId.value}`, JSON.stringify(store.cliente))
  guardarPedidoEnLocalStorage()
}

// Recuperar toda la informacion importante del estado
const recuperarEstadoCompleto = () => {
  // Si hay un clienteId en la URL pero no en localStorage, lo usamos primero
  const urlParams = new URLSearchParams(window.location.search)
  const urlClienteId = urlParams.get('clienteId')
  
  // Primero intentamos cargar el cliente desde localStorage
  const clienteGuardado = localStorage.getItem('cliente_actual')
  
  if (clienteGuardado) {
    const cliente = JSON.parse(clienteGuardado)
    store.setCliente(cliente.nombre, cliente.tipoId, cliente.numeroId, cliente.desdeMenu)
  } else if (urlClienteId) {
    // Si hay un clienteId en la URL, intentamos cargar esa informacin especifica
    const clienteEspecifico = localStorage.getItem(`cliente_${urlClienteId}`)
    if (clienteEspecifico) {
      const cliente = JSON.parse(clienteEspecifico)
      store.setCliente(cliente.nombre, cliente.tipoId, cliente.numeroId, cliente.desdeMenu)
    }
  }
  
  // Ahora que tenemos clienteId se carga el pedido asociado
  cargarPedidoDesdeLocalStorage()
  
  // Finalmente cargamos el estado visual
  const estadoGuardado = localStorage.getItem('estado_completo')
  if (estadoGuardado) {
    const estado = JSON.parse(estadoGuardado)
    
    // Solo restauramos el estado si es para el mismo cliente o si no hay cliente actual
    if (!clienteId.value || estado.cliente.numeroId === clienteId.value) {
      estadoVista.ultimoEstado = estado.ultimoEstado
      estadoVista.textoEstado = estado.textoEstado
      actualizarIcono(estado.ultimoEstado)
      estadoVista.ultimaActualizacion = estado.timestamp || Date.now()
      
      // Si no haia client restauramos el del estado guardado
      if (!clienteId.value && estado.cliente.numeroId) {
        store.setCliente(
          estado.cliente.nombre,
          estado.cliente.tipoId,
          estado.cliente.numeroId,
          estado.cliente.desdeMenu
        )
      }
    }
  }
}

const cargarEstadoInicial = () => {
  const estadoCliente = store.getEstadoCliente(clienteId.value)
  estadoVista.textoEstado = estadoCliente.mensaje
  estadoVista.ultimoEstado = estadoCliente.estado
  actualizarIcono(estadoCliente.estado)
  estadoVista.ultimaActualizacion = Date.now()
}

const cargarPedidoDesdeLocalStorage = () => {
  // Primero intentar cargar pedido especifico del cliente
  if (clienteId.value) {
    const pedidoGuardado = localStorage.getItem(`pedido_${clienteId.value}`)
    if (pedidoGuardado) {
      try {
        const pedidoParsed = JSON.parse(pedidoGuardado)
        if (Array.isArray(pedidoParsed) && pedidoParsed.length > 0) {
          store.pedido = pedidoParsed
          return
        }
      } catch (error) {
        console.error('Error al cargar pedido específico:', error)
      }
    }
  }
  
  const pedidoAnonimo = localStorage.getItem('pedido_anonimo')
  if (pedidoAnonimo) {
    try {
      const pedidoParsed = JSON.parse(pedidoAnonimo)
      if (Array.isArray(pedidoParsed) && pedidoParsed.length > 0) {
        store.pedido = pedidoParsed
      }
    } catch (error) {
      console.error('Error al cargar pedido anónimo:', error)
    }
  }
  
  // Guardar cliente actual en localStorage para referencia
  if (store.cliente) {
    localStorage.setItem('cliente_actual', JSON.stringify(store.cliente))
  }
}

const guardarPedidoEnLocalStorage = () => {
  // Guardar siempre el pedido incluso si no hay clienteId
  if (store.pedido && store.pedido.length > 0) {
    // Guardar pedido generico 
    localStorage.setItem('pedido_anonimo', JSON.stringify(store.pedido))
    
    // Guardar pedido especifico del cliente si existe
    if (clienteId.value) {
      localStorage.setItem(`pedido_${clienteId.value}`, JSON.stringify(store.pedido))
    }
    
    // Guardar referencia del pedido más reciente
    localStorage.setItem('pedido_reciente', JSON.stringify({
      clienteId: clienteId.value || 'anonimo',
      pedido: store.pedido,
      timestamp: Date.now()
    }))
  }
}

const generarPDF = () => {
  const doc = new jsPDF()
  
  // Configuracion inicial
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("Factura de Compra", 105, 20, { align: 'center' })
  
  // Informacion del cliente
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 35)
  doc.text(`Cliente: ${store.cliente.nombre}`, 20, 45)
  doc.text(`Identificación: ${store.cliente.tipoId} ${store.cliente.numeroId}`, 20, 55)
  
  // Linea divisoria
  doc.setLineWidth(0.5)
  doc.line(20, 60, 190, 60)

  // Detalle del pedido
  let y = 70
  doc.setFontSize(12)
  doc.text("Detalle del pedido:", 20, y)
  y += 10

  store.pedido.forEach((producto, index) => {
    doc.setFont("helvetica", "bold")
    doc.text(`${index + 1}. ${producto.nombre}`, 20, y)
    doc.setFont("helvetica", "normal")
    doc.text(`Cantidad: ${producto.cantidad}`, 20, y + 7)
    doc.text(`Precio unitario: $${producto.precio.toLocaleString()}`, 20, y + 14)
    doc.text(`Total: $${(producto.precio * producto.cantidad).toLocaleString()}`, 20, y + 21)
    y += 30
  })

  // Total
  doc.setLineWidth(0.5)
  doc.line(20, y, 190, y)
  y += 10

  const total = store.pedido.reduce((acc, p) => acc + p.precio * p.cantidad, 0)
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text(`Total a pagar: $${total.toLocaleString()}`, 20, y)

  doc.save(`Factura_${store.cliente.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`)
}

const confirmarPedido = () => {
  estadoVista.cargando = true
  
  try {
    store.confirmarPedido(clienteId.value)
    estadoVista.textoEstado = 'Pedido confirmado con éxito'
    guardarEstadoCompleto()
  } catch (error) {
    console.error('Error al confirmar pedido:', error)
    estadoVista.textoEstado = 'Error: ' + (error as Error).message
  } finally {
    estadoVista.cargando = false
  }
}

// Crear y conectar WebSocket
const connectWebSocket = () => {
  if (!clienteId.value) return;
  
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = window.location.host
  const wsUrl = `${protocol}//${host}/ws/cliente/${clienteId.value}`
  
  try {
    ws = new WebSocket(wsUrl)
    
    ws.onopen = () => {
      console.log('WebSocket conectado')
      // Enviar un mensaje de identificación al conectarse
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'identificacion',
          clienteId: clienteId.value
        }))
      }
    }
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'actualizacion_estado') {
          estadoVista.textoEstado = data.mensaje
          estadoVista.ultimoEstado = data.estado
          actualizarIcono(data.estado)
          estadoVista.ultimaActualizacion = Date.now()
          
          // Actualizar el estado en el store
          store.actualizarEstadoCliente(clienteId.value, data.estado, data.mensaje)
          
          // Guardar el nuevo estado
          guardarEstadoCompleto()
        }
      } catch (error) {
        console.error('Error al procesar mensaje WebSocket:', error)
      }
    }
    
    ws.onerror = (error) => {
      console.error('Error de WebSocket:', error)
      // Reiniciar la conexión después de un error
      setTimeout(connectWebSocket, 5000)
    }
    
    ws.onclose = () => {
      console.log('WebSocket desconectado')
      // Intentar reconexión automática
      setTimeout(connectWebSocket, 5000)
    }
  } catch (error) {
    console.error('Error al conectar WebSocket:', error)
    // Fallback al método de polling si hay error al conectar WebSocket
    setupPolling()
  }
}

// Método de polling como fallback
const setupPolling = () => {
  // Verificar si ya hay un intervalo establecido
  if (intervalId) {
    clearInterval(intervalId)
  }
  
  // Configurar polling cada 2 segundos
  intervalId = setInterval(() => {
    if (!clienteId.value) return;
    
    const { estado, mensaje } = store.obtenerEstadoPedido(clienteId.value) as {
      estado: EstadoPedido;
      mensaje: string;
    }
    
    if (estado !== estadoVista.ultimoEstado || mensaje !== estadoVista.textoEstado) {
      estadoVista.textoEstado = mensaje
      estadoVista.ultimoEstado = estado
      actualizarIcono(estado)
      estadoVista.ultimaActualizacion = Date.now()
      
      // Guardar el nuevo estado
      guardarEstadoCompleto()
    }
  }, 2000)
}

// Función para actualizar forzadamente
const actualizarEstadoManual = () => {
  if (!clienteId.value) return;
  
  const { estado, mensaje } = store.obtenerEstadoPedido(clienteId.value) as {
    estado: EstadoPedido;
    mensaje: string;
  }
  
  estadoVista.textoEstado = mensaje
  estadoVista.ultimoEstado = estado
  actualizarIcono(estado)
  estadoVista.ultimaActualizacion = Date.now()
  
  // Guardar el nuevo estado
  guardarEstadoCompleto()
}

// Watcher para guardar el pedido cuando cambie
watch(() => store.pedido, (newPedido) => {
  // Solo guardar si hay elementos en el pedido
  if (newPedido && newPedido.length > 0) {
    guardarPedidoEnLocalStorage()
    guardarEstadoCompleto()
  } else {
    // Si el pedido está vacío, limpiar los datos antiguos
    if (clienteId.value) {
      localStorage.removeItem(`pedido_${clienteId.value}`)
    }
    localStorage.removeItem('pedido_anonimo')
  }
}, { deep: true })

// Watcher para cambios en el estado
watch(() => store.getEstadoCliente(clienteId.value), (nuevoEstado) => {
  estadoVista.textoEstado = nuevoEstado.mensaje
  estadoVista.ultimoEstado = nuevoEstado.estado
  actualizarIcono(nuevoEstado.estado)
  estadoVista.ultimaActualizacion = Date.now()
  
  // Guardar el nuevo estado
  guardarEstadoCompleto()
}, { immediate: true })

// Watcher para cambios en el cliente
watch(() => store.cliente, (nuevoCliente) => {
  // Guardar el cliente actual en localStorage
  localStorage.setItem('cliente_actual', JSON.stringify(nuevoCliente))
  
  // Guardar cliente específico por ID
  if (nuevoCliente.numeroId) {
    localStorage.setItem(`cliente_${nuevoCliente.numeroId}`, JSON.stringify(nuevoCliente))
  }
}, { deep: true, immediate: true })

// Escuchar el evento de beforeunload para guardar estado antes de cerrar la página
window.addEventListener('beforeunload', () => {
  guardarEstadoCompleto()
})

// Lifecycle hooks
onMounted(() => {
  // Primero cargar el pedido desde localStorage
  cargarPedidoDesdeLocalStorage()
  // SEGUNDo intentamos recuperar el estado anterior
  recuperarEstadoCompleto()
  
  // Si después de recuperar el estado no hay clienteId, redirigimos
  if (!clienteId.value) {
    router.push('/menu')
    return
  }

  // Cargar estado inicial o del servidor
  cargarEstadoInicial()

  // Configurar animación Lottie
  lottie.loadAnimation({
    container: animationContainer.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'https://lottie.host/661b9ed1-0384-4333-b8d6-86367aa242e6/yu2qrylFKV.json'
  })

  // Intentar conectar con WebSocket primero
  connectWebSocket()
  
  // Si después de 3 segundos no hay conexión WebSocket, fallback a polling
  setTimeout(() => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.log('Fallback a polling debido a fallo en WebSocket')
      setupPolling()
    }
  }, 3000)

  // Escuchar eventos personalizados para este cliente
  const handler = (e: CustomEvent) => {
    estadoVista.textoEstado = e.detail.mensaje
    estadoVista.ultimoEstado = e.detail.estado
    actualizarIcono(e.detail.estado)
    estadoVista.ultimaActualizacion = Date.now()
    store.actualizarEstadoCliente(clienteId.value, e.detail.estado, e.detail.mensaje)
    
    // Guardar el nuevo estado
    guardarEstadoCompleto()
  }
  
  window.addEventListener(`estadoPedidoCambiado:${clienteId.value}`, handler as EventListener)

  // Configurar evento para actualizar manualmente
  window.addEventListener('actualizar_estado_cliente', () => {
    actualizarEstadoManual()
  })
  
  // Añade listener para sincronizar entre pestañas
  window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key === 'estado_completo') {
      recuperarEstadoCompleto()
    }
  })

  return () => {
    window.removeEventListener(`estadoPedidoCambiado:${clienteId.value}`, handler as EventListener)
    window.removeEventListener('actualizar_estado_cliente', actualizarEstadoManual)
    window.removeEventListener('storage', recuperarEstadoCompleto)
  }
})

onUnmounted(() => {
  // Guardar estado antes de desmontar el componente
  guardarEstadoCompleto()
  
  // Limpiar intervalos y conexiones
  if (intervalId) {
    clearInterval(intervalId)
  }
  
  if (ws) {
    ws.close()
    ws = null
  }
})

declare global {
  interface Window {
    addEventListener(
      type: string,
      listener: (event: CustomEvent<{ estado: EstadoPedido; mensaje: string }>) => void,
      options?: boolean | AddEventListenerOptions
    ): void
  }
}
const limpiarPedido = () => {
  store.pedido = []
  if (clienteId.value) {
    localStorage.removeItem(`pedido_${clienteId.value}`)
  }
  localStorage.removeItem('pedido_anonimo')
  localStorage.removeItem('pedido_reciente')
}
</script>

<template>
    <header>
        <nav>
            <img src="https://i.postimg.cc/QMwjX2vk/Whats-App-Image-2024-11-23-at-10-53-04-PM.jpg" class="imagen" alt="logo">
        </nav>
        <hr>
    </header>

    <div class="progress-bar">
        <div class="progress-step" :class="{'active-step': estadoVista.ultimoEstado}">
            <div class="progress-circle">
                <i class="fas fa-list"></i>
            </div>
            <span class="progress-text">Elegir compra</span>
        </div>
        <div class="progress-step" :class="{'active-step': estadoVista.ultimoEstado}">
            <div class="progress-circle">
                <i class="fas fa-edit"></i>
            </div>
            <span class="progress-text">Insertar datos</span>
        </div>
        <div class="progress-step" :class="{'active-step': estadoVista.ultimoEstado}">
            <div class="progress-circle">
                <i class="fas fa-shopping-cart"></i>
            </div>
            <span class="progress-text">Pedir pedido</span>
        </div>
        <div class="progress-step" 
             :class="{
               'active-step': estadoVista.ultimoEstado,
               'current-step': estadoVista.ultimoEstado === 'procesando' || estadoVista.ultimoEstado === 'en_preparacion'
             }">
            <div class="progress-circle">
                <i :class="estadoVista.ultimoEstado === 'completado' ? 'fas fa-check' : 'fas fa-clock'"></i>
            </div>
            <span class="progress-text">Esperar pedido</span>
        </div>
        <div class="progress-step" :class="{'active-step': estadoVista.ultimoEstado === 'completado'}">
            <div class="progress-circle">
                <i class="fas fa-check"></i>
            </div>
            <span class="progress-text">Listo</span>
        </div>
    </div>
    

    <div class="contenedor-L">
        <div class="bienvenida-L">
            <h2 class="texto-bienvenido">Bienvenido Cliente</h2>
        </div>
        
        <div class="contenedor-inferior">
        <div class="datos-L">
            <h3 class="titulo-datos">Tus Datos:</h3>
            
            <div class="fila-dato">
                <span class="etiqueta">Nombre:</span>
                <span class="valor">{{ store.cliente.nombre }}</span>
            </div>
            
            <div class="fila-dato">
                <span class="etiqueta">Tipo de documento:</span>
                <span class="valor">{{ store.cliente.tipoId }}</span>
            </div>
            
            <div class="fila-dato">
                <span class="etiqueta">Identificación:</span>
                <span class="valor">{{ store.cliente.numeroId }}</span>
            </div>
        </div>
        
        <div class="animacion-container" ref="animationContainer"></div>
        </div>
    </div>
    <div class="pedido-container">
        <h2 class="titulo-pedido">Tu Pedido</h2>
        
        <div class="carta-wrapper"
            @mouseenter="isHovering = true"
            @mouseleave="isHovering = false">
            <div class="carta-pedido" 
                :class="{
                'zoom-effect': isHovering,
                'color-effect': isHovering,
                'empty-pedido': !store.pedido || store.pedido.length === 0
                }">
                <div class="detalles-pedido">
                    <h2 class="titulo-pediste">Pediste:</h2>
                    <div v-if="!store.pedido || store.pedido.length === 0" class="empty-message">
                        <i class="fas fa-shopping-cart"></i>
                        <p>No hay productos en tu pedido</p>
                    </div>
                    <ul v-else class="lista-productos">
                        <li v-for="(producto, index) in store.pedido" :key="index">
                            • {{ producto.nombre }} ({{ producto.cantidad }})
                        </li>
                    </ul>
                    <div v-if="store.pedido && store.pedido.length > 0" class="subtotal">
                        <span>Subtotal:</span>
                        <span class="precio">
                            ${{
                                store.pedido.reduce((acc, p) => acc + (p.precio * p.cantidad), 0).toLocaleString()
                            }}
                        </span>
                    </div>
                </div>
            </div>
        
            <div class="acciones-pedido">
                <button class="btn-mas-info" 
                        :class="{'show-btn': isHovering}"
                        @click="generarPDF"
                        :disabled="!store.pedido || store.pedido.length === 0">
                    Descargar Factura
                </button>

            </div>
        </div>
        
        <div class="estado-pedido">
            <div class="estado-card como-va">
                <h3>¿Cómo va tu pedido?</h3>
                <div class="estado-content">
                    <i class="fas" :class="estadoVista.iconoEstado"></i>
                    <p>{{ estadoVista.textoEstado }}</p>
                    <span class="tiempo-actualizacion">
                        Última actualización: {{ new Date(estadoVista.ultimaActualizacion).toLocaleTimeString() }}
                    </span>
                </div>
            </div>
            
            <div class="estado-card en-preparacion">
                <h3>En preparación:</h3>
                <div class="estado-content">
                    <i class="fas fa-utensils"></i>
                    <p v-if="estadoVista.ultimoEstado === 'completado'">
                        ¡Listo para recoger en caja!
                    </p>
                    <p v-else-if="estadoVista.ultimoEstado === 'en_preparacion'">
                        Los chefs están trabajando en tu pedido
                    </p>
                    <p v-else>
                        Esperando para comenzar la preparación
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
body {
    font-family: 'Jura', sans-serif;
    font-weight: normal;
    color: black;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
}

header {
    padding: 20px;
    background-color: #000000;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.imagen {
    height: 100px;
    width: 140px; 
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #D9AB23;
}

hr {
    border-top: 2px solid #D9AB23;
    margin: 20px auto;
    width: 90%;
}

.progress-bar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #A65814;
    margin: 20px auto;
    width: 90%;
    height: 9px;
    max-height: 10%;
    max-width: 1200px;
    border-radius: 8px;
    margin-top: -10px;
    border-bottom: 2px solid #D9AB23;
}

.progress-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.progress-circle {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #A65814;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
    margin-top: 30px;
    color: #000000;
    font-size: 20px;
}

.active-step .progress-circle {
    background-color: #D9AB23;
    color: white;
}

.progress-text {
    font-family: 'Jura', sans-serif;
    font-size: 14px;
    color: #ffffff;
    text-align: center;
}

.active-step .progress-text {
    color: #D9AB23;
    font-weight: bold;
}

.contenedor-L {
    width: 90%;
    max-width: 1200px;
    margin: 20px auto;
    background-color: #000000;
    border-radius: 8px;
    overflow: hidden;
    height: 380px;
}

.bienvenida-L {
    width: 100%;
    padding: 20px 0;
    text-align: center;
    border-top: 2px solid #D9AB23;
    margin-top: 40px;
}

.texto-bienvenido {
    color: #ffffff;
    font-size: 28px;
    font-family: 'Jura', sans-serif;
    margin: 0;
}

.contenedor-inferior {
    display: flex;
    min-height: 400px;
}

.datos-L {
    width: 50%;
    padding: 30px;
    box-sizing: border-box;
}

.titulo-datos {
    text-align: center;
    color: #A65814;
    font-family: 'Jura', sans-serif;
    font-size: 1.5rem;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #D9AB23;
}

.fila-dato {
    display: flex;
    margin: 20px 0;
    padding: 0 15px;
}

.etiqueta {
    font-weight: bold;
    color: #A65814;
    width: 150px;
    font-family: 'Jura', sans-serif;
}

.valor {
    color: #ffffff;
    flex-grow: 1;
    font-family: 'Jura', sans-serif;
    border-bottom: 1px dotted #D9AB23;
    padding-bottom: 5px;
}

.animacion-container {
    width: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    margin-top: -110px;
    margin-left: 190px;
}

/* Estilos para la nueva sección de pedido */
.pedido-container {
    width: 90%;
    height: 400px;
    max-width: 1200px;
    margin: 30px auto;
    background-color: #000000;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(239, 237, 237, 0.1);
    border: 1px solid #A65814;
    margin-left: 190px;
}

.titulo-pedido {
    color: white;
    text-align: center;
    font-family: 'Jura', sans-serif;
    margin-bottom: 20px;
    border-bottom: 2px solid #D9AB23;
    padding-bottom: 10px;
}

.carta-wrapper {
    position: relative;
    width: 500px;
    margin: 40px auto;
}

.carta-pedido {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    width: 100%;
    height: 250px;
    transition: all 0.3s ease;
    transform-origin: center;
    margin-left: -300px;
    border: 2px solid #A65814;
    background-color: rgba(0, 0, 0, 0.7);
}

.detalles-pedido {
    width: 100%;
    padding: 20px;
    font-family: 'Jura', sans-serif;
    text-align: center;
}

.titulo-pediste {
    color: #D9AB23;
    margin-bottom: 20px;
    font-size: 26px;
    margin-top: -30px;
    border-bottom: 2px solid #A65814;
}

.lista-productos {
    list-style-type: none;
    padding: 0;
    margin: 0 auto;
    max-width: 80%;
}

.lista-productos li {
    color: #fdebb5;
    margin: 10px 0;
    text-align: left;
    font-size: 1.1rem;
}

.carta-pedido.zoom-effect {
    transform: scale(1.05) translateY(-7px);
    box-shadow: 0 5px 15px #ab9f03; /* Sombra blanca */
}

.carta-pedido.color-effect {
    background-color: rgba(8, 8, 8, 0.8);
    border: 3px solid rgba(217, 171, 35, 0.8);
}

.carta-pedido.zoom-effect .lista-productos li {
    color: #ffffff;
    transform: translateY(-2px);
}


.detalles-pedido {
    width: 60%;
    padding: 20px;
    font-family: 'Jura', sans-serif;
    margin-top: 30px;
}

.detalles-pedido h3 {
    color: #fdebb5;
    margin-top: 0;
    transition: all 0.3s ease;
}

.carta-pedido.zoom-effect .detalles-pedido h3 {
    color: #ffffff;
}

.subtotal {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 1.1rem;
    margin-top: 15px;
    padding-top: 10px;
    border-top: 1px dashed #ab9f03;
}

.precio {
    color: #A65814;
}

.btn-mas-info {
    position: absolute;
    bottom: -40px;
    left: -45px;
    transform: translateX(-50%);
    width: 40%;
    height: 40px;
    background-color: #A65814;
    color: rgb(255, 255, 255);
    border: none;
    border-radius: 5px;
    font-family: 'Jura', sans-serif;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    opacity: 0;
    visibility: hidden;
}

.btn-mas-info.show-btn {
    opacity: 1;
    visibility: visible;
    bottom: -50px;
}

.btn-mas-info:hover {
    background-color: #ab9f03;
    color: #000000;
    transform: translateX(-50%) scale(1.05);
}

.btn-confirmar {
  background-color: #4CAF50;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 15px;
  transition: all 0.3s ease;
}

.btn-confirmar:hover:not(:disabled) {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.btn-confirmar:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.acciones-pedido {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 30px;
  gap: 15px;
}

.fa-spinner {
  margin-right: 8px;
}

/*cuadros de estado del pedido */
.estado-pedido {
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 300px;
    margin-left: 750px;
    margin-top: -290px;
}

.estado-card {
    background-color: #1a1a1a;
    border-radius: 8px;
    padding: 15px;
    border: 1px solid #A65814;
    transition: all 0.3s ease;
}

.estado-card h3 {
    color: #D9AB23;
    margin-top: 0;
    margin-bottom: 15px;
    font-family: 'Jura', sans-serif;
    border-bottom: 1px solid #A65814;
    padding-bottom: 8px;
}

.estado-content {
    display: flex;
    align-items: center;
    gap: 15px;
}

.icono-estado {
    font-size: 24px;
    color: #D9AB23;
}

.estado-content p {
    color: #ffffff;
    margin: 0;
    font-family: 'Jura', sans-serif;
    font-size: 14px;
}

.como-va:hover {
    transform: translateY(-7px);
    box-shadow: 0 5px 15px rgba(166, 88, 20, 0.677);
}

.en-preparacion:hover {
    transform: translateY(-7px);
    box-shadow: 0 5px 15px rgba(217, 171, 35, 0.675);
}

.btn-actualizar {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
    transition: background-color 0.3s;
}

.btn-actualizar:hover {
    background-color: #45a049;
}

.tiempo-actualizacion {
    font-size: 0.8rem;
    color: #666;
    margin-top: 5px;
    display: block;
}

.empty-pedido {
    min-height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-message {
    text-align: center;
    color: #999;
}

.empty-message i {
    font-size: 2rem;
    margin-bottom: 10px;
}

</style>