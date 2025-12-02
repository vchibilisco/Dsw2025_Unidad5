import React, { useState, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCart } from "../../cart/useCart";
import { useAuth } from "../../auth/context/AuthProvider";
import { createOrder } from "../services/listServices"; // Asegúrate que listServices exporte createOrder

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  // Asegurarse de que el useAuth real provea user.customerId y el token
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isProcessing, setIsProcessing] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  // Validación de seguridad y flujo
  useEffect(() => {
    // Corrección de sintaxis: .lenght -> .length
    // si el carrito esta vacio redirigir
    if (cartItems.length === 0) {
      navigate("/cart");
      return;
    }
    // si no hay usuario (o token) redirigir para forzar login
    if (!user || !token) {
      alert("Debes estar logueado para finalizar la compra.");
      navigate("/cart");
      return;
    }
  }, [cartItems.length, navigate, user, token]); // Corrección de dependencia .lenght

  // Corrección de sintaxis: .lenght -> .length
  // si no cumple la condiciones iniciales no renderiza el form
  if (cartItems.length === 0 || !user || !token) {
    return null;
  }

  // funcion central de proceso
  const processOrder = async (data) => {
    // doble check por si el user object no tiene id
    if (!user.customerId) {
      setSubmissionError(
        "Id del cliente no disponible, por favor reinicia la sesión."
      );
      return;
    }

    setIsProcessing(true);
    setSubmissionError(null);

    // Construir el payload para C# (usando camelCase para las claves JSON)
    const orderItemsPayload = cartItems.map((item) => ({
      // C# OrderItemRequest.ProductId (Guid) -> JSON productId
      productId: item.id,
      // C# OrderItemRequest.Quantity (int) -> JSON quantity
      quantity: item.quantity,
    }));

    const orderData = {
      // C# OrderRequest.CustomerId -> JSON customerId
      customerId: user.customerId,
      // C# OrderRequest.ShippingAddress -> JSON shippingAddress
      shippingAddress: data.shippingAddress,
      // C# OrderRequest.BillingAddress -> JSON billingAddress
      billingAddress: data.billingAddress,
      // C# OrderRequest.Notes -> JSON notes (El campo del formulario es "notes")
      notes: data.notes || null,
      // C# OrderRequest.Items (List) -> JSON items
      items: orderItemsPayload, // ¡Nombre del array corregido a 'items' y en camelCase!
    };

    // llamar a la api
    const result = await createOrder(orderData, token);

    // manejar el resultado
    // Corrección de sintaxis: result.succes -> result.success
    if (result.success) {
      alert(
        `✅ ¡Orden #${
          // Propiedades de OrderResponse en camelCase
          result.data.orderId
        } creada! Total: $${result.data.totalAmount.toFixed(2)}`
      );
      clearCart();
      navigate("/");
    } else {
      // error de stock 400 o servidor
      setSubmissionError(result.error);
    }

    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Finalizar Compra
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Columna de Formulario */}
        <div className="lg:w-2/3 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            1. Detalles de Envío y Pago
          </h2>

          <form onSubmit={handleSubmit(processOrder)} className="space-y-4">
            {/* Dirección de Envío */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección de Envío (*)
              </label>
              <input
                type="text"
                {...register("shippingAddress", {
                  required: "La dirección de envío es obligatoria",
                })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Calle Falsa 123, Ciudad, País"
              />
              {errors.shippingAddress && (
                <span className="text-red-500 text-xs">
                  {errors.shippingAddress.message}
                </span>
              )}
            </div>

            {/* Dirección de Facturación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección de Facturación (*)
              </label>
              <input
                type="text"
                {...register("billingAddress", {
                  required: "La dirección de facturación es obligatoria",
                })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Calle Falsa 123, Ciudad, País"
              />
              {errors.billingAddress && (
                <span className="text-red-500 text-xs">
                  {errors.billingAddress.message}
                </span>
              )}
            </div>

            {/* Notas Opcionales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas (Opcional)
              </label>
              <textarea
                {...register("notes")}
                className="w-full px-4 py-2 border rounded-lg"
                rows="3"
                placeholder="Instrucciones especiales de entrega"
              ></textarea>
            </div>

            {submissionError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm"
                role="alert"
              >
                <strong>Error:</strong> {submissionError}
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md disabled:bg-green-400 mt-4"
            >
              {isProcessing ? "Confirmando Orden..." : "Confirmar y Pagar"}
            </button>
          </form>
        </div>

        {/* Columna de Resumen de la Orden */}
        <div className="lg:w-1/3 bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-200 h-fit">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            2. Resumen del Pedido
          </h2>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-b-0"
            >
              <span>
                {item.quantity} x {item.name}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t mt-4">
            <span>Total:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;
