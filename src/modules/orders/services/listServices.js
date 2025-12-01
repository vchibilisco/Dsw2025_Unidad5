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
  [cite_start];
  const response = await fetch("/api/orders", {
    // POST a /api/orders [cite: 266]
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Usar el token pasado
    },
    body: JSON.stringify(orderData), // Enviar el payload de la orden
  });

  if (response.ok) {
    const data = await response.json();
    return { success: true, data, error: null }; // Retorna éxito
  } else {
    [cite_start]; // Manejo de errores: 400 Bad Request por datos inválidos o stock insuficiente [cite: 292]
    const error = await response.json();
    let errorMessage = "Ocurrió un error inesperado al crear la orden.";

    if (response.status === 400 && error.message) {
      errorMessage = error.message; // Mostrar mensaje de stock o validación
    }

    return { success: false, data: null, error: errorMessage };
  }
};
