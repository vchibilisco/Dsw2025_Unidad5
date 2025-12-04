import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { X, UserPlus } from "lucide-react";
import useAuth from "../../auth/hook/useAuth"; // <--- 1. Importar el hook

const RegisterModal = ({ onClose, onSwitchToLogin }) => {
  // 2. Extraemos signupUser del contexto
  const { signupUser } = useAuth(); 
  
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (formData) => {
    setErrorMessage(''); // Limpiar errores previos

    // 3. Llamamos a la función del AuthProvider
    // formData.username, formData.email, formData.password vienen de los inputs
    const { error } = await signupUser(formData.username, formData.email, formData.password);

    if (error) {
        // Manejo robusto de errores (Array de Identity o String simple)
        if (Array.isArray(error)) {
             // Si el backend devuelve una lista de errores (ej. "Password require non alphanumeric")
             setErrorMessage(error.map(e => e.description || e.code).join(', '));
        } else if (typeof error === 'object') {
             setErrorMessage(error.message || JSON.stringify(error));
        } else {
             setErrorMessage(error || "Error al registrar el usuario.");
        }
        return;
    }

    // SI LLEGAMOS ACÁ: ÉXITO
    // No hace falta redirigir manualmente ni guardar token, 
    // signupUser en AuthProvider ya hizo setIsAuthenticated(true).
    
    alert("¡Cuenta creada con éxito!");
    onClose(); // Cerramos el modal y el usuario ya verá su sesión iniciada en el Header
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl relative">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
            <X size={24} />
        </button>
        
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <UserPlus size={20} /> Crear Cuenta
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* USERNAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario</label>
            <input
              type="text"
              {...register("username", { required: "El usuario es requerido" })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Ej: juanperez"
            />
             {errors.username && <span className="text-red-500 text-xs">{errors.username.message}</span>}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register("email", { 
                  required: "El email es requerido", 
                  pattern: { value: /^\S+@\S+$/i, message: "Ingresa un email válido" } 
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="juan@ejemplo.com"
            />
             {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              {...register("password", { 
                  required: "La contraseña es requerida", 
                  minLength: { value: 6, message: "Mínimo 6 caracteres" } 
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="******"
            />
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
          </div>

          <button 
            type="submit" 
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Registrarse
          </button>
          
          {/* MENSAJE DE ERROR */}
          {errorMessage && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center border border-red-200 mt-2">
                {errorMessage}
            </div>
          )}
        </form>
        
        <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">¿Ya tienes cuenta? </span>
            <span 
                className="text-sm text-blue-600 font-bold cursor-pointer hover:underline"
                onClick={onSwitchToLogin}
            >
                Inicia Sesión
            </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;