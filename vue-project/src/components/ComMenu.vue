<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ComImagen from './icons/IMGENES/ComImagen.vue';
import Swal from "sweetalert2";  // Asegúrate de importar SweetAlert2
import { jsPDF } from "jspdf"; // Asegure de importar jsPdf
import axios from 'axios';


interface Producto {
  id: number,
  nombre: string;
  precio_unitario: number;
  ruta_imagen: string;
  categoria: string;
  cantidad: number;
}

// Ejemplo de los datos o interfaz de los productos
const carrito = ref<Producto[]>([]);
const mostrarModal = ref(false);
const compraExitosa = ref(false);
const categorias = ref<string[]>([]);
const producto = ref([]);

const obtenerProductos = async () => {
  try {
    const response = await axios.get('http://localhost:8000/productos'); // cambia el endpoint si es necesario
    // Mapea los datos para que encajen con tu lógica
    carrito.value = response.data.map((p: any) => ({
      id: p.id,
      nombre: p.nombre,
      precio_unitario: p.precio_unitario,
      ruta_imagen: p.ruta_imagen,
      categoria: p.categoria,
      cantidad: 1
    }));
  } catch (error) {
    console.error('Error al obtener productos:', error);
  }
};



onMounted(async() => {
  await obtenerProductos();
  console.log(carrito.value);
});


async function obtenerCategorias() {
  try {
    const response = await axios.get("http://localhost:8000/productos/categorias");
    categorias.value = response.data;
  } catch (error) {
    console.error("Error al obtener categorías:", error);
  }
}

onMounted(() => {
  obtenerCategorias();
});


// Agregar al carrito (si el producto ya existe, solo aumentamos la cantidad)
const agregarAlCarrito = (producto: Producto) => {
  const productoExistente = carrito.value.find(p => p.id === producto.id);
  if (productoExistente) {
    productoExistente.cantidad += 1; // Incrementar la cantidad si ya existe
  } else {
    carrito.value.push({ ...producto, cantidad: 1});
  }

  Swal.fire({
    icon: "success",
    title: "El producto ha sido agregado",
    text: `Agregado al carrito: ${producto.nombre}`,
  });
};

//Computed para filtrar los productos por categoría
//AMASIJOS
const productosAmasijos = computed(() =>
  carrito.value.filter(p => p.categoria.toUpperCase() === "AMASIJOS")
);

//BEBIDAS FRIAS
const productosBFRIAS = computed(() =>
  carrito.value.filter(p => p.categoria.toUpperCase() === "BEBIDAS_FRIAS")
);

//BEBIDAS CALIENTES
const productosBCALIENTES = computed(() =>
  carrito.value.filter(p => p.categoria.toUpperCase() === "BEBIDAS_CALIENTES")
);

//DESAYUNOS
const productosDESAYUNOS = computed(() =>
  carrito.value.filter(p => p.categoria.toUpperCase() === "DESAYUNOS")
);

//HOJALDRES
const productosHOJALDRES = computed(() =>
  carrito.value.filter(p => p.categoria.toUpperCase() === "HOJALDRES")
);

//MALTEADAS
const productosMALTEADAS = computed(() =>
  carrito.value.filter(p => p.categoria.toUpperCase() === "MALTEADAS")
);




// Función para aumentar la cantidad
const incrementarCantidad = (index: number) => {
  carrito.value[index].cantidad += 1;
};

// Función para disminuir la cantidad
const disminuirCantidad = (index: number) => {
  if (carrito.value[index].cantidad > 1) {
    carrito.value[index].cantidad -= 1;
  } else {
    eliminarProducto(index); // Eliminar producto si la cantidad llega a 0
  }
};

// Eliminar producto del carrito
const eliminarProducto = (index: number) => {
  carrito.value.splice(index, 1);
};

// Funcion para comprar los productos y para mostrar la factura a la hora de la compra

let carritoFacturado = []; // Variable global para guardar la compra

