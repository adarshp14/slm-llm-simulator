import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertModelComparisonSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Model comparison simulation endpoint
  app.post("/api/simulate", async (req, res) => {
    try {
      const data = insertModelComparisonSchema.parse(req.body);
      
      // Simulate response times (replace with actual API calls)
      const smallModelTime = Math.floor(Math.random() * 500) + 100;
      const largeModelTime = Math.floor(Math.random() * 1500) + 500;
      
      const result = await storage.createModelComparison({
        ...data,
        smallModelTime,
        largeModelTime,
        smallModelCost: Math.floor(smallModelTime * 0.001),
        largeModelCost: Math.floor(largeModelTime * 0.005)
      });
      
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  // Get recent comparisons
  app.get("/api/comparisons", async (_req, res) => {
    try {
      const comparisons = await storage.getRecentComparisons();
      res.json(comparisons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comparisons" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
