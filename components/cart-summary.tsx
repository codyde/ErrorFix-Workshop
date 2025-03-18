"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";

export function CartSummary() {
  const { totalPrice } = useCart();

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold mb-4 text-green-500">
          Order Summary
        </h2>
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Timeline Adjustment Charge
            </span>
            <span>Free</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Parallel Import Duty</span>
            <span>Calculated at checkout</span>
          </div>
          <Separator className="my-4 bg-gray-800" />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-green-500">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          <Link href="/checkout">
            Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
