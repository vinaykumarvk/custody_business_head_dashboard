import express from "express";
import session from "express-session";
import { createServer } from "http";
import path from "path";
import { json } from "express";
import { log, setupVite } from "./vite";
import { registerRoutes } from "./routes";

async function main() {
  const app = express();
  
  // Configure JSON middleware
  app.use(json());
  
  // Configure CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  
  // Session configuration
  app.use(
    session({
      secret: "your-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false },
    }),
  );
  
  // Bind to 0.0.0.0 to allow external access when deployed
  const server = createServer(app);
  const PORT = process.env.PORT || 5000;

  // Register API routes
  await registerRoutes(app);
  
  // Setup Vite or static file serving
  await setupVite(app, server);
  
  // Error handling middleware
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  });
  
  // Start the server
  server.listen(Number(PORT), '0.0.0.0', () => {
    log(`serving on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
