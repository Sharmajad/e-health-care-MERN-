import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function VideoConsult() {
  const navigate = useNavigate()

  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [inCall, setInCall] = useState(false)
  const [city, setCity] = useState("")

  const cities = [
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro",
    "Hazaribagh", "Deoghar", "Giridih", "Dumka"
  ]

  // ── MOCK DOCTORS AVAILABLE FOR VIDEO CONSULT ───────────────────────────────
  // In production these would come from your backend API
  const allDoctors = [
    { id: 1, name: "Dr. Priya Sharma",    speciality: "Cardiologist",    city: "Ranchi",      hospital: "RIMS Ranchi",           fee: 500,  rating: 4.8, available: true  },
    { id: 2, name: "Dr. Amit Kumar",      speciality: "Neurologist",     city: "Jamshedpur",  hospital: "Tata Main Hospital",    fee: 600,  rating: 4.7, available: true  },
    { id: 3, name: "Dr. Sunita Devi",     speciality: "Gynecologist",    city: "Ranchi",      hospital: "Medanta Ranchi",        fee: 450,  rating: 4.9, available: false },
    { id: 4, name: "Dr. Rakesh Singh",    speciality: "Pediatrician",    city: "Dhanbad",     hospital: "SNMMCH Dhanbad",        fee: 400,  rating: 4.6, available: true  },
    { id: 5, name: "Dr. Meera Kumari",    speciality: "Dermatologist",   city: "Bokaro",      hospital: "Bokaro General",        fee: 350,  rating: 4.5, available: true  },
    { id: 6, name: "Dr. Vijay Mahato",    speciality: "General Physician",city: "Hazaribagh", hospital: "Sadar Hospital",        fee: 300,  rating: 4.4, available: true  },
    { id: 7, name: "Dr. Anjali Gupta",    speciality: "Psychiatrist",    city: "Ranchi",      hospital: "CIP Kanke",             fee: 550,  rating: 4.8, available: false },
    { id: 8, name: "Dr. Suresh Oraon",    speciality: "Orthopedist",     city: "Jamshedpur",  hospital: "MGM Medical College",   fee: 500,  rating: 4.6, available: true  },
  ]

  // Filter doctors by selected city
  const filtered = city
    ? allDoctors.filter((d) => d.city === city)
    : allDoctors

  // ── VIDEO CALL SCREEN ──────────────────────────────────────────────────────
  if (inCall && selectedDoctor) {
    return <CallScreen doctor={selectedDoctor} onEnd={() => setInCall(false)} />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">💻 Video Consultation</h1>
          <p className="text-gray-400 mt-2">
            Consult top Jharkhand doctors from home — no travel needed
          </p>
        </div>

        {/* HOW IT WORKS BANNER */}
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl mb-2">🔍</div>
              <p className="font-medium text-gray-700 text-sm">Choose a Doctor</p>
              <p className="text-gray-400 text-xs mt-1">Filter by city or speciality</p>
            </div>
            <div>
              <div className="text-3xl mb-2">💳</div>
              <p className="font-medium text-gray-700 text-sm">Pay Consultation Fee</p>
              <p className="text-gray-400 text-xs mt-1">Secure online payment</p>
            </div>
            <div>
              <div className="text-3xl mb-2">📹</div>
              <p className="font-medium text-gray-700 text-sm">Join Video Call</p>
              <p className="text-gray-400 text-xs mt-1">Connect instantly</p>
            </div>
          </div>
        </div>

        {/* CITY FILTER */}
        <div className="flex gap-3 items-center mb-6 flex-wrap">
          <span className="text-gray-600 font-medium text-sm">Filter by city:</span>

          {/* All cities button */}
          <button
            onClick={() => setCity("")}
            className={`px-4 py-1 rounded-full text-sm border transition ${
              city === ""
                ? "bg-teal-600 text-white border-teal-600"
                : "border-gray-300 text-gray-600 hover:border-teal-400"
            }`}
          >
            All
          </button>

          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`px-4 py-1 rounded-full text-sm border transition ${
                city === c
                  ? "bg-teal-600 text-white border-teal-600"
                  : "border-gray-300 text-gray-600 hover:border-teal-400"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* DOCTOR CARDS */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No doctors available in {city}</p>
            <button
              onClick={() => setCity("")}
              className="mt-3 text-teal-600 hover:underline text-sm"
            >
              Show all cities
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5">
            {filtered.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onConsult={() => {
                  setSelectedDoctor(doctor)
                  setInCall(true)
                }}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

// ─── DOCTOR CARD ──────────────────────────────────────────────────────────────
function DoctorCard({ doctor, onConsult }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-teal-300 transition">

      <div className="flex items-start gap-4">

        {/* AVATAR — initials circle */}
        <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg shrink-0">
          {doctor.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
          <p className="text-teal-600 text-sm">{doctor.speciality}</p>
          <p className="text-gray-400 text-xs mt-1">
            {doctor.hospital} · {doctor.city}
          </p>

          {/* RATING */}
          <p className="text-yellow-500 text-xs mt-1">
            ⭐ {doctor.rating} rating
          </p>
        </div>

        {/* AVAILABLE BADGE */}
        <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${
          doctor.available
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-500"
        }`}>
          {doctor.available ? "● Available" : "● Busy"}
        </span>

      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <span className="text-gray-800 font-semibold">
          ₹{doctor.fee} <span className="text-gray-400 font-normal text-sm">/ consult</span>
        </span>

        <button
          onClick={onConsult}
          disabled={!doctor.available}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {doctor.available ? "Start Consult" : "Unavailable"}
        </button>
      </div>

    </div>
  )
}

// ─── CALL SCREEN ──────────────────────────────────────────────────────────────
// This simulates the video call UI using Jitsi Meet — a free open source video API
function CallScreen({ doctor, onEnd }) {
  const navigate = useNavigate()

  // Jitsi Meet creates a unique room from the doctor's name
  // In production you would generate a secure room ID from your backend
  const roomName = `SvasthyaConnect-${doctor.name.replace(/\s+/g, "-")}`
  const jitsiUrl = `https://meet.jit.si/${roomName}`

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">

      {/* CALL HEADER */}
      <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
            {doctor.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <p className="text-white font-medium">{doctor.name}</p>
            <p className="text-gray-400 text-xs">{doctor.speciality} · {doctor.hospital}</p>
          </div>
        </div>

        {/* LIVE INDICATOR */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-green-400 text-sm font-medium">Live</span>
        </div>
      </div>

      {/* JITSI VIDEO IFRAME */}
      {/* Jitsi Meet is completely free — no API key needed */}
      <iframe
        src={jitsiUrl}
        className="flex-1 w-full"
        allow="camera; microphone; fullscreen; display-capture"
        title="Video Consultation"
      />

      {/* END CALL BUTTON */}
      <div className="bg-gray-800 px-6 py-4 flex justify-center gap-4">
        <button
          onClick={onEnd}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-medium transition flex items-center gap-2"
        >
          📵 End Call
        </button>
        <button
          onClick={() => navigate("/appointment")}
          className="border border-teal-400 text-teal-400 px-6 py-3 rounded-full text-sm hover:bg-teal-900 transition"
        >
          Book Follow-up
        </button>
      </div>

    </div>
  )
}