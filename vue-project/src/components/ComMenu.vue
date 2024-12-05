<script setup lang="ts">
import { ref } from 'vue';
import ComImagen from './icons/IMGENES/ComImagen.vue';


// Ejemplo de los datos o interfaz de los productos
interface Producto {
  nombre: string;
  precio: number;
  imagen: string;
}

const carrito = ref<Producto[]>([]);
const mostrarModal = ref(false);
const compraExitosa = ref(false);

// Esta es la funcion de ejemplo para agregar un producto al carrito
const agregarAlCarrito = (event: MouseEvent) => {
  const carta = (event.target as HTMLButtonElement).closest('.carta')!;
  const nombre = carta.querySelector('.carta-titulo')?.textContent || '';
  const precio = parseFloat(carta.querySelector('.carta-descripcion')?.textContent?.replace('$', '').replace('.', '') || '0');
  const imagen = (carta.querySelector('.carta-imagen') as HTMLImageElement).src;

  const producto: Producto = { nombre, precio, imagen };

  carrito.value.push(producto);
  alert(`Agregado al carrito: ${producto.nombre}`);
  mostrarModal.value = true;
};

// Función para eliminar un producto del carrito
const eliminarProducto = (index: number) => {
  carrito.value.splice(index, 1);
};

// Función para cerrar el modal
const cerrarCarrito = () => {
  mostrarModal.value = false;
};

// Función para abrir el carrito (al hacer clic en el ícono del carrito)
const abrirCarrito = () => {
  mostrarModal.value = true;
};
// Función para comprar los productos
const comprarProductos = () => {
  if (carrito.value.length > 0) {
    compraExitosa.value = true; // Indicar que la compra fue exitosa
    carrito.value = []; // Vaciar el carrito después de la compra
  } else {
    alert('No hay productos en el carrito para comprar');
  }
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
        <li><router-link to="/">HOME</router-link></li>
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


  <div v-if="mostrarModal" class="modal">
    <div class="modal-contenido">
      <h3>Carrito de Compras</h3>
      <div v-if="compraExitosa" class="mensaje-exito">
        <h2>¡Compra realizada correctamente!</h2>
        <p>Gracias por tu compra. Te esperamos pronto.</p>
        <button @click="cerrarCarrito">Cerrar</button>
      </div>
      <div v-else>
        <ul>
          <li v-for="(producto, index) in carrito" :key="index" class="producto-carrito">
            <img :src="producto.imagen" alt="Imagen producto" class="imagen-producto" />
            <p>{{ producto.nombre }} - ${{ producto.precio }}</p>
            <span class="eliminar" @click="eliminarProducto(index)">&#10005;</span>
          </li>
        </ul>
        <button @click="comprarProductos" class="boton-comprar">Comprar</button>
        <button @click="cerrarCarrito" class="boton-cerrar">Cerrar</button>
      </div>
    </div>
  </div>

  <div>
    <p id="amasijos" class="section-title">AMASIJOS</p>
    <hr id="l3">
    <hr id="l1">

  <div id="cartas-contenedor">
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
      <img src="https://olimpica.vtexassets.com/arquivos/ids/1396336-800-450?v=638500183806700000&width=800&height=450&aspect=true" alt="Amasijo 3" class="carta-imagen" />
      <h3 class="carta-titulo">Coca Cola 400ml</h3>
      <p class="carta-descripcion">3.500</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://olimpica.vtexassets.com/arquivos/ids/1490745/7702535011119_1.jpg?v=638629879339700000" alt="Amasijo 4" class="carta-imagen" />
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
      <p class="carta-descripcion">Calentado de frijoles</p>
      <p class="carta-descripcion">$7.400</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQouTvWmgSDy9uAuELay1k9NFAkD7C92CX2Dg&s" alt="Amasijo 2" class="carta-imagen" />
      <h3 class="carta-titulo">Combo 2</h3>
            <p class="carta-descripcion">Calentado de lentejas</p>
      <p class="carta-descripcion">$7.000</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://i.pinimg.com/originals/4f/99/f5/4f99f59b3692364ff2db6a3418f4103d.jpg" alt="Amasijo 3" class="carta-imagen" />
      <h3 class="carta-titulo">Combo 3</h3>
      <p class="carta-descripcion">Huevos fritos/pericos</p>
      <p class="carta-descripcion">8.000</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT9j91LLx0TDaL5-jrj427az5fwZ9OFviC0w&s" alt="Amasijo 4" class="carta-imagen" />
            <h3 class="carta-titulo">Combo 4</h3>
      <p class="carta-descripcion">Huevos con cafe</p>
      <p class="carta-descripcion">8.000</p>
      <button @click="agregarAlCarrito($event)">Agregar al carrito</button>
    </div>
    <div class="carta">
      <img src="https://as2.ftcdn.net/v2/jpg/03/99/65/19/1000_F_399651912_DbqGWOBSWa9ngI2fIZ6JaYfMQyNqhy5l.jpg" alt="Amasijo 4" class="carta-imagen" />
            <h3 class="carta-titulo">Combo 5</h3>
      <p class="carta-descripcion">Tamal y cafe
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
@import url('https://fonts.googleapis.com/css2?family=Jura:wght@700&display=swap');

  body {
      font-family: 'Jura', sans-serif;
      color: black;
  }

  header {
      padding: 10px;
      margin-left: 143px;
  }

  #text1 {
      height: 200px;
      width: 750px;
      font-family: 'Jura', sans-serif;
      margin-left: 275px;
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

  .boton-comprar{
    margin-top: -10px;
    margin-right: 390px;
  }
  .boton-eliminar{
    margin-top: -10px;
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
      width: 1140px;
      margin-left: 14%;
      margin-top: -50px;
  }

  #l2 {
      margin-top: 20px;
      width: 700px;
      margin-left: 30%;

  }


  #amasijos{
      text-align: center;
      color:#A65814;
      height: 200px;
      width: 80px;
      font-family: 'Jura', sans-serif;
      margin-left: 665px;
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
      margin-left: 665px;
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
      margin-left: 665px;
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
      margin-left: 665px;
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
      margin-left: 665px;
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
      margin-left: 665px;
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
      width: 500px;
      margin-left: 4%;
      margin-top: -210px;
      
  }

  #l1 {
      margin-top: -11px;
      width: 500px;
      margin-left: 56%;
  }


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

    .boton-comprar{
      margin-top: -10px;
      margin-right: 210px;
    }
    .boton-eliminar{
      margin-top: -10px;
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