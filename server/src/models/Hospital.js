/**
 * ================================================================
 * HOSPITAL MODEL — models/Hospital.js
 * ================================================================
 * Mongoose schema representing a hospital or clinic.
 *
 * Fields:
 *  - name, city, address, phone → core identity
 *  - ambulance → ambulance contact number
 *  - lat, lng → GPS coordinates (used for distance calculations)
 *  - type → "Government" | "Private"
 *  - emergency → whether 24/7 emergency services are available
 *  - departments → array of department names (e.g. "Cardiology")
 *  - image → primary image URL
 *  - images → array of additional image URLs (gallery)
 *  - rating → star rating for display
 *  - popularity → numeric score for default sort ordering
 *
 * Indexed on city and name for fast lookup in geo-sort queries.
 * ================================================================
 */

import mongoose from "mongoose"

const hospitalSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true },
    city:      { type: String, required: true },
    address:   { type: String },
    phone:     { type: String },
    ambulance: { type: String },
    lat:       { type: Number },  // Latitude for geo-distance sorting
    lng:       { type: Number },  // Longitude for geo-distance sorting
    type:      { type: String, enum: ["Government", "Private"], default: "Government" },
    emergency: { type: Boolean, default: true },
    departments: [{ type: String }],
    image:     { type: String, default: "" },
    images:    [{ type: String }],
    rating:    { type: Number, default: 4.5 },
    popularity: { type: Number, default: 0 },  // Higher = appears first in default sort
  },
  { timestamps: true }
)

// Index for the most common query: filter hospitals by city
hospitalSchema.index({ city: 1 })
// Index used when joining doctors to their hospitals by name
hospitalSchema.index({ name: 1 })

export default mongoose.model("Hospital", hospitalSchema)
