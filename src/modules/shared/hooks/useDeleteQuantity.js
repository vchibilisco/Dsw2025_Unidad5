import { useState } from "react";

/**
 * Hook para manejar cantidades temporales que el usuario desea eliminar del carrito.
 */
export function useDeleteQuantity() {
  const [deleteQuantities, setDeleteQuantities] = useState({});

  const get = (sku) => deleteQuantities[sku] ?? 1;

  const increment = (sku, maxQty) =>
    setDeleteQuantities((prev) => ({
      ...prev,
      [sku]: Math.min(maxQty, get(sku) + 1),
    }));

  const decrement = (sku) =>
    setDeleteQuantities((prev) => ({
      ...prev,
      [sku]: Math.max(0, get(sku) - 1),
    }));

  const reset = (sku) =>
    setDeleteQuantities((prev) => ({ ...prev, [sku]: 0 }));

  return { deleteQuantities, get, increment, decrement, reset };
}
