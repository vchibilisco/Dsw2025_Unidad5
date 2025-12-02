import { createContext, useState, useContext } from 'react';
import { login } from '../services/login';
// Se asume que register es un default export, si es un named export, usar { register }
import register from '../services/signup'; 

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
    // Estado que consolida la información de autenticación
    const [authState, setAuthState] = useState(loadInitialState);

    const singout = () => {
        // Limpiar las claves al cerrar sesión
        localStorage.removeItem('token');
        localStorage.removeItem('customerId');
        
        setAuthState({
            isAuthenticated: false,
            token: null,
            customerId: null,
        });
    };

    const singin = async (username, password) => {
        // La función login DEBE devolver { data: { token, customerId }, error }
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

    // Función para el registro de nuevos usuarios
    const signup = async(formData) =>{ // Recibe un objeto con todos los datos
        // Se asume que register en signup.js maneja la llamada a la API
        const { user, error } = await register(formData);

        if (error) {
            return { error };
        }
        
        // No logueamos al usuario automáticamente, solo devolvemos éxito
        return { user, error: null }; 
    }

    // Objeto 'user' para consumo fácil (CheckoutPage usa user.customerId)
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
                signup, // <--- FUNCIÓN DE REGISTRO AÑADIDA
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