/**
 * DOCTOR ROUTES — routes/doctorRoutes.js
 * ───────────────────────────────────────
 * Public routes — no authentication required.
 *
 * GET /api/doctors  → List doctors with optional filters:
 *                     ?city=Mumbai&speciality=Cardiologist
 *                     ?lat=19.0&lng=72.8  (enables geo-sort)
 *                     ?page=1&limit=10    (pagination)
 *
 * NOTE: getDoctorById and addDoctor routes exist in the controller
 * but are commented out here as they are not yet wired to the frontend.
 * Uncomment when needed:
 *   GET  /api/doctors/:id  → Get a single doctor by ID
 *   POST /api/doctors      → Create a doctor (admin / seed use)
 */

import express from "express"
import { getDoctors } from "../controllers/doctorController.js"

const router = express.Router()

router.get("/", getDoctors)

// router.get("/:id",  getDoctorById)  // Not yet used by the frontend
// router.post("/",    addDoctor)      // Admin/seeding use only

export default router
