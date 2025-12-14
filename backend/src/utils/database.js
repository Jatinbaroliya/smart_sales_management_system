import mongoose from 'mongoose';
const globalWithMongoose = globalThis;
let cachedConnection = globalWithMongoose.__mongooseCachedConnection ?? null;
export async function connectToDatabase() {
    if (cachedConnection) {
        console.log('Using cached MongoDB connection');
        return cachedConnection;
    }
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
        throw new Error('Please define the MONGO_URI environment variable in .env file');
    }
    try {
        const connection = await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');
        cachedConnection = connection;
        globalWithMongoose.__mongooseCachedConnection = cachedConnection;
        return connection;
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error);
        throw error;
    }
}
export async function disconnectFromDatabase() {
    if (cachedConnection) {
        await mongoose.disconnect();
        cachedConnection = null;
        globalWithMongoose.__mongooseCachedConnection = null;
        console.log('Disconnected from MongoDB');
    }
}
//# sourceMappingURL=database.js.map