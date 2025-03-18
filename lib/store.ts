import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AUTH_CONFIG = {
  authHeaderName: "Authorization",
  tokenPrefix: "Bearer",
};

export const resetAppState = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("cart");
  }
};

interface PurchaseState {
  processingPurchase: boolean;
  purchaseComplete: boolean;
  purchaseError: string | null;
  makePurchase: (paymentDetails: {
    items: Array<{ id: string; price: number; name: string }>;
    totalAmount: number;
  }) => Promise<{ success: boolean; error?: string }>;
  resetPurchaseState: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          // First validate the email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            return {
              success: false,
              error: "Invalid email format. Please try again.",
            };
          }

          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              [AUTH_CONFIG.authHeaderName]:
                "Basic " + btoa(`${email}:${password}`),
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            return {
              success: false,
              error:
                "Authentication failed. Please check your credentials and try again.",
            };
          }

          const data = await response.json();

          if (data.user) {
            set({ user: data.user, isAuthenticated: true });
            return { success: true };
          } else {
            return {
              success: false,
              error: "Invalid credentials. Please try again.",
            };
          }
        } catch (error) {
          console.error("Login error:", error);
          return {
            success: false,
            error: "An error occurred during login. Please try again later.",
          };
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
        resetAppState();
        setTimeout(() => {
          usePurchaseStore.getState().resetPurchaseState();
        }, 0);
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);

export const usePurchaseStore = create<PurchaseState>()((set) => ({
  processingPurchase: false,
  purchaseComplete: false,
  purchaseError: null,

  makePurchase: async (paymentDetails: {
    items: Array<{ id: string; price: number; name: string }>;
    totalAmount: number;
  }) => {
    set({ processingPurchase: true, purchaseError: null });

    try {
      const authState = useAuthStore.getState();

      const response = await fetch("/api/checkout/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authState.isAuthenticated && authState.user
            ? {
                [AUTH_CONFIG.authHeaderName]: `${AUTH_CONFIG.tokenPrefix} ${authState.user.id}`,
              }
            : {}),
        },
        body: JSON.stringify(paymentDetails),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred during checkout.");
      }

      set({
        processingPurchase: false,
        purchaseComplete: true,
      });

      return { success: true };
    } catch (error: any) {
      console.error("Purchase error:", error);
      set({
        processingPurchase: false,
        purchaseError: error.message || "Payment processing failed",
      });

      return {
        success: false,
        error: error.message || "Payment processing failed. Please try again.",
      };
    }
  },

  resetPurchaseState: () => {
    set({
      processingPurchase: false,
      purchaseComplete: false,
      purchaseError: null,
    });
  },
}));
