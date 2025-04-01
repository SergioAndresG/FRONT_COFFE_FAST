
<script setup lang="ts">
import ComImagen from './icons/IMGENES/ComImagen.vue';
import { getCurrentUser } from '@/servicies/auths';
import { onMounted, ref } from 'vue';
import ActulizacionPerfil from './ActulizacionPerfil.vue';
import router from '@/routers/misrutas';

const usuario = ref(null);
const isModalOpen = ref(false);

const logout = () => {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("userData");
  router.push({path: "/"});
}

onMounted(async () => {
  usuario.value = JSON.parse(localStorage.getItem("userData") || null)
  //actualizar los datos desde la API
  const freshData = await getCurrentUser();
  if(freshData) usuario.value = freshData;
});

const actualizar = () => {
  isModalOpen.value = true;
}

const actualizarClose = async () => {
  isModalOpen.value = false;
  const freshData = await getCurrentUser();
  if(freshData) usuario.value = freshData;
}

</script>

<template>
  <header>
   <nav>
       <ComImagen style="margin-left: 180px;"/>
     <ul>
       <li @click="logout">Cerrar Sesion <i class="fas fa-sign-out-alt"></i></li>
     </ul>
   </nav>
   <hr>
 </header>
 <h1>¡Bienvenido Jefe!</h1>
 <hr id="l2">

 <div id="main-container" v-if="usuario">
  <img v-if="usuario.ruta_imagen" :src="`${usuario.ruta_imagen}?t=${new Date().getTime()}`" id="cara">
   <p id="jefe-name">{{ usuario.nombre }}</p>
   <ActulizacionPerfil v-if="isModalOpen" @close="actualizarClose"/>
 </div>
  <section id="c">
    <div class="nosotros-banner">
      <h2>Configuraciones</h2>
    </div>

    <div class="alert-config-container">
      <i class="fas fa-box-open panel-icon"></i>
       <h1 class="alert-config-title">Panel de Materia Prima</h1>
       <button class="alert-config-button"><a href="/Materia">Ver mas <i class="fas fa-arrow-right" style="margin-left: 12px;"></i></a></button>
    </div>
    <div class="alert-config-container2">
      <i class="fas fa-tags panel-icon"></i>
       <h1 class="alert-config-title">Panel de Productos</h1>
       <button class="alert-config-button"><a href="/Productos">Ver mas <i class="fas fa-arrow-right" style="margin-left: 12px;"></i></a></button>
    </div>
    <div class="alert-config-container3">
      <i class="fas fa-users panel-icon"></i>
        <h1 class="alert-config-title">Panel Usuarios</h1>
        <button class="alert-config-button"><a href="/Gest">Ver mas <i class="fas fa-arrow-right" style="margin-left: 12px;"></i></a></button>
    </div>
    <div class="alert-config-container4">
      <i class="fas fa-file-invoice-dollar panel-icon"></i>
        <h1 class="alert-config-title">Panel Facturas</h1>
        <button class="alert-config-button"><a href="/Gest">Ver mas <i class="fas fa-arrow-right" style="margin-left: 12px;"></i></a></button>
    </div>
    <div class="alert-config-container5">
      <i class="fas fa-clipboard-list panel-icon"></i>
        <h1 class="alert-config-title">Panel Pedidos</h1>
        <button class="alert-config-button"><a href="/Pedidos">Ver mas <i class="fas fa-arrow-right" style="margin-left: 12px;"></i></a></button>
    </div>
    <div class="alert-config-container6">
      <i class="fa-solid fa-paste"></i><br>
        <h1 class="alert-config-title">Menu</h1>
        <button class="alert-config-button"><a href="/Menu">Ver mas <i class="fas fa-arrow-right" style="margin-left: 12px;"></i></a></button>
    </div>
  </section>
  <div class="buttom-container">
    <button @click="actualizar" class="buttom-perfil">Ver Perfil</button>
   </div>
<footer>
  <p>&copy; 2025 </p>
</footer>

</template>

  
  <style scoped>

