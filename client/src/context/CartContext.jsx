import React, { createContext, useState, useEffect } from 'react';
import { getCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeFromCart as apiRemoveFromCart } from '../api/cartApi';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  // Load cart on mount or token change
  useEffect(() => {
    const loadCart = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setLoading(true);
        try {
          const response = await getCart();
          const dbItems = response.data.items || [];
          const mappedItems = dbItems.map(item => ({
            product: item.productId ? {
              ...item.productId,
              id: item.productId._id
            } : {},
            quantity: item.quantity
          })).filter(item => item.product.id);
          
          setCart({ items: mappedItems });
        } catch (err) {
          console.error("Failed to load cart from database:", err);
        } finally {
          setLoading(false);
        }
      } else {
        const saved = localStorage.getItem('neuroux_cart');
        setCart(saved ? JSON.parse(saved) : { items: [] });
      }
    };
    loadCart();
  }, [token]);

  // Sync to local storage only if NOT logged in
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      localStorage.setItem('neuroux_cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = async (product) => {
    const prodId = product._id || product.id;
    const storedToken = localStorage.getItem('token');
    
    // Track interaction (view/cart)
    if (storedToken) {
      import('../api/axiosInstance').then(m => {
        m.default.post('/interactions', { productId: prodId, type: 'cart' }).catch(e => console.error(e));
      });
    }

    if (storedToken) {
      try {
        const response = await apiAddToCart({ productId: prodId, quantity: 1 });
        const dbItems = response.data.items || [];
        const mappedItems = dbItems.map(item => ({
          product: item.productId ? {
            ...item.productId,
            id: item.productId._id
          } : {},
          quantity: item.quantity
        })).filter(item => item.product.id);
        setCart({ items: mappedItems });
      } catch (err) {
        console.error("Failed to add to database cart:", err);
      }
    } else {
      setCart((prev) => {
        const existing = prev.items.find((item) => item.product.id === prodId);
        if (existing) {
          return {
            items: prev.items.map((item) =>
              item.product.id === prodId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        }
        const normalizedProduct = { ...product, id: prodId };
        return {
          items: [...prev.items, { product: normalizedProduct, quantity: 1 }],
        };
      });
    }
  };

  const removeFromCart = async (productId) => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const response = await apiRemoveFromCart(productId);
        const dbItems = response.data.items || [];
        const mappedItems = dbItems.map(item => ({
          product: item.productId ? {
            ...item.productId,
            id: item.productId._id
          } : {},
          quantity: item.quantity
        })).filter(item => item.product.id);
        setCart({ items: mappedItems });
      } catch (err) {
        console.error("Failed to remove from database cart:", err);
      }
    } else {
      setCart((prev) => ({
        items: prev.items.filter((item) => item.product.id !== productId),
      }));
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const response = await apiUpdateCartItem({ productId, quantity });
        const dbItems = response.data.items || [];
        const mappedItems = dbItems.map(item => ({
          product: item.productId ? {
            ...item.productId,
            id: item.productId._id
          } : {},
          quantity: item.quantity
        })).filter(item => item.product.id);
        setCart({ items: mappedItems });
      } catch (err) {
        console.error("Failed to update database cart:", err);
      }
    } else {
      setCart((prev) => ({
        items: prev.items.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      }));
    }
  };

  const clearCart = () => {
    setCart({ items: [] });
    if (!localStorage.getItem('token')) {
      localStorage.removeItem('neuroux_cart');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
