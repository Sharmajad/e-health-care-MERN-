/**
 * HOSPITAL ROUTES — routes/hospitalRoutes.js
 * ─────────────────────────────────────────────
 * Public routes — no authentication required.
 *
 * GET /api/hospitals              → List hospitals with optional filters:
 *                                   ?city=Mumbai
 *                                   ?lat=19.0&lng=72.8  (enables geo-sort)
 *                                   ?page=1&limit=10    (pagination)
 * GET /api/hospitals/cities       → Get all distinct city names (for dropdowns)
 * GET /api/hospitals/:id          → Get a single hospital by its ObjectId
 * GET /api/hospitals/:id/departments → Get the department list for a hospital
 */

import express from "express"
import {
  getHospitals,
  getHospitalById,
  getCities,
  getDepartmentsByHospital
} from "../controllers/hospitalController.js"

const router = express.Router()

router.get("/",                    getHospitals)
router.get("/cities",              getCities)
router.get("/:id",                 getHospitalById)
router.get("/:id/departments",     getDepartmentsByHospital)

export default router
