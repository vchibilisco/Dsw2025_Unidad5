import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

function ProtectedRoute({ children }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  if (role !== 'Admin') {
    return <Navigate
      to='/login'
      state={{ authError: 'No tienes permisos para acceder a esta sección.' }}
    />;
  }

  return children;
};

export default ProtectedRoute;
