"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { ProductGrid } from "@/components/product-grid";
import { FeaturedCollection } from "@/components/featured-collection";
import {
  ProductGridSkeleton,
  FeaturedProductsSkeleton,
} from "./ProductSkeleton";
// import * as Sentry from '@sentry/nextjs';
export function ClientProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to load products from the API
  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log("Loading products from API...");

      // BREAK-THIS: Ha - I've sabotaged you with a bad API call
      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error(
          `API error with /api/product: ${response.status} ${response.statusText}`,
        );
      }

      const allProducts = await response.json();

      // Filter featured products
      const featured = allProducts.filter(
        (product: Product) => product.featured,
      );

      console.log(
        `Loaded ${allProducts.length} products, ${featured.length} featured products`,
      );
      setProducts(allProducts);
      setFeaturedProducts(featured);
      setLoading(false);
    } catch (err) {
      // SENTRY-THIS: Ha - I'm catching your expceptions!
      // Sentry.captureException(err);
      console.error("Error loading products:", err);
      setError(`Failed to load products: ${String(err)}`);
      setLoading(false);
      throw err;
    }
  };

  // Load products on initial mount
  useEffect(() => {
    loadProducts();
  }, []);

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-green-500 text-xl">Error loading products</div>
        <div className="mt-2">{error}</div>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 mb-6">Loading featured products...</p>
            <FeaturedProductsSkeleton />
          </div>
          <div className="mt-16">
            <h2 className="text-4xl font-bold tracking-tight mb-8 text-green-500">
              All Products
            </h2>
            <ProductGridSkeleton />
          </div>
        </>
      ) : (
        <>
          <FeaturedCollection
            title="Featured Products"
            description="Unique artifacts from across the dimensions."
            products={featuredProducts}
          />
          <div className="container">
            <h2 className="text-4xl font-bold tracking-tight mb-8 text-green-500">
              All Products
            </h2>
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <p className="text-center py-10 text-gray-500">
                No products found
              </p>
            )}
          </div>
        </>
      )}
    </>
  );
}
