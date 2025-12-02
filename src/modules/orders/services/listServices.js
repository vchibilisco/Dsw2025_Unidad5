export const listOrders = async () => {
  const response = await fetch("/api/orders", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (response.ok) {
    const data = await response.json();

    return { data, error: null };
  } else {
    const error = await response.json();

    return { data: null, error };
  }
};

export const createOrder = async (orderData, token) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Envío del token
      },
      body: JSON.stringify(orderData), // Envío del payload
    });

    if (response.ok) {
      // Espera 201 Created
      const data = await response.json();
      return { success: true, data, error: null };
    } else {
      const errorBody = await response.json();
      let errorMessage;

      if (response.status === 400) {
        // El backend usa excepciones para stock insuficiente o datos inválidos.
        // Intentamos obtener el mensaje de error que el backend devuelve (puede ser 'message' o 'detail').
        errorMessage =
          errorBody.message ||
          errorBody.detail ||
          "Datos de orden inválidos o stock insuficiente.";
      } else if (response.status === 401) {
        errorMessage = "No autorizado. Tu sesión ha expirado.";
      } else {
        // Para 500 Internal Server Error u otros.
        errorMessage = `Error ${response.status}: Ocurrió un fallo inesperado en el servidor.`;
      }

      return { success: false, data: null, error: errorMessage };
    }
  } catch (error) {
    console.error("Error de conexión:", error);
    return {
      success: false,
      data: null,
      error: "No se pudo conectar al servidor.",
    };
  }
};
