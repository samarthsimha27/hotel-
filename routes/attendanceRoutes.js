import express from 'express';
import { getAttendance, markAttendance, updateAttendance, deleteAttendance } from '../controllers/attendanceController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Attendance tracking requires full administrative access
router.use(protect);
router.use(adminOnly);

router.get('/', getAttendance);
router.post('/', markAttendance);
router.put('/:id', updateAttendance);
router.delete('/:id', deleteAttendance);

export default router;
