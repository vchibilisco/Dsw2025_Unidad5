import { instance } from "../../shared/api/axiosInstance";

// Función auxiliar para decodificar el payload de un JWT
const decodeJwtPayload = (token) => {
  try {
    if (!token) return null;

    // El payload es la segunda parte (índice 1) del token (header.payload.signature)
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];

    // Decodificación Base64 URL segura
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    // Decodificar Base64 y luego JSON
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decodificando JWT:", e);
    return null;
  }
};

export const login = async (username, password) => {
  const response = await instance.post("api/auth/login", {
    username,
    password,
  });

  const token = response.data.token;

  // 1. Decodificar el token
  const decoded = decodeJwtPayload(token);

  // 2. Extraer el customerId del claim 'nameid' (o 'sub')
  const customerId = decoded ? decoded.nameid : null;

  if (!customerId) {
    // Fallar si el token no contiene el ID necesario
    return {
      data: null,
      error:
        "Error: No se pudo obtener el ID de cliente del token de autenticación.",
    };
  }

  // 3. Devolver un objeto { token, customerId } para que AuthProvider lo guarde.
  return {
    data: { token, customerId },
    error: null,
  };
};
