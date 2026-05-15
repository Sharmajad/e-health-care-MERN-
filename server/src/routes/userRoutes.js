import express from "express"
import protect from "../middleware/authMiddleware.js"
import { updateUserProfile } from "../controllers/userController.js"

const router = express.Router()

router.get("/profile", protect, (req, res) => {
  res.json({ user: req.user })
})

router.put("/update", protect, updateUserProfile)

export default router
