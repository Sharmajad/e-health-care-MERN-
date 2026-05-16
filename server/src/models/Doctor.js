/**
 * ================================================================
 * DOCTOR MODEL — models/Doctor.js
 * ================================================================
 * Mongoose schema representing a doctor in the system.
 *
 * Fields:
 *  - name, speciality, hospital → core identity
 *  - hospitalId → ObjectId reference to the Hospital document
 *  - city → used for location-based filtering
 *  - experience → years of experience (for display)
 *  - fee → consultation fee in INR
 *  - rating → star rating (default 4.5)
 *  - available → whether the doctor is accepting appointments
 *  - phone → contact number shown on profile
 *  - about → short bio paragraph
 *  - languages → array of spoken languages
 *  - image → profile photo URL
 *  - slots → available time slots (array of strings like "09:00 AM")
 *
 * Indexed on (city, speciality), hospital, and available for fast
 * geo-filtered and specialty-filtered queries.
 * ================================================================
 */

import mongoose from "mongoose"

const doctorSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    speciality:  { type: String, required: true },
    hospital:    { type: String, required: true },         // Hospital name (used for $lookup join)
    hospitalId:  { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
    city:        { type: String, required: true },
    experience:  { type: Number, default: 0 },
    fee:         { type: Number, default: 300 },
    rating:      { type: Number, default: 4.5 },
    available:   { type: Boolean, default: true },
    phone:       { type: String, default: "9876543210" },
    about:       { type: String, default: "" },
    languages:   [{ type: String }],
    image:       { type: String, default: "" },
    slots: {
      type: [String],
      default: ["09:00 AM","10:00 AM","11:00 AM","12:00 PM","02:00 PM","03:00 PM","04:00 PM"],
    },
  },
  { timestamps: true }
)

// Compound index for the most common filter: city + speciality
doctorSchema.index({ city: 1, speciality: 1 })
// Index for joining/filtering by hospital name
doctorSchema.index({ hospital: 1 })
// Index for quickly finding only available doctors
doctorSchema.index({ available: 1 })

export default mongoose.model("Doctor", doctorSchema)