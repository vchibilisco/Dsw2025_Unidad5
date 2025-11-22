import { instance } from '../../shared/api/axiosInstance';

export const getOrders = async (customerId = null, status = null, pageNumber = 1, pageSize = 20) => {
  const queryString = new URLSearchParams({
    customerId,
    status,
    pageNumber,
    pageSize,
  });

  try {
    // Primero intento con axios
    const response = await instance.get(`api/orders?${queryString}`);
    return { data: response.data, error: null };
  } catch (err) {
    try {
      // Si axios falla, intento con fetch manual
      const url = `api/orders?${queryString}`;
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

      const items = data?.items || data?.results || data || [];
      return { data: Array.isArray(items) ? items : [], error: null };
    } catch (error) {
      console.error('Error al listar órdenes:', error);
      return { data: [], error };
    }
  }
};
