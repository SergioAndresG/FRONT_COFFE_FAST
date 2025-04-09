<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from 'vue';
import ComImagen from './icons/IMGENES/ComImagen.vue';
import Swal from "sweetalert2";  // Aseguye de importar SweetAlert2
import { useRouter } from 'vue-router';
import { store } from './datos' //Importacion para guardar los datos y lo que se pida en el menu para el panel de clienets

const router = useRouter();

interface Producto {
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number; // Agregar campo cantidad
}

// Ejemplo de los datos o interfaz de los productos
const carrito = ref<Producto[]>([]);
const mostrarModal = ref(false);
const compraExitosa = ref(false);


const carritoWidth = ref(350); 
const isResizing = ref(false);
const startX = ref(0);
const startWidth = ref(0);

//Redimensionar el carrito de productos
const iniciarResize = (e: MouseEvent) => {
  // Solo se  redimensionar si se hace clic en el area del handle
  if (!(e.target as HTMLElement).classList.contains('resize-handle')) return;
  
  isResizing.value = true;
  startX.value = e.clientX;
  startWidth.value = carritoWidth.value;
  
  document.addEventListener('mousemove', duranteResize);
  document.addEventListener('mouseup', detenerResize);
  
  e.preventDefault();
};

const duranteResize = (e: MouseEvent) => {
  if (!isResizing.value) return;
  
  const deltaX = e.clientX - startX.value;
  const newWidth = startWidth.value + deltaX;
  
  carritoWidth.value = Math.max(300, Math.min(800, newWidth));
};

const detenerResize = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', duranteResize);
  document.removeEventListener('mouseup', detenerResize);
};

// limpiar los listeners cuando el componente se desmonte
onBeforeUnmount(() => {
  document.removeEventListener('mousemove', duranteResize);
  document.removeEventListener('mouseup', detenerResize);
});

