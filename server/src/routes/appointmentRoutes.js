import express from "express"
import {
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  rescheduleAppointment,
} from "../controllers/appointmentController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/",          protect, bookAppointment)
router.get("/my",         protect, getMyAppointments)
router.put("/:id/status", protect, updateAppointmentStatus)
router.put("/:id/cancel", protect, cancelAppointment)
router.put("/:id/reschedule", protect, rescheduleAppointment)

export default router
