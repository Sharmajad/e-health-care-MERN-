
import mongoose from "mongoose"

const doctorSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    speciality:  { type: String, required: true },
    hospital:    { type: String, required: true },
    hospitalId:  { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
    city:        { type: String, required: true },
    experience:  { type: Number, default: 0 },
    fee:         { type: Number, default: 300 },
    rating:      { type: Number, default: 4.5 },
    available:   { type: Boolean, default: true },
    phone:       { type: String, default: "9876543210" },
    about:       { type: String, default: "" },
    languages:   [{ type: String }],
    slots: {
      type: [String],
      default: ["09:00 AM","10:00 AM","11:00 AM","12:00 PM","02:00 PM","03:00 PM","04:00 PM"],
    },
  },
  { timestamps: true }
)

doctorSchema.index({ city: 1, speciality: 1 })
doctorSchema.index({ hospital: 1 })

export default mongoose.model("Doctor", doctorSchema)