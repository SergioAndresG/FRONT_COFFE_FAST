import { reactive } from 'vue'

// Interfaces

// interface para un producto dentro de un pedido
interface ProductoPedido {
  nombre: string
  precio: number
  cantidad: number
}

// interface para la estructura completa de un pedido
interface Pedido {
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
}

// interface para la informacion de un cliente
interface Cliente {
  nombre: string
  tipoId: string
  numeroId: string
  desdeMenu: boolean
}


// interface para el estado actual de un pedido asociado a un cliente
interface PedidoCliente {
  clienteId: string
  estado: 'procesando' | 'en_preparacion' | 'completado'
  mensaje: string
  productos: ProductoPedido[]
  timestamp: number
}

// metodo que estara disponible en el store para manipular datos
interface StoreMethods {
  actualizarEstado(nuevoEstado: 'procesando' | 'en_preparacion' | 'completado', mensaje: string): void
  onEstadoCambiado(callback: (estado: string, mensaje: string) => void): void
  notificarCambios(): void
  setCliente(nombre: string, tipoId: string, numeroId: string, desdeMenu?: boolean): void
  resetCliente(): void
  saveToLocalStorage(): void
  setPedido(pedido: ProductoPedido[]): void
  addToHistorial(pedido: Pedido): void
  resetPedido(): void
  cambiarEstadoGlobal(nuevoEstado: 'procesando' | 'en_preparacion' | 'completado', mensaje?: string): void
  cambiarEstadoPedido(id: string, nuevoEstado: 'nuevo' | 'en_proceso' | 'completado'): void
  getEstadoCliente(clienteId: string): PedidoCliente
  actualizarEstadoCliente(clienteId: string, estado: 'procesando' | 'en_preparacion' | 'completado', mensaje: string): void
  confirmarPedido(clienteId: string): Pedido
  obtenerEstadoPedido(clienteId: string): { estado: string, mensaje: string }
  limpiarPedidoCompletado(clienteId: string): void
}

//insterface para el estado interno del store
interface StoreState {
  cliente: Cliente
  pedido: ProductoPedido[]
  historialPedidos: Pedido[]
  pedidosClientes: PedidoCliente[]
  pedidoRealizado: boolean
  estadoActualPedido: 'procesando' | 'en_preparacion' | 'completado'
  mensajeEstado: string
  listeners: Array<(estado: string, mensaje: string) => void>
}

// union de estado y metodos del store
type EstadoGlobal = StoreState & StoreMethods


// Funciones de utilidad

// me genera un id unico para los pedidos
const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// me devuelve un mensaje hecho en el estado del pedido
const getMensajeEstado = (estado: string): string => {
  switch(estado) {
    case 'procesando': return 'Pedido en proceso de confirmación'
    case 'en_preparacion': return 'Tu pedido está siendo preparado'
    case 'completado': return '¡Pedido listo para recoger!'
    default: return 'Estado desconocido'
  }
}

//Inicialización del estado

// me devuelve un estado por defecto para iniciar el store
const createDefaultState = (): StoreState => ({
  cliente: {
    nombre: '',
    tipoId: '',
    numeroId: '',
    desdeMenu: false
  },
  pedido: [],
  historialPedidos: [],
  pedidosClientes: [],
  pedidoRealizado: false,
  estadoActualPedido: 'procesando',
  mensajeEstado: 'Esperando confirmación del pedido',
  listeners: []
})

// me carga el estado guardado desde localStorage si existe o crea uno nuevo
const loadFromLocalStorage = (): StoreState => {
  const saved = localStorage.getItem('pedidosStore')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      return {
        ...createDefaultState(),
        ...parsed,
        listeners: []
      }
    } catch {
      return createDefaultState()
    }
  }
  return createDefaultState()
}

