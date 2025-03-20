import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`} className="group">
          <Card className="overflow-hidden border-0 bg-gray-800 transition-all hover:shadow-lg hover:shadow-red-500/20">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-700">
              <Image
                src={product.images[0]}
                alt={product.name}
                width={500}
                height={500}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {product.featured && (
                <Badge className="absolute top-2 right-2 bg-red-600">Featured</Badge>
              )}
            </div>
            <CardContent className="pt-4 px-4">
              <h3 className="font-medium text-primary">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              <div className="flex items-center justify-between">
                <p className="font-medium text-red-500">${product.price.toFixed(2)}</p>
                <div className="flex items-center">
                  <span className="text-sm text-yellow-500 mr-1">★</span>
                  <span className="text-sm text-muted-foreground">{product.rating}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
