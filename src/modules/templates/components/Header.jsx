import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import Button from '../../shared/components/Button';

function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [ searchTerm, setSearchTerm ] = useState('');

  const navigate = useNavigate();

  const { singin } = useAuth();
  
  const login = () => {
    navigate('/login')
  }

  //const { singout } = useAuth();

  /*const logout = () => {
    singout();
    navigate('/login');
  };*/

  /*const renderLogoutButton = (mobile = false) => (
    <Button className={`${mobile ? 'block w-full sm:hidden' :  'hidden sm:block' }`} onClick={logout}>Cerrar sesión</Button>
  );*/

  const getLinkStyles = ({ isActive }) => (
    `
      pl-4 w-full block  pt-4 pb-4 rounded-4xl transition hover:bg-gray-100
      ${isActive
      ? 'bg-purple-200 hover:bg-purple-100 '
      : ''
    }
    `
  );

  return (
    <div
    >
      <header
        className="
          flex
          items-center
          justify-between
          p-4
          shadow
          rounded
          bg-white

          sm:col-span-2
        "
      >
        <NavLink
            to='/'
            className={getLinkStyles}
        >Product</NavLink>

        <NavLink
            to='/cart'
            className={getLinkStyles}
        >Carrrito de Compras</NavLink>

        <input value={searchTerm} onChange={(evt) => setSearchTerm(evt.target.value)} type="text" placeholder='Buscar' className='text-[1.3rem] w-full' />


        
        {renderLogoutButton()}
        <button
          className="
            bg-transparent
            border-none
            shadow-none

            sm:hidden
          "
          onClick={() => setOpenMenu(!openMenu)}
        >{ openMenu ? <span>&#215;</span> : <span>&#9776;</span>}</button>

      </header>
      <Outlet />
    </div>
  );
};

export default Header;