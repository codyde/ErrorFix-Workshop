// @ts-nocheck

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
// import * as Sentry from '@sentry/nextjs';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  console.log(`🔍 API: Looking for product with ID ${id}`);

  try {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json(
        {
          error: `Invalid product ID: ${id}`,
          message: 'The product ID must be a valid number',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    // BREAK-THIS: Ha - I've sabotaged you with bad queries
    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, numId));

    if (result && result.length > 0) {
      const row = result[0];

      const product = {
        id: row.id,
        name: row.name,
        description: row.description,
        price: row.price,
        category: row.category,
        featured: row.featured,
        inStock: row.in_stock,
        rating: row.rating,
        reviewCount: row.review_count,
        images: parseJsonField(row.images),
        sizes: parseJsonField(row.sizes),
        colors: parseJsonField(row.colors),
      };

      return NextResponse.json(product);
    }

    return NextResponse.json(
      {
        error: `Product not found: ${id}`,
        message: 'The requested product does not exist in the database',
        code: 'PRODUCT_NOT_FOUND',
      },
      { status: 404 }
    );
  } catch (error) {
    console.error(`Loading error for product ${id}:`, error);

    // SENTRY-THIS: Cathing your exceptions!
    // Sentry.captureException(error);

    return NextResponse.json(
      {
        error: `Error loading product ${id}: ${error}`,
        message: 'An error occurred while fetching the product',
        code: 'PRODUCT_LOAD_ERROR',
      },
      { status: 500 }
    );
  }
}

/**
 * Helper function to parse JSON fields
 */
function parseJsonField(value: any): any[] {
  if (!value) return [];

  try {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  } catch (e) {
    console.error('Error parsing JSON field:', e);
    // Throw the error for standard error handling
    throw e;
    return [];
  }
}

// This is needed for Next.js static generation
export async function generateStaticParams() {
  const prods = await db.select().from(products);
  return prods.map((product: any) => ({
    id: product.id.toString(),
  }));
}
