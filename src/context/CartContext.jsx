import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product) => {
        setCartItems(prev => [...prev, product]);
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.length;

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};
