import express from 'express';
import { getMenu, createMenuItem } from '../controllers/menuController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMenu);
router.post('/', protect, adminOnly, createMenuItem);

export default router;
