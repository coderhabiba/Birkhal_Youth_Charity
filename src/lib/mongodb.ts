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

  // If a good connection exists, return it immediately
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If connection dropped or errored, force a full reconnect
  if (cached.conn && mongoose.connection.readyState !== 1) {
    console.warn(`[mongodb] Connection state ${mongoose.connection.readyState} — forcing reconnect`);
    try { await mongoose.disconnect(); } catch (_) {}
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      // Atlas M0 free tier: keep pool tiny to stay within 500-connection limit
      maxPoolSize: 3,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      // timeoutMS is the modern replacement for socketTimeoutMS (driver v5+)
      // Sets an overall 15-second limit on any single database operation
      timeoutMS: 15000,
      // heartbeatFrequencyMS: monitor server health every 10s
      heartbeatFrequencyMS: 10000,
      // Close idle connections after 20s
      maxIdleTimeMS: 20000,
      family: 4,
      retryWrites: true,
      retryReads: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((m) => {
      m.connection.on('disconnected', () => {
        console.warn('[mongodb] Disconnected — will reconnect on next request');
        cached.conn = null;
        cached.promise = null;
      });
      m.connection.on('error', (err) => {
        console.error('[mongodb] Connection error:', err.message);
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
