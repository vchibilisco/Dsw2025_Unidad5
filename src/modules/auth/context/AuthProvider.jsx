import { createContext, useState } from 'react';
import { login } from '../services/login';
import { register as registerService } from '../services/register';

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

    localStorage.setItem('token', data.token);
    setIsAuthenticated(true);

    return { error: null };
  };

  const register = async (username, password, email, role) => {
    const { error } = await registerService(username, password, email, role);

    if (error) {
      return { error };
    }

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={ {
        isAuthenticated,
        singin,
        singout,
        register,
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
