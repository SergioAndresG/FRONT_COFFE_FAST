<script setup>
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const router = useRouter();

const consultarPor = (tipo) => {
  if (tipo === 'id') {
    router.push('/ConsultarProid'); 
  }  if (tipo === 'nombre') {
    router.push('/ConsultarProN'); 
  }  if (tipo === 'cantidad') {
    router.push('/ConsultarProC'); 
   } else {
    Swal.fire(`Consulta por ${tipo}`, `Aquí puedes implementar la lógica para consultar por ${tipo}.`, "info");
  }
};

const cerrarModal = () => {
  router.push('/Productos'); 
};
</script>

<template>
  <div class="modal-overlay" @click="cerrarModal">
    <div class="modal-content" @click.stop>
      <h2>Consultar Productos</h2>
      <p>¿Cómo desea consultar los productos?</p>
      <div class="button-container">
        <button @click="consultarPor('nombre')">Consultar por Nombre</button>
        <button @click="consultarPor('cantidad')">Consultar por Cantidad</button>
        <button @click="consultarPor('id')">Consultar por ID</button>
      </div>
      <button class="close-btn" @click="cerrarModal">Cerrar</button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.646);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: #000000;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid white;
  text-align: center;
  width: 600px;
  box-shadow: 0 4px 8px rgba(213, 142, 142, 0.2);
}

h2 {
  font-size: 22px;
  font-family: 'Jura', sans-serif;
  margin-bottom: 10px;
  color: #ffffff;
}

p {
  font-size: 16px;
  font-family: 'Jura', sans-serif;
  margin-bottom: 20px;
  color: #ffffff;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  background-color: #ffd700;
  font-family: 'Jura', sans-serif;
  color: rgb(0, 0, 0);
  padding: 10px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s ease;
}

button:hover {
  background-color: #ffcc00;
}

.close-btn {
  margin-top: 15px;
  background-color: red;
  color: white;
}
</style>
