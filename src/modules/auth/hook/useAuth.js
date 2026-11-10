import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    new Error('useAuth no debe ser usado por fuera de AuthProvider');
  }

  return {
    isAuthenticated: context.isAuthenticated,
    singin: context.singin,
    singout: context.singout,
    signup: context.signup,
    signupUser: context.signupUser,
  };

};

export default useAuth;
