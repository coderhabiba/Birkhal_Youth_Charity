import connectToDatabase from "@/lib/mongodb";

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
      return;
    } catch (err: any) {
      console.error(`[instrumentation] MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed:`, err.message);
      if (attempt < MAX_RETRIES) {
        console.log(`[instrumentation] Retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }
  console.error("[instrumentation] Could not pre-warm MongoDB after all retries. Pages will connect on-demand.");
}
