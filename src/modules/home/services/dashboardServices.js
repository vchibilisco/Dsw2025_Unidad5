// src/home/services/dashboardServices.js

export const getDashboardCounts = async () => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    };

    // 🔹 Llamadas paralelas (mejor performance)
    const [productsRes, ordersRes] = await Promise.all([
      fetch('/api/products', { headers }),
      fetch('/api/orders', { headers }),
    ]);

    const [productsText, ordersText] = await Promise.all([
      productsRes.text(),
      ordersRes.text(),
    ]);

    const productsData = productsText ? JSON.parse(productsText) : [];
    const ordersData = ordersText ? JSON.parse(ordersText) : [];

    // 🔹 Intentamos obtener total desde distintas estructuras posibles
    const productsCount = productsData.total || productsData.count || productsData.items?.length || productsData.length || 0;
    const ordersCount = ordersData.total || ordersData.count || ordersData.items?.length || ordersData.length || 0;

    return {
      data: { productsCount, ordersCount },
      error: null,
    };
  } catch (error) {
    console.error('Error al obtener conteos:', error);
    return { data: { productsCount: 0, ordersCount: 0 }, error };
  }
};
