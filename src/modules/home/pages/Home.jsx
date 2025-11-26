import Card from '../../shared/components/Card';
import { useEffect, useState } from 'react';
import { getOrderCount, getProductCount } from './services/dashboardServices';

function Home() {

  const [orderCount, setOrderCount] = useState(null);
  const [productCount, setProductCount] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      const [{ data: orders, error: orderError }, { data: products, error: productError }] = await Promise.all([
        getOrderCount(),
        getProductCount(),
      ]);

      if (!orderError) setOrderCount(orders);

      if (!productError) setProductCount(products);
    };

    fetchCounts();
  }, []);

  return (
    <div
      className='flex flex-col gap-3 sm:grid sm:grid-cols-2'
    >
      <Card>
        <h3 className='font-semibold mb-2 text-xl'>Productos</h3>
        <p className='text-base'>Cantidad: {productCount !== null ? productCount : 'Cargando...'}</p>
      </Card>

      <Card>
        <h3 className='text-xl font-semibold mb-2'>Ordenes</h3>
        <p className='text-base'>Cantidad:  {orderCount !== null ? orderCount : 'Cargando...'}</p>
      </Card>
    </div>
  );
};

export default Home;
