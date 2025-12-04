import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { X, LogIn } from "lucide-react";
import useAuth from "../../auth/hook/useAuth"; // Ajusta la ruta según tu estructura

const LoginModal = ({ onClose, onSwitchToRegister }) => {
  const navigate = useNavigate();
  const { singin } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const { error } = await singin(data.email, data.password);

    if (error) {
       if (typeof error === 'string') setErrorMessage(error);
       else if (error.frontendErrorMessage) setErrorMessage(error.frontendErrorMessage);
       else setErrorMessage("Error de credenciales");
       return;
    }

    // Login exitoso
    // No siempre queremos redirigir al checkout si venimos del Header, 
    // pero por ahora lo dejamos o puedes hacerlo opcional con una prop.
    onClose(); 
    // navigate("/checkout"); // Opcional: solo si quieres forzar navegación
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
            <X size={24} />
        </button>
        
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <LogIn size={20} /> Inicia Sesión
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario / Email</label>
            <input
              type="text"
              {...register("email", { required: "Usuario requerido" })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
             {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              {...register("password", { required: "Contraseña requerida" })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Ingresar
          </button>
          
          {errorMessage && <p className="text-red-500 text-center mt-2 text-sm">{errorMessage}</p>}
        </form>
        
        <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">¿No tienes cuenta? </span>
            <span 
                className="text-sm text-blue-600 font-bold cursor-pointer hover:underline"
                onClick={onSwitchToRegister}
            >
                Regístrate aquí
            </span>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;