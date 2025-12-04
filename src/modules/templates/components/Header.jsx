import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { LogIn, UserPlus, LogOut, Search, Menu, X } from "lucide-react"; // Iconos opcionales para mejorar UI

// 1. IMPORTANTE: Importar el hook REAL y los Modales
import useAuth from '../../auth/hook/useAuth';
import LoginModal from '../../shared/components/LoginModal';
import RegisterModal from '../../shared/components/registerModal';

function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para manejar los modales ('none', 'login', 'register')
  const [activeModal, setActiveModal] = useState('none');

  const navigate = useNavigate();

  // Usamos el hook real. Extraemos isAuthenticated para saber si mostrar botones de auth
  const { isAuthenticated, singout, user } = useAuth(); 

  const handleLogout = () => {
    singout();
    setOpenMenu(false);
    navigate('/');
  };
  
  // Función que se ejecuta cuando el modal termina o se cierra
  const handleModalClose = () => {
    setActiveModal('none');
    navigate('/'); // <-- REQUISITO: Redirigir a Home al terminar
  };

  const getLinkStyles = ({ isActive }) => (
    `
      text-gray-700 hover:text-blue-600 transition duration-150 p-2 
      ${isActive ? 'text-blue-600 border-b-2 border-blue-600' : ''}
    `
  );

  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600 hidden lg:block">
                Hola, {user?.role || 'Usuario'}
            </span>
            <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 transition"
            >
            <LogOut size={18} />
            <span className="hidden md:inline">Salir</span>
            </button>
        </div>
      );
    }
    
    // Si NO está logueado, mostramos botones que abren Modales
    return (
        <div className="flex items-center gap-2">
            <button 
                onClick={() => setActiveModal('login')} 
                className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md font-semibold transition"
            >
                <LogIn size={18} />
                <span>Ingresar</span>
            </button>
            <button 
                onClick={() => setActiveModal('register')} 
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
            >
                <UserPlus size={18} />
                <span className="hidden md:inline">Registrarse</span>
            </button>
        </div>
    );
  };
  
  return (
    <>
        <header
            className="
            flex
            items-center
            justify-between
            p-4
            mx-auto max-w-7xl
            shadow-md
            bg-white
            sticky top-0 z-40
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
                
                {/* Campo de Búsqueda */}
                <div className="relative hidden lg:block">
                    <input 
                        value={searchTerm} 
                        onChange={(evt) => setSearchTerm(evt.target.value)} 
                        type="text" 
                        placeholder='Buscar productos...' 
                        className='text-base pl-8 pr-2 py-2 border border-gray-300 rounded-lg w-64 focus:ring-blue-500 focus:border-blue-500 outline-none' 
                    />
                    <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
                </div>

                {/* Botones de Auth/Logout */}
                <div className="hidden sm:block">
                    {renderAuthButtons()}
                </div>

                {/* Botón de Menú Móvil */}
                <button
                className="sm:hidden text-gray-700"
                onClick={() => setOpenMenu(!openMenu)}
                >
                {openMenu ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>
            
            {/* Menú Desplegable Móvil */}
            {openMenu && (
                <div className="absolute top-16 left-0 w-full bg-white shadow-xl p-4 sm:hidden border-t z-50">
                    <nav className="flex flex-col gap-3 mb-4">
                        <NavLink to='/' className="text-gray-700 hover:text-blue-600 p-2 border-b" onClick={() => setOpenMenu(false)}>Catálogo</NavLink>
                        <NavLink to='/cart' className="text-gray-700 hover:text-blue-600 p-2 border-b" onClick={() => setOpenMenu(false)}>Carrito</NavLink>
                        
                        {/* Botón de Auth para móvil */}
                        <div className="mt-4 flex justify-center">
                            {renderAuthButtons()}
                        </div>
                    </nav>
                </div>
            )}
        </header>

        {/* --- INSERCIÓN DE MODALES --- */}
        {/* Usamos handleModalClose para que al cerrar/terminar redirija a '/' */}
        
        {activeModal === 'login' && (
            <LoginModal 
                onClose={handleModalClose} 
                onSwitchToRegister={() => setActiveModal('register')} 
            />
        )}

        {activeModal === 'register' && (
            <RegisterModal 
                onClose={handleModalClose} 
                onSwitchToLogin={() => setActiveModal('login')} 
            />
        )}
    </>
  );
};

export default Header;