import express from 'express';
import { getBookings, createBooking, deleteBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getBookings);
router.post('/', createBooking);
router.delete('/:id', deleteBooking);

export default router;
