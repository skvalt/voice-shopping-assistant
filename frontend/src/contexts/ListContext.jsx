import { createContext, useContext, useState } from "react";
import Api from "../api/Api";

const ListContext = createContext(null);

export function ListProvider({ children }) {
  const [list, setList] = useState([]);

  function addItem(item) {
    setList((prev) => {
      const exists = prev.find(
        (p) => p.name.toLowerCase() === item.name.toLowerCase()
      );
      if (exists) {
        return prev.map((p) =>
          p.name.toLowerCase() === item.name.toLowerCase()
            ? { ...p, qty: (p.qty || 1) + (item.qty || 1) }
            : p
        );
      }
      return [item, ...prev];
    });
  }

  function removeItem(name) {
    setList((prev) =>
      prev.filter((p) => p.name.toLowerCase() !== name.toLowerCase())
    );
  }

  function updateQty(name, qty) {
    if (qty <= 0) {
      removeItem(name);
      return;
    }

    setList((prev) =>
      prev.map((p) =>
        p.name.toLowerCase() === name.toLowerCase() ? { ...p, qty } : p
      )
    );
  }

  function applyBackendAction(actionData) {
    if (!actionData) return;

    const { action, name, qty, price } = actionData;

    if (action === "add") {
      addItem({ name, qty: qty || 1, price: price || 0 });
    }
    if (action === "remove") removeItem(name);
    if (action === "update_qty") updateQty(name, qty);
  }

  return (
    <ListContext.Provider
      value={{
        list,
        addItem,
        removeItem,
        updateQty,
        applyBackendAction,
      }}
    >
      {children}
    </ListContext.Provider>
  );
}

export function useList() {
  return useContext(ListContext);
}
