/**
 * ================================================================
 * CLIENT APPLICATION ROOT — App.jsx
 * ================================================================
 * Sets up React Router and defines all client-side page routes.
 *
 * Route map:
 *  /                → Home           (landing page)
 *  /login           → Login          (authentication)
 *  /register        → Register       (new account)
 *  /appointment     → Appointment    (book a consultation)
 *  /dashboard       → Dashboard      (upcoming appointments overview)
 *  /cancel-booking/:id → CancelBooking (cancel/reschedule a specific booking)
 *  /video-consult   → VideoConsult   (telemedicine / video call page)
 *  /ai-recommend    → AIRecommend    (AI symptom checker & report analyser)
 *  /profile         → Profile        (user profile, documents, history)
 *  /nearby          → NearbyServices (map-based nearby hospitals & doctors)
 *  /medicines       → Medicines      (medicine information & ordering)
 *  /ambulance       → Ambulance      (emergency ambulance booking)
 *  /privacy         → PrivacyPolicy  (legal)
 *  /terms           → TermsOfService (legal)
 *  /disclaimer      → Disclaimer     (legal)
 *
 * Global components rendered outside the route tree:
 *  <Navbar />        → Top navigation bar (always visible)
 *  <VoiceAssistant /> → Floating AI voice assistant (always visible)
 *
 * NOTE: <Footer /> is intentionally excluded from the global layout.
 * It is rendered directly inside individual pages that need it.
 * ================================================================
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Appointment from "./pages/Appointment"
import Dashboard from "./pages/Dashboard"
import VideoConsult from "./pages/VideoConsult"
import AIRecommend from "./pages/AIRecommend"
import Profile from "./pages/Profile"
import NearbyServices from "./pages/NearbyServices"
import Medicines from "./pages/Medicines"
import Ambulance from "./pages/Ambulance"
import CancelBooking from "./pages/CancelBooking"
import PrivacyPolicy from "./pages/legal/PrivacyPolicy"
import TermsOfService from "./pages/legal/TermsOfService"
import Disclaimer from "./pages/legal/Disclaimer"
import VoiceAssistant from "./components/VoiceAssistant"

function App() {
  return (
    <Router>
      {/* Global top navigation — always visible on every page */}
      <Navbar />

      {/* Page routes */}
      <Routes>
        <Route path="/"                   element={<Home />} />
        <Route path="/login"              element={<Login />} />
        <Route path="/register"           element={<Register />} />
        <Route path="/appointment"        element={<Appointment />} />
        <Route path="/dashboard"          element={<Dashboard />} />
        <Route path="/cancel-booking/:id" element={<CancelBooking />} />
        <Route path="/video-consult"      element={<VideoConsult />} />
        <Route path="/ai-recommend"       element={<AIRecommend />} />
        <Route path="/profile"            element={<Profile />} />
        <Route path="/nearby"             element={<NearbyServices />} />
        <Route path="/medicines"          element={<Medicines />} />
        <Route path="/ambulance"          element={<Ambulance />} />
        <Route path="/privacy"            element={<PrivacyPolicy />} />
        <Route path="/terms"              element={<TermsOfService />} />
        <Route path="/disclaimer"         element={<Disclaimer />} />
      </Routes>

      {/* Floating AI voice assistant — rendered outside routes so it
          persists across all page navigations */}
      <VoiceAssistant />
    </Router>
  )
}

export default App
