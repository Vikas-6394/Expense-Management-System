const mongoose = require('mongoose');

const ATLAS_FALLBACK_URI = 'mongodb://vikasmaurya195771_db_user:VikasMaurya%402026@ac-mityf8k-shard-00-00.x0ddeac.mongodb.net:27017,ac-mityf8k-shard-00-01.x0ddeac.mongodb.net:27017,ac-mityf8k-shard-00-02.x0ddeac.mongodb.net:27017/expense_management?ssl=true&replicaSet=atlas-ph3ypf-shard-0&authSource=admin&retryWrites=true&w=majority';

const connectDB = async () => {
  if (mongoose.connection && mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }
  try {
    const uri = process.env.MONGODB_URI || ATLAS_FALLBACK_URI;

    const conn = await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`[DB] MongoDB Connected: ${conn.connection.host} (${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`[DB] Connection Error: ${error.message}`);
    throw error;
  }
};

const closeDB = async () => {
  try {
    await mongoose.connection.close();
  } catch (err) {
    console.error('[DB] Error closing connection:', err);
  }
};

module.exports = { connectDB, closeDB };
