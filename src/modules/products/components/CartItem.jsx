import Card from '../../shared/components/Card';
import { useState } from 'react';
import { addToCart } from '../Context/cartStorage';

const CartItem = ({ product }) => {
  const [quantity, setQuantity] = useState(0);

  const handleAdd = () => {

    if (quantity > 0) {
      addToCart(product, quantity);
      setQuantity(0);
    }
  };

  if (!product || typeof product !== 'object') {
    //'CartItem recibió un producto inválido

    return null;
  }

  const { name, currentUnitPrice, stockQuantity} = product;

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const newQuantity = prev + delta;

      if (delta > 0) {
        // Lógica de restricción para AUMENTAR:
        // La nueva cantidad será el valor más bajo entre el stock y la nueva cantidad deseada.
        return Math.min(stockQuantity, newQuantity);
      } else {
        // Lógica de restricción para DISMINUIR:
        // La nueva cantidad debe ser como mínimo 0.
        return Math.max(0, newQuantity);
      }
    });
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
          <div className="font-semibold text-gray-800 text-sm sm:text-base truncate
                    text-center sm:text-left lg:text-center">
            {name ?? 'Producto sin nombre'}
          </div>
        </div>

        {/* Precio + controles */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:justify-between lg:justify-start px-3 pb-3 gap-2">
          {/* Precio */}
          <div className="text-gray-600 text-sm sm:text-base text-center sm:text-left lg:text-center lg:w-full">
            ${currentUnitPrice?.toFixed(2)}
          </div>

          {/* Botones */}
          <div className="flex items-center gap-2 whitespace-nowrap lg:justify-center lg:w-full">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="px-2 py-1 text-lg bg-gray-200 rounded hover:bg-gray-300"
            >
              −
            </button>
            <span className="min-w-[20px] text-center">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className={`px-2 py-1 text-lg rounded transition 
                ${quantity >= stockQuantity 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-200 hover:bg-gray-300'}`}
              disabled={quantity >= stockQuantity}
            >
              +
            </button>
            <button
              onClick={handleAdd}
              className={`transition px-2 py-1 rounded text-sm
                ${quantity === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-200 hover:bg-purple-300'}`}
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