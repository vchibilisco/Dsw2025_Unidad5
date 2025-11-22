import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth no debe ser usado por fuera de AuthProvider');
  }

  return {
    isAuthenticated: context.isAuthenticated,
    signin: context.signin,
    signout: context.signout,
    signup: context.signup,
    role: context.role,
    customerId: context.customerId,
  };

};

export default useAuth;
