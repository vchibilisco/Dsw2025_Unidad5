import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "./useCart"; 
import { useForm } from "react-hook-form"; 
import { Trash2, Minus, Plus, ShoppingCart, Package, X, LogIn } from "lucide-react";

// IMPORTANTE: Importar tu hook real de autenticación
import useAuth from "../auth/hook/useAuth"; 

// --- Componente Fila del Carrito (Lo dejamos igual) ---
const CartItemRow = ({ item, updateQuantity, removeFromCart }) => {
  const subtotal = item.currentUnitPrice * item.quantity;

  return (
    <tr className="flex flex-wrap border-b hover:bg-gray-50 mb-4 p-4 rounded-lg shadow-sm sm:table-row sm:p-0 sm:shadow-none sm:mb-0">
      <td className="p-0 pb-2 flex items-center w-full sm:p-4 sm:w-auto sm:table-cell">
        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
          <Package size={20} className="text-gray-500" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-800">{item.name}</p>
          <p className="text-sm text-gray-500 sm:hidden">
            Precio: ${item.currentUnitPrice.toFixed(2)}
          </p>
        </div>
      </td>
      <td className="p-4 text-center hidden sm:table-cell">
        ${item.currentUnitPrice.toFixed(2)}
      </td>
      <td className="p-0 sm:p-4 w-1/2 sm:w-auto sm:table-cell">
        <div className="flex items-center justify-start sm:justify-center space-x-2 w-full sm:w-auto">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="p-1 border rounded-md text-gray-600 hover:bg-gray-100 transition"
            disabled={item.quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <span className="font-medium w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="p-1 border rounded-md text-gray-600 hover:bg-gray-100 transition"
          >
            <Plus size={16} />
          </button>
        </div>
      </td>
      <td className="p-0 sm:p-4 w-1/2 sm:w-auto sm:table-cell text-right sm:text-right font-bold text-gray-900">
        <span className="sm:hidden font-medium text-gray-600">Total: </span>$
        {subtotal.toFixed(2)}
      </td>
      <td className="p-0 pt-2 w-full sm:w-auto sm:p-4 sm:table-cell text-right sm:text-center">
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-500 hover:text-red-700 transition"
        >
          <Trash2 size={20} />
        </button>
      </td>
    </tr>
  );
};

// --- Modal de Login (Conectado al Auth Real) ---
const LoginModal = ({ onClose }) => {
  const navigate = useNavigate();
  // Usamos el hook real de auth
  const { singin } = useAuth(); 
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // 1. Llamamos al backend real
    const { error } = await singin(data.email, data.password);

    if (error) {
       // Manejo de error visual
       if (typeof error === 'string') setErrorMessage(error);
       else if (error.frontendErrorMessage) setErrorMessage(error.frontendErrorMessage);
       else setErrorMessage("Error de credenciales");
       return;
    }

    // 2. Si login es exitoso:
    alert("Login exitoso. Redirigiendo al checkout...");
    onClose(); 
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl relative">
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
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
              className="w-full px-4 py-2 border rounded-lg"
            />
             {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              {...register("password", { required: "Contraseña requerida" })}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Ingresar y Continuar
          </button>
          
          {errorMessage && <p className="text-red-500 text-center mt-2">{errorMessage}</p>}
        </form>
        
        <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">¿No tienes cuenta? </span>
            <span 
                className="text-sm text-blue-600 font-bold cursor-pointer hover:underline"
                onClick={() => { onClose(); navigate('/signup'); }}
            >
                Regístrate aquí
            </span>
        </div>
      </div>
    </div>
  );
};

// --- Componente Principal Cart ---
const Cart = () => {
  const { cartItems, cartTotal, clearCart, updateQuantity, removeFromCart } = useCart();
  
  // Usamos isAuthenticated del hook real
  const { isAuthenticated } = useAuth(); 
  
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const totalItems = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems]
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    // LOGICA: Si NO está autenticado, abrir modal. Si SÍ, ir a checkout.
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    navigate("/checkout");
  };

  // Renderizado de carrito vacío
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-lg m-4">
        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
        <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tu Carrito de Compras</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Tabla */}
        <div className="lg:w-3/4 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
           {/* ... Misma tabla que tenías antes ... */}
           <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 hidden sm:table-header-group">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-600">Producto</th>
                  <th className="p-4 text-center font-semibold text-gray-600 hidden sm:table-cell">Precio</th>
                  <th className="p-4 text-center font-semibold text-gray-600">Cantidad</th>
                  <th className="p-4 text-right font-semibold text-gray-600">Subtotal</th>
                  <th className="p-4 text-center font-semibold text-gray-600">Eliminar</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 block sm:table-row-group">
                {cartItems.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                  />
                ))}
              </tbody>
            </table>
        </div>

        {/* Resumen */}
        <div className="lg:w-1/4 bg-white p-6 rounded-xl shadow-lg h-fit border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">Resumen del Pedido</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Cantidad de ítems:</span>
              <span className="font-medium">{totalItems}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t">
              <span>Total a pagar:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <button
            onClick={handleCheckout}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
          >
            Finalizar Compra
          </button>
          
          <button
            onClick={clearCart}
            className="w-full mt-3 text-sm text-red-500 hover:text-red-700 transition"
          >
            Vaciar Carrito
          </button>
        </div>
      </div>

      {/* Renderizado condicional del Modal */}
      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </div>
  );
};

export default Cart;