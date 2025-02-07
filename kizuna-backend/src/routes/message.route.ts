import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { getUsersForSidebar, getAllMessages, sendMessage } from '../controllers/message.controller';

const router = express.Router()

router.get('/users', protect, getUsersForSidebar);
router.get('/:id', protect, getAllMessages)
router.post('/send/:id', protect, sendMessage)
export default router