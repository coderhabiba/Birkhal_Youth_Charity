import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";

export async function register() {
  // Only run on the server
  if (typeof window !== 'undefined') return;

  console.log("[instrumentation] Pre-warming MongoDB connection on server startup...");
  
  // Retry loop: keep trying until MongoDB connects
  const MAX_RETRIES = 5;
  const RETRY_DELAY_MS = 3000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await connectToDatabase();
      console.log(`[instrumentation] MongoDB connected successfully on attempt ${attempt}`);
      break;
    } catch (err: any) {
      console.error(`[instrumentation] MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed:`, err.message);
      if (attempt < MAX_RETRIES) {
        console.log(`[instrumentation] Retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      } else {
        console.error("[instrumentation] Could not pre-warm MongoDB after all retries. Pages will connect on-demand.");
      }
    }
  }

  // Keep-alive: ping Atlas every 15s to prevent idle connection kills (Atlas M0 ~30s idle timeout)
  setInterval(async () => {
    try {
      const conn = mongoose.connection;
      if (conn.readyState === 1 && conn.db) {
        await conn.db.admin().ping();
      } else if (conn.readyState !== 2) {
        // Not connected and not connecting — trigger a reconnect
        await connectToDatabase();
      }
    } catch (_) {
      // Ping failed — connection will be reset on next request via the disconnected/error events
    }
  }, 15_000);
}
