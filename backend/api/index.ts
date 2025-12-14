import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { connectToDatabase } from '../src/utils/database.js';
import salesRoutes from '../src/routes/salesRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint (NO database connection needed - fast response)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Initialize MongoDB connection (cached across invocations)
let connectionPromise: Promise<void> | null = null;

async function ensureDatabaseConnection(): Promise<void> {
  if (connectionPromise) {
    await connectionPromise;
    return;
  }

  connectionPromise = (async () => {
    try {
      await connectToDatabase();
      console.log('✅ MongoDB connection established');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      connectionPromise = null; // Reset so it can retry
      throw error;
    }
  })();

  await connectionPromise;
}

// Middleware to ensure DB connection ONLY for API routes that need it
app.use('/api', async (_req, _res, next) => {
  try {
    await ensureDatabaseConnection();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    if (!_res.headersSent) {
      _res.status(500).json({ 
        error: 'Database connection failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    return; // Stop further processing
  }
});

// API routes (these will use the DB connection middleware above)
app.use('/api/sales', salesRoutes);

// Error handler (must have 4 parameters to be recognized as error handler)
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  if (!res.headersSent) {
    res.status(500).json({ 
      error: 'Internal server error', 
      message: err.message || 'An unexpected error occurred'
    });
  }
});

// 404 handler
app.use((_req: express.Request, res: express.Response) => {
  if (!res.headersSent) {
    res.status(404).json({ error: 'Not found' });
  }
});

// Export serverless handler
export default serverless(app);

