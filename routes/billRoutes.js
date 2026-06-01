import express from 'express';
import { getBills, createBill, deleteBill } from '../controllers/billController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Reading the sales register or deleting logs requires full Admin clearance
router.get('/', adminOnly, getBills);
router.delete('/:id', adminOnly, deleteBill);

// Adding invoices is allowed for Admins (POS checkout) and Customers (Summon order checkouts)
router.post('/', createBill);

export default router;
