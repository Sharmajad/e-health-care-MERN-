import Anthropic from "@anthropic-ai/sdk"
import multer from "multer"
import fs from "fs"
import path from "path"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    const fileData = fs.readFileSync(req.file.path)
    const base64 = fileData.toString("base64")
    const mediaType = req.file.mimetype

    const isPdf = mediaType === "application/pdf"

    const messageContent = isPdf
      ? [
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } },
          { type: "text", text: "Analyze this medical report. Provide: 1) Key findings in simple language 2) Any abnormal values 3) What the patient should discuss with their doctor. Keep it clear and easy to understand for a non-medical person." }
        ]
      : [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: "Analyze this medical report image. Provide: 1) Key findings in simple language 2) Any abnormal values 3) What the patient should discuss with their doctor. Keep it clear and easy to understand for a non-medical person." }
        ]

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: messageContent }],
    })

    fs.unlinkSync(req.file.path)

    res.json({ analysis: response.content[0].text })

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path)
    res.status(500).json({ message: error.message })
  }
}

export const analyzeAndRecommend = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    const city = req.body.city || "Ranchi"
    const hospitals = JHARKHAND_HOSPITALS[city] || JHARKHAND_HOSPITALS["Ranchi"]

    const fileData = fs.readFileSync(req.file.path)
    const base64 = fileData.toString("base64")
    const mediaType = req.file.mimetype
    const isPdf = mediaType === "application/pdf"

    const prompt = `Analyze this medical report and respond in JSON format only with no extra text:
{
  "analysis": "plain english summary of the report findings",
  "summary": "one sentence summary of main health concern",
  "specialists": [
    { "speciality": "specialist type", "reason": "why this specialist", "hospital": "hospital name" },
    { "speciality": "specialist type", "reason": "why this specialist", "hospital": "hospital name" }
  ]
}
Available hospitals in ${city}: ${hospitals.join(", ")}
Keep analysis simple for non-medical readers. Recommend 2-3 specialists.`

    const messageContent = isPdf
      ? [
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } },
          { type: "text", text: prompt }
        ]
      : [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
          { type: "text", text: prompt }
        ]

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: messageContent }],
    })

    fs.unlinkSync(req.file.path)

    const text = response.content[0].text
    const clean = text.replace(/```json|```/g, "").trim()
    const result = JSON.parse(clean)

    res.json(result)

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path)
    res.status(500).json({ message: error.message })
  }
}

export const getRecommendations = async (req, res) => {
  try {
    const { symptoms, age, gender, city } = req.body

    if (!symptoms) {
      return res.status(400).json({ message: "Symptoms are required" })
    }

    const hospitals = JHARKHAND_HOSPITALS[city] || JHARKHAND_HOSPITALS["Ranchi"]

    const prompt = `A ${age} year old ${gender} patient in ${city}, Jharkhand has these symptoms: ${symptoms}

Respond in JSON format only with no extra text:
{
  "summary": "one sentence explanation of likely condition",
  "specialists": [
    { "speciality": "specialist type", "reason": "why this specialist is needed", "hospital": "hospital name from the list" },
    { "speciality": "specialist type", "reason": "why this specialist is needed", "hospital": "hospital name from the list" }
  ]
}
Available hospitals in ${city}: ${hospitals.join(", ")}
Recommend 2-3 specialists. Keep reasons simple for non-medical readers.`

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    })

    const text = response.content[0].text
    const clean = text.replace(/```json|```/g, "").trim()
    const result = JSON.parse(clean)

    res.json(result)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }
    res.json({
      message: "Report uploaded successfully",
      fileName: req.file.originalname,
      fileUrl: "/uploads/" + req.file.filename,
      uploadedAt: new Date(),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const uploadPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }
    res.json({
      message: "Prescription uploaded successfully",
      fileName: req.file.originalname,
      fileUrl: "/uploads/" + req.file.filename,
      uploadedAt: new Date(),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
