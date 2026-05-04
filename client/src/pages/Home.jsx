
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import Footer from "../components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-blue-50">
      <Hero />
      <Stats />
      <Features />
      <ConsultSection />
      <Specialities />
      <HowItWorks />
      <Footer />
      <FloatingButton />
    </div>
  )
}

// ── FLOATING MEDICAL ICONS BACKGROUND ─────────────────────────────────────────
function FloatingIcons() {
  const icons = [
    { emoji: "🩺", cls: "float-1", style: { top: "10%",  left: "5%",  fontSize: "2.5rem" } },
    { emoji: "❤️", cls: "float-2", style: { top: "20%",  right: "8%", fontSize: "2rem"   } },
    { emoji: "💊", cls: "float-3", style: { top: "60%",  left: "3%",  fontSize: "2rem"   } },
    { emoji: "🏥", cls: "float-4", style: { top: "70%",  right: "5%", fontSize: "2.5rem" } },
    { emoji: "🧬", cls: "float-5", style: { top: "40%",  left: "7%",  fontSize: "1.8rem" } },
    { emoji: "💉", cls: "float-6", style: { top: "35%",  right: "6%", fontSize: "1.8rem" } },
    { emoji: "🩸", cls: "float-1", style: { top: "80%",  left: "12%", fontSize: "1.5rem" } },
    { emoji: "🫀", cls: "float-2", style: { top: "15%",  left: "15%", fontSize: "1.5rem" } },
  ]
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((icon, i) => (
        <div key={i} className={icon.cls} style={{ position: "absolute", ...icon.style }}>
          {icon.emoji}
        </div>
      ))}
    </div>
  )
}

