/**
 * ================================================================
 * GEMINI AI CONFIGURATION — config/gemini.js
 * ================================================================
 * Initialises the Google Generative AI SDK and exports a ready-to-use
 * model instance (gemini-2.5-flash) for use in report analysis.
 *
 * NOTE: The Gemini model is used by the older analyzeAndRecommend and
 * getRecommendations controllers. The newer AI flows (analyzeSymptoms,
 * analyzeReportNew) use Groq (llama-3.1-8b-instant) instead.
 *
 * Requires GEMINI_API_KEY in the .env file.
 * ================================================================
 */

import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv"

dotenv.config()

// Create the Generative AI client with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Export a pre-configured model instance for reuse across controllers
export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
