import { createContext, useState, useContext } from 'react'; // ¡Añadir useContext!
import { login } from '../services/login';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Si tu login devuelve el customerId, también deberías guardarlo aquí.
    const token = localStorage.getItem('token'); 
    return Boolean(token);
  });

  const singout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  const singin = async (username, password) => {
    // Asumo que 'login' en '../services/login' retorna el token y quizás el customerId
    const { data, error } = await login(username, password); 

    if (error) {
      return { error };
    }
    
    // Aquí podrías guardar más datos si el token o el data lo incluye (ej: customerId)
    localStorage.setItem('token', data);
    setIsAuthenticated(true);

    return { error: null };
  };

  // Aquí se define el objeto 'user' que se usará en CheckoutPage, simulando
  // el customerId que necesita el payload de la orden.
  const user = {
    isAuthenticated,
    // Deberías simular o cargar el customerId si lo necesitas:
    customerId: localStorage.getItem('customerId'), // Asume que lo guardaste al loguear
  };

  return (
    <AuthContext.Provider
      value={ {
        // Pasa todo el estado y funciones necesarias
        user, // Pasa el objeto user/isAuthenticated
        singin,
        singout,
        token: localStorage.getItem('token'), // Pasa el token directo
      } }
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export {
  AuthProvider,
  AuthContext,
};