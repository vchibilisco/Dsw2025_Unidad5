import { useState, useEffect } from "react";

const CART_KEY = "cart";

export function useCart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) setCart(JSON.parse(stored));
  }, []);

  const save = (items) => {
    setCart(items);
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  };

  const addToCart = (product, quantity) => {
    if (quantity < 1) return alert("Debes agregar al menos 1 producto.");

    const updated = [...cart];
    const existing = updated.find((i) => i.sku === product.sku);

    if (existing) {
      existing.quantity += quantity;
    } else {
      updated.push({
        ...product,
        quantity,
      });
    }

    save(updated);
  };

  const removeFromCart = (sku) => {
    save(cart.filter((i) => i.sku !== sku));
  };

  const clearCart = () => {
    localStorage.removeItem(CART_KEY);
    setCart([]);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
  };
}
