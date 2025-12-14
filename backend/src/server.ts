import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './utils/database.js';
import salesRoutes from './routes/salesRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/sales', salesRoutes);

// Initialize server
async function startServer() {
  try {
    // Connect to MongoDB Atlas
    console.log('Connecting to MongoDB Atlas...');
    await connectToDatabase();
    console.log('✅ MongoDB connection established');

    // Start the server and bind to the Render-supplied port so the service is reachable.
    // Always listen on the provided PORT (Render requires a bound port).
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
      console.log(`📊 Using MongoDB Atlas: salesDB.sales`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

