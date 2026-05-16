/**
 * ================================================================
 * REPORT CONTROLLER — controllers/reportController.js
 * ================================================================
 * Central hub for all AI-powered analysis and document management.
 *
 * TWO AI PROVIDERS are used:
 *  • Gemini (Google) — used by analyzeAndRecommend & getRecommendations
 *  • Groq / LLaMA-3.1 — used by analyzeSymptoms & analyzeReportNew
 *    (faster, structured JSON output, used for the main AI page)
 *
 * ENDPOINTS:
 *  analyzeReport          POST /api/report/analyze
 *    Saves a manually-passed analysis text as a Report record.
 *
 *  analyzeAndRecommend    POST /api/report/analyze-and-recommend
 *    Sends an uploaded file directly to Gemini, saves the result.
 *
 *  getRecommendations     POST /api/report/recommend
 *    Sends symptom text to Gemini, returns a recommendation string.
 *
 *  uploadReport           POST /api/report/upload
 *    Saves an uploaded file to disk and creates a Report record.
 *
 *  uploadPrescription     POST /api/report/upload-prescription
 *    Same as uploadReport but with type = "prescription".
 *
 *  getMyReports           GET  /api/report/my-reports
 *    Returns all "report" type documents for the logged-in user.
 *
 *  getMyPrescriptions     GET  /api/report/my-prescriptions
 *    Returns all "prescription" type documents for the logged-in user.
 *
 *  analyzeSymptoms        POST /api/aiRecomend/analyze-symptoms
 *    Main AI symptom checker — sends text to Groq/LLaMA, returns
 *    structured JSON (problem, severity, whatToDo, doctorType) +
 *    nearest matching doctors. Saves the result as a Report record.
 *
 *  analyzeReportNew       POST /api/aiRecomend/analyze-report
 *    Main AI file analyzer — extracts text from PDF/image/txt via
 *    pdf-parse or Tesseract OCR, then sends to Groq/LLaMA.
 *    Saves the result + the uploaded file as a Report record.
 *
 *  deleteReport           DELETE /api/report/:id
 *    Deletes a report record and its associated file from disk.
 *    Only the owning user may delete.
 * ================================================================
 */

import fs from "fs"
import path from "path"
import Report from "../models/Report.js"
import Doctor from "../models/Doctor.js"
import { model } from "../config/gemini.js"
import pdfParse from "pdf-parse"          // FIX: was incorrectly imported as a named export
import Tesseract from "tesseract.js"
import Groq from "groq-sdk"
import multer from "multer"

// ── Groq client (LLaMA-3.1) ────────────────────────────────────────
// Used by analyzeSymptoms and analyzeReportNew for structured JSON output
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Multer file upload configuration ───────────────────────────────
// Files are saved to the /uploads directory with a timestamp prefix
// to prevent filename collisions.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename:    (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
})
export const upload = multer({ storage })

// ── Speciality normalisation map ───────────────────────────────────
// Maps common symptom keywords to standard doctor speciality names
// so the AI's free-text output can be matched against the database.
const SPECIALITY_MAP = {
  "heart":   "Cardiologist",
  "skin":    "Dermatologist",
  "bone":    "Orthopedic",
  "brain":   "Neurologist",
  "stomach": "Gastroenterologist",
  "ear":     "ENT",
  "nose":    "ENT",
  "throat":  "ENT",
  "lung":    "Pulmonologist"
}

/**
 * Helper — fetches the nearest 3 doctors matching a given speciality.
 * Uses an aggregation $lookup to join hospital coordinates, then
 * applies the Haversine formula to sort by distance from the user.
 * Falls back to "General Physician" if no specialist is found.
 *
 * @param {string} doctorType  - Speciality from the AI response
 * @param {number} userLat     - User's latitude
 * @param {number} userLng     - User's longitude
 * @returns {Array}            - Up to 3 nearest doctor objects
 */
