import Footer from "../components/Footer"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Hero />
      <Features />
      <ConsultSection />
      <Specialities />
      <HowItWorks />
      <Footer />
      <FloatingButton />
    </div>
  )
}

// ─── HERO / SEARCH ────────────────────────────────────────────────────────────
function Hero() {
  const navigate = useNavigate()
  const [city, setCity] = useState("")
  const [search, setSearch] = useState("")

  const cities = ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Dumka"]

  const handleSearch = () => {
    navigate("/appointment")
  }

  return (
    <div className="bg-teal-600 text-white px-10 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-3">
          Your Health, Our Priority
        </h1>
        <p className="text-teal-100 text-lg mb-8">
          Connecting Jharkhand to quality healthcare — book appointments, consult online, and get AI-powered report analysis.
        </p>

        {/* SEARCH BAR */}
        <div className="bg-white rounded-xl shadow-lg p-3 flex gap-3">
          {/* City Dropdown */}
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border px-3 py-2 rounded-lg w-1/4 text-gray-700 focus:outline-none focus:border-teal-500"
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Search Input */}
          <input
            placeholder="Search doctors, speciality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg flex-1 text-gray-700 focus:outline-none focus:border-teal-500"
          />

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-teal-500 hover:bg-teal-700 text-white px-8 py-2 rounded-lg font-medium transition"
          >
            Search
          </button>
        </div>

        {/* QUICK TAGS */}
        <div className="flex gap-3 justify-center mt-4 flex-wrap">
          {["Cardiologist", "Gynecologist", "Pediatrician", "Dermatologist", "Neurologist"].map((tag) => (
            <span
              key={tag}
              onClick={() => navigate("/appointment")}
              className="bg-teal-500 hover:bg-teal-400 cursor-pointer text-white text-sm px-4 py-1 rounded-full transition"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── FEATURES ─────────────────────────────────────────────────────────────────
function Features() {
  const navigate = useNavigate()

  const features = [
    { icon: "📅", title: "Book Appointment", desc: "Book in-clinic appointments at top Jharkhand hospitals", path: "/appointment" },
    { icon: "💻", title: "Video Consult", desc: "Consult doctors online from the comfort of your home", path: "/video-consult" },
    { icon: "📄", title: "Upload Report", desc: "Upload your medical reports for instant AI analysis", path: "/upload-report" },
    { icon: "🤖", title: "AI Recommendations", desc: "Get doctor recommendations based on your health report", path: "/ai-recommend" },
  ]

  return (
    <div className="grid grid-cols-4 gap-6 px-10 mt-10">
      {features.map((f) => (
        <div
          key={f.title}
          onClick={() => navigate(f.path)}
          className="bg-white p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:border-teal-400 border border-transparent transition"
        >
          <div className="text-4xl mb-3">{f.icon}</div>
          <h2 className="font-semibold text-gray-800 mb-1">{f.title}</h2>
          <p className="text-gray-500 text-sm">{f.desc}</p>
        </div>
      ))}
    </div>
  )
}

// ─── CONSULT SECTION ──────────────────────────────────────────────────────────
function ConsultSection() {
  const navigate = useNavigate()

  const items = [
    { label: "Heart & BP", icon: "❤️" },
    { label: "Skin Issues", icon: "🧴" },
    { label: "Child Care", icon: "👶" },
    { label: "Cold & Fever", icon: "🤒" },
    { label: "Mental Health", icon: "🧠" },
    { label: "Women's Health", icon: "👩‍⚕️" },
  ]

  return (
    <div className="px-10 mt-16">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">Consult Top Doctors Online</h1>
      <p className="text-gray-500 mb-6">Available across Ranchi, Jamshedpur, Dhanbad & more</p>
      <div className="grid grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.label}
            onClick={() => navigate("/video-consult")}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-teal-400 transition flex items-center gap-4"
          >
            <span className="text-3xl">{item.icon}</span>
            <div>
              <h2 className="font-medium text-gray-800">{item.label}</h2>
              <p className="text-teal-600 text-sm mt-1">Consult Now →</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── SPECIALITIES ─────────────────────────────────────────────────────────────
function Specialities() {
  const navigate = useNavigate()

  const specs = [
    { name: "Cardiologist", icon: "🫀", hospitals: "RIMS, Medanta Ranchi" },
    { name: "Neurologist", icon: "🧠", hospitals: "TMH Jamshedpur, AIIMS Ranchi" },
    { name: "Gynecologist", icon: "👩‍⚕️", hospitals: "MGM Jamshedpur, RIMS" },
    { name: "Pediatrician", icon: "👶", hospitals: "Bokaro General, RIMS" },
    { name: "Orthopedist", icon: "🦴", hospitals: "TMH, Medanta Ranchi" },
    { name: "Dermatologist", icon: "🧴", hospitals: "Orchid Medical, RIMS" },
  ]

  return (
    <div className="px-10 mt-16">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">Book by Speciality</h1>
      <p className="text-gray-500 mb-6">Top specialists at leading Jharkhand hospitals</p>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {specs.map((s) => (
          <div
            key={s.name}
            onClick={() => navigate("/appointment")}
            className="bg-white min-w-[200px] rounded-xl shadow-md cursor-pointer hover:shadow-lg transition border border-gray-100"
          >
            <div className="h-28 bg-teal-50 rounded-t-xl flex items-center justify-center text-5xl">
              {s.icon}
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-gray-800">{s.name}</h2>
              <p className="text-gray-400 text-xs mt-1">{s.hospitals}</p>
              <p className="text-teal-600 text-sm mt-2">Book Appointment →</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { step: "1", title: "Register / Login", desc: "Create your free Svasthya Connect account" },
    { step: "2", title: "Find a Doctor", desc: "Search by city, hospital or speciality in Jharkhand" },
    { step: "3", title: "Book or Consult", desc: "Book in-clinic or start a video consultation" },
    { step: "4", title: "AI Report Analysis", desc: "Upload reports and get instant AI-powered insights" },
  ]

  return (
    <div className="px-10 mt-16 bg-teal-50 py-12 rounded-2xl mx-10">
      <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">How It Works</h1>
      <div className="grid grid-cols-4 gap-6">
        {steps.map((s) => (
          <div key={s.step} className="text-center">
            <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
              {s.step}
            </div>
            <h2 className="font-semibold text-gray-800 mb-1">{s.title}</h2>
            <p className="text-gray-500 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
// function Testimonials() {
//   const reviews = [
//     { name: "Anjali Sharma", city: "Ranchi", text: "Booked an appointment at RIMS in minutes. Amazing platform!" },
//     { name: "Rohit Kumar", city: "Jamshedpur", text: "Video consult saved me a 2-hour trip to TMH. Very convenient." },
//     { name: "Priya Devi", city: "Dhanbad", text: "The AI report analysis explained my blood test results in simple language." },
//   ]

//   return (
//     <div className="px-10 mt-16 mb-16">
//       <h1 className="text-2xl font-bold mb-8 text-center text-gray-800">What Jharkhand Says</h1>
//       <div className="grid grid-cols-3 gap-6">
//         {reviews.map((r) => (
//           <div key={r.name} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
//             <p className="text-gray-600 italic mb-4">"{r.text}"</p>
//             <h3 className="font-semibold text-gray-800">{r.name}</h3>
//             <p className="text-teal-600 text-sm">{r.city}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// ─── FLOATING BUTTON ──────────────────────────────────────────────────────────
function FloatingButton() {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate("/ai-recommend")}
      className="fixed bottom-6 right-6 bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-full shadow-lg transition"
    >
      🤖 Health Assistant
    </button>
  )
}

<Footer />
