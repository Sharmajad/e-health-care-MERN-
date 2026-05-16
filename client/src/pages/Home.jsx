import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import Footer from "../components/Footer"
import { isAuthenticated, setRedirectPath } from "../utils/auth"
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  ArrowRight, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Users, 
  User,
  Award, 
  Sparkles,
  Smartphone,
  Video,
  Clipboard,
  Ambulance as AmbulanceIcon,
  Pill,
  Clock,
  Heart,
  Stethoscope,
  Building2,
  Calendar,
  CheckCircle2
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white relative selection:bg-teal-200 selection:text-teal-900 overflow-x-hidden">
      {/* Main landing page sections */}
      <Hero />
      <Features />
      <ConsultSection />
      <Specialities />
      <HowItWorks />
      <FinalCTA />
      <Footer />
    </div>
  )
}

// ── HERO SECTION ──────────────────────────────────────────────────────────────
function Hero() {
  const navigate = useNavigate()
  const [city, setCity] = useState("")
  const [search, setSearch] = useState("")
  const cities = ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Dumka"]
  const [cityOpen, setCityOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCityOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative min-h-[700px] lg:min-h-[800px] bg-[#0d9488] pt-20 pb-32">
      {/* ... Background Layer remains same ... */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d9488] via-[#0d9488] to-[#10b981]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[120px] animate-float-slow"></div>
        <div className="absolute top-[15%] left-[10%] opacity-20 float-1"><Heart size={48} className="text-white" /></div>
        <div className="absolute top-[40%] right-[15%] opacity-15 float-2"><Stethoscope size={56} className="text-white" /></div>
        <div className="absolute bottom-[20%] left-[20%] opacity-10 float-3"><Pill size={40} className="text-white" /></div>
        <div className="absolute top-[60%] left-[5%] opacity-10 float-4"><Activity size={32} className="text-white" /></div>
        <div className="absolute bottom-[30%] right-[10%] opacity-20 float-5"><ShieldCheck size={44} className="text-white" /></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-8 animate-slide-down">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-[11px] font-bold text-white/90 uppercase tracking-widest">Serving 8 cities across Jharkhand</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 animate-slide-up opacity-0 [animation-fill-mode:forwards]">
          Your Health, <span className="text-yellow-300">Our Priority</span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mx-auto text-white/80 font-medium text-lg md:text-xl mb-12 animate-fade-in opacity-0 [animation-fill-mode:forwards] delay-200">
          Connecting Jharkhand to quality healthcare — book appointments, consult online, and get AI-powered report analysis.
        </p>

        {/* Search Box */}
        {/* Main Search and Navigation Bar */}
        <div className="max-w-4xl mx-auto mb-10 animate-slide-up opacity-0 [animation-fill-mode:forwards] delay-500">
          <div className="bg-white rounded-[32px] p-2 md:p-3 shadow-2xl shadow-black/10">
            <div className="flex flex-col md:flex-row gap-3">
              
              {/* City Selection Dropdown */}
              <div className="md:w-[32%] relative" ref={dropdownRef}>
                <button 
                  onClick={() => setCityOpen(!cityOpen)}
                  className="w-full flex items-center gap-4 bg-gray-50 hover:bg-gray-100 px-6 py-4 rounded-2xl transition-all border-2 border-transparent focus:border-teal-500/20 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Select City</p>
                    <p className="text-sm font-bold text-gray-700 leading-none">{city || "All Cities"}</p>
                  </div>
                  <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${cityOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu (Opens Upwards) */}
                {cityOpen && (
                  <div className="absolute bottom-full left-0 w-full mb-3 bg-white rounded-[24px] shadow-2xl shadow-teal-900/10 border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="p-2 grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto">
                      {cities.map((c) => (
                        <button
                          key={c}
                          onClick={() => { setCity(c); setCityOpen(false) }}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            city === c 
                              ? "bg-teal-50 text-teal-600 font-bold" 
                              : "hover:bg-gray-50 text-gray-600 font-medium"
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full ${city === c ? "bg-teal-500" : "bg-transparent border border-gray-300"}`}></div>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Speciality/Doctor Search Input */}
              <div className="flex-1 relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 group-focus-within:scale-110 transition-all">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search doctors, speciality or symptoms..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-50 border-none px-16 py-4 rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-teal-500/10 transition-all hover:bg-gray-100 placeholder:text-gray-400"
                />
              </div>

              {/* Action Button */}
              <button 
                onClick={() => navigate("/appointment")}
                className="bg-[#0d9488] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#0b7a6f] transition-all hover:shadow-xl hover:shadow-teal-900/20 flex items-center justify-center gap-2 group/btn"
              >
                Find Care <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories (Clickable) */}
        <div className="flex flex-wrap justify-center gap-3 animate-fade-in opacity-0 [animation-fill-mode:forwards] delay-700">
          {["Cardiologist", "Gynecologist", "Pediatrician", "Dermatologist", "Neurologist", "Orthopedist"].map((cat) => (
            <button 
              key={cat}
              onClick={() => setSearch(cat)}
              className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border-2 ${
                search === cat 
                  ? "bg-yellow-400 border-yellow-400 text-teal-900 shadow-lg shadow-yellow-400/20 scale-105" 
                  : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-0 left-0 w-full translate-y-1/2 z-20 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-[32px] shadow-2xl shadow-teal-900/10 border border-gray-100 p-8 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-gray-100">
            {[
              { icon: <Building2 className="text-rose-400" />, value: "64+", label: "Hospitals" },
              { icon: <User className="text-yellow-400" />, value: "6000+", label: "Doctors" },
              { icon: <MapPin className="text-rose-500" />, value: "8", label: "Cities Covered" },
              { icon: <AmbulanceIcon className="text-rose-500" />, value: "24/7", label: "Emergency Support" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center px-4">
                <div className="mb-4 transform hover:scale-110 transition-transform">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── FEATURES SECTION ──────────────────────────────────────────────────────────
function Features() {
  const navigate = useNavigate()
  const features = [
    { 
      icon: <Calendar size={24} />, 
      title: "Book Appointment", 
      desc: "Instant slots at top hospitals.", 
      path: "/appointment", 
      color: "text-teal-600",
      bg: "bg-teal-50/50",
      border: "hover:border-teal-200"
    },
    { 
      icon: <Video size={24} />, 
      title: "Video Consult", 
      desc: "Connect with doctors from home.", 
      path: "/video-consult", 
      color: "text-blue-600",
      bg: "bg-blue-50/50",
      border: "hover:border-blue-200"
    },
    { 
      icon: <Sparkles size={24} />, 
      title: "AI Analysis", 
      desc: "Upload reports for smart insights.", 
      path: "/ai-recommend", 
      color: "text-purple-600",
      bg: "bg-purple-50/50",
      border: "hover:border-purple-200"
    },
    { 
      icon: <MapPin size={24} />, 
      title: "Nearby Services", 
      desc: "Find care closest to you.", 
      path: "/nearby", 
      color: "text-orange-600",
      bg: "bg-orange-50/50",
      border: "hover:border-orange-200"
    },
    { 
      icon: <AmbulanceIcon size={24} />, 
      title: "Emergency", 
      desc: "One-tap ambulance dispatch.", 
      path: "/ambulance", 
      color: "text-red-600",
      bg: "bg-red-50/50",
      border: "hover:border-red-200"
    },
    { 
      icon: <Pill size={24} />, 
      title: "Order Medicines", 
      desc: "Express delivery anywhere.", 
      path: "/medicines", 
      color: "text-emerald-600",
      bg: "bg-emerald-50/50",
      border: "hover:border-emerald-200"
    },
  ]

  return (
    <div className="pt-48 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[11px] font-black text-teal-600 uppercase tracking-[0.4em] mb-4">Complete Network</h2>
          <h3 className="text-4xl font-black text-gray-900 tracking-tight">Everything You Need</h3>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f, idx) => (
            <div 
              key={f.title} 
              onClick={() => {
                navigate(f.path)
              }}
              className={`group relative p-8 rounded-[32px] border border-gray-100 bg-white transition-all duration-500 cursor-pointer hover:shadow-2xl hover:shadow-teal-900/5 ${f.border}`}
            >
              <div className="flex flex-col items-start">
                <div className={`w-14 h-14 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-2">{f.title}</h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">{f.desc}</p>
                <div className={`w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center ${f.color} group-hover:bg-teal-600 group-hover:text-white transition-all`}>
                   <ArrowRight size={18} />
                </div>
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
    { label: "Heart & BP", icon: "❤️", color: "text-red-600", bg: "bg-red-50" },
    { label: "Skin Issues", icon: "🧴", color: "text-pink-600", bg: "bg-pink-50" },
    { label: "Child Care", icon: "👶", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Cold & Fever", icon: "🤒", color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Mental Health", icon: "🧠", color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Women's Health", icon: "👩‍⚕️", color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Bone & Joint", icon: "🦴", color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Eye Problems", icon: "👁️", color: "text-indigo-600", bg: "bg-indigo-50" },
  ]
  return (
    <div className="py-20 px-6 bg-gray-50 rounded-[64px] mx-4 md:mx-10 relative overflow-hidden border border-gray-100">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-[11px] font-black text-teal-600 uppercase tracking-[0.4em] mb-4">Virtual Care</h2>
          <h3 className="text-4xl font-black text-gray-900 tracking-tight">Consult Top Doctors Online</h3>
        </div>

        {/* List of online consultation categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <div 
              key={item.label} 
              onClick={() => navigate("/video-consult")}
              className="group bg-white p-8 rounded-[32px] border border-white hover:border-teal-200 transition-all duration-500 cursor-pointer shadow-lg shadow-gray-200/20 flex flex-col items-center text-center gap-4"
            >
              <div className={`w-16 h-16 rounded-3xl ${item.bg} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <p className="font-black text-gray-900 text-sm">{item.label}</p>
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
  const scrollRef = useRef(null)

  const specs = [
    { name: "Cardiologist", icon: "🫀", hospitals: "RIMS, Medanta Ranchi", color: "from-red-50 to-white" },
    { name: "Neurologist", icon: "🧠", hospitals: "TMH Jamshedpur, AIIMS", color: "from-purple-50 to-white" },
    { name: "Gynecologist", icon: "👩‍⚕️", hospitals: "MGM Jamshedpur, RIMS", color: "from-pink-50 to-white" },
    { name: "Pediatrician", icon: "👶", hospitals: "Bokaro General, RIMS", color: "from-blue-50 to-white" },
    { name: "Orthopedist", icon: "🦴", hospitals: "TMH, Medanta Ranchi", color: "from-yellow-50 to-white" },
    { name: "Dermatologist", icon: "🧴", hospitals: "Orchid Medical, RIMS", color: "from-green-50 to-white" },
    { name: "Dentist", icon: "🦷", hospitals: "Dental Care, RIMS", color: "from-teal-50 to-white" },
    { name: "Ophthalmologist", icon: "👁️", hospitals: "Eye Care, Medanta", color: "from-indigo-50 to-white" },
  ]

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <div className="py-24 px-6 relative overflow-hidden group">
      <div className="max-w-6xl mx-auto relative">
        <div className="flex justify-between items-end mb-12 px-4">
          <div className="text-left">
            <h2 className="text-[11px] font-black text-teal-600 uppercase tracking-[0.4em] mb-4">Jharkhand's Best</h2>
            <h3 className="text-4xl font-black text-gray-900 tracking-tight">Book by Speciality</h3>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={() => scroll('left')}
               className="w-14 h-14 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:border-teal-600 hover:text-teal-600 transition-all bg-white shadow-sm"
             >
               <ChevronLeft size={24} />
             </button>
             <button 
               onClick={() => scroll('right')}
               className="w-14 h-14 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:border-teal-600 hover:text-teal-600 transition-all bg-white shadow-sm"
             >
               <ChevronRight size={24} />
             </button>
          </div>
        </div>

        {/* Horizontal scrollable speciality list */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-12 snap-x no-scrollbar px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {specs.map((s) => (
            <div 
              key={s.name} 
              onClick={() => {
                navigate("/appointment")
              }}
              className={"card-hover min-w-[280px] rounded-[40px] shadow-xl shadow-teal-900/5 cursor-pointer overflow-hidden snap-start border border-white bg-gradient-to-b flex flex-col group/card transition-all duration-500 " + s.color}
            >
              <div className="h-40 flex items-center justify-center text-7xl transition-transform duration-700 group-hover/card:scale-110">
                {s.icon}
              </div>
              <div className="bg-white p-8 flex-1 flex flex-col">
                <h3 className="font-black text-gray-900 text-lg mb-2">{s.name}</h3>
                <p className="text-gray-400 text-xs font-medium leading-relaxed">{s.hospitals}</p>
                <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-100">
                   <p className="text-teal-600 text-[10px] font-black uppercase tracking-widest">Book Appointment</p>
                   <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 group-hover/card:bg-teal-600 group-hover:text-white transition-all">
                      <ArrowRight size={18} />
                   </div>
                </div>
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
    { step: "01", title: "Create Profile", desc: "Build your health record.", icon: <Users size={24} />, color: "bg-teal-600" },
    { step: "02", title: "Find Care", desc: "Search city or hospital.", icon: <Search size={24} />, color: "bg-blue-600" },
    { step: "03", title: "Book Instant", desc: "Book clinic or video call.", icon: <Calendar size={24} />, color: "bg-purple-600" },
    { step: "04", title: "AI Analysis", desc: "Get smart health insights.", icon: <Activity size={24} />, color: "bg-orange-600" },
  ]
  return (
    <div className="py-24 px-6 bg-gray-900 rounded-[80px] mx-4 md:mx-10 relative overflow-hidden text-white shadow-2xl shadow-teal-900/30">
      <div className="max-w-6xl mx-auto relative z-10 text-center">
        <h2 className="text-[11px] font-black text-teal-400 uppercase tracking-[0.4em] mb-4">The Process</h2>
        <h3 className="text-4xl font-black mb-16">How it Works</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-white/5 -z-0"></div>
          {steps.map((s, i) => (
            <div key={s.step} className="text-center group relative z-10">
              <div className={`w-24 h-24 rounded-[36px] ${s.color} flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-black/50 group-hover:scale-110 transition-all duration-500 border-4 border-gray-900`}>
                {s.icon}
              </div>
              <h3 className="font-black text-2xl mb-3">{s.title}</h3>
              <p className="text-gray-400 font-medium text-sm leading-relaxed px-4">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── FINAL CTA ─────────────────────────────────────────────────────────────────
function FinalCTA() {
   const navigate = useNavigate()
   return (
     <div className="py-24 px-6 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
           <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight mb-8">Ready for <br /> <span className="text-teal-600">Better Care?</span></h2>
           <p className="text-gray-500 font-medium text-xl mb-16 leading-relaxed">
              Join thousands of residents in Jharkhand who trust Svasthya Connect for their daily healthcare needs.
           </p>
           <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => navigate("/register")}
                className="w-full md:w-auto bg-[#0d9488] text-white px-12 py-6 rounded-[24px] font-black uppercase tracking-widest hover:bg-[#0b7a6f] transition-all shadow-2xl shadow-teal-900/20"
              >
                 Get Started Free
              </button>
              <button 
                onClick={() => navigate("/nearby")}
                className="w-full md:w-auto bg-white text-gray-900 border-2 border-gray-100 px-12 py-6 rounded-[24px] font-black uppercase tracking-widest hover:border-teal-600 transition-all"
              >
                 Explore Network
              </button>
           </div>
        </div>
     </div>
   )
}

