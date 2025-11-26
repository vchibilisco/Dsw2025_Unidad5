import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";
import { useCart } from "../../shared/hooks/useCart";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import { instance } from "../../shared/api/axiosInstance";
import SearchBar from "../../shared/components/SearchBar";

function CartPage() {
  const navigate = useNavigate();

  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();

  const [openCartMenu, setOpenCartMenu] = useState(false);

  // 🔹 Modales
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);

  const [deleteQuantities, setDeleteQuantities] = useState({});

  // 🔹 Saber si el usuario está logeado
  const isLogged = () => !!localStorage.getItem("token");

  const totalItems = cart.reduce((acc, p) => acc + p.quantity, 0);
  const totalAmount = cart.reduce(
    (acc, p) => acc + p.quantity * p.currentUnitPrice,
    0
  );

  // -----------------------------
  // 🔹 LISTENERS PARA OPEN-LOGIN / OPEN-REGISTER
  // -----------------------------
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

  // -----------------------------
  // 🔹 Finalizar compra
  // -----------------------------
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

  // -----------------------------
  // 🔹 Si el carrito está vacío
  // -----------------------------
if (cart.length === 0)
  return (
    <div className="p-6 flex flex-col items-center justify-center text-center">

      <Card className="p-6 max-w-md shadow-lg">

        <h1 className="text-3xl font-semibold mb-4">Carrito vacío</h1>

        <p className="text-gray-600 mb-6 text-lg">
          Parece que todavía no agregaste productos.  
        </p>

        {/* Imagen ilustrativa */}
        <div className="flex justify-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Carrito vacío"
            className="w-32 opacity-80"
          />
        </div>

        <Button
          className="w-full text-lg py-2"
          onClick={() => navigate("/")}
        >
          Ver productos
        </Button>

      </Card>

    </div>
  );


  return (
    <div>
      {/* --- CABECERA --- */}
      <Card>
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-3xl">Carrito</h1>

          {/* DESKTOP SEARCH (vacío para ocupar espacio) */}
          <div className="hidden sm:flex flex-1 px-6">
            <SearchBar value={""} onChange={() => {}} onSearch={() => {}} />
          </div>

          {/* MOBILE SEARCH */}
          <div className="sm:hidden w-full">
            <SearchBar value={""} onChange={() => {}} onSearch={() => {}} />
          </div>

          {/* DESKTOP BOTONES */}
          <div className="hidden sm:flex items-center gap-3">
            <Button onClick={() => navigate("/")}>Volver</Button>

            <Button onClick={() => setOpenLoginModal(true)}>Iniciar Sesión</Button>

            <Button onClick={() => setOpenRegisterModal(true)}>
              Registrarse
            </Button>
          </div>

          {/* BOTÓN MENÚ MOBILE */}
          <Button
            className="sm:hidden h-8 w-8 p-1 flex items-center justify-center"
            onClick={() => setOpenCartMenu(true)}
          >
            ≡
          </Button>
        </div>
      </Card>

      {/* --- PANEL MOBILE --- */}
      <div
        className={`
          fixed top-0 right-0 h-full w-64 bg-white shadow-lg p-6
          transition-transform duration-300 z-50
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

        <Button
          className="text-xl mt-4 w-full"
          onClick={() => {
            setOpenCartMenu(false);
            setOpenLoginModal(true);
          }}
        >
          Iniciar Sesión
        </Button>

        <Button
          className="text-xl mt-4 w-full"
          onClick={() => {
            setOpenCartMenu(false);
            setOpenRegisterModal(true);
          }}
        >
          Registrarse
        </Button>

        <Button
          className="text-xl mt-4 w-full"
          onClick={() => setOpenCartMenu(false)}
        >
          Cerrar ✘
        </Button>
      </div>

      {/* --- LISTA DE ITEMS DEL CARRITO --- */}
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

                {/* Controles */}
                <div className="flex items-center justify-between mt-4">
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
                      if (delQty >= item.quantity) {
                        removeFromCart(item.sku);
                      } else {
                        updateQuantity(item.sku, item.quantity - delQty);
                      }

                      setDeleteQuantities((prev) => ({
                        ...prev,
                        [item.sku]: 0,
                      }));
                    }}
                  >
                    Borrar
                  </Button>
                </div>

                <div className="mt-3 text-right font-semibold text-lg">
                  Subtotal: ${remaining * item.currentUnitPrice}
                </div>

                {remaining === 0 && (
                 <p className="text-red-600 text-right text-sm sm:text-sm">
                  El producto será eliminado
                </p>
                )}
              </Card>
            );
          })}
        </div>

        {/* --- DETALLE DEL PEDIDO --- */}
        <Card className="sm:w-72 h-fit p-4">
          <h2 className="text-lg font-semibold">Detalle del pedido</h2>

          <p className="text-lg ">Total ítems: {totalItems}</p>
          <p className="text-lg ">Total a pagar: ${totalAmount.toFixed(2)}</p>

          <Button className="w-full py-1 text-sm sm:text-base sm:py-2" onClick={handleCheckout}>
            Finalizar compra
          </Button>
        </Card>
      </div>

      {/* --- MODALES --- */}
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
