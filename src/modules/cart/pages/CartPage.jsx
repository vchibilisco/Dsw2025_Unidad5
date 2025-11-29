import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Hooks
import useAuth from '../../auth/hook/useAuth';
import { useCart } from '../hooks/useCart';
import { useDeleteQuantity } from '../../shared/hooks/useDeleteQuantity';
import { useToggleMap } from '../../shared/hooks/useToggleMap';

// Components
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import UserHeaderMenu from '../../shared/components/UserHeaderMenu';
import MobileSideMenu from '../../shared/components/MobileSideMenu';
import LoginModal from '../../auth/components/LoginModal';
import RegisterModal from '../../auth/components/RegisterModal';

// Services
import { createOrder } from '../../orders/services/createOrder';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const { user } = useAuth();

  const { deleteQuantities, get, increment, decrement, reset } = useDeleteQuantity();

  const {
    state: modals,
    open,
    close,
  } = useToggleMap({
    cartMenu: false,
    loginModal: false,
    registerModal: false,
  });

  const totalItems = cart.reduce((acc, p) => acc + p.quantity, 0);
  const totalAmount = cart.reduce((acc, p) => acc + p.quantity * p.currentUnitPrice, 0);

  useEffect(() => {
    const openLogin = () => open('loginModal');
    const openRegister = () => open('registerModal');

    window.addEventListener('open-login', openLogin);
    window.addEventListener('open-register', openRegister);

    return () => {
      window.removeEventListener('open-login', openLogin);
      window.removeEventListener('open-register', openRegister);
    };
  }, []);

  const sendOrder = async () => {
    if (!user) {
      open('loginModal');

      return;
    }

    try {
      const orderData = {
        customerId: user.customerId,
        shippingAddress: 'Sin especificar',
        billingAddress: 'Sin especificar',
        notes: '',
        orderItems: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const { data, error } = await createOrder(orderData);

      if (error) throw error;

      clearCart();
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Error al procesar la orden.');
    }
  };

  const handleCheckout = () => sendOrder();

  const handleLoginSuccess = () => {
    close('loginModal');
    sendOrder();
  };

  if (cart.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center text-center">
        <Card className="p-6 max-w-md shadow-lg">
          <h1 className="text-3xl font-semibold mb-4">Carrito vacío</h1>
          <p className="text-gray-600 mb-6 text-lg">
            Parece que todavía no agregaste productos.
          </p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            className="w-32 mx-auto opacity-80 mb-6"
          />
          <Button className="w-full text-lg py-2" onClick={() => navigate('/')}>
            Ver productos
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <Card>
        <UserHeaderMenu
          title="Carrito"
          search={{ value: '', onChange: () => {}, onSearch: () => {} }}
          onGoProducts={() => navigate('/')}
          onGoCart={null}
          onOpenLogin={() => open('loginModal')}
          onOpenRegister={() => open('registerModal')}
          onOpenMobileMenu={() => open('cartMenu')}
          totalItems={totalItems}
        />
      </Card>

      {/* Mobile menu */}
      <MobileSideMenu
        isOpen={modals.cartMenu}
        title="Menú"
        onClose={() => close('cartMenu')}
        onGoProducts={() => {
          close('cartMenu');
          navigate('/');
        }}
        onGoCart={null}
        totalItems={totalItems}
        onOpenLogin={() => {
          close('cartMenu');
          open('loginModal');
        }}
        onOpenRegister={() => {
          close('cartMenu');
          open('registerModal');
        }}
      />

      {/* Cart Items + Order Summary */}
      <div className="mt-4 flex flex-col sm:flex-row gap-4">
        {/* Cart items */}
        <div className="flex-1 flex flex-col gap-4">
          {cart.map((item) => {
            const delQty = get(item.sku);
            const remaining = item.quantity - delQty;

            return (
              <Card key={item.sku}>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Cantidad actual: <strong>{item.quantity}</strong>
                </p>

                {delQty >= item.quantity && (
                  <p className="text-red-600 p-1 text-sm font-medium">
                        Si borra, este producto se eliminará del carrito
                  </p>
                )}

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => decrement(item.sku)}
                      disabled={delQty <= 1}
                      className="px-2 py-1 text-sm sm:px-3 sm:py-2 sm:text-base disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ➖
                    </Button>

                    <span className="w-6 text-center text-lg">{delQty}</span>

                    <Button
                      onClick={() => increment(item.sku, item.quantity)}
                      disabled={delQty >= item.quantity}
                      className="px-2 py-1 text-sm sm:px-3 sm:py-2 sm:text-base disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ➕
                    </Button>
                  </div>

                  <Button
                    className="ml-50 sm:ml-5 text-sm px-4 py-2 sm:text-base font-semibold"
                    onClick={() => {
                      if (delQty >= item.quantity) removeFromCart(item.sku);
                      else updateQuantity(item.sku, item.quantity - delQty);

                      reset(item.sku);
                    }}
                  >
                    Borrar
                  </Button>
                </div>

                <div className="mt-3 text-right font-semibold text-lg">
                  Subtotal: ${(remaining * item.currentUnitPrice).toFixed(2)}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Order summary */}
        <Card className="sm:w-72 h-fit p-4">
          <h2 className="text-lg font-semibold">Detalle del pedido</h2>
          <p className="text-lg">Total ítems: {totalItems}</p>
          <p className="text-lg">Total a pagar: ${totalAmount.toFixed(2)}</p>

          <Button
            className="w-full py-1 text-sm sm:text-base sm:py-2"
            onClick={handleCheckout}
          >
            Finalizar compra
          </Button>
        </Card>
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={modals.loginModal}
        onClose={() => close('loginModal')}
        onSuccess={handleLoginSuccess}
      />
      <RegisterModal
        isOpen={modals.registerModal}
        onClose={() => close('registerModal')}
      />
    </div>
  );
}

export default CartPage;
