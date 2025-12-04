import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import { getOrdersAdmin, orderStatus } from '../services/listOrder';

function ListOrdersPage() {
  const navigate = useNavigate();

  // 1. CAMBIO: Renombramos el estado para que tenga sentido (antes customerIdFilter)
  const [searchTerm, setSearchTerm] = useState('');
  
  const [status, setStatus] = useState(orderStatus.ALL);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await getOrdersAdmin(status, searchTerm, pageNumber, pageSize);

      if (error) throw error;

      console.log("Datos del back", data);

      setOrders(data.items);
      setTotalItems(data.totalCount);

      

    } catch (error) {
      console.error("Error cargando ordenes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPageNumber(1);
  }, [status, searchTerm]); // Se reinicia si cambias el filtro o la búsqueda

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, pageSize, status]); 
  // Nota: Quitamos searchTerm de aquí para que solo busque al dar Enter o Click en buscar
  // Si prefieres búsqueda en vivo, agrega searchTerm al array de dependencias.

  const handleSearch = () => {
    setPageNumber(1);
    fetchOrders();
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  const getStatusName = (statusCode) => {
    switch(statusCode) {
        case 0: return 'Pendiente';
        case 1: return 'Enviado';
        case 2: return 'Entregado';
        case 3: return 'Cancelado';
        default: return 'Desconocido';
    }
  };

  return (
    <div>
      <Card>
        <div className='flex justify-between items-center mb-3'>
          <h1 className='text-3xl'>Administrar Órdenes</h1>
        </div>

        <div className='flex flex-col sm:flex-row gap-4'>
          {/* 3. CAMBIO: Input de búsqueda por nombre */}
          <div className='flex items-center gap-3 w-full sm:w-1/2'>
            <input 
                value={searchTerm} 
                onChange={(evt) => setSearchTerm(evt.target.value)} 
                type="text" 
                placeholder='Buscar por Nombre del Cliente' 
                className='text-[1rem] p-2 border rounded w-full'
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Búsqueda al dar Enter
            />
            <Button className='h-11 w-11 flex justify-center items-center' onClick={handleSearch}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </div>

          <select 
            onChange={evt => setStatus(evt.target.value)} 
            className='text-[1rem] p-2 border rounded w-full sm:w-1/4'
            value={status}
          >
            <option value={orderStatus.ALL}>Todos los Estados</option>
            <option value={orderStatus.PENDING}>Pendientes</option>
            <option value={orderStatus.SHIPPED}>Enviados</option>
            <option value={orderStatus.DELIVERED}>Entregados</option>
            <option value={orderStatus.CANCELLED}>Cancelados</option>
          </select>
        </div>
      </Card>

      <div className='mt-4 flex flex-col gap-4'>
        {loading ? (
            <div className="text-center p-4">Cargando órdenes...</div>
        ) : orders.length === 0 ? (
            <div className="text-center p-4 text-gray-500">No se encontraron órdenes.</div>
        ) : (
            orders.map(order => {
              // --- 4. CAMBIO: Variables Seguras (incluyendo customerName) ---
              const rawId = order.orderId || order.Id || ''; 
              const displayId = rawId.toString(); 

              // Aquí leemos el nombre que nos manda el backend nuevo
              const customerName = order.customerName || order.CustomerName || 'Cliente Desconocido';

              const date = order.date || order.Date;
              const address = order.shippingAddress || order.ShippingAddress || 'Sin dirección';
              const status = order.status !== undefined ? order.status : order.Status;
              const total = order.totalAmount || order.TotalAmount || 0;
              const items = order.items || order.Items || [];

              return (
                <Card key={displayId} className="hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                      <div>
                          {/* Título Principal: NOMBRE DEL CLIENTE */}
                          <h2 className="text-xl font-bold text-gray-800">
                              {customerName}
                          </h2>
                          
                          {/* Subtítulo: ID de la orden (más pequeño) */}
                          <p className="text-xs text-gray-400 font-mono mb-2">
                              Orden #{displayId.length > 8 ? displayId.substring(0, 8) : displayId}...
                          </p>

                          <p className="text-sm text-gray-500">{formatDate(date)}</p>
                          <p className="mt-1 text-gray-700">
                              <strong>Envío a:</strong> {address}
                          </p>
                          <div className="mt-2 text-sm text-gray-600">
                              {items.length} items comprados
                          </div>
                      </div>
                      
                      <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold 
                              ${status === 0 ? 'bg-yellow-100 text-yellow-800' : 
                                status === 2 ? 'bg-green-100 text-green-800' : 
                                status === 3 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`
                          }>
                              {getStatusName(status)}
                          </span>
                          <p className="text-2xl font-bold text-gray-900 mt-2">
                              ${Number(total).toFixed(2)}
                          </p>
                      </div>
                  </div>
                </Card>
              );
            })
        )}
      </div>

      <div className='flex justify-center items-center mt-6 gap-4'>
        <button
          disabled={pageNumber === 1 || loading}
          onClick={() => setPageNumber(p => p - 1)}
          className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Anterior
        </button>
        
        <span className="font-medium">Página {pageNumber}/ {totalPages || 1}</span>
        
        <button
          disabled={pageNumber >= totalPages || loading}
          onClick={() => setPageNumber(p => p + 1)}
          className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Siguiente
        </button>

        <select
          value={pageSize}
          onChange={evt => {
            setPageNumber(1);
            setPageSize(Number(evt.target.value));
          }}
          className='ml-3 p-2 border rounded'
        >
          <option value="1">1</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
}

export default ListOrdersPage;