import multer from "multer"
import fs from "fs"
import Report from "../models/Report.js"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/"
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png"]
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(new Error("Only PDF, JPG, PNG allowed"))
  },
})

const JHARKHAND_HOSPITALS = {
  Ranchi:     ["RIMS", "Medanta Hospital Ranchi", "AIIMS Ranchi", "CIP Kanke", "Orchid Medical Centre"],
  Jamshedpur: ["Tata Main Hospital (TMH)", "MGM Medical College Hospital", "Brahmanand Narayana Hospital"],
  Dhanbad:    ["SNMMCH Saraidhela", "PMCH Dhanbad", "Apollo Clinic Dhanbad"],
  Bokaro:     ["Bokaro General Hospital", "SAIL Bokaro Steel Hospital"],
  Hazaribagh: ["Sadar Hospital Hazaribagh", "Hazaribagh Medical College"],
  Deoghar:    ["AIIMS Deoghar", "Sadar Hospital Deoghar"],
}

export const analyzeReport = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" })
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path)
    const city = req.body.city || "Ranchi"
    const mock = getMockAnalysis(city)
    res.json({ analysis: mock.analysis })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const analyzeAndRecommend = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" })
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path)
    const city = req.body.city || "Ranchi"
    const mock = getMockAnalysis(city)
    res.json(mock)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getRecommendations = async (req, res) => {
  try {
    const { symptoms, age, gender, city } = req.body
    if (!symptoms) return res.status(400).json({ message: "Symptoms are required" })
    const mock = getMockRecommendations(symptoms, age, gender, city)
    res.json(mock)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const uploadReport = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" })
    const report = await Report.create({
      userId:   req.user._id,
      fileName: req.file.originalname,
      fileUrl:  "/uploads/" + req.file.filename,
      type:     "report",
    })
    res.json({
      message: "Report uploaded successfully",
      fileName: report.fileName,
      fileUrl:  report.fileUrl,
      uploadedAt: report.uploadedAt,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const uploadPrescription = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" })
    const prescription = await Report.create({
      userId:   req.user._id,
      fileName: req.file.originalname,
      fileUrl:  "/uploads/" + req.file.filename,
      type:     "prescription",
    })
    res.json({
      message: "Prescription uploaded successfully",
      fileName: prescription.fileName,
      fileUrl:  prescription.fileUrl,
      uploadedAt: prescription.uploadedAt,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({
      userId: req.user._id,
      type: "report"
    }).sort({ uploadedAt: -1 })
    res.json(reports)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Report.find({
      userId: req.user._id,
      type: "prescription"
    }).sort({ uploadedAt: -1 })
    res.json(prescriptions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getMockAnalysis = (city) => {
  const hospitals = JHARKHAND_HOSPITALS[city] || JHARKHAND_HOSPITALS["Ranchi"]
  return {
    analysis: "Report Analysis:\n\n1. Key Findings: Slightly elevated blood glucose (126 mg/dL). Hemoglobin at 11.2 g/dL indicates mild anaemia. Blood pressure 138/88 mmHg is borderline high.\n\n2. Abnormal Values:\n- Blood Glucose: 126 mg/dL (Normal: 70-100) HIGH\n- Hemoglobin: 11.2 g/dL (Normal: 13.5-17.5) LOW\n- Blood Pressure: 138/88 mmHg BORDERLINE\n\n3. Discuss with doctor:\n- Elevated blood sugar may indicate pre-diabetes\n- Low hemoglobin needs iron supplements\n- Blood pressure needs regular monitoring",
    summary: "Report shows borderline diabetes, mild anaemia and elevated blood pressure.",
    specialists: [
      { speciality: "Endocrinologist", reason: "Elevated blood glucose needs diabetes evaluation", hospital: hospitals[0] },
      { speciality: "General Physician", reason: "Overall health assessment and BP management", hospital: hospitals[1] || hospitals[0] },
      { speciality: "Cardiologist", reason: "Borderline BP needs cardiac evaluation", hospital: hospitals[2] || hospitals[0] },
    ],
  }
}

const getMockRecommendations = (symptoms, age, gender, city) => {
  const hospitals = JHARKHAND_HOSPITALS[city] || JHARKHAND_HOSPITALS["Ranchi"]
  const s = symptoms.toLowerCase()
  if (s.includes("chest") || s.includes("heart")) return { summary: "Symptoms suggest cardiac condition.", specialists: [{ speciality: "Cardiologist", reason: "Chest symptoms need cardiac evaluation", hospital: hospitals[0] }, { speciality: "General Physician", reason: "Initial assessment needed", hospital: hospitals[1] || hospitals[0] }] }
  if (s.includes("skin") || s.includes("rash")) return { summary: "Symptoms indicate skin condition.", specialists: [{ speciality: "Dermatologist", reason: "Skin issues need dermatological evaluation", hospital: hospitals[0] }, { speciality: "General Physician", reason: "General assessment needed", hospital: hospitals[1] || hospitals[0] }] }
  if (s.includes("fever") || s.includes("cold")) return { summary: "Symptoms suggest respiratory infection.", specialists: [{ speciality: "General Physician", reason: "Fever needs general medical evaluation", hospital: hospitals[0] }, { speciality: "Pulmonologist", reason: "Respiratory symptoms need lung evaluation", hospital: hospitals[1] || hospitals[0] }] }
  if (s.includes("head") || s.includes("migraine")) return { summary: "Symptoms suggest neurological condition.", specialists: [{ speciality: "Neurologist", reason: "Headaches need neurological assessment", hospital: hospitals[0] }, { speciality: "General Physician", reason: "BP check and general evaluation", hospital: hospitals[1] || hospitals[0] }] }
  return { summary: "General medical evaluation recommended.", specialists: [{ speciality: "General Physician", reason: "Comprehensive health evaluation for your symptoms", hospital: hospitals[0] }, { speciality: "Internal Medicine", reason: "Detailed investigation needed", hospital: hospitals[1] || hospitals[0] }] }
}
