const mongoose = require('mongoose');

/**
 * Connects to MongoDB using MONGO_URI.
 * The app is allowed to boot even if this fails (see server.js) so that a
 * developer can still hit /api/health while they fix their connection —
 * every other route will simply fail with a clear "database unavailable"
 * style error until the connection is restored.
 */
const connectDB = async () => {
  mongoose.set('strictQuery', true);

  const conn = await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 8000,
  });

  console.log(`✔ MongoDB connected → ${conn.connection.host}/${conn.connection.name}`);

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠ MongoDB disconnected');
  });

  return conn;
};

module.exports = connectDB;
