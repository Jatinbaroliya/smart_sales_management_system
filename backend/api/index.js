import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectToDatabase } from '../src/utils/database.js';
import salesRoutes from '../src/routes/salesRoutes.js';
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// Health check endpoint (works without DB connection)
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API routes
app.use('/api/sales', salesRoutes);
// Initialize MongoDB connection (cached across invocations)
let isConnected = false;
let connectionPromise = null;
async function ensureDatabaseConnection() {
    if (isConnected) {
        return;
    }
    if (connectionPromise) {
        return connectionPromise;
    }
    connectionPromise = (async () => {
        try {
            await connectToDatabase();
            isConnected = true;
            console.log('✅ MongoDB connection established');
        }
        catch (error) {
            console.error('❌ MongoDB connection error:', error);
            isConnected = false;
            connectionPromise = null;
            throw error;
        }
    })();
    return connectionPromise;
}
// Vercel serverless function handler
// Vercel passes Node.js http.IncomingMessage and http.ServerResponse
export default async function handler(req, res) {
    // Handle health check without DB connection for faster response
    const url = req.url || req.path || '';
    if (url === '/health' || url.startsWith('/health')) {
        return new Promise((resolve) => {
            app(req, res, () => {
                if (!res.headersSent) {
                    res.status(404).json({ error: 'Not found' });
                }
                resolve();
            });
        });
    }
    // Ensure database connection before handling other requests
    try {
        await ensureDatabaseConnection();
    }
    catch (error) {
        console.error('Database connection failed:', error);
        if (!res.headersSent) {
            res.status(500).json({
                error: 'Database connection failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        return;
    }
    // Handle the request with Express app
    return new Promise((resolve) => {
        const next = () => {
            if (!res.headersSent) {
                res.status(404).json({ error: 'Not found' });
            }
            resolve();
        };
        app(req, res, next);
    });
}
//# sourceMappingURL=index.js.map