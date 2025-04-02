import express from "express";
import session from "express-session";
import { createServer } from "http";
import path from "path";
import { json } from "express";
import { log } from "./vite"; // Removed setupVite import as we'll no longer need it
import { registerRoutes } from "./routes";
// Define cors as a plain function since we don't have the package
function cors(options?: { origin?: string | string[]; methods?: string[] }) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const requestOrigin = req.headers.origin;
    const allowedOrigins = options?.origin || '*';

    // Set CORS headers
    if (typeof allowedOrigins === 'string') {
      res.header('Access-Control-Allow-Origin', allowedOrigins);
    } else if (Array.isArray(allowedOrigins) && requestOrigin) {
      if (allowedOrigins.includes(requestOrigin)) {
        res.header('Access-Control-Allow-Origin', requestOrigin);
      }
    }
    
    res.header('Access-Control-Allow-Methods', options?.methods?.join(',') || 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    next();
  };
}

async function main() {
  const app = express();
  
  // Configure JSON middleware
  app.use(json());
  
  // Configure CORS with specific origins - only Angular app now
  app.use(cors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  }));
  
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
