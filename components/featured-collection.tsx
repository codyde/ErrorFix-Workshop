import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface FeaturedCollectionProps {
  title: string;
  description: string;
  products: Product[];
}

export function FeaturedCollection({
  title,
  description,
  products,
}: FeaturedCollectionProps) {
  return (
    <section id="featured" className="py-12 bg-gray-900">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold tracking-tight text-red-500">
              {title}
            </h2>
            <p className="mt-2 text-muted-foreground">{description}</p>
          </div>
          <Button
            variant="link"
            asChild
            className="mt-4 md:mt-0 p-0 text-red-500"
          >
            <Link href="/products/1" className="flex items-center text-lg">
              View all products <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group"
            >
              <Card className="overflow-hidden border-0 bg-gray-800 transition-all hover:shadow-lg hover:shadow-red-500/20">
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
                  <p className="font-medium text-red-500">
                    ${product.price.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