const comprarProductos = async () => {
  if (carrito.value.length === 0) {
    // me cierra el modal del carrito para mostrar la alerta
    mostrarModal.value = false;
    // me asegura que cualquier otra alerta este cerrada para mostrar la advertencia
    Swal.close();

    Swal.fire({
      icon: "warning",
      title: "Carrito vacío",
      text: "No hay productos en el carrito para comprar.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: true,
    });

    return;
  }

  const productosCantidad = {};
  carrito.value.forEach((producto) => {
    productosCantidad[producto.id] = producto.cantidad;
  });

  try {
    // 2. Enviar la compra al backend
    const response = await axios.post("http://localhost:8000/comprar", productosCantidad);
    
    // 3. Mostrar resumen solo si fue exitosa
    let mensaje = "<h3>Resumen de tu compra:</h3><ul style='text-align:left'>";
    let totalCompra = 0;
    carritoFacturado = JSON.parse(JSON.stringify(carrito.value));
    carrito.value.forEach((producto) => {
      let totalProducto = producto.precio_unitario * producto.cantidad;
      mensaje += `<li><strong>Producto:</strong> ${producto.nombre} <br>  
                  <strong>Cantidad:</strong> ${producto.cantidad} <br> 
                  <strong>Precio unitario:</strong> $${producto.precio_unitario} <br> 
                  <strong>Total:</strong> $${totalProducto}</li><hr>`;
      totalCompra += totalProducto;
    });
    mensaje += `</ul><h2>Total a pagar: $${totalCompra}</h2>`;

    mostrarModal.value = false;
    Swal.fire({
      icon: "success",
      title: "Compra realizada",
      html: mensaje,
      confirmButtonText: "Aceptar",
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: true,
      customClass: {
        popup: "swal2-popup-zindex",
      },
      didOpen: () => {
        const swalContent = Swal.getHtmlContainer();
        const botonDescargar = document.createElement("button");
        botonDescargar.textContent = "Descargar Factura";
        botonDescargar.classList.add("swal2-confirm");
        botonDescargar.style.marginTop = "10px";
        botonDescargar.addEventListener("click", generarPDF);
        swalContent.appendChild(botonDescargar);
      },
    });

    compraExitosa.value = true;
    carrito.value = [];
    await obtenerProductos();
  } catch (error) {
    Swal.close();
    Swal.fire({
      icon: "error",
      title: "Error al procesar la compra",
      text: error.response?.data?.detail || "Ocurrió un error inesperado.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: true,
    });
  }
};


//Funcion para descargar la factura
const generarPDF = () => {
  const doc = new jsPDF();//instancia para crear el documento en pdf


  //configuraciones de estilos
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Factura de Compra", 20, 20);


  //configuraciones para el cliente....esto es mas adelante pero lo pongo de una vez 
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Fecha: " + new Date().toLocaleDateString(), 20, 30);
  doc.text("Cliente: Nombre del Cliente", 20, 40);

  //configuraciones de mas estilos....este es para hacer de separador entre productos
  doc.setLineWidth(0.5);
  doc.line(20, 45, 190, 45);

  //detalles de la compra con sus estilos
  let y = 55;
  doc.setFontSize(12);
  doc.text("Detalle de la compra:", 20, y);
  y += 10;


  // esta es la lista con los productos comprados y facturados 
  carritoFacturado.forEach((producto, index) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${index + 1}. Producto: ${producto.nombre}`, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(`Cantidad: ${producto.cantidad}`, 20, y + 5);
    doc.text(`Precio unitario: $${producto.precio_unitario}`, 20, y + 10);
    doc.text(`Total: $${producto.precio_unitario * producto.cantidad}`, 20, y + 15);
    
    y += 25;
  });

  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);
  y += 10;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Total a pagar: $${carritoFacturado.reduce((acc, p) => acc + p.precio_unitario * p.cantidad, 0)}`, 20, y);


  //se guarda todo en el archivo pdf
  doc.save("Factura_Compra.pdf");
};





// Función para abrir el carrito (al hacer clic en el ícono del carrito)
const abrirCarrito = () => {
  mostrarModal.value = true;
};

// Modificación en la función cerrarCarrito para permitir continuar comprando
const cerrarCarrito = () => {
  compraExitosa.value = false; // Restablecer estado de compra exitosa
  mostrarModal.value = false;  // Cerrar el modal
};

//esto no lo borre por que es el icon de carrito y el menu scroll

// Cargar los íconos directamente con esta hoja de estilos desde un archivo cdn
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
document.head.appendChild(link);

// Muestra el menú fijo al hacer scroll
window.addEventListener("scroll", () => {
  const menuInicial = document.getElementById("menu-inicial");
  const menuFijo = document.getElementById("menu-fijo");

  if (menuInicial) {
    const menuInicialRect = menuInicial.getBoundingClientRect();
    if (menuInicialRect.bottom <= 0) {
      menuFijo?.classList.add("activo"); 
    } else {
      menuFijo?.classList.remove("activo"); 
    }
  }
});


