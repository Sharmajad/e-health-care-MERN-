import express from "express"
import {
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} from "../controllers/appointmentController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/",           protect, bookAppointment)
router.get("/my",          protect, getMyAppointments)
router.put("/:id/status",  protect, updateAppointmentStatus)
router.put("/:id/cancel",  protect, cancelAppointment)

export default router
