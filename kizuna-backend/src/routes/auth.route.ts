import express from "express";
const router = express.Router();

import {signup, login, logout, updateProfile, checkAuth, verifyOTP} from '../controllers/auth.controller'
import { protect } from "../middleware/auth.middleware";

router.post('/signup', signup)
router.post('/login', login) 
router.post('/logout', logout)
router.post('/verify-otp', verifyOTP)
router.put('/update-profile', protect, updateProfile)
router.get('/check', protect, checkAuth)
export default router