</script>

<template>
  <header>
    <ComImagen/>
    <p id="text1">
      "En cada taza de café, encontrarás nuestra dedicación, el aroma de los mejores granos y la calidez de un lugar creado para compartir momentos que perduran."
    </p>
  </header>
  <hr>
  <hr id="l2">

  <nav id="menu-inicial">
    <div class="menu-hamburguesa">
      <ul class="menu">
        <li><a href="">MENÚ</a></li>
        <li><a href="#amasijos">AMASIJOS</a></li>
        <li><a href="#bebidas-frias">BEBIDAS FRÍAS</a></li>
        <li><a href="#bebidas-calientes">BEBIDAS CALIENTES</a></li>
        <li><a href="#desayunos">DESAYUNOS</a></li>
        <li><a href="#hojaldres">HOJALDRES</a></li>
        <li><a href="#malteadas">MALTEADAS</a></li>
        <i class="fas fa-shopping-cart carrito-icono"  @click="abrirCarrito"></i>
      </ul>
    </div>
  </nav>

  <nav id="menu-fijo">
    <div class="menu-hamburguesa">
      <ul class="menu">
        <li><a href="">MENÚ</a></li>
        <li><a href="#amasijos">AMASIJOS</a></li>
        <li><a href="#bebidas-frias">BEBIDAS FRÍAS</a></li>
        <li><a href="#bebidas-calientes">BEBIDAS CALIENTES</a></li>
        <li><a href="#desayunos">DESAYUNOS</a></li>
        <li><a href="#hojaldres">HOJALDRES</a></li>
        <li><a href="#malteadas">MALTEADAS</a></li>
        <i class="fas fa-shopping-cart carrito-icono"  @click="abrirCarrito"></i>
      </ul>
    </div>
  </nav>


  <div>
  <div v-if="mostrarModal" class="modal">
    <div class="modal-contenido">
      <h3 class="te">Carrito de Compras</h3>
      <p class="tex">Estos son los productos que estás eligiendo para la compra:</p>

      <div v-if="compraExitosa" class="mensaje-exito">
        <h2>¡Compra realizada correctamente!</h2>
        <p>Gracias por tu compra. Te esperamos pronto.</p>
        <button @click="cerrarCarrito" class="botonx">X</button>
      </div>

      <div v-else>
        <ul class="este">
          <li v-for="(producto, index) in carrito" :key="index" class="producto-carrito">
            <div class="carta1">
              <img :src="`http://127.0.0.1:8000/productos/${producto.ruta_imagen}`":alt= "producto.nombre"  class="imagen-producto" />
              <p class="t">{{ producto.nombre }}</p>
              <p class="t">${{ producto.precio_unitario }}</p>

              <div class="cantidad-control">
                <label for="cantidad">Cantidad:</label>
                <div class="cantidad">
                  <button @click="disminuirCantidad(index)" class="btn-cantidad">-</button>
                  <span>{{ producto.cantidad }}</span>
                  <button @click="incrementarCantidad(index)" class="btn-cantidad">+</button>
                </div>
              </div>

              <div class="precio">
                <p class="t"><strong>Precio unitario:</strong> ${{ producto.precio_unitario }}</p>
                <p class="t"><strong>Total:</strong> ${{ producto.precio_unitario * producto.cantidad }}</p>
              </div>

              <span @click="eliminarProducto(index)" class="eliminar">&#10005;</span>
            </div>
          </li>
        </ul>

        <button @click="comprarProductos" class="boton-comprar">Comprar</button>
        <button @click="cerrarCarrito" class="botonx">X</button>
  
      </div>
    </div>
  </div>
</div>



<div>
  <p id="amasijos" class="section-title">AMASIJOS</p>
  <hr id="l3">
  <hr id="l1">

  <div id="cartas-contenedor">
    <div
      v-for="(producto, index) in productosAmasijos"
      :key="index"
      class="carta"
    >
      <img v-if="producto.ruta_imagen" :src="`http://127.0.0.1:8000/productos/${producto.ruta_imagen}`" :alt="producto.nombre" class="carta-imagen" />
      <h3 class="carta-titulo">{{ producto.nombre }}</h3>
      <p class="carta-descripcion">${{ producto.precio_unitario }}</p>
      <button @click="agregarAlCarrito(producto)">Agregar al carrito</button>
    </div>
  </div>
