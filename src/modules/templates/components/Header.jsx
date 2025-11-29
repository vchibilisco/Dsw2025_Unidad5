import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
// Eliminamos la importación que causa el error.
// import useAuth from '../../auth/hook/useAuth'; 

// --- SIMULACIÓN TEMPORAL DE useAuth ---
// Esto es para que el componente compile mientras trabajas en tu entorno.
const useAuth = () => {
    // Leemos el rol/token que el mock login puso en localStorage
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    return {
        user: token ? { role: role || 'Client' } : null,
        logout: () => {
            // Lógica de cierre de sesión simulada
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
        }
    };
};
// ----------------------------------------

function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  // Usamos la simulación temporal
  const { user, logout } = useAuth(); 

  const handleLogout = () => {
    logout(); // Llama a la función que limpia localStorage
    navigate('/login');
  };
  
  // Función de estilo para NavLink
  const getLinkStyles = ({ isActive }) => (
    `
      text-gray-700 hover:text-blue-600 transition duration-150 p-2 
      ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : ''}
    `
  );

  const renderAuthButtons = () => {
    // Si el usuario está logueado
    if (user) {
      return (
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 transition"
        >
          Cerrar Sesión
        </button>
      );
    }
    
    // Si el usuario no está logueado
    return (
        <Link 
            to="/login" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
        >
            Iniciar Sesión
        </Link>
    );
  };
  
  return (
    <header
        className="
          flex
          items-center
          justify-between
          p-4
          mx-auto max-w-7xl
          shadow-md
          bg-white
          sticky top-0 z-50
        "
      >
        {/* Lado Izquierdo: Logo y Navegación */}
        <div className="flex items-center gap-6">
            <Link 
                to='/' 
                className="text-2xl font-extrabold text-blue-600"
            >
                TechTPI
            </Link>

            {/* Navegación - Solo en escritorio */}
            <nav className='hidden sm:flex space-x-6'>
                <NavLink to='/' className={getLinkStyles}>
                    Catálogo
                </NavLink>
                <NavLink to='/cart' className={getLinkStyles}>
                    Carrito de Compras
                </NavLink>
            </nav>
        </div>
        
        {/* Lado Derecho: Búsqueda y Auth */}
        <div className="flex items-center gap-4">
            
            {/* Campo de Búsqueda - Solo visible en escritorio */}
            <input 
                value={searchTerm} 
                onChange={(evt) => setSearchTerm(evt.target.value)} 
                type="text" 
                placeholder='Buscar productos...' 
                className='hidden lg:block text-base p-2 border border-gray-300 rounded-lg w-64 focus:ring-blue-500' 
            />

            {/* Botones de Auth/Logout */}
            <div className="hidden sm:block">
                {renderAuthButtons()}
            </div>

            {/* Botón de Menú Móvil */}
            <button
              className="sm:hidden text-2xl text-gray-700"
              onClick={() => setOpenMenu(!openMenu)}
            >
              {openMenu ? <span>&#215;</span> : <span>&#9776;</span>}
            </button>
        </div>
        
        {/* Menú Desplegable Móvil - Fuera del div principal para posicionamiento */}
        {openMenu && (
            <div className="absolute top-16 left-0 w-full bg-white shadow-xl p-4 sm:hidden border-t">
                <nav className="flex flex-col gap-3 mb-4">
                    <NavLink to='/' className="text-gray-700 hover:text-blue-600 p-2 border-b" onClick={() => setOpenMenu(false)}>Catálogo</NavLink>
                    <NavLink to='/cart' className="text-gray-700 hover:text-blue-600 p-2 border-b" onClick={() => setOpenMenu(false)}>Carrito</NavLink>
                    {/* Botón de Auth/Logout para móvil */}
                    <div className="mt-2">
                        {renderAuthButtons()}
                    </div>
                </nav>
            </div>
        )}

    </header>
  );
};

export default Header;
