import mongoose from "mongoose"

const reportSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName:  { type: String, required: true },
    fileUrl:   { type: String, required: true },
    type:      { type: String, enum: ["report", "prescription"], default: "report" },
    uploadedAt:{ type: Date, default: Date.now },
  },
  { timestamps: true }
)

export default mongoose.model("Report", reportSchema)
