import { defineConfig } from 'drizzle-kit';
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  dialect: "sqlite",
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
