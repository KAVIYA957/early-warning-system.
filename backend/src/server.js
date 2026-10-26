import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`[Server] Early Warning System Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
    });

    const shutdown = async () => {
      console.log('\n[Server] Gracefully shutting down...');
      server.close(() => {
        console.log('[Server] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('[Server Fatal] Could not start server:', error.message);
    process.exit(1);
  }
}

startServer();
