/**
 * FILE OVERVIEW:
 * Purpose: SERVER-ONLY database initialization and management
 * Key Concepts: SQLite, Drizzle ORM, Node.js
 * Module Type: Server Service
 * @ai_context: This module sets up database connections for server environments only
 */

import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import Database from "better-sqlite3";
import { join } from "path";

// Product type definition - shared with client
export type Product = {
  id: string | number;
  name: string;
  description: string;
  price: number;
  category: string;
  featured: boolean;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  images: string[];
  sizes?: string[];
  colors?: string[];
};

/**
 * Parse JSON safely from a string
 * This handles arrays stored as strings in the database
 */
export function safeJsonParse<T>(value: string | null | undefined | T): T {
  if (value === null || value === undefined) {
    return [] as unknown as T;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value) as T;
  } catch (e) {
    console.warn("Failed to parse JSON:", e);
    return [] as unknown as T;
  }
}

/**
 * Initialize the server-side database
 * This is only used in API routes and Server Components
 */
export async function initDb() {
  try {
    console.log("🔄 Server: Initializing database");

    // Create SQLite database file path
    const dbPath = join(process.cwd(), "sqlite.db");
    console.log(`SQLite database path: ${dbPath}`);

    // Initialize SQLite database connection
    const sqliteDB = new Database(dbPath);
    console.log("✅ Server: SQLite connection initialized");

    // Initialize Drizzle ORM
    const dbInstance = drizzle(sqliteDB, { schema });
    console.log("✅ Server: Drizzle ORM initialized with schema");

    return { db: dbInstance, sqlite: sqliteDB };
  } catch (error) {
    console.error("❌ Server: Database initialization failed:", error);
    throw error;
  }
}

// Export schema for convenience
export { schema };
