import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";
import { useCart } from "../../shared/hooks/useCart";
import { useState } from "react";
import LoginModal from "../components/LoginModal";
import { instance } from "../../shared/api/axiosInstance";

function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const isLogged = () => {
    return !!localStorage.getItem("token"); // ajusta a tu login real
  };

  const sendOrder = async () => {
    try {
      await instance.post("/api/orders", {
        items: cart.map(i => ({
          sku: i.sku,
          quantity: i.quantity,
        }))
      });

      clearCart();
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Error al procesar la orden.");
    }
  };

  const handleCheckout = () => {
    if (isLogged()) {
      sendOrder();
    } else {
      setOpenLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setOpenLoginModal(false);
    sendOrder();
  };

  if (cart.length === 0) return <p>El carrito está vacío.</p>;

  return (
    <div>
      <h1 className="text-3xl mb-4">Carrito</h1>

      {cart.map(item => (
        <Card key={item.sku}>
          <h2>{item.name}</h2>
          <p>Cantidad: {item.quantity}</p>
          <p>Precio unitario: ${item.currentUnitPrice}</p>

          <Button
            className="mt-2"
            onClick={() => removeFromCart(item.sku)}
          >
            Eliminar
          </Button>
        </Card>
      ))}

      <Button className="mt-4" onClick={handleCheckout}>
        Finalizar compra
      </Button>

      {openLoginModal && (
        <LoginModal onSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default CartPage;
