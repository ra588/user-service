import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: MongoMemoryServer;

/**
 * Spin up an in-memory MongoDB instance for isolated, fast tests.
 * Each test suite connects to a fresh database.
 */
export const setupMemoryMongo = async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri(), { dbName: 'testdb' });
};

/**
 * Drop DB, close Mongoose connection and stop the in-memory server.
 */
export const teardownMemoryMongo = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongo) await mongo.stop();
};

/**
 * Clear all collections between tests to avoid data leakage.
 */
export const clearCollections = async () => {
  const { collections } = mongoose.connection;
  for (const name of Object.keys(collections)) {
    await collections[name].deleteMany({});
  }
};
