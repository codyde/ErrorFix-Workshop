import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface ProductRecommendationsProps {
  products: Product[];
}

export function ProductRecommendations({
  products,
}: ProductRecommendationsProps) {
  if (products.length === 0) return null;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-green-500">
        Related Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group"
          >
            <Card className="overflow-hidden border-0 bg-gray-800 transition-all hover:shadow-lg hover:shadow-green-500/20">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-700">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="pt-4 px-4">
                <h3 className="font-medium text-primary">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {product.category}
                </p>
                <p className="font-medium text-green-500">
                  ${product.price.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