</div>

<div>
  <p id="bebidas-frias" class="section-title">BEBIDAS FRÍAS</p>
  <hr id="l3">
  <hr id="l1">

  <div id="cartas-contenedor">
    <div
      v-for="(producto, index) in productosBFRIAS"
      :key="index"
      class="carta"
    >
      <img v-if="producto.ruta_imagen" :src="`http://127.0.0.1:8000/productos/${producto.ruta_imagen}`" :alt="producto.nombre" class="carta-imagen" />
      <h3 class="carta-titulo">{{ producto.nombre }}</h3>
      <p class="carta-descripcion">${{ producto.precio_unitario }}</p>
      <button @click="agregarAlCarrito(producto)">Agregar al carrito</button>
    </div>
  </div>
</div>

<div>
  <p id="bebidas-calientes" class="section-title">BEBIDAS CALIENTES</p>
  <hr id="l3">
  <hr id="l1">

  <div id="cartas-contenedor">
    <div
      v-for="(producto, index) in productosBCALIENTES"
      :key="index"
      class="carta"
    >
      <img v-if="producto.ruta_imagen" :src="`http://127.0.0.1:8000/productos/${producto.ruta_imagen}`" :alt="producto.nombre" class="carta-imagen" />
      <h3 class="carta-titulo">{{ producto.nombre }}</h3>
      <p class="carta-descripcion">${{ producto.precio_unitario }}</p>
      <button @click="agregarAlCarrito(producto)">Agregar al carrito</button>
    </div>
  </div>

  
</div>

<div>
  <p id="desayunos" class="section-title">DESAYUNOS</p>
  <hr id="l3">
  <hr id="l1">

  <div id="cartas-contenedor">
    <div
      v-for="(producto, index) in productosDESAYUNOS"
      :key="index"
      class="carta"
    >
      <img v-if="producto.ruta_imagen" :src="`http://127.0.0.1:8000/productos/${producto.ruta_imagen}`" :alt="producto.nombre" class="carta-imagen" />
      <h3 class="carta-titulo">{{ producto.nombre }}</h3>
      <p class="carta-descripcion">${{ producto.precio_unitario }}</p>
      <button @click="agregarAlCarrito(producto)">Agregar al carrito</button>
    </div>
  </div>
  
</div>

<div>
  <p id="hojaldres" class="section-title">HOJALDRES</p>
  <hr id="l3">
  <hr id="l1">

  <div id="cartas-contenedor">
    <div
      v-for="(producto, index) in productosHOJALDRES"
      :key="index"
      class="carta"
    >
      <img v-if="producto.ruta_imagen" :src="`http://127.0.0.1:8000/productos/${producto.ruta_imagen}`" :alt="producto.nombre" class="carta-imagen" />
      <h3 class="carta-titulo">{{ producto.nombre }}</h3>
      <p class="carta-descripcion">${{ producto.precio_unitario }}</p>
      <button @click="agregarAlCarrito(producto)">Agregar al carrito</button>
    </div>
  </div>
  
</div>

<div>
  <p id="malteadas" class="section-title">MALTEADAS</p>
  <hr id="l3">
  <hr id="l1">

  <div id="cartas-contenedor">
    <div
      v-for="(producto, index) in productosMALTEADAS"
      :key="index"
      class="carta"
    >
      <img v-if="producto.ruta_imagen" :src="`http://127.0.0.1:8000/productos/${producto.ruta_imagen}`" :alt="producto.nombre" class="carta-imagen" />
      <h3 class="carta-titulo">{{ producto.nombre }}</h3>
      <p class="carta-descripcion">${{ producto.precio_unitario }}</p>
      <button @click="agregarAlCarrito(producto)">Agregar al carrito</button>
    </div>
  </div>
  
</div>


<footer>
    <p>&copy; 2024 </p>
      
  <ul class="wrapper">

    <li class="icon instagram">
      <span class="tooltip">Instagram</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="1.2em"
        fill="currentColor"
        class="bi bi-instagram"
        viewBox="0 0 16 16"
      >
        <path
          d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"
        ></path>
      </svg>
    </li>
  </ul>
  
  </footer>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jura:wght@700&display=swap');

