import { useEffect, useState } from 'react';
import { getActiveProductsPaginated } from '../services/listCustomer';
import CartItem from '../components/CartItem';
import PaginationControls from '../../shared/components/PaginationControls';

function ListProductCustomerPage({ searchTerm }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, pagination, error } = await getActiveProductsPaginated({
        searchTerm: searchTerm,
        pageNumber: pageNumber,
        pageSize: pageSize,
      });

      if (error) throw error;

      setProducts(data);

      // Actualizar la metadata de paginación
      // Guardamos totalItems
      setTotalItems(pagination.totalItems);

      // Calculamos totalPages correctamente
      const calculatedPages = Math.ceil(pagination.totalItems / pageSize);

      setTotalPages(calculatedPages);

    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchProducts();

  }, [pageNumber, pageSize, searchTerm]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full text-center">Cargando productos...</div>
        ) : products.length === 0 && totalItems > 0 ? (
          <div className="col-span-full text-center">No se encontraron productos en esta página.</div>
        ) : products.length === 0 && totalItems === 0 ? (
          <div className="col-span-full text-center">No se encontraron productos que coincidan con la búsqueda.</div>
        ) : (
          products.map((product) => (
            <CartItem key={product.sku || product.id} product={product} />
          ))
        )}
      </div>

      <PaginationControls
        pageNumber={pageNumber}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageNumber={setPageNumber}
        setPageSize={setPageSize}
        availableSizes={['2', '5', '10', '15', '20']}
      />
    </div>
  );
}

export default ListProductCustomerPage;