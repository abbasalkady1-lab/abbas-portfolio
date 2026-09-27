import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  // Only throw in server context where DB writes are actually needed
  if (typeof window === "undefined") {
    console.warn("[MongoDB] MONGODB_URI environment variable is not set. Falling back to local JSON storage.");
  }
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use a module-level variable to cache the connection across hot reloads in dev
let cached: MongooseCache = (global as any).__mongoose_cache || { conn: null, promise: null };
(global as any).__mongoose_cache = cached;

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) return null;

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      })
      .then((m) => {
        console.log("[MongoDB] Connected successfully");
        return m;
      })
      .catch((err) => {
        console.error("[MongoDB] Connection failed:", err);
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export function isMongoAvailable(): boolean {
  return Boolean(MONGODB_URI);
}
