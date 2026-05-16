import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Search, 
  ShoppingBag, 
  ClipboardList, 
  Smartphone, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  AlertCircle, 
  Droplets, 
  Thermometer, 
  Activity, 
  Heart, 
  Sun, 
  Flame, 
  Shield,
  Stethoscope,
  ChevronRight,
  Sparkles,
  Pill,
  Syringe,
  Microscope,
  Star
} from "lucide-react"

export default function Medicines() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")

  const platforms = [
    {
      name: "1mg",
      tagline: "India's most trusted delivery",
      desc: "Order medicines, book lab tests, consult doctors online.",
      color: "bg-red-50/50 border-red-100",
      btnColor: "bg-red-600 hover:bg-red-700",
      textColor: "text-red-600",
      icon: ShoppingBag,
      url: "https://www.1mg.com",
      searchUrl: "https://www.1mg.com/search/all?name=",
      features: ["2hr delivery", "Home Lab tests", "Genuine meds"],
    },
    {
      name: "Netmeds",
      tagline: "India ki pharmacy",
      desc: "Prescription and OTC medicines delivered to your door.",
      color: "bg-blue-50/50 border-blue-100",
      btnColor: "bg-blue-600 hover:bg-blue-700",
      textColor: "text-blue-600",
      icon: Activity,
      url: "https://www.netmeds.com",
      searchUrl: "https://www.netmeds.com/catalogsearch/result?q=",
      features: ["25% discount", "PAN India", "Licensed pharmacists"],
    },
    {
      name: "PharmEasy",
      tagline: "Making health accessible",
      desc: "Order medicines and diagnostics with fast delivery.",
      color: "bg-teal-50/50 border-teal-100",
      btnColor: "bg-teal-600 hover:bg-teal-700",
      textColor: "text-teal-600",
      icon: Stethoscope,
      url: "https://pharmeasy.in",
      searchUrl: "https://pharmeasy.in/search/all?name=",
      features: ["Same day delivery", "Diagnostics", "Health packs"],
    },
  ]

  const commonMedicines = [
    { name: "Paracetamol",  use: "Fever & Pain",        icon: Thermometer, color: "text-orange-500", bg: "bg-orange-50" },
    { name: "ORS Sachets",  use: "Dehydration",         icon: Droplets,    color: "text-blue-500",   bg: "bg-blue-50" },
    { name: "Metformin",    use: "Diabetes",            icon: Activity,    color: "text-red-500",    bg: "bg-red-50" },
    { name: "Amlodipine",   use: "Blood Pressure",      icon: Heart,       color: "text-rose-500",   bg: "bg-rose-50" },
    { name: "Cetirizine",   use: "Allergy",             icon: Sun,         iconAlt: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-50" },
  ]

  const handleSearch = () => {
    if (searchTerm.trim()) {
      window.open("https://www.1mg.com/search/all?name=" + encodeURIComponent(searchTerm), "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* ── PREMIUM HERO SECTION ── */}
      <div className="bg-gray-900 pt-16 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/20 blur-[100px] rounded-full animate-glow"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full animate-drift"></div>
        
        {/* Floating Icons */}
        <Pill className="absolute top-32 left-10 text-white/5 w-24 h-24 float-1 -z-10" />
        <Syringe className="absolute top-60 right-20 text-white/5 w-32 h-32 float-2 -z-10" />
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/5 shadow-xl mb-8 group hover:scale-105 transition-transform duration-500">
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-teal-500/50">
              <Zap size={14} className="animate-pulse" />
            </div>
            <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Verified Marketplace</span>
            <div className="h-4 w-px bg-white/20 mx-2"></div>
            <span className="text-[10px] font-bold text-teal-400 uppercase">24hr Delivery</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
            The Smart <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">Pharmacy Network</span>
          </h1>
          
          <p className="text-gray-400 font-medium text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Compare live prices across India's top medical platforms. Secure authentic medicines with express delivery to <span className="text-white font-bold underline decoration-teal-400 underline-offset-8">Jharkhand</span>.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-20">

        {/* ── PREMIUM SEARCH BAR ── */}
        <div className="max-w-4xl mx-auto mb-24 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          <div className="bg-white/80 backdrop-blur-2xl rounded-[40px] p-4 md:p-6 border border-white shadow-[0_32px_64px_-16px_rgba(13,148,136,0.12)] group">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-focus-within:text-teal-600 transition-colors">
                  <Search size={24} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="What medicine are you looking for?"
                  className="w-full bg-transparent border-2 border-transparent px-8 py-6 pl-20 rounded-[32px] font-bold text-xl text-gray-800 focus:outline-none focus:border-teal-500/20 transition-all placeholder:text-gray-300"
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearch() }}
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-gray-900 text-white px-12 py-6 rounded-[32px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-gray-200 flex items-center justify-center gap-3 group/btn"
              >
                Find Best Price <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {searchTerm.trim() ? (
              <div className="mt-8 px-6 pb-4 flex flex-wrap gap-4 animate-in fade-in slide-in-from-top-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest w-full mb-2">Search results will open from:</p>
                {platforms.map((p) => (
                  <a
                    key={p.name}
                    href={p.searchUrl + encodeURIComponent(searchTerm)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-2xl border border-transparent text-[10px] font-black uppercase tracking-widest text-gray-600 hover:border-teal-400 hover:bg-white hover:text-teal-600 transition-all shadow-sm group/tag"
                  >
                    <p.icon size={16} className="opacity-40 group-hover/tag:opacity-100 transition-opacity" /> {p.name}
                  </a>
                ))}
              </div>
            ) : (
              <div className="mt-6 px-8 pb-2 flex items-center gap-4">
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 rounded-full">
                    <Sparkles size={12} className="text-teal-600" />
                    <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest">Universal Search</span>
                 </div>
                 <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Type to compare prices instantly</p>
              </div>
            )}
          </div>
        </div>

        {/* ── PLATFORM CARDS (Subtle Redesign) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {platforms.map((p, idx) => (
            <div 
              key={p.name} 
              className={`relative flex flex-col rounded-[48px] border-2 p-10 transition-all duration-700 hover:shadow-2xl hover:shadow-teal-900/5 group animate-in fade-in slide-up-delay-${idx+1} ${p.color}`}
            >
              <div className="flex items-center justify-between mb-10">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-gray-200/50 group-hover:rotate-6 transition-transform duration-500">
                  <p.icon size={32} className={p.textColor} />
                </div>
                <div className="text-right">
                  <h3 className={`font-black text-2xl tracking-tighter ${p.textColor}`}>{p.name}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">{p.tagline}</p>
                </div>
              </div>
              
              <p className="text-base font-medium text-gray-500 leading-relaxed mb-10 flex-1">{p.desc}</p>
              
              <div className="space-y-4 mb-12">
                {p.features.map((f) => (
                  <div key={f} className="flex items-center gap-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
                       <CheckCircle size={14} className="text-teal-500" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>

              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className={`w-full py-6 rounded-[32px] text-white font-black text-[12px] uppercase tracking-[0.2em] text-center transition-all shadow-xl flex items-center justify-center gap-3 ${p.btnColor} shadow-teal-900/5`}
              >
                Launch Store <ArrowRight size={18} />
              </a>
            </div>
          ))}
        </div>

        {/* ── ESSENTIALS SECTION (Modernized) ── */}
        <div className="bg-gray-900 rounded-[64px] p-12 md:p-20 mb-24 text-white relative overflow-hidden group/essentials">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
              <div className="space-y-4">
                <h2 className="text-[11px] font-black text-teal-400 uppercase tracking-[0.4em]">Essential Quick Search</h2>
                <h3 className="text-4xl font-black tracking-tight">Most Needed <span className="text-white/40 italic font-medium">Everyday</span></h3>
              </div>
              <div className="flex gap-2">
                 {[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-teal-500 rounded-full opacity-40"></div>)}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
              {commonMedicines.map((m) => (
                <button
                  key={m.name}
                  onClick={() => window.open("https://www.1mg.com/search/all?name=" + encodeURIComponent(m.name), "_blank")}
                  className="bg-white/5 border border-white/10 p-8 rounded-[40px] text-center hover:bg-white hover:text-gray-900 transition-all duration-700 group/med"
                >
                  <div className={`w-16 h-16 rounded-[24px] ${m.bg} ${m.color} flex items-center justify-center mx-auto mb-6 group-hover/med:scale-110 group-hover/med:rotate-3 transition-transform shadow-lg`}>
                    <m.icon size={32} />
                  </div>
                  <p className="font-black text-sm mb-1">{m.name}</p>
                  <p className="text-[10px] font-black opacity-40 uppercase tracking-tighter">{m.use}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-[48px] p-12 text-white shadow-2xl shadow-teal-900/20 relative overflow-hidden group/pres">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3"></div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[28px] flex items-center justify-center mb-10 shadow-inner">
                <ClipboardList size={40} className="text-white" />
              </div>
              <h2 className="text-4xl font-black mb-6 tracking-tight">Digital <br />Prescription</h2>
              <p className="text-teal-50/80 font-medium leading-relaxed mb-12 text-lg">
                Upload your medical records to your secure profile. Enable instant review for doctors during live consultations.
              </p>
              <button
                onClick={() => navigate("/profile")}
                className="mt-auto w-full bg-white text-teal-700 py-6 rounded-[32px] font-black text-sm uppercase tracking-[0.2em] hover:bg-teal-50 transition-all shadow-2xl shadow-teal-900/10 flex items-center justify-center gap-3"
              >
                Upload Record <Smartphone size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-50/50 backdrop-blur-sm rounded-[48px] p-10 border-2 border-gray-100 flex flex-col gap-8 group hover:border-teal-200 hover:bg-white transition-all duration-500">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center text-teal-600 shadow-xl shadow-gray-200 group-hover:scale-105 transition-transform">
                  <Activity size={40} />
                </div>
                <div>
                  <h3 className="font-black text-2xl text-gray-900 mb-1">AI Health Lab</h3>
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Smart Analysis Engine</p>
                </div>
              </div>
              <p className="text-gray-400 font-medium leading-relaxed">
                Connect your medical reports to our advanced Health AI. Get layman-friendly insights and personalized health recommendations instantly.
              </p>
              <button onClick={() => navigate("/ai-recommend")} className="flex items-center justify-between bg-white px-8 py-4 rounded-3xl border border-gray-100 group-hover:border-teal-100 transition-all">
                <span className="text-[11px] font-black text-gray-700 uppercase tracking-widest">Get Started</span>
                <div className="w-8 h-8 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 group-hover:translate-x-2 transition-transform">
                   <ChevronRight size={18} />
                </div>
              </button>
            </div>

            <div className="bg-gray-900 rounded-[48px] p-10 flex items-center gap-8 group hover:scale-[1.02] transition-all duration-500">
               <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center text-orange-400 border border-white/5">
                  <Shield size={40} />
               </div>
               <div>
                  <h3 className="font-black text-white text-xl mb-2">Verified Network</h3>
                  <p className="text-xs text-white/40 font-medium leading-relaxed">
                    100% Genuine medicines from licensed pharmacists across India.
                  </p>
                  <div className="flex gap-1 mt-4">
                     {[1,2,3,4,5].map(i => <Star key={i} size={10} className="text-orange-400 fill-current" />)}
                  </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}