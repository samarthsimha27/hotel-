import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// DB Config and Middlewares
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route Handlers
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import billRoutes from './routes/billRoutes.js';

// Dynamically resolve absolute path to backend/.env
// This ensures environment variables load perfectly regardless of where you execute the launch command!
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Establish core Express application
const app = express();

// Secure cross-origin header requests from our frontend dev servers
app.use(cors());

// Parse incoming HTTP raw JSON payloads
app.use(express.json());

// Boot database template logger
connectDB();

// Bind Root Audit API endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: "LEGACY GRAND HOTEL REST API Cockpit - Secure Operational Node Active."
  });
});

// Map Operational Module Routers
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/bills', billRoutes);

// central error interception hooks
app.use(notFound);
app.use(errorHandler);

// Launch Node Service
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("=========================================================");
  console.log(`LEGACY GRAND HOTEL BACKEND ONLINE ON PORT: ${PORT}`);
  console.log(`Auditor Portal URL: http://localhost:${PORT}/api`);
  console.log(`Active Environment: Mongoose MongoDB connection established.`);
  console.log("=========================================================");
});