.swal2-popup-zindex {
  z-index: 9999 !important; /* me asegura que la factura este por encima de cualquier otro modal */
}


  body {
      font-family: 'Jura', sans-serif;
      color: black;
  }

  header {
      padding: 10px;
      margin-left: 143px;
    background-color: #000000;

  }

  #text1 {
      height: 200px;
      width: 750px;
      font-family: 'Jura', sans-serif;
      margin-left: 385px;
      font-size: 20px;
      margin-top: -135px;
      transition: transform 0.3s ease, color 0.3s ease; 
  }

  #text1:hover {
      transform: scale(1.1); 
      color: #FFF1C6; 
  }

  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); 
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .modal-contenido {
    background-color: rgb(36, 35, 35); 
    background-blend-mode:saturation;
    padding: 30px;
    max-width: 1200px;
    width: 1200px;
    height: 590px;
    overflow-y: auto;
    text-align: center;
  }

  .botonx {
  position: absolute;
  top: 35px;
  right: 180px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #ff0000;
}

.botonx:hover {
  color: #c72121;
  background-color: #fff;
}


  
  .este {
    display: flex;
    flex-wrap: wrap; 
    gap: 20px;  
  }

  .producto-carrito {
    width: calc(50% - 25px); /* Mitad del contenedor menos el margen */
    box-sizing: border-box;
  }

  .cantidad-control {
  margin: 10px 0;
  text-align: left;
  font-family: 'Jura', sans-serif;
  }

  .cantidad-control label {
    font-size: 16px;
    font-weight: bold;
    font-family: 'Jura', sans-serif;
  }

  .cantidad {
    display: flex;
    align-items: center;
    margin-top: 5px;
    font-family: 'Jura', sans-serif;
  }

  .btn-cantidad {
    background-color: #d9ab23;
    border: none;
    color: white;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 18px;
    font-family: 'Jura', sans-serif;
    align-items: center;
    border-radius: 4px;
  }

  .cantidad-control span {
    margin: 0 10px;
    font-size: 18px;
    font-family: 'Jura', sans-serif;
    align-items: center;
  }

  .precio {
    margin-top: 10px;
    text-align: left;
    font-family: 'Jura', sans-serif;
    align-items: center;
  }

  .precio p {
    margin: 5px 0;
    font-size: 16px;
    align-items: center;
    font-family: 'Jura', sans-serif;
  }


