<script>
import lottie from 'lottie-web';


//ejemplo de datos para facturas 
export default {
  data() {
    return {
      animation: null,
      showMateriaPrimaPanel: false,
      showClientesPanel: false,
      facturasMateriaPrima: [
        { codigo: 'MP-001', fecha: '15/04/2024', proveedor: 'Distribuidora Alimentos S.A.', total: '$1,250.00' },
        { codigo: 'MP-002', fecha: '10/04/2024', proveedor: 'Bebidas del Valle', total: '$890.50' },
        { codigo: 'MP-003', fecha: '05/04/2024', proveedor: 'Carnicería Premium', total: '$2,340.75' },
        { codigo: 'MP-004', fecha: '01/04/2024', proveedor: 'Panadería Dulce', total: '$450.25' }
      ],
      facturasClientes: [
        { cedula: '001-1234567', fecha: '18/04/2024', cliente: 'Juan Pérez', total: '$850.00' },
        { cedula: '001-7654321', fecha: '17/04/2024', cliente: 'María Rodríguez', total: '$1,200.50' },
        { cedula: '001-9876543', fecha: '16/04/2024', cliente: 'Carlos Gómez', total: '$750.25' },
        { cedula: '001-4567890', fecha: '15/04/2024', cliente: 'Ana Martínez', total: '$2,340.75' }
      ]
    };
  },

  //animacion de lottie
  mounted() {
    this.loadLottieAnimation();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
  },
  methods: {
    loadLottieAnimation() {
      this.animation = lottie.loadAnimation({
        container: this.$refs.lottieContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://lottie.host/dbd92ec6-d27a-461e-98ee-2fc39e3a5342/zft6pQtYyC.json'
      });
    },
    toggleMateriaPrimaPanel() {
      this.showMateriaPrimaPanel = !this.showMateriaPrimaPanel;
          // se ciierra el panel de clientes si est abierto
      if (this.showClientesPanel && this.showMateriaPrimaPanel) {
        this.showClientesPanel = false;
      }
    },
    toggleClientesPanel() {
      this.showClientesPanel = !this.showClientesPanel;
      // se cierra el panel de materia prima si esta abierto
      if (this.showMateriaPrimaPanel && this.showClientesPanel) {
        this.showMateriaPrimaPanel = false;
      }
    }
  },
  beforeDestroy() {
    if (this.animation) {
      this.animation.destroy();
    }
  }
};
</script>

<template>
  <header>
    <nav>
      <img src="https://i.postimg.cc/QMwjX2vk/Whats-App-Image-2024-11-23-at-10-53-04-PM.jpg" class="imagen" alt="logo">
    </nav>
    <hr>
    <hr class="linea2">
    <h1 class="titulo">Panel Facturas</h1>
    
    <div class="menu-container">
      <ul class="menu-amarillo">
        <li @click="toggleMateriaPrimaPanel":class="{ activo: showMateriaPrimaPanel }"> 
          <span class="icon"><i class="fas fa-box-open"></i></span>
          <span>Facturas materia prima</span>
        </li>
        <li @click="toggleClientesPanel":class="{ activo: showClientesPanel }">
          <span class="icon"><i class="fas fa-users"></i></span>
          <span>Facturas clientes</span>
        </li>  
        <div ref="lottieContainer" class="lottie-animation"></div>    
      </ul>
      
      <div class="panel-negro" v-if="showClientesPanel">
        <h3><i class="fas fa-file-invoice" style="margin-right: 10px;"></i>Facturas de Clientes</h3>
        <div class="panel-content">
          <div class="form-group">
            <label><i class="fas fa-search"></i> Buscar Factura</label>
            <input type="text" placeholder="Cédula, Nombre del cliente...">
          </div>
          
          <div class="facturas-table">
            <div class="table-header">
              <div class="header-item">Cédula</div>
              <div class="header-item">Fecha</div>
              <div class="header-item">Cliente</div>
              <div class="header-item">Total</div>
              <div class="header-item">Ver</div>
            </div>
            
            <div class="table-row" v-for="(factura, index) in facturasClientes" :key="index">
              <div class="row-item">{{ factura.cedula }}</div>
              <div class="row-item">{{ factura.fecha }}</div>
              <div class="row-item">{{ factura.cliente }}</div>
              <div class="row-item">{{ factura.total }}</div>
              <div class="row-item">
                <i class="fas fa-image action-icon"></i>
              </div>
            </div>
          </div>
          
          <div class="action-buttons">
            <button class="btn btn-gold"><i class="fas fa-file-import"></i> Exportar Excel</button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jura:wght@700&display=swap');

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
    position: relative;
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
.linea2 {
    border-top: 2px solid #D9AB23;
    margin: 20px auto;
    width: 80%;
    margin-top: -5px;
}

.titulo {
    font-family: 'Jura', sans-serif;
    color: #D9AB23;
    margin-top: 10px;
    font-size: 38px;
}

.menu-container {
    position: absolute;
    left: 172px;
    top: 280px; 
    display: flex;
}

.menu-amarillo {
    background-color: #A65814;
    border: 2px solid #f5f5f5;
    border-right: none;
    padding: 15px;
    list-style: none;
    margin: 0;
    padding-left: 15px;
    min-width: 280px;
    height: 400px;
    border-radius: 35px 0px 0px 35px;
}

.menu-amarillo li {
    padding: 10px 0;
    display: flex;
    align-items: center;
    font-family: 'Jura', sans-serif;
    font-weight: bold;
    font-size: 18px;
    text-align: center;
    margin-top: 20px;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s ease;
}

.menu-amarillo li:hover {
    color: #000000;
    transform: translateX(5px);
    border-bottom: 2px solid #ffbf00;
    background-color: #753b0891;
}
.menu-amarillo li:active {
    color: #000000;
    transform: translateX(5px);
    border-bottom: 2px solid #ffbf00;
    background-color: #753b0891;
}

.icon {
    margin-right: 20px;
    font-size: 1.2em;
    width: 20px;
    text-align: center;
    color: #000;
}

.icon:hover {
    color: #ffbf00;
    transform: translateX(5px);
}

.lottie-animation {
  width: 230px;
  height: 230px;
  margin-left: 10px;
  margin-top: 10px;
}

.panel-negro {
  position: absolute;
  left: 100%; 
  top: 0;
  width: 900px;
  background-color: #000000;
  border: 2px solid #ffffff;
  border-left: none;
  border-radius: 0 35px 35px 0;
  padding: 20px;
  color: #D9AB23;
  font-family: 'Jura', sans-serif;
  z-index: 1;
  padding: 15px;
  max-height: 400px; 
  max-width: 910px;
  overflow-y: auto;
}

.panel-negro h3 {
  color: #D9AB23;
  border-bottom: 1px solid #D9AB23;
  padding-bottom: 10px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Jura', sans-serif;
}

.panel-content {
  padding: 15px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.form-group input {
  width: 98%;
  padding: 10px;
  background-color: #333;
  border: 1px solid #D9AB23;
  color: white;
  border-radius: 5px;
  font-family: 'Jura', sans-serif;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  font-family: 'Jura', sans-serif;
}

.btn {
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: -370px;
  margin-left: 700px;
  height: 30px;

}

.btn-gold {
  background-color: #D9AB23;
  color: black;
  border: none;
  font-family: 'Jura', sans-serif;
}

.facturas-table {
  margin-top: 20px;
  border: 1px solid #D9AB23;
  border-radius: 5px;
  overflow: hidden;
}

.table-header, .table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 1fr 0.5fr;
  align-items: center;
}

.table-header {
  background-color: #D9AB23;
  color: #000;
  font-weight: bold;
  padding: 10px 15px;
}

.table-row {
  padding: 10px 15px;
  border-bottom: 1px solid #333;
  color: #fff;
}

.table-row:last-child {
  border-bottom: none;
}

.row-item {
  padding: 5px 0;
}

.action-icon {
  cursor: pointer;
  color: #D9AB23;
  font-size: 1.2em;
  transition: all 0.3s ease;
}

.action-icon:hover {
  color: #fff;
  transform: scale(1.2);
}



</style>