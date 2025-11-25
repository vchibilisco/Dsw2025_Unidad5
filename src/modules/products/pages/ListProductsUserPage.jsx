import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import { getClientProducts } from '../services/listUser';
import { useCart } from "../../shared/hooks/useCart";
import SearchBar from "../../shared/components/SearchBar";

function ListProductsUserPage() {
    const defaultProductImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXp7vG6vsG3u77s8fTCxsnn7O/f5OfFyczP09bM0dO8wMPk6ezY3eDd4uXR1tnJzdBvAX/cAAACVElEQVR4nO3b23KDIBRA0ShGU0n0//+2KmO94gWZ8Zxmr7fmwWEHJsJUHw8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwO1MHHdn+L3rIoK6eshsNJ8kTaJI07fERPOO1Nc1vgQm2oiBTWJ+d8+CqV1heplLzMRNonED+4mg7L6p591FC+133/xCRNCtd3nL9BlxWP++MOaXFdEXFjZ7r8D9l45C8y6aG0cWtP/SUGhs2d8dA/ZfGgrzYX+TVqcTNRRO9l+fS5eSYzQs85psUcuzk6igcLoHPz2J8gvzWaH/JLS+95RfOD8o1p5CU5R7l5LkfKEp0mQ1UX7hsVXqDpRrifILD/3S9CfmlUQFhQfuFu0STTyJ8gsP3PH7GVxN1FC4t2sbBy4TNRTu7LyHJbqaqKFw+/Q0ncFloo7CjRPwMnCWqKXQZ75El4nKC9dmcJaou9AXOE5UXbi+RGeJygrz8Uf+GewSn9uXuplnWDZJ7d8f24F/s6iq0LYf9olbS3Q8i5oKrRu4S9ybwaQ/aCkqtP3I28QDgeoK7TBya/aXqL5COx67PTCD2grtdOwH+pQV2r0a7YVBgZoKwwIVFQYG6ikMDVRTGByopjD8ATcKb0UhhRTe77sKs2DV7FKSjId18TUEBYVyLhUThWfILHTDqmI85/2RWWjcE/bhP6OD7maT3h20MHsA47JC3PsW0wcwLhv9t0OOPOIkCn21y2bXXwlyylxiYMPk1SuCSmpfK8bNQvIrpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwNX4BCbAju9/X67UAAAAASUVORK5CYII=";

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('enabled');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  // useCart (solo una vez)
  const { cart, addToCart } = useCart();

  // cantidad por SKU
  const [quantities, setQuantities] = useState({});

  // menú carrito móvil
  const [openCartMenu, setOpenCartMenu] = useState(false);
  const totalItems = cart.reduce((acc, p) => acc + p.quantity, 0);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await getClientProducts(
        searchTerm,
        status,
        pageNumber,
        pageSize
      );

      if (error) throw error;

      setTotal(data.total);
      setProducts(data.productItems);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [status, pageSize, pageNumber]);

  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = async () => {
    await fetchProducts();
  };

  return (
    <div>
      <Card><div className="flex justify-between items-center mb-3">

        {/* IZQUIERDA — Productos */}
        <h1 className="text-3xl">Productos</h1>

        {/* BUSCADOR DESKTOP */}
        <div className="hidden sm:flex flex-1 px-6">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearch}
          />
        </div>

        {/* BUSCADOR MOBILE */}
        <div className="sm:hidden w-full">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearch}
          />
        </div>

        {/* DERECHA — Carrito + Sesión escritorio */}
        <div className="hidden sm:flex items-center gap-3">
            <Button onClick={() => navigate("/cart")}>
            Carrito ({totalItems})
            </Button>
            <Button>Iniciar Sesión</Button>
            <Button>Registrarse</Button>
        </div>

           {/* BOTÓN MENU MOBILE */}
          <Button className="sm:hidden h-8 w-8 p-1 flex items-center justify-center" onClick={() => setOpenCartMenu(true)}>≡
          </Button>
        </div>
      </Card>

        {/* PANEL CARRITO MOBILE */}
        <div
          className={`
            fixed top-0 right-0 h-full w-64 bg-white shadow-lg p-6
            transition-transform duration-300
            z-50
            ${openCartMenu ? "translate-x-0" : "translate-x-full"}
            sm:hidden
          `}
        >
          <h2 className="text-xl mb-4">Carrito</h2>

          <Button
            className="text-xl mt-4 w-full"
            onClick={() => {
              setOpenCartMenu(false);
              navigate("/cart");
            }}
          >
            Ver carrito ({totalItems})
          </Button>

          <Button className="text-xl mt-4 w-full" onClick={() => setOpenCartMenu(false)}>
            Iniciar Sesión
          </Button>

          <Button className="text-xl mt-4 w-full" onClick={() => setOpenCartMenu(false)}>
            Registrarse
          </Button>

          <Button className="text-xl mt-4 w-full" onClick={() => setOpenCartMenu(false)}>
            Cerrar ✘
          </Button>
        </div>


      {/* LISTA DE PRODUCTOS */}
      <div className="mt-4
    flex flex-col gap-4
    sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          <span>Buscando productos...</span>
        ) : (
          products.map((product) => {
            const qty = quantities[product.sku] || 1;

            return (
              <Card key={product.sku} className="flex flex-col">

                <img
                    src={defaultProductImage}
                    alt={product.name}
                    className="w-full h-40 object-contain mb-3 rounded"
                />

                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="ext-gray-600 mt-1 text-sm sm:text-base">
                  Stock: {product.stockQuantity} – ${product.currentUnitPrice}
                </p>

                {/* Controles cantidad */}
                <div className="flex items-center gap-4 mt-3">

                  {/* ➖ */}
                  <Button
                    className="px-2 py-1 text-sm sm:px-3 sm:py-2 sm:text-base"
                    onClick={() =>
                      setQuantities(prev => ({
                        ...prev,
                        [product.sku]: Math.max(1, qty - 1)
                      }))
                    }
                  >
                    ➖
                  </Button>

                  {/* Cantidad */}
                  <span className="w-8 text-center text-lg font-semibold">
                    {qty}
                  </span>

                  {/* ➕ */}
                  <Button
                    className="px-2 py-1 text-sm sm:px-3 sm:py-2 sm:text-base"
                    onClick={() =>
                      setQuantities(prev => ({
                        ...prev,
                        [product.sku]: Math.min(product.stockQuantity, qty + 1)
                      }))
                    }
                  >
                    ➕
                  </Button>

                  {/* AGREGAR */}
                  <Button 
                  className="ml-50 sm:ml-5 text-sm px-4 py-2 sm:text-base"
                  onClick={() => addToCart(product, qty)}>
                    Agregar
                  </Button>

                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center mt-3">
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          className="bg-gray-200 disabled:bg-gray-100 text-sm px-4 py-2 sm:text-base"
        >
          Atras
        </button>

        <span className="w-8 text-base sm:w-8 sm:text-lg font-semibold">{pageNumber} / {totalPages}</span>

        <button
          disabled={pageNumber === totalPages}
          onClick={() => setPageNumber(pageNumber + 1)}
          className="bg-gray-200 disabled:bg-gray-100 text-sm px-4 py-2 sm:text-base"
        >
          Siguiente
        </button>

        <select
          value={pageSize}
          onChange={(evt) => {
            setPageNumber(1);
            setPageSize(Number(evt.target.value));
          }}
          className="ml-3 w-20 text-base sm:w-8 sm:text-lg font-semibold"
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

export default ListProductsUserPage;