@import url('https://fonts.googleapis.com/css2?family=Jura:wght@700&display=swap');
h1{
  font-family: 'Jura', sans-serif;
  text-align: center;
  color: #D9AB23;
  margin-top: -10px
}
#txt {
  font-family: 'Jura', sans-serif;
  text-align: center;
  color: #ffffff;
}
body {
  font-family: 'Jura', sans-serif;
  font-weight: normal;
  color: black; /* Cambiado aquí */
}
ul li {
  font-family: 'Jura', sans-serif;
  text-decoration: none;
  border-bottom: 5px solid #A65814;
  transition: border-bottom-color 0.3s ease-in-out;
  border-radius: 5px;
}
ul li:hover {
  border-bottom-color: rgb(17, 0, 255);
}
nav{
  margin-left: 173px;
}
nav ul {
  list-style: none;
  display: flex;
  justify-content: space-evenly;
  margin-left: 314px;
  margin-top: -73px;
}
nav li a {
  font-family: 'Jura', sans-serif;
  text-decoration: none;
  color: white;
  padding: 10px;
}
hr {
  border-top: 2px solid #D9AB23; 
  margin: 20px 0;
  margin-top: 54px;
  width: 1300px;
  margin-left: 7%;
} 
#l2 {
  margin-top: -10px;
  width: 800px;
  margin-left: 22%;
}
#cara {
  margin-top: 98px;
  width: 350px;
  height: 350px;
  margin-left: 100px;
  border-radius: 170px 170px 170px 170px;
}
#jefe-name{
  text-align: left;
  margin-left: 160px;
  margin-top: -414px;
  color: #D9AB23;
  font-size: 34px;
  font-family: 'Jura', sans-serif;
}
#c{
  padding: 22px;
  width: 920px;
  max-height: 780px;
  margin-left: 32%;
  border-radius: 5px;
  border: 1px solid #D9AB23; 
  margin-top: -80px;
}
.nosotros-banner {
  width: 100%;
  background-color: #d9ab23be;
  text-align: center;
  padding: 10px 0;
  border: 1px solid;
  font-family: 'Jura', sans-serif;
  color: white;
}
.buttom-perfil{
  margin-top: 100px;
  background-color: #D9AB23;
  margin-top: -45px;
  width: 105px;
  height: 34px;
  border: solid 1px #e6e6e6;
  border-radius: 5px 5px 5px 5px;
  transition: all 0.3s ease-in-out;
}
.buttom-perfil:hover{
  background-color: #D99923;
  transform: scale(1.05) translateY(-5px);
}
.buttom-container{
  width: 100px;
  height: 100px;
  margin-left: 225px;
  margin-top: -145px;
  text-align: center;
}
.nosotros-banner h2{
  color: white;
  margin-left: -10px;
}
.button-container2 {
    display: flex;
    justify-content: space-between;
    width: 80%;
    max-width: 300px;
    margin-left: 558px;
    margin-top: 51px;
}
.button-container2 button {
  font-family: 'Jura', sans-serif;
  background-color: #D99923;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.button-container2 button a {
  text-align: center;
  text-decoration: none;
  color: white;
}
.button-container2 button:hover {
    background-color: #f2d2d0;
    color: black
}
.alert-config-container {
  background-color: #D9AB23; 
  padding: 20px;
  border-radius: 30px 30px 30px 30px; 
  text-align: center; 
  width: 150px; 
  max-height: 170px;
  margin: 0 auto; 
  margin-left: 50px;
  margin-top: 50px;
}
.alert-config-container2 {
  background-color: #D9AB23; 
  padding: 20px;
  border-radius: 30px;
  text-align: center; 
  width: 150px; 
  max-height: 170px;
  margin: 0 auto; 
  margin-left: 264px;
  margin-top: -208px;
}
.alert-config-container3 {
  background-color: #D9AB23; 
  padding: 30px;
  border-radius: 30px; 
  text-align: center;
  width: 150px; 
  height: 130px;
  margin: 0 auto; 
  margin-left: 480px;
  margin-top: -185px;
}
.alert-config-container4 {
  background-color: #D9AB23; 
  padding: 30px;
  border-radius: 30px; 
  text-align: center;
  width: 150px; 
  height: 130px;
  margin: 0 auto; 
  margin-left: 709px;
  margin-top: -188px;
} 
.alert-config-container5 {
  background-color: #D9AB23; 
  padding: 30px;
  border-radius: 30px; 
  text-align: center;
  width: 150px; 
  height: 130px;
  margin: 0 auto; 
  margin-left: 50px;
  margin-top: 50px;
} 
.alert-config-container6 {
  background-color: #D9AB23; 
  padding: 30px;
  border-radius: 30px; 
  text-align: center;
  width: 150px; 
  height: 130px;
  margin: 0 auto; 
  margin-left: 280px;
  margin-top: -188px;
} 
.alert-config-title {
  font-size: 24px;
  color: #fff;
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
  margin-top: 10px;
}
.alert-config-title::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -10px;
  width: 60%; 
  height: 3px; 
  background-color: black; 
}
/* Estilo del botón */
.alert-config-button {
  background-color: #fff;
  color: black;
  padding: 10px 30px;
  border: none;
  border-radius: 20px; 
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.alert-config-button a{
  color: #000000;
  text-decoration: none;
}
.alert-config-button:hover {
    background-color: #e6e6e6;
}
footer {
  padding: 20px;
  text-align: center;
  margin-top: 34px;
  font-family: 'Jura', sans-serif;

}
  </style>