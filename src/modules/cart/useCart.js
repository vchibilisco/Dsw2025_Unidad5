import { useState, useEffect } from 'react';

// Nombre de la clave en localStorage que pide el TPI
const CART_KEY = 'cart';

// Función para obtener los ítems del carrito desde localStorage
const getCartFromLocalStorage = () => {
    try {
        const storedCart = localStorage.getItem(CART_KEY);
        // Si no hay nada, devuelve un array vacío
        return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
        console.error('Error al leer el carrito de localStorage:', error);
        return [];
    }
};

// Función para guardar los ítems en localStorage
const saveCartToLocalStorage = (items) => {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
        
    } catch (error) {
        console.error('Error al guardar el carrito de localStorage:', error);
    }
};

export const useCart = () => {
    // Estado local para los ítems del carrito
    const [cartItems, setCartItems] = useState(getCartFromLocalStorage());

    // Effect para mantener la sincronización:
    // Cada vez que cartItems cambia, guarda en localStorage
    useEffect(() => {
        saveCartToLocalStorage(cartItems);
        // Ojo: Solo queremos que esto se ejecute cuando el estado interno (cartItems) cambia
    }, [cartItems]);

    // Función para agregar o incrementar la cantidad de un producto
    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item => item.id === product.id);

            console.log("Precio del producto", product.currentUnitPrice);

            if (existingItemIndex > -1) {
                // Producto ya existe, incrementamos cantidad
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity += quantity;
                return newItems;
            } else {
                // Nuevo producto, lo agregamos
                const newItem = {
                    id: product.id,
                    sku: product.sku,
                    name: product.name,
                    currentUnitPrice: product.currentUnitPrice,
                    quantity: quantity,
                };
                return [...prevItems, newItem];
            }
        });
    };

    // Función para remover completamente un producto del carrito
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    // Función para actualizar directamente la cantidad (usado en la vista del carrito)
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            // Si la nueva cantidad es 0 o menos, lo removemos
            removeFromCart(productId);
            return;
        }

        setCartItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item => item.id === productId);

            if (existingItemIndex > -1) {
                const newItems = [...prevItems];
                newItems[existingItemIndex].quantity = newQuantity;
                return newItems;
            }
            return prevItems;
        });
    };
    
    const clearCart = () => {
        setCartItems([]);
    };

    return {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount: cartItems.reduce((total, item) => total + item.quantity, 0),
        cartTotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    };
};