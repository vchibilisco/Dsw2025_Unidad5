import { useEffect, useState } from 'react';
import { listOrders } from '../services/listServices';

function ListOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('listorders');
    const fetchOrders = async () => {
      const { data, error } = await listOrders();

      if (error) {
        console.error('Error fetching orders', error);
      } else {
        setOrders(data);
      }

      setLoading(false);
    };

    fetchOrders();
  }, []);

  return (
    <>
      <div>ListOrders</div>
      {loading ?
        (
          <p>Buscando ordenes</p>
        ) : (
          <p>Datos obtenidos</p>
        )
      }
    </>

  );
};

export default ListOrdersPage;
