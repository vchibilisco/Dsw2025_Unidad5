import { useState, useEffect } from 'react';
import { getMainProducts } from '../services/listMain';
import ProductCard from '../components/ProductCard';

function ListProductMainPage() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try{
      setLoading(true);
      const { data, error } = await getMainProducts();

      if (error) throw error;

      console.log("DATA DEL BACKEND", data);

      setProducts(data);
    } catch (error){
      console.error(error);
    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    // 1. Simulación de carga de datos:
    fetchProducts();
  }, []);

  return (
    <div className="py-8">
      {/* El título se ha quitado de aquí para evitar la duplicación en la vista. */}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {
          loading
          ? <span>Buscando datos...</span>
          : products.map((product) => (
          // 2. Por cada producto, renderizamos el componente ProductCard
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ListProductMainPage;