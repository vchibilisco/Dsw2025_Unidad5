const CART_KEY = 'cart';

// Recupera el carrito desde localStorage
export const getCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);

    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Error parsing cart from localStorage:', error);

    return [];
  }
};

// Guarda el carrito en localStorage
export const saveCart = (cartItems) => {
  if (!Array.isArray(cartItems)) {
    console.warn('saveCart recibió un valor no iterable:', cartItems);

    return;
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
};

// Agrega producto al carrito, sumando si ya existe,
// limitando la cantidad final al stock disponible.
export const addToCart = (product, quantity) => {

  // 1. Validación de entrada

  if (!product || typeof product.sku !== 'string' || quantity <= 0) {
    console.warn('addToCart recibió datos inválidos:', { product, quantity });

    return;
  }

  // Asegurarse de que tenemos el stock
  const stockAvailable = product.stockQuantity;

  if (typeof stockAvailable !== 'number' || stockAvailable <= 0) {
    console.warn('Producto sin stock disponible o stock no definido:', product.sku);

    return;
  }

  const cart = getCart();
  const existing = cart.find((item) => item.sku === product.sku);

  // 2. Calcular la cantidad total deseada y aplicar el límite

  // Cantidad actual del producto en el carrito (o 0 si es nuevo)
  const currentQuantity = existing ? existing.quantity : 0;

  // Cantidad que el usuario quiere tener después de esta adición
  const desiredQuantity = currentQuantity + quantity;

  // La cantidad final es el menor valor entre lo deseado y el stock disponible
  const finalQuantity = Math.min(desiredQuantity, stockAvailable);

  // 3. Opcional: Mostrar advertencia si se aplicó el límite
  if (finalQuantity < desiredQuantity) {
    console.warn(
      `Se ha limitado la cantidad de ${product.name} a ${finalQuantity} unidades debido al stock disponible.`,
    );
  }

  // 4. Actualizar el carrito solo si la cantidad final es mayor que 0
  if (finalQuantity > 0) {

    const updatedCart = existing
      ? cart.map((item) =>
        item.sku === product.sku
          ? { ...item, quantity: finalQuantity } // Usar la cantidad limitada
          : item,
      )
      : [...cart, { ...product, quantity: finalQuantity }];

    saveCart(updatedCart);
  }
};

// Elimina producto por SKU
export const removeFromCart = (sku) => {
  if (!sku || typeof sku !== 'string') {

    console.warn('removeFromCart recibió SKU inválido:', sku);

    return;
  }

  const cart = getCart();

  const updatedCart = cart.filter((item) => item.sku !== sku);

  saveCart(updatedCart);
};

// Actualiza cantidad, elimina si es 0 o menos
export const updateCartItemQuantity = (sku, quantity) => {
  if (!sku || typeof sku !== 'string') {

    console.warn('updateCartItemQuantity recibió SKU inválido:', sku);

    return;
  }

  const cart = getCart();

  const updatedCart = quantity > 0
    ? cart.map((item) =>
      item.sku === sku ? { ...item, quantity } : item,
    )
    : cart.filter((item) => item.sku !== sku); // elimina si cantidad <= 0

  saveCart(updatedCart);
};

// Limpia el carrito completamente
export const clearCart = () => {

  localStorage.removeItem(CART_KEY);
};