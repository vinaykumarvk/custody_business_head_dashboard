import { log } from "console";
import express, { type Express } from "express";
import type { Server } from "http";
import path from "path";
import { createServer as createViteServer } from "vite";

export function log(message: string, source = "express") {
  const now = new Date();
  const time = now.toLocaleTimeString();
  console.log(`${time} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const isProd = process.env.NODE_ENV === "production";
  const frontendDir = path.resolve(
    process.cwd(),
    "..",
    isProd ? "client/dist" : "client",
  );

  if (isProd) {
    // In production, serve pre-built assets
    serveStatic(app);
  } else {
    // In development, use Vite's dev server
    const vite = await createViteServer({
      server: { middlewareMode: true },
      root: frontendDir,
      appType: "spa",
    });

    // Use vite's connect instance as middleware
    app.use(vite.middlewares);

    log("vite middleware active");
  }
}

export function serveStatic(app: Express) {
  const frontendDist = path.resolve(process.cwd(), "..", "client/dist");
  app.use(express.static(frontendDist));

  // Handle SPA routing by serving index.html for any non-API routes
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(frontendDist, "index.html"));
  });

  log("serving static files from " + frontendDist);
}
