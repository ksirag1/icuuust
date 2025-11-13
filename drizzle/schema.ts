import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Building polygons table for campus map
export const buildingPolygons = mysqlTable("buildingPolygons", {
  id: int("id").autoincrement().primaryKey(),
  buildingId: int("buildingId").notNull(),
  buildingName: varchar("buildingName", { length: 255 }).notNull(),
  coordinates: text("coordinates").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BuildingPolygon = typeof buildingPolygons.$inferSelect;
export type InsertBuildingPolygon = typeof buildingPolygons.$inferInsert;

// Building layouts table
export const buildingLayouts = mysqlTable("buildingLayouts", {
  id: int("id").autoincrement().primaryKey(),
  buildingId: int("buildingId").notNull(),
  buildingName: varchar("buildingName", { length: 255 }).notNull(),
  width: int("width").notNull(),
  height: int("height").notNull(),
  gridSize: int("gridSize").default(20).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BuildingLayout = typeof buildingLayouts.$inferSelect;
export type InsertBuildingLayout = typeof buildingLayouts.$inferInsert;

// Building elements (rooms, stairs, etc.)
export const buildingElements = mysqlTable("buildingElements", {
  id: int("id").autoincrement().primaryKey(),
  layoutId: int("layoutId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["room", "auditorium", "stairs", "corridor", "toilet", "utility", "office"]).notNull(),
  x: int("x").notNull(),
  y: int("y").notNull(),
  width: int("width").notNull(),
  height: int("height").notNull(),
  floor: int("floor").default(1).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BuildingElement = typeof buildingElements.$inferSelect;
export type InsertBuildingElement = typeof buildingElements.$inferInsert;
