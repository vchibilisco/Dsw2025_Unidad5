import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import { getOrdersWithCustomerName } from '../services/listServices';

const orderStatus = {
  ALL: 'ALL',
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};
const mapOrderStatus = (status) => {
  switch (status) {
    case 0: return 'Pendiente';
    case 1: return 'En proceso';
    case 2: return 'Enviado';
    case 3: return 'Entregado';
    case 4: return 'Cancelado';
    default: return 'Desconocido';
  }
};

function ListOrdersPage() {
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(orderStatus.ALL);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(3);
  const [total, setTotal] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
  try {
    setLoading(true);
    const { data, error } = await getOrdersWithCustomerName(searchTerm, status, pageNumber, pageSize);
    if (error) throw error;

    console.log('Respuesta de getOrdersWithCustomerName:', data);

    setOrders(Array.isArray(data.orders) ? data.orders : []);
    setTotal(typeof data.total === 'number' ? data.total : 0);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchOrders();
  }, [status, pageNumber, pageSize]);

  const totalPages = Math.ceil(total / pageSize);
  
  const getVisiblePages = () => {
    const pages = [];

  if (totalPages <= 3) {
    // Mostrar todas si son 3 o menos
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (totalPages === 4) {
    if (pageNumber <= 2) {
      pages.push(1, 2, '…', 4);
    } else {
      pages.push(2, 3, 4);
    }
  } else {
    if (pageNumber <= 2) {
      pages.push(1, 2, '…', totalPages);
    } else if (pageNumber >= totalPages - 1) {
      pages.push(1, '…', totalPages - 1, totalPages);
    } else {
      pages.push(pageNumber - 1, pageNumber, pageNumber + 1);
    }
  }

  return pages;
};

  const visiblePages = getVisiblePages();

  const handleSearch = async () => {
    setPageNumber(1);
    await fetchOrders();
  };

  return (
    <div className="p-6">
      <Card>
        <h1 className="text-3xl mb-4">Órdenes</h1>

        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Buscar por CustomerName"
              className="text-[1.2rem] border px-3 py-2 w-full lg:w-64"
            />
            <Button onClick={handleSearch} className="h-11 w-11">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="text-[1.2rem] border px-3 py-2"
          >
            <option value={orderStatus.ALL}>Todos</option>
            <option value={orderStatus.PENDING}>Pendiente</option>
            <option value={orderStatus.PROCESSING}>En proceso</option>
            <option value={orderStatus.SHIPPED}>Enviado</option>
            <option value={orderStatus.DELIVERED}>Entregado</option>
            <option value={orderStatus.CANCELLED}>Cancelado</option>

          </select>
        </div>
      </Card>

      <div className="mt-4 flex flex-col gap-4">
        {loading ? (
          <span>Buscando órdenes...</span>
        ) : (
          orders.map((order) => (

            <Card key={order.orderId} className="flex justify-between items-center px-4 py-3">
              <div>
                <h2 className="text-xl font-semibold">{order.orderId} - {order.customerName}</h2>
                <p className="text-base">Estado: {mapOrderStatus(order.orderStatus)}</p>
              </div>
              <Button onClick={() => setSelectedOrder(order)}>Ver</Button>
            </Card>
          ))
        )}
      </div>

      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          className="px-4 py-2 text-sm sm:text-base bg-gray-200 disabled:bg-gray-100 rounded-md w-full max-w-[140px]"
        >
          ← Anterior
        </button>

        <div className="hidden sm:flex gap-2">
  {visiblePages.map((page, idx) =>
    typeof page === 'number' ? (
      <button
        key={idx}
        onClick={() => setPageNumber(page)}
        className={`px-3 py-1 ${pageNumber === page ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
      >
        {page}
      </button>
    ) : (
      <span key={idx} className="px-3 py-1">…</span>
    )
  )}
</div>


        <button
          disabled={pageNumber === totalPages}
          onClick={() => setPageNumber(pageNumber + 1)}
          className="px-4 py-2 text-sm sm:text-base bg-gray-200 disabled:bg-gray-100 rounded-md w-full max-w-[140px]"
        >
          Siguiente →
        </button>
      </div>
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Orden {selectedOrder.orderId}</h2>
            <p><strong>Cliente:</strong> {selectedOrder.customerName}</p>
            <p><strong>Fecha:</strong> {new Date(selectedOrder.date).toLocaleString()}</p>
            <p><strong>Dirección:</strong> {selectedOrder.billingAddress}</p>
            <p><strong>Notas:</strong> {selectedOrder.notes || 'Sin notas'}</p>
            <p><strong>Estado:</strong> {mapOrderStatus(selectedOrder.orderStatus)}</p>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Items:</h3>
              {selectedOrder.orderItems.map((item, index) => (
                <div key={index} className="mb-2 border-b pb-2">
                  <p><strong>Producto:</strong> {item.name }</p>
                  <p><strong>Producto ID:</strong> {item.productId}</p>
                  <p><strong>Cantidad:</strong> {item.quantity}</p>
                  <p><strong>Precio unitario:</strong> ${item.unitPrice}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 text-right">
              <Button onClick={() => setSelectedOrder(null)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListOrdersPage;