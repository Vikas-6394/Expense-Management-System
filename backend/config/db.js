const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    if (!uri || uri.trim() === '') {
      // Automatic embedded MongoDB fallback for seamless zero-config local run
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        uri = mongod.getUri();
        console.log('[DB] No MONGODB_URI provided. Initialized in-memory MongoDB server instance.');
      } catch (err) {
        console.warn('[DB] Could not start mongodb-memory-server, trying local mongodb fallback:', err.message);
        uri = 'mongodb://127.0.0.1:27017/expense_management';
      }
    }

    const conn = await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[DB] MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`[DB] Connection Error: ${error.message}`);
    // If local mongo connection fails and memory server wasn't tried, try memory server
    if (!mongod) {
      try {
        console.log('[DB] Attempting fallback to in-memory MongoDB...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        const fallbackUri = mongod.getUri();
        const conn = await mongoose.connect(fallbackUri);
        console.log(`[DB] MongoDB Connected (in-memory fallback): ${conn.connection.host}`);
        return conn;
      } catch (innerErr) {
        console.error('[DB] Memory fallback failed:', innerErr.message);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

const closeDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error('[DB] Error closing connection:', err);
  }
};

module.exports = { connectDB, closeDB };
