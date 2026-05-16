# 🩺 SvasthyaConnect: Digital Health Network

**SvasthyaConnect** is a premium, full-stack MERN e-healthcare platform designed to bridge the gap between patients, doctors, and hospitals. It features cutting-edge AI analysis, real-time geolocation services, and a comprehensive medical management system.

---

## 🌟 Key Features

### 🤖 AI Medical Analyst (AI Labs)
- **Symptom Analysis**: Powered by Google Gemini AI to provide layman-friendly insights into health symptoms.
- **Report Analysis**: Upload medical reports (JPG/PNG/PDF) for instant AI-driven summaries and recommendations.
- **Smart Recommendations**: Recommends specific specialists based on the analyzed symptoms.

### 📍 Nearby Finder (Map Services)
- **Interactive Mapping**: Powered by Leaflet to visualize nearby hospitals and specialists.
- **Distance Logic**: Real-time geolocation (Haversine formula) to calculate proximity to medical facilities.
- **Direct Action**: Book appointments or get directions directly from map markers.

### 📅 Appointment Management
- **Booking Flow**: Seamless scheduling for In-Person, Video Consultations, or WhatsApp consultations.
- **Dashboard**: Centralized patient profile to track history, view prescriptions, and manage reports.
- **HD Video Consult**: Integrated Jitsi-based high-definition video conferencing for remote care.

### 🆘 Emergency & Pharmacy
- **SOS Dashboard**: Instant access to the nearest rescue facility based on real-time GPS.
- **Ambulance Tracking**: Quick-dial links for 108/112 and proximity-based facility sorting.
- **Pharmacy Marketplace**: Integrated pharmacy discovery for medicine ordering.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js + Vite (for lightning-fast builds)
- Tailwind CSS (Premium "Royal Indigo & Violet" UI)
- Leaflet (Interactive Mapping)
- Lucide React (Iconography)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Schema-based modeling)
- JWT (Secure Authentication)
- Multer (File Handling)

**AI & Services:**
- Google Generative AI (Gemini)
- Groq Cloud API
- Tesseract.js (OCR for report analysis)

---

## 🧪 Testing Suite
The project follows a rigorous testing strategy to ensure reliability:

- **Backend (Jest)**: Unit tests for controllers and integration tests for API endpoints.
- **Frontend (Vitest)**: Component testing using React Testing Library and JSDOM.
- **UAT (Playwright)**: Full End-to-End User Acceptance Testing (Register -> Login -> Explore -> Profile).

Run tests:
```bash
# Server tests
cd server && npm test

# Client tests
cd client && npm test

# UAT (Root)
npx playwright test
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or Atlas)

### 1. Clone & Install
```bash
git clone https://github.com/sharmajad/e-health-care-MERN-
cd e-health-care-MERN-
```

### 2. Backend Setup
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
```
```bash
cd server && npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd client && npm install
npm run dev
```

---

## 📸 Interface Preview
*Designed with a premium "Royal Indigo" aesthetic, featuring glassmorphism, smooth gradients, and interactive map interfaces.*

---


## 👥 Contributors
- **Krishna Sharma** (Lead Developer)
