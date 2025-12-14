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

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/sales', salesRoutes);

// Start server
async function startServer() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await connectToDatabase();
    console.log('✅ MongoDB connection established');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Using MongoDB Atlas: salesDB.sales`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
