import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import useAuth from '../../auth/hook/useAuth';
import UserLoginForm from '../../auth/components/UserLoginForm';
import UserRegisterForm from '../../auth/components/UserRegisterForm';
import { searchCustomerProducts } from '../../products/services/listCustomer';
import { clearCart } from '../../products/Context/cartStorage';

export default function ClientDashboard() {
  const [openMenu, setOpenMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartVersion, setCartVersion] = useState(0);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const { isAuthenticated, signout } = useAuth();
  const navigate = useNavigate();

  const getLinkStyles = ({ isActive }) => (
    `p-2 rounded-4xl transition hover:bg-gray-100 text-sm sm:text-base
     ${isActive ? 'bg-purple-200 hover:bg-purple-100' : ''}`
  );

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    const { stockQuantity } = product;
    const index = cart.findIndex((p) => p.id === product.id);

    if (index >= 0) {
      // El producto ya está en el carrito
      const currentQuantity = cart[index].quantity;

      if (currentQuantity >= stockQuantity) {
        // 1. Evitar añadir si ya está al máximo de stock

        return; // Detiene la función sin modificar el carrito
      }

      // 2. Si no ha alcanzado el límite, suma 1
      cart[index].quantity += 1; 

    } else {
      // El producto NO está en el carrito
      if (stockQuantity <= 0) {
        // Evitar añadir si el stock es cero o negativo

        return;
      }
      // 3. Añadir con cantidad 1
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setCartVersion(v => v + 1);

  };

  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      setLoading(true);
      const { data, error } = await searchCustomerProducts(searchTerm);

      if (error) {

        console.error('Error en búsqueda:', error);
        setSearchResults([]);
      } else {
        setSearchResults(data || []);
        setCartVersion(v => v + 1);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderSessionButtons = (mobile = false) => (
    <div className={`${mobile ? 'flex flex-col w-full gap-3 md:hidden' : 'hidden md:flex gap-2'}`}>
      {isAuthenticated ? (
        <Button className="text-sm px-3 py-1 h-auto min-h-0" onClick={signout}>
          Cerrar sesión
        </Button>
      ) : (
        <>
          <Button onClick={() => setShowLoginModal(true)}
            className={mobile ? 'w-full text-sm py-2 h-auto' : ''}
          >Iniciar Sesión</Button>
          <Button variant="secondary" onClick={() => setShowRegisterModal(true)}
            className={mobile ? 'w-full text-sm py-2 h-auto' : ''}
          >Registrarse</Button>
        </>
      )}
    </div>
  );

  useEffect(() => {
    // 1. Verificar si el usuario está autenticado
    if (isAuthenticated) {
      // 2. Obtener el rol (asumiendo que está en localStorage)
      const userRole = localStorage.getItem('role');

      // 3. Si el rol es 'Admin', redirigir
      if (userRole === 'Admin') {
        // Opcional: Podrías limpiar el carrito aquí si el Admin tiene productos en él
        clearCart();
        navigate('/admin/home');
      }
    }
  }, [isAuthenticated, navigate]);

  const cartMap = JSON.parse(localStorage.getItem('cart') || '[]')
    .reduce((map, item) => {
      map[item.id] = item.quantity;
      return map;
    }, {});

  const renderSearchResultItem = (product) => {
    const currentCartQuantity = cartMap[product.id] || 0;
    const isDisabled = currentCartQuantity >= product.stockQuantity;

    return (
      <div
        key={product.id}
        className="flex justify-between items-center p-2 hover:bg-gray-100 text-sm"
      >
        <span>{product.name}</span>
        <button
          disabled={isDisabled}
          className={`transition rounded text-xs px-2 py-1 
            ${isDisabled 
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
              : 'bg-purple-200 hover:bg-purple-300'
            }`}
          onClick={() => addToCart(product)}
        >
          {isDisabled ? 'Sin Stock' : 'Agregar'}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr] bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 shadow rounded bg-white md:px-6 gap-4 flex-wrap">
        <div className="flex items-center">
          <span className="font-bold text-purple-700 text-lg">Tie</span>
        </div>

        {/* Navegación */}
        <nav className="hidden md:flex justify-center gap-4 text-neutral-950 font-medium ml-auto mr-auto">
          <NavLink to="/" className={getLinkStyles}>Productos</NavLink>
          <NavLink to="/cart" className={getLinkStyles}>Carrito de compras</NavLink>
        </nav>

        {/* Buscador */}
        <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-center gap-2 md:gap-6 px-2">
          <div className="relative w-full max-w-[280px] md:max-w-xs">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-3xl px-3 py-2 pr-10 text-sm md:text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 sm:-translate-y-1/2 -translate-y-[25%]
                p-0 m-0 border-none bg-transparent shadow-none
               text-gray-500 hover:text-blue-600 focus:outline-none"
              onClick={handleSearch}
              aria-label="Buscar"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

            </button>

            {/* Cuadro flotante de resultados */}
            {searchTerm && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                {loading ? (
                  <div className="p-2 text-gray-500 text-sm">Buscando...</div>
                ) : searchResults.length === 0 ? (
                  <div className="p-2 text-gray-500 text-sm">No se encontraron productos</div>
                ) : (
                  searchResults.map(renderSearchResultItem)
                )}
              </div>
            )}
          </div>
        </div>

        {/* Botones de sesión */}
        <div className="flex items-center gap-2">
          {renderSessionButtons()}
        </div>

        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-2xl"
            onClick={() => setOpenMenu(!openMenu)}
          >{openMenu ? <span>&#215;</span> : <span>&#9776;</span>}
          </button>
        </div>
      </header>
      {/* Mobile menu */}
      {openMenu && (
        <nav className="fixed top-0 left-0 h-full w-full max-w-xs md:hidden bg-white shadow px-4 py-2 z-50 flex flex-col">
          <div className='mt-4 flex flex-col gap-2'>
            <NavLink to="/" className={getLinkStyles}>Productos</NavLink>
            <NavLink to="/cart" className={getLinkStyles}>Carrito de compras</NavLink>
          </div>
          <div className='mt-auto'>{renderSessionButtons(true)}</div>
        </nav>
      )}

      {showLoginModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4">

          <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowLoginModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <UserLoginForm
              onSuccess={(action) => {
                if (action === 'register') {
                  setShowLoginModal(false);
                  setShowRegisterModal(true);
                } else {
                  setShowLoginModal(false);
                }
              }}
            />
          </div>
        </div>
      )}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4">
          <div className="w-full max-w-md relative bg-white rounded-lg shadow-lg overflow-y-auto max-h-[90hv] p-6 sm:p-8">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
              onClick={() => setShowRegisterModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className='p-0'>
              <UserRegisterForm
                onSuccess={(action) => {
                  if (action === 'login') {
                    setShowRegisterModal(false);
                    setShowLoginModal(true);
                  } else {
                    setShowRegisterModal(false);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
      {/* Main content */}
      <main className="p-5 overflow-y-scroll">
        <Outlet context={{ cartVersion }}/>
      </main>
    </div>
  );
}