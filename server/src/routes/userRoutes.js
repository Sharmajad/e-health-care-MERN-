/**
 * USER ROUTES — routes/userRoutes.js
 * ───────────────────────────────────
 * All routes require authentication (protect middleware).
 *
 * GET /api/users/profile  → Returns the logged-in user's profile object
 * PUT /api/users/update   → Partially updates the user's profile fields
 */

import express from "express"
import protect from "../middleware/authMiddleware.js"
import { updateUserProfile } from "../controllers/userController.js"

const router = express.Router()

// Returns the user object that was attached to req.user by the protect middleware
router.get("/profile", protect, (req, res) => {
  res.json({ user: req.user })
})

// Updates allowed profile fields (password/email/role are blocked in the controller)
router.put("/update", protect, updateUserProfile)

export default router
