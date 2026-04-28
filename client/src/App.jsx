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

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/video-consult" element={<VideoConsult />} />
        <Route path="/ai-recommend" element={<AIRecommend />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/nearby" element={<NearbyServices />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/ambulance" element={<Ambulance />} />
      </Routes>
    </Router>
  )
}

export default App
