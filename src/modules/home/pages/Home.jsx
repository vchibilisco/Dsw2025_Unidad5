import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import getTotalProducts from '../service/totalProduct';
import getTotalOrders from '../service/totalOrders';

function Home() {

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, settotalOrders] = useState(0);
 
  useEffect(() => {
    const fetchTotal = async () => {
      const { data, error } = await getTotalProducts();

      if (!error) {
        setTotalProducts(data.totalCount); // <-- EL TOTAL REAL
      }
    };

    fetchTotal();
  }, []);

  useEffect(() => {
    const fetchTotal = async () => {
      const { data, error } = await getTotalOrders();

      if(!error) {
        settotalOrders(data.totalCount);
      }
    };
    fetchTotal();
  }, []);

  return (
    <div className='flex flex-col gap-3 sm:grid sm:grid-cols-2'>
      <Card>
        <h3>Productos</h3>
        <p>Cantidad: {totalProducts}</p>
      </Card>

      <Card>
        <h3>Ordenes</h3>
        <p>Cantidad: {totalOrders}</p>
      </Card>
    </div>
  );
}

export default Home;