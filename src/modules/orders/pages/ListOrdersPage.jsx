import { useEffect, useState } from 'react';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import { getOrdersWithCustomerName } from '../services/listServices';
import PaginationControls from '../../shared/components/PaginationControls';

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

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(orderStatus.ALL);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [total, setTotal] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const getShortId = (id) => {
    if (!id || typeof id !== 'string') return '';
    // Toma los primeros 8 caracteres del UUID para una referencia corta

    return id.slice(0, 8).toUpperCase();
  };

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

  const handleSearch = async () => {
    setPageNumber(1);
    await fetchOrders();
  };

  return (
    <div className='p-6'>
      <Card>
        <h1 className='text-3xl mb-4'>Ordenes</h1>

        <div className='flex flex-col lg:flex-row gap-4 mb-4'>
          <div className='flex items-center gap-3 w-full lg:w-auto'>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type='text'
              placeholder='Buscar por Nombre'
              className='text-[1.2rem] border px-3 py-2 w-full lg:w-64'
            />
            <Button onClick={handleSearch} className='h-11 w-11'>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className='text-[1.2rem] border px-3 py-2'
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

      <div className='mt-4 flex flex-col gap-4'>
        {loading ? (
          <span>Buscando órdenes...</span>
        ) : (
          <>
            {orders.length === 0 ? (
              <div className='bg-white p-6 rounded-lg shadow-lg text-center text-gray-500'>
                <h2 className='text-xl font-semibold mb-2'>No se encontraron órdenes.</h2>
                <p>Ajusta el filtro de estado o el término de búsqueda y vuelve a intentarlo.</p>
              </div>
            ) : (
              orders.map((order) => (

                <Card key={order.orderId} className='flex justify-between items-center px-4 py-3'>
                  <div>
                    <h2 className='text-xl font-semibold'>{getShortId(order.orderId)} - {order.customerName}</h2>
                    <p className="text-base">Estado: {mapOrderStatus(order.orderStatus)}</p>
                  </div>
                  <Button
                    className='h-8 w-10'
                    onClick={() => setSelectedOrder(order)}><p className='text-base'>Ver</p></Button>
                </Card>
              ))
            )}
          </>
        )}
      </div>

      <PaginationControls
        pageNumber={pageNumber}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageNumber={setPageNumber}
        setPageSize={setPageSize}
        availableSizes={['3', '5', '10', '15', '20']}
      />
      {selectedOrder && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md mx-4 max-h-[90vh] flex flex-col'>
            <h2 className='text-xl font-bold mb-2'>Detalle de Orden:</h2>
            <p className='text-sm sm:text-base'><strong>Orden ID:</strong> {selectedOrder.orderId}</p>
            <p className='text-sm sm:text-base'><strong>Cliente:</strong> {selectedOrder.customerName}</p>
            <p className='text-sm sm:text-base'><strong>Fecha:</strong> {new Date(selectedOrder.date).toLocaleString()}</p>
            <p className='text-sm sm:text-base'><strong>Dirección:</strong> {selectedOrder.billingAddress}</p>
            <p className='text-sm sm:text-base'><strong>Notas:</strong> {selectedOrder.notes || 'Sin notas'}</p>
            <p className='text-sm sm:text-base'><strong>Estado:</strong> {mapOrderStatus(selectedOrder.orderStatus)}</p>

            <div className='mt-4 flex-grow overflow-y-auto px-2 border-2 rounded '>
              <h3 className='font-semibold mb-2 text-base sm:text-lg'>Items:</h3>
              {selectedOrder.orderItems.map((item, index) => (
                <div key={index} className='mb-2 border-b pb-2'>
                  <p className='text-sm sm:text-base'><strong>Producto:</strong> {item.name }</p>
                  <p className='text-sm sm:text-base'><strong>Producto ID:</strong> {item.productId}</p>
                  <p className='text-sm sm:text-base'><strong>Cantidad:</strong> {item.quantity}</p>
                  <p className='text-sm sm:text-base'><strong>Precio unitario:</strong> ${item.unitPrice}</p>
                </div>
              ))}
            </div>

            <div className='mt-4 text-right flex-shrink-0'>
              <Button onClick={() => setSelectedOrder(null)}><p className='text-sm sm:text-base'>Cerrar</p></Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListOrdersPage;