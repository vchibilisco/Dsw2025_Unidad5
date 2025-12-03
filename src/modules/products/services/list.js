import { instance } from '../../shared/api/axiosInstance';

// para obtener productos con filtros (usada por el Admin)
export const getProducts = async (status = null, SearchTerm = null, pageNumber = 1, pageSize = 20 ) => {
  const queryString = new URLSearchParams({
    status,
    SearchTerm,
    pageNumber,
    pageSize,
  });

  // Endpoint usado por el Admin (asumiendo que requiere autenticación)
  const response = await instance.get(`api/products/admin?${queryString}`);

  console.log("FETCHING WITH:", status, SearchTerm, pageNumber, pageSize);

  return { data: response.data, error: null };
};


// FUNCIÓN NUEVA: Para la página principal del Cliente (Público)

export const getPublicProducts = async (pageNumber = 1, pageSize = 20) => {
    // Usamos GET /api/products, que debería ser el endpoint público.
    
    // Puedes ajustar los parámetros de consulta si el endpoint público los soporta
    const queryString = new URLSearchParams({
        pageNumber,
        pageSize,
    });
    
    try {
        const response = await instance.get(`api/products?${queryString}`); 
        // Si el backend devuelve un array vacío o 204 No Content, lo maneja el return.
        return { data: response.data || [], error: null };
    } catch (error) {
        // En caso de fallo de conexión o error 500
        console.error("Error al cargar los productos públicos:", error);
        return { data: [], error: 'Error al cargar el catálogo.' };
    }
};