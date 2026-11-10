import { instance } from "../../shared/api/axiosInstance";

// Este servicio llama al endpoint que NO pide rol (el backend asigna "User" por defecto)
export const registerUser = async (username, email, password) => {
  try {
    const response = await instance.post('/api/auth/register', {
      username,
      email,
      password
    });

    // Retornamos la respuesta completa (Token, CustomerId, etc.)
    return { user: response.data, error: null };
  } catch (error) {
    return { 
        user: null, 
        error: error.response?.data || "Error de conexión al registrarse" 
    };
  }
};