import express, { json } from 'express';
import cors from 'cors';

import inventoryRoutes from './routes/inventoryRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import playwrightRoutes from './routes/playwrightRoutes.js';
import bggProxyRoutes from "./routes/bggProxyRoutes.js";
import filesRoutes from "./routes/filesRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Enable CORS for all requests
app.use(cors());

// Middleware
app.use(json());

// Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/playwright', playwrightRoutes); // Register Playwright routes
app.use("/api/bgg", bggProxyRoutes);
app.use("/api/files", filesRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