// Agregar al carrito (si el producto ya existe, solo aumentamos la cantidad)
const agregarAlCarrito = (event: MouseEvent) => {
  const carta = (event.target as HTMLButtonElement).closest('.carta')!;
  const nombre = carta.querySelector('.carta-titulo')?.textContent || '';
  const precio = parseFloat(carta.querySelector('.carta-descripcion')?.textContent?.replace('$', '').replace('.', '') || '0');
  const imagen = (carta.querySelector('.carta-imagen') as HTMLImageElement).src;

  const productoExistente = carrito.value.find(p => p.nombre === nombre);
  if (productoExistente) {
    productoExistente.cantidad += 1; // Incrementar la cantidad si ya existe
  } else {
    const producto: Producto = { nombre, precio, imagen, cantidad: 1 }; // Cantidad inicial
    carrito.value.push(producto);
  }

  Swal.fire({
    icon: "success",
    title: "El producto ha sido agregado",
    text: `Agregado al carrito: ${nombre}`,
  });
};
  

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


  // Función para comprar los productos con validación
  const comprarProductos = async () => {
  if (carrito.value.length === 0) {
    await Swal.fire({
      icon: "warning",
      title: "Carrito vacío",
      text: "No hay productos en el carrito para comprar.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: true,
      width: '600px', // Tamaño más grande
      customClass: {
        popup: 'custom-swal-popup', // Clase personalizada
        icon: 'custom-swal-icon' // Clase para el icono
      }
    });
    return;
  }

  // Configuración del formulario con tamaño aumentado
  const { value: formValues } = await Swal.fire({
    title: '<span style="font-family: \'Jura\', sans-serif; font-size: 1.5rem">Datos del cliente</span>',
    html: `
      <div style="font-family: 'Jura', sans-serif; font-size: 1.1rem">
        <input id="swal-input1" style="font-family: inherit; width: 95%; padding: 15px; margin: 12px 0; border: 1px solid gold; background: black; color: white; font-size: 1rem" placeholder="Nombre completo">
        <select id="swal-input2" style="font-family: inherit; width: 95%; padding: 15px; margin: 12px 0; border: 1px solid gold; background: black; color: white; font-size: 1rem">
          <option value="">Tipo de documento</option>
          <option value="C.C">Cédula de ciudadanía</option>
          <option value="C.E">Cédula de extranjería</option>
          <option value="T.I">Tarjeta de Identidad</option>
        </select>
        <input id="swal-input3" style="font-family: inherit; width: 95%; padding: 15px; margin: 12px 0; border: 1px solid gold; background: black; color: white; font-size: 1rem" placeholder="Número de documento" type="number" maxlength="10">
      </div>`,
    background: 'black',
    color: 'white',
    width: '650px', 
    padding: '2rem',
    showCancelButton: true,
    confirmButtonText: 'Continuar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: 'gold',
    cancelButtonColor: '#333',
    allowOutsideClick: false,
    focusConfirm: false,
    customClass: {
      popup: 'custom-swal-popup',
      header: 'custom-swal-header',
      title: 'custom-swal-title',
      content: 'custom-swal-content',
      actions: 'custom-swal-actions',
      confirmButton: 'custom-swal-confirm',
      cancelButton: 'custom-swal-cancel'
    },
    preConfirm: () => {
      const nombre = (document.getElementById('swal-input1') as HTMLInputElement)?.value.trim();
      const tipoId = (document.getElementById('swal-input2') as HTMLSelectElement)?.value;
      const numeroId = (document.getElementById('swal-input3') as HTMLInputElement)?.value.trim();
      
      // Validación del nombre
      if (!nombre || nombre.split(' ').length < 2) {
        Swal.showValidationMessage('<span style="color: #ff4444; font-size: 1rem; font-family: Jura, sans-serif">Debe ingresar nombre y apellido completos</span>');
        return false;
      }
      
      // Validación del tipo de documento
      if (!tipoId) {
        Swal.showValidationMessage('<span style="color: #ff4444; font-size: 1rem; font-family: Jura, sans-serif">Seleccione un tipo de documento valido</span>');
        return false;
      }
      
      // Validación del documento
      if (!numeroId) {
        Swal.showValidationMessage('<span style="color: #ff4444; font-size: 1rem;font-family: Jura, sans-serif">El numero de documento es obligatorio</span>');
        return false;
      }
      
      if (!/^\d+$/.test(numeroId)) {
        Swal.showValidationMessage('<span style="color: #ff4444; font-size: 1rem; font-family: Jura, sans-serif">Solo se permiten números en el documento</span>');
        return false;
      }
      
      if (numeroId.length < 8 || numeroId.length > 10) {
        Swal.showValidationMessage('<span style="color: #ff4444; font-size: 1rem;font-family: Jura, sans-serif">El documento debe tener entre 8 y 10 dígitos</span>');
        return false;
      }
      
      return { nombre, tipoId, numeroId };
    }
  });

  // Si falla la validación
  if (!formValues) {
    await Swal.fire({
      icon: 'error',
      title: '<span style="font-family: \'Jura\', sans-serif; color: #ff4444">Error en los datos</span>',
      html: '<div style="font-family: \'Jura\', sans-serif; font-size: 1.2rem">Verifique que todos los campos esten correctamente diligenciados</div>',
      width: '600px',
      background: 'white',
      confirmButtonColor: 'gold',
      customClass: {
        popup: 'custom-swal-popup-error',
        icon: 'custom-swal-icon-error',
        title: 'custom-swal-title-error'
      }
    });
    return;
  }

  // Si pasa la validación
  store.setCliente(formValues.nombre, formValues.tipoId, formValues.numeroId);
  store.setPedido([...carrito.value]);

  await Swal.fire({
    icon: 'success',
    title: '<span style="font-family: \'Jura\', sans-serif">¡Validación exitosa!</span>',
    html: '<div style="font-family: \'Jura\', sans-serif; font-size: 1.2rem">Los datos han sido verificados correctamente</div>',
    width: '600px',
    background: 'white',
    confirmButtonColor: 'gold',
    customClass: {
      popup: 'custom-swal-popup-success',
      icon: 'custom-swal-icon-success'
    }
  });

  carrito.value = [];
  router.push('/Clientes');
  compraExitosa.value = true;
};

