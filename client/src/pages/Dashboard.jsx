import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { 
  Calendar, 
  Video, 
  Upload, 
  Sparkles, 
  LogOut, 
  MapPin, 
  Mail, 
  Clock, 
  ChevronRight, 
  Plus, 
  Activity, 
  Stethoscope, 
  Search,
  Bell,
  User,
  Shield, 
  Smartphone, 
  Star,
  CheckCircle,
  XCircle
} from "lucide-react"
import { isAuthenticated, setRedirectPath } from "../utils/auth"

export default function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAppt, setSelectedAppt] = useState(null)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get("http://localhost:5000/api/appointments/my", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setAppointments(res.data)
      } catch (err) {
        console.error("Could not fetch appointments", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAppointments()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token"); localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="bg-white min-h-screen px-6 py-12 animate-in fade-in duration-700 relative">
      <div className="max-w-6xl mx-auto">

        {/* MODAL OVERLAY */}
        {selectedAppt && (() => {
          const isPast = selectedAppt.date < new Date().toISOString().split("T")[0];
          const displayStatus = isPast && selectedAppt.status !== 'cancelled' ? "completed" : selectedAppt.status;
          
          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
               <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setSelectedAppt(null)}></div>
               <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden border border-gray-100 animate-in zoom-in slide-in-from-bottom-8 duration-500">
                  <div className="bg-gray-900 p-8 text-white relative">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/20 blur-[50px] rounded-full"></div>
                     <button onClick={() => setSelectedAppt(null)} className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                        <Plus size={20} className="rotate-45" />
                     </button>
                     <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-teal-400">
                           <Stethoscope size={24} />
                        </div>
                        <div>
                           <h3 className="text-xl font-black">{selectedAppt.doctorName}</h3>
                           <p className="text-[10px] font-black uppercase tracking-widest text-teal-400">{selectedAppt.speciality}</p>
                        </div>
                     </div>
                  </div>

                  <div className="p-10 space-y-8">
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        <DetailItem icon={Calendar} label="Date" value={selectedAppt.date} />
                        <DetailItem icon={Clock} label="Time Slot" value={selectedAppt.time} />
                        <DetailItem icon={MapPin} label="Hospital" value={selectedAppt.hospital} />
                        <DetailItem icon={Activity} label="Consultation" value={selectedAppt.consultType} isCapitalize />
                        <DetailItem icon={User} label="Patient" value={selectedAppt.patientName} />
                        <DetailItem icon={Smartphone} label="Phone" value={selectedAppt.patientPhone} />
                     </div>

                     <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                           <div className="bg-teal-50 px-4 py-2 rounded-xl border border-teal-100">
                              <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Status: {displayStatus}</span>
                           </div>
                           <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fee: ₹{selectedAppt.fee}</span>
                           </div>
                        </div>
                        <button onClick={() => setSelectedAppt(null)} className="w-full md:w-auto bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[2px] hover:bg-black transition-all shadow-xl shadow-gray-100">
                           Close Details
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          )
        })()}

        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gray-900 rounded-[24px] flex items-center justify-center text-white shadow-2xl shadow-gray-200">
                <User size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">
                  Welcome, {user.name?.split(' ')[0] || "Patient"}
                </h1>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                    <MapPin size={14} className="text-indigo-600" /> {user.city || "Jharkhand"}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                    <Mail size={14} className="text-indigo-600" /> {user.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white border-2 border-gray-100 text-gray-900 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-red-400 hover:text-red-500 transition-all shadow-sm"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-12">
            
            {/* QUICK ACTIONS */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                  <Activity size={24} className="text-indigo-600" /> Health Services
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickCard icon={Calendar} title="Book Call" path="/appointment" color="bg-teal-50" text="text-indigo-600" />
                <QuickCard icon={Video} title="Video" path="/video-consult" color="bg-indigo-50" text="text-indigo-600" />
                <QuickCard icon={Sparkles} title="AI Recom" path="/ai-recommend" color="bg-purple-50" text="text-purple-600" />
                <QuickCard icon={Smartphone} title="Pharmacy" path="/medicines" color="bg-orange-50" text="text-orange-600" />
              </div>
            </div>

            {/* MY APPOINTMENTS */}
            <div className="bg-gray-50/50 rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-2xl shadow-gray-50">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                  <Clock size={24} className="text-indigo-600" /> My Appointments
                </h2>
                <Link to="/appointment" className="bg-indigo-600 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-teal-700 transition-all flex items-center gap-2">
                  <Plus size={14} /> New Booking
                </Link>
              </div>

              {loading ? (
                <div className="py-20 text-center">
                  <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Retrieving Data...</p>
                </div>
              ) : (
                <div className="space-y-12">
                  {/* PENDING / ACTIVE SECTION */}
                  {appointments.filter(a => {
                    const isPast = a.date < new Date().toISOString().split("T")[0];
                    return !isPast && (a.status === "pending" || a.status === "confirmed");
                  }).length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                         <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                         <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Sessions</h3>
                      </div>
                      {appointments
                        .filter(a => {
                          const isPast = a.date < new Date().toISOString().split("T")[0];
                          return !isPast && (a.status === "pending" || a.status === "confirmed");
                        })
                        .map((appt) => (
                          <AppointmentCard key={appt._id} appt={appt} onView={() => setSelectedAppt(appt)} />
                        ))}
                    </div>
                  )}

                  {/* COMPLETED / HISTORY SECTION */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                       <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Past Consultations</h3>
                    </div>
                    {appointments.filter(a => {
                      const isPast = a.date < new Date().toISOString().split("T")[0];
                      return isPast || a.status === "completed" || a.status === "cancelled";
                    }).length === 0 ? (
                      <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100 border-dashed">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                           <Calendar size={32} className="text-gray-200" />
                        </div>
                        <p className="text-gray-400 font-bold mb-8">No appointment history found</p>
                        {appointments.length === 0 && (
                          <Link to="/appointment" className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-100">
                            Schedule First Session
                          </Link>
                        )}
                      </div>
                    ) : (
                      appointments
                        .filter(a => {
                          const isPast = a.date < new Date().toISOString().split("T")[0];
                          return isPast || a.status === "completed" || a.status === "cancelled";
                        })
                        .map((appt) => (
                          <AppointmentCard key={appt._id} appt={appt} isPast={appt.date < new Date().toISOString().split("T")[0]} onView={() => setSelectedAppt(appt)} />
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* PATIENT PROFILE CARD */}
            <div className="bg-gray-900 rounded-[32px] p-8 text-white relative overflow-hidden group hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/20 blur-[50px] rounded-full"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <User size={20} className="text-teal-400" />
                    </div>
                    <h3 className="font-black text-sm uppercase tracking-widest">Medical Profile</h3>
                  </div>
                  <Link to="/profile" className="text-[10px] font-black text-teal-400 uppercase tracking-widest hover:text-white transition-colors">
                    Edit
                  </Link>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <ProfileItem label="Blood Group" value={user.bloodGroup || "—"} color="text-red-400" />
                    <ProfileItem label="Age" value={user.age ? `${user.age} Years` : "—"} color="text-indigo-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <ProfileItem label="Gender" value={user.gender || "—"} color="text-purple-400" />
                    <ProfileItem label="City" value={user.city || "—"} color="text-teal-400" />
                  </div>
                  <div className="pt-6 border-t border-white/5">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Address</p>
                    <p className="text-xs font-medium text-white/70 leading-relaxed line-clamp-2">
                      {user.address || "No address provided"}
                    </p>
                  </div>
                </div>

                <Link to="/profile">
                  <button className="w-full mt-8 bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[2px] transition-all border border-white/5">
                    View Full Records
                  </button>
                </Link>
              </div>
            </div>


            <div className="p-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-6 px-4">Search Services</h4>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Find specialist..."
                  className="w-full bg-gray-50 border-2 border-gray-50 px-6 py-4 rounded-2xl font-bold text-sm focus:outline-none focus:border-indigo-600 transition-all pl-12"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

function ProfileItem({ label, value, color }) {
  return (
    <div>
      <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-xs font-black ${color}`}>{value}</p>
    </div>
  )
}

function DetailItem({ icon: Icon, label, value, isCapitalize }) {
  return (
    <div className="flex flex-col gap-2 group">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
          <Icon size={14} />
        </div>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
      </div>
      <p className={`text-xs font-bold text-gray-900 ml-10 ${isCapitalize ? 'capitalize' : ''}`}>
        {value || "Not provided"}
      </p>
    </div>
  )
}

function QuickCard({ icon: Icon, title, path, color, text }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => {
        if (path === "/appointment" && !isAuthenticated()) {
          setRedirectPath("/appointment")
          navigate("/login", { state: { message: "Please login to continue booking" } })
        } else {
          navigate(path)
        }
      }}
      className={`${color} ${text} p-6 rounded-[32px] cursor-pointer hover:shadow-2xl transition-all group flex flex-col items-center text-center`}
    >
      <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={24} />
      </div>
      <h3 className="font-black text-[10px] uppercase tracking-widest">{title}</h3>
    </div>
  )
}

function AppointmentCard({ appt, isPast, onView }) {
  const navigate = useNavigate()
  const statusConfig = {
    pending:   "bg-orange-100 text-orange-600 border-orange-200",
    confirmed: "bg-indigo-100 text-indigo-600 border-teal-200",
    cancelled: "bg-red-100 text-red-600 border-red-200",
    completed: "bg-teal-100 text-teal-600 border-teal-200",
  }

  // If the date has passed, we visually treat it as completed
  const displayStatus = isPast && appt.status !== 'cancelled' ? "completed" : appt.status;

  return (
    <div className={`bg-white border-2 rounded-[32px] p-6 flex flex-col md:flex-row justify-between md:items-center gap-6 transition-all duration-500 group ${
      isPast 
        ? "border-gray-50 opacity-80 grayscale-[0.5] hover:grayscale-0 hover:opacity-100" 
        : "border-gray-50 hover:border-indigo-600 hover:shadow-xl"
    }`}>
      <div className="flex gap-5">
        <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center shadow-sm border transition-all duration-500 ${
          isPast 
            ? "bg-gray-50 text-gray-400 border-gray-100" 
            : "bg-gray-50 text-indigo-600 border-gray-50 group-hover:bg-indigo-600 group-hover:text-white"
        }`}>
          <Stethoscope size={28} />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className={`font-black text-lg leading-none ${isPast ? 'text-gray-500' : 'text-gray-900'}`}>
              {appt.doctorName || "Specialist Session"}
            </h3>
            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${statusConfig[displayStatus] || statusConfig.completed}`}>
              {displayStatus}
            </span>
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
            {appt.speciality} • {appt.hospital}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gray-500 font-bold text-[10px] uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-50">
              <Calendar size={12} className={isPast ? "text-gray-400" : "text-indigo-600"} />
              {new Date(appt.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </div>
            <div className="flex items-center gap-1.5 text-gray-500 font-bold text-[10px] uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-50">
              <Clock size={12} className={isPast ? "text-gray-400" : "text-indigo-600"} />
              {appt.time}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        {!isPast && (appt.status === 'pending' || appt.status === 'confirmed') && (
          <button 
            onClick={(e) => { e.stopPropagation(); navigate(`/cancel-booking/${appt._id}`); }}
            className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors bg-gray-50 px-6 py-3 rounded-2xl group-hover:bg-white border border-transparent group-hover:border-gray-100 group-hover:shadow-sm"
          >
            <XCircle size={14} /> Cancel
          </button>
        )}
        <button 
          onClick={onView}
          className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 px-6 py-3 rounded-2xl group-hover:bg-white border border-transparent group-hover:border-gray-100 group-hover:shadow-sm"
        >
          View Details <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
