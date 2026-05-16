/**
 * ================================================================
 * APPOINTMENT CONTROLLER — controllers/appointmentController.js
 * ================================================================
 * Manages the full appointment lifecycle for authenticated patients.
 *
 * bookAppointment         POST /api/appointments
 *   Creates a new appointment record linked to the logged-in user.
 *
 * getMyAppointments       GET  /api/appointments/my
 *   Returns all appointments for the logged-in patient (newest first).
 *
 * updateAppointmentStatus PUT  /api/appointments/:id/status
 *   Allows changing the status (e.g. confirmed → completed).
 *   Only the owning patient can update.
 *
 * cancelAppointment       PUT  /api/appointments/:id/cancel
 *   Sets status to "cancelled". Only the owning patient can cancel.
 *
 * rescheduleAppointment   PUT  /api/appointments/:id/reschedule
 *   Updates date and time, resets status back to "pending".
 *   Only the owning patient can reschedule.
 * ================================================================
 */

import Appointment from "../models/Appointment.js"

/**
 * POST /api/appointments
 * Books a new appointment for the authenticated user.
 */
export const bookAppointment = async (req, res) => {
  try {
    const {
      patientName, patientPhone, patientAge, patientGender,
      city, hospital, doctorName,
      speciality, date, time,
      consultType, problem, isEmergency, fee
    } = req.body

    // Date and time are the minimum required to create a valid appointment
    if (!date || !time) {
      return res.status(400).json({ message: "Date and time are required" })
    }

    const appointment = await Appointment.create({
      patientId:     req.user.id,                   // Set from the authenticated JWT
      patientName:   patientName || req.user.name,  // Fall back to the account name
      patientPhone,
      patientAge,
      patientGender,
      city,
      hospital,
      doctorName,
      speciality,
      date,
      time,
      consultType:   consultType || "inperson",
      problem:       problem || "",
      isEmergency:   isEmergency || false,
      fee:           fee || 0,
      status:        "pending",
    })

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * GET /api/appointments/my
 * Retrieves all appointments belonging to the authenticated user.
 */
export const getMyAppointments = async (req, res) => {
  try {
    // Sort newest-first so the dashboard always shows upcoming appointments at top
    const appointments = await Appointment.find({ patientId: req.user.id })
      .sort({ createdAt: -1 })

    res.json(appointments)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * PUT /api/appointments/:id/status
 * Updates the status of an appointment (e.g. pending → confirmed).
 * Only the appointment's owner is allowed to change its status.
 */
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const appointment = await Appointment.findById(id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    // Prevent one user from modifying another user's appointment
    if (appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    appointment.status = status
    await appointment.save()

    res.json({ message: "Status updated", appointment })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * PUT /api/appointments/:id/cancel
 * Cancels an appointment by setting its status to "cancelled".
 * Only the appointment's owner is allowed to cancel.
 */
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params

    const appointment = await Appointment.findById(id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    // Ownership check
    if (appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    appointment.status = "cancelled"
    await appointment.save()

    res.json({ message: "Appointment cancelled successfully" })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * PUT /api/appointments/:id/reschedule
 * Updates the date and time of an appointment and resets its status
 * back to "pending" (awaiting re-confirmation).
 * Only the appointment's owner is allowed to reschedule.
 */
export const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params
    const { date, time } = req.body

    if (!date || !time) {
      return res.status(400).json({ message: "Date and time are required" })
    }

    const appointment = await Appointment.findById(id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    // Ownership check
    if (appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    appointment.date = date
    appointment.time = time
    // Rescheduling resets to "pending" — requires fresh confirmation from the clinic
    appointment.status = "pending"
    await appointment.save()

    res.json({ message: "Appointment rescheduled successfully", appointment })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
