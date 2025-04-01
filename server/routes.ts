import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints
  const apiRouter = express.Router();
  
  // Activities endpoint (global feed)
  apiRouter.get("/activities", async (req, res) => {
    try {
      log("Getting activities...");
      const activities = await storage.getActivities();
      log(`Found ${activities.length} activities`);
      res.json(activities);
    } catch (error) {
      log(`Error fetching activities: ${error instanceof Error ? error.message : String(error)}`, "error");
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });
  
  // Single child endpoint
  apiRouter.get("/children/:id", async (req, res) => {
    try {
      const childId = parseInt(req.params.id);
      log(`Getting child with ID: ${childId}`);
      const child = await storage.getChild(childId);
      
      if (!child) {
        log(`Child not found with ID: ${childId}`, "warn");
        return res.status(404).json({ message: "Child not found" });
      }
      
      res.json(child);
    } catch (error) {
      log(`Error fetching child: ${error instanceof Error ? error.message : String(error)}`, "error");
      res.status(500).json({ message: "Failed to fetch child" });
    }
  });
  
  // Child activities endpoint
  apiRouter.get("/children/:id/activities", async (req, res) => {
    try {
      const childId = parseInt(req.params.id);
      log(`Getting activities for child with ID: ${childId}`);
      const activities = await storage.getChildActivities(childId);
      log(`Found ${activities.length} activities for child ${childId}`);
      res.json(activities);
    } catch (error) {
      log(`Error fetching child activities: ${error instanceof Error ? error.message : String(error)}`, "error");
      res.status(500).json({ message: "Failed to fetch child activities" });
    }
  });
  
  // Classmates endpoint
  apiRouter.get("/classmates", async (req, res) => {
    try {
      log("Getting classmates...");
      const classmates = await storage.getClassmates();
      log(`Found ${classmates.length} classmates`);
      res.json(classmates);
    } catch (error) {
      log(`Error fetching classmates: ${error instanceof Error ? error.message : String(error)}`, "error");
      res.status(500).json({ message: "Failed to fetch classmates" });
    }
  });
  
  // Directory endpoint
  apiRouter.get("/directory", async (req, res) => {
    try {
      log("Getting contacts...");
      const contacts = await storage.getContacts();
      log(`Found ${contacts.length} contacts`);
      res.json(contacts);
    } catch (error) {
      log(`Error fetching directory: ${error instanceof Error ? error.message : String(error)}`, "error");
      res.status(500).json({ message: "Failed to fetch directory" });
    }
  });

  // Mount API routes
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
