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

// Agrega producto al carrito, sumando si ya existe
export const addToCart = (product, quantity) => {

  if (!product || typeof product.sku !== 'string' || quantity <= 0) {
    console.warn('addToCart recibió datos inválidos:', { product, quantity });

    return;
  }

  const cart = getCart();

  const existing = cart.find((item) => item.sku === product.sku);

  const updatedCart = existing
    ? cart.map((item) =>
      item.sku === product.sku
        ? { ...item, quantity: item.quantity + quantity }
        : item,
    )
    : [...cart, { ...product, quantity }];

  saveCart(updatedCart);
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