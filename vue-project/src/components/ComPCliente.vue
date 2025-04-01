<script setup lang="ts">
import lottie from 'lottie-web'
import { onMounted, ref } from 'vue'
import '@fortawesome/fontawesome-free/css/all.min.css'
import jsPDF from 'jspdf'
import { store } from './datos'

const animationContainer = ref(null)
const isHovering = ref(false)

onMounted(() => {
  lottie.loadAnimation({
    container: animationContainer.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'https://lottie.host/661b9ed1-0384-4333-b8d6-86367aa242e6/yu2qrylFKV.json'
  })
})

const generarPDF = () => {
  const doc = new jsPDF()
  
  // Configuración inicial
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("Factura de Compra", 105, 20, { align: 'center' })
  
  // Información del cliente
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 35)
  doc.text(`Cliente: ${store.cliente.nombre}`, 20, 45)
  doc.text(`Identificación: ${store.cliente.tipoId} ${store.cliente.numeroId}`, 20, 55)
  
  // Línea divisoria
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

  // Guardar el PDF
  doc.save(`Factura_${store.cliente.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`)
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
        <div class="progress-step">
            <div class="progress-circle">
                <i class="fas fa-list"></i>
            </div>
            <span class="progress-text">Elegir compra</span>
        </div>
        <div class="progress-step">
            <div class="progress-circle">
                <i class="fas fa-edit"></i>
            </div>
            <span class="progress-text">Insertar datos</span>
        </div>
        <div class="progress-step">
            <div class="progress-circle">
                <i class="fas fa-shopping-cart"></i>
            </div>
            <span class="progress-text">Pedir pedido</span>
        </div>
        <div class="progress-step active-step">
            <div class="progress-circle">
                <i class="fas fa-clock"></i>
            </div>
            <span class="progress-text">Esperar pedido</span>
        </div>
        <div class="progress-step">
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
                'color-effect': isHovering
                }">
                <div class="detalles-pedido">
                    <h2 class="titulo-pediste">Pediste:</h2>
                    <ul class="lista-productos">
                        <li v-for="(producto, index) in store.pedido" :key="index">
                            • {{ producto.nombre }} ({{ producto.cantidad }})
                        </li>
                    </ul>
                    <div class="subtotal">
                        <span>Subtotal:</span>
                        <span class="precio">
                            ${{
                                store.pedido.reduce((acc, p) => acc + (p.precio * p.cantidad), 0).toLocaleString()
                            }}
                        </span>
                    </div>
                </div>
            </div>
            
            <button class="btn-mas-info" 
                    :class="{'show-btn': isHovering}"
                    @click="generarPDF">
                Descargar Factura
            </button>
        </div>
        
        <div class="estado-pedido">
            <div class="estado-card como-va">
                <h3>¿Cómo va tu pedido?</h3>
                <div class="estado-content">
                    <i class="fas fa-clock icono-estado"></i>
                    <p>Tu pedido está siendo procesado</p>
                </div>
            </div>
            
            <div class="estado-card en-preparacion">
                <h3>En preparación:</h3>
                <div class="estado-content">
                    <i class="fas fa-utensils icono-estado"></i>
                    <p>Nuestros cocineros están trabajando en tu orden</p>
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


</style>