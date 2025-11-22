import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

function ProtectedRoute({ children }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  if (role === 'Customer') {
    alert('No tienes permisos para acceder a esta sección');
    return <Navigate to='/' />;
  }

  return children;
};

export default ProtectedRoute;
