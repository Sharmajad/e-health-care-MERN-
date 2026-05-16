/**
 * REPORT ROUTES — routes/reportRoutes.js
 * ─────────────────────────────────────────
 * All routes require authentication (protect middleware).
 * This router is mounted on THREE paths in app.js:
 *   /api/report      → Document management (used by Profile.jsx)
 *   /api/aiRecomend  → AI analysis (used by AIRecommend.jsx)
 *   /api/ai          → Legacy alias (backwards compatibility)
 *
 * ─── Legacy / Gemini Endpoints ────────────────────────────────
 * POST /analyze                → Save a pre-computed analysis text as a record
 * POST /analyze-and-recommend  → Upload file → Gemini analysis → save record
 * POST /recommend              → Send symptoms text → Gemini recommendation
 *
 * ─── Document Management ──────────────────────────────────────
 * POST /upload                 → Upload and store a medical report file
 * POST /upload-prescription    → Upload and store a prescription file
 * GET  /my-reports             → Fetch all report records for the logged-in user
 * GET  /my-prescriptions       → Fetch all prescription records for the logged-in user
 * DELETE /:id                  → Delete a report record and its file
 *
 * ─── Primary AI Endpoints (Groq / LLaMA-3.1) ─────────────────
 * POST /analyze-symptoms       → Symptom text → AI analysis + nearest doctors
 * POST /analyze-report         → Upload file → OCR/parse → AI analysis + nearest doctors
 */

import express from "express"
import {
  analyzeReport,
  analyzeAndRecommend,
  getRecommendations,
  uploadReport,
  uploadPrescription,
  getMyReports,
  getMyPrescriptions,
  upload,
  analyzeSymptoms,
  analyzeReportNew,
  deleteReport
} from "../controllers/reportController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

// ── Legacy / Gemini endpoints ─────────────────────────────────────
router.post("/analyze",               protect, upload.single("report"),       analyzeReport)
router.post("/analyze-and-recommend", protect, upload.single("report"),       analyzeAndRecommend)
router.post("/recommend",             protect,                                getRecommendations)

// ── Document management ───────────────────────────────────────────
router.post("/upload",                protect, upload.single("report"),       uploadReport)
router.post("/upload-prescription",   protect, upload.single("prescription"), uploadPrescription)
router.get( "/my-reports",            protect,                                getMyReports)
router.get( "/my-prescriptions",      protect,                                getMyPrescriptions)
router.delete("/:id",                 protect,                                deleteReport)

// ── Primary AI endpoints (Groq / LLaMA-3.1) ─────────────────────
router.post("/analyze-symptoms", protect,                          analyzeSymptoms)
router.post("/analyze-report",   protect, upload.single("report"), analyzeReportNew)

export default router