// ── ECG LINE ANIMATION ─────────────────────────────────────────────────────────
function ECGLine() {
  return (
    <div className="w-full overflow-hidden opacity-30">
      <svg viewBox="0 0 1200 80" className="w-full" style={{ height: "60px" }}>
        <polyline
          className="ecg-line"
          fill="none"
          stroke="#0d9488"
          strokeWidth="2.5"
          points="0,40 100,40 130,40 145,10 160,70 175,40 190,40 220,40 235,15 250,65 265,40 280,40 350,40 365,5 380,75 395,40 410,40 480,40 495,20 510,60 525,40 540,40 600,40 615,10 630,70 645,40 660,40 730,40 745,15 760,65 775,40 790,40 860,40 875,5 890,75 905,40 920,40 990,40 1005,20 1020,60 1035,40 1050,40 1200,40"
        />
      </svg>
    </div>
  )
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  const navigate = useNavigate()
  const [city, setCity] = useState("")
  const [search, setSearch] = useState("")
  const cities = ["Ranchi","Jamshedpur","Dhanbad","Bokaro","Hazaribagh","Deoghar","Giridih","Dumka"]

  return (
    <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 40%, #0891b2 100%)" }}>
      <FloatingIcons />

      <div className="relative z-10 px-6 pt-16 pb-6 max-w-5xl mx-auto text-center">
        <div className="slide-up">
          <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 text-white text-sm px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
            Serving 8 cities across Jharkhand
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            Your Health,
            <span className="text-yellow-300"> Our Priority</span>
          </h1>
          <p className="text-teal-100 text-lg mb-10 max-w-2xl mx-auto">
            Connecting Jharkhand to quality healthcare — book appointments,
            consult online, and get AI-powered report analysis.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="slide-up-delay-1 bg-white rounded-2xl shadow-2xl p-3 flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto">
          <select value={city} onChange={(e) => setCity(e.target.value)}
            className="border border-gray-200 px-4 py-3 rounded-xl text-gray-700 focus:outline-none focus:border-teal-500 sm:w-1/4 bg-gray-50">
            <option value="">📍 Select City</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            placeholder="🔍 Search doctors, speciality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 px-4 py-3 rounded-xl flex-1 text-gray-700 focus:outline-none focus:border-teal-500 bg-gray-50"
          />
          <button onClick={() => navigate("/appointment")}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-semibold transition shadow-lg hover:shadow-teal-300">
            Search
          </button>
        </div>

        {/* QUICK TAGS */}
        <div className="slide-up-delay-2 flex gap-2 justify-center mt-5 flex-wrap">
          {["Cardiologist","Gynecologist","Pediatrician","Dermatologist","Neurologist","Orthopedist"].map((tag) => (
            <span key={tag} onClick={() => navigate("/appointment")}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 cursor-pointer text-white text-sm px-4 py-1.5 rounded-full transition backdrop-blur-sm border border-white border-opacity-30">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ECG LINE */}
      <ECGLine />
    </div>
  )
}

// ── STATS ─────────────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { value: "64+",    label: "Hospitals",        icon: "🏥" },
    { value: "6000+",  label: "Doctors",          icon: "👨‍⚕️" },
    { value: "8",      label: "Cities Covered",   icon: "📍" },
    { value: "24/7",   label: "Emergency Support", icon: "🚑" },
  ]
  return (
    <div className="bg-white shadow-lg">
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-0">
        {stats.map((s, i) => (
          <div key={i} className={"text-center py-6 px-4 border-r border-gray-100 last:border-r-0 card-hover " + (i % 2 === 0 ? "" : "")}>
            <div className="text-3xl mb-1">{s.icon}</div>
            <div className="text-2xl font-extrabold text-teal-600">{s.value}</div>
            <div className="text-gray-500 text-sm">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── FEATURES ──────────────────────────────────────────────────────────────────
function Features() {
  const navigate = useNavigate()
  const features = [
    { icon: "📅", title: "Book Appointment",       desc: "Book in-clinic appointments at top Jharkhand hospitals", path: "/appointment",   color: "from-teal-400 to-teal-600"   },
    { icon: "💻", title: "Video Consult",           desc: "Consult doctors online from the comfort of your home",   path: "/video-consult", color: "from-blue-400 to-blue-600"   },
    { icon: "🤖", title: "AI Report Analysis",      desc: "Upload reports and get instant AI-powered insights",     path: "/ai-recommend",  color: "from-purple-400 to-purple-600" },
    { icon: "📍", title: "Nearby Services",         desc: "Find hospitals and doctors closest to your location",    path: "/nearby",        color: "from-orange-400 to-orange-600" },
    { icon: "🚑", title: "Emergency Ambulance",     desc: "One-tap ambulance calling for nearest hospital",         path: "/ambulance",     color: "from-red-400 to-red-600"     },
    { icon: "💊", title: "Order Medicines",         desc: "Order medicines from 1mg, Netmeds and PharmEasy",        path: "/medicines",     color: "from-green-400 to-green-600" },
  ]
  return (
    <div className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Everything You Need</h2>
          <p className="text-gray-500 text-lg">Complete healthcare at your fingertips</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} onClick={() => navigate(f.path)}
              className="card-hover bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer border border-gray-100">
              <div className={"h-2 bg-gradient-to-r " + f.color} />
              <div className="p-5">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── CONSULT SECTION ───────────────────────────────────────────────────────────
function ConsultSection() {
  const navigate = useNavigate()
  const items = [
    { label: "Heart & BP",      icon: "❤️", color: "bg-red-50 border-red-100"     },
    { label: "Skin Issues",     icon: "🧴", color: "bg-pink-50 border-pink-100"   },
    { label: "Child Care",      icon: "👶", color: "bg-blue-50 border-blue-100"   },
    { label: "Cold & Fever",    icon: "🤒", color: "bg-orange-50 border-orange-100" },
    { label: "Mental Health",   icon: "🧠", color: "bg-purple-50 border-purple-100" },
    { label: "Women's Health",  icon: "👩‍⚕️", color: "bg-teal-50 border-teal-100"  },
    { label: "Bone & Joint",    icon: "🦴", color: "bg-yellow-50 border-yellow-100" },
    { label: "Eye Problems",    icon: "👁️", color: "bg-indigo-50 border-indigo-100" },
  ]
  return (
    <div className="py-16 px-6 bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Consult Top Doctors Online</h2>
          <p className="text-gray-500">Available across Ranchi, Jamshedpur, Dhanbad and more</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.label} onClick={() => navigate("/video-consult")}
              className={"card-hover border rounded-2xl p-5 cursor-pointer flex items-center gap-3 bg-white " + item.color}>
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
                <p className="text-teal-600 text-xs mt-0.5">Consult Now →</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── SPECIALITIES ──────────────────────────────────────────────────────────────
function Specialities() {
  const navigate = useNavigate()
  const specs = [
    { name: "Cardiologist",   icon: "🫀", hospitals: "RIMS, Medanta Ranchi",     color: "from-red-100 to-red-50"     },
    { name: "Neurologist",    icon: "🧠", hospitals: "TMH Jamshedpur, AIIMS",    color: "from-purple-100 to-purple-50" },
    { name: "Gynecologist",   icon: "👩‍⚕️", hospitals: "MGM Jamshedpur, RIMS",    color: "from-pink-100 to-pink-50"   },
    { name: "Pediatrician",   icon: "👶", hospitals: "Bokaro General, RIMS",     color: "from-blue-100 to-blue-50"   },
    { name: "Orthopedist",    icon: "🦴", hospitals: "TMH, Medanta Ranchi",      color: "from-yellow-100 to-yellow-50" },
    { name: "Dermatologist",  icon: "🧴", hospitals: "Orchid Medical, RIMS",     color: "from-green-100 to-green-50" },
  ]
  return (
    <div className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Book by Speciality</h2>
          <p className="text-gray-500">Top specialists at leading Jharkhand hospitals</p>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x">
          {specs.map((s) => (
            <div key={s.name} onClick={() => navigate("/appointment")}
              className={"card-hover min-w-[200px] rounded-2xl shadow-md cursor-pointer overflow-hidden snap-start border border-gray-100 bg-gradient-to-b " + s.color}>
              <div className="h-32 flex items-center justify-center text-6xl">
                {s.icon}
              </div>
              <div className="bg-white p-4">
                <h3 className="font-bold text-gray-800">{s.name}</h3>
                <p className="text-gray-400 text-xs mt-1">{s.hospitals}</p>
                <p className="text-teal-600 text-sm mt-2 font-medium">Book Appointment →</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── HOW IT WORKS ──────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { step: "01", title: "Register",          desc: "Create your free Svasthya Connect account in 2 minutes",      icon: "👤", color: "bg-teal-500"   },
    { step: "02", title: "Find a Doctor",     desc: "Search by city, hospital or speciality across Jharkhand",     icon: "🔍", color: "bg-blue-500"   },
    { step: "03", title: "Book or Consult",   desc: "Book in-clinic appointment or start a video consultation",    icon: "📅", color: "bg-purple-500" },
    { step: "04", title: "AI Report Analysis",desc: "Upload reports and get instant AI-powered medical insights",  icon: "🤖", color: "bg-orange-500" },
  ]
  return (
    <div className="py-16 px-6 bg-gradient-to-br from-slate-800 to-teal-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white mb-3">How It Works</h2>
          <p className="text-teal-300">Get started in 4 simple steps</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.step} className="text-center relative">
              {i < 3 && (
                <div className="hidden sm:block absolute top-8 left-full w-full h-0.5 bg-teal-700 z-0" style={{ width: "100%" }} />
              )}
              <div className="relative z-10">
                <div className={"w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg " + s.color}>
                  {s.icon}
                </div>
                <div className="text-teal-400 text-xs font-bold mb-1">{s.step}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-teal-300 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── FLOATING BUTTON ───────────────────────────────────────────────────────────
function FloatingButton() {
  const navigate = useNavigate()
  return (
    <button onClick={() => navigate("/ai-recommend")}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-5 py-3 rounded-full shadow-2xl transition z-50 flex items-center gap-2 font-medium">
      <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
      🤖 Health Assistant
    </button>
  )
}
