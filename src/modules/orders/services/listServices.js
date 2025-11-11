// src/orders/services/listServices.js
export const listOrders = async (status = '', customerId = '') => {
  try {
    const queryParams = new URLSearchParams();

    if (status && status !== 'all') queryParams.append('status', status);
    if (customerId) queryParams.append('customerId', customerId);

    const url = `/api/orders${queryParams.toString() ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(data?.message || 'Error al cargar las órdenes');
    }

    // 🔹 Si no hay data o está vacía, devolvemos lista vacía controlada
    const items = data?.items || data?.results || data || [];
    return { data: Array.isArray(items) ? items : [], error: null };
  } catch (error) {
    console.error('Error al listar órdenes:', error);
    return { data: [], error };
  }
};