// Función para abrir el carrito (al hacer clic en el ícono del carrito)
const abrirCarrito = () => {
  mostrarModal.value = true;
};

// Modificación en la función cerrarCarrito para permitir continuar comprando
const cerrarCarrito = () => {
  compraExitosa.value = false;
  mostrarModal.value = false;
  // Restaurar scroll del body
  document.body.style.overflow = '';
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
    <transition name="carrito-background">
    <div v-if="mostrarModal" class="carrito">
      <div 
        class="carrito-c" 
        :style="{ width: carritoWidth + 'px' }"
        @mousedown="iniciarResize"
      >
        <div class="resize-handle"></div>
        <h3 class="te">Agregados al carrito</h3>
        <p class="tex">Estos son tus productos:</p>

        <div v-if="compraExitosa" class="mensaje-exito">
          <h2>¡Compra realizada correctamente!</h2>
          <p>Gracias por tu compra. Te esperamos pronto.</p>
          <button @click="cerrarCarrito" class="botonx">X</button>
        </div>

      <div v-else>
        <ul class="este">
          <li v-for="(producto, index) in carrito" :key="index" class="producto-carrito">
            <div class="carta1">
              <img :src="producto.imagen" alt="Imagen producto" class="imagen-producto" />
              <p class="t">{{ producto.nombre }}</p>
              <p class="t">${{ producto.precio }}</p>

              <div class="cantidad-control">
                <label for="cantidad">Cantidad:</label>
                <div class="cantidad">
                  <button @click="disminuirCantidad(index)" class="btn-cantidad">-</button>
                  <span>{{ producto.cantidad }}</span>
                  <button @click="incrementarCantidad(index)" class="btn-cantidad">+</button>
                </div>
              </div>

              <div class="precio">
                <p class="t"><strong>Precio unitario:</strong> ${{ producto.precio }}</p>
                <p class="t"><strong>Total:</strong> ${{ producto.precio * producto.cantidad }}</p>
              </div>

              <span @click="eliminarProducto(index)" class="eliminar">&#10005;</span>
            </div>
          </li>
        </ul>

        <button @click="comprarProductos" class="boton-comprar">Enviar Pedido</button>
        <button @click="cerrarCarrito" class="botonx">X</button>
  
      </div>
    </div>
    </div>
</transition>
</div>




  <div>
    <p id="amasijos" class="section-title">AMASIJOS</p>
    <hr id="l3">
    <hr id="l1">

  <div id="cartas-contenedor" name="">
    <div class="carta">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXzf81glE2WSVF-jF6Vu7T1C3tNIhyTFzNSQ&s" alt="Amasijo 1" class="carta-imagen" />
      <h3 class="carta-titulo">Almojabana</h3>
      <p class="carta-descripcion">$2.500</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://damnspicy.com/wp-content/uploads/2022/12/pan-de-yuca-recipe-pan-de-queso-5.jpg" alt="Amasijo 2" class="carta-imagen" />
      <h3 class="carta-titulo">Pan de yuca</h3>
      <p class="carta-descripcion">$3.000</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5yGEhnEV5D5Lg0Ow8Pdg1i_L_-e_KgMR5lQ&s" alt="Amasijo 3" class="carta-imagen" />
      <h3 class="carta-titulo">Empananda de pollo</h3>
      <p class="carta-descripcion">3.000</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3AL1iExIyFoi3WvX3n6UzihA6QNU9aY5bUg&s" alt="Amasijo 4" class="carta-imagen" />
      <h3 class="carta-titulo">Empananda de carne</h3>
      <p class="carta-descripcion">$3.000</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://www.fabricadearepasparua.com/wp-content/uploads/2021/06/arepas-de-maiz-peto-pizzarepa-x5-1.jpg" alt="Amasijo 4" class="carta-imagen" />
      <h3 class="carta-titulo">Arepa de maiz</h3>
      <p class="carta-descripcion">$3.500</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://i.ytimg.com/vi/AJu0gRFsBrs/maxresdefault.jpg" alt="Amasijo 6" class="carta-imagen" />
      <h3 class="carta-titulo">Arepa de queso</h3>
      <p class="carta-descripcion">$3.500</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
  </div>
</div>

<div>
  <p id="bebidas-frias" class="section-title">BEBIDAS FRÍAS</p>
  <hr id="l3">
  <hr id="l1">

  <div id="cartas-contenedor">
    <div class="carta">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnU7fy3bN1yP2RqBVtV44fyVVxRnyxRlbWfg&s" alt="Amasijo 1" class="carta-imagen" />
      <h3 class="carta-titulo">Milo frío</h3>
      <p class="carta-descripcion">$6.700</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://lavaquita.co/cdn/shop/products/supermercados_la_vaquita_supervaquita_gaseosa_coca_cola_3l_nr_bebidas_liquidas_3df7d9f6-ab5c-4638-8cf3-2bb50b76491e_1024x1024.jpg?v=1620489381" alt="Amasijo 2" class="carta-imagen" />
      <h3 class="carta-titulo">Coca Cola 3l</h3>
      <p class="carta-descripcion">$11.500</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://supermercadocomunal.com/verbenal/514-large_default/gaseosa-coca-cola-400-ml.jpg" alt="Amasijo 3" class="carta-imagen" />
      <h3 class="carta-titulo">Coca Cola 400ml</h3>
      <p class="carta-descripcion">3.500</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://supermercadolaestacion.com/54088-large_default/gaseosa-coca-cola-zero-botella-x-400-mililitros.jpg" alt="Amasijo 4" class="carta-imagen" />
      <h3 class="carta-titulo">Coca Cola zero 400ml</h3>
      <p class="carta-descripcion">$3.500</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://1.bp.blogspot.com/-4ELwigpuR38/VO1de931nSI/AAAAAAAACJg/evRoLqpeA6k/s1600/Avena%2BSyS2.jpg" alt="Amasijo 4" class="carta-imagen" />
      <h3 class="carta-titulo">Crema de avena</h3>
      <p class="carta-descripcion">$4.300</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://caldoparao.com/wp-content/uploads/2020/06/MG_1088.jpg" alt="Amasijo 6" class="carta-imagen" />
      <h3 class="carta-titulo">Jugos en agua</h3>
      <p class="carta-descripcion">$5.000</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://static.wixstatic.com/media/5a057a_658b59e0b15542cc87b0e46c64c44e00~mv2.jpg/v1/fill/w_480,h_322,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/5a057a_658b59e0b15542cc87b0e46c64c44e00~mv2.jpg" alt="Amasijo 6" class="carta-imagen" />
      <h3 class="carta-titulo">Jugos en leche</h3>
      <p class="carta-descripcion">$6.000</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnJbh8cqT_6aH5kiURd9Erz4QH981QpAcFXg&s" alt="Amasijo 6" class="carta-imagen" />
      <h3 class="carta-titulo">Masato</h3>
      <p class="carta-descripcion">$3.600</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://radionacional-v3.s3.amazonaws.com/s3fs-public/2022-04/Copia%20de%20foto%20001.jpeg.jpg" alt="Amasijo 6" class="carta-imagen" />
      <h3 class="carta-titulo">Kumis</h3>
      <p class="carta-descripcion">$5.500</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://images.mrcook.app/recipe-image/0191d380-a120-7e52-b9da-24e66add6270" alt="Amasijo 6" class="carta-imagen" />
      <h3 class="carta-titulo">Cappucccino frio</h3>
      <p class="carta-descripcion">$5.900</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://olimpica.vtexassets.com/arquivos/ids/1432111/7702090042054.jpg?v=638521778008130000" alt="Amasijo 6" class="carta-imagen" />
      <h3 class="carta-titulo">Agua cristal</h3>
      <p class="carta-descripcion">$3.000</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://cdn.inoutdelivery.com/altoque.inoutdelivery.com.co/lg/1656089051330-breta%C3%B1a.webp" alt="Amasijo 6" class="carta-imagen" />
      <h3 class="carta-titulo">Bretaña</h3>
      <p class="carta-descripcion">$3.200</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZBoyRGFBGjr17zJ3rn--IKf6zIXpYjhW93A&s" alt="Amasijo 6" class="carta-imagen" />
      <h3 class="carta-titulo">Gatorade</h3>
      <p class="carta-descripcion">$4.000</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://tipicasempanadas.com/wp-content/uploads/2020/11/bebida-aguah2olimon-600ml_00.jpg" alt="Amasijo 6" class="carta-imagen" />
      <h3 class="carta-titulo">H20</h3>
      <p class="carta-descripcion">$3.200</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://images.getduna.com/5fe6067e-0e11-4869-9118-ad3dcc8765c2/b2741f8c36fbead8_domicilio_4499_720x720_1660834454.png?d=600x600&format=webp" alt="Amasijo 6" class="carta-imagen" />
      <h3 class="carta-titulo">Mr tea</h3>
      <p class="carta-descripcion">$3.500</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
  </div>
</div>

<div>
  <p id="bebidas-calientes" class="section-title">BEBIDAS CALIENTES</p>
  <hr id="l3">
  <hr id="l1">

  <div id="cartas-contenedor">
    <div class="carta">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt86DsU1Q3xw88uFHJBX_QMC8I3y-B6g4TyQ&s" alt="Amasijo 1" class="carta-imagen" />
      <h3 class="carta-titulo">Cafe</h3>
      <p class="carta-descripcion">$3.400</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Cafeconleche.jpg/1200px-Cafeconleche.jpg" alt="Amasijo 2" class="carta-imagen" />
      <h3 class="carta-titulo">Perico</h3>
      <p class="carta-descripcion">$3.000</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://estaticos.elcolombiano.com/documents/10157/0/792x565/6c0/780d565/none/11101/MYGE/image_content_26048298_20160519204438.jpg" alt="Amasijo 3" class="carta-imagen" />
      <h3 class="carta-titulo">Tinto</h3>
      <p class="carta-descripcion">2.300</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://i.pinimg.com/564x/b5/5c/25/b55c25e7cf1a429c40928c2a69cc6f8e.jpg" alt="Amasijo 4" class="carta-imagen" />
      <h3 class="carta-titulo">Aromatica de frutas</h3>
      <p class="carta-descripcion">$3.500</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI9s5aphh94YkcwxzXCuV__8j609N2vf5mMA&s" alt="Amasijo 4" class="carta-imagen" />
      <h3 class="carta-titulo">Aromatica</h3>
      <p class="carta-descripcion">$3.000</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-D6Nz3HgENnb7fs4kd8CT0nUfOtUsEC9-lg&s" alt="Amasijo 6" class="carta-imagen" />
      <h3 class="carta-titulo">Milo Caliente</h3>
      <p class="carta-descripcion">$5.500</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSUe-pjlshmf0wjoZQpR1so8hEiZQdzAJ8Dg&s" alt="Amasijo 6" class="carta-imagen" />
      <h3 class="carta-titulo">Cappucciono Caliente</h3>
      <p class="carta-descripcion">$7.500</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrZA2eHwaHWSsLzsW0PFOBp0hh5YOQXTqGVg&s" alt="Amasijo 6" class="carta-imagen" />
      <h3 class="carta-titulo">Chocolate</h3>
      <p class="carta-descripcion">$3.700</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
  </div>
</div>

<div>
  <p id="desayunos" class="section-title">DESAYUNOS</p>
  <hr id="l3">
  <hr id="l1">

  <div id="cartas-contenedor">
    <div class="carta">
      <img src="https://i.ytimg.com/vi/_E_ufouNSVA/maxresdefault.jpg" alt="Amasijo 1" class="carta-imagen" />
      <h3 class="carta-titulo">Combo 1</h3>
      <p class="carta-descripcion1">Calentado de frijoles</p>
      <p class="carta-descripcion">$7.400</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQouTvWmgSDy9uAuELay1k9NFAkD7C92CX2Dg&s" alt="Amasijo 2" class="carta-imagen" />
      <h3 class="carta-titulo">Combo 2</h3>
            <p class="carta-descripcion1">Calentado de lentejas</p>
      <p class="carta-descripcion">$7.000</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://i.pinimg.com/originals/4f/99/f5/4f99f59b3692364ff2db6a3418f4103d.jpg" alt="Amasijo 3" class="carta-imagen" />
      <h3 class="carta-titulo">Combo 3</h3>
      <p class="carta-descripcion1">Huevos fritos/pericos</p>
      <p class="carta-descripcion">8.000</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT9j91LLx0TDaL5-jrj427az5fwZ9OFviC0w&s" alt="Amasijo 4" class="carta-imagen" />
            <h3 class="carta-titulo">Combo 4</h3>
      <p class="carta-descripcion1">Huevos con cafe</p>
      <p class="carta-descripcion">8.000</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://as2.ftcdn.net/v2/jpg/03/99/65/19/1000_F_399651912_DbqGWOBSWa9ngI2fIZ6JaYfMQyNqhy5l.jpg" alt="Amasijo 4" class="carta-imagen" />
            <h3 class="carta-titulo">Combo 5</h3>
      <p class="carta-descripcion1">Tamal y cafe
      </p>
      <p class="carta-descripcion">9.800</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://vecinavegetariana.com/wp-content/uploads/2022/09/Changua-Colombiana-Colombian-Milk-and-Eggs-Breakfast-Soup-2-1.jpg" alt="Amasijo 6" class="carta-imagen" />
      <h3 class="carta-titulo">Combo 6</h3>
      <p class="carta-descripcion">Changua</p>
      <p class="carta-descripcion">9.500</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://i0.wp.com/chivoloco.com/wp-content/uploads/2020/08/caldo-con-costilla.png?fit=400%2C400&ssl=1" alt="Amasijo 6" class="carta-imagen" />
      <h3 class="carta-titulo">Combo 7</h3>
      <p class="carta-descripcion">Caldo de costilla y cafe</p>
      <p class="carta-descripcion">10.000</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKa1T-X3TidEboFDsGE-dNHwPuFNjWlvMQXg&s" alt="Amasijo 6" class="carta-imagen" />
      <h3 class="carta-titulo">Combo 8</h3>
      <p class="carta-descripcion">Parfait con frutos rojos</p>
      <p class="carta-descripcion">8.300</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
  </div>
</div>

<div>
  <p id="hojaldres" class="section-title">HOJALDRES</p>
  <hr id="l3">
  <hr id="l1">

  <div id="cartas-contenedor">
    <div class="carta">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT25a_jP1lz7z_9sL--kEV0AaWV3Z3sw9BJww&s" alt="Amasijo 1" class="carta-imagen" />
      <h3 class="carta-titulo">Corazon</h3>
      <p class="carta-descripcion">$2.500</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcBDd3hFc_L-3EofLpyWJB9M-5rJPBYerJmQ&s" alt="Amasijo 2" class="carta-imagen" />
      <h3 class="carta-titulo">Hojaldra</h3>
      <p class="carta-descripcion">$2.000</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://nuval.com.co/wp-content/uploads/2020/11/Palito-de-queso-1.png" alt="Amasijo 3" class="carta-imagen" />
      <h3 class="carta-titulo">Palito de queso</h3>
      <p class="carta-descripcion">2.300</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://i.ytimg.com/vi/aTP-KghDitQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLALEX0Sw1zVHg62PLNBuxYGmAN7zw" alt="Amasijo 4" class="carta-imagen" />
      <h3 class="carta-titulo">Pastel de carne</h3>
      <p class="carta-descripcion">$3.500</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://img-global.cpcdn.com/recipes/3a81947224d88fad/400x400cq70/photo.jpg" alt="Amasijo 4" class="carta-imagen" />
      <h3 class="carta-titulo">Pastel de pollo </h3>
      <p class="carta-descripcion">$3.000</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://i.ytimg.com/vi/cvwlXZuvzu4/sddefault.jpg" alt="Amasijo 6" class="carta-imagen" />
      <h3 class="carta-titulo">Flautas</h3>
      <p class="carta-descripcion">$2.500</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
  </div>
</div>

<div>
  <p id="malteadas" class="section-title">MALTEADAS</p>
  <hr id="l3">
  <hr id="l1">

  <div id="cartas-contenedor">
    <div class="carta">
      <img src="https://i.blogs.es/c6f09d/como-hacer-malteada-chocolate-cremosa-receta-facil-mundo/650_1200.jpg" alt="Amasijo 1" class="carta-imagen" />
      <h3 class="carta-titulo">Malteada de chocolate</h3>
      <p class="carta-descripcion">$9.500</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://www.gastrolabweb.com/u/fotografias/m/2021/3/22/f850x638-10474_87963_5050.jpg" alt="Amasijo 2" class="carta-imagen" />
      <h3 class="carta-titulo">Malteada de fresa</h3>
      <p class="carta-descripcion">$9.000</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ2RL5me0soPjEfM0qhUOMecNtjEc3TbiqNw&s" alt="Amasijo 3" class="carta-imagen" />
      <h3 class="carta-titulo">Malteada de cookies & cream</h3>
      <p class="carta-descripcion">9.700</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://apasionados-por-el-cafe.s3.amazonaws.com/wp-content/uploads/2021/11/malteada-6.jpg" alt="Amasijo 4" class="carta-imagen" />
      <h3 class="carta-titulo">Malteada de arequipe</h3>
      <p class="carta-descripcion">$9.500</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
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
/* Fuentes y estilos base */
@import url('https://fonts.googleapis.com/css2?family=Jura:wght@700&display=swap');

body {
  font-family: 'Jura', sans-serif;
  color: black;
}

/* Estilos para SweetAlert */
.swal2-popup-zindex {
  z-index: 9999 !important;
}

/* Header */
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

/* Navegación */
nav {
  margin-left: -73px;
}

#menu-inicial {
  color: #D9AB23;
  position: relative;
  z-index: 1000;
  padding: 15px;
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

#menu-fijo.activo {
  transform: translateY(0);
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
  font-family: 'Jura', sans-serif;
}

