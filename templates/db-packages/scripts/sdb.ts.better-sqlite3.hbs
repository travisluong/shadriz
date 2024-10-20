import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import dotenv from "dotenv";
import { schema } from "@/lib/schema";

dotenv.config({ path: ".env.local" });

export async function openConnection() {
  const betterSqlite = new Database(process.env.DB_URL);
  const sdb = drizzle(betterSqlite, { schema, casing: "snake_case" });
  const closeConnection = async () => await betterSqlite.close();
  return {
    sdb,
    closeConnection,
  }
}