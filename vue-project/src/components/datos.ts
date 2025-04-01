// creo este archivo en typescript para que se pueda compartir datos entre componentes
//sin necesidad de configurar la base de datos pero se puede hacer alli tambien
import { reactive } from 'vue'

interface ProductoPedido {
  nombre: string
  precio: number
  cantidad: number
}

interface Cliente {
  nombre: string
  tipoId: string
  numeroId: string
}

export const store = reactive({
  cliente: {
    nombre: '',
    tipoId: '',
    numeroId: ''
  } as Cliente,
  pedido: [] as ProductoPedido[],
  pedidoRealizado: false, // Nueva propiedad para control
  
  setCliente(nombre: string, tipoId: string, numeroId: string) {
    this.cliente = { nombre, tipoId, numeroId }
  },
  
  setPedido(pedido: ProductoPedido[]) {
    this.pedido = pedido
    this.pedidoRealizado = true // Marcamos que hay un pedido nuevo
  },
  
  resetPedido() {
    this.pedido = []
    this.cliente = { nombre: '', tipoId: '', numeroId: '' }
    this.pedidoRealizado = false
  }
})