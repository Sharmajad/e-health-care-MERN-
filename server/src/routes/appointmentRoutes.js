/**
 * APPOINTMENT ROUTES — routes/appointmentRoutes.js
 * ─────────────────────────────────────────────────
 * All routes require authentication (protect middleware).
 *
 * POST /api/appointments              → Book a new appointment
 * GET  /api/appointments/my          → Get all appointments for the logged-in user
 * PUT  /api/appointments/:id/status  → Update appointment status (e.g. confirmed)
 * PUT  /api/appointments/:id/cancel  → Cancel an appointment
 * PUT  /api/appointments/:id/reschedule → Change date/time of an appointment
 */

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

router.post("/",                protect, bookAppointment)
router.get("/my",               protect, getMyAppointments)
router.put("/:id/status",       protect, updateAppointmentStatus)
router.put("/:id/cancel",       protect, cancelAppointment)
router.put("/:id/reschedule",   protect, rescheduleAppointment)

export default router
