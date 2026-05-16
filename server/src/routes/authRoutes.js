/**
 * AUTH ROUTES — routes/authRoutes.js
 * ─────────────────────────────────
 * POST /api/auth/register → Create a new user account
 * POST /api/auth/login    → Authenticate and receive a JWT
 *
 * These routes are public (no auth middleware required).
 */

import express from "express"
import { registerUser, loginUser } from "../controllers/authController.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/login",    loginUser)

export default router
