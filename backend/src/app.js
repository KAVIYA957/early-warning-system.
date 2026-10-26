import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import interventionRoutes from './routes/interventionRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// CORS configuration
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server) or matching origin
    if (!origin || origin === allowedOrigin || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive for local college prototype
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Early Warning System Backend API',
    database: dbStatus,
    version: '1.0.0',
    uptime: Math.floor(process.uptime()),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/interventions', interventionRoutes);
app.use('/api/support-requests', supportRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
