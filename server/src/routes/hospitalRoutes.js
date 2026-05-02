
import express from "express"
import { getHospitals, getHospitalById, getCities, getDepartmentsByHospital } from "../controllers/hospitalController.js"

const router = express.Router()

router.get("/",              getHospitals)
router.get("/cities",        getCities)
router.get("/:id",           getHospitalById)
router.get("/:id/departments", getDepartmentsByHospital)

export default router