ul.menu li a, 
ul.menu li router-link {
  text-decoration: none;
  color: #D9AB23;
}

.carrito-icono {
  margin-left: 5px;
  font-size: 18px;
  color: #ffffff;
  cursor: pointer;
}

/* Líneas divisoras */
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

/* Secciones de productos */
.section-title {
  text-align: center;
  color: #A65814;
  height: 200px;
  width: 80px;
  font-family: 'Jura', sans-serif;
  margin-left: 740px;
  font-size: 24px;
  margin-top: 60px;
  transition: transform 0.3s ease, color 0.3s ease; 
}

#desayunos {
  font-size: 20px;
}

/* Tarjetas de productos */
#cartas-contenedor {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
  object-fit: cover;
}

.carta-titulo {
  font-size: 20px;
  color: #a65814;
  margin-top: -5px;
  font-family: 'Jura', sans-serif;
}

.carta-descripcion,
.carta-descripcion1 {
  font-size: 16px;
  color: #333;
  margin-top: -5px;
  font-family: 'Jura', sans-serif;
}

/* Botones generales */
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

/* Transición para el carrito */
.carrito-enter-active {
  animation: slideIn 0.4s ease-out forwards;
}

.carrito-leave-active {
  animation: slideOut 0.3s ease-in forwards;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}


