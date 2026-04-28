import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientName: { type: String },
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
  { timestamps: true }
)

export default mongoose.model("Appointment", appointmentSchema)