const getRecommendedDoctors = async (doctorType, userLat, userLng) => {
  try {
    const uLat = parseFloat(userLat);
    const uLng = parseFloat(userLng);

    console.log(`Searching for ${doctorType} near ${uLat}, ${uLng}`);

    // Normalise the AI's speciality string to a known DB value
    let normalizedType = doctorType || "General Physician";
    for (const [key, value] of Object.entries(SPECIALITY_MAP)) {
      if (normalizedType.toLowerCase().includes(key)) {
        normalizedType = value;
        break;
      }
    }

    // Aggregate: match by speciality, join hospital for coordinates
    const pipeline = [
      {
        $match: {
          speciality: { $regex: new RegExp(normalizedType, "i") }
        }
      },
      {
        $lookup: {
          from: "hospitals",
          localField: "hospital",
          foreignField: "name",
          as: "hospitalInfo"
        }
      },
      {
        $project: {
          name: 1, speciality: 1, hospital: 1, city: 1, image: 1, fee: 1,
          hLat: { $arrayElemAt: ["$hospitalInfo.lat", 0] },
          hLng: { $arrayElemAt: ["$hospitalInfo.lng", 0] }
        }
      }
    ];

    const doctors = await Doctor.aggregate(pipeline);

    if (!doctors.length) {
      // No specialist found — fall back to General Physician
      return await Doctor.aggregate([
        { $match: { speciality: /General Physician/i } },
        {
          $lookup: { from: "hospitals", localField: "hospital", foreignField: "name", as: "hospitalInfo" }
        },
        {
          $project: {
            _id: 1, name: 1, speciality: 1, hospital: 1, city: 1, image: 1, fee: 1,
            hLat: { $arrayElemAt: ["$hospitalInfo.lat", 0] },
            hLng: { $arrayElemAt: ["$hospitalInfo.lng", 0] }
          }
        },
        { $limit: 3 }
      ]);
    }

    // Compute Haversine distance for each doctor
    const processedDoctors = doctors.map(d => {
      const dLat = parseFloat(d.hLat);
      const dLng = parseFloat(d.hLng);

      if (isNaN(dLat) || isNaN(dLng) || isNaN(uLat) || isNaN(uLng)) {
        return { ...d, distance: "N/A" };
      }

      const radLat = (dLat - uLat) * Math.PI / 180;
      const radLng = (dLng - uLng) * Math.PI / 180;
      const a = Math.sin(radLat/2) * Math.sin(radLat/2) +
                Math.cos(uLat * Math.PI / 180) * Math.cos(dLat * Math.PI / 180) *
                Math.sin(radLng/2) * Math.sin(radLng/2);
      const distance = (6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1);
      return { ...d, distance: parseFloat(distance) };
    });

    // Return the 3 nearest doctors with valid coordinates
    return processedDoctors
      .filter(d => d.distance !== "N/A")
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);

  } catch (error) {
    console.error("Error in getRecommendedDoctors:", error);
    return [];
  }
};

// ─────────────────────────────────────────────────────────────────
// LEGACY ENDPOINTS (use Gemini)
// ─────────────────────────────────────────────────────────────────

/**
 * POST /api/report/analyze
 * Saves a pre-computed analysis text as a Report record.
 * The analysis text is provided in the request body (not a file).
 */
export const analyzeReport = async (req, res) => {
  try {
    const { analysis } = req.body
    const report = new Report({
      userId: req.user._id,
      fileName: "AI Analysis Report",
      fileUrl: "N/A",
      analysis,
      type: "report",
    })
    await report.save()
    res.status(201).json(report)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * POST /api/report/analyze-and-recommend
 * Uploads a file, sends it inline to Gemini for analysis,
 * saves the result, then deletes the temporary file.
 */
export const analyzeAndRecommend = async (req, res) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({ message: "Please upload a file" })
    }

    const prompt = "Analyze this medical report and give recommendations in simple terms."

    // Send the file contents directly to Gemini as base64-encoded inline data
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: fs.readFileSync(file.path).toString("base64"),
          mimeType: file.mimetype,
        },
      },
    ])

    const analysis = result.response.text()

    // Remove the temporary file after Gemini has processed it
    fs.unlinkSync(file.path)

    const report = new Report({
      userId: req.user._id,
      fileName: file.originalname,
      fileUrl: "AI Processed",
      analysis,
      type: "report",
    })
    await report.save()

    res.json({ analysis })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * POST /api/report/recommend
 * Sends a symptoms string to Gemini and returns plain-text recommendations.
 */
