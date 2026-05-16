import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { 
  Menu, 
  X, 
  MapPin, 
  Calendar, 
  Video, 
  Zap, 
  Smartphone, 
  Bell, 
  LogOut, 
  User, 
  LayoutDashboard,
  Sparkles
} from "lucide-react"
import { isAuthenticated, setRedirectPath } from "../utils/auth"

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const user  = JSON.parse(localStorage.getItem("user") || "{}")
  const isAuth = isAuthenticated()

  const handleLogout = () => {
    localStorage.removeItem("token"); localStorage.removeItem("user")
    navigate("/login"); setMenuOpen(false)
  }

  const navLinks = [
    { to: "/nearby",       label: "Nearby", icon: MapPin },
    { to: "/appointment",  label: "Book",   icon: Calendar },
    { to: "/video-consult",label: "Consult",icon: Video },
    { to: "/ai-recommend", label: "AI Labs", icon: Sparkles },
    { to: "/medicines",    label: "Pharmacy",icon: Smartphone },
    { to: "/ambulance",    label: "SOS",     icon: Bell, className: "text-red-600" },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center h-20">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setMenuOpen(false)}>
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-teal-100 group-hover:scale-105 transition-all">
              <img src="/logo.jpeg" alt="Svasthya Connect" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900 leading-none tracking-tight">Svasthya<span className="text-[#0d9488]">Connect</span></h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 hidden sm:block">Digital Health Network</p>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link 
                key={l.to} 
                to={l.to} 
                className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all hover:text-[#0d9488] ${
                  isActive(l.to) ? "text-[#0d9488]" : "text-gray-400"
                } ${l.className || ""}`}
              >
                <l.icon size={14} className={isActive(l.to) ? "animate-pulse" : ""} />
                {l.label}
              </Link>
            ))}
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden lg:flex items-center gap-6">
            {isAuth ? (
              <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
                <Link to="/dashboard" className="flex items-center gap-2 group">
                  <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-teal-50 group-hover:text-[#0d9488] transition-all border border-gray-100">
                    <LayoutDashboard size={18} />
                  </div>
                  <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200">
                  Join Network
                </button>
              </Link>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <div className="flex lg:hidden items-center gap-4">
            {isAuth && (
              <Link to="/dashboard" className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                <User size={18} />
              </Link>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-900">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 p-6 space-y-6 animate-in slide-in-from-top-4 duration-300 shadow-2xl">
          <div className="grid grid-cols-2 gap-4">
            {navLinks.map((l) => (
              <Link 
                key={l.to} 
                to={l.to} 
                onClick={() => setMenuOpen(false)}
                className={`flex flex-col items-center gap-3 p-6 rounded-3xl border border-gray-50 text-[10px] font-black uppercase tracking-widest transition-all ${
                  isActive(l.to) ? "bg-teal-50 text-[#0d9488] border-teal-100" : "bg-gray-50 text-gray-400"
                } ${l.className || ""}`}
              >
                <l.icon size={20} />
                {l.label}
              </Link>
            ))}
          </div>
          
          <div className="pt-6 border-t border-gray-100">
            {isAuth ? (
              <div className="flex flex-col gap-3">
                <Link 
                  to="/dashboard" 
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-3 bg-gray-900 text-white py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest"
                >
                  <LayoutDashboard size={18} /> My Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-3 bg-red-50 text-red-600 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center bg-[#0d9488] text-white py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest"
              >
                Login / Signup
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
