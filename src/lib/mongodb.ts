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
      // Atlas M0 free tier: keep the pool tiny to avoid exhausting the 500-connection limit
      maxPoolSize: 3,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 12000,
      // Short socket timeout so stale connections fail fast (8s) instead of blocking for 30s
      socketTimeoutMS: 8000,
      connectTimeoutMS: 12000,
      // Heartbeat every 8s — keeps connections alive before Atlas kills them at ~30s idle
      heartbeatFrequencyMS: 8000,
      // Close idle connections after 15s so Mongoose drops them before Atlas does (~30s)
      maxIdleTimeMS: 15000,
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
