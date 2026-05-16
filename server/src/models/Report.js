/**
 * ================================================================
 * REPORT MODEL — models/Report.js
 * ================================================================
 * Mongoose schema for medical documents associated with a user.
 * Covers both uploaded files and AI-generated analysis records.
 *
 * Fields:
 *  - userId → reference to the owning User document (required)
 *  - fileName → original filename or a label like "Symptom Check: ..."
 *  - fileUrl → filename stored on disk, or "N/A" / "AI Processed"
 *              for AI-only records that have no physical file
 *  - analysis → the AI-generated plain-text analysis result
 *              (saved for symptom checks and file-based analysis)
 *  - type → "report" | "prescription"
 *  - uploadedAt → explicit date field (createdAt from timestamps also exists)
 * ================================================================
 */

import mongoose from "mongoose"

const reportSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName:  { type: String, required: true },
    fileUrl:   { type: String, required: true },  // "N/A" for AI-only records
    analysis:  { type: String, default: "" },     // AI-generated analysis text
    type:      { type: String, enum: ["report", "prescription"], default: "report" },
    uploadedAt:{ type: Date, default: Date.now },
  },
  { timestamps: true }
)

export default mongoose.model("Report", reportSchema)
