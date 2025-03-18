/**
 * FILE OVERVIEW:
 * Purpose: Define database schema for the application using Drizzle ORM
 * Key Concepts: Drizzle ORM, SQLite schema definitions, relations
 * Module Type: Schema
 * @ai_context: This file defines the database schema for the application, starting with products
 */

import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Products table schema
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  category: text("category").notNull(),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  inStock: integer("in_stock", { mode: "boolean" }).notNull().default(true),
  rating: real("rating"),
  reviewCount: integer("review_count").default(0),
  images: text("images", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
  sizes: text("sizes", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
  colors: text("colors", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
});

// Export types for TypeScript
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
