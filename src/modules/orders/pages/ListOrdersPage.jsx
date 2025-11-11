import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { listOrders } from '../../orders/services/listServices';

function ListOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [customerId, setCustomerId] = useState('');
  const [searchCustomerId, setSearchCustomerId] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await listOrders(statusFilter, searchCustomerId);

      if (error) {
        setError(error.message || 'Error al cargar las órdenes');
        setOrders([]);
      } else {
        setOrders(data);
        setError(null);
      }

      setLoading(false);
    };

    fetchOrders();
  }, [statusFilter, searchCustomerId]);

  const handleSearch = () => {
    // 🔹 Si está vacío, mostramos todas
    setSearchCustomerId(customerId.trim());
  };

  return (
    <div>
      <Card>
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-3xl">Órdenes</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* 🔹 Filtro por ID de cliente */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Buscar por ID de cliente"
              className="text-[1.3rem] w-full"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
            <Button className="h-11 w-11" onClick={handleSearch}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </Button>
          </div>

          {/* 🔹 Filtro por estado */}
          <select
            className="text-[1.3rem]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="processing">Procesadas</option>
            <option value="shipped">Enviadas</option>
            <option value="delivered">Entregadas</option>
            <option value="cancelled">Canceladas</option>
          </select>
        </div>
      </Card>

      {/* 🔹 Estado de carga o error */}
      {loading && <p className="mt-4 text-lg">Cargando órdenes...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* 🔹 Listado dinámico */}
      {!loading && !error && (
        <div className="mt-4 flex flex-col gap-4">
          {orders.length === 0 ? (
            <p className="text-lg text-gray-600">No hay órdenes que coincidan con el filtro.</p>
          ) : (
            orders.map((order, index) => (
              <Card key={order.id || index}>
                <h1 className="text-xl font-semibold">
                  #{order.id} - Cliente: {order.customerId}
                </h1>
                <p className="text-base text-gray-700">
                  Estado: <span className="font-semibold">{order.status}</span>
                </p>
                <p className="text-base text-gray-700">
                  Dirección de envío: {order.shippingAddress}
                </p>
                <p className="text-base text-gray-700">
                  Dirección de facturación: {order.billingAddress}
                </p>
                <p className="text-base text-gray-700">
                  Notas: {order.notes || 'Sin notas'}
                </p>

                {order.orderItems && order.orderItems.length > 0 && (
                  <div className="mt-2">
                    <h2 className="text-base text-gray-700 font-semibold">Productos:</h2>
                    <div className="pl-4">
                      {order.orderItems.map((item, i) => (
                        <p key={i} className="text-base text-gray-700">
                          Producto:{' '}
                          <span className="font-semibold">{item.productId}</span>{' '}
                          | Cantidad:{' '}
                          <span className="font-semibold">{item.quantity}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ListOrdersPage;