// Metodos del store
const createStoreMethods = (): StoreMethods => ({
   //me actualiza el estado basico del pedido y notifica a los listeners
  actualizarEstado(nuevoEstado, mensaje) {
    this.estadoActualPedido = nuevoEstado
    this.mensajeEstado = mensaje
    this.saveToLocalStorage()
    
    window.dispatchEvent(new CustomEvent('estadoPedidoCambiado', {
      detail: {
        estado: nuevoEstado,
        mensaje: mensaje
      }
    }))
    this.notificarCambios()
  },

  // me permite agregar una funcion que se ejecuta cuando se cambie el estado
  onEstadoCambiado(callback) {
    this.listeners.push(callback)
  },

  // le notifica a todos los listeners sobre el cambio de estado
  notificarCambios() {
    this.listeners.forEach(callback => 
      callback(this.estadoActualPedido, this.mensajeEstado || '')
    )
  },
  //establece los datos del cliente en el store
  setCliente(nombre, tipoId, numeroId, desdeMenu = false) {
    this.cliente = { nombre, tipoId, numeroId, desdeMenu }
    this.saveToLocalStorage()
  },
    
  
  // reinicia los datos del cliente si vino desde el menu
  resetCliente() {
    if (this.cliente.desdeMenu) {
      this.cliente = {
        nombre: '',
        tipoId: '',
        numeroId: '',
        desdeMenu: false
      }
      this.saveToLocalStorage()
    }
  },
    
  //guarda el estado actual del store en el localStorage
  saveToLocalStorage() {
    localStorage.setItem('pedidosStore', JSON.stringify({
      cliente: this.cliente,
      pedido: this.pedido,
      historialPedidos: this.historialPedidos,
      pedidosClientes: this.pedidosClientes,
      pedidoRealizado: this.pedidoRealizado,
      estadoActualPedido: this.estadoActualPedido,
      mensajeEstado: this.mensajeEstado
    }))
  },
    
  //establece el pedido actual
  setPedido(pedido) {
    this.pedido = pedido
    this.pedidoRealizado = true
    this.saveToLocalStorage()
  },
  //agrega un pedido al historial
  addToHistorial(pedido) {
    this.historialPedidos.unshift(pedido)
    this.saveToLocalStorage()
  },
  //reinicia el pedido actual
  resetPedido() {
    this.pedido = []
    this.pedidoRealizado = false
    this.saveToLocalStorage()
  },
  //me cambia el estado global del pedido utilizando actualizarEstado
  cambiarEstadoGlobal(nuevoEstado, mensaje = '') {
    this.actualizarEstado(nuevoEstado, mensaje)
  },
  //cambia el estado de un pedido del historial por id
  cambiarEstadoPedido(id, nuevoEstado) {
    const pedido = this.historialPedidos.find(p => p.id === id)
    if (pedido) {
      pedido.estado = nuevoEstado
      
      if (nuevoEstado === 'completado') {
        this.actualizarEstado('completado', '¡Pedido completado! Por favor recógelo en caja.')
      } else if (nuevoEstado === 'en_proceso') {
        this.actualizarEstado('en_preparacion', 'Tu pedido está en proceso y siendo preparado por nuestros chefs')
      }
      
      this.saveToLocalStorage()
    }
  },
   //obtiene el estado actual del pedido de un cliente
  getEstadoCliente(clienteId: string): PedidoCliente {
    const pedidoCliente = this.pedidosClientes.find(p => p.clienteId === clienteId)
    
    if (!pedidoCliente) {
      return {
        clienteId,
        estado: 'procesando',
        mensaje: 'Esperando confirmación del pedido',
        productos: [],
        timestamp: Date.now()
      }
    }
    
    return pedidoCliente
  },

   //me ctualiza o crea el estado del pedido de un cliente especifico
  actualizarEstadoCliente(clienteId: string, estado: 'procesando' | 'en_preparacion' | 'completado', mensaje: string) {
    let pedidoCliente = this.pedidosClientes.find(p => p.clienteId === clienteId)
      
    if (!pedidoCliente) {
      pedidoCliente = {
        clienteId,
        estado,
        mensaje,
        productos: [...this.pedido],
        timestamp: Date.now()
      }
      this.pedidosClientes.push(pedidoCliente)
    } else {
      pedidoCliente.estado = estado
      pedidoCliente.mensaje = mensaje
      pedidoCliente.timestamp = Date.now()
    }
      
    this.saveToLocalStorage()
      
    window.dispatchEvent(new CustomEvent(`estadoPedidoCambiado:${clienteId}`, {
      detail: { estado, mensaje }
    }))
      
    this.estadoActualPedido = estado
    this.mensajeEstado = mensaje
  },

    //confirma el pedido lo agrega al historial y simula cambios de estado automaticos
  confirmarPedido(clienteId: string) {
    if (this.pedido.length === 0) {
      throw new Error('No hay productos en el pedido')
    }

    const nuevoPedido: Pedido = {
      id: generateUniqueId(),
      titulo: `Pedido ${new Date().toLocaleString()}`,
      fecha: new Date().toISOString(),
      cliente: this.cliente.nombre,
      idCliente: clienteId,
      productos: [...this.pedido],
      estado: 'nuevo'
    }
    
    this.historialPedidos.unshift(nuevoPedido)
    
    this.actualizarEstadoCliente(
      clienteId,
      'procesando',
      'Pedido recibido y en proceso de confirmación'
    )
    //simula el cambio de estados con setTimeout
    setTimeout(() => {
      this.actualizarEstadoCliente(
        clienteId,
        'en_preparacion',
        'Tu pedido está siendo preparado'
      )
      
      setTimeout(() => {
        this.actualizarEstadoCliente(
          clienteId,
          'completado',
          '¡Pedido listo para recoger en caja!'
        )
      }, 5000 + Math.random() * 5000)
    }, 2000)
    
    this.saveToLocalStorage()
    return nuevoPedido
  },
  //obtiene el estado actual del pedido de un cliente, y lo limpia si ha expirado
  obtenerEstadoPedido(clienteId: string) {
    const pedidoCliente = this.pedidosClientes.find(p => p.clienteId === clienteId)
    
    if (!pedidoCliente) {
      return {
        estado: 'procesando',
        mensaje: 'Esperando confirmación del pedido'
      }
    }
    
    if (pedidoCliente.estado === 'completado' && 
        Date.now() - pedidoCliente.timestamp > 120000) {
      this.limpiarPedidoCompletado(clienteId)
      return {
        estado: 'procesando',
        mensaje: 'Esperando nuevo pedido'
      }
    }
    
    return {
      estado: pedidoCliente.estado,
      mensaje: pedidoCliente.mensaje
    }
  },

  limpiarPedidoCompletado(clienteId: string) {
    this.pedidosClientes = this.pedidosClientes.filter(p => p.clienteId !== clienteId)
    this.saveToLocalStorage()
  }
})

export const store = reactive<EstadoGlobal>({
  ...loadFromLocalStorage(),
  ...createStoreMethods()
})

