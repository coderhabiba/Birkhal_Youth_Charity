import mongoose from "mongoose";

// Global caching to prevent multiple connections in dev environment
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("MONGODB_URI environment variable is missing!");
    return null;
  }

  // Check if existing connection is still alive (readyState 1 = connected)
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If connection dropped, reset both conn and promise so we reconnect
  if (cached.conn && mongoose.connection.readyState !== 1) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 15000,
      // Heartbeat every 10s — keeps the connection alive on Atlas free tier
      heartbeatFrequencyMS: 10000,
      // Close idle connections after 25s (before Atlas kills them at ~30s)
      maxIdleTimeMS: 25000,
      family: 4,
      // Auto-retry on transient errors
      retryWrites: true,
      retryReads: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((m) => {
      // Reset cache on disconnect so the next request triggers a fresh connect
      m.connection.on('disconnected', () => {
        console.warn('[mongodb] Connection lost — will reconnect on next request');
        cached.conn = null;
        cached.promise = null;
      });
      return m;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.conn = null;
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;

