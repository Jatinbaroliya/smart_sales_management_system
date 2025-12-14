import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectToDatabase } from '../src/utils/database.js';
import salesRoutes from '../src/routes/salesRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/sales', salesRoutes);

// Initialize MongoDB connection (cached across invocations)
let isConnected = false;

async function ensureDatabaseConnection() {
  if (!isConnected) {
    try {
      await connectToDatabase();
      isConnected = true;
      console.log('✅ MongoDB connection established');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }
}

// Vercel serverless function handler
export default async function handler(
  req: express.Request,
  res: express.Response
): Promise<void> {
  // Ensure database connection before handling requests
  try {
    await ensureDatabaseConnection();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
    return;
  }

  // Handle the request with Express app
  app(req, res, () => {
    if (!res.headersSent) {
      res.status(404).json({ error: 'Not found' });
    }
  });
}

