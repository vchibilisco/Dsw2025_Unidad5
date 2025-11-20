import Card from "../../shared/components/Card";
import { useState } from "react";
import { addToCart } from "../Context/cartStorage";

const CartItem = ({ product }) => {
  const [quantity, setQuantity] = useState(0);

  const handleAdd = () => {
    addToCart(product, quantity);
    setQuantity(0); 
  };


  

  if (!product || typeof product !== 'object') {
    console.warn('CartItem recibió un producto inválido:', product);

    return null;
  }

  const { name, currentUnitPrice, sku } = product;

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(0, prev + delta));
  };

 

  return (
    <Card className="w-full shadow-sm text-sm sm:text-base">
      <div className="flex flex-col gap-2">
        {/* Imagen genérica */}
        <img
          src="https://thumbs.dreamstime.com/b/sin-foto-ni-icono-de-imagen-en-blanco-cargar-im%C3%A1genes-o-falta-marca-no-disponible-pr%C3%B3xima-se%C3%B1al-silueta-naturaleza-simple-marco-215973362.jpg"
          alt={name}
          className="w-full h-32 object-cover rounded-t"
        />

        {/* Nombre del producto */}
        <div className="px-3 pt-2">
          <div className="font-semibold text-gray-800 text-sm sm:text-base text-center sm:text-left truncate">
            {name ?? 'Producto sin nombre'}
          </div>
        </div>

        {/* Precio + controles */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-between px-3 pb-3 gap-2">
          {/* Precio */}
          <div className="text-gray-600 text-sm sm:text-base text-center sm:text-left">
            ${currentUnitPrice?.toFixed(2)}
          </div>

          {/* Botones */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="px-3 py-1 text-lg bg-gray-200 rounded hover:bg-gray-300"
            >
              −
            </button>
            <span className="min-w-[24px] text-center">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="px-3 py-1 text-lg bg-gray-200 rounded hover:bg-gray-300"
            >
              +
            </button>
            <button
              onClick={handleAdd}
              className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 text-sm"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CartItem;