import { createContext, useState } from 'react';
import { login } from '../services/login';
import  register  from '../services/signup';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');

    return Boolean(token);
  });

  const singout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  const singin = async (username, password) => {
    const { data, error } = await login(username, password);

    if (error) {
      return { error };
    }

    localStorage.setItem('token', data);
    setIsAuthenticated(true);

    return { error: null };
  };

  const signup = async(username, email, password, role) => {
    const { user, error } = await register(username, email, password, role);

    if (error) {
      return { error };
    }

    // LÓGICA DE AUTO-LOGIN AL REGISTRARSE
    // 'user' es la respuesta del backend: { Token, CustomerId, Role... }
    
    if (user.Token) { // Ojo con las mayúsculas/minúsculas según tu backend, ajusta si es necesario (user.token)
        localStorage.setItem('token', user.Token);
        setIsAuthenticated(true);
    }

    if (user.CustomerId) {
        localStorage.setItem('customerId', user.CustomerId);
    } else {
        localStorage.removeItem('customerId');
    }

    if (user.Role) {
        localStorage.setItem('role', user.Role);
    }

    return { user, error: null };
  }

  


  return (
    <AuthContext.Provider
      value={ {
        isAuthenticated,
        singin,
        singout,
        signup,
      } }
    >
      {children}
    </AuthContext.Provider>
  );
};

export {
  AuthProvider,
  AuthContext,
};