.carta1 {
  background-color: #d9ab23c3;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 8px rgb(84, 80, 80);
  width: 270px;
  height: 370px;
  margin-left: 130px;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease-in-out;
  list-style: none; 
}
.carta1:hover {
  background-color: #fff;
  color:#000000 
}
.carta1::before,
.carta1::after {
  content: none !important; 
}


  .imagen-producto {
    width: 100%;
    height: 120px;
    margin-bottom: 10px;
    object-fit: cover;
  }
  .eliminar {
    color: rgb(221, 20, 20);
    font-size: 24px;
    cursor: pointer;
    display: inline-block;
    margin-top: 10px;
  }

  .eliminar:hover {
    color: rgb(237, 143, 143);
  }

  .boton-comprar,
  .boton-cerrar {
    color: black;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 230px;
    margin: 40px;
  }

  .boton-comprar {
    background-color: #d9ab23;
    color: #ffffff;
  }

  .boton-cerrar {
    background-color: rgb(140, 52, 52);
    color: #ffffff;
  }

  .mensaje-exito {
    color: green;
  }
  .tex{
    font-size: 20px;
    color: #ffffff;
    margin-bottom: 15px;
    font-family: 'Jura', sans-serif;

  }

  .te {
    font-size: 27px;
    color: #ffffff;
    margin-bottom: 15px;
    font-family: 'Jura', sans-serif;
  }

  .t {
    margin-top: -6px;
    font-size: 18px;
    margin-bottom: 10px;
    font-family: 'Jura', sans-serif;
  }
 
  .mensaje-exito {
    text-align: center;
  }

  .mensaje-exito h2 {
    color: #afef7a;
    font-size: 24px;
    margin-bottom: 10px;
    font-family: 'Jura', sans-serif;
  }

  .mensaje-exito p {
    color: #d9ab23;
    font-size: 16px;
    margin-bottom: 20px;
    font-family: 'Jura', sans-serif;
  }



  nav {
      margin-left: -73px;
  }

  #menu-inicial {
      color:#D9AB23;
      position: relative;
      z-index: 1000;
      padding: 15px ;
    }

    #menu-fijo {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      margin-left: -60px;
      background-color: #000000;
      z-index: 1000;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      transform: translateY(-100%); 
      transition: transform 0.3s ease; 
    }
    
    .menu-hamburguesa {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    ul.menu {
      list-style: none;
      margin-left: 90px;
      padding: 0;
      display: flex;
      gap: 15px;
    }

    ul.menu li {
      font-size: 16px;
      font-family: Arial, sans-serif;
    }

    ul.menu li a, ul.menu li router-link {
      text-decoration: none;
      color: #D9AB23;
    }

    #menu-fijo.activo {
      transform: translateY(0); /* Muestra el menú fijo */
    }




  nav ul {
      list-style: none;
      display: flex;
      justify-content: space-evenly;
      margin-left: -194px;
      margin-top: 33px;
  }

  nav li a {
      font-family: 'Jura', sans-serif;
      text-decoration: none;
      color:#D9AB23;;
      padding: 10px;
  }

  hr {
      border-top: 2px solid #D9AB23;
      width: 1420px;
      margin-left: 5%;
      margin-top: -50px;
  }

  #l2 {
      margin-top: 20px;
      width: 890px;
      margin-left: 22%;

  }


  #amasijos{
      text-align: center;
      color:#A65814;
      height: 200px;
      width: 80px;
      font-family: 'Jura', sans-serif;
      margin-left: 740px;
      font-size: 24px;
      margin-top: 60px;
      transition: transform 0.3s ease, color 0.3s ease; 
  }
  #bebidas-frias{
    text-align: center;
      color:#A65814;
      height: 200px;
      width: 80px;
      font-family: 'Jura', sans-serif;
      margin-left: 740px;
      font-size: 24px;
      margin-top: 60px;
      transition: transform 0.3s ease, color 0.3s ease; 
  }
  #bebidas-calientes{
    text-align: center;
      color:#A65814;
      height: 200px;
      width: 80px;
      font-family: 'Jura', sans-serif;
      margin-left: 740px;
      font-size: 24px;
      margin-top: 60px;
      transition: transform 0.3s ease, color 0.3s ease; 
  }
  #desayunos{
    text-align: center;
      color:#A65814;
      height: 200px;
      width: 80px;
      font-family: 'Jura', sans-serif;
      margin-left: 740px;
      font-size: 20px;
      margin-top: 60px;
      transition: transform 0.3s ease, color 0.3s ease; 
  }
  #hojaldres{
    text-align: center;
      color:#A65814;
      height: 200px;
      width: 80px;
      font-family: 'Jura', sans-serif;
      margin-left: 740px;
      font-size: 24px;
      margin-top: 60px;
      transition: transform 0.3s ease, color 0.3s ease; 
  }
  #malteadas{
    text-align: center;
      color:#A65814;
      height: 200px;
      width: 80px;
      font-family: 'Jura', sans-serif;
      margin-left: 740px;
      font-size: 24px;
      margin-top: 60px;
      transition: transform 0.3s ease, color 0.3s ease; 
  }
  .carrito-icono {
    margin-left: 5px;
    font-size: 18px;
    color: #ffffff;
    cursor: pointer;
  }

  #l3 {
      background-color: #D9AB23;
      border-top: 2px solid #D9AB23;
      width: 640px;
      margin-left: 4%;
      margin-top: -210px;
      
  }

  #l1 {
      margin-top: -11px;
      width: 640px;
      margin-left: 56%;
  }


  #cartas-contenedor {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin: 50px 4%; 
  }

  .carta {
    background-color: #fffaf0;
    border: 2px solid #d9ab23;
    border-radius: 10px;
    height: 320px;
    padding: 20px;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .carta:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .carta-imagen {
    width: 100%;
    height: 60%;
    border-radius: 10px;
  }

  .carta-titulo {
    font-size: 20px;
    color: #a65814;
    margin-top: -5px;
    font-family: 'Jura', sans-serif;
  }

  .carta-descripcion {
    font-size: 16px;
    color: #333;
    margin-top: -5px;
    font-family: 'Jura', sans-serif;
  }
  
  .carta-descripcion1 {
    font-size: 16px;
    color: #333;
    margin-top: -5px;
    font-family: 'Jura', sans-serif;
  }

  button {
    background-color: #D9AB23;
    color: white;
    padding: 10px 20px; 
    border: none;
    border-radius: 5px; 
    font-size: 16px; 
    font-family: 'Jura', sans-serif;
    cursor: pointer; 
    transition: background-color 0.3s ease, transform 0.2s ease; 
  }

  button:hover {
    background-color: #A65814;
    transform: scale(1.05); 
  }

  button:active {
    background-color: #000000; 
    transform: scale(0.98); 
  }

  button:disabled {
    background-color: #b0bec5; 
    cursor: not-allowed; 
  }




  footer {
      padding: 20px;
      text-align: center;
      margin-top: 94px;
  }

  .wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 90%;
      margin: 0 auto;
      padding: 20px;
      background-color: #000;
      border-radius: 15px;
  }

  .wrapper .icon {
      position: relative;
      background: #000000;
      border-radius: 50%;
      margin: 10px;
      width: 50px;
      height: 50px;
      font-size: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .wrapper .tooltip {
      position: absolute;
      top: 0;
      font-size: 14px;
      background: #fff;
      color: #fff;
      padding: 5px 8px;
      border-radius: 5px;
      box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .wrapper .tooltip::before {
      position: absolute;
      content: "";
      height: 8px;
      width: 8px;
      background: #fff;
      bottom: -3px;
      left: 50%;
      transform: translate(-50%) rotate(45deg);
  }

  .wrapper .icon:hover .tooltip {
      top: -45px;
      opacity: 1;
      visibility: visible;
  }

  .wrapper .facebook:hover,
  .wrapper .facebook:hover .tooltip,
  .wrapper .facebook:hover .tooltip::before {
      background: #1877f2;
      color: #fff;
  }

  .wrapper .twitter:hover,
  .wrapper .twitter:hover .tooltip,
  .wrapper .twitter:hover .tooltip::before {
      background: #00acee;
      color: #fff;
  }

  .wrapper .instagram:hover,
  .wrapper .instagram:hover .tooltip,
  .wrapper .instagram:hover .tooltip::before {
      background: #dd2a7b;
      color: #fff;
  }

 @media (min-width: 280px) and (max-width: 490px) {
    body {
        font-size: 10px; 
    }

    header {
        padding: 5px;
        margin-left: 10px;
    }

    #text1 {
        width: 50%;
        font-size: 11px;
        margin-left: 0;
        margin-top: -90px;
    }

    nav {
        margin-left: 0;
    }

    hr {
        width: 380px;
        margin-left: 4%;
        margin-top: -80px;
    }

    #l2 {
        margin-top: 20px;
        width: 230px;
        margin-left: 20%;
    }

    #menu-inicial {
        padding: 2px;
        margin-left: 40px;
    }

    #menu-fijo {
        height: 130px;
        margin-left: 0px;
        background-color: #000000;
        z-index: 1000;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        transform: translateY(-100%);
        transition: transform 0.3s ease;

    }

    .menu-hamburguesa {
        align-items: center;
    }

    #menu-inicial ul.menu {
        list-style: none;
        padding: 0;
        display: flex;
        flex-direction: column; 
        align-items: flex-start;
        margin-left: 0;
    }

    #menu-inicial ul.menu li {
        font-size: 10px;
        font-family: Arial, sans-serif;
        padding: 5px 0;
    }

    #menu-inicial ul.menu li a, #menu-inicial ul.menu li router-link {
        text-decoration: none;
    }

    #menu-fijo ul.menu {
        list-style: none;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(2, 1fr); 
        gap: 3px; 
        margin: 0;
        margin-top: 20px;
    }

    #menu-fijo ul.menu li {
        font-size: 10px;
        font-family: Arial, sans-serif;
        text-align: center; 
        padding: 5px;
    }

    #menu-fijo ul.menu li a, #menu-fijo ul.menu li router-link {
        text-decoration: none;
        color: #D9AB23;
    }

    #menu-fijo.activo {
        transform: translateY(0);
    }

    .carrito-icono {
    margin-left: 55px;
    font-size: 18px;
    color: #ffffff;
    cursor: pointer;
  }


    .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    text-decoration: none;
    color: #000;
  }

  .modal-contenido {
    background-color: #b29335;
    padding: 20px;
    border-radius: 10px;
    width: 80%;
    max-width: 600px;
    box-shadow: 0 4px 8px rgba(255, 253, 253, 0.369);
    text-decoration: none;
  }

  .imagen-producto {
    width: 50px;
    height: 50px;
    border-radius: 400px;
    object-fit: cover;
    margin-left: 0px;
    text-decoration: none;
  }
    .eliminar {
    cursor: pointer;
    color: rgb(0, 0, 0);
    font-size: 20px;
    margin-left: 160px;

    }
    .eliminar:hover {
    color: darkred;
    }
    .mensaje-exito {
      text-align: center;
    }

    .mensaje-exito h2 {
      color: #f4ffb0;
      font-size: 24px;
      margin-bottom: 10px;
      font-family: 'Jura', sans-serif;
    }

    .mensaje-exito p {
      color: #000000;
      font-size: 16px;
      margin-bottom: 20px;
      font-family: 'Jura', sans-serif;
    }

    .boton-comprar,
    .boton-cerrar {
      color: black;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 230px;
      margin: 40px;
    }

  .boton-comprar {
    background-color: #d9ab23;
    color: #ffffff;
    font-size: 13px;
  }

  .boton-cerrar {
    background-color: rgb(140, 52, 52);
    color: #ffffff;
  }


    #l3 {
        width: 60px;
        margin-left: 5%;
        margin-top: -210px;
    }

    #l1 {
        margin-top: -11px;
        width: 60px;
        margin-left: 78%;
    }
    #amasijos{
      height: 200px;
      width: 80px;
      font-family: 'Jura', sans-serif;
      margin-left: 164px;
      font-size: 14px;
      margin-top: 20px;
    }
    #bebidas-frias{
        height: 200px;
        width: 80px;
        font-family: 'Jura', sans-serif;
        margin-left: 164px;
        font-size: 14px;
        margin-top: -10px;
    }
    #bebidas-calientes{
        height: 200px;
        width: 80px;
        font-family: 'Jura', sans-serif;
        margin-left: 164px;
        font-size: 14px;
        margin-top: 60px;
        transition: transform 0.3s ease, color 0.3s ease; 
    }
    #desayunos{
        height: 200px;
        width: 80px;
        font-family: 'Jura', sans-serif;
        margin-left: 164px;
        font-size: 14px;
        margin-top: 60px;
        transition: transform 0.3s ease, color 0.3s ease; 
    }
    #hojaldres{
        height: 200px;
        width: 80px;
        font-family: 'Jura', sans-serif;
        margin-left: 164px;
        font-size: 14px;
        margin-top: 20px;
        transition: transform 0.3s ease, color 0.3s ease; 
    }
    #malteadas{
        height: 200px;
        width: 80px;
        font-family: 'Jura', sans-serif;
        margin-left: 164px;
        font-size: 14px;
        margin-top: 60px;
        transition: transform 0.3s ease, color 0.3s ease; 
    }

    .modal{
      height: 600px;
    }

    .modal-contenido {
    width: 90%; 
    height: 364px; 
    padding: 5px;
    margin-top: -190px;
    }

    .este {
      gap: 5px;
    }

    .t{
      font-size: 15px;
    }

    .producto-carrito {
      width: calc(50% - 10px); /* Ajustar el ancho para pantallas pequeñas */
    }

    .carta1 {
      width: 100%; /* Hacer las cartas más grandes para pantallas pequeñas */
      height: auto;
      margin-left: -30px /* Ajustar la altura */
    }

    .boton-cerrar {
      font-size: 14px;
      margin-top: -180px;
    }

    .eliminar {
      font-size: 20px; /* Reducir el tamaño del botón de eliminar */
    }

    .imagen-producto {
      height: 100px; /* Reducir la altura de las imágenes */
    }

    #cartas-contenedor {
    display: grid;
    grid-template-columns: repeat(2, 1fr); 
    gap: 30px; 
    justify-content: center; 
    padding: 10px; 
    }

  .carta {
    height: 200px;
    width: 100%; 
    padding: 10px;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background-color: #fff; 
    border: 1px solid #d9ab23; 
    border-radius: 5px; 
    margin-left: -10px;
  }

  .carta:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .carta-imagen {
    width: 100%; 
    height: 60%;
    border-radius: 5px;
    display: block; 
  }

  .carta-titulo {
    font-size: 12px;
    color: #a65814;
    margin-top: -1px;
    font-family: 'Jura', sans-serif;
  }

  .carta-descripcion {
    font-size: 12px;
    color: #333;
    margin-top: -5px;
    font-family: 'Jura', sans-serif;
  }
  button {
    background-color: #D9AB23;
    color: white;
    padding: 10px 10px; 
    border: none;
    border-radius: 5px; 
    font-size: 10px; 
    font-family: 'Jura', sans-serif;
    cursor: pointer; 
    transition: background-color 0.3s ease, transform 0.2s ease; 
    margin-top: -5px;
  }

}
</style>