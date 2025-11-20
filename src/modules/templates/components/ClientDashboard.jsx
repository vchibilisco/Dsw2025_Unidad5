import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Button from '../../shared/components/Button';
import useAuth from '../../auth/hook/useAuth';
import { useNavigate } from 'react-router-dom';
import ListProductCustomer from '../../products/components/ListProductCustomer';

export default function ClientDashboard() {
  const [openMenu, setOpenMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  const { singout } = useAuth();

  const logout = () => {
    singout();
    navigate('/login');
  };
  const register = () => {
    navigate('/register');
  };

  const getLinkStyles = ({ isActive }) => (
    `
      p-2 rounded-4xl  transition hover:bg-gray-100 text-sm sm:text-base
      ${isActive ? 'bg-purple-200 hover:bg-purple-100' : ''}
    `
  );

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderSessionButtons = (mobile = false) => (
    <div className={`${mobile ? 'flex flex-col w-full gap-3 md:hidden' : 'hidden md:flex gap-2'}`}>
      <Button className="text-sm px-3 py-1 h-auto min-h-0" onClick={logout}>Iniciar Sesión</Button>
      <Button className="text-sm px-3 py-1 h-auto min-h-0" variant="secondary" onClick={register}>Registrarse</Button>
    </div>
  );

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr] bg-gray-50 ">
      {/* Header */}
      <header className="flex items-center justify-between p-4 shadow rounded bg-white md:px-6 gap-4 flex-wrap">
        {/* Logo */}
        <div className="flex items-center">
          <span className="font-bold text-purple-700 text-lg">Tie</span>
        </div>
      
        {/* Navegación (solo visible en sm+) */}
        <nav className="hidden md:flex justify-center gap-4 text-neutral-950 font-medium ml-auto mr-auto">
          <NavLink to="/" className={getLinkStyles}>Productos</NavLink>
          <NavLink to="/cart" className={getLinkStyles}>Carrito de compras</NavLink>
        </nav>

        <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-center gap-2 md:gap-6 px-2">
          <div className="relative w-full max-w-[280px] md:max-w-xs">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-3xl px-3 py-2 pr-10 text-sm md:text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 mt-[5px] sm:mt-[0px]
              flex items-center justify-center
              w-5 h-5 md:w-6 md:h-6
            text-black hover:text-blue-600
              bg-transparent border-0 p-0 m-0
              outline-none focus:outline-none focus:ring-0 shadow-none"
              onClick={() => console.log('Buscar:', searchTerm)}
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

      {/* Main content */}
      <main className="p-5 overflow-y-scroll">
        {searchTerm
          ? <ListProductCustomer searchTerm={searchTerm} />
          : <Outlet />}
      </main>

    </div>
  );
}