/**
 * FILE OVERVIEW:
 * Purpose: Configuration for Drizzle ORM migrations
 * Key Concepts: Drizzle ORM, Migrations, SQLite
 * Module Type: Configuration
 * @ai_context: This file configures Drizzle ORM's migration tools
 */

import { defineConfig } from "drizzle-kit";
import "dotenv/config";
import { resolve } from "path";

const dbPath = resolve(process.cwd(), "sqlite.db");

export default defineConfig({
  dialect: "sqlite",
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dbCredentials: {
    url: `file:${dbPath}`,
  },
  verbose: true,
  strict: true,
});
