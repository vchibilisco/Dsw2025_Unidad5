import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";
import MobileSideMenu from "../../shared/components/MobileSideMenu";
import UserHeaderMenu from "../../shared/components/UserHeaderMenu";
import LoginModal from "../../auth/components/LoginModal";
import RegisterModal from "../../auth/components/RegisterModal";
import { getClientProducts } from "../services/listUser";
import { useCart } from "../../cart/hooks/useCart";

function ListProductsUserPage() {
  const defaultProductImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXp7vG6vsG3u77s8fTCxsnn7O/f5OfFyczP09bM0dO8wMPk6ezY3eDd4uXR1tnJzdBvAX/cAAACVElEQVR4nO3b23KDIBRA0ShGU0n0//+2KmO94gWZ8Zxmr7fmwWEHJsJUHw8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwO1MHHdn+L3rIoK6eshsNJ8kTaJI07fERPOO1Nc1vgQm2oiBTWJ+d8+CqV1heplLzMRNonED+4mg7L6p591FC+133/xCRNCtd3nL9BlxWP++MOaXFdEXFjZ7r8D9l45C8y6aG0cWtP/SUGhs2d8dA/ZfGgrzYX+TVqcTNRRO9l+fS5eSYzQs85psUcuzk6igcLoHPz2J8gvzWaH/JLS+95RfOD8o1p5CU5R7l5LkfKEp0mQ1UX7hsVXqDpRrifILD/3S9CfmlUQFhQfuFu0STTyJ8gsP3PH7GVxN1FC4t2sbBy4TNRTu7LyHJbqaqKFw+/Q0ncFloo7CjRPwMnCWqKXQZ75El4nKC9dmcJaou9AXOE5UXbi+RGeJygrz8Uf+GewSn9uXuplnWDZJ7d8f24F/s6iq0LYf9olbS3Q8i5oKrRu4S9ybwaQ/aCkqtP3I28QDgeoK7TBya/aXqL5COx67PTCD2grtdOwH+pQV2r0a7YVBgZoKwwIVFQYG6ikMDVRTGByopjD8ATcKb0UhhRTe77sKs2DV7FKSjId18TUEBYVyLhUThWfILHTDqmI85/2RWWjcE/bhP6OD7maT3h20MHsA47JC3PsW0wcwLhv9t0OOPOIkCn21y2bXXwlyylxiYMPk1SuCSmpfK8bNQvIrpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwNX4BCbAju9/X67UAAAAASUVORK5CYII=";

  const navigate = useNavigate();

  // PRODUCT STATE
  const [searchTerm, setSearchTerm] = useState("");
  const [status] = useState("enabled");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // CART
  const { cart, addToCart } = useCart();
  const [quantities, setQuantities] = useState({});
  const totalItems = cart.reduce((acc, p) => acc + p.quantity, 0);

  // MOBILE MENU
  const [openCartMenu, setOpenCartMenu] = useState(false);

  // MODALS
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);

  // OPEN MODALS FROM EVENTS
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

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await getClientProducts(
        searchTerm,
        status,
        pageNumber,
        pageSize
      );
      if (error) throw error;

      setTotal(data.total);
      setProducts(data.productItems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [pageNumber, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      {/* HEADER REUTILIZABLE */}
      <UserHeaderMenu
        title="Productos"
        totalItems={totalItems}
        onGoCart={() => navigate("/cart")}
        onGoProducts={null}
        onOpenLogin={() => setOpenLoginModal(true)}
        onOpenRegister={() => setOpenRegisterModal(true)}
        onOpenMobileMenu={() => setOpenCartMenu(true)}
        search={{
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          onSearch: fetchProducts,
        }}
      />

      {/* MOBILE MENU REUTILIZABLE */}
      <MobileSideMenu
        isOpen={openCartMenu}
        onClose={() => setOpenCartMenu(false)}
        title="Menú"
        onGoCart={() => {
          setOpenCartMenu(false);
          navigate("/cart");
        }}
        onGoProducts={null}
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

      {/* PRODUCT LIST */}
      <div
        className="
        mt-4 flex flex-col gap-4
        sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
      "
      >
        {loading ? (
          <span>Buscando productos...</span>
        ) : (
          products.map((product) => {
            const qty = quantities[product.sku] || 1;
            const cartItem = cart.find((item) => item.sku === product.sku);
            const inCartQty = cartItem?.quantity || 0;
            const isMaxReached = qty + inCartQty > product.stockQuantity;

            return (
              <Card key={product.sku} className="flex flex-col">
                <img
                  src={defaultProductImage}
                  alt={product.name}
                  className="w-full h-40 object-contain mb-3 rounded"
                />

                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Stock: {product.stockQuantity} – ${product.currentUnitPrice}
                </p>

                {/* Mostrar si ya está en el carrito */}
                  {(() => {
                    const cartItem = cart.find((item) => item.sku === product.sku);
                    if (!cartItem) return null;

                    return (
                      <p className="text-sm mt-1 text-green-600 font-medium">
                        Ya tienes {cartItem.quantity} en el carrito.
                      </p>
                    );
                  })()}


                <div className="flex items-center gap-4 mt-3">
                  <Button
                   
                    onClick={() =>
                        setQuantities((prev) => ({
                          ...prev,
                          [product.sku]: Math.max(1, qty - 1),
                        }))
                      }
                      disabled={qty <= 1}
                      className="px-2 py-1 text-sm sm:px-3 sm:py-2 sm:text-base disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                    ➖
                  </Button>

                  <span className="w-8 text-center text-lg font-semibold">
                    {qty}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() =>
                        setQuantities((prev) => ({
                          ...prev,
                          [product.sku]: Math.min(
                            product.stockQuantity,
                            qty + 1
                          ),
                        }))
                      }
                      disabled={isMaxReached}
                      className="px-2 py-1 text-sm sm:px-3 sm:py-2 sm:text-base disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ➕
                    </Button>

                    {isMaxReached && (
                      <span className="text-sm text-red-600 font-medium">
                        No hay stock
                      </span>
                    )}
                  </div>


                 <Button
                  onClick={() => {
                    addToCart(product, qty);
                    setQuantities((prev) => ({
                      ...prev,
                      [product.sku]: 1,
                    }));
                  }}
                  disabled={isMaxReached}
                  className="ml-50 sm:ml-5 text-sm px-4 py-2 sm:text-base disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Agregar
                </Button>


                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center mt-3">
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          className="bg-gray-200 disabled:bg-gray-100 text-sm px-4 py-2 sm:text-base"
        >
          Atras
        </button>

        <span className="w-8 text-base sm:w-8 sm:text-lg font-semibold">
          {pageNumber} / {totalPages}
        </span>

        <button
          disabled={pageNumber === totalPages}
          onClick={() => setPageNumber(pageNumber + 1)}
          className="bg-gray-200 disabled:bg-gray-100 text-sm px-4 py-2 sm:text-base"
        >
          Siguiente
        </button>

        <select
          value={pageSize}
          onChange={(evt) => {
            setPageNumber(1);
            setPageSize(Number(evt.target.value));
          }}
          className="ml-3 w-20 text-base sm:w-8 sm:text-lg font-semibold"
        >
          <option value="2">2</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>

      {/* MODALS */}
      <LoginModal
        isOpen={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
      />

      <RegisterModal
        isOpen={openRegisterModal}
        onClose={() => setOpenRegisterModal(false)}
      />
    </div>
  );
}

export default ListProductsUserPage;

