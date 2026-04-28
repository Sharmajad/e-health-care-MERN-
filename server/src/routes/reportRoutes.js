import express from "express"
import {
  analyzeReport,
  analyzeAndRecommend,
  getRecommendations,
  uploadReport,
  uploadPrescription,
  upload,
} from "../controllers/reportController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/analyze",              protect, upload.single("report"),       analyzeReport)
router.post("/analyze-and-recommend",protect, upload.single("report"),       analyzeAndRecommend)
router.post("/recommend",            protect,                                getRecommendations)
router.post("/upload",               protect, upload.single("report"),       uploadReport)
router.post("/upload-prescription",  protect, upload.single("prescription"), uploadPrescription)

export default router
