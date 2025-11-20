import { useState, useEffect } from 'react';
import { getCart, removeFromCart, updateCartItemQuantity, clearCart } from '../Context/cartStorage';
import Card from '../../shared/components/Card';
import ProductPlaceholder from '../components/ProductPlaceholder';
import { createOrder } from '../../orders/services/orderCreateService';

function ShoppingCart() {

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = getCart();

    setCartItems(items);
  }, []);

  const handleQuantityChange = (sku, delta) => {

    const updatedItems = cartItems.map((item) => {

      if (item.sku !== sku) return item;

      const newQuantity = Math.max(0, item.quantity + delta);

      if (newQuantity === 0) {

        removeFromCart(sku);

        return null;

      } else {

        updateCartItemQuantity(sku, newQuantity);

        return { ...item, quantity: newQuantity };
      }
    }).filter(Boolean);

    setCartItems(updatedItems);
  };

  const handleDelete = (sku) => {

    removeFromCart(sku);
    setCartItems((prev) => prev.filter((item) => item.sku !== sku));
  };

  const handleCheckout = async () => {

    const customerId = 'c2a45638-534c-48ca-9dbc-243c77f3edb7'//localStorage.getItem('idCustomer');

    const cartItems = getCart();

    if (!customerId || cartItems.length === 0) {
      alert('No se puede procesar la orden: faltan datos');

      return;
    }

    const products = cartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      currentunitPrice: item.currentUnitPrice,
      name: item.name,

    }));

    const payload = {
      customerId,
      shippingAddress: 'Dirección de envío por defecto',
      billingAddress: 'Dirección de facturación por defecto',
      products,
    };

    const { data, error } = await createOrder(payload);

    if (data) {
      clearCart();
      setCartItems([]);
      alert('Orden creada correctamente');
    } else {
      alert(`Error al crear orden: ${error?.message}`);
    }
  };

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + (Number(item.currentUnitPrice) || 0) * item.quantity,
    0,
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
      <div className="flex flex-col gap-4 sm:w-2/3">
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500 col-span-full">
            El carrito está vacío.
          </div>
        ) : (
          cartItems
            .filter(
              (product) =>
                product &&
                typeof product === 'object' &&
                product.sku &&
                typeof product.quantity === 'number' &&
                typeof product.currentUnitPrice === 'number',
            )
            .map((product) => (
              <ProductPlaceholder
                key={product.sku}
                product={product}
                onQuantityChange={handleQuantityChange}
                onDelete={handleDelete}
              />
            ))
        )}
      </div>

      <div className="sm:w-1/3 ">
        <Card className="w-full max-w-sm mx-auto shadow-sm text-sm sm:text-base">
          <div className="flex flex-col gap-2 sm:min-h-screen">
            <div className="text-lg font-semibold text-gray-800">Detalle de pedido</div>
            <div className="text-gray-600">Cantidad en total: {totalQuantity}</div>
            <div className="text-gray-600">Total a pagar: ${totalAmount.toFixed(2)}</div>
            <button
              onClick={() => { handleCheckout(); }}

              className="mt-3 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Finalizar Compra
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ShoppingCart;