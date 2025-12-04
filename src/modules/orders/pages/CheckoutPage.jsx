import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../cart/useCart'; // Tu hook del carrito
import { instance } from '../../shared/api/axiosInstance'; // Axios con interceptor
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Configuración del formulario
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      shippingAddress: '',
      billingAddress: '',
      notes: ''
    }
  });

  // 1. VALIDACIÓN INICIAL: ¿Hay items? ¿Hay Cliente?
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
    
    // Verificamos si tenemos el ID necesario para el backend
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
        // Si es null (ej: es Admin o no se guardó bien), mandamos a login
        alert("Necesitas una cuenta de Cliente para comprar.");
        navigate('/login');
    }
  }, [cartItems, navigate]);

  const onSubmit = async (formData) => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const storedCustomerId = localStorage.getItem('customerId');

      // 2. PREPARAR DATOS PARA C# (OrderRequest)
      const orderPayload = {
        customerId: storedCustomerId, // Este es el GUID que viene del login
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.billingAddress || formData.shippingAddress, // Si está vacío, repite la de envío
        notes: formData.notes,
        // Mapeo de items: Frontend (id, quantity) -> Backend (ProductId, Quantity)
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      // 3. ENVIAR AL BACKEND
      // instance ya incluye el Token Bearer automáticamente
      const response = await instance.post('/api/orders', orderPayload);

      console.log("Orden Creada:", response.data);

      // 4. ÉXITO
      clearCart(); // Limpiamos el carrito global
      alert(`¡Compra realizada con éxito! Orden #${response.data.id}`);
      navigate('/'); // Redirigir al home o a una vista de "Mis Pedidos"

    } catch (error) {
      console.error("Error al procesar orden:", error);
      
      // Manejo de errores que vienen del backend (ej: Stock insuficiente)
      if (error.response && error.response.data) {
        // Si el backend devuelve un mensaje simple o un objeto JSON
        const msg = error.response.data.message || error.response.data.detail || JSON.stringify(error.response.data);
        setErrorMessage(`Error: ${msg}`);
      } else {
        setErrorMessage("Ocurrió un error de conexión. Intente nuevamente.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Finalizar Compra</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* COLUMNA IZQUIERDA: Formulario de Datos */}
        <div>
            <Card>
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Información de Envío</h2>
                    <form onSubmit={handleSubmit(onSubmit)} id="checkout-form" className="flex flex-col gap-4">
                        
                        <Input
                            label="Dirección de Entrega"
                            {...register('shippingAddress', { 
                                required: 'La dirección es obligatoria',
                                minLength: { value: 5, message: 'La dirección es muy corta' }
                            })}
                            error={errors.shippingAddress?.message}
                            placeholder="Ej: Av. Principal 123, Depto 4B"
                        />

                        <Input
                            label="Dirección de Facturación (Opcional)"
                            {...register('billingAddress')}
                            placeholder="Dejar en blanco si es igual a la de envío"
                        />

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700">Notas adicionales</label>
                            <textarea 
                                {...register('notes')}
                                className="border border-gray-300 rounded-lg p-3 w-full h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ej: Tocar timbre, dejar en recepción..."
                            />
                        </div>

                        {errorMessage && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                {errorMessage}
                            </div>
                        )}
                    </form>
                </div>
            </Card>
        </div>

        {/* COLUMNA DERECHA: Resumen del Pedido */}
        <div>
            <Card className="bg-gray-50 h-fit sticky top-4">
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Resumen de tu Pedido</h2>
                    
                    {/* Lista de Items */}
                    <ul className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {cartItems.map(item => (
                            <li key={item.id} className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {item.quantity} x ${item.currentUnitPrice.toFixed(2)}
                                    </p>
                                </div>
                                <span className="font-bold text-gray-700">
                                    ${(item.currentUnitPrice * item.quantity).toFixed(2)}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Totales */}
                    <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Envío</span>
                            <span className="text-green-600 font-medium">Gratis</span>
                        </div>
                        <div className="flex justify-between items-center text-2xl font-bold text-gray-900 pt-2 border-t mt-2">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Botón de Acción */}
                    <div className="mt-6">
                        <Button 
                            type="submit" 
                            form="checkout-form" // Vincula este botón al form de la otra columna
                            className="w-full text-lg py-3"
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
                        </Button>
                        <p className="text-xs text-center text-gray-500 mt-2">
                            Al confirmar, aceptas nuestros términos y condiciones.
                        </p>
                    </div>
                </div>
            </Card>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;