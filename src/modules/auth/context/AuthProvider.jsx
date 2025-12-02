import { createContext, useState, useContext } from 'react';
import { login } from '../services/login';

const AuthContext = createContext();

// Función que carga el estado inicial desde localStorage al iniciar la app
const loadInitialState = () => {
    const token = localStorage.getItem('token');
    const customerId = localStorage.getItem('customerId');
    
    return {
        isAuthenticated: Boolean(token && customerId),
        token: token,
        customerId: customerId,
    };
};

function AuthProvider({ children }) {
    // Usamos un estado que consolida toda la información de Auth
    const [authState, setAuthState] = useState(loadInitialState);

    const singout = () => {
        // Limpiar todas las claves relevantes al cerrar sesión
        localStorage.removeItem('token');
        localStorage.removeItem('customerId');
        
        setAuthState({
            isAuthenticated: false,
            token: null,
            customerId: null,
        });
    };

    const singin = async (username, password) => {
        // La función login (en login.js) DEBE devolver { data: { token, customerId }, error }
        const { data, error } = await login(username, password); 

        if (error) {
            return { error };
        }
        
        // Guardar token y customerId (extraído del JWT en login.js)
        localStorage.setItem('token', data.token);
        localStorage.setItem('customerId', data.customerId); 

        setAuthState({
            isAuthenticated: true,
            token: data.token,
            customerId: data.customerId,
        });

        return { error: null };
    };

    // Objeto 'user' para el consumo fácil en componentes como CheckoutPage
    const user = {
        customerId: authState.customerId,
    };

    return (
        <AuthContext.Provider
            value={ {
                isAuthenticated: authState.isAuthenticated,
                user, // { customerId: '...' }
                token: authState.token, // 'abc.123.xyz'
                singin,
                singout,
            } }
        >
            {children}
        </AuthContext.Provider>
    );
}


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