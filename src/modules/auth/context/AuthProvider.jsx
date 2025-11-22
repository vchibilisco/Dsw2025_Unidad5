import { createContext, useState } from 'react';
import { login } from '../services/login';
import { register } from '../services/register';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');

    return Boolean(token);
  });

  const [role, setRole] = useState(localStorage.getItem('role'));

  const [customerId, setCustomerId] = useState(localStorage.getItem('customerId'));

  const signout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setRole(null);
    setCustomerId(null);
  };

  const signin = async (username, password) => {
    const { data, error } = await login(username, password);

    if (error) {
      return { error };
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('customerId', data.customerId);

    setIsAuthenticated(true);
    setRole(data.role);
    setCustomerId(data.customerId);

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
        signin,
        signout,
        signup,
        role,
        customerId,

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
