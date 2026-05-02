
import mongoose from "mongoose"

const hospitalSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true },
    city:      { type: String, required: true },
    address:   { type: String },
    phone:     { type: String },
    ambulance: { type: String },
    lat:       { type: Number },
    lng:       { type: Number },
    type:      { type: String, enum: ["Government", "Private"], default: "Government" },
    emergency: { type: Boolean, default: true },
    departments: [{ type: String }],
    image:     { type: String, default: "" },
  },
  { timestamps: true }
)

hospitalSchema.index({ city: 1 })
hospitalSchema.index({ city: 1 })
hospitalSchema.index({ name: 1 })

export default mongoose.model("Hospital", hospitalSchema)
