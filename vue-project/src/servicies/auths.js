import axios from "axios";

//funcion para obtener los datos del usuario logeado
export const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) return null;
  
      const response = await axios.get("http://localhost:8000/usuarios/me", {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
      return null;
    }
  };