import { useState, useEffect } from 'react';
// ELIMINAR: import { mockProducts } from '../../../data/mockData';
// CORREGIR: Importar la función real del servicio
import { getPublicProducts } from '../services/list'; 
import ProductCard from '../components/ProductCard';

function ListProductMainPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Manejo de estado de carga
  const [error, setError] = useState(null); // Manejo de errores

  useEffect(() => {
    const fetchProducts = async () => {
        setLoading(true);
        // LLAMADA AL SERVICIO PÚBLICO
        const { data, error } = await getPublicProducts(); 

        if (error) {
            setError(error);
            setProducts([]);
        } else {
            setProducts(data);
        }
        setLoading(false);
    };

    fetchProducts();
  }, []); // Se ejecuta solo al montar el componente

  if (loading) {
      return <div className="text-center py-20">Cargando catálogo...</div>;
  }

  if (error) {
      return <div className="text-red-600 text-center py-20">Error: {error}</div>;
  }
  
  return (
    <div className="py-8">
      {/* Título omitido según tu código original */}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          // Asegúrate que ProductCard espere un objeto con { id, name, price, stockQuantity, etc.}
          <ProductCard key={product.id} product={product} /> 
        ))}
      </div>
      
      {products.length === 0 && !loading && !error && (
          <div className="text-center text-gray-500 mt-10">No hay productos disponibles en el catálogo.</div>
      )}
    </div>
  );
};

export default ListProductMainPage;