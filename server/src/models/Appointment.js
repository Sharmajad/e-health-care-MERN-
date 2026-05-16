/**
 * ================================================================
 * APPOINTMENT MODEL — models/Appointment.js
 * ================================================================
 * Mongoose schema representing a patient's booked appointment.
 *
 * Fields:
 *  - patientId → reference to the User who booked (required)
 *  - patientName, patientPhone, patientAge, patientGender → snapshot
 *    of patient details at the time of booking (denormalised for speed)
 *  - city, hospital, speciality → selected facility details
 *  - doctorName → assigned doctor's name
 *  - date, time → appointment schedule (stored as strings, e.g. "2026-06-01", "10:00 AM")
 *  - consultType → "inperson" | "video" | "whatsapp"
 *  - problem → patient's stated reason / chief complaint
 *  - isEmergency → flag for priority appointments
 *  - fee → consultation fee at time of booking
 *  - status → lifecycle: "pending" → "confirmed" → "completed" | "cancelled"
 * ================================================================
 */

import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Denormalised patient snapshot — preserved even if the user updates their profile
    patientName:   { type: String },
    patientPhone:  { type: String },
    patientAge:    { type: String },
    patientGender: { type: String },

    // Facility and scheduling details
    city:        { type: String },
    hospital:    { type: String },
    speciality:  { type: String },
    date:        { type: String, required: true },
    time:        { type: String, required: true },
    consultType: {
      type: String,
      enum: ["inperson", "video", "whatsapp"],
      default: "inperson",
    },
    problem:     { type: String },
    isEmergency: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    doctorName:  { type: String },
    fee:         { type: Number },
  },
  { timestamps: true }  // Adds createdAt and updatedAt
)

export default mongoose.model("Appointment", appointmentSchema)
