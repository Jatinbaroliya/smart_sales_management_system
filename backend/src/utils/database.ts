import mongoose from 'mongoose';

// Persist cached connection across module reloads / serverless warm invocations
type GlobalWithMongoose = typeof globalThis & {
  __mongooseCachedConnection?: typeof mongoose | null;
};

const globalWithMongoose = globalThis as GlobalWithMongoose;

let cachedConnection: typeof mongoose | null = globalWithMongoose.__mongooseCachedConnection ?? null;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cachedConnection && cachedConnection.connection.readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cachedConnection;
  }

  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    throw new Error('Please define the MONGO_URI environment variable in .env file');
  }

  try {
    // Add connection timeout and options for faster connection
    const connection = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log('✅ Connected to MongoDB Atlas');
    cachedConnection = connection;
    globalWithMongoose.__mongooseCachedConnection = cachedConnection;
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    // Clear cache on error so it retries next time
    cachedConnection = null;
    globalWithMongoose.__mongooseCachedConnection = null;
    throw error;
  }
}

export async function disconnectFromDatabase(): Promise<void> {
  if (cachedConnection) {
    await mongoose.disconnect();
    cachedConnection = null;
    globalWithMongoose.__mongooseCachedConnection = null;
    console.log('Disconnected from MongoDB');
  }
}

