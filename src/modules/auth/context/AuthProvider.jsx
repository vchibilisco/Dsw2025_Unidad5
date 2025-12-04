import { createContext, useState } from 'react';
import { login } from '../services/login';
import  register  from '../services/signup';
import { registerUser } from '../services/signupUser';

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

    if (data.token){
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
    }

    if (data.customerId){
      localStorage.setItem('customerId', data.customerId);
    } else {
      localStorage.removeItem('customerId'); // Limpiar si es Admin
    }
    
    if (data.role){
      localStorage.setItem('role', data.role);
    }

    return { error: null };
  };
  
  const signupUser = async(username, email, password) =>{
    const { user, error } = await registerUser(username, email, password);

    if (error) {
      return { error };
    }

    const token = user.token || user.Token;
    const customerId = user.customerId || user.CustomerId;

    const role = user.role || user.Role || 'User'; 

    if (token) {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    }

     if (customerId) {
        localStorage.setItem('customerId', customerId);
    }

    localStorage.setItem('role', role);

    return { user, error: null };
  }

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

    if (user.customerId) {
        localStorage.setItem('customerId', user.customerId);
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
        signupUser,
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
