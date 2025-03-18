"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { ProductDetails } from "@/components/product-details";
import { ProductRecommendations } from "@/components/product-recommendations";
import { notFound } from "next/navigation";
// import * as Sentry from '@sentry/nextjs';
interface ClientProductDetailProps {
  productId: string;
}

export function ClientProductDetail({ productId }: ClientProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProductData = async () => {
    try {
      setLoading(true);
      console.log(`Loading product ${productId} from API...`);

      const productResponse = await fetch(`/api/products/${productId}`);

      if (!productResponse.ok) {
        if (productResponse.status === 404) {
          notFound();
        }
        // Sentry.captureException(new Error(`API error: ${productResponse.status} ${productResponse.statusText}`));
        throw new Error(
          `Unable to reach product api for ${productId}: ${productResponse.status} ${productResponse.statusText}`,
        );
      }

      const productData = await productResponse.json();

      // Fetch all products for related items
      const allProductsResponse = await fetch("/api/products");

      if (!allProductsResponse.ok) {
        // Sentry.captureException(new Error(`API error: ${allProductsResponse.status} ${allProductsResponse.statusText}`));
        throw new Error(
          `Unable to reach product api for all products: ${allProductsResponse.status} ${allProductsResponse.statusText}`,
        );
      }

      const allProducts = await allProductsResponse.json();

      setProduct(productData);

      const related = allProducts
        .filter(
          (p: Product) =>
            p.category === productData.category && p.id !== productData.id,
        )
        .slice(0, 4);

      setRelatedProducts(related);
      setLoading(false);
    } catch (err) {
      console.error(`Error loading product ${productId}:`, err);
      setError(`Failed to load product: ${String(err)}`);
      setLoading(false);
      // Sentry.captureException(err);
      throw err;
    }
  };

  useEffect(() => {
    loadProductData();
  }, [productId]);

  if (loading) {
    return (
      <div className="container py-10">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-8" />
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-200 rounded mb-2" />
          <div className="h-4 bg-gray-200 rounded mb-2" />
          <div className="h-4 bg-gray-200 rounded mb-2" />
          <div className="h-8 bg-gray-200 rounded w-1/6 mt-8" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  return (
    <div className="container py-10 space-y-16">
      <ProductDetails product={product} />
      {relatedProducts.length > 0 && (
        <ProductRecommendations products={relatedProducts} />
      )}
    </div>
  );
}
