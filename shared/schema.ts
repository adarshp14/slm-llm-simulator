import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const modelComparisons = pgTable("model_comparisons", {
  id: serial("id").primaryKey(),
  smallModelResponse: text("small_model_response").notNull(),
  largeModelResponse: text("large_model_response").notNull(),
  prompt: text("prompt").notNull(),
  smallModelTime: integer("small_model_time").notNull(),
  largeModelTime: integer("large_model_time").notNull(),
  smallModelCost: integer("small_model_cost").notNull(),
  largeModelCost: integer("large_model_cost").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertModelComparisonSchema = createInsertSchema(modelComparisons).omit({
  id: true,
  createdAt: true
});

export type InsertModelComparison = z.infer<typeof insertModelComparisonSchema>;
export type ModelComparison = typeof modelComparisons.$inferSelect;
