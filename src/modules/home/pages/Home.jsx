import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import { getDashboardCounts } from '../services/dashboardServices';

function Home() {
  const [counts, setCounts] = useState({ productsCount: 0, ordersCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      const { data, error } = await getDashboardCounts();

      if (error) {
        setError('Error al cargar los totales');
      } else {
        setCounts(data);
      }

      setLoading(false);
    };

    fetchCounts();
  }, []);

  return (
    <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
      <Card>
        <h3 className="text-xl font-semibold">Productos</h3>
        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p>Cantidad: {counts.productsCount}</p>
        )}
      </Card>

      <Card>
        <h3 className="text-xl font-semibold">Órdenes</h3>
        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p>Cantidad: {counts.ordersCount}</p>
        )}
      </Card>
    </div>
  );
}

export default Home;
