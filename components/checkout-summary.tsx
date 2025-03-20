'use client';

import { useCart } from '@/context/cart-context';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

export function CheckoutSummary() {
  const { items, totalPrice } = useCart();
  
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold mb-4 text-red-500">Order Summary</h2>
        
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3">
              <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-primary-foreground">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.selectedSize} / {item.selectedColor}
                </p>
                <p className="text-sm font-medium mt-1 text-red-500">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Separator className="mb-4 bg-gray-800" />
        
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Error Insurance</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bug Tax</span>
            <span>$0.00</span>
          </div>
          <Separator className="my-4 bg-gray-800" />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-red-500">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
