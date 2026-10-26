import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }
  const mongoUri = uri || process.env.MONGODB_URI || 'mongodb://localhost:27017/early_warning_system';
  
  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] Failed to connect to ${mongoUri}:`, error.message);
    throw error;
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('[MongoDB] Disconnected successfully');
  } catch (error) {
    console.error('[MongoDB Disconnect Error]:', error.message);
  }
}
