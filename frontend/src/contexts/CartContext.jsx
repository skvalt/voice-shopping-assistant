// src/contexts/CartContext.jsx
import { createContext, useContext, useState } from "react";
import Api from "../api/Api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total: 0 });

  // ----------------------------
  // INTERNAL: RECALCULATE TOTAL
  // ----------------------------
  function recalc(items) {
    return items.reduce(
      (sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 1),
      0
    );
  }

  // ----------------------------
  // LOAD CART FROM BACKEND
  // ----------------------------
  async function loadCart(userId) {
    const data = await Api.Cart.get(userId);
    const items = data?.items ?? [];
    setCart({ items, total: recalc(items) });
  }

  // ----------------------------
  // ADD TO CART (backend)
  // ----------------------------
  async function addToCart(item) {
    const updated = await Api.Cart.add(item);
    const items = updated?.items ?? [];
    setCart({ items, total: recalc(items) });
  }

  // ----------------------------
  // INCREMENT QUANTITY
  // ----------------------------
  async function increment(item) {
    const updated = await Api.Cart.updateQty(item.id, item.quantity + 1);
    const items = updated?.items ?? [];
    setCart({ items, total: recalc(items) });
  }

  // ----------------------------
  // DECREMENT QUANTITY
  // ----------------------------
  async function decrement(item) {
    const newQty = item.quantity - 1;
    if (newQty <= 0) {
      return remove(item);
    }

    const updated = await Api.Cart.updateQty(item.id, newQty);
    const items = updated?.items ?? [];
    setCart({ items, total: recalc(items) });
  }

  // ----------------------------
  // REMOVE ITEM
  // ----------------------------
  async function remove(item) {
    await Api.Cart.remove(item.id);
    const newItems = cart.items.filter((i) => i.id !== item.id);
    setCart({ items: newItems, total: recalc(newItems) });
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        loadCart,
        addToCart,
        increment,
        decrement,
        remove,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
