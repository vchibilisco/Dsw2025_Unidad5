import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import { getOrders } from '../services/listServices'; // nuevo servicio

const orderStatus = {
  ALL: '',
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

function ListOrdersPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(orderStatus.ALL);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await getOrders(searchTerm, status, pageNumber, pageSize);
      if (error) throw error;

      setTotal(data.totalCount);      
    setOrders(data.items ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status, pageSize, pageNumber]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <Card>
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-3xl">Órdenes</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3">
            <input
              value={searchTerm}
              onChange={(evt) => setSearchTerm(evt.target.value)}
              type="text"
              placeholder="Buscar"
              className="text-[1.3rem] w-full"
            />
           <Button onClick={fetchOrders} className="h-11 w-11 flex items-center justify-center p-0">
             <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path 
                    d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" 
                    stroke="#000000" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </Button>

          </div>

          <select onChange={(evt) => setStatus(evt.target.value)} className="text-[1.3rem]">
            <option value={orderStatus.ALL}>Todos</option>
            <option value={orderStatus.PENDING}>Pendientes</option>
            <option value={orderStatus.PROCESSING}>Procesadas</option>
            <option value={orderStatus.SHIPPED}>Enviadas</option>
            <option value={orderStatus.DELIVERED}>Entregadas</option>
            <option value={orderStatus.COMPLETED}>Completadas</option>
            <option value={orderStatus.CANCELLED}>Canceladas</option>
          </select>
        </div>
      </Card>

      <div className="mt-4 flex flex-col gap-4">
        {loading ? (
          <span>Cargando órdenes...</span>
        ) : (
          orders.map((order) => (
           <Card key={order.id}>
            <div className="flex justify-between items-center w-full">
              <div>
                <h1>#{order.id} | {order.customerId}</h1>
                <p>Estado: {order.status}</p>
              </div>

              <Button 
                className="hidden sm:flex h-11 w-11 items-center justify-center cursor-default"
              >
                Ver
              </Button>
            </div>
          </Card>
          ))
        )}
      </div>

      <div className="flex justify-center items-center mt-3">
        <button disabled={pageNumber === 1} onClick={() => setPageNumber(pageNumber - 1)}>
          Atrás
        </button>
        <span>{pageNumber} / {totalPages}</span>
        <button disabled={pageNumber === totalPages} onClick={() => setPageNumber(pageNumber + 1)}>
          Siguiente
        </button>

        <select
          value={pageSize}
          onChange={(evt) => {
            setPageNumber(1);
            setPageSize(Number(evt.target.value));
          }}
        >
          <option value="2">2</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
}

export default ListOrdersPage;

