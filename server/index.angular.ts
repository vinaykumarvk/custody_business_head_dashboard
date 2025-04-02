import express, { Express } from "express";
import { createServer, Server } from "http";
// We'll implement cors middleware manually
import { registerRoutes } from "./routes";

// Configuration
const PORT = process.env.PORT || 5000;

// Manual CORS middleware
function corsMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  // Allow all origins for Replit environment
  const origin = req.headers.origin;
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
}

async function main() {
  // Create Express app
  const app: Express = express();
  const server: Server = createServer(app);

  // Middleware
  app.use(express.json());
  app.use(corsMiddleware);

  // Routes
  await registerRoutes(app);

  // Start server
  server.listen({
    port: Number(PORT),
    host: '0.0.0.0'
  }, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Available at http://0.0.0.0:${PORT}`);
    console.log("For Angular client, go to http://localhost:4200");
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});