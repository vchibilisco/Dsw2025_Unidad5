import { createContext, useState } from 'react';
import { login } from '../services/login';
import { register } from '../services/register';

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

  const signup = async ({ userName, email, password, name, phoneNumber, role }) => {
    const { error } = await register({
      userName,
      email,
      password,
      name,
      phoneNumber,
      role,
    });

    if (error) {
      return { error };
    }

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        singin,
        singout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export {
  AuthProvider,
  AuthContext,
};