export const getRecommendations = async (req, res) => {
  try {
    const { symptoms } = req.body
    const prompt = `Based on these symptoms: ${symptoms}, recommend a specialist and give basic advice.`
    const result = await model.generateContent(prompt)
    res.json({ recommendations: result.response.text() })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────────────────────────
// DOCUMENT MANAGEMENT ENDPOINTS
// ─────────────────────────────────────────────────────────────────

/**
 * POST /api/report/upload
 * Saves an uploaded file to disk and creates a "report" Record.
 * The file stays on disk so it can be viewed later from the profile.
 */
export const uploadReport = async (req, res) => {
  try {
    const file = req.file
    const report = new Report({
      userId: req.user._id,
      fileName: file.originalname,
      fileUrl: file.filename,   // Store just the filename — served via /uploads/:filename
      type: "report",
    })
    await report.save()
    res.status(201).json(report)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * POST /api/report/upload-prescription
 * Same as uploadReport but creates a "prescription" record.
 */
export const uploadPrescription = async (req, res) => {
  try {
    const file = req.file
    const report = new Report({
      userId: req.user._id,
      fileName: file.originalname,
      fileUrl: file.filename,   // Store just the filename
      type: "prescription",
    })
    await report.save()
    res.status(201).json(report)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * GET /api/report/my-reports
 * Returns all "report" type documents for the logged-in user.
 */
export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id, type: "report" })
    res.json(reports)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * GET /api/report/my-prescriptions
 * Returns all "prescription" type documents for the logged-in user.
 */
export const getMyPrescriptions = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id, type: "prescription" })
    res.json(reports)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────────────────────────────
// PRIMARY AI ENDPOINTS (use Groq / LLaMA-3.1)
// ─────────────────────────────────────────────────────────────────

// Shared Groq prompt template used by both analyze-symptoms and analyze-report
const GROQ_PROMPT_TEMPLATE = (input) => `Act as a friendly medical assistant for non-medical users.

Explain the condition in VERY simple and easy language.

Respond ONLY in this JSON format:

{
  "problem": "Explain in 1-2 very simple sentences (like talking to a 10-year-old)",
  "whatItMeans": "Explain what is happening in the body in simple words",
  "severity": "Low | Medium | High",
  "whatToDo": ["simple step 1", "simple step 2", "simple step 3"],
  "doctorType": "General Physician | Cardiologist | Dermatologist | Neurologist | Orthopedic | ENT | Gastroenterologist | Pulmonologist"
}

Rules:
- Do NOT use medical jargon
- Use simple everyday words
- Keep sentences short
- Avoid complex terms like "hypertension", use "high blood pressure"
- Make it easy for a normal person to understand
- Always return valid JSON only
- If unsure, use "General Physician"

Input:
Patient Input:
${input}

Analyze carefully and choose the most relevant doctor specialization.`

// Default fallback response when the AI returns unparsable output
const AI_FALLBACK = {
  problem: "I couldn't fully understand that, but let's be safe.",
  whatItMeans: "Your body is showing some signs that need attention.",
  severity: "Medium",
  doctorType: "General Physician",
  whatToDo: ["Rest well", "Drink plenty of water", "Talk to a doctor"]
}

/**
 * POST /api/aiRecomend/analyze-symptoms
 * Main symptom checker endpoint (used by AIRecommend.jsx).
 * Accepts a symptoms string, calls Groq for structured analysis,
 * finds nearest matching doctors, and saves the result to DB.
 */
export const analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms, lat, lng } = req.body;
    if (!symptoms) return res.status(400).json({ success: false, message: "Symptoms are required" });

    // Send symptoms to Groq and request a structured JSON response
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: GROQ_PROMPT_TEMPLATE(symptoms) }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    // Parse the AI response — fall back gracefully if it's invalid JSON
    let aiResponse;
    try {
      aiResponse = JSON.parse(completion.choices[0].message.content);
    } catch (parseErr) {
      console.error("AI Parsing failed:", parseErr);
      aiResponse = AI_FALLBACK;
    }

    // Find nearest doctors matching the recommended speciality
    const doctors = await getRecommendedDoctors(aiResponse.doctorType, lat, lng);

    // Persist this symptom check to the user's history
    const report = new Report({
      userId: req.user._id,
      fileName: "Symptom Check: " + (symptoms.substring(0, 20)) + "...",
      fileUrl: "N/A",
      analysis: aiResponse.problem + "\n\n" + aiResponse.whatItMeans + "\n\nWhat to do: " + aiResponse.whatToDo.join(", "),
      type: "report",
    });
    await report.save();

    res.json({
      success: true,
      ...aiResponse,
      doctors,
      reportId: report._id
    });

  } catch (error) {
    console.error("Analyze Symptoms Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/aiRecomend/analyze-report
 * Main file analysis endpoint (used by AIRecommend.jsx).
 * Accepts a file upload (PDF, image, or plain text), extracts the text
 * using the appropriate method, then sends it to Groq for analysis.
 *
 * Text extraction methods:
 *  - PDF  → pdf-parse library
 *  - Image → Tesseract.js OCR (uses eng.traineddata in server root)
 *  - TXT  → fs.readFileSync
 *
 * The uploaded file is kept on disk (not deleted) so it can be
 * viewed by the user in their profile.
 */
export const analyzeReportNew = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    let extractedText = "";
    const filePath = req.file.path;

    // ── Extract text based on MIME type ──────────────────────────
    if (req.file.mimetype === "application/pdf") {
      // Parse the PDF buffer and extract its text content
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      extractedText = data.text;

    } else if (req.file.mimetype.startsWith("image/")) {
      // Use Tesseract OCR to read text from the image
      const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
      extractedText = text;

    } else if (req.file.mimetype === "text/plain") {
      // Plain text files can be read directly
      extractedText = fs.readFileSync(filePath, 'utf8');

    } else {
      return res.status(400).json({ success: false, message: "Unsupported file type" });
    }

    const { lat, lng } = req.body;

    // Send the extracted text to Groq for structured medical analysis
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: GROQ_PROMPT_TEMPLATE(extractedText) }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    // Parse AI response — graceful fallback on parse failure
    let aiResponse;
    try {
      aiResponse = JSON.parse(completion.choices[0].message.content);
    } catch (parseErr) {
      aiResponse = AI_FALLBACK;
    }

    // Find nearest matching doctors for the recommended speciality
    const doctors = await getRecommendedDoctors(aiResponse.doctorType, lat, lng);

    // Save the result to DB — the file stays on disk for profile viewing
    const report = new Report({
      userId: req.user._id,
      fileName: req.file.originalname,
      fileUrl: req.file.filename,  // Just the filename, served via /uploads/:filename
      analysis: aiResponse.problem + "\n\n" + aiResponse.whatItMeans + "\n\nWhat to do: " + aiResponse.whatToDo.join(", "),
      type: "report",
    });
    await report.save();

    // Note: File is intentionally NOT deleted here so it remains viewable in profile

    res.json({
      success: true,
      ...aiResponse,
      doctors,
      reportId: report._id
    });

  } catch (error) {
    console.error("Analyze Report Error:", error);
    // Clean up the uploaded file if an error occurred mid-processing
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/report/:id
 * Deletes a report record from the database and its associated
 * file from disk (if it exists and is a real file, not "N/A").
 * Only the owning user may delete their own records.
 */
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Ownership check — prevent deleting another user's records
    if (report.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this document" });
    }

    // Delete the physical file if one exists on disk
    if (report.fileUrl && report.fileUrl !== "N/A" && report.fileUrl !== "AI Processed") {
      // Normalise the path — handle both raw filenames and full paths
      const fileName = report.fileUrl
        .replace(/^.*[\\\/]uploads[\\\/]/, "")
        .replace(/^uploads[\\\/]/, "")
        .replace(/^\//, "")
      const filePath = path.join(process.cwd(), "uploads", fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Report.findByIdAndDelete(id);
    res.json({ message: "Document deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};