'use client';

import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/types';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  
  return (
    <div className="flex items-start gap-4 p-4 border border-gray-800 rounded-lg bg-gray-900">
      <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          width={96}
          height={96}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-primary">{item.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">
          {item.selectedSize} / {item.selectedColor}
        </p>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-gray-700 bg-gray-800 hover:bg-gray-700"
            onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-gray-700 bg-gray-800 hover:bg-gray-700"
            onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <p className="font-medium text-green-500">${(item.price * item.quantity).toFixed(2)}</p>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-green-500"
          onClick={() => removeItem(item.id, item.selectedSize, item.selectedColor)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
