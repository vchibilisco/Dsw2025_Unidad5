import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";
import { useCart } from "../../shared/hooks/useCart";
import LoginModal from "../components/LoginModal";
import { instance } from "../../shared/api/axiosInstance";
import SearchBar from "../../shared/components/SearchBar";

function CartPage() {
  const navigate = useNavigate();

  const { cart, addToCart, removeFromCart, clearCart, updateQuantity } = useCart();
  const [openCartMenu, setOpenCartMenu] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [deleteQuantities, setDeleteQuantities] = useState({});

  const isLogged = () => !!localStorage.getItem("token");

  const totalItems = cart.reduce((acc, p) => acc + p.quantity, 0);
  const totalAmount = cart.reduce(
    (acc, p) => acc + p.quantity * p.currentUnitPrice,
    0
  );

  const sendOrder = async () => {
    try {
      await instance.post("/api/orders", {
        items: cart.map((i) => ({
          sku: i.sku,
          quantity: i.quantity,
        })),
      });

      clearCart();
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error al procesar la orden.");
    }
  };

  const handleCheckout = () => {
    if (isLogged()) sendOrder();
    else setOpenLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setOpenLoginModal(false);
    sendOrder();
  };

  if (cart.length === 0)
    return (
      <div className="p-4">
        <h1 className="text-3xl mb-4">Carrito</h1>
        <p>El carrito está vacío.</p>
      </div>
    );

  return (
    <div>
      {/* --- CABECERA --- */}
      <Card>
        <div className="flex justify-between items-center mb-3">

          {/* IZQUIERDA */}
          <h1 className="text-3xl">Carrito</h1>

          {/* BUSCADOR DESKTOP */}
          <div className="hidden sm:flex flex-1 px-6">
            <SearchBar
              value={""}
              onChange={() => {}}
              onSearch={() => {}}
            />
          </div>

          {/* BUSCADOR MOBILE */}
          <div className="sm:hidden w-full">
            <SearchBar
              value={""}
              onChange={() => {}}
              onSearch={() => {}}
            />
          </div>


          {/* BOTONES SESIÓN + VOLVER ESCRITORIO */}
          <div className="hidden sm:flex items-center gap-3">
            <Button onClick={() => navigate("/")}>Volver</Button>
            <Button>Iniciar Sesión</Button>
            <Button>Registrarse</Button>
          </div>

          {/* BOTÓN MENU MOBILE */}
          <Button className="sm:hidden h-8 w-8 p-1 flex items-center justify-center" onClick={() => setOpenCartMenu(true)}>≡
          </Button>
        </div>
      </Card>

      {/* PANEL MOBILE */}
      <div
        className={`
          fixed top-0 right-0 h-full w-64 bg-white shadow-lg p-6
          transition-transform duration-300
          ${openCartMenu ? "translate-x-0" : "translate-x-full"}
          sm:hidden
        `}
      >

        <h2 className="text-xl mb-4">Menú</h2>

          <Button
            className="text-xl mt-4 w-full"
            onClick={() => {
              setOpenCartMenu(false);
              navigate("/");
            }}
          >
            Volver
          </Button>

          <Button className="text-xl mt-4 w-full" onClick={() => setOpenCartMenu(false)}>
            Iniciar Sesión
          </Button>

          <Button className="text-xl mt-4 w-full" onClick={() => setOpenCartMenu(false)}>
            Registrarse
          </Button>

          <Button className="text-xl mt-4 w-full" onClick={() => setOpenCartMenu(false)}>
            Cerrar ✘
          </Button>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="mt-4 flex flex-col sm:flex-row gap-4">

        {/* LISTA DE PRODUCTOS (IZQUIERDA) */}
        <div className="flex-1 flex flex-col gap-4">
          {cart.map((item) => {
    
    const delQty = deleteQuantities[item.sku] ?? 0;
    const remaining = item.quantity - delQty;

    return (
        <Card key={item.sku}>

        <h2 className="text-lg font-semibold">{item.name}</h2>

        {/* CANTIDAD ACTUAL */}
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
           Cantidad actual: <strong>{item.quantity}</strong>
        </p>

        {/* CONTROLES DE ELIMINACIÓN */}
        <div className="flex items-center justify-between mt-4">

            {/* CONTADOR */}
            <div className="flex items-center gap-4">
            {/* ➖ */}
            <Button
                className="px-2 py-1 text-sm sm:px-3 sm:py-2 sm:text-base"
                onClick={() =>
                setDeleteQuantities(prev => ({
                    ...prev,
                    [item.sku]: Math.max(0, delQty - 1)
                }))
                }
            >
                ➖
            </Button>

            <span className="w-6 text-center text-base sm:w-8 sm:text-lg font-semibold">
                {delQty}
            </span>

            {/* ➕ */}
            <Button
                className="px-2 py-1 text-sm sm:px-3 sm:py-2 sm:text-base"
                onClick={() =>
                setDeleteQuantities(prev => ({
                    ...prev,
                    [item.sku]: Math.min(item.quantity, delQty + 1)
                }))
                }
            >
                ➕
            </Button>
            </div>

            {/* BOTÓN APLICAR ELIMINACIÓN */}
            <Button
            className="text-sm px-4 py-2 sm:text-base"
            onClick={() => {
                if (delQty >= item.quantity) {
                removeFromCart(item.sku);
                } else {
                updateQuantity(item.sku, item.quantity - delQty);

                }

                // reset
                setDeleteQuantities(prev => ({
                ...prev,
                [item.sku]: 0
                }));
            }}
            >
            Borrar
            </Button>
        </div>

            {/* SUBTOTAL ACTUALIZADO */}
            <div className="mt-3 text-right font-semibold text-lg">
                Subtotal: $
                {(remaining * item.currentUnitPrice).toFixed(2)}
            </div>

            {/* SI EL USUARIO ELIMINA TODO */}
            {remaining === 0 && (
                <p className="text-red-600 mt-2 text-right">
                (El producto será eliminado)
                </p>
            )}

            </Card>
        );
        })}

        </div>

        {/* DETALLE PEDIDO (DERECHA EN ESCRITORIO) */}
        <Card className="sm:w-72 h-fit p-3 sm:p-4 text-sm sm:text-base">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Detalle del pedido</h2>

          <p className="mb-1 sm:mb-2">Total ítems: {totalItems}</p>
          <p className="mb-3 sm:mb-4">
        Total a pagar: ${totalAmount.toFixed(2)}
        </p>
          <Button className="w-full py-1 sm:py-2" onClick={handleCheckout}>
            Finalizar compra
          </Button>
        </Card>
      </div>

      {openLoginModal && <LoginModal onSuccess={handleLoginSuccess} />}
    </div>
  );
}

export default CartPage;
