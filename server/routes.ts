import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPatientAccountSchema, updatePatientAccountSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get patient accounts for a session
  app.get("/api/accounts/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const accounts = await storage.getPatientAccountsBySession(sessionId);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patient accounts" });
    }
  });

  // Get specific patient account
  app.get("/api/accounts/detail/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const account = await storage.getPatientAccount(id);
      if (!account) {
        return res.status(404).json({ message: "Patient account not found" });
      }
      res.json(account);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patient account" });
    }
  });

  // Create new patient account
  app.post("/api/accounts", async (req, res) => {
    try {
      const validatedData = insertPatientAccountSchema.parse(req.body);
      const account = await storage.createPatientAccount(validatedData);
      res.status(201).json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create patient account" });
    }
  });

  // Update patient account
  app.patch("/api/accounts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updatePatientAccountSchema.parse(req.body);
      const account = await storage.updatePatientAccount(id, validatedData);
      if (!account) {
        return res.status(404).json({ message: "Patient account not found" });
      }
      res.json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update patient account" });
    }
  });

  // Delete patient account
  app.delete("/api/accounts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePatientAccount(id);
      if (!deleted) {
        return res.status(404).json({ message: "Patient account not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete patient account" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
