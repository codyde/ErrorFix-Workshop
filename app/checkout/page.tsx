"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckoutSummary } from "@/components/checkout-summary";
import { CreditCard, CheckCircle, Lock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore, usePurchaseStore } from "@/lib/store";
import { LoginDialog } from "@/components/login-dialog";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Auth state
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  // Purchase state
  const {
    processingPurchase,
    purchaseComplete,
    purchaseError,
    makePurchase,
    resetPurchaseState,
  } = usePurchaseStore();

  // Mock payment data state
  const [useMockPayment, setUseMockPayment] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  // Mock payment data
  const mockPaymentData = {
    cardNumber: "4242 4242 4242 4242",
    expiryDate: "12/25",
    cvv: "123",
    nameOnCard: "Rick Sanchez",
  };

  // Redirect if cart is empty or user is not authenticated
  useEffect(() => {
    if (items.length === 0 && !purchaseComplete) {
      router.push("/");
    }

    // If user is not authenticated, show login dialog
    if (!isAuthenticated) {
      setIsLoginOpen(true);
    }
  }, [items.length, purchaseComplete, router, isAuthenticated]);

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
      }));
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent checkout if not authenticated
    if (!isAuthenticated) {
      setIsLoginOpen(true);
      return;
    }

    // SENTRY-TEST-AREA: This function call can be modified to test Sentry error monitoring
    // Add breadcrumb for checkout attempt

    // Sentry.addBreadcrumb({
    //   category: 'checkout',
    //   message: `Attempting checkout with ${items.length} items`,
    //   level: 'info',
    //   data: {
    //     itemCount: items.length,
    //     itemDetails: items.map(item => ({ id: item.id, name: item.name, price: item.price })),
    //     totalAmount: totalPrice
    //   }
    // });

    try {
      const result = await makePurchase({
        items,
        totalAmount: totalPrice,
      });

      if (result.success) {
        clearCart();
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during checkout.",
        variant: "destructive",
      });
    }
  };

  if (purchaseComplete) {
    return (
      <div className="container max-w-md mx-auto py-16 flex flex-col items-center justify-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-900 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-center">Errors Fixed!</h1>
        <p className="text-muted-foreground text-center">
          Thank you for your purchase. We've sent a confirmation email with your
          purchase list.
        </p>
        <Button
          onClick={() => resetPurchaseState()}
          className="bg-green-600 hover:bg-green-700 text-white"
          asChild
        >
          <a href="/">Continue Shopping</a>
        </Button>
      </div>
    );
  }

  if (items.length === 0 && !purchaseComplete) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      {!isAuthenticated && (
        <div className="max-w-3xl mx-auto mb-6 p-4 border border-red-800 rounded-lg bg-red-900/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium text-red-200">Login Required</h2>
              <p className="text-sm text-red-300">
                You must be logged in to complete checkout
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsLoginOpen(true)}
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              Login
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-7 grid-rows-[30px_1fr] gap-8">
        <h1 className="lg:col-span-4 text-3xl text-center font-bold mb-6 text-red-500">
          Secure Checkout
        </h1>
        <div className="lg:col-span-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 p-4 border border-gray-800 rounded-lg">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">Contact Information</h2>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isAuthenticated}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 p-4 border border-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-red-500" />
                  <h2 className="text-xl font-semibold">Payment</h2>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useMockPayment"
                    checked={useMockPayment}
                    onCheckedChange={(checked) => {
                      setUseMockPayment(checked === true);
                      if (checked) {
                        setFormData((prev) => ({
                          ...prev,
                          cardNumber: mockPaymentData.cardNumber,
                          expiryDate: mockPaymentData.expiryDate,
                          cvv: mockPaymentData.cvv,
                          nameOnCard: mockPaymentData.nameOnCard,
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          cardNumber: "",
                          expiryDate: "",
                          cvv: "",
                          nameOnCard: "",
                        }));
                      }
                    }}
                    className="border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white"
                  />
                  <Label
                    htmlFor="useMockPayment"
                    className="text-sm cursor-pointer"
                  >
                    Use test payment data
                  </Label>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800 border-gray-700 pl-3 pr-10"
                    />
                    <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    For demo purposes, any card number will work.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">Security Code</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nameOnCard">Name on Card</Label>
                  <Input
                    id="nameOnCard"
                    value={formData.nameOnCard}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>
            </div>

            {purchaseError && (
              <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-400">{purchaseError}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              size="lg"
              disabled={processingPurchase || !isAuthenticated}
            >
              {!isAuthenticated
                ? "Login Required"
                : processingPurchase
                  ? "Processing..."
                  : `Pay $${totalPrice.toFixed(2)}`}
            </Button>

            <div className="flex items-center justify-center text-xs text-muted-foreground">
              <Lock className="h-3 w-3 mr-1" />
              <span>Secure checkout powered by ErrorFix</span>
            </div>
          </form>
        </div>

        <div className="lg:col-span-3">
          <CheckoutSummary />
        </div>
      </div>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </div>
  );
}
