"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { CartItem } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string, color: string) => void;
  updateQuantity: (
    id: string,
    size: string,
    color: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const toastRef = useRef(useToast());
  const initialized = useRef(false);
  const isClient = useRef(false);

  // Check if we're in the browser
  useEffect(() => {
    isClient.current = true;
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (isClient.current && !initialized.current) {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        try {
          setItems(JSON.parse(storedCart));
        } catch (error) {
          console.error("Failed to parse cart from localStorage", error);
        }
      }
      initialized.current = true;
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (isClient.current && initialized.current) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      // Check if item already exists with same id, size and color
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.id === newItem.id &&
          item.selectedSize === newItem.selectedSize &&
          item.selectedColor === newItem.selectedColor,
      );

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = JSON.parse(JSON.stringify(prevItems));
        updatedItems[existingItemIndex].quantity += newItem.quantity;

        if (isClient.current) {
          setTimeout(() => {
            toastRef.current.toast({
              title: "Cart updated",
              description: `${newItem.name} quantity updated in your cart.`,
            });
          }, 0);
        }

        return updatedItems;
      } else {
        // Add new item
        if (isClient.current) {
          setTimeout(() => {
            toastRef.current.toast({
              title: "Added to cart",
              description: `${newItem.name} added to your cart.`,
            });
          }, 0);
        }

        return [...prevItems, newItem];
      }
    });
  };

  const removeItem = (id: string, size: string, color: string) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find(
        (item) =>
          item.id === id &&
          item.selectedSize === size &&
          item.selectedColor === color,
      );

      if (itemToRemove && isClient.current) {
        setTimeout(() => {
          toastRef.current.toast({
            title: "Removed from cart",
            description: `${itemToRemove.name} removed from your cart.`,
          });
        }, 0);
      }

      return prevItems.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedSize === size &&
            item.selectedColor === color
          ),
      );
    });
  };

  const updateQuantity = (
    id: string,
    size: string,
    color: string,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeItem(id, size, color);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id &&
        item.selectedSize === size &&
        item.selectedColor === color
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

