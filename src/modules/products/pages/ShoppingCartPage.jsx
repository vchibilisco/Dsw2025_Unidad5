import { useState, useEffect } from 'react';
import { getCart, removeFromCart, updateCartItemQuantity, clearCart } from '../Context/cartStorage';
import Card from '../../shared/components/Card';
import ProductPlaceholder from '../components/ProductPlaceholder';
import { createOrder } from '../../orders/services/orderCreateService';
import useAuth from '../../auth/hook/useAuth';
import { useOutletContext } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UserLoginForm from '../../auth/components/UserLoginForm';

function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState([]);

  const { isAuthenticated, customerId } = useAuth();

  const [pendingCheckout, setPendingCheckout] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);

  const navigate = useNavigate();

  const { cartVersion } = useOutletContext();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');

    setCartItems(items);
  }, [cartVersion]);

  useEffect(() => {
    if (isAuthenticated && pendingCheckout) {
      handleCheckout();
      setPendingCheckout(false);
    }
  }, [isAuthenticated, pendingCheckout]);

  const handleQuantityChange = (sku, delta) => {
    const updatedItems = cartItems
      .map((item) => {
        if (item.sku !== sku) return item;

        // OBTENER STOCK DISPONIBLE
        const availableStock = item.stockQuantity;
        let newQuantity = item.quantity + delta;

        // 1. APLICAR LÍMITE SUPERIOR (STOCK)
        if (delta > 0) {
          // No permitir que la cantidad supere el stock
          newQuantity = Math.min(availableStock, newQuantity);
        }

        // 2. APLICAR LÍMITE INFERIOR (CERO)
        newQuantity = Math.max(0, newQuantity);

        if (newQuantity === 0) {
          removeFromCart(sku);

          return null;
        } else {
          updateCartItemQuantity(sku, newQuantity);

          return { ...item, quantity: newQuantity };
        }
      })
      .filter(Boolean);

    setCartItems(updatedItems);
  };

  const handleDelete = (sku) => {
    removeFromCart(sku);
    setCartItems((prev) => prev.filter((item) => item.sku !== sku));
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setPendingCheckout(true);
      setShowLoginModal(true);

      return;
    }

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
      navigate('/');
    } else {
      alert(`Error al crear orden: ${error?.message}`);
    }
  };

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (acc, item) => acc + (Number(item.currentUnitPrice) || 0) * item.quantity,
    0,
  );

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    const userRole = localStorage.getItem('role');

    if (userRole === 'Admin') {
      clearCart();
      setCartItems([]);
      setPendingCheckout(false);
      navigate('/admin/home');
    }
  };

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

      <div className="sm:w-1/3 w-full sticky top-4">
        <Card className="w-full shadow-md bg-white p-6 rounded-lg text-sm md:text-base">
          <div className="flex flex-col gap-2 sm:gap-6  sm:h-[calc(80vh-2rem)] overflow-y-auto">
            <div className="text-xl font-bold text-gray-900 border-b pb-4">Detalle de pedido</div>
            <div className="text-gray-600">Cantidad en total: {totalQuantity}</div>
            <div className="text-gray-600">Total a pagar: ${totalAmount.toFixed(2)}</div>
            <button
              onClick={handleCheckout}
              className="sm:mt-auto bg-purple-200 hover:bg-purple-300 transition px-4 py-2 rounded "
            >
              Finalizar Compra
            </button>
          </div>
        </Card>
      </div>
      {showLoginModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4">

          <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">

            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowLoginModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <UserLoginForm
              onSuccess={handleLoginSuccess}
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default ShoppingCartPage;