/* Carrito de compras */
.carrito-c {
  position: fixed;
  right: 20px;
  top: 20px;
  bottom: 20px;
  background-color: rgb(0, 0, 0);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(204, 221, 10, 0.759);
  overflow-y: auto;
  z-index: 1000;
  min-width: 350px;
  max-width: 900px;
  transition: width 0.1s ease;
  cursor: default;
  border: 2px solid #d9ab23;
  font-family: 'Jura', sans-serif;
}

.resize-handle {
  position: absolute;
  left: -5px;
  top: 0;
  bottom: 0;
  width: 10px;
  cursor: col-resize;
  z-index: 10;
}

.resize-handle:hover, 
.resizing .resize-handle {
  background-color: rgba(0, 0, 0, 0.1);
}

.resizing {
  user-select: none;
  -webkit-user-select: none;
}
.carrito-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  transition: opacity 0.3s ease;
}

.carrito-background-enter-active,
.carrito-background-leave-active {
  transition: opacity 0.3s ease;
}

.carrito-background-enter-from,
.carrito-background-leave-to {
  opacity: 0;
}

/* Contenido del carrito */
.este {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
}

.producto-carrito {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.carta1 {
  background-color: #d9ab23c3;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgb(84, 80, 80);
  width: 100%;
  min-height: 150px;
  margin: 10px 0;
  display: grid;
  grid-template-columns: 1fr 120px;
  gap: 15px;
  transition: background-color 0.3s ease-in-out;
  position: relative;
  margin-left: -15px;
}

.carta1:hover {
  background-color: #fff;
  color: #000000;
}

.imagen-producto {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 5px;
  grid-column: 2;
  grid-row: 1 / span 4;
  align-self: center;
}

.carta1 .t {
  margin: 5px 0;
  font-size: 16px;
  text-align: left;
  grid-column: 1;
}

.cantidad-control {
  margin: 10px 0;
  text-align: left;
  font-family: 'Jura', sans-serif;
  grid-column: 1;
}

.cantidad-control label {
  font-size: 16px;
  font-weight: bold;
}

.cantidad {
  display: flex;
  align-items: center;
  margin-top: 5px;
}

.btn-cantidad {
  background-color: #d9ab23;
  border: none;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 18px;
  border-radius: 4px;
}

.cantidad span {
  margin: 0 10px;
  font-size: 18px;
}

.precio {
  margin-top: 10px;
  text-align: left;
  font-family: 'Jura', sans-serif;
  grid-column: 1;
}

.precio p {
  margin: 5px 0;
  font-size: 16px;
}

.eliminar {
  position: absolute;
  top: 5px;
  right: 10px;
  color: rgb(221, 20, 20);
  cursor: pointer;
}

.eliminar:hover {
  color: rgb(161, 6, 6);
}

.boton-comprar {
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  font-size: 18px;
}

.botonx {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #ff0000;
  z-index: 10000;
}

.botonx:hover {
  color: #c72121;
  background-color: #fff;
}

.tex {
  font-size: 18px;
  color: #ffffff;
  margin-bottom: 15px;
  text-align: center;
  background-color: #A65814;
  margin-left: -5px;
}

.te {
  font-size: 24px;
  color: #ffe600;
  margin-bottom: 15px;
  text-align: center;
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

/* Estilos para sweetalert */
.custom-swal-popup {
  border: 2px solid gold !important;
  border-radius: 10px !important;
  font-family: 'Jura', sans-serif;
}

.custom-swal-icon {
  font-size: 3rem !important;
  margin: 1rem auto !important;
  font-family: 'Jura', sans-serif;
}

/* Estilos específicos para errores */
.custom-swal-popup-error {
  border: 2px solid #ff4444 !important;
  font-family: 'Jura', sans-serif;
}

.custom-swal-icon-error {
  color: #ff4444 !important;
  font-size: 4rem !important;
  margin: 1.5rem auto !important;
  font-family: 'Jura', sans-serif;
}

.custom-swal-title-error {
  color: #ff4444 !important;
  font-size: 1.8rem !important;
  font-family: 'Jura', sans-serif;
}

/* Estilos para los botones */
.custom-swal-confirm {
  font-family: 'Jura', sans-serif !important;
  font-weight: bold !important;
  font-size: 1.1rem !important;
  padding: 10px 25px !important;
}

.custom-swal-cancel {
  font-family: 'Jura', sans-serif !important;
  font-size: 1.1rem !important;
  padding: 10px 25px !important;
}

/* Ajustes de contenido */
.custom-swal-content {
  font-size: 1.1rem !important;
  line-height: 1.6 !important;
  font-family: 'Jura', sans-serif;
}

/* Footer */
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

.wrapper .instagram:hover,
.wrapper .instagram:hover .tooltip,
.wrapper .instagram:hover .tooltip::before {
  background: #dd2a7b;
  color: #fff;
}

</style>