<script setup lang="ts">
import ComImagen from './icons/IMGENES/ComImagen.vue';
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const nombre = ref("");
const contraseña = ref("");
const errorMessage = ref(null);
const successMessage = ref(null);
const router = useRouter();

const validarUsuario = async () => {
  try {
    // Llamada al endpoint de login
    const respuesta = await axios.post("http://127.0.0.1:8000/login", {
      nombre: nombre.value,
      contraseña: contraseña.value,
    });

    // Aquí se valida el rol y se redirige a la página correspondiente
    const rol = respuesta.data.rol;  // El rol que llega del backend

    if (rol) {
      if (rol === "ADMINISTRADOR") {
        router.push("/Admi");  // Redirige a la ruta para Administradores
      } else if (rol === "JEFE") {
        router.push("/Jefe");  // Redirige a la ruta para Jefe
      } else if (rol === "EMPLEADO") {
        router.push("/Empleado");  // Redirige a la ruta para Empleados
      } else {
        errorMessage.value = "Rol no reconocido. Acceso denegado.";
      }
    }
  } catch (error) {
    // Manejo de errores: si ocurre un error en la respuesta, captúralo
    if (error.response) {
      // Si hay una respuesta del servidor, muestra el mensaje de error
      errorMessage.value = error.response.data || "Error al iniciar sesión";
    } else {
      // Si no hay respuesta, muestra un error genérico
      errorMessage.value = "Error de conexión o servidor no disponible";
    }
  }
};
</script>


<template>
    <header>
        <nav>
        <ComImagen/>
        <div class="menu-hamburguesa" id="menu-hamburguesa">
            <ul class="menu">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/Nosotros">Nosotros</router-link></li>
            </ul>
        </div>
        </nav>
    </header>
  <hr>
  <hr id="l2">
  <div class="login-container">
    <h2>Iniciar Sesión</h2>

    <form @submit.prevent="validarUsuario">
      <label for="name">Nombre:</label>
      <input
        type="text"
        v-model="nombre"
        id="nombre"
        name="nombre"
        placeholder="Ingrese su nombre"
        required
      />

      <label for="password">Contraseña:</label>
      <input
        type="password"
        v-model="contraseña"
        id="contraseña"
        name="contraseña"
        placeholder="Ingrese su contraseña"
        required
      />

      <a href="#" class="forgot-password">¿Olvidaste la contraseña?</a>

      <button type="submit" class="login-btn">Iniciar Sesión</button>
    </form>

    <!-- Mensaje de error si falla el inicio de sesión -->
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <!-- Mensaje de éxito si el login es correcto -->
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
    <div id="hl"><img src="https://i.postimg.cc/d33z8SRy/Whats-App-Image-2024-11-22-at-4-54-18-PM-1.jpg" id="imagen"></div>

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
    font-weight: normal;
    color: black; /* Cambiado aquí */
}
  
  header {
    padding: 20px;
    background-color: #000000;
  }
  

  
  ul li {
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
  
  #res:hover {
    background-color: #ff9178;
    color: aliceblue;
  }
  
  #res{
    transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
    background-color: #e03743;
    text-decoration: none;
    border-bottom: 0px;
    width: 150px;
    text-align: center;
    font-size: 18px;
    padding: 4px;
    border-radius: 15px;
  }
  
  hr {
    border-top: 2px solid #D9AB23; /* Ajusta el grosor y color según tus necesidades */
    margin: 20px 0; /* Ajusta el margen superior e inferior */
    margin-top: 54px;
    width: 1300px;
    margin-left: 7%;
  }
  
  #l2 {
    margin-top: 10px;
    width: 800px;
    margin-left: 22%;
  }

  .login-container {
    border-radius: 10px;
    padding: 20px 30px;
    text-align: center;
    width: 500px;
    height: 380px;
    background-color: hsla(66, 20%, 68%, 0.4);
    margin-left: 260px;
    margin-top: 80px;
}

h2 {
    color: #D9AB23;
    margin-bottom: 10px;
    font-size: 34px;
    font-family: 'Jura', sans-serif;

}

.register-btn {
    background-color: #8C3420;
    color: #F2F2F2;
    padding: 5px 10px;
    border-radius: 20px;
    text-decoration: none;
    font-size: 18px;
}

form {
    margin-top: 20px;
}

label {
    display: block;
    margin-bottom: 5px;
    color: #ffffff;
    font-family: 'Jura', sans-serif;
    padding: 5px;
    font-weight: bold;

}

input[type="text"],
input[type="password"] {
    width: 70%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #a64e4e;
    border-radius: 12px;
    background-color: #D9AB23;
}

.forgot-password {
    display: block;
    margin-bottom: 20px;
    color: #D9AB23;
    text-decoration: none;
    font-size: 15px;
    font-family: 'Jura', sans-serif;

}

.login-btn {
    transition: background-color, 0.3s ease-in-out;
    background-color: #D9AB23;
    color: #ffffff;
    padding: 10px;
    width: 100%;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 200px;
    height: 50px;
    font-size: 20px;
    font-family: 'Jura', sans-serif;
}

.login-btn:hover {
    background-color: #592E25;
}

.social-login {
    margin-top: 20px;
}

.social-login p {
    margin-bottom: 10px;
    color: #592E25;
}

.social-icons img {
    width: 40px;
    margin: 0 10px;
    cursor: pointer;
}


#hl{
    margin-top: -3px;
  }

  #imagen{
    margin-left: 854px;
    width: 480px;
    height: 390px;
    margin-top: -435px;
    border-radius: 200px;
  }
  p{
    font-family: 'Jura', sans-serif;

  }

  footer {
      padding: 20px;
      text-align: center;
      margin-top: 34px;
  }
  
  footer nav ul {
      list-style: none;
      display: inline-block;
  }
  
  footer nav li {
      display: inline;
      margin: 0 10px;
  }
  
  footer a {
      text-decoration: none;
      color: #333;
  }

  /* From Uiverse.io by david-mohseni */ 
  .wrapper {
    display: inline-flex;
    list-style: none;
    height: 120px;
    width: 100%;
    padding-top: 40px;
    font-family: "Poppins", sans-serif;
    justify-content: center;
    margin-left: -32px;
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
    flex-direction: column;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
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
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  .wrapper .icon:hover .tooltip {
    top: -45px;
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }
  
  .wrapper .icon:hover span,
  .wrapper .icon:hover .tooltip {
    text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.1);
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
    background: #000000;
    color: #fff;
  }
  
  .wrapper .instagram:hover,
  .wrapper .instagram:hover .tooltip,
  .wrapper .instagram:hover .tooltip::before {
    background: #e4405f;
    color: #fff;
  }

</style>