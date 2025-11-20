import { useEffect, useState } from 'react';
import { getCustomerProducts } from '../services/listCustomer';
import CartItem from './CartItem';


function ListProductCustomer({ searchTerm }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes((searchTerm || '').toLowerCase())
    );


    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await getCustomerProducts();
            if (error) throw error;

            const activos = Array.isArray(data)
                ? data.filter(p => p.isActive && p.name && typeof p.currentUnitPrice === 'number')
                : [];

            setProducts(activos);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="p-4">


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? (
                    <div className="col-span-full text-center">Cargando productos...</div>
                ) : filtered.length === 0 ? (
                    <div className="col-span-full text-center">No se encontraron productos que coincidan con la búsqueda.</div>
                ) : (
                    filtered.map((product) => (
                        <CartItem key={product.sku || product.id || product.name} product={product} />
                    ))
                )}
            </div>
        </div>
    );
}

export default ListProductCustomer;