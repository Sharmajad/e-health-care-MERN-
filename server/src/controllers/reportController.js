import fs from "fs"
import Report from "../models/Report.js"
import Doctor from "../models/Doctor.js"
import { model } from "../config/gemini.js"
import { PDFParse } from "pdf-parse"
import Tesseract from "tesseract.js"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Existing functions...
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

export const analyzeAndRecommend = async (req, res) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({ message: "Please upload a file" })
    }

    const prompt = "Analyze this medical report and give recommendations in simple terms."
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

export const uploadReport = async (req, res) => {
  try {
    const file = req.file
    const report = new Report({
      userId: req.user._id,
      fileName: file.originalname,
      fileUrl: file.filename, // Store just the filename
      type: "report",
    })
    await report.save()
    res.status(201).json(report)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const uploadPrescription = async (req, res) => {
  try {
    const file = req.file
    const report = new Report({
      userId: req.user._id,
      fileName: file.originalname,
      fileUrl: file.filename, // Store just the filename
      type: "prescription",
    })
    await report.save()
    res.status(201).json(report)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id, type: "report" })
    res.json(reports)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyPrescriptions = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id, type: "prescription" })
    res.json(reports)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

import multer from "multer"
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
})
export const upload = multer({ storage })

// Helper to get nearest doctors
const getRecommendedDoctors = async (doctorType, userLat, userLng) => {
  try {
    const uLat = parseFloat(userLat);
    const uLng = parseFloat(userLng);
    
    console.log(`Searching for ${doctorType} near ${uLat}, ${uLng}`);

    // Normalization mapping
    const mapping = {
      "heart": "Cardiologist",
      "skin": "Dermatologist",
      "bone": "Orthopedic",
      "brain": "Neurologist",
      "stomach": "Gastroenterologist",
      "ear": "ENT",
      "nose": "ENT",
      "throat": "ENT",
      "lung": "Pulmonologist"
    };

    let normalizedType = doctorType || "General Physician";
    for (const [key, value] of Object.entries(mapping)) {
      if (normalizedType.toLowerCase().includes(key)) {
        normalizedType = value;
        break;
      }
    }

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
      // Fallback to General Physician if no specific specialist found
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

    return processedDoctors
      .filter(d => d.distance !== "N/A")
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  } catch (error) {
    console.error("Error in getRecommendedDoctors:", error);
    return [];
  }
};

export const analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms, lat, lng } = req.body;
    if (!symptoms) return res.status(400).json({ success: false, message: "Symptoms are required" });

    const prompt = `Act as a friendly medical assistant for non-medical users.

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
${symptoms}

Analyze carefully and choose the most relevant doctor specialization.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    let aiResponse;
    try {
      aiResponse = JSON.parse(completion.choices[0].message.content);
    } catch (parseErr) {
      console.error("AI Parsing failed:", parseErr);
      aiResponse = {
        problem: "I couldn't fully understand that, but let's be safe.",
        whatItMeans: "Your body is showing some signs that need attention.",
        severity: "Medium",
        doctorType: "General Physician",
        whatToDo: ["Rest well", "Drink plenty of water", "Talk to a doctor"]
      };
    }

    const doctors = await getRecommendedDoctors(aiResponse.doctorType, lat, lng);

    // SAVE SYMPTOM CHECK TO HISTORY
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

export const analyzeReportNew = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    let extractedText = "";
    const filePath = req.file.path;

    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const parser = new PDFParse({ data: dataBuffer });
      const data = await parser.getText();
      extractedText = data.text;
    } else if (req.file.mimetype.startsWith("image/")) {
      const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
      extractedText = text;
    } else if (req.file.mimetype === "text/plain") {
      extractedText = fs.readFileSync(filePath, 'utf8');
    } else {
      return res.status(400).json({ success: false, message: "Unsupported file type" });
    }

    const { lat, lng } = req.body;
    const prompt = `Act as a friendly medical assistant for non-medical users.

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
${extractedText}

Analyze carefully and choose the most relevant doctor specialization.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" }
    });

    let aiResponse;
    try {
      aiResponse = JSON.parse(completion.choices[0].message.content);
    } catch (parseErr) {
      aiResponse = {
        problem: "I couldn't fully understand that, but let's be safe.",
        whatItMeans: "Your body is showing some signs that need attention.",
        severity: "Medium",
        doctorType: "General Physician",
        whatToDo: ["Rest well", "Drink plenty of water", "Talk to a doctor"]
      };
    }

    const doctors = await getRecommendedDoctors(aiResponse.doctorType, lat, lng);

    // SAVE TO DATABASE
    const report = new Report({
      userId: req.user._id,
      fileName: req.file.originalname,
      fileUrl: req.file.filename,
      analysis: aiResponse.problem + "\n\n" + aiResponse.whatItMeans + "\n\nWhat to do: " + aiResponse.whatToDo.join(", "),
      type: "report",
    });
    await report.save();

    // Note: We are NOT unlinking the file here anymore so it remains viewable in the profile.
    
    res.json({
      success: true,
      ...aiResponse,
      doctors,
      reportId: report._id
    });
  } catch (error) {
    console.error("Analyze Report Error:", error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: error.message });
  }
};

 e x p o r t   c o n s t   d e l e t e R e p o r t   =   a s y n c   ( r e q ,   r e s )   = >   { 
     t r y   { 
         c o n s t   {   i d   }   =   r e q . p a r a m s ; 
         c o n s t   r e p o r t   =   a w a i t   R e p o r t . f i n d B y I d ( i d ) ; 
 
         i f   ( ! r e p o r t )   { 
             r e t u r n   r e s . s t a t u s ( 4 0 4 ) . j s o n ( {   m e s s a g e :   ' D o c u m e n t   n o t   f o u n d '   } ) ; 
         } 
 
         i f   ( r e p o r t . u s e r I d . t o S t r i n g ( )   ! = =   r e q . u s e r . _ i d . t o S t r i n g ( ) )   { 
             r e t u r n   r e s . s t a t u s ( 4 0 3 ) . j s o n ( {   m e s s a g e :   ' N o t   a u t h o r i z e d   t o   d e l e t e   t h i s   d o c u m e n t '   } ) ; 
         } 
 
         i f   ( r e p o r t . f i l e U r l   & &   r e p o r t . f i l e U r l   ! = =   ' N / A '   & &   r e p o r t . f i l e U r l   ! = =   ' A I   P r o c e s s e d ' )   { 
             c o n s t   f i l e N a m e   =   r e p o r t . f i l e U r l . r e p l a c e ( / ^ . * [ \ \ \ / ] u p l o a d s [ \ \ \ / ] / ,   ' ' ) . r e p l a c e ( / ^ u p l o a d s [ \ \ \ / ] / ,   ' ' ) . r e p l a c e ( / ^ \ / / ,   ' ' ) ; 
             c o n s t   f i l e P a t h   =   p a t h . j o i n ( p r o c e s s . c w d ( ) ,   ' u p l o a d s ' ,   f i l e N a m e ) ; 
             i f   ( f s . e x i s t s S y n c ( f i l e P a t h ) )   { 
                 f s . u n l i n k S y n c ( f i l e P a t h ) ; 
             } 
         } 
 
         a w a i t   R e p o r t . f i n d B y I d A n d D e l e t e ( i d ) ; 
         r e s . j s o n ( {   m e s s a g e :   ' D o c u m e n t   d e l e t e d   s u c c e s s f u l l y '   } ) ; 
     }   c a t c h   ( e r r o r )   { 
         r e s . s t a t u s ( 5 0 0 ) . j s o n ( {   m e s s a g e :   e r r o r . m e s s a g e   } ) ; 
     } 
 } ;  
 