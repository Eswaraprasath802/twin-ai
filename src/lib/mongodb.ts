import { MongoClient, type Db } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB ?? "twin_ai";

type MongoCache = {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
  db: Db | null;
};

const globalForMongo = globalThis as typeof globalThis & {
  __twinAiMongoCache?: MongoCache;
};

const cache: MongoCache = globalForMongo.__twinAiMongoCache ?? {
  client: null,
  promise: null,
  db: null,
};

if (!globalForMongo.__twinAiMongoCache) {
  globalForMongo.__twinAiMongoCache = cache;
}

export async function connectToDatabase() {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (cache.client && cache.db) {
    return { client: cache.client, db: cache.db };
  }

  try {
    if (!cache.promise) {
      cache.promise = new MongoClient(mongoUri).connect();
    }

    const client = await cache.promise;
    const db = client.db(databaseName);

    cache.client = client;
    cache.db = db;

    return { client, db };
  } catch (error) {
    cache.client = null;
    cache.db = null;
    cache.promise = null;
    throw error;
  }
}
