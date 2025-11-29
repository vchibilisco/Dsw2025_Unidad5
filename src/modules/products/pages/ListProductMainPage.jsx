import { useState, useEffect } from 'react';
import { mockProducts } from '../../../data/mockData';
import ProductCard from '../components/ProductCard';

function ListProductMainPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // 1. Simulación de carga de datos:
    setProducts(mockProducts);
  }, []);

  return (
    <div className="py-8">
      {/* El título se ha quitado de aquí para evitar la duplicación en la vista. */}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          // 2. Por cada producto, renderizamos el componente ProductCard
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ListProductMainPage;