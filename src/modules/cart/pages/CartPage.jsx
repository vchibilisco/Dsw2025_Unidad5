import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";
import { useCart } from "../../shared/hooks/useCart";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import UserHeaderMenu from "../../shared/components/UserHeaderMenu";
import MobileSideMenu from "../../shared/components/MobileSideMenu";
import { createOrder } from "../../orders/services/createOrder";
import useAuth from "../../auth/hook/useAuth";

function CartPage() {
  const navigate = useNavigate();

  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();

  const [openCartMenu, setOpenCartMenu] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);

  const [deleteQuantities, setDeleteQuantities] = useState({});

  const { isAuthenticated } = useAuth();

  const totalItems = cart.reduce((acc, p) => acc + p.quantity, 0);
  const totalAmount = cart.reduce(
    (acc, p) => acc + p.quantity * p.currentUnitPrice,
    0
  );

  useEffect(() => {
    const openLogin = () => setOpenLoginModal(true);
    const openRegister = () => setOpenRegisterModal(true);

    window.addEventListener("open-login", openLogin);
    window.addEventListener("open-register", openRegister);

    return () => {
      window.removeEventListener("open-login", openLogin);
      window.removeEventListener("open-register", openRegister);
    };
  }, []);

  const sendOrder = async () => {
  try {
    // TODO: reemplazar cuando tengas el verdadero customerId (GUID)
    const HARDCODED_CUSTOMER_ID = "8ee65b9a-6746-4401-a885-09a9f7c67ed4";

    const orderData = {
      customerId: HARDCODED_CUSTOMER_ID,
      shippingAddress: "Sin especificar",
      billingAddress: "Sin especificar",
      notes: "",
      orderItems: cart.map((item) => ({
        productId:  item.productId,  
        quantity: item.quantity,
      })),
    };

    const { data, error } = await createOrder(orderData);

    if (error) throw error;

    clearCart();
    navigate("/");

  } catch (err) {
    console.error(err);
    alert("Error al procesar la orden.");
  }
};

  const handleCheckout = () => {
  if (isAuthenticated) sendOrder();
  else setOpenLoginModal(true);
};

  const handleLoginSuccess = () => {
    setOpenLoginModal(false);
    sendOrder();
  };

  // Carrito vacío
  if (cart.length === 0)
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
          <Button className="w-full text-lg py-2" onClick={() => navigate("/")}>
            Ver productos
          </Button>
        </Card>
      </div>
    );

  return (
    <div>
      {/* Header */}
      <Card>
      <UserHeaderMenu
        title="Carrito"
        search={{
          value: "",
          onChange: () => {},
          onSearch: () => {},
        }}
        onGoProducts={() => navigate("/")}
        onGoCart={null}
        onOpenLogin={() => setOpenLoginModal(true)}
        onOpenRegister={() => setOpenRegisterModal(true)}
        onOpenMobileMenu={() => setOpenCartMenu(true)}
        totalItems={totalItems}
      />

      </Card>

      {/* Mobile menu */}
      <MobileSideMenu
      isOpen={openCartMenu}
      title="Menú"
      onClose={() => setOpenCartMenu(false)}

      onGoProducts={() => {
        setOpenCartMenu(false);
        navigate("/");
      }}

      onGoCart={null}

      totalItems={totalItems}

      onOpenLogin={() => {
        setOpenCartMenu(false);
        setOpenLoginModal(true);
      }}

      onOpenRegister={() => {
        setOpenCartMenu(false);
        setOpenRegisterModal(true);
      }}
    />

      {/* Cart items */}
      <div className="mt-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-4">
          {cart.map((item) => {
            const delQty = deleteQuantities[item.sku] ?? 0;
            const remaining = item.quantity - delQty;

            return (
              <Card key={item.sku}>
                <h2 className="text-lg font-semibold">{item.name}</h2>

                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Cantidad actual: <strong>{item.quantity}</strong>
                </p>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-4">
                    <Button
                    className="px-2 py-1 text-sm sm:px-3 sm:py-2 sm:text-base"
                      onClick={() =>
                        setDeleteQuantities((prev) => ({
                          ...prev,
                          [item.sku]: Math.max(0, delQty - 1),
                        }))
                      }
                    >
                      ➖
                    </Button>

                    <span className="w-6 text-center text-lg">{delQty}</span>

                    <Button
                    className="px-2 py-1 text-sm sm:px-3 sm:py-2 sm:text-base"
                      onClick={() =>
                        setDeleteQuantities((prev) => ({
                          ...prev,
                          [item.sku]: Math.min(item.quantity, delQty + 1),
                        }))
                      }
                    >
                      ➕
                    </Button>
                  </div>

                  <Button
                  className="ml-50 sm:ml-5 text-sm px-4 py-2 sm:text-base font-semibold"
                    onClick={() => {
                      if (delQty >= item.quantity) removeFromCart(item.sku);
                      else updateQuantity(item.sku, item.quantity - delQty);

                      setDeleteQuantities((prev) => ({ ...prev, [item.sku]: 0 }));
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

        <Card className="sm:w-72 h-fit p-4">
          <h2 className="text-lg font-semibold">Detalle del pedido</h2>

          <p className="text-lg" >Total ítems: {totalItems}</p>
          <p className="text-lg">Total a pagar: ${totalAmount.toFixed(2)}</p>

          <Button className="w-full py-1 text-sm sm:text-base sm:py-2" onClick={handleCheckout}>
            Finalizar compra
          </Button>
        </Card>
      </div>

      {/* Modales */}
      <LoginModal
        isOpen={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
      <RegisterModal
        isOpen={openRegisterModal}
        onClose={() => setOpenRegisterModal(false)}
      />
    </div>
  );
}

export default CartPage